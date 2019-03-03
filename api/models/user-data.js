const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
    symptoms :[{
        type: mongoose.Schema.Types.ObjectId
        ref: 'symptoms'
    }],
    epidemic: [{
        type: mongoose.Schema.Types.ObjectId
        ref: 'diseases'
    }],
    recentDisease:[{
        type: mongoose.Schema.Types.ObjectId
        ref: 'diseases'
    }],
})

module.exports = mongoose.model('user_data', userDataSchema);