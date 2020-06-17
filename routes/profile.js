const express = require("express");
const router = express.Router();
const DButils = require("../DButils");
const { response } = require("express");

router.get("/info", (req, res) => {
  DButils.execQuery(
    `SELECT * FROM users WHERE user_id = '${req.user_id}'`
  ).then((response) => {
    res.send(response[0]);
  });
});

module.exports = router;
