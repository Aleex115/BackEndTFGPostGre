import db from "../config/db.js";

let mNotificaciones = {
  create: async (dni, tipo, id_publi, dniSession) => {
    try {
      let results = await db`
        INSERT INTO notificaciones (tipo, id_persona,id_publi, id_ejecutor )
        VALUES (${tipo}, ${dni}, ${id_publi}, ${dniSession} )
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error creating notification`,
      };
    }
  },
  marcarLeida: async (id) => {
    try {
      let results = await db`
        UPDATE notificaciones
        SET leido = true
        WHERE id = ${id}
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error updating notification as read`,
      };
    }
  },
  getAll: async (dni) => {
    try {
      let results = await db`
      SELECT 
        n.id,
        n.tipo,
        n.leido,
        n.fecha_creacion,
        n.id_ejecutor,
        u.username,
        u.foto_perfil,
        p.title,
        p.foto
      FROM notificaciones n
      INNER JOIN usuarios u 
        ON n.id_ejecutor = u.dni
      LEFT JOIN publicaciones p
        ON n.id_publi = p.id
      WHERE n.id_persona = ${dni}
      ORDER BY n.fecha_creacion DESC
      LIMIT 50;
    `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error retrieving notifications for dni ${dni}`,
      };
    }
  },
};

export default mNotificaciones;
