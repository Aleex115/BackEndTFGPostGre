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
  getAll: async (dni, type, read) => {
    try {
      let query = db`
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
      `;

      // Agregar filtros dinámicos
      if (type) {
        query = query.append(db` AND n.tipo = ${type}`);
      }
      if (read !== undefined) {
        query = query.append(db` AND n.leido = ${read}`);
      }

      query = query.append(db` ORDER BY n.fecha_creacion DESC LIMIT 50`);

      let results = await query;
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
