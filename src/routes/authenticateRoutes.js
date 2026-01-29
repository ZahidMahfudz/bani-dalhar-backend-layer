import express from 'express';
import { login } from '../controller/authenticateController.js';
import { validateLogin } from '../validator/authenticateValidator.js';
import logger from '../config/logger.js';

const router = express.Router();

logger.debug('Inisialisasi authenticateRoutes');

/* =========================
   POST /authenticate/login
   Login endpoint dengan validasi
========================= */
router.post(
  '/login',
  (req, res, next) => {
    logger.debug('Request masuk ke endpoint POST /authenticate/login');
    next();
  },
  validateLogin,
  login
);

export default router;
