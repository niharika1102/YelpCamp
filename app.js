//Package calls
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));
app.use(express.urlencoded({extended:true}));


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
app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect('/campgrounds');
})

//details of each campground
app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { camp });
});


app.listen(3000, () => {
    console.log("Listening to you on 3000!!");
})