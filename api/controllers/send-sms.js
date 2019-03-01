// Sending one to one message...
/* 
const nexmo = require('nexmo');
const socketio = require('socket.io');

const nexmo = new Nexmo({
  apiKey: 'd1deebf5',
  apiSecret: 'RpuRbPB5G6kgz6xl'
}, {
  debug: true
})

const sendSms = (req, res, next) => {
  const number = req.body.number;
  const message = req.body.message;
  const from = 'Priyanshu '
  const to = '919587585993'
  const text = 'Hello from Priyanshu'
  nexmo.message.sendSms(from, to, text, {type: 'unicode'}, ((err, responseData) => {
      if(err){
          res.status(500).json({
              message: 'An error occurredd'
          })
      } else {
          console.dir(responseData);  
      }
  }));
} */


//using fast2sms


