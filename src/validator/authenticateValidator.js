import { body, validationResult } from 'express-validator';
import logger from '../config/logger.js';

/* =========================
   VALIDASI LOGIN
========================= */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Format email tidak valid'),
  
  body('password')
    .notEmpty().withMessage('Password harus diisi')
    .isLength({ min: 1 }).withMessage('Password tidak boleh kosong'),
  
  // Middleware untuk handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn(`Validasi login gagal: ${JSON.stringify(errors.array())}`);
      
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    
    logger.debug('Validasi login berhasil');
    next();
  }
];
