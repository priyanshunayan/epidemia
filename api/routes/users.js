const mongoose = require('mongoose');
const express = require('express');
const router = mongoose.Router();

const userController = require('../controllers/users');

router.post('/signup', userController.signUp);


module.exports = router;