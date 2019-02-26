const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.post('/signup', userController.signUp);
router.post('/addMembers', userController.addFamilyMembers);
router.post('/addOneMember', userController.addOneFamilyMember);
module.exports = router;