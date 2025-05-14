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
      let query = `
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
        WHERE n.id_persona = $1
      `;
      let params = [dni];

      let conditions = [];
      if (type) {
        conditions.push(`n.tipo = $${params.length + 1}`);
        params.push(type);
      }
      if (typeof read === "boolean") {
        conditions.push(`n.leido = $${params.length + 1}`);
        params.push(read);
      }

      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      query += " ORDER BY n.fecha_creacion DESC LIMIT 50";

      const results = await sql(query, params);

      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error retrieving notifications for dni ${dni}`,
      };
    }
  },
};

export default mNotificaciones;
