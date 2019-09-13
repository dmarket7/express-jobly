const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');

const Company = require('../models/companies');
const Job = require('../models/jobs');
const { ensureLoggedIn, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

router.get('/', ensureLoggedIn, async function (req, res, next) {
  try {
    if (Object.keys(req.query).length !== 0) {
      const filteredCompanies = await Company.search(req.query.search, req.query.min_employees, req.query.max_employees);
      return res.json({companies: filteredCompanies});
    }
    const companies = await Company.all();
    return res.json({companies: companies});
  } catch (err) {
    return next(err);
  }
});

router.post('/', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const result = await Company.create(req.body);

    return res.json({company: result});
  } catch (err) {
    return next(err);
  }
});

router.get('/:handle', ensureLoggedIn, async function (req, res, next) {
  try {
    const handle = req.params.handle;
    const company = await Company.get(handle);
    const allJobs = await Job.all();
    const filteredJobs = allJobs.filter(job => { return job.company_handle === handle });
    company.jobs = filteredJobs;
    return res.json({ company: company });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:handle', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const handle = req.params.handle;
    const result = await Company.update({ handle, ...req.body });

    return res.json({company: result});
  } catch (err) {
    return next(err);
  }
});

router.delete('/:handle', ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const handle = req.params.handle;
    const result = await Company.delete(handle);

    return res.json({message: result});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;