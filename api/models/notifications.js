const mongoose = require('mongoose');


const notificationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    headline: String,
    content: String
})

module.exports = mongoose.model('notification', notificationSchema);