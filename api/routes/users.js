const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/signup', userController.signUp);
router.post('/addOneMember', userController.addOneFamilyMember);
router.get('/getMembers/:userId', userController.getFamilyMembers);
router.post('/addMembersByEmail', userController.addMemberByEmail);
module.exports = router;