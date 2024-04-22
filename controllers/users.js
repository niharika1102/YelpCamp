//Schema calling
const User = require('../models/user');

//Get the registeration form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

//Saving userdata
module.exports.registerUser = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {      //Login the user automatically after sign up
            if (err) {
                return next(err);
            }
            req.flash('success', "Welcome to YelpCamp!");
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//Login form rendering
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

//Login form post route
module.exports.loginUser = (req, res) => {
    req.flash('success', "Welcome back to YelpCamp");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

//Logout
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Logged out successfully");
        res.redirect('/campgrounds');
    });
}