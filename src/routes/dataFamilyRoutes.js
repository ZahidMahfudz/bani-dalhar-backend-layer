import express from 'express';
import logger from '../middleware/loggerMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


// const {getDataFamilyById, getDataById, getDataAll, postAddPersonData, postUpdatePersonData, postDeletePersonData} = require('../controller/dataFamilyController');
import {getDataFamilyById, getDataById, getDataAll, postAddPersonData, postUpdatePersonData, postDeletePersonData} from '../controller/dataFamilyController.js';
const router = express.Router();

router.get("/getDataFamily/:id", logger.requestLogger, authMiddleware, getDataFamilyById);
router.get("/getDataById/:id", logger.requestLogger, authMiddleware ,getDataById);
router.get("/getDataAll", logger.requestLogger, authMiddleware, getDataAll);

router.post("/postAddPersonData", logger.requestLogger, authMiddleware, postAddPersonData);
router.post("/postUpdatePersonData", logger.requestLogger, authMiddleware, postUpdatePersonData);
router.post("/postDeletePersonData", logger.requestLogger, authMiddleware, postDeletePersonData);

// module.exports = router;
export default router;