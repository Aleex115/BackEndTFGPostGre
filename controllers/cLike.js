import error from "../middlewares/error.js";
import mLike from "../models/mLike.js";
import cNotificaciones from "./cNotificaciones.js";

let cLike = {
  create: async (req, res) => {
    try {
      let { dni, id, dniPublication } = req.body;

      if (!dni) {
        dni = req.session.user.dni;
      }
      if (!dni || !id)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mLike.create({ dni, id });
      await cNotificaciones.create(req, dniPublication, "like", id);

      res.send(
        JSON.stringify({
          status: 200,
          message: "The like has been added successfully.",
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
      let { dni, id, dniPublication } = req.query;

      if (!dni) {
        dni = req.session.user.dni;
      }
      if (!dni || !id)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mLike.delete({ dni, id });
      await cNotificaciones.create(req, dniPublication, "dislike", id);

      res.send(
        JSON.stringify({
          status: 200,
          message: "The like has been removed successfully.",
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

      if (!id)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      let results = await mLike.getAllFromPubli(id);

      res.send(
        JSON.stringify({
          status: 200,
          message: "Likes retrieved successfully.",
          total: results,
        })
      );
      return;
    } catch (err) {
      error.e500(req, res, err);
      return;
    }
  },
};

export default cLike;
