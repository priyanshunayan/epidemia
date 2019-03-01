const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
/* const unirest = require('unirest');
const unirestReq = unirest('POST', "https://www.fast2sms.com/dev/bulk"); */
/* const apiKey = 'SsIglq9BuhkHDOn7mNbc5wQxPKztF2f1UVdjLTC0eXJv4YMGAoXNVfebcJZAIgLiTlG7BFs8rPnUxRWv'; */
const request = require('request');
/* let url = "http://api.msg91.com/api/v2/sendsms";
const smsApiKey = "241761AHj4Wys5oNu5bbb3ad5"; */
let url = "https://api.bulksms.com/v1/messages";

router.post('/bulk', (req, res, next) => {
    console.log('inside bulk');
    const sender = 'FSTSMS';
    const message = req.body.message;
    const language ='english';
    const route = 'p';
    const numbers = req.body.numbers;
   // req.header('Authorization', 'Basic DBFB4890966C4A689E08C17E45325C2F-02-7');
 /*    request.get(`http://103.16.101.52:8080/sendsms/bulksms?username=adar-ezytech&password=sms12345&type=0&dlr=1&destination=8340326054,9827629560&source=EZYPAY&message=${message}`).on('response', (response) => {
        res.status(200).json({
            message: 'Message sent successfully',
            response: response
        })
    }); */
    request({
        url: url,
        method: 'POST',
        headers:{
            'Authorization': 'Basic cHJpeWFuc2h1bmF5YW46cGFzc3dvcmQ='
        },
        json:
            [
                {
                  "from": {
                    "type": "INTERNATIONAL",
                    "address": "8340326054"
                  },
                  "to": [
                    {
                      "type": "INTERNATIONAL",
                      "address": "9798397555",
                      "fields": [
                        "Jack",
                        "$200.00"
                      ]
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
    })
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