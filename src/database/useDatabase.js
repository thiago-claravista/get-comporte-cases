const { getConnection } = require("./connection");

const useDatabase = async (database) => {
  const connection = await getConnection();

  try {
    await connection.query(`USE ${database}`);
    console.log(`Banco de dados '${database}' selecionado!`);
  } catch (error) {
    console.log(`Erro ao selecionar o database '${database}':`);
    console.log(error);
  } finally {
    const conn = await connection.getConnection();
    conn.release();
  }
};

module.exports = useDatabase;
