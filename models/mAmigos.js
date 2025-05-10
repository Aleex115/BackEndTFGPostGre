import db from "../config/db.js";

let mAmigos = {
  create: async (dni) => {
    try {
      let fecha = new Date().toISOString().split("T")[0];

      let results = await db`
        INSERT INTO amigos (dni_persona1, dni_persona2, fecha_seguimiento)
        VALUES (${dni.dni}, ${dni.dniSession}, ${fecha})
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error following`,
      };
    }
  },
  delete: async (dni) => {
    try {
      let results1 = await db`
        DELETE FROM amigos 
        WHERE dni_persona1 = ${dni.dni} AND dni_persona2 = ${dni.dniSession};
      `;

      let results2 = await db`
        DELETE FROM amigos 
        WHERE dni_persona2 = ${dni.dni} AND dni_persona1 = ${dni.dniSession};
      `;
      console.log(dni);
      return { results1, results2 };
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error deleting following`,
      };
    }
  },
  getAll: async (dni) => {
    try {
      let results = await db`
        SELECT 
          u.dni, 
          u.username, 
          u.foto_perfil
        FROM usuarios u
        INNER JOIN amigos a 
          ON (a.dni_persona1 = ${dni} AND a.dni_persona2 = u.dni) 
          OR (a.dni_persona2 = ${dni} AND a.dni_persona1 = u.dni);
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error retrieving friends for dni ${dni}`,
      };
    }
  },
};

export default mAmigos;
