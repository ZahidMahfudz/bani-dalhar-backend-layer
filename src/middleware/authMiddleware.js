import logger from '../config/logger.js';
import { verifyToken } from '../utils/paseto.js';

/* =========================
   AUTH MIDDLEWARE
   Validasi token PASETO dari header Authorization
========================= */
export async function authMiddleware(req, res, next) {
  try {
    logger.debug('Memproses auth middleware');

    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn('Request tanpa header Authorization');
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan'
      });
    }

    // Format: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn('Format Authorization header tidak valid');
      return res.status(401).json({
        status: 'error',
        message: 'Format token tidak valid. Gunakan: Bearer <token>'
      });
    }

    const token = parts[1];
    logger.debug('Token ditemukan, memverifikasi...');

    // Verifikasi token
    const payload = await verifyToken(token);

    logger.debug(`Token berhasil diverifikasi untuk user: ${payload.email}`);

    // Simpan payload ke request object untuk digunakan di controller
    req.user = payload;

    next();

  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);

    // Cek jenis error
    if (error.message.includes('expired') || error.message.includes('Expired')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token sudah kadaluarsa. Silakan login kembali'
      });
    }

    res.status(401).json({
      status: 'error',
      message: 'Token tidak valid'
    });
  }
}
