import mNotificaciones from "../models/mNotificaciones.js";
import error from "../middlewares/error.js";

let cNotificaciones = {
  getAll: async (req, res) => {
    try {
      let dni = req.session.user.dni;
      let { type, read } = req.query;

      if (!dni) {
        throw { status: 400, message: "DNI is required." };
      }

      let results = await mNotificaciones.getAll(dni, type, read);

      results = results.map((notification) => {
        let message;
        switch (notification.tipo) {
          case "follow":
            message = `is now your friend.`;
            break;
          case "unfollow":
            message = `is no longer you friend.`;
            break;
          case "requested":
            message = `sent you a friend request.`;
            break;
          case "unrequested":
            message = `declined your petition.`;
            break;
          case "like":
            message = `liked your post: "${notification.title}".`;
            break;
          case "dislike":
            message = `disliked your post: "${notification.title}".`;
            break;
          case "comment":
            message = `commented on your post: "${notification.title}".`;
            break;
          case "download":
            message = `downloaded your content: "${notification.title}".`;
            break;
          default:
            message = `You have a new notification.`;
        }
        return { ...notification, message };
      });

      res.send(
        JSON.stringify({
          status: 200,
          message: "Notifications retrieved successfully.",
          notifications: results,
        })
      );
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
    }
  },

  marcarLeida: async (req, res) => {
    try {
      let { id } = req.body;

      if (!id) {
        throw { status: 400, message: "Notification ID is required." };
      }

      let result = await mNotificaciones.marcarLeida(id);

      res.send(
        JSON.stringify({
          status: 200,
          message: "Notification marked as read successfully.",
          notification: result,
        })
      );
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        error.e400(req, res, err);
      } else {
        error.e500(req, res, err);
      }
    }
  },

  create: async (req, dni, tipo, id_publi) => {
    try {
      console.log(dni, tipo);
      if (!dni || !tipo) {
        throw {
          status: 500,
          message: "All fields are required are required.",
        };
      }
      let dniSession = req.session.user.dni;

      if (dni != dniSession) {
        let result = await mNotificaciones.create(
          dni,
          tipo,
          id_publi,
          dniSession
        );

        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw error;
    }
  },
};

export default cNotificaciones;
