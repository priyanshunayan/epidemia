const cron = require('node-cron');

const getNews = () => {
    cron.schedule('*/2 * * * *', () => {
        console.log('running a task every two minutes');
      });
}



module.exports = {
    getNews
}
