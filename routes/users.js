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

//grouping routes
router.route('/register')
    .get(users.renderRegisterForm)     //form to register user
    .post(catchAsync(users.registerUser))     //post request to register user

router.route('/login')
    .get(users.renderLoginForm)      //form to login user
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)     //post request to login user

//logout route    
router.get('/logout', users.logout);

module.exports = router;