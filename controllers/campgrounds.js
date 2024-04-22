const Campground = require('../models/campground')

//index page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});       //fetching all data in the database
    res.render('campgrounds/index', {campgrounds});
}

//Get form to add new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

//Saving the campground to database
module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const camp = new Campground(req.body.campground);
    // @ts-ignore
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    // @ts-ignore
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', "New campground created");
    res.redirect(`/campgrounds/${camp._id}`);
}

//details of each campground
module.exports.showCampground = async (req, res,) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {     //to populate the review and the author of the campground
            path: 'author'
        }
    })
    .populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}

//Get form to update
module.exports.renderEditform = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

//Put request to update campground
module.exports.editCampground = async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});        //...req.body.campground is used to use the updated data and save it into the database
    req.flash('success', "Campground updated");
    res.redirect(`/campgrounds/${camp?._id}`);
}

//Delete a campground
module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground deleted");
    res.redirect('/campgrounds');
}