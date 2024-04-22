const express = require('express');
const router = express.Router();

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//Schema calling
const Campground = require('../models/campground');
const {CampgroundSchema} = require('../schemas.js');

//Middleware calling
const {isLoggedIn} = require('../middleware');

//Server side validation middleware - campground
const validateCampground = (req, res, next) => {
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

//index page
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});       //fetching all data in the database
    res.render('campgrounds/index', {campgrounds});
})

//Get form to add new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

//Saving the campground to database
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    console.log(camp);
    await camp.save();
    req.flash('success', "New campground created");
    res.redirect(`/campgrounds/${camp._id}`);
}));

//details of each campground
router.get('/:id', catchAsync(async (req, res,) => {
    const camp = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}));

//Get form to update
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}));

//Put request to update campground
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});        //...req.body.campground is used to use the updated data and save it into the database
    req.flash('success', "Campground updated");
    res.redirect(`/campgrounds/${camp?._id}`);
}));

//Delete a campground
router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground deleted");
    res.redirect('/campgrounds');
}));


module.exports = router;