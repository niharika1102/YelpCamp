const express = require('express');
const router = express.Router();

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//Schema calling
const Campground = require('../models/campground');
const {CampgroundSchema, ReviewSchema} = require('../schemas.js');

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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

//Saving the campground to database
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success', "New campground created!!");
    res.redirect(`/campgrounds/${camp._id}`);
}));

//details of each campground
router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { camp, msg: req.flash('success')});
}));

//Get form to update
router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp});
}));

//Put request to update campground
router.put('/:id', validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});        //...req.body.campground is used to use the updated data and save it into the database
    res.redirect(`/campgrounds/${camp?._id}`);
}));

//Delete a campground
router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


module.exports = router;