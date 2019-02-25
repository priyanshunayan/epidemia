const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone:{
        type: String,
    },
    lat: Number,
    long: Number,
    gender: String,
    dob: Date,
    pin: Number,
    bloodGroup: String,
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema);