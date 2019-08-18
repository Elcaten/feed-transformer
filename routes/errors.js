const express = require("express");
const router = express.Router();
var errors = require("../errors");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  res.render("errors", { errors: errors.errors.value });
});

module.exports = router;
