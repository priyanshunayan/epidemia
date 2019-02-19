const Users = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const signUp = async (req, res, next) => {
    let user = await Users.findOne({email: req.body.email});
    if(user) {
        return res.status(400).send("user already registered");
    }else {
        user = new Users({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.send(user);
}

module.exports = {
    signUp
}