const Hospitals = require('../models/hospitals');
const mongoose = require('mongoose');

const addHospitals = (req, res, next) => {
    const hospitals = new  Hospitals({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        totalBeds: req.body.totalBeds,
        emptyBeds: req.body.emptyBeds
    });
    hospitals.save().then(hospitals => {
        res.status(201).json({
            message: "Hospital Added Successfully",
            hospital: hospitals
        });
    }).catch(e => {
        console.log("Error while saving Hospitals", e);
    })
}

const signUp = (req, res, next) => {
    const name = req.body.name;    
    const type = req.body.type;
    const location = req.body.location;
    

}

module.exports = {
    addHospitals,
    signUp
}