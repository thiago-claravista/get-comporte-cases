const { Router } = require("express");
const router = Router();
const controller = require("../controllers/accountController");

router.get("/", controller.getAccounts);
router.get("/:id", controller.getAccount);

module.exports = router;
