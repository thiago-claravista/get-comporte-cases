const { Router } = require("express");
const router = Router();
const controller = require("../controller/attachmentController");

router.get("/", controller.getAttachments);
router.get("/:id", controller.getAttachment);

module.exports = router;
