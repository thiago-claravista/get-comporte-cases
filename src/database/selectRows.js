const { getConnection } = require("./connection");

const selectRows = async (tableName, conditions, limit, page) => {
  const connection = await getConnection();
  const query = `SELECT * FROM ${tableName} ${
    conditions ? `WHERE ${conditions}` : ""
  } LIMIT ${limit * (page - 1)}, ${limit};`;

  try {
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    throw {
      ...error,
      description: `Erro ao consultar registros na tabela '${tableName}'!`,
    };
  }
};

module.exports = selectRows;
