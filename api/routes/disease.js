const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



const diseaseController = require('../controllers/diseases');


router.get('/disease', diseaseController.getDisease);
router.get('/symptoms', diseaseController.getSymptoms);

module.exports = router;