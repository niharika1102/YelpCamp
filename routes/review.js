const express = require('express');
const router = express.Router({mergeParams: true});

//Utils call
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//Schema calling
const Campground = require('../models/campground');
const Review = require('../models/review');

//Middleware calling
const {validateReview, isLoggedIn} = require('../middleware');

//Posting a review
router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    // @ts-ignore
    review.author = req.user._id;
    // @ts-ignore
    campground?.reviews.push(review._id);
    await review.save();    
    await campground?.save();
    req.flash('success', "Review posted");
    res.redirect(`/campgrounds/${id}`);
}));

//Deleting a review
router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});    //We pull the specific review id from the reviews array in the campground
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review deleted");
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;