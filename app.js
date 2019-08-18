var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var errors = require('./errors')

var indexRouter = require("./routes/index");
var tjfeedRouter = require("./routes/tjfeed");
var errorsRouter = require("./routes/errors");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/tjfeed", tjfeedRouter);
app.use("/errors", errorsRouter);

app.use(function(err, req, res, next) {
  console.log(err);
  errors.next([...errors.value, err])
  next(err);
});

module.exports = app;
