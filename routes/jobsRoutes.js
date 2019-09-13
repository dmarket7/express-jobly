const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const ExpressError = require('../helpers/expressError');
const jobsSchema = require('../schemas/jobsSchema');
const Job = require('../models/jobs');
const { ensureLoggedIn, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

router.get('/', ensureLoggedIn, async function (req, res, next) {
  try {
    if (Object.keys(req.query).length !== 0) {
      const filteredJobs = await Job.search(req.query.title, req.query.min_salary, req.query.min_equity);
      return res.json({ jobs: filteredJobs });
    }
    const jobs = await Job.all();
    return res.json({ jobs });
  }
  catch (err) {
    return next(err)
  }
})

router.post('/', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  const validJob = jsonschema.validate(req.body, jobsSchema)
  if (!validJob.valid) {
    let listOfErrors = validJob.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error)
  }

  try {
    const job = await Job.create(req.body);
    return res.json({ job })
  }
  catch (err) {
    return next(err)
  }
})

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
  try {
    const id = req.params.id;
    const job = await Job.get(id);

    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  const validJob = jsonschema.validate(req.body, jobsSchema)
  if (!validJob.valid) {
    let listOfErrors = validJob.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error)
  }

  try {
    const id = req.params.id;
    const job = await Job.update({ id, ...req.body });

    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const id = req.params.id;
    const message = await Job.delete(id);

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;