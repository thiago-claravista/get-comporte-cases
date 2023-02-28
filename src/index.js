require("dotenv").config();
const express = require("express");
const cors = require("cors");
const useDatabase = require("./database/useDatabase");
const app = express();
const port = process.env.PORT || 3000;
const authorization = require("./middlewares/authentication");

app.use(express.json());
app.use(cors());
app.use(authorization);

const init = async () => {
  await useDatabase(process.env.DATABASE); // seleciona o banco de dados

  // routes
  const caseRoutes = require("./routes/caseRoutes");
  const attachmentRoutes = require("./routes/attachmentRoutes");
  const documentRoutes = require("./routes/documentRoutes");
  const accountRoutes = require("./routes/accountRoutes");
  const surveyRoutes = require("./routes/satisfactionSurveyRoutes");

  app.use("/cases", caseRoutes);
  app.use("/attachments", attachmentRoutes);
  app.use("/documents", documentRoutes);
  app.use("/accounts", accountRoutes);
  app.use("/surveys", surveyRoutes);

  app.listen(port, () =>
    console.log(`'get-comporte-cases' rodando na porta ${port}...`)
  );
};

init();
