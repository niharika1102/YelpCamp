//Package calls
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

//Router calls
const campgrounds = require('./routes/campground');

//Utils call
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');

//Schema calling
const Campground = require('./models/campground');
const {CampgroundSchema, ReviewSchema} = require('./schemas.js');
const Review = require('./models/review');

//Mongoose setup
mongoose.connect('mongodb://localhost:27017/yelpCamp')
    .then(() => {
        console.log("Database successfully connected!!");
    })
    .catch(e => {
        console.log("Error in database connection: " + e);
    });

//ejs setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));

//Middleware setup
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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

//campground routes
app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home');
})



//Posting a review
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground?.reviews.push(review._id);
    await review.save();    
    await campground?.save();
    res.redirect(`/campgrounds/${id}`);
}));

//Deleting a review
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});    //We pull the specific review id from the reviews array in the campground
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

//404
app.all('*', (req, res, next) => {      
    next(new ExpressError('Page Not Found', 404));
})

//Custom error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) {
        err.message = 'Something went wrong!!';
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Listening to you on 3000!!");
})