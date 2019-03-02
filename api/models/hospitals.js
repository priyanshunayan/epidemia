const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    type: String,
    location: {
    lat: Number,
    long: Number
    },
    totalBeds: Number,
    emptyBeds: Number,
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
})

module.exports = mongoose.model('hospital', hospitalSchema);