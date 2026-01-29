# Quick Start - Fitur Autentikasi

## 🚀 Mulai Cepat

### 1. Jalankan Server

```bash
npm run dev
```

Output yang diharapkan:
```
[timestamp] [Level: info] [Pesan: Environment: Development]
[timestamp] [Level: info] [Pesan: Server is running on port 4050]
[timestamp] [Level: info] [Pesan: server started at http://localhost:4050]
```

### 2. Test Login

**Dengan cURL**:
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mail.com",
    "password": "123"
  }'
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "access_token": "v3.local.eyJkYXRhIjoiZXhhbXBsZSJ9...",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

### 3. Gunakan Token untuk Endpoint Terproteksi

Simpan token dari response login:
```bash
TOKEN="v3.local.eyJkYXRhIjoiZXhhbXBsZSJ9..."
```

Gunakan token di header Authorization:
```bash
curl -X GET http://localhost:4050/protected-endpoint \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Test Scenarios

### ✅ Success Case

```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

**Expected**: 200 OK dengan access_token

---

### ❌ Error Cases

#### 1. Email Kosong
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "", "password": "123"}'
```

**Expected**: 400 Bad Request
```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [{"field": "email", "message": "Email harus diisi"}]
}
```

#### 2. Email Format Tidak Valid
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
```

**Expected**: 400 Bad Request
```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [{"field": "email", "message": "Format email tidak valid"}]
}
```

#### 3. Password Kosong
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": ""}'
```

**Expected**: 400 Bad Request
```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [{"field": "password", "message": "Password harus diisi"}]
}
```

#### 4. Kredensial Salah
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "wrong"}'
```

**Expected**: 401 Unauthorized
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

---

## 🔐 Middleware Testing

### Test Endpoint Terproteksi

Buat endpoint test di `src/routes/authenticateRoutes.js`:

```javascript
import { authMiddleware } from '../middleware/authMiddleware.js';

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    data: req.user
  });
});
```

#### Test dengan Token Valid
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}' | jq -r '.data.access_token')

# 2. Akses endpoint terproteksi
curl -X GET http://localhost:4050/authenticate/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: 200 OK dengan user data

#### Test Tanpa Token
```bash
curl -X GET http://localhost:4050/authenticate/profile
```

**Expected**: 401 Unauthorized
```json
{
  "status": "error",
  "message": "Token tidak ditemukan"
}
```

#### Test dengan Format Token Salah
```bash
curl -X GET http://localhost:4050/authenticate/profile \
  -H "Authorization: InvalidFormat token"
```

**Expected**: 401 Unauthorized
```json
{
  "status": "error",
  "message": "Format token tidak valid. Gunakan: Bearer <token>"
}
```

---

## 📊 Logging Output

Saat menjalankan test, perhatikan console output:

### Login Success
```
[2024-01-29 23:30:00] [Level: debug] [Pesan: Request masuk ke endpoint POST /authenticate/login]
[2024-01-29 23:30:00] [Level: debug] [Pesan: Validasi login berhasil]
[2024-01-29 23:30:00] [Level: debug] [Pesan: Menerima request login di controller]
[2024-01-29 23:30:00] [Level: info] [Pesan: Kredensial valid untuk email: admin@mail.com]
[2024-01-29 23:30:00] [Level: info] [Pesan: Token berhasil dibuat untuk user: admin@mail.com]
[2024-01-29 23:30:00] [Level: info] [Pesan: User admin@mail.com berhasil login]
```

### Validation Error
```
[2024-01-29 23:30:15] [Level: debug] [Pesan: Request masuk ke endpoint POST /authenticate/login]
[2024-01-29 23:30:15] [Level: warn] [Pesan: Validasi login gagal: [{"value":"","msg":"Email harus diisi","param":"email","location":"body"}]]
```

### Token Verification
```
[2024-01-29 23:30:30] [Level: debug] [Pesan: Memproses auth middleware]
[2024-01-29 23:30:30] [Level: debug] [Pesan: Token ditemukan, memverifikasi...]
[2024-01-29 23:30:30] [Level: info] [Pesan: Token berhasil diverifikasi untuk user: admin@mail.com]
```

---

## 🛠️ Troubleshooting

### Error: "Cannot read properties of undefined"
- Pastikan PASETO_KEY sudah didefinisikan di `.env.dev`
- Pastikan format PASETO_KEY adalah base64 string

### Error: "Token tidak ditemukan"
- Pastikan header Authorization sudah dikirim
- Format: `Authorization: Bearer <token>`

### Error: "Token sudah kadaluarsa"
- Token berlaku 30 menit
- Login kembali untuk mendapatkan token baru

---

## 📚 Dokumentasi Lengkap

- `docs/AUTHENTICATION.md` - Dokumentasi API lengkap
- `docs/PROTECTED_ENDPOINT_EXAMPLE.md` - Contoh implementasi endpoint terproteksi
- `docs/FIXES_AND_IMPROVEMENTS.md` - Penjelasan perbaikan yang dilakukan
- `docs/IMPLEMENTATION_SUMMARY.md` - Ringkasan implementasi
- `docs/IMPLEMENTATION_CHECKLIST.md` - Checklist verifikasi

---

## 🎯 Kredensial Default

- **Email**: `admin@mail.com`
- **Password**: `123`

⚠️ **PENTING**: Ganti dengan database query di production!

---

## ✨ Fitur Tambahan

Untuk menambahkan endpoint terproteksi baru:

```javascript
import { authMiddleware } from '../middleware/authMiddleware.js';

router.get('/data', authMiddleware, (req, res) => {
  // req.user berisi payload token
  const user = req.user;
  
  res.json({
    status: 'success',
    message: 'Data berhasil diambil',
    data: {
      user_id: user.id,
      user_email: user.email,
      user_role: user.role
    }
  });
});
```

---

**Status**: ✅ Siap Digunakan
**Version**: 1.0.0
