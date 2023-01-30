const mysql = require("mysql2/promise");
const useDatabase = require("./useDatabase");
require("dotenv").config();

const connectionUri = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "example",
  charset: "utf8mb4_unicode_ci",
};
let connection;

/**
 * @return {Promise<mysql.Pool>}
 */
exports.connect = async () => {
  try {
    connection = mysql.createPool(connectionUri);
    connection.on("connection", () => {
      useDatabase(process.env.DATABASE); // seleciona o banco de dados
    });

    console.log("Conectado com o banco de dados MySQL");

    return connection;
  } catch (error) {
    console.log("Erro ao se conectar com o banco de dados:\n", error);
  }
};

/**
 * @return {Promise<mysql.Pool>}
 */
exports.getConnection = async () => {
  if (!connection) {
    connection = await this.connect();
  }

  return connection;
};

exports.disconnect = async () => {
  try {
    await connection.end();
    console.log("Conexão com o banco de dados MySQL encerrada!");
  } catch (error) {
    console.log("Erro ao fechar a conexão com o MySQL:\n", error);
  }
};
