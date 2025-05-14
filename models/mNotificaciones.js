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
      const conditions = [db`n.id_persona = ${dni}`];

      if (type !== undefined && type !== null) {
        conditions.push(db`n.tipo = ${type}`);
      }
      if (read) {
        // 'read' aquí debe ser booleano o 0/1
        conditions.push(db`n.leido = ${read}`);
      }

      // Damos formato a la cláusula WHERE uniendo con AND
      // Empezamos por la primera condición
      let whereClause = conditions.shift();
      for (const cond of conditions) {
        whereClause = db`${whereClause} AND ${cond}`;
      }

      // Ejecutamos la consulta completa
      const notifications = await db`
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
        WHERE ${whereClause}
        ORDER BY n.fecha_creacion DESC
        LIMIT 50
      `;

      return notifications; // Neon ya devuelve un array de filas
    } catch (err) {
      console.error("Error retrieving notifications:", err);
      throw {
        status: 500,
        message: `Error retrieving notifications for dni ${dni}`,
      };
    }
  },
};

export default mNotificaciones;
