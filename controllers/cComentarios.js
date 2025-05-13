import error from "../middlewares/error.js";
import mComentarios from "../models/mComentarios.js";
import cNotificaciones from "./cNotificaciones.js";

let cComentarios = {
  create: async (req, res) => {
    try {
      let { dni, id, com } = req.body;
      console.log(dni, id, com);

      if (!dni) {
        dni = req.session.user.dni;
      }
      if (!dni || !id || !com)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mComentarios.create({ dni, id, com });
      await cNotificaciones.create(dni, "comment");

      res.send(
        JSON.stringify({
          status: 200,
          message: "The comment has been added successfully.",
        })
      );
      return;
    } catch (err) {
      console.log(err);
      error.e500(req, res, err);
      return;
    }
  },
  delete: async (req, res) => {
    try {
      let { dni, id } = req.query;

      if (!dni) {
        dni = req.session.user.dni;
      }
      if (!dni || !id)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mComentarios.delete({ dni, id });

      res.send(
        JSON.stringify({
          status: 200,
          message: "The comment has been deleted successfully.",
        })
      );
      return;
    } catch (err) {
      error.e500(req, res, err);
      return;
    }
  },
  getAllFromPubli: async (req, res) => {
    try {
      let id = req.query.id;
      let dni = req.session.user.dni;
      console.log(dni);

      if (!id)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      let results = await mComentarios.getAllFromPubli(id, dni);

      res.send(
        JSON.stringify({
          status: 200,
          message: "Comments retrieved successfully.",
          comments: results,
        })
      );
      return;
    } catch (err) {
      error.e500(req, res, err);
      return;
    }
  },
};

export default cComentarios;
