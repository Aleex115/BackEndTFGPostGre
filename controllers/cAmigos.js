import error from "../middlewares/error.js";
import mAmigos from "../models/mAmigos.js";
import cNotificaciones from "./cNotificaciones.js";

let cAmigos = {
  create: async (req, res) => {
    try {
      let { dni } = req.body;
      let dniSession = req.session.user.dni;

      if (!dni || !dniSession)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mAmigos.create({ dni, dniSession });
      await cNotificaciones.create(req, dni, "follow");

      res.send(
        JSON.stringify({
          status: 200,
          message: "The user has been followed successfully.",
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
      let { dni } = req.query;

      let dniSession = req.session.user.dni;
      console.log(dni, dniSession);

      if (!dni || !dniSession)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mAmigos.delete({ dni, dniSession });
      await cNotificaciones.create(req, dni, "unfollow");

      res.send(
        JSON.stringify({
          status: 200,
          message: "The user has been unfollowed successfully.",
        })
      );
      return;
    } catch (err) {
      console.log(err);
      error.e500(req, res, err);
      return;
    }
  },
  getAll: async (req, res) => {
    try {
      let dni = req.session.user.dni;
      console.log(dni);

      if (!dni)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      let result = await mAmigos.getAll(dni);

      res.send(
        JSON.stringify({
          status: 200,
          message: "Friends retrieved successfully.",
          result,
        })
      );
      return;
    } catch (err) {
      console.log(err);
      error.e500(req, res, err);
      return;
    }
  },
};

export default cAmigos;
