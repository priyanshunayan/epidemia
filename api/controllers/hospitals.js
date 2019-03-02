const Hospitals = require('../models/hospitals');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const addHospitals = (req, res, next) => {
  const hospitals = new Hospitals({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    location: req.body.location,
    totalBeds: req.body.totalBeds,
    emptyBeds: req.body.emptyBeds
  });
  hospitals.save().then(hospitals => {
    res.status(201).json({
      message: "Hospital Added Successfully",
      hospital: hospitals
    });
  }).catch(e => {
    console.log("Error while saving Hospitals", e);
  })
}

const signUp = async (req, res, next) => {
  const name = req.body.name;
  const type = req.body.type;
  const location = req.body.location;
  const username = req.body.username;
  const password = req.body.password;

  if (req.body.username) {
    let hospital = await Hospitals.findOne({
      username: req.body.username
    });
    if (hospital) {
      return res.status(400).json({
        "message": "Username already taken"
      });
    } else {
      hospital = new Hospitals({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        totalBeds: req.body.totalBeds,
        emptyBeds: req.body.emptyBed,
        username: req.body.username,
        password: req.body.password
      })

      const salt = await bcrypt.genSalt(10);

      hospital.password = await bcrypt.hash(hospital.password, salt);

      await hospital.save();
      jwt.sign({
        hospital
      }, 'private', {
        expiresIn: '1y'
      }, (err, token) => {
        if (err) {
          console.log(err)
        }
        res.status(200).json({
          message: "Logged in successfully",
          hospital: hospital,
          token: token
        });
      });
    }
  }
}

const login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password
  console.log("username", username);
  Hospitals.findOne({
    username: req.body.username
  }).exec((err, hospital) => {
    if (err) {
      res.status(500).json({
        message: "An error Occurred"
      })
    }
    console.log('hospital', hospital);
    if (hospital) {
      console.log("==========FOUND HOSPITAL===========");
      bcrypt.compare(req.body.password, hospital.password, (err, validPassword) => {
        if (err) {
          res.status(500).json({
            message: "error occurred"
          })
        }
        if (!validPassword) {
          return res.status(400).send("Invalid username or password");
        }
        if (validPassword) {
          console.log("PASSWORD VERIFIED");
          jwt.sign({
            hospital
          }, 'private', {
            expiresIn: '1y'
          }, (err, token) => {
            if (err) {
              console.log(err)
            }
            res.status(200).json({
              token: token,
              hospital: hospital
            });
          });
        }
      });
    }
  })

}
const addPatient = (req, res, next) => {
  const userEmail = req.body.userEmail;
  const hospitalId = req.body.id;
  User.findOne({
    email: userEmail
  }).exec((err, user) => {
    if (err) {
      res.status(500).send("Error");
    }
    if (user) {
      Hospitals.findById(hospitalId).exec((err, hospital) => {
        if (err) {
          res.status(500).send("Error");
        }
        if (hospital) {
          if (hospital.patients.indexOf(user._id) == -1) {
            hospital.patients.push(user._id);
          }
          hospital.save((err, savedHospital) => {
            if (err) {
              res.status(500).send("Error");
            }
            res.status(200).json({
              hospital: savedHospital
            })
          })
        }
      })
    }
  })
}

const getAllPatients = (req, res, next) => {
  const id = req.params.id;
  Hospitals.findById(id).populate('patients').exec((err, hospital) => {
    if (err) {
      res.status(500).json({
        message: "An err occurred"
      })
    }
    if (hospital) {
      res.status(200).json({
        patients: hospital.patients
      })
    }
    if (!hospital) {
      res.status(400).send("bad request");
    }
  })
}

const getSinglePatient = (req, res, next) => {
  const patientId = req.query.patientId;
  const id = req.query.hospitalId;
  Hospitals.findById(id).exec((err, hospital) => {
    if (err) {
      res.status(500).json({
        message: "An err occurred"
      })
    }
    if (hospital) {
      if (hospital.patients.indexOf(patientId) !== -1) {
        User.findById(patientId).exec((err, response) => {
          if (err) {
            res.status(500).json({
              message: "An err occurred"
            })
          }
          if (response) {
            res.status(200).json({
              patient: response
            })
          }
          if (!response) {
            res.status(400).json({
              message: "Not found"
            })
          }
        })
      }
    }
  })
}

const removePatient = (req, res, next) => {
  const id = req.body.patientId;
  const HospitalId = req.body.hospitalId;

  Hospitals.findById(HospitalId).exec((err, hospitals) => {
    if (err) {
      res.status(500).json({
        message: "An err occurred"
      })
    }
    if (hospitals) {
      console.log("Inside Hospitals", hospitals.patients);
      hospitals.patients.forEach((patient, index) => {
          console.log(patient, index, id);
        if (patient.toString() === id) {
            console.log("inside the arr");
          hospitals.patients.splice(index, 1);
        }
      })
      hospitals.save((err, hospital) => {
        if (err) {
          res.status(500).json({
            "message": "err"
          })
        }
        res.status(200).json({
          hospital: hospital
        })
      })
    }
  })
}

const getMedicineStock = (req, res, next) => {
    const hospitalId = req.query.hospitalId;

    Hospitals.findById(hospitalId).exec((err, hospital) => {
      if(err){
        return res.status(500).json({
          message: 'An error occurred'
        })
      }
      if(hospital){
        res.status(200).json({
          stocks: hospital.stock
        })
      }
      if(!hospital){
        return res.status(400).json({
          message: 'No documents found'
        })
      }
    })
}
const addMedicineStock = (req, res, next) => {
  const hospitalId = req.body.hospitalId;
  const stock = req.body.stock;
  Hospitals.findById(hospitalId).exec((err, hospital) => {
    if(err){
      return res.status(500).json({
        message: 'An error occurred'
      })
    }
    if(hospital){
      hospital.stock.push(stock);
      hospital.save((err, saved) => {
        if(err){
          return res.status(500).json({
            message: 'An error occurred'
          })
        }
        if(saved){
          res.status(200).json({
            saved
          })
        }
      })
    }
  })
}

const updateMedicineStock = (req, res, next) => {
  const hospitalId = req.body.hospitalId;
  const medicineId = req.body.medicineId;
  const quantity = req.body.quantity;
  Hospitals.findById(hospitalId).exec((err, hospital) => {
    if(err){
      return res.status(500).json({
        message: 'An error occurred'
      })
    }
    if(hospital) {
      console.log(hospital.stock[0]._id);
      hospital.stock.forEach(stock => {
        if((stock._id).toString() === medicineId.toString()) {
            stock.quantity = quantity;   
            hospital.save((err, stock) => {
              if(err){
                return res.status(500).json({
                  message: 'An error occurred'
                })
              }
              res.status(200).json({
                stock
              })
            })   
        }
      })
      
    }
  })
}
module.exports = {
  addHospitals,
  signUp,
  login,
  addPatient,
  getAllPatients,
  getSinglePatient,
  removePatient,
  getMedicineStock,
  addMedicineStock,
  updateMedicineStock
}
