const express = require('express');
const router = express.Router();

//Schema calling
const User = require('../models/user');

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');

//Get the registeration form
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Saving userdata
router.post('/register', catchAsync(async(req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', "Welcome to YelpCamp!");
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

//Login form rendering
router.get('/login', (req, res) => {
    res.render('users/login');
})

//Login form post route
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', "Welcome back to YelpCamp");
    res.redirect('/campgrounds');
})

//Logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Logged out successfully");
        res.redirect('/campgrounds');
    });
});

module.exports = router;