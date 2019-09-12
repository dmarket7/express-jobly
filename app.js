/** Express app for jobly. */
const express = require("express");
const ExpressError = require("./helpers/expressError");
const morgan = require("morgan");

const companiesRoutes = require("./routes/companiesRoutes");
const jobRoutes = require("./routes/jobsRoutes");


const app = express();

app.use(express.json());
// add logging system
app.use(morgan("tiny"));

app.use("/companies", companiesRoutes);
app.use("/jobs", jobRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
