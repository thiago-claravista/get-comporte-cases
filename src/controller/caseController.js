const express = require("express");
const selectRows = require("../database/selectRows");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getCases = async (req, res) => {
  const { id } = req.params;
  const { limit = 100, page = 1 } = req.query;
  const dateRegex = /^(\d{2,4}-?){3}(\s(\d{2}:?){3})?$/;

  try {
    if (id) {
      const foundCases = await selectRows(
        "Cases",
        `CASENUMBER='${id.trim()}' OR ID='${id.trim()}'`,
        limit,
        page
      );

      res.status(200).json({ cases: foundCases, count: foundCases.length });
    } else {
      const { email, contact, createdDate, closedDate } = req.query;
      const queries = [];

      if (email?.trim()) {
        queries.push(`CONTACTEMAIL = '${email.trim()}'`);
      }

      if (contact?.trim()) {
        const match = contact
          .trim()
          .match(/^\(?(\d{2})\)?\s?(\d{4,5})-?(\d{4})$/);

        if (match) {
          const [, ddd, firstPart, secondPart] = match;
          const phone = `(${ddd}) ${firstPart}-${secondPart}`;
          queries.push(
            `(CONTACTMOBILE = '${phone}' OR CONTACTPHONE = '${phone}')`
          );
        } else {
          queries.push(
            `(CONTACTMOBILE = '${contact?.trim()}' OR CONTACTPHONE = '${contact?.trim()}')`
          );
        }
      }

      if (createdDate?.trim()) {
        if (dateRegex.test(createdDate.trim())) {
          queries.push(`CREATEDDATE >= '${createdDate.trim()}'`);

          if (closedDate?.trim()) {
            if (dateRegex.test(closedDate.trim())) {
              queries.push(`CLOSEDDATE <= '${closedDate.trim()}'`);
            } else {
              return res.status(400).json({
                error: `Formato de data inválido para o parâmetro 'closedDate'.`,
              });
            }
          }
        } else {
          return res.status(400).json({
            error: `Formato de data inválido para o parâmetro 'createdDate'.`,
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
