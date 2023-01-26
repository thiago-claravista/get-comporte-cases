const express = require("express");
const selectRows = require("../database/selectRows");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAccounts = async (req, res) => {
  const { cpf, email, contact, limit = 100, page = 1 } = req.query;
  const queries = [];

  if (cpf?.trim()) {
    queries.push(`CNPJCPF__C = '${cpf.trim()}'`);
  }

  if (email?.trim()) {
    queries.push(`PERSONEMAIL = '${email.trim()}'`);
  }

  if (contact?.trim()) {
    const match = contact.trim().match(/^\(?(\d{2})\)?\s?(\d{4,5})-?(\d{4})$/);

    if (match) {
      const [, ddd, firstPart, secondPart] = match;
      const phone = `(${ddd}) ${firstPart}-${secondPart}`;
      queries.push(`(PERSONMOBILEPHONE = '${phone}' OR PHONE = '${phone}')`);
    } else {
      queries.push(
        `(PERSONMOBILEPHONE = '${contact?.trim()}' OR PHONE = '${contact?.trim()}')`
      );
    }
  }

  if (limit?.trim?.() && isNaN(limit)) {
    return res
      .status(400)
      .json({ error: `O parâmetro 'limit' deve ser um valor numérico` });
  }

  if (page?.trim?.() && isNaN(page)) {
    return res
      .status(400)
      .json({ error: `O parâmetro 'page' deve ser um valor numérico` });
  }

  try {
    const conditions = queries.join(" AND ");
    const foundAccounts = await selectRows("Accounts", conditions, limit, page);

    res.status(200).json({
      accounts: foundAccounts,
      count: foundAccounts.length,
      limit: Number(limit),
      page: Number(page),
    });
  } catch (error) {
    res.status(500).json({ ...error });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const foundAccounts = await selectRows("Accounts", `ID = '${id}'`, 1, 1);

    res.status(200).json({
      accounts: foundAccounts,
    });
  } catch (error) {
    res.status(500).json({ ...error });
  }
};
