var express = require("express");
var router = express.Router();
const mysql = require("mysql");

router.get("/country", function (req, res) {
  req.db
    .from("country")
    .select("Code as CountryCode", "Code2 as FlagCode", "Name")
    .then((rows) => {
      res.json({ Error: false, Message: "Success", Country: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error executing MySQL query" });
      console.log(err);
    });
});

// obselete
router.get("/countrySQL", function (req, res) {
  // { code: "AD", label: "Andorra", phone: "376" },
  const query =
    "SELECT Code as CountryCode, Code2 as FlagCode, Name FROM country";
  req.db.query(query, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: "Error executing MySQL query" });
    } else {
      res.json({ Error: false, Message: "Success", Country: rows });
    }
  });
});

module.exports = router;
