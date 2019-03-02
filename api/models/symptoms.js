const mongoose = require('mongoose');

const symptomsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    description: String
})

module.exports = mongoose.model('symptoms',symptomsSchema);