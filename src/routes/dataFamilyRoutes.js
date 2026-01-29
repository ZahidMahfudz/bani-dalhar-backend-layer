// const express = require('express');
// const router = express.Router();
// const logger = require('../middleware/loggerMiddleware'); 

import express from 'express';
import logger from '../middleware/loggerMiddleware.js';


// const {getDataFamilyById, getDataById, getDataAll, postAddPersonData, postUpdatePersonData, postDeletePersonData} = require('../controller/dataFamilyController');
import {getDataFamilyById, getDataById, getDataAll, postAddPersonData, postUpdatePersonData, postDeletePersonData} from '../controller/dataFamilyController.js';
const router = express.Router();

router.get("/getDataFamily/:id", logger.requestLogger, getDataFamilyById);
router.get("/getDataById/:id", logger.requestLogger, getDataById);
router.get("/getDataAll", logger.requestLogger, getDataAll);

router.post("/postAddPersonData", logger.requestLogger, postAddPersonData);
router.post("/postUpdatePersonData", logger.requestLogger, postUpdatePersonData);
router.post("/postDeletePersonData", logger.requestLogger, postDeletePersonData);

// module.exports = router;
export default router;