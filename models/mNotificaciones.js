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
      // Construir la consulta base
      let baseQuery = `
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

      // Acumular condiciones dinámicas
      let conditions = [];
      if (type) {
        conditions.push(`n.tipo = ${type}`);
      }
      if (read !== undefined) {
        conditions.push(`n.leido = ${read}`);
      }

      // Agregar las condiciones dinámicas a la consulta
      if (conditions.length > 0) {
        baseQuery += " AND " + conditions.join(" AND ");
      }

      // Agregar orden y límite
      baseQuery += " ORDER BY n.fecha_creacion DESC LIMIT 50";

      // Ejecutar la consulta
      let results = await db.raw(baseQuery);
      return results.rows;
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
