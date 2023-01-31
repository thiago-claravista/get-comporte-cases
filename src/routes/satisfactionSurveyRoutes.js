const { Router } = require("express");
const router = Router();
const controller = require("../controllers/satisfactionSurveyController");

router.get("/", controller.getSurveys);
router.get("/:id", controller.getSurvey);

module.exports = router;
