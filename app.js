//Package calls
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

//Utils call
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');

//Schema calling
const Campground = require('./models/campground');

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


app.get('/', (req, res) => {
    res.render('home');
})

//index page
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});       //fetching all data in the database
    res.render('campgrounds/index', {campgrounds});
})

//Get form to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//Saving the campground to database
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));

//details of each campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { camp });
}));

//Get form to update
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp});
}));

//Put request to update campground
app.put('/campgrounds/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});        //...req.body.campground is used to use the updated data and save it into the database
    res.redirect(`/campgrounds/${camp._id}`);
}));

//Delete a campground
app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

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