const express = require("express");
const { Buffer } = require("buffer");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const authentication = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const decoded = Buffer.from(authorization, "base64").toString("utf-8");

    if (decoded === "Claravista@2022") {
      return next();
    }

    return res.status(401).json({ error: `O token fornecido é inválido!` });
  }

  res.status(401).json({ error: `Parâmetro 'Authorization' não fornecido!` });
};

module.exports = authentication;
