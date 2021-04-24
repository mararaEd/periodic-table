const express = require("express");
const elementController = require("../controllers/elementController.js");

const router = express.Router();

router
  .route("/element")
  .get(elementController.getAllElements)
  .post(elementController.compareElements);

module.exports = router;
