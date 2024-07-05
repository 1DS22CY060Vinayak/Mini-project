const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passportLocalMongoose=require('passport-local-mongoose');

// Define the User schema
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});
schema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",schema);




