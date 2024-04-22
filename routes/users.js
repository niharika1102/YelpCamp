const express = require('express');
const router = express.Router();

//Schema calling
const User = require('../models/user');

//Controller call
const users = require('../controllers/users')

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.renderLoginForm);

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logout);

module.exports = router;