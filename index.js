const express = require('express');
const app = express();
const mongoose = require('mongoose');
// To parse incoming post requests url encoded or json... 
const bodyParser = require('body-parser');
const hospitalRoute = require('./api/routes/hospitals');
const userRoutes = require('./api/routes/users');
const authRoute = require('./api/routes/auth');
const sendSMS = require('./api/routes/send_sms');
const diseaseRoute = require('./api/routes/disease');
const newsRoute = require('./api/routes/news-scrape');
const cron = require('node-cron');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('6bede71c609049799c43a93512d18c20');
const notificationModel = require('./api/models/notifications');
const rp = require('request-promise');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
//CRON JOB RUNNING
cron.schedule('*/5 * * * *', () => {
  /*     console.log("CRON JOB RUNNING");
      let notification = new notificationModel({
          _id: mongoose.Types.ObjectId(),
          headline: 'Headline',
          description: 'This is a description'
      })
      notification.save((err, notification) => {
          if(err){
              console.log(err);
          }
          if(notification) {
              console.log(notification);
          }
      }) */
  console.log('running a task every minute');
  rp.get('http://192.168.225.35:8000/predict/epidemic')
    .then(res => {
      res = JSON.parse(res);
      res['latitude'] = JSON.parse(res['latitude']);
      res['longitude'] = JSON.parse(res['longitude']);
      res['output'] = JSON.parse(res['output']);
      res['pincode'] = JSON.parse(res['pincode']);
      const latArr = res['latitude'];
      const lngArr = res['longitude'];
      const outputArr = res['output'];
      const pincodeArr = res['pincode'];
      const finalData = new Array(5);
      outputArr.forEach((el, i) => {
        if (!finalData[outputArr[i]]) {
          finalData[outputArr[i]] = [];
        }
        if (finalData[outputArr[i]].indexOf(pincodeArr[i] === -1)) {
          finalData[outputArr[i]].push(
            pincodeArr[i]
          );
        }
      });
      return finalData;
    })
    .then(dataArray => {
      console.log(dataArray);
      return dataArray;
    })
    .then((dataArray) => {
        let options = {
            method: "POST",
            uri: "https://us-central1-sih19-ecc40.cloudfunctions.net/api/notify-hospital",
            body: {
                alertLevel: '',
                category: "Epidemic Alert",
                description : "This is an alert",
                pincodes: []
            },
            json: true
        }
        if(dataArray[3]) {
           
               options.body.pincodes = dataArray[3]
               options.body.alertLevel = 'Medium'
                rp(options).then(res => console.log(res))
                
        }
        if(dataArray[4]) {
            options.body.pincodes = dataArray[4]
            options.body.alertLevel = 'High'
             rp(options).then(res => console.log(res))
        }
       

    })
});





require('./startup/prod')(app);

// port to get from environment variable
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Remove CORS Error 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
// mongo db connection
mongoose.connect('mongodb+srv://priyanshunayan:priyanshunayan@epidemia-2yafu.mongodb.net/epidemia?retryWrites=true', {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('mongo db connected');
});

app.use('/', hospitalRoute);
app.use('/', userRoutes);
app.use('/', authRoute);
app.use('/', sendSMS);
app.use('/', diseaseRoute);
app.use('/', newsRoute);
//routes which don't match the above routes will pass through this and give error.
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})
//Errors like Database query failed will pass through this.
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})

//server start up
app.listen(process.env.PORT || 5000, () => {
  console.log(`port listening at ${port}`);
})

module.exports = app;
