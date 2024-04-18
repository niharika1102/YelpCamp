const express = require('express');
const router = express.Router();

//Schema calling
const User = require('../models/user');

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

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

module.exports = router;