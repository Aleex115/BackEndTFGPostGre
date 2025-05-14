import db from "../config/db.js";

let mPublicaciones = {
  create: async (publi) => {
    try {
      let fecha = new Date().toISOString().split("T")[0];
      let results = await db`
        INSERT INTO publicaciones (dni_persona, title, foto, descp, fecha_creacion)
        VALUES (${publi.dni}, ${publi.title}, ${publi.url}, ${publi.descp}, ${fecha})
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error uploading the photo ${publi.title}`,
      };
    }
  },

  getAllFromUserPaginated: async (username, limit, offset, filter) => {
    try {
      let results = await db`
        SELECT 
          p.title, 
          p.foto, 
          p.descp, 
          p.fecha_creacion, 
          p.id, 
          p.dni_persona,
          u.foto_perfil,
          u.username,
          EXISTS (
            SELECT 1 
            FROM darlike d 
            JOIN usuarios u2 ON d.dni_persona = u2.dni 
            WHERE u2.username = ${
              username.usernameSession
            } AND d.id_publi = p.id
          ) AS "hasLiked"
        FROM publicaciones p 
        JOIN usuarios u ON p.dni_persona = u.dni 
        WHERE u.username LIKE ${username.username} AND 
        (p.title ILIKE ${"%" + filter + "%"} OR 
        p.descp ILIKE ${"%" + filter + "%"})
        ORDER BY p.id DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error getting the photos of ${username}`,
      };
    }
  },
  getAllFromUser: async (dni) => {
    try {
      let results = await db`
        SELECT 
          p.title, 
          p.foto, 
          p.descp, 
          p.fecha_creacion, 
          p.id, 
        FROM publicaciones p 
        WHERE p.dni_persona LIKE ${dni}
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error getting the photos of ${dni}`,
      };
    }
  },
  getAllFromPaginated: async (limit, offset, filter) => {
    try {
      let results = await db`
        SELECT 
          p.title, 
          p.foto, 
          p.descp, 
          p.fecha_creacion, 
          p.id,
          p.dni_persona,
          u.foto_perfil,
          u.username,
          EXISTS (
            SELECT 1 
            FROM darlike d 
            WHERE d.id_publi = p.id
          ) AS "hasLiked"
        FROM publicaciones p 
        JOIN usuarios u ON p.dni_persona = u.dni 
        WHERE u.id_estadou = 0 AND 
        (p.title ILIKE ${"%" + filter + "%"} OR 
        p.descp ILIKE ${"%" + filter + "%"})
        ORDER BY p.id DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error getting public photos`,
      };
    }
  },

  countByUsername: async (username, filter) => {
    try {
      let results = await db`
        SELECT COUNT(*) AS total 
        FROM publicaciones p 
        JOIN usuarios u ON p.dni_persona = u.dni 
        WHERE u.username LIKE ${username} AND 
        (p.title ILIKE ${"%" + filter + "%"} OR 
        p.descp ILIKE ${"%" + filter + "%"});
      `;
      return results[0].total;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error counting the photos of ${username}`,
      };
    }
  },
  countPublic: async (filter) => {
    try {
      let results = await db`
        SELECT COUNT(*) AS total 
        FROM publicaciones p 
        JOIN usuarios u ON p.dni_persona = u.dni  
        WHERE u.id_estadou = 0 AND 
        (p.title ILIKE ${"%" + filter + "%"} OR 
        p.descp ILIKE ${"%" + filter + "%"});
      `;
      return results[0].total;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error counting public photos`,
      };
    }
  },
  delete: async (dni, id) => {
    try {
      let results = await db`
        DELETE FROM publicaciones 
        WHERE id = ${id} AND dni_persona = ${dni};
      `;
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error deleting the photo`,
      };
    }
  },
};

export default mPublicaciones;
