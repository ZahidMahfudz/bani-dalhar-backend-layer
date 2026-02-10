import { V4 } from 'paseto';
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

    // 🔐 PASETO_KEY adalah format PEM (private key)
    // Contoh format:
    // -----BEGIN PRIVATE KEY-----
    // MC4CAQAwBQYDK2VwBCIEIGERcTvfwiYrjRDhZu4Gmk+WDU/JFoipI3et1U+mPY52
    // -----END PRIVATE KEY-----
    
    key = process.env.PASETO_KEY;
    logger.debug('Secret key PASETO berhasil dimuat dari .env.dev');
    logger.debug(`KEY (first 50 chars): ${key}`);
  }
  return key;
}

/* =========================
   CREATE TOKEN (PUBLIC)
   Token berlaku 30 menit
   Menggunakan public key (asymmetric)
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
    
    logger.debug(`Token payload: ${JSON.stringify(tokenPayload)}`);
    
    const token = await V4.sign(tokenPayload, getKey());
    
    logger.info(`Token berhasil dibuat untuk user: ${payload.email}`);
    return token;
  } catch (error) {
    logger.error(`Gagal membuat token: ${error.message}`);
    throw error;
  }
}

/* =========================
   VERIFY TOKEN (PUBLIC)
   Menggunakan public key (asymmetric)
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
