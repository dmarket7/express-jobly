const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');

const Company = require('../models/companies');

router.get('/', async function(req, res, next) {
  try {
    if (Object.keys(req.query).length !== 0) {
      const filteredCompanies = await Company.search(req.query.search, req.query.min_employees, req.query.max_employees );
      return res.json(filteredCompanies);
    }
    const companies = await Company.all();
    return res.json(companies); 
  } catch(err) {
    return next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const result = await Company.create( req.body );

    return res.json( result );
  } catch(err) {
    return next(err);
  }
});

router.get('/:handle', async function(req, res, next){
  try {
    const handle = req.params.handle;
    const company = await Company.get(handle);

    return res.json( company );
  } catch(err) {
    return next(err);
  }
});

router.patch('/:handle', async function(req, res, next) {
  try {
    const handle = req.params.handle;
    const result = await Company.update({handle, ...req.body});

    return res.json( result );
  } catch(err){
    return next(err);
  }
});

router.delete('/:handle', async function(req, res, next) {
  try {
    const handle = req.params.handle;
    const result = await Company.delete(handle);

    return res.json( result );
  } catch(err) {
    return next(err);
  }
});

module.exports = router;