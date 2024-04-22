const mongoose = require('mongoose');
const Schema = mongoose.Schema;       //used as a shorthand for mongoose.Schema
const Review = require("./review")

const CampgroundSchema = new Schema ({
    name: {
        type: String
    },

    images: [
        {
            url: String,
            filename: String
        }
    ],

    price: {
        type: Number
    },

    description: {
        type: String
    },
    
    location: {
        type: String
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async function(camp){
    if(camp){
        await Review.deleteMany(
            {
                _id: {
                    $in: camp.reviews
                }
            }
        )
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);