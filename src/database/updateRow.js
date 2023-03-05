const { getConnection } = require("./connection");

const updateRow = async (tableName, id, data) => {
  const connection = await getConnection();
  const changes = Object.entries(data)
    .map(([key, value]) => {
      if (typeof value === "number") {
        return `${key}=${value}`;
      }

      return `${key}='${value}'`;
    })
    .join(", ");
  const query = `UPDATE ${tableName} SET ${changes} WHERE ID='${id}';`;

  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    throw {
      ...error,
      description: `Erro ao atualizar registro na tabela '${tableName}'!`,
    };
  } finally {
    const conn = await connection.getConnection();
    conn.release();
  }
};

module.exports = updateRow;
