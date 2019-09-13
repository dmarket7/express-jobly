const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const usersSchema = require('../schemas/usersSchema');
const ExpressError = require('../helpers/expressError');
// const jobsSchema = require('../schemas/jobsSchema');
const User = require('../models/users');
const { SECRET_KEY } = require("../config")
const jwt = require("jsonwebtoken");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

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
  const validUser = jsonschema.validate(req.body, usersSchema)
  if (!validUser.valid) {
    let listOfErrors = validUser.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error)
  }
  
  try {
    const user = await User.create(req.body);
    payload = { username: user.username, is_admin: user.is_admin }
    let token = jwt.sign(payload, SECRET_KEY)
    return res.json({ user, token });
  }
  catch (err) {
    return next(err);
  }
})

router.patch('/:username', ensureCorrectUser, async function(req, res, rext) {
  try {
    const username = req.params.username;
    const user = await User.update({ username, ...req.body });
    return res.json({ user })
  }
  catch(err) {
    return next(err)
  }
})



router.delete('/:username', ensureCorrectUser, async function(req, res, next) {
  try {
    const username = req.params.username;
    const message = await User.delete(username);

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;