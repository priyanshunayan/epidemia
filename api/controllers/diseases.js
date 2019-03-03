const mongoose = require('mongoose');
const DiseaseModel = require('../models/diseases');
const SymptomsModel = require('../models/symptoms');
const DataModel = require('../models/user-data');

const getDisease = (req, res, next) => {
  const query = req.query.symptoms;
  const symptoms = query.split(',');
  const symptomsArray = [];
  const diseaseArray = [];
  symptoms.forEach(element => {
    console.log("========== Begin searching symptoms=================")
    SymptomsModel.find({
      'description': element
    }).exec((err, symptoms) => {
      console.log("=======found one ==============")
      if (err) {
        res.status(500).json({
          message: "An error occurred"
        })
      }
      console.log("=========puhsed==========", symptoms);
      if (symptoms) {
        symptomsArray.push(symptoms[0].id);
      }

    })
  });

  DiseaseModel.find({}).exec((err, diseases) => {
    console.log("=========Inside the Disease Model ===============");
    if (err) {
      res.status(500).json({
        message: "An error occurred"
      })
    }
    console.log("Symptoms Array", symptomsArray);
    diseases.forEach(disease => {
      let count = 0;
      //console.log("found Disease");
      // console.log(disease.symptom_ids);
      disease.symptom_ids.forEach(ids => {
        //  console.log("ids,", ids);
        symptomsArray.forEach(symptomIds => {
          // console.log("++++++++++++comparing+++++++++++++++");
          if (ids === symptomIds) {
            console.log("matched");
            ++count;
          }
        })
      })
      if (count > 0) {
        console.log("------count===========");
        diseaseArray.push({
          disease: disease,
          percentMatch: count / symptomsArray.length * 100
        })
      }
    })
    console.log("======displaying response=======");
    diseaseArray.sort(function (a, b) {
      return b.percentMatch - a.percentMatch;
    })

    if (diseaseArray.length > 10) {
      diseaseArray.forEach((diseases, index) => {
        if (diseases.percentMatch < 100) {
          console.log(index);
          diseaseArray.splice(index, 1);
        }
      })
    }
    diseaseArray.length = 10;
    res.status(200).json({
      res: diseaseArray
    })
  })
}

const getSymptoms = (req, res, next) => {
  SymptomsModel.find({}).exec((err, symptoms) => {
    if (err) {
      res.status(500).json({
        message: "An error occurred"
      })
    }
    if (symptoms) {
      res.status(200).json({
        symptoms
      })
    }
    if (!symptoms) {
      res.status(200).json({
        message: "No symptoms are found"
      })
    }
  })
}

const getDiseases = (req, res, next) => {
  DiseaseModel.find({}).limit(10).exec((err, diseases) => {
    if (err) {
      res.status(500).json({
        message: "An error occurred"
      })
    }
    if (diseases) {
      console.log("+=========Diseases-=======");
      res.status(200).json({
        diseases
      })
    }
    if (!diseases) {
      res.status(400).json({
        message: "No records found"
      })
    }
  })
}
const getSymptomsOfDisease = (req, res, next) => {
    const diseaseId = req.params.id;
    let symptomsArray = [];
    DiseaseModel.findById(diseaseId).exec((err, response) => {
      console.log("Inside the disease model");
        if(err){
            res.status(500).json({
                message: "an error occurred"
            })
        }
        if(response) {
            response.symptom_ids.forEach(id => {
                SymptomsModel.findOne({id:id}).exec((err, responseSymptoms) => {
                    if(err){
                        res.status(500).json({
                            message: "an error occurred"
                        })
                    }
                    if(responseSymptoms) {
                      console.log("inside res");
                      symptomsArray.push(responseSymptoms);
                    }
                })
            });
            setTimeout(() => {
              res.status(200).json({
                response,
                symptomsArray
            })
            }
           , 2000);
        }
    })
}

const postData = (req, res, next) => {
  const symptoms = req.body.symptoms;
  const epidemic = req.body.epidemic;
  const recentDisease = req.body.recentDisease;
  const UserId = req.body.userId;

  let Data = new DataModel({
      _id: mongoose.Types.ObjectId(),
      symptoms: symptoms,
      epidemic: epidemic,
      recentDisease: recentDisease,
      userId : UserId
  })

  Data.save((err, data) => {
      if(err){
          res.status(500).json({
              "message": "An error occurred"
          })
      }
      if(data){
          res.status(200).json({
              data
          })
      }
      if(!data){
          res.status(400).json({
              message: "No records found"
          })
      }
  })
}

module.exports = {
  getDisease,
  getSymptoms,
  getDiseases,
  getSymptomsOfDisease,
  postData
}
