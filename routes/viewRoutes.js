const express = require("express");
const viewController = require("../controllers/viewController.js");

const router = express.Router();

router.get("/", viewController.view);
router.get("/compare", viewController.renderCompare);

module.exports = router;
