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
require('./startup/prod')(app);
// port to get from environment variable
const port = 3000;

app.use(bodyParser.urlencoded({extended:false }));
app.use(bodyParser.json());

// Remove CORS Error 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
// mongo db connection
mongoose.connect('mongodb+srv://priyanshunayan:priyanshunayan@epidemia-2yafu.mongodb.net/epidemia?retryWrites=true', {useNewUrlParser:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('mongo db connected');
});

app.use('/', hospitalRoute);
app.use('/', userRoutes);
app.use('/', authRoute);
app.use('/', sendSMS);
app.use('/', diseaseRoute);
//routes which don't match the above routes will pass through this and give error.
app.use((req, res, next) => {
    const error  = new Error('Not Found');
    error.status = 404;
    next(error);
})
//Errors like Database query failed will pass through this.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
})

//server start up
app.listen(process.env.PORT || 5000, () => {
    console.log(`port listening at ${port}`);
})

module.exports = app;