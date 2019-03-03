const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
    symptoms :[String],
    epidemic: [String],
    recentDisease:[
        String
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model('user_data', userDataSchema);