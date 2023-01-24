const express = require("express");
const selectRows = require("../database/selectRows");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getDocuments = async (req, res) => {
  const { limit = 100, page = 1 } = req.query;

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
    const foundAttachments = await selectRows("Documents", null, limit, page);

    res.status(200).json({
      attachments: foundAttachments.map(
        (attach) => delete attach.BODY && attach
      ),
      count: foundAttachments.length,
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
exports.getDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const [foundAttachments] = await selectRows(
      "Documents",
      `ID = '${id}'`,
      1,
      1
    );

    res.status(200).json({
      attachments: foundAttachments,
    });
  } catch (error) {
    res.status(500).json({ ...error });
  }
};
