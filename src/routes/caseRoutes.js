const { Router } = require("express");
const router = Router();
const controller = require("../controller/caseController");

router.get("/:id", controller.getCases);
router.get("/", controller.getCases);
router.get("/:id/comments", controller.getCaseComments);

module.exports = router;
