const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const imageController = require('../controllers/image-upload');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: 'epidemia',
    api_key: '938417918341345',
    api_secret: 'BpfKbzviTYN0OET_uebmbW579aU'
  });
  const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "reports",
    allowedFormats: ["jpg", "png"],
    transformation: [{
      width: 500,
      height: 500,
      crop: "limit"
    }]
  });
  const parser = multer({
    storage: storage
  });
router.post('/signup', userController.signUp);
router.post('/addOneMember', userController.addOneFamilyMember);
router.get('/getMembers/:userId', userController.getFamilyMembers);
router.post('/addMembersByEmail', userController.addMemberByEmail);
router.post('/uploadImage',parser.single("image"), imageController.uploadImage);
router.get('/users',userController.getUsers );
module.exports = router;