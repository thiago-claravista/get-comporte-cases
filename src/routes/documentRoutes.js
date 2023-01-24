const { Router } = require("express");
const router = Router();
const controller = require("../controllers/documentController");

router.get("/", controller.getDocuments);
router.get("/:id", controller.getDocument);

module.exports = router;
