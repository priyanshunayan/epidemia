const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Hi there"
    })
})


app.listen(port, () => {
    console.log(`port listening at ${port}`);
})