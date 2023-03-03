const { Router } = require("express");
const router = Router();
const controller = require("../controllers/caseController");

router.get("/", controller.getCases);
router.get("/:id", controller.getCases);
router.get("/:id/comments", controller.getCaseComments);
router.get("/:id/feeds", controller.getCaseFeeds);
router.get("/:id/feedItems", controller.getCaseFeedItems);
router.get("/:id/attachments", controller.getCaseAttachments);
router.put("/:id/ticket", controller.putZendeskTicketId);

module.exports = router;
