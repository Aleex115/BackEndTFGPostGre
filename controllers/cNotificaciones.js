import mNotificaciones from "../models/mNotificaciones.js";
import error from "../middlewares/error.js";

let cNotificaciones = {
  getAll: async (req, res) => {
    try {
      let dni = req.session.user.dni;

      if (!dni) {
        throw { status: 400, message: "DNI is required." };
      }

      let results = await mNotificaciones.getAll(dni);

      results = results.map((notification) => {
        let message;
        switch (notification.tipo) {
          case "follow":
            message = `${notification.username} started following you.`;
            break;
          case "unfollow":
            message = `${notification.username} stopped following you.`;
            break;
          case "requested":
            message = `${notification.username} sent you a friend request.`;
            break;
          case "unrequested":
            message = `${notification.username} removed their like from your post.`;
            break;
          case "like":
            message = `${notification.username} liked your post.`;
            break;
          case "dislike":
            message = `${notification.username} disliked your post.`;
            break;
          case "comment":
            message = `${notification.username} commented on your post.`;
            break;
          case "download":
            message = `${notification.username} downloaded your content.`;
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

  create: async (dni, tipo, id_publi) => {
    try {
      if (!dni || !tipo || !id_publi) {
        throw {
          status: 500,
          message: "All fields are required are required.",
        };
      }

      let result = await mNotificaciones.create(dni, tipo, id_publi);

      return result;
    } catch (err) {
      console.log(err);
      throw error;
    }
  },
};

export default cNotificaciones;
