const express = require('express');
const router = express.Router({mergeParams: true});

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//Schema calling
const Campground = require('../models/campground');
const Review = require('../models/review');

//Controller calling
const reviews = require('../controllers/reviews');

//Middleware calling
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

//Posting a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Deleting a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;