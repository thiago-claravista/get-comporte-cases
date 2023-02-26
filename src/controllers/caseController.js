const express = require("express");
const selectRows = require("../database/selectRows");
const findAccount = require("../utils/findAccount");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getCases = async (req, res) => {
  const { id } = req.params;
  const { limit = 100, page = 1 } = req.query;
  const dateRegex = /^(\d{2,4}-?){3}(\s(\d{2}:?){3})?$/;
  let account;

  try {
    if (id) {
      const foundCases = await selectRows(
        "Cases",
        `CASENUMBER='${id.trim()}' OR ID='${id.trim()}' OR SOURCEID='${id.trim()}'`,
        limit,
        page
      );

      res.status(200).json({ cases: foundCases, count: foundCases.length });
    } else {
      const { cpf, email, contact, createdDate, closedDate } = req.query;
      const queries = [];

      if (cpf?.trim()) {
        // obter a conta do cpf
        const cleanCpf = cpf.trim().replace(/[^\w]/g, "");
        const foundAccount = await findAccount("CNPJCPF__C", cleanCpf);

        if (foundAccount) {
          account = foundAccount;
        } else {
          return res
            .status(400)
            .json({ error: `CPF não encontrado na base de dados!` });
        }
      }

      if (email?.trim()) {
        if (account) {
          if (account.PERSONEMAIL !== email?.trim()) {
            return res
              .status(400)
              .json({ error: `Usuário não encontrado na base de dados!` });
          }
        } else {
          const foundAccount = await findAccount("PERSONEMAIL", email?.trim());

          if (foundAccount) {
            account = foundAccount;
          } else {
            return res
              .status(400)
              .json({ error: `E-mail não encontrado na base de dados!` });
          }
        }
      }

      if (contact?.trim()) {
        const match = contact
          .trim()
          .match(/^\(?(\d{2})\)?\s?(\d{4,5})-?(\d{4})$/);
        let phone;

        if (match) {
          const [, ddd, firstPart, secondPart] = match;
          phone = `(${ddd}) ${firstPart}-${secondPart}`;
        } else {
          phone = contact.trim();
        }

        if (account) {
          console.log(phone, account.PERSONMOBILEPHONE, account.PHONE);
          if (account.PERSONMOBILEPHONE !== phone && account.PHONE !== phone) {
            return res
              .status(400)
              .json({ error: `Usuário não encontrado na base de dados!` });
          }
        } else {
          const foundAccount = await findAccount(
            ["PERSONMOBILEPHONE", "PHONE"],
            phone
          );

          if (foundAccount) {
            account = foundAccount;
          } else {
            return res
              .status(400)
              .json({ error: `Telefone não encontrado na base de dados!` });
          }
        }
      }

      if (createdDate?.trim()) {
        if (dateRegex.test(createdDate.trim())) {
          queries.push(`CREATEDDATE >= '${createdDate.trim()}'`);
        } else {
          return res.status(400).json({
            error: `Formato de data inválido para o parâmetro 'createdDate'.`,
          });
        }
      }

      if (closedDate?.trim()) {
        if (dateRegex.test(closedDate.trim())) {
          queries.push(`CLOSEDDATE <= '${closedDate.trim()}'`);
        } else {
          return res.status(400).json({
            error: `Formato de data inválido para o parâmetro 'closedDate'.`,
          });
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

      if (account?.ID) {
        queries.push(`ACCOUNTID = '${account.ID}'`);
      }

      const conditions = queries.join(" AND ");
      const foundCases = await selectRows("Cases", conditions, limit, page);
      // console.log("Query:", conditions);

      res.status(200).json({
        cases: foundCases,
        count: foundCases.length,
        limit: Number(limit),
        page: Number(page),
      });
    }
  } catch (error) {
    res.status(500).json({ ...error });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getCaseComments = async (req, res) => {
  const { id } = req.params;
  const { limit = 100, page = 1 } = req.query;

  if (id) {
    try {
      const foundCases = await selectRows(
        "CaseComments",
        `ParentId='${id.trim()}'`,
        limit,
        page
      );

      res.status(200).json({
        comments: foundCases,
        count: foundCases.length,
        limit: Number(limit),
        page: Number(page),
      });
    } catch (error) {
      res.status(500).json({ ...error });
    }
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getCaseFeeds = async (req, res) => {
  const { id } = req.params;
  const { limit = 100, page = 1 } = req.query;

  if (id) {
    try {
      const foundCases = await selectRows(
        "Feeds",
        `ParentId='${id.trim()}'`,
        limit,
        page
      );

      res.status(200).json({
        feeds: foundCases,
        count: foundCases.length,
        limit: Number(limit),
        page: Number(page),
      });
    } catch (error) {
      res.status(500).json({ ...error });
    }
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getCaseAttachments = async (req, res) => {
  const { id } = req.params;
  const { limit = 100, page = 1 } = req.query;

  if (id) {
    try {
      const foundDocumentLinks = await selectRows(
        "ContentDocumentLinks",
        `LinkedEntityId='${id.trim()}'`,
        limit,
        page
      );

      const contentDocumentIds = foundDocumentLinks.map(
        (dl) => dl.ContentDocumentId
      );
      const foundContentVersions = await selectRows(
        "ContentVersions",
        `ContentDocumentId IN ('${contentDocumentIds.join("','")}')`,
        limit,
        page
      );

      res.status(200).json({
        attachments: foundContentVersions,
        count: foundContentVersions.length,
        limit: Number(limit),
        page: Number(page),
      });
    } catch (error) {
      res.status(500).json({ ...error });
    }
  }
};
