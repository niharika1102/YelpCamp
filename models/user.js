const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    email : {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);      //used to add username and password field to the schema and it makes sure that the username and password fed by the user is unique.

module.exports = mongoose.model('User', userSchema);