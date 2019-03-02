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
    stock: [{
        name: String,
        quantity: Number,
        comments: String
    }],
    totalBeds: Number,
    emptyBeds: Number,
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    password :{
        required: true,
        type: String
    }, 
    Pincode: Number, 
    Hospital_Name: String,
    Location: String,
    State: String,
})

module.exports = mongoose.model('hospital_directory', hospitalSchema);