const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

//Schema calling
const Campground = require('../models/campground');

// //Mongoose setup
mongoose.connect('mongodb://localhost:27017/yelpCamp')
    .then(() => {
        console.log("Database successfully connected!!");
    })
    .catch(e => {
        console.log("Error in database connection: " + e);
    });


//Picking random indices from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

//To delete the existing data from the database
const seedDB = async() => {
    await Campground.deleteMany({});

    //Looping 100 times
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);    //Getting an integer value from 1 to 1000
        const price = Math.floor(Math.random() * 100) + 1000;

        const camp = new Campground({
            name: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '662602d14b4fd27fab286edf',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dwzysltr3/image/upload/v1713797874/YelpCamp/rm0dqtt5sbqyng8kaeq8.jpg',
                  filename: 'YelpCamp/rm0dqtt5sbqyng8kaeq8'
                },
                {
                  url: 'https://res.cloudinary.com/dwzysltr3/image/upload/v1713797879/YelpCamp/zyfci2ihyciyiroyjnaj.jpg',
                  filename: 'YelpCamp/zyfci2ihyciyiroyjnaj'
                }
              ],
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})