const mongoose = require('mongoose');

const diseaseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    description: String,
    symptom_ids: [Number],
    medicine_ids:[Number]
})

module.exports = mongoose.model('diseases', diseaseSchema);