/** Express app for jobly. */
const express = require("express");
const ExpressError = require("./helpers/expressError");
const morgan = require("morgan");
const { authenticateJWT } = require("./middleware/auth");

const companiesRoutes = require("./routes/companiesRoutes");
const jobRoutes = require("./routes/jobsRoutes");
const userRoutes = require("./routes/usersRoutes")
const authRoutes = require("./routes/auth")


const app = express();

app.use(express.json());
// add logging system
app.use(morgan("tiny"));

// get auth token for all routes
app.use(authenticateJWT);

app.use("/", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);

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
