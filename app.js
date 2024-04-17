//Package calls
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

//Router calls
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');

//Utils call
const ExpressError = require('./utils/ExpressError');

//Schema calling
const Campground = require('./models/campground');
const {CampgroundSchema, ReviewSchema} = require('./schemas.js');
const Review = require('./models/review');
const review = require('./models/review');

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

//Routes
app.use('/campgrounds', campgrounds);   //campground
app.use('/campgrounds/:id/reviews', reviews);    //review

app.get('/', (req, res) => {
    res.render('home');
})

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