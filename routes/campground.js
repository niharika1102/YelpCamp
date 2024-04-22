const express = require('express');
const multer = require('multer')
const router = express.Router();

//Utils call
const catchAsync = require('../utils/CatchAsync');

//Schema calling
const Campground = require('../models/campground');

//Controller call
const campgrounds = require('../controllers/campgrounds');

//Middleware calling
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

//Multer calls
const {storage} = require('../cloudinary/index');
const upload = multer({storage});

//grouping routes
router.route('/')
    .get(catchAsync(campgrounds.index))    //index page
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));    //Saving the campground to database

//Get form to add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))  //details of each campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))  //Put request to update campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))   //Delete a campground

//Get form to update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditform));

module.exports = router;