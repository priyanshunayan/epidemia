const Users = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const FamilyMembers = require('../models/family_members');

const signUp = async (req, res, next) => {
  if (req.body.email && !req.body.phone) {
    let user = await Users.findOne({
      email: req.body.email
    });
    if (user) {
      return res.status(400).json({
        "message": "Email already taken"
      });
    } else {
      user = new Users({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        dob: req.body.dob,
        gender: req.body.gender,
        pin: req.body.pin,
        lat: req.body.lat,
        long: req.body.long
      })
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      jwt.sign({
        user
      }, 'private', {
        expiresIn: '1y'
      }, (err, token) => {
        if (err) {
          console.log(err)
        }
        res.status(200).json({
          message: "Logged in successfully",
          user: user,
          token: token
        });
      });

    }

  }
  if (!req.body.email && req.body.phone) {
    let user = await Users.findOne({
      phone: req.body.phone
    });
    if (user) {
      return res.status(400).json({
        "message": "Phone number taken"
      });
    } else {
      user = new Users({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        dob: req.body.dob,
        gender: req.body.gender,
        pin: req.body.pin,
        lat: req.body.lat,
        long: req.body.long
      })
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      jwt.sign({
        user
      }, 'private', {
        expiresIn: '1y'
      }, (err, token) => {
        if (err) {
          console.log(err)
        }
        res.status(200).json({
          message: "Logged in successfully",
          user: user,
          token: token
        });
      });
    }
  }
  if (req.body.email && req.body.phone) {
    let user = await Users.findOne({
      email: req.body.email
    });
    if (user) {
      return res.status(400).json({
        "message": "Email already taken"
      });
    } else {
        let user = await Users.findOne({
            phone: req.body.phone
        })
        if (user) {
          res.status(400).json({
            message: "Phone number already taken"
          })
        } else {
          user = new Users({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            dob: req.body.dob,
            gender: req.body.gender,
            pin: req.body.pin,
            lat: req.body.lat,
            long: req.body.long
          })
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          await user.save();
          jwt.sign({
            user
          }, 'private', {
            expiresIn: '1y'
          }, (err, token) => {
            if (err) {
              console.log(err)
            }
            res.status(200).json({
              message: "Logged in successfully",
              user: user,
              token: token
            });
          });
        }
    }
  }
}

const addFamilyMembers = (req, res, next) => {
    const familyMembers = new FamilyMembers({
        _id: mongoose.Types.ObjectId(),
        userId: req.body.userId,
        family: req.body.family
    })
    familyMembers.save().then(members => {
        res.status(201).json({
            message: "Family member added",
            members
        })
    }).catch(e => res.status(500).json({message: "An error occured while saving"}));
}
const addOneFamilyMember = (req, res, next) => {
    FamilyMembers.findOne({userId: req.body.userId}).exec().then(user => {
        user.family.push(req.body.family);
         return user.save()
    }).then(savedUser => {
        res.status(201).json({
            message: "user added successfuly",
            user: savedUser
        })
    }).catch(e => res.status(500).json({message: "An error occurred"}));
}

module.exports = {
  signUp,
  addFamilyMembers,
  addOneFamilyMember
}
