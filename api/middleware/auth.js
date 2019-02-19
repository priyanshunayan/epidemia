const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(400).send('Access Denied. No Token Provided');
    }
    try{
        const decoded = jwt.verify(token, 'private');
        req.user = decoded;
        next();
    }
    catch(e){
        res.status(400).send('Invalid Token');
    }
}