# YelpCamp

![image](https://github.com/niharika1102/YelpCamp/assets/97402437/7a4ffe1d-5f42-4be4-ac8a-833b83e2476e)

YelpCamp is a website where users can create and review campgrounds. To review or create a campground, you must have an account.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features
* Users can create, edit, and remove campgrounds
* Users can review campgrounds once, and edit or remove their review
* User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
* Search campground by name or location
* Sort campgrounds by highest rating, most reviewed, lowest price, or highest price

## Run it locally
1. Install mongodb
2. Create a cloudinary account to get an API key and secret code
```
git clone https://github.com/leovenom/YelpCamp.git
cd YelpCamp
npm install
```
## Built With
1. [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
2. [Express](https://expressjs.com//) - Fast, unopinionated, minimalist web framework for Node.js
3. [MongoDB](https://www.mongodb.com/) - The database for modern applications
4. [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
5. [ejs](https://ejs.co/) - Embedded JavaScript templating

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

```
DATABASEURL='<url>'
API_KEY='<key>'
API_SECRET='<secret>'
```
Run `mongod` in another terminal and `node app.js` in the terminal with the project.

Then go to [localhost:3000](http://localhost:3000/).

To get maps working check [this](https://github.com/nax3t/google-maps-api) out.
