const mongoose = require('mongoose');
const express = require('express');
const Hospitals = require('../models/hospitals');
const router = express.Router();
const hosptialController =  require('../controllers/hospitals');
const auth = require('../middleware/auth');

router.post('/addHospitals', auth, hosptialController.addHospitals);
router.post('/hospitalSignUp', hosptialController.signUp);
router.post('/hospitalLogin', hosptialController.login);
router.post('/addPatient', hosptialController.addPatient);
router.get('/getPatients/:id', hosptialController.getAllPatients);
router.get('/getSinglePatient', hosptialController.getSinglePatient);
router.put('/removePatient', hosptialController.removePatient);
router.get('/getMedicineStock', hosptialController.getMedicineStock);
router.post('/addMedicineStock', hosptialController.addMedicineStock);
router.put('/updateMedicineStock', hosptialController.updateMedicineStock);

module.exports = router;