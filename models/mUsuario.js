import bcrypt from "bcryptjs";

import db from "../config/db.js";
import usuarioE from "../public/estados/eUsuarios.js";

let mUsario = {
  create: async (user) => {
    try {
      let fecha = new Date().toISOString().split("T")[0];
      let hash = await bcrypt.hash(user.pwd, 10);
      let results = await db`
        INSERT INTO usuarios (dni, id_estadou, username, email, pwd, fecha_creacion)
        VALUES (${user.dni}, ${usuarioE.privado}, ${user.username}, ${user.email}, ${hash}, ${fecha})
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      if (err.code === "23505") {
        throw {
          status: 403,
          message: `A user with these details already exists`,
        };
      } else {
        throw {
          status: 500,
          message: `Error creating user ${user.username}`,
        };
      }
    }
  },
  getOne: async (username, dni) => {
    try {
      let consulta = `
        SELECT 
          u.dni,
          u.id_estadou,
          u.username,
          u.email,
          u.foto_perfil,
          u.descp,
          u.pwd,
          (
            SELECT COUNT(*) 
            FROM amigos a 
            WHERE 
              (a.dni_persona1 = $1 AND a.dni_persona2 = u.dni) OR 
              (a.dni_persona2 = $1 AND a.dni_persona1 = u.dni)
          ) AS es_amigo,
          (
            SELECT COUNT(*) 
            FROM peticiones a 
            WHERE 
              (a.dni_persona1 = $1 AND a.dni_persona2 = u.dni) OR 
              (a.dni_persona2 = $1 AND a.dni_persona1 = u.dni)
          ) AS peticion,
          COALESCE(pub.total_fotos, 0) AS fotos,
          COALESCE(ami.total_amigos, 0) AS amigos
        FROM usuarios u
        LEFT JOIN (
          SELECT 
            p.persona_dni, 
            COUNT(*) AS total_fotos
          FROM publicaciones p
          GROUP BY p.persona_dni
        ) pub ON pub.persona_dni = u.dni
        LEFT JOIN (
          SELECT 
            s.dni,
            COUNT(*) AS total_amigos
          FROM (
              SELECT dni_persona1 AS dni FROM amigos
              UNION ALL
              SELECT dni_persona2 AS dni FROM amigos
          ) s
          GROUP BY s.dni
        ) ami ON ami.dni = u.dni 
        WHERE username = $2;
      `;
      let results = await db.query(consulta, [dni, username]);
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error retrieving user ${username}`,
      };
    }
  },
  getAll: async (username, dniSession) => {
    try {
      let consulta = `
        SELECT 
          u.username, 
          u.foto_perfil, 
          u.descp,
          u.id_estadou,
          u.dni,
          (
            SELECT COUNT(*) 
            FROM amigos a 
            WHERE 
              (a.dni_persona1 = $1 AND a.dni_persona2 = u.dni) OR 
              (a.dni_persona2 = $1 AND a.dni_persona1 = u.dni)
          ) AS es_amigo,
          (
            SELECT COUNT(*) 
            FROM peticiones a 
            WHERE 
              (a.dni_persona1 = $1 AND a.dni_persona2 = u.dni) OR 
              (a.dni_persona2 = $1 AND a.dni_persona1 = u.dni)
          ) AS peticion
        FROM usuarios u
        WHERE u.dni != $1 AND u.username LIKE $2
        LIMIT 50;
      `;
      let results = await db.query(consulta, [dniSession, `%${username}%`]);
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error retrieving users matching ${username}`,
      };
    }
  },
  getPassword: async (username) => {
    try {
      let results = await db`
        SELECT pwd FROM usuarios WHERE username = ${username};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error retrieving the password for user ${username}`,
      };
    }
  },
  updatePwd: async (user) => {
    try {
      let hash = await bcrypt.hash(user.newPwd, 10);
      let results = await db`
        UPDATE usuarios 
        SET pwd = ${hash} 
        WHERE username = ${user.username};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error updating the password for ${user.username}`,
      };
    }
  },
  updateProfile: async (user) => {
    try {
      let results = await db`
        UPDATE usuarios 
        SET username = ${user.username}, 
            descp = ${user.descp}, 
            id_estadou = ${user.id_estadou}, 
            foto_perfil = ${user.url}, 
            email = ${user.email} 
        WHERE dni = ${user.dni};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error updating the profile data for ${user.username}`,
      };
    }
  },
  delete: async (dni) => {
    try {
      let results = await db`
        DELETE FROM usuarios 
        WHERE dni = ${dni};
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error deleting the user`,
      };
    }
  },
};

export default mUsario;
