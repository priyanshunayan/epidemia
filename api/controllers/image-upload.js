const mongoose = require('mongoose');
const FamilyMembers = require('../models/family_members');
const Users = require('../models/users');
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
//TODO if the user  is not found in user model then check if he is family member of any node. If he is then add the reports  and make a proper check.
const uploadImage = (req, res, next) => {
  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  // console.log(req.file);
  const phone = req.body.phone;
  const email = req.body.email;
  // If phone number given
  if (phone && !email) {
      console.log("========> Finding in users model");
    Users.findOne({
      phone: req.body.phone
    }).exec((err, user) => {
      if (err) {
        res.status(500).json({
          message: 'An error occurred'
        })
      } else {
        if (user) {
        console.log("found in User model.The lead man. Now searching if he has family nodes");
          FamilyMembers.findOne({
            userId: user._id
          }).exec((err, familyMember) => {
            if (err) {
              res.status(500).json({
                message: "An error occurred"
              })
            }
            if (familyMember) {
                console.log("He is the lead. pushing image to his reports");
              familyMember.reports.push(image);
              familyMember.save((err, result) => {
                if (err) {
                  res.status(500).json({
                    message: "error while saving"
                  })
                }
                res.status(200).json({
                  result
                })
              })
            }
            if (!familyMember) {
                console.log("====== Not the lead so searching in nodes");
              FamilyMembers.findOne({
                'family.phone': req.body.phone
              }).exec((err, foundFamily) => {
                if (err) {
                  req.status(500).json({
                    message: "An error occurred"
                  })
                } else {
                  if (foundFamily) {
                      console.log('found in the node');
                    foundFamily.family.forEach(element => {
                      if (element.phone === req.body.phone) {
                          console.log('=========pushing image========' );
                        element.reports.push(image);
                        console.log(element, 'element');
                        foundFamily.save((err, savedResult) => {
                          if (err) {
                           return res.status(500).json({
                              message: "error while saving image"
                            })
                          }
                         return res.status(200).json({
                            savedResult
                          })
                        })
                      }
                    });
                  }
                  if (!foundFamily) {
                      console.log('could not find in the nodes tooo so creating a new user');
                    const newUser = new FamilyMembers({
                      _id: mongoose.Types.ObjectId(),
                      reports: image
                    })
                    newUser.save((err, savedUser) => {
                      if (err) {
                        res.status(500).json({
                          message: "Error while saving"
                        })
                      }
                      res.status(200).json({
                        savedUser
                      })
                    })
                  }
                }
              })
            }
          })
        } if(!user) {
            //if he is not the user than check if he is in any nodes. Then add the reports to his nodes.
            FamilyMembers.findOne({
              'family.phone': req.body.phone
            }).exec((err, foundFamily) => {
              if (err) {
                req.status(500).json({
                  message: "An error occurred"
                })
              } else {
                if (foundFamily) {
                    console.log('found in the node');
                  foundFamily.family.forEach(element => {
                    if (element.phone === req.body.phone) {
                        console.log('=========pushing image========' );
                      element.reports.push(image);
                      console.log(element, 'element');
                      foundFamily.save((err, savedResult) => {
                        if (err) {
                         return res.status(500).json({
                            message: "error while saving image"
                          })
                        }
                       return res.status(200).json({
                          savedResult
                        })
                      })
                    }
                  });
                } 
                if(!foundFamily){
                    res.status(400).send('Bad Request');
                }
              }})
        }
      }
    })
  }
  if (!phone && email) {
    console.log("========> Finding in users model");
  Users.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).json({
        message: 'An error occurred'
      })
    } else {
      if (user) {
      console.log("found in User model.The lead man. Now searching if he has family nodes");
        FamilyMembers.findOne({
          userId: user._id
        }).exec((err, familyMember) => {
          if (err) {
            res.status(500).json({
              message: "An error occurred"
            })
          }
          if (familyMember) {
              console.log("He is the lead. pushing image to his reports");
            familyMember.reports.push(image);
            familyMember.save((err, result) => {
              if (err) {
                res.status(500).json({
                  message: "error while saving"
                })
              }
              res.status(200).json({
                result
              })
            })
          }
          if (!familyMember) {
              console.log("====== Not the lead so searching in nodes");
            FamilyMembers.findOne({
              'family.email': req.body.email
            }).exec((err, foundFamily) => {
              if (err) {
                req.status(500).json({
                  message: "An error occurred"
                })
              } else {
                if (foundFamily) {
                    console.log('found in the node');
                  foundFamily.family.forEach(element => {
                    if (element.email === req.body.email) {
                        console.log('=========pushing image========' );
                      element.reports.push(image);
                      console.log(element, 'element');
                      foundFamily.save((err, savedResult) => {
                        if (err) {
                         return res.status(500).json({
                            message: "error while saving image"
                          })
                        }
                       return res.status(200).json({
                          savedResult
                        })
                      })
                    }
                  });
                }
                if (!foundFamily) {
                    console.log('could not find in the nodes tooo so creating a new user');
                  const newUser = new FamilyMembers({
                    _id: mongoose.Types.ObjectId(),
                    reports: image
                  })
                  newUser.save((err, savedUser) => {
                    if (err) {
                      res.status(500).json({
                        message: "Error while saving"
                      })
                    }
                    res.status(200).json({
                      savedUser
                    })
                  })
                }
              }
            })
          }
        })
      } if(!user) {
          //if he is not the user than check if he is in any nodes. Then add the reports to his nodes.
          FamilyMembers.findOne({
            'family.email': req.body.email
          }).exec((err, foundFamily) => {
            if (err) {
              req.status(500).json({
                message: "An error occurred"
              })
            } else {
              if (foundFamily) {
                  console.log('found in the node');
                foundFamily.family.forEach(element => {
                  if (element.email === req.body.email) {
                      console.log('=========pushing image========' );
                    element.reports.push(image);
                    console.log(element, 'element');
                    foundFamily.save((err, savedResult) => {
                      if (err) {
                       return res.status(500).json({
                          message: "error while saving image"
                        })
                      }
                     return res.status(200).json({
                        savedResult
                      })
                    })
                  }
                });
              } 
              if(!foundFamily){
                  res.status(400).send('Bad Request');
              }
            }})
      }
    }
  })
}
}

module.exports = {
  uploadImage
}
