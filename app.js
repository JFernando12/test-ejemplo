const express = require("express");
const bodyParser = require("body-parser");
const router = require('./src/router.js');

const app = express();

// Excellent: Using capital letters for naming constants is a good practice!
const HTTP_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

// Start server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

