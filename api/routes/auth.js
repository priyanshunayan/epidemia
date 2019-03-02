const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userController = require('../controllers/users');
const Users = require('../models/users');
const jwt  = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
    let user = await Users.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send("Invalid username or password");
    }
    bcrypt.compare(req.body.password, user.password, (err, validPassword) => {
        if(err) {
            res.status(500).json({
                message: "error occurred"
            })
        }
        if(!validPassword) {
            return res.status(400).send("Invalid username or password");
        }
        if(validPassword){
            jwt.sign({user}, 'private', { expiresIn: '1y' }, (err, token) => {
                if(err) { console.log(err) }    
                res.status(200).json({
                    tokenn: token,
                    user: user
                });
            });
        }
    });
    
});
router.post('/signup', userController.signUp);

//router.post('/hospitalSignup', hospitalController.signUp);

module.exports = router;