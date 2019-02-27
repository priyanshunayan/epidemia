const mongoose = require('mongoose');

const familyMembersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reports: [{
        url : String,
        id: String
    }],
    family:[{
        phone:{
            type: String,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        bloodgroup: {
            type: String
        },
        age: Number,
        reports: [{
            url : String,
            id: String
        }]
    }]
})

module.exports = mongoose.model('family_members', familyMembersSchema);