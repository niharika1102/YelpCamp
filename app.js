//ENV configuration
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Package calls
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//Router calls
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/users');

//Utils call
const ExpressError = require('./utils/ExpressError');

//Schema calling
const Campground = require('./models/campground');
const {CampgroundSchema, ReviewSchema} = require('./schemas.js');
const Review = require('./models/review');
const review = require('./models/review');
const User = require('./models/user');
const user = require('./models/user');

//Mongoose setup
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
});
    
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in database connection: "));
db.once("open", () => {
    console.log("Database successfully connected!!");
});

//ejs setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));


//Middleware setup
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Session setup
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    // secure: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,      //prevents the cookie to be access from the client side in any case that may exist
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwzysltr3/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));     //We tell passport to use the authentication method written in the User model.
// @ts-ignore
passport.serializeUser(User.serializeUser());     //Tells passport how to store user data in session
passport.deserializeUser(User.deserializeUser());     //Tells passport how to unstore user data in session

//Middleware to access objects globally
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/campgrounds', campgroundRoutes);   //campground
app.use('/campgrounds/:id/reviews', reviewRoutes);    //review
app.use('/', userRoutes);    //user

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