import error from "../middlewares/error.js";
import mPublicaciones from "../models/mPublicaciones.js";
import fetch from "node-fetch";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import cloudinaryModule from "cloudinary";
import dotenv from "dotenv";
import cNotificaciones from "./cNotificaciones.js";

dotenv.config();

let cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usamos storage en memoria para evitar archivos temporales bloqueados, estos archivos se van a guardar en la ram y cuando se envíe la petición se borraran
let storage = multer.memoryStorage();
let upload = multer({ storage });

let obtenerId = (url) => {
  if (url) {
    let regex = /\/(?:v\d+\/)?([^\/]+\/[^\/]+)\.webp$/;
    let match = url.match(regex);
    let public_id = match ? match[1] : "";
    return public_id;
  }
};
let public_id;
let cPublicaciones = {
  create: [
    // Recogemos el archivo con name img , se va a guardar en req.file
    upload.single("img"),
    async (req, res) => {
      try {
        let { title, descp } = req.body;
        console.log(req.file);
        if (!title || !descp || !req.file) {
          throw { status: 400, message: "All fields are required." };
        }

        // Verificamos la extensión de la imagen
        let extension = path.extname(req.file.originalname).toLowerCase();
        let validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

        if (!validExtensions.includes(extension)) {
          throw {
            status: 400,
            message: `Unsupported file format. Allowed extensions: ${validExtensions.join(
              ", "
            )}`,
          };
        }

        // Procesar imagen a WebP, le bajamos la calidad para ocupar menos espacio, en memoria
        let webpBuffer = await sharp(req.file.buffer)
          .webp({ quality: 95 })
          .toBuffer();

        // Enviamos el buffer a cloudinary para subirlo con unos ajustes personalizados
        let result = await new Promise((resolve) => {
          cloudinary.uploader
            .upload_stream({ folder: "test" }, (error, uploadResult) => {
              return resolve(uploadResult);
            })
            .end(webpBuffer);
        });
        public_id = result.public_id;

        await mPublicaciones.create({
          title,
          descp,
          url: result.secure_url,
          dni: req.session.user.dni,
        });

        // Respuesta
        res.send({
          status: 200,
          message: "The publication has been created successfully.",
        });
      } catch (err) {
        console.error(err);
        // Borro la imagen en caso de error
        cloudinary.uploader.destroy(public_id);
        if (err.status === 400) {
          return error.e400(req, res, err);
        }
        return error.e500(req, res, err);
      }
    },
  ],
  getAllFromUser: async (req, res) => {
    try {
      let username = req.query.username || req.session.user.username;
      let usernameSession = req.session.user.username;
      let filter = req.query.filter || "";

      let limit = 9;
      let offset = parseInt(req.query.offset);
      console.log(req.query.username);
      let totalPublicaciones = await mPublicaciones.countByUsername(
        username,
        filter
      );

      if (offset >= totalPublicaciones) {
        res.send(
          JSON.stringify({
            status: 200,
            message: "There are no more photos to display.",
            total: totalPublicaciones,
          })
        );
        return;
      }
      // Obtener publicaciones con paginación
      let publicaciones = await mPublicaciones.getAllFromUserPaginated(
        { username, usernameSession },
        limit,
        offset,
        filter
      );

      res.send(
        JSON.stringify({
          status: 200,
          message: "Publications retrieved successfully.",
          publicaciones,
          total: totalPublicaciones,
        })
      );
    } catch (err) {
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
    }
  },
  getAllPublic: async (req, res) => {
    try {
      let limit = 9;
      let offset = parseInt(req.query.offset) || 0;
      let filter = req.query.filter || "";

      let totalPublicaciones = await mPublicaciones.countPublic(filter);

      if (offset >= totalPublicaciones) {
        res.send(
          JSON.stringify({
            status: 200,
            message: "There are no more photos to display.",
            total: totalPublicaciones,
          })
        );
        return;
      }
      let publicaciones = await mPublicaciones.getAllFromPaginated(
        limit,
        offset,
        filter
      );

      res.send(
        JSON.stringify({
          status: 200,
          message: "Publications retrieved successfully.",
          publicaciones,
          total: totalPublicaciones,
        })
      );
    } catch (err) {
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
    }
  },
  delete: async (req, res) => {
    try {
      let { dni, id, url } = req.query;

      if (!dni) {
        dni = req.session.user.dni;
      }
      if (!dni || !id || !url)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mPublicaciones.delete(dni, id);
      cloudinary.uploader.destroy(obtenerId(url));

      res.send(
        JSON.stringify({
          status: 200,
          message: "The publication has been deleted successfully.",
        })
      );
      return;
    } catch (err) {
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
      return;
    }
  },
  download: async (req, res) => {
    try {
      let { url, format, quality, dniPublication, id_publi } = req.query;
      if (!url || !dniPublication || !id_publi)
        throw {
          status: 400,
          message: `All fields are required.`,
        };
      url = decodeURIComponent(url);
      quality = quality || 100;

      let response = await fetch(url);
      let arrayBuffer = await response.arrayBuffer();
      // Lo convierto del objeto nativo de js para tratar buffer
      let buffer = Buffer.from(arrayBuffer);

      switch (format.toLowerCase()) {
        case "jpg":
          buffer = await sharp(buffer)
            .jpeg({ quality: parseInt(quality) })
            .toBuffer();
          res.setHeader("Content-Type", "image/jpeg");
          break;

        case "png":
          buffer = await sharp(buffer)
            .png({ quality: parseInt(quality) })
            .toBuffer();
          res.setHeader("Content-Type", "image/png");
          break;

        case "webp":
          buffer = await sharp(buffer)
            .webp({ quality: parseInt(quality) })
            .toBuffer();
          res.setHeader("Content-Type", "image/webp");
          break;

        default:
          throw {
            status: 400,
            message: `Unsupported format. Use 'jpg', 'png', or 'webp'.`,
          };
      }
      await cNotificaciones.create(req, dniPublication, "download", id_publi);

      // Configuro encabezados para la descarga
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=image.${format}`
      );
      res.send(buffer);
      return;
    } catch (err) {
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
      return;
    }
  },
};

export default cPublicaciones;
