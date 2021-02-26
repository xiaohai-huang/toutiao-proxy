const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  axios("https://m.toutiao.com/related/hotboard/").then((response) => {
    res.json({ data: response.data, deploy: "12.27am" });
  });
});

module.exports = router;
