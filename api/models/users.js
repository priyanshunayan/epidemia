const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    lat: Number,
    long: Number,
    gender: String,
    dob: String,
    bloodGroup: String,
    password: {
        type: String,
        required: true
    },
    family_members: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    }
})

module.exports = mongoose.model('user', userSchema);