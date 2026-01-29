import { V4 } from 'paseto';
import { Buffer } from 'buffer';
import logger from '../config/logger.js';

let key;

/* =========================
   GET SECRET KEY (SAFE)
========================= */
function getKey() {
  if (!key) {
    if (!process.env.PASETO_KEY) {
      logger.error('PASETO_KEY tidak ditemukan di file .env');
      throw new Error('❌ PASETO_KEY tidak didefinisikan. Periksa file .env Anda');
    }

    // 🔐 HARUS 32 byte
    // pakai base64 (sesuai dengan .env.dev)
    key = Buffer.from(process.env.PASETO_KEY, 'base64');
    logger.debug('Secret key PASETO berhasil dimuat dari .env.dev');
  }
  return key;
}

/* =========================
   CREATE TOKEN (LOCAL)
   Token berlaku 30 menit
========================= */
export async function createToken(payload) {
  try {
    logger.debug(`Membuat token untuk user: ${payload.email}`);
    
    // Tambahkan expiration time (30 menit dari sekarang)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    
    const tokenPayload = {
      ...payload,
      iss: 'Bani Dalhar',
      exp: expirationTime.toISOString()
    };
    
    const token = await V4.sign(tokenPayload, getKey());
    
    logger.info(`Token berhasil dibuat untuk user: ${payload.email}`);
    return token;
  } catch (error) {
    logger.error(`Gagal membuat token: ${error.message}`);
    throw error;
  }
}

/* =========================
   VERIFY TOKEN
========================= */
export async function verifyToken(token) {
  try {
    logger.debug('Memverifikasi token...');
    
    const payload = await V4.verify(token, getKey());
    
    // Cek expiration
    if (payload.exp) {
      const expirationDate = new Date(payload.exp);
      if (expirationDate < new Date()) {
        logger.warn('Token sudah kadaluarsa');
        throw new Error('Token expired');
      }
    }
    
    // Cek issuer
    if (payload.iss !== 'Bani Dalhar') {
      logger.warn('Issuer token tidak valid');
      throw new Error('Invalid issuer');
    }
    
    logger.debug(`Token berhasil diverifikasi untuk user: ${payload.email}`);
    return payload;
  } catch (error) {
    logger.warn(`Verifikasi token gagal: ${error.message}`);
    throw error;
  }
}
