const express = require('express');
const router = express.Router();
const logger = require('../middleware/loggerMiddleware'); 

const {getDataFamilyById, getDataById, getDataAll, postAddPersonData} = require('../controller/dataFamilyController');

router.get("/getDataFamily/:id", logger.requestLogger, getDataFamilyById);
router.get("/getDataById/:id", logger.requestLogger, getDataById);
router.get("/getDataAll", logger.requestLogger, getDataAll);

router.post("/postAddPersonData", logger.requestLogger, postAddPersonData);

module.exports = router;