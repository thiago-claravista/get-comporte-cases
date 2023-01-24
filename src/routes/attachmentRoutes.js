const { Router } = require("express");
const router = Router();
const controller = require("../controllers/attachmentController");

router.get("/", controller.getAttachments);
router.get("/:id", controller.getAttachment);

module.exports = router;
