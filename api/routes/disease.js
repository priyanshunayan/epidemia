const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



const diseaseController = require('../controllers/diseases');


router.get('/disease', diseaseController.getDisease);
router.get('/symptoms', diseaseController.getSymptoms);
router.get('/getdiseases', diseaseController.getDiseases);
router.get('/getSymptomsOfDisease/:id', diseaseController.getSymptomsOfDisease);
router.post('/user-data', diseaseController.postData);
module.exports = router;