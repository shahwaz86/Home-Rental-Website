const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware.js");

const usersControllers = require("../controllers/user.js");

router.get("/signup",usersControllers.signupForm );

router.post("/signup", wrapAsync( usersControllers.newUser));

router.get("/login",usersControllers.loginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), usersControllers.login);

router.get("/logout", usersControllers.logout)

module.exports = router;