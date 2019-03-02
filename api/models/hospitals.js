const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        required:true,
        unique: true,
        type: String
    },
    name: String,
    type: String,
    location: {
    lat: Number,
    long: Number
    },
    stock: {
        name: String,
        quantity: Number,
        comments: String
    },
    totalBeds: Number,
    emptyBeds: Number,
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    password :{
        required: true,
        type: String
    }
})

module.exports = mongoose.model('hospital_directory', hospitalSchema);