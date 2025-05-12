import db from "../config/db.js";

let mComentarios = {
  create: async (com) => {
    try {
      let fecha = new Date().toISOString().split("T")[0];
      let results = await db`
        INSERT INTO comentarios (dni_persona, id_publi, comentario, fecha_creacion)
        VALUES (${com.dni}, ${com.id}, ${com.com}, ${fecha})
        ON CONFLICT (dni_persona, id_publi) 
        DO UPDATE SET comentario = ${com.com}, fecha_creacion = ${fecha}
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.error(err);
      throw {
        status: 500,
        mensaje: "Error commenting",
      };
    }
  },

  delete: async (like) => {
    try {
      let results = await db`
        DELETE FROM darlike 
        WHERE dni_persona = ${like.dni} AND id_publi = ${like.id};
      `;
      return results;
    } catch (err) {
      console.error(err);
      throw {
        status: 500,
        mensaje: "Error deleting like",
      };
    }
  },

  getAllFromPubli: async (id, dni) => {
    try {
      let results = await db`
        SELECT u.foto_perfil, u.username, c.comentario, c.fecha_creacion,u.id_estadou,
        (
            SELECT COUNT(*) 
            FROM amigos a 
            WHERE 
              (a.dni_persona1 = ${dni} AND a.dni_persona2 = u.dni) OR 
              (a.dni_persona2 = ${dni} AND a.dni_persona1 = u.dni)
          ) AS es_amigo 
        FROM comentarios c
        JOIN usuarios u ON c.dni_persona = u.dni 
        WHERE c.id_publi = ${id};
      `;
      return results;
    } catch (err) {
      console.error(err);
      throw {
        status: 500,
        mensaje: "Error getting comments",
      };
    }
  },
};

export default mComentarios;
