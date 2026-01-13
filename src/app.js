const express = require('express');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
    logger.info('Root endpoint accessed');
});

module.exports = app;