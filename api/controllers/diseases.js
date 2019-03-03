const mongoose = require('mongoose');
const DiseaseModel = require('../models/diseases');
const SymptomsModel = require('../models/symptoms');


const getDisease = (req, res, next) => {
    const query = req.query.symptoms;
    const symptoms = query.split(',');
    const symptomsArray = [];
    const diseaseArray = [];
    symptoms.forEach(element => {
        console.log("========== Begin searching symptoms=================")
        SymptomsModel.find({'description':element}).exec((err, symptoms) => {
            console.log("=======found one ==============")
            if(err){
                res.status(500).json({
                    message: "An error occurred"
                })
            }
            console.log("=========puhsed==========", symptoms);
            if(symptoms){
                symptomsArray.push(symptoms[0].id);
            }
           
        })    
    });

    DiseaseModel.find({}).limit(10).exec((err, diseases) => {
        console.log("=========Inside the Disease Model ===============");
        if(err){
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
                    if(ids === symptomIds){
                        console.log("matched");
                        ++count;
                    }
                })
            })
            if(count > 0 ){
                console.log("------count===========");
            
            
                
                    diseaseArray.push({
                        disease: disease,
                        percentMatch: count/symptomsArray.length*100
                        
                    })
                
                
            }
        })
        console.log("======displaying response=======");
        diseaseArray.sort(function(a,b){
            return b.percentMatch-a.percentMatch;
        })

        if(diseaseArray.length>10){
            diseaseArray.forEach((diseases, index) => {
                if(diseases.percentMatch < 100){
                    console.log(index);
                    diseaseArray.splice(index, 1);
                }
            })
        }
        res.status(200).json({
            res: diseaseArray.slice(10)
        })
    })
}

const getSymptoms = (req, res, next) => {
    SymptomsModel.find({}).exec((err, symptoms) => {
        if(err) {
            res.status(500).json({
                message: "An error occurred"
            })
        }
        if(symptoms){
            res.status(200).json({
                symptoms
            })
        }
        if(!symptoms) {
            res.status(200).json({
                message: "No symptoms are found"
            })
        }
    })
}


module.exports = {
    getDisease,
    getSymptoms
}