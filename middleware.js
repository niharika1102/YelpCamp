const ExpressError = require('./utils/ExpressError');    //Utils calling
const Campground = require('./models/campground');      //Model calling
const Review = require('./models/review');              //Model calling
const {CampgroundSchema, ReviewSchema} = require('./schemas.js');   //JOI Schema calling

//Middleware to store the returnTo url in the session

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;    //to store the last url visited by the users
        req.flash('error', "You must be logged in");
        return res.redirect('/login');
    }
    next();
}

//Server side validation middleware - campground
module.exports.validateCampground = (req, res, next) => {
    const {error} = CampgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    console.log(error);
}

//Middleware to check if the user is the author of the campground
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    // @ts-ignore
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "Not authorized to perform this action");
        return res.redirect(`/campgrounds/${camp?._id}`);
    }
    next();
}

//Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async(req, res, next) => {
    const {reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    // @ts-ignore
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Not authorized to perform this action");
        return res.redirect('/campgrounds');
    }
    next();
}

//Server side validation - review
module.exports.validateReview = (req, res, next) => {
    const {error} = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    console.log(error);
}