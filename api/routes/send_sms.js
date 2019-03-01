const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Users = require('../models/users');
/* const unirest = require('unirest');
const unirestReq = unirest('POST', "https://www.fast2sms.com/dev/bulk"); */
/* const apiKey = 'SsIglq9BuhkHDOn7mNbc5wQxPKztF2f1UVdjLTC0eXJv4YMGAoXNVfebcJZAIgLiTlG7BFs8rPnUxRWv'; */
const request = require('request');
/* let url = "http://api.msg91.com/api/v2/sendsms";
const smsApiKey = "241761AHj4Wys5oNu5bbb3ad5"; */
/* let url = "https://api.bulksms.com/v1/messages"; */
router.post('/bulk', (req, res, next) => {
    console.log('inside bulk');
    const pin= req.body.pin;
    const message = req.body.message
    let numberArray = [];
    // Querying Database
    Users.find({pin: pin}).exec((err, users) => {
        if(err){
            res.status(500).json({
                message:"An error ocurred"
            })
        } else {
            users.forEach(user => {
                numberArray.push(user.phone);
            })
            let numberString = numberArray.join(',');
            let url = `http://login.heightsconsultancy.com/API/WebSMS/Http/v1.0a/index.php?username=TravlP&password=password@123&sender=TravlP&to=${numberString}&message=${message}`;
            //Making request final
            request.get(url).on('response', (response) => {
                res.status(200).json({
                    message: "Message sent successsfuly",
                    response : response
                })
            }) 
        }
    })

/*     request({
        url: url,
        method: 'POST',
        headers:{
            'Authorization': 'Basic cHJpeWFuc2h1bmF5YW4xOnBhc3N3b3Jk'
        },
        json:
            [
                {
                  "from": {
                    "address": "8340326054"
                  },
                  "to": [
                    {
                      "address": "8989943999"
                    }
                  ],
                  "routingGroup": "ECONOMY",
                  "encoding": "TEXT",
                  "longMessageMaxParts": 99,
                  "body": "Hi there, Priyanshu DON!",
                  "userSuppliedId": "submission-12765",
                  "protocolId": "IMPLICIT",
                  "messageClass": "FLASH_SMS",
                  "deliveryReports": "ALL"
                }
              ]
    }, (err, response, body) => {
        if(err){
            return res.status(500).json({
                message: "An error occurred"
            })
        }
        res.status(200).json({
            "message": "Message was sent successfully",
            response: response
        })
    }) */
/*     request({
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authkey': smsApiKey
        },
        json: {
            sender: "SOCKET",
            route: "4",
            country: "91",
            sms: [
                {
                    "message": "This is just a message from msg91",
                    "to": ["9798397555"]
                }
            ]
        }
    }, function (error, response, body) {
        if (error) {
            res.status(500).json({
                message: "An error occurred"
            })
        }
       res.status(200).json(response);
    });
       */
});
  module.exports = router;