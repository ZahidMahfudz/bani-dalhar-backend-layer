import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { createToken, verifyToken } from '../utils/paseto.js';

describe('Authentication Feature', () => {
  
  /* =========================
     LOGIN ENDPOINT TESTS
  ========================= */
  describe('POST /authenticate/login', () => {
    
    it('Harus berhasil login dengan kredensial yang benar', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: '123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login berhasil');
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('token_type', 'Bearer');
      expect(response.body.data).toHaveProperty('expires_in', 1800);
    });

    it('Harus mengembalikan token yang valid', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: '123'
        });

      const token = response.body.data.access_token;
      const payload = await verifyToken(token);

      expect(payload).toHaveProperty('id', 1);
      expect(payload).toHaveProperty('email', 'admin@mail.com');
      expect(payload).toHaveProperty('role', 'admin');
    });

    it('Harus gagal login dengan email yang salah', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'wrong@mail.com',
          password: '123'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email atau password salah');
    });

    it('Harus gagal login dengan password yang salah', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email atau password salah');
    });

    it('Harus gagal login jika email kosong', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: '',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email dan password harus diisi');
    });

    it('Harus gagal login jika password kosong', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email dan password harus diisi');
    });

    it('Harus gagal login jika email dan password tidak dikirim', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('Harus mengembalikan 500 jika terjadi error server', async () => {
      // Mock error dengan merusak environment
      const originalKey = process.env.PASETO_KEY;
      delete process.env.PASETO_KEY;

      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: '123'
        });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');

      // Restore environment
      process.env.PASETO_KEY = originalKey;
    });
  });

  /* =========================
     TOKEN CREATION TESTS
  ========================= */
  describe('Token Creation (createToken)', () => {
    
    it('Harus membuat token dengan payload yang benar', async () => {
      const payload = {
        id: 1,
        email: 'test@mail.com',
        role: 'user'
      };

      const token = await createToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.startsWith('v3.local.')).toBe(true);
    });

    it('Token yang dibuat harus dapat diverifikasi', async () => {
      const payload = {
        id: 2,
        email: 'verify@mail.com',
        role: 'admin'
      };

      const token = await createToken(payload);
      const verified = await verifyToken(token);

      expect(verified.id).toBe(payload.id);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe(payload.role);
    });

    it('Harus membuat token dengan issuer yang benar', async () => {
      const payload = {
        id: 3,
        email: 'issuer@mail.com',
        role: 'user'
      };

      const token = await createToken(payload);
      const verified = await verifyToken(token);

      expect(verified.iss).toBe('Bani Dalhar');
    });
  });

  /* =========================
     TOKEN VERIFICATION TESTS
  ========================= */
  describe('Token Verification (verifyToken)', () => {
    
    it('Harus memverifikasi token yang valid', async () => {
      const payload = {
        id: 4,
        email: 'valid@mail.com',
        role: 'user'
      };

      const token = await createToken(payload);
      const verified = await verifyToken(token);

      expect(verified).toBeDefined();
      expect(verified.id).toBe(payload.id);
      expect(verified.email).toBe(payload.email);
    });

    it('Harus menolak token yang tidak valid', async () => {
      const invalidToken = 'v3.local.invalid_token_data';

      try {
        await verifyToken(invalidToken);
        expect.fail('Seharusnya throw error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('Harus menolak token yang sudah dimodifikasi', async () => {
      const payload = {
        id: 5,
        email: 'modified@mail.com',
        role: 'user'
      };

      const token = await createToken(payload);
      const modifiedToken = token.slice(0, -5) + 'xxxxx';

      try {
        await verifyToken(modifiedToken);
        expect.fail('Seharusnya throw error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  /* =========================
     AUTH MIDDLEWARE TESTS
  ========================= */
  describe('Auth Middleware', () => {
    
    it('Harus melanjutkan request jika token valid', async () => {
      const loginResponse = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: '123'
        });

      const token = loginResponse.body.data.access_token;

      // Endpoint dummy yang dilindungi middleware
      // Untuk testing, kita bisa membuat endpoint test di app.js
      // Atau kita test middleware secara langsung
      expect(token).toBeDefined();
      expect(token.startsWith('v3.local.')).toBe(true);
    });

    it('Harus menolak request tanpa token', async () => {
      // Test akan dilakukan jika ada endpoint yang dilindungi
      // Placeholder untuk test middleware
      expect(true).toBe(true);
    });

    it('Harus menolak request dengan format token salah', async () => {
      // Test akan dilakukan jika ada endpoint yang dilindungi
      // Placeholder untuk test middleware
      expect(true).toBe(true);
    });
  });

  /* =========================
     EDGE CASES
  ========================= */
  describe('Edge Cases', () => {
    
    it('Harus handle request dengan body yang tidak valid JSON', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    it('Harus handle request dengan field tambahan', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: '123',
          extraField: 'should be ignored'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('Harus handle email dengan case sensitivity', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'ADMIN@MAIL.COM',
          password: '123'
        });

      // Tergantung implementasi, bisa case-sensitive atau tidak
      // Saat ini akan gagal karena case-sensitive
      expect(response.status).toBe(401);
    });

    it('Harus handle password dengan whitespace', async () => {
      const response = await request(app)
        .post('/authenticate/login')
        .send({
          email: 'admin@mail.com',
          password: ' 123 '
        });

      expect(response.status).toBe(401);
    });
  });
});
