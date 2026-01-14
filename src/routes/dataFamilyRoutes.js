const express = require('express');
const router = express.Router();
const logger = require('../middleware/loggerMiddleware'); 

const {getDataFamilyById, getDataById, getDataAll} = require('../controller/dataFamilyController');

router.get("/getDataFamily/:id", logger.requestLogger, getDataFamilyById);
router.get("/getDataById/:id", logger.requestLogger, getDataById);
router.get("/getDataAll", logger.requestLogger, getDataAll);

module.exports = router;