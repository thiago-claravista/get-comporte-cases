const { Router } = require("express");
const router = Router();
const controller = require("../controllers/caseController");

router.get("/:id", controller.getCases);
router.get("/", controller.getCases);
router.get("/:id/comments", controller.getCaseComments);

module.exports = router;
