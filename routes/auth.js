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
    const user = await User.get(username)
    if (user) {
      if (await User.authenticate(username, password)) {
        payload = { username, is_admin: user.is_admin }
        let token = jwt.sign(payload, SECRET_KEY)
        console.log(jwt.decode(token))
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