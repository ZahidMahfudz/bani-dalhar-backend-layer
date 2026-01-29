import logger from '../config/logger.js';
import { createToken } from '../utils/paseto.js';

/* =========================
   LOGIN CONTROLLER
========================= */
export async function login(req, res) {
  try {
    logger.debug('Menerima request login di controller');
    
    const { email, password } = req.body;

    logger.debug(`Memvalidasi kredensial untuk email: ${email}`);

    // Simulasi validasi user dari database
    // TODO: Ganti dengan query database yang sebenarnya
    if (email !== 'admin@mail.com' || password !== '123') {
      logger.warn(`Login gagal: kredensial tidak valid untuk email: ${email}`);
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      });
    }

    logger.info(`Kredensial valid untuk email: ${email}`);

    // Buat payload token
    const payload = {
      id: 1,
      email: email,
      role: 'admin'
    };

    logger.debug(`Membuat token dengan payload: ${JSON.stringify(payload)}`);
    const token = await createToken(payload);

    logger.info(`User ${email} berhasil login`);

    res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 1800 // 30 menit dalam detik
      }
    });

  } catch (error) {
    logger.error(`Error pada login controller: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
}
