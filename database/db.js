const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "192.168.3.102",
  user: "root",
  password: "",
  database: "world",
});

connection.connect(function (err) {
  if (err) {
    console.log("Cannot connect to db.");
  }
});

function dbMiddleware(req, res, next) {
  req.db = connection;
  next();
}

module.exports = dbMiddleware;
