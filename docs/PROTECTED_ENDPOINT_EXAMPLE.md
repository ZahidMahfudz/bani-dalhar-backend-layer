# Contoh Implementasi Endpoint Terproteksi

Dokumentasi ini menunjukkan cara membuat endpoint yang dilindungi dengan middleware autentikasi.

## Struktur Dasar

### 1. Import Middleware di Route File

```javascript
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import logger from '../config/logger.js';

const router = express.Router();

// Endpoint terproteksi
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    logger.debug('Mengakses endpoint /profile');
    
    // req.user berisi payload token yang sudah diverifikasi
    const user = req.user;
    
    logger.info(`User ${user.email} mengakses profile`);
    
    res.status(200).json({
      status: 'success',
      message: 'Profile berhasil diambil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Error pada endpoint profile: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
});

export default router;
```

## Contoh Implementasi Lengkap

### Scenario: Endpoint untuk Mendapatkan Data User

**File**: `src/routes/userRoutes.js`

```javascript
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import logger from '../config/logger.js';

const router = express.Router();

/* =========================
   GET /user/profile
   Endpoint terproteksi untuk mendapatkan profile user
========================= */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    logger.debug('Menerima request GET /user/profile');
    
    const user = req.user;
    
    logger.info(`User ${user.email} mengakses profile`);
    
    res.status(200).json({
      status: 'success',
      message: 'Profile berhasil diambil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Error pada GET /user/profile: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
});

/* =========================
   PUT /user/profile
   Endpoint terproteksi untuk update profile user
========================= */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    logger.debug('Menerima request PUT /user/profile');
    
    const user = req.user;
    const { name, phone } = req.body;
    
    logger.debug(`Update profile untuk user: ${user.email}`);
    
    // TODO: Update ke database
    
    logger.info(`Profile user ${user.email} berhasil diupdate`);
    
    res.status(200).json({
      status: 'success',
      message: 'Profile berhasil diupdate',
      data: {
        id: user.id,
        email: user.email,
        name: name,
        phone: phone
      }
    });
  } catch (error) {
    logger.error(`Error pada PUT /user/profile: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
});

export default router;
```

**File**: `src/app.js` (tambahkan route)

```javascript
import userRoutes from './routes/userRoutes.js';

// Mount routes
app.use('/user', userRoutes);
```

## Testing Endpoint Terproteksi

### 1. Dengan cURL

```bash
# Step 1: Login untuk mendapatkan token
TOKEN=$(curl -s -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mail.com",
    "password": "123"
  }' | jq -r '.data.access_token')

# Step 2: Gunakan token untuk akses endpoint terproteksi
curl -X GET http://localhost:4050/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Dengan Postman

**Step 1: Login**
- Method: POST
- URL: `http://localhost:4050/authenticate/login`
- Body:
  ```json
  {
    "email": "admin@mail.com",
    "password": "123"
  }
  ```
- Copy token dari response

**Step 2: Akses Endpoint Terproteksi**
- Method: GET
- URL: `http://localhost:4050/user/profile`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer <token_dari_step_1>`
- Send

### 3. Dengan JavaScript/Fetch

```javascript
async function accessProtectedEndpoint() {
  try {
    // Step 1: Login
    const loginResponse = await fetch('http://localhost:4050/authenticate/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@mail.com',
        password: '123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.data.access_token;

    // Step 2: Akses endpoint terproteksi
    const profileResponse = await fetch('http://localhost:4050/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile:', profileData);

  } catch (error) {
    console.error('Error:', error);
  }
}

accessProtectedEndpoint();
```

## Response Scenarios

### Success Response (200 OK)

```json
{
  "status": "success",
  "message": "Profile berhasil diambil",
  "data": {
    "id": 1,
    "email": "admin@mail.com",
    "role": "admin"
  }
}
```

### Error - Token Tidak Ditemukan (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Token tidak ditemukan"
}
```

### Error - Token Kadaluarsa (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Token sudah kadaluarsa. Silakan login kembali"
}
```

### Error - Token Tidak Valid (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Token tidak valid"
}
```

## Best Practices

1. **Selalu Gunakan HTTPS** di production untuk melindungi token saat transit

2. **Jangan Simpan Token di LocalStorage** jika memungkinkan, gunakan HttpOnly cookies

3. **Refresh Token** - Implementasikan refresh token untuk user experience yang lebih baik

4. **Token Rotation** - Pertimbangkan untuk rotate token secara berkala

5. **Logging** - Selalu log akses ke endpoint terproteksi untuk audit trail

6. **Rate Limiting** - Implementasikan rate limiting untuk mencegah brute force attacks

7. **CORS** - Konfigurasi CORS dengan benar untuk production

## Troubleshooting

### Error: "Token tidak ditemukan"
- Pastikan header Authorization sudah dikirim
- Format: `Authorization: Bearer <token>`

### Error: "Token sudah kadaluarsa"
- Token berlaku 30 menit
- Login kembali untuk mendapatkan token baru

### Error: "Token tidak valid"
- Token mungkin sudah dimodifikasi
- Coba login kembali

### Middleware tidak berjalan
- Pastikan middleware sudah di-import dengan benar
- Pastikan middleware ditempatkan sebelum handler di route definition
