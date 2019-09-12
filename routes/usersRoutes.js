const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const ExpressError = require('../helpers/expressError');
// const jobsSchema = require('../schemas/jobsSchema');
const User = require('../models/users');

router.get('/', async function(req, res, next) {
  try {
    const users = await User.all();
    return res.json({ users })
  }
  catch (err) {
    return next(err)
  }
})

router.get('/:username', async function(req, res, next) {
  try {
    const username = req.params.username;
    const user = await User.get(username);

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
})

router.post('/', async function(req, res, next){
  try {
    const user = await User.create(req.body);
    return res.json({ user });
  }
  catch (err) {
    return next(err);
  }
})

router.patch('/:username', async function(req, res, rext) {
  try {
    const username = req.params.username;
    const user = await User.update({ username, ...req.body });
    return res.json({ user })
  }
  catch(err) {
    return next(err)
  }
})



router.delete('/:username', async function(req, res, next) {
  try {
    const username = req.params.username;
    const message = await User.delete(username);

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;