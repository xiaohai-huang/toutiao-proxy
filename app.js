require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cityRouter = require("./routes/city");
const countryRouter = require("./routes/country");
const ttRouter = require("./routes/tt");
const options = require("./database/knexfile");
const knex = require("knex")(options);

var app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use((req, res, next) => {
  req.db = knex;
  next();
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger(":method :url :status :res[content-length] - :response-time ms :date"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// temp logger test
function paramsLogger(req, res, next) {
  console.log(`Query Params: ${JSON.stringify(req.query)}`);
  next();
}

app.use(paramsLogger);
app.use("/", indexRouter);
app.use("/tt/api", usersRouter);
app.use("/tt", ttRouter);

app.use("/api", cityRouter);
app.use("/api", countryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
