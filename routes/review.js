const express = require('express');
const router = express.Router({mergeParams: true});

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//Schema calling
const Campground = require('../models/campground');
const {CampgroundSchema, ReviewSchema} = require('../schemas.js');
const Review = require('../models/review');

//Server side validation - review
const validateReview = (req, res, next) => {
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

//Posting a review
router.post('/', validateReview, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground?.reviews.push(review._id);
    await review.save();    
    await campground?.save();
    res.redirect(`/campgrounds/${id}`);
}));

//Deleting a review
router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});    //We pull the specific review id from the reviews array in the campground
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;