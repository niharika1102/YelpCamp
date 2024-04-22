const express = require('express');
const router = express.Router();

//Utils call
const catchAsync = require('../utils/CatchAsync');

//Schema calling
const Campground = require('../models/campground');

//Controller call
const campgrounds = require('../controllers/campgrounds');

//Middleware calling
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

//index page
router.get('/', catchAsync(campgrounds.index));

//Get form to add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//Saving the campground to database
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//details of each campground
router.get('/:id', catchAsync(campgrounds.showCampground));

//Get form to update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditform));

//Put request to update campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

//Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;