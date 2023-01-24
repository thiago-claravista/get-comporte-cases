require("dotenv").config();
const express = require("express");
const useDatabase = require("./database/useDatabase");
const app = express();
const port = process.env.PORT || 3000;

const init = async () => {
  await useDatabase(process.env.DATABASE); // seleciona o banco de dados

  // routes
  const caseRoutes = require("./routes/caseRoutes");
  const attachmentRoutes = require("./routes/attachmentRoutes");
  const documentRoutes = require("./routes/documentRoutes");

  app.use("/cases", caseRoutes);
  app.use("/attachments", attachmentRoutes);
  app.use("/documents", documentRoutes);

  app.listen(port, () =>
    console.log(`'get-comporte-cases' rodando na porta ${port}...`)
  );
};

init();
