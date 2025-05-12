import db from "../config/db.js";

let mLike = {
  create: async (like) => {
    try {
      console.log("like:", like);
      let results = await db`
        INSERT INTO darlike (dni_persona, id_publi)
        VALUES (${like.dni}, ${like.id})
        RETURNING *;
      `;
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        mensaje: `Error giving like`,
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
      console.log(err);
      throw {
        status: 500,
        mensaje: `Error deleting like`,
      };
    }
  },
  getAllFromPubli: async (id) => {
    try {
      let results = await db`
        SELECT COUNT(*) AS total 
        FROM darlike 
        WHERE id_publi = ${id};
      `;
      return results[0].total;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        mensaje: `Error counting like`,
      };
    }
  },
};

export default mLike;
