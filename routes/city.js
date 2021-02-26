var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

router.get("/city", function (req, res) {
  const limit = parseInt(req.query.limit, 10);
  req.db
    .from("city")
    .select("name", "district")
    .limit(limit)
    .then((rows) => {
      res.json({ Error: false, Message: "Success", City: rows });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
});

router.get("/city/:CountryCode", function (req, res) {
  req.db
    .from("city")
    .select("*")
    .where("CountryCode", "=", req.params.CountryCode)
    .then((rows) => {
      res.json({ Error: false, Message: "Success", City: rows });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error executing MySQL query" });
    });
});

router.post("/city/update", authorize, function (req, res) {
  req.db
    .from("city")
    .where("ID", "=", req.body.City)
    .update({ Population: req.body.Pop })
    .then((result) => {
      if (result === 0) {
        res.status(500).json({ message: "Database error - not updated" });
      } else {
        res.status(201).json({ message: `Successful update ${req.body.City}` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error - not updated" });
      console.log(err);
    });
});

function isValid(expireDate) {
  return expireDate > Date.now();
}

function authorize(req, res, next) {
  const authorization = req.headers.authorization;

  // retrieve token
  let token = null;
  if (authorization && authorization.split(" ").length === 2) {
    // valid input
    token = authorization.split(" ")[1];
  } else {
    // invalid user
    res.status(401).json({
      error: true,
      message: "Request header authorization format incorrect!",
    });
    return;
  }

  try {
    const { exp, email } = jwt.verify(token, "a secret key");
    // check if the token is still valid
    if (isValid(exp)) {
      // determine if the user exists in the table
      req.db
        .from("users")
        .select("*")
        .where({ email: email })
        .then((users) => {
          if (users.length !== 0) {
            // permit the user to advance to the route
            next();
          } else {
            res.status(401).json({
              error: true,
              message: "Invalid user!",
            });
          }
        });
    } else {
      res.status(401).json({
        error: true,
        message: "Token expired!",
      });
    }
  } catch (err) {
    res.status(401).json({
      error: true,
      message: "Invalid token",
    });
  }
}

// obselete
router.get("/citySQL", function (req, res) {
  const limit = parseInt(req.query.limit, 10);
  let limitedQuery = "SELECT name, district FROM city LIMIT ?";
  limitedQuery = mysql.format(limitedQuery, [limit]);

  let unlimitedQuery = "SELECT name, district FROM city";
  let query = limit ? limitedQuery : unlimitedQuery;
  req.db.query(query, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: "Error executing MySQL query" });
    } else {
      res.json({ Error: false, Message: "Success", City: rows });
    }
  });
});

router.get("/citySQL/:CountryCode", function (req, res) {
  const { CountryCode } = req.params;
  let sql = "SELECT * FROM ?? WHERE ??=?";
  let inserts = ["city", "CountryCode", CountryCode];
  sql = mysql.format(sql, inserts);

  req.db.query(sql, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: "Error executing MySQL query" });
    } else {
      res.json({ Error: false, Message: "Success", City: rows });
    }
  });
});

router.post("/citySQL/update", function (req, res) {
  let query = "UPDATE city SET Population = ? WHERE ID = ?";

  if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
    res.status(400).json({ message: `Error updating population` });
    console.log(`Error on request body:`, JSON.stringify(req.body));
  } else {
    const inserts = [req.body.Pop, req.body.City];
    query = mysql.format(query, inserts);
    console.log(query);
    req.db.query(query, function (err) {
      if (err) {
        res.status(500).json({ message: "Database error - not updated" });
      } else {
        res.status(201).json({ message: `Successful update ${req.body.City}` });
      }
    });
  }
});
module.exports = router;
