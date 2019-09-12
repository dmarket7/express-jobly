const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const ExpressError = require('../helpers/expressError');
const jobsSchema = require('../schemas/jobsSchema')

const Job = require('../models/jobs');

router.get('/', async function(req, res, next) {
  try {
    if (Object.keys(req.query).length !== 0) {
      const filteredJobs = await Job.search(req.query.title, req.query.min_salary, req.query.min_equity );
      return res.json(filteredJobs);
    }
    const jobs = await Job.all();
    return res.json({ jobs: jobs });
  }
  catch(err) {
    return next(err)
  }
})

router.post('/', async function(req, res, next) {
  const validJob = jsonschema.validate(req.body, jobsSchema)
  if (!validJob.valid) {
    let listOfErrors = validJob.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error)
  }

  try {
    const result = await Job.create( req.body );
    return res.json({ job: result })
  }
  catch(err) {
    return next(err)
  }
})






module.exports = router;