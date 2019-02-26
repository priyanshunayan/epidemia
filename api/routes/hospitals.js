const mongoose = require('mongoose');
const express = require('express');
const Hospitals = require('../models/hospitals');
const router = express.Router();
const hosptialController =  require('../controllers/hospitals');
const auth = require('../middleware/auth');

router.post('/addHospitals', auth, hosptialController.addHospitals);

module.exports = router;