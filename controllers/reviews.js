//Schema calling
const Campground = require('../models/campground');
const Review = require('../models/review');

//Posting a review
module.exports.createReview = async(req, res) => {
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
}

//Deleting a review
module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}