const express = require("express");
const User = require("../models/users");
const ExpressError = require("../helpers/expressError")
const router = express.Router();
const { SECRET_KEY } = require("../config")
const jwt = require("jsonwebtoken");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (await User.get(username)) {
      if (await User.authenticate(username, password)) {
        payload = { username }
        let token = jwt.sign(payload, SECRET_KEY)
        return res.json({ token })
      } else {
        throw new ExpressError("Invalid username or password", 400)
      } 
    }
    else {
      throw new ExpressError("Invalid username or password", 400)
    }
  } catch (err) {
    return next(err)
  }
});

module.exports = router;