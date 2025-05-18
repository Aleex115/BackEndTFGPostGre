import bcrypt from "bcryptjs";
import error from "../middlewares/error.js";
import mUsuario from "../models/mUsuario.js";
import mPublicaciones from "../models/mPublicaciones.js";
import emailValidator from "../public/validators/emailValidator.js";
import dniValidator from "../public/validators/dniValidator.js";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import cloudinaryModule from "cloudinary";
import dotenv from "dotenv";

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
let url = "";

let obtenerId = (url) => {
  if (url) {
    let regex = /\/(?:v\d+\/)?([^\/]+\/[^\/]+)\.webp$/;
    let match = url.match(regex);
    let public_id = match ? match[1] : "";
    return public_id;
  }
};

let cUser = {
  login: async (req, res) => {
    try {
      let { username, pwd } = req.body;
      let results = await mUsuario.getOne(username);

      if (!username || !pwd) {
        throw { status: 400, message: "All fields are required." };
      }
      if (results.length === 0) {
        let err = {
          status: 403,
          message: `The user ${username} was not found in the database.`,
        };

        error.e403(req, res, err);
        return;
      }
      let user = results[0];
      let isMatch = await bcrypt.compare(pwd, user.pwd);

      if (!isMatch) {
        let err = {
          status: 403,
          message: "Incorrect password.",
        };

        error.e403(req, res, err);
        return;
      }
      req.session.user = user;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return error.e500(req, res, { message: "Failed to save session" });
        }
        console.log("Session saved:", req.sessionID, req.session.user);
        res.send(
          JSON.stringify({
            status: 200,
            message: "Session created successfully.",
            session: req.session.user,
          })
        );
      });
    } catch (err) {
      console.log(err);
      error.e500(req, res, err);
      return;
    }
  },

  signin: async (req, res) => {
    try {
      let { dni, email, username, pwd } = req.body;

      if (!dni || !username || !email || !pwd)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      if (!dniValidator(dni))
        throw {
          status: 400,
          message: `The DNI is not valid.`,
        };

      if (!emailValidator(email))
        throw {
          status: 400,
          message: `The email is not valid.`,
        };

      await mUsuario.create({ dni, email, username, pwd });

      res.send(
        JSON.stringify({ status: 200, message: "User created successfully." })
      );
    } catch (err) {
      if (err.status === 403) {
        error.e403(req, res, err);
      } else {
        error.e500(req, res, err);
      }
    }
  },
  logout: (req, res) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Error logging out." });
          }

          // Elimina la cookie del lado del cliente
          res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: false,
          });

          res.status(200).json({ message: "Logged out successfully." });
        });
      } else {
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          secure: false,
        });

        res.status(200).json({ message: "Logged out successfully." });
      }
    } catch (error) {
      console.log(error);
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: false,
      });
    }
  },
  updateProfile: [
    // Recogemos el archivo con name img
    upload.single("img"),
    async (req, res) => {
      try {
        let { username, descp, id_estadou, email } = req.body;
        console.log(req.body);
        let dni = req.session.user.dni;

        if (!username || !descp || !id_estadou || !email) {
          throw { status: 400, message: "All fields are required." };
        }
        if (req.file) {
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
            .webp({ quality: 30 })
            .toBuffer();

          // Enviamos el buffer a cloudinary para subirlo con unos ajustes personalizados
          let result = await new Promise((resolve) => {
            cloudinary.uploader
              .upload_stream({ folder: "test" }, (error, uploadResult) => {
                return resolve(uploadResult);
              })
              .end(webpBuffer);
          });

          url = result.secure_url;
        } else {
          url = req.session.user.foto_perfil;
        }

        await mUsuario.updateProfile({
          username,
          descp,
          id_estadou,
          url,
          email,
          dni,
        });

        // Si la url es distinta a la de la sesión quiere decir que se ha subida una foto nueva por lo que hay que borrar la antigua
        if (url !== req.session.user.foto_perfil) {
          cloudinary.uploader.destroy(obtenerId(req.session.user.foto_perfil));
        }

        req.session.user.username = username;
        req.session.user.id_estadou = id_estadou;
        req.session.user.descp = descp;
        req.session.user.email = email;
        req.session.user.foto_perfil = url;

        // Respuesta
        res.send({
          status: 200,
          message: "Profile updated successfully.",
        });
      } catch (err) {
        console.log(err);
        // Borro la imagen en caso de error
        if (url) {
          cloudinary.uploader.destroy(obtenerId(url));
        }
        if (err.status === 400) {
          return error.e400(req, res, err);
        } else if (err.status === 403) {
          error.e403(req, res, err);
        } else {
          error.e500(req, res, err);
        }
      }
    },
  ],

  updatePwd: async (req, res) => {
    try {
      let { newPwd, oldPwd } = req.body;

      if (!newPwd || !oldPwd) {
        throw { status: 400, message: "All fields are required." };
      }
      let user = req.session.user;

      let username = user.username;
      let isMatch = await bcrypt.compare(oldPwd, user.pwd);

      if (!isMatch) {
        let err = {
          status: 403,
          message: "Incorrect password.",
        };

        error.e403(req, res, err);
        return;
      }
      await mUsuario.updatePwd({ username, newPwd });
      res.send(
        JSON.stringify({
          status: 200,
          message: "Password updated successfully.",
        })
      );

      return;
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
      return;
    }
  },

  session: (req, res) => {
    console.log(req.session);
    try {
      if (req.session.user) {
        res.send(
          JSON.stringify({
            status: 200,
            message: "There is an active session.",
          })
        );
      } else {
        throw {
          status: 401,
          message: "There is no active session.",
        };
      }
    } catch (err) {
      if (err.status === 400) {
        err.e400(req, res, err);
      } else {
        err.e500(req, res, err);
      }
      return;
    }
  },
  getAll: async (req, res) => {
    try {
      let username = req.query.username;
      let userSession = req.session.user.dni;
      let results = await mUsuario.getAll(username, userSession);
      res.send(
        JSON.stringify({
          status: 200,
          message: "Users retrieved successfully.",
          users: results,
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
  getOne: async (req, res) => {
    try {
      let { username } = req.query;
      if (!username) {
        username = req.session.user.username;
      }
      let dni = req.session.user.dni;
      let user = await mUsuario.getOne(username, dni);
      res.send(
        JSON.stringify({
          status: 200,
          message: "User retrieved successfully.",
          user: {
            dni: user[0].dni,
            id_estadou: user[0].id_estadou,
            username: user[0].username,
            email: user[0].email,
            foto_perfil: user[0].foto_perfil,
            descp: user[0].descp,
            fotos: user[0].fotos,
            amigos: user[0].amigos,
            es_amigo: user[0].es_amigo,
            peticion: user[0].peticion,
          },
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
  delete: async (req, res) => {
    try {
      let dni = req.session.user.dni;

      let public_id = req.session.user.foto_perfil;
      public_id = obtenerId(public_id);
      if (!dni)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      let publi = await mPublicaciones.getAllFromUser(dni);
      publi.forEach(async (el) => {
        await mPublicaciones.delete(dni, el.id);
        cloudinary.uploader.destroy(obtenerId(el.foto));
      });
      if (public_id) {
        cloudinary.uploader.destroy(public_id);
      }
      await mUsuario.delete(dni);
      cUser.logout();

      res.send(
        JSON.stringify({
          status: 200,
          message: "User deleted successfully.",
        })
      );
      return;
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
      return;
    }
  },
};

export default cUser;
