const mongoose = require('mongoose');
const Schema = mongoose.Schema;       //used as a shorthand for mongoose.Schema

const CampgroundSchema = new Schema ({
    name: {
        type: String
    },

    image: {
        type: String
    },

    price: {
        type: Number
    },

    description: {
        type: String
    },
    
    location: {
        type: String
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);