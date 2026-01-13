const express = require('express');
const router = express.Router();
const logger = require('../middleware/loggerMiddleware'); 

const {getDataFamilyById} = require('../controller/dataFamilyController');

router.get("/getData/:id", logger.requestLogger, getDataFamilyById);

module.exports = router;