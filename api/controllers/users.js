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

const addOneFamilyMember = (req, res, next) => {
  FamilyMembers.findOne({
    userId: req.body.userId
  }).exec().then(user => {
    if (user) {
      console.log("==========FOUND USER===============")
      user.family.push(req.body.family);
      return user.save();
    }
    if (!user) {
      console.log("Can't find users. now searching in Family Members");
      return FamilyMembers.findOne({
        $or: [{
          'family.email': req.body.email
        }, {
          'family.phone': req.body.phone
        }]
      }).exec((err, familyMember) => {
        if (err) {
          res.status(500).json({
            message: "Error Occurred"
          })
        } else {
          if (familyMember) {
            console.log("Found in Family Members");
            familyMember.family.push(req.body.family);
            return familyMember.save()
          }
          if (!familyMember) {
            console.log('cant find in family members so creating brand new');
            let user = new FamilyMembers({
              _id: mongoose.Types.ObjectId(),
              userId: req.body.userId,
              family: req.body.family
            })
            return user.save();
          }
        }
      })
    }
  }).then((savedUser) => {
    res.status(201).json({
      message: "user added successfuly",
      user: savedUser
    })
  }).catch(e => res.status(500).json({
    message: "An error occurred"
  }));
}

const addMemberByEmail = (req, res, next) => {
  Users.findOne({
    $or: [{
      'email': req.body.email
    }, {
      'phone': req.body.phone
    }]
  }).exec((err, user) => {
    if (err) {
      res.status(500).json({
        'message': "An error occurred"
      })
    } else {
      if (user) {
        console.log("User in User Table Now checking in Family Table")
        FamilyMembers.findOne({
          userId: req.body.userId
        }).exec((err, familyMember) => {
          if (err) {
            res.status(500).json({
              message: "An error occurred"
            })
          } else {
            if (familyMember) {
              console.log("Found as family head. Now adding");
              familyMember.family.push(user);
               familyMember.save((err, savedResult) => {
                 if(err){
                   res.status(500).json({
                     "message": "error while saving"
                   })
                 }
                 res.status(200).json({
                   savedResult
                 })
               });
            }
            if (!familyMember) {
              console.log('couldnot find so now searching the nodes');
              FamilyMembers.findOne({
                $or: [{
                  'family.email': req.body.email
                }, {
                  'family.phone': req.body.phone
                }]
              }).exec((err, foundFamily) => {
                  if(err){
                    res.status(500).json({
                      message: "An error occurred"
                    })
                  } else {
                    if(foundFamily) {
                      console.log("Found in one of the nodes. so adding in on of the nodes");
                      foundFamily.family.push(user);
                      return foundFamily.save((err, savedResult) => {
                        if(err){
                          res.status(500).json({
                            "message": "error while saving"
                          })
                        }
                        res.status(200).json({
                          savedResult
                        })
                      });
                    } if(!foundFamily){
                      console.log("There was no such record, so creating one");
                      let newFamily = new FamilyMembers({
                        _id: mongoose.Types.ObjectId(),
                        userId: req.body.userId,
                        family: user
                      })
                      newFamily.save((err, savedResult) => {
                        if(err){
                          res.status(500).json({
                            'message': 'An error occurred'
                          })
                        } else {
                          res.status(400).json({
                            savedResult
                          })
                        }
                      })
                        
                    }
                  }
              })
            }
          }
        })
      }
      if(!user){
        res.status(400).json({
          message:"No such user is registered"
        })
      }
    }
  })
}



const getFamilyMembers = (req, res, next) => {
  console.log('=========>,start')
  FamilyMembers.findOne({
    userId: req.params.userId,
  }).populate('userId').exec().then(member => {
    if (member) {
      console.log("=======found Member============", member);
      res.status(200).json({
        member
      })
    }
    if (!member) {
      console.log("======= Not found Member============");
      if (!req.query.phone && !req.query.email) {
        res.status(400).json({
          "message": "No records"
        })
      }
      if (req.query.phone) {
        console.log("Querying phone");
        return FamilyMembers.findOne({
          'family.phone': req.query.phone
        }).populate('userId').exec()
      }
      if (req.query.email) {
        console.log("querying email");
        return FamilyMembers.findOne({
          'family.email': req.query.email
        }).populate('userId').exec()
      }
    }
  }).then(foundMember => {
    if (foundMember) {
      console.log("=======found Member 2============", foundMember);
      res.status(200).json({
        foundMember
      })
    }
  }).catch(e => res.status(500).json({
    message: "An error occurred"
  }));
}

const getUsers = (req, res, next) => {
  const page = req.query.page;
  console.log(page);
  const pagesToSkip = (page-1)*50;
  Users.find().skip(pagesToSkip).limit(50).exec((err, user) => {
    if(err){
      return res.status(500).json({
        message: "An error occurred"
      })
    }
    res.status(200).json({
     users: user
    })
  })
}

module.exports = {
  signUp,
  addOneFamilyMember,
  getFamilyMembers,
  addMemberByEmail,
  getUsers
}
