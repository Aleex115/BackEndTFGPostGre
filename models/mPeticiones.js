import db from "../config/db.js";

let mPeticiones = {
  create: async (dni) => {
    try {
      let results = await db`
        INSERT INTO peticiones (dni_persona1, dni_persona2)
        VALUES (${dni.dni}, ${dni.dniSession})
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      console.log(err);
      throw {
        status: 500,
        message: `Error sending petition`,
      };
    }
  },
  delete: async (dni) => {
    try {
      let results1 = await db`
        DELETE FROM peticiones 
        WHERE dni_persona1 = ${dni.dniSession} AND dni_persona2 = ${dni.dni};
      `;
      let results2 = await db`
        DELETE FROM peticiones 
        WHERE dni_persona2 = ${dni.dniSession} AND dni_persona1 = ${dni.dni};
      `;

      return { results1, results2 };
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error deleting petition`,
      };
    }
  },
  getUserPetitions: async (dni) => {
    try {
      let results = await db`
        SELECT 
          u.username, 
          u.foto_perfil, 
          u.descp,
          u.id_estadou,
          u.dni, 
          p.dni_persona1 AS dni_session  
        FROM peticiones p  
        JOIN usuarios u ON p.dni_persona2 = u.dni 
        WHERE p.dni_persona1 = ${dni}
        LIMIT 50;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error getting petitions`,
      };
    }
  },
};

export default mPeticiones;
