const mongoose = require('mongoose');
const express = require('express');
const Hospitals = require('../models/hospitals');
const router = express.Router();
const hosptialController =  require('../controllers/hospitals');

router.post('/addHospitals', hosptialController.addHospitals);

module.exports = router;