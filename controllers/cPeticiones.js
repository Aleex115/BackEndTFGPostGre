import error from "../middlewares/error.js";
import mPeticiones from "../models/mPeticiones.js";
import mAmigos from "../models/mAmigos.js";
import cNotificaciones from "./cNotificaciones.js";

let cPetition = {
  create: async (req, res) => {
    try {
      let { dni } = req.body;
      let dniSession = req.session.user.dni;

      if (!dni || !dniSession)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mPeticiones.create({ dni, dniSession });
      await cNotificaciones.create(dniSession, "requested");

      res.send(
        JSON.stringify({
          status: 200,
          message: "The petition has been sent successfully.",
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

      await mPeticiones.delete({ dni, dniSession });
      await cNotificaciones.create(dniSession, "unrequested");

      res.send(
        JSON.stringify({
          status: 200,
          message: "The petition has been deleted successfully.",
        })
      );
      return;
    } catch (err) {
      console.log(err);
      error.e500(req, res, err);
      return;
    }
  },
  getAllUser: async (req, res) => {
    try {
      let dni = req.session.user.dni;

      if (!dni)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      let results = await mPeticiones.getUserPetitions(dni);

      res.send(
        JSON.stringify({
          status: 200,
          message: "The petitions have been retrieved successfully.",
          total: results,
        })
      );
      return;
    } catch (err) {
      error.e500(req, res, err);
      return;
    }
  },

  accept: async (req, res) => {
    try {
      let { dni } = req.body;

      let dniSession = req.session.user.dni;
      console.log(dni, dniSession);

      if (!dni || !dniSession)
        throw {
          status: 400,
          message: `All fields are required.`,
        };

      await mPeticiones.delete({ dni, dniSession });
      await mAmigos.create({ dni, dniSession });
      console.log("bien");
      res.send(
        JSON.stringify({
          status: 200,
          message: "The request has been accepted successfully.",
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

export default cPetition;
