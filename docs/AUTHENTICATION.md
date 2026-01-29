# Dokumentasi Fitur Autentikasi

## Deskripsi Fitur

Fitur autentikasi menggunakan **PASETO (Platform-Agnostic Security Tokens)** v3.1.4 untuk mengenkripsi dan memverifikasi token secara lokal. Token berlaku selama **30 menit** dan setelah itu pengguna harus login kembali.

### Karakteristik Token
- **Tipe**: PASETO v3 Local (enkripsi lokal)
- **Durasi**: 30 menit
- **Issuer**: Bani Dalhar
- **Enkripsi**: Base64 (sesuai PASETO_KEY di .env)

---

## Endpoint API

### 1. Login

**Endpoint**: `POST /authenticate/login`

**Deskripsi**: Melakukan autentikasi pengguna dan mengembalikan token akses.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "admin@mail.com",
  "password": "123"
}
```

**Parameter**:
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| email | string | Ya | Email pengguna |
| password | string | Ya | Password pengguna |

#### Response

**Success (200 OK)**:
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

**Error - Email/Password Salah (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

**Error - Input Kosong (400 Bad Request)**:
```json
{
  "status": "error",
  "message": "Email dan password harus diisi"
}
```

**Error - Server Error (500 Internal Server Error)**:
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server"
}
```

---

## Middleware Autentikasi

### Penggunaan

Middleware `authMiddleware` digunakan untuk melindungi endpoint yang memerlukan autentikasi.

**Contoh penggunaan di route**:
```javascript
import { authMiddleware } from '../middleware/authMiddleware.js';

router.get('/protected-endpoint', authMiddleware, (req, res) => {
  // req.user berisi payload token
  res.json({ user: req.user });
});
```

### Header Authorization

Setiap request ke endpoint yang dilindungi harus menyertakan header `Authorization`:

```
Authorization: Bearer <token>
```

**Contoh**:
```
Authorization: Bearer v3.local.eyJkYXRhIjoiZXhhbXBsZSJ9...
```

### Response Middleware

**Success (Token Valid)**:
- Middleware melanjutkan ke handler berikutnya
- `req.user` berisi payload token

**Error - Token Tidak Ditemukan (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Token tidak ditemukan"
}
```

**Error - Format Token Tidak Valid (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Format token tidak valid. Gunakan: Bearer <token>"
}
```

**Error - Token Kadaluarsa (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Token sudah kadaluarsa. Silakan login kembali"
}
```

**Error - Token Tidak Valid (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Token tidak valid"
}
```

---

## Contoh Penggunaan

### 1. Login dengan cURL

```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mail.com",
    "password": "123"
  }'
```

### 2. Login dengan Postman

1. Buka Postman
2. Buat request baru dengan method **POST**
3. URL: `http://localhost:4050/authenticate/login`
4. Tab **Headers**, tambahkan:
   - Key: `Content-Type`
   - Value: `application/json`
5. Tab **Body**, pilih **raw** dan **JSON**, masukkan:
   ```json
   {
     "email": "admin@mail.com",
     "password": "123"
   }
   ```
6. Klik **Send**

### 3. Menggunakan Token untuk Request Terproteksi

Setelah mendapatkan token dari login, gunakan token tersebut di header Authorization:

```bash
curl -X GET http://localhost:4050/protected-endpoint \
  -H "Authorization: Bearer <token_dari_login>"
```

### 4. Contoh JavaScript/Fetch

```javascript
// Login
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

// Gunakan token untuk request terproteksi
const protectedResponse = await fetch('http://localhost:4050/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const protectedData = await protectedResponse.json();
console.log(protectedData);
```

---

## Struktur File

```
src/
├── controller/
│   └── authenticateController.js    # Login handler
├── middleware/
│   └── authMiddleware.js            # Token validation middleware
├── routes/
│   └── authenticateRoutes.js        # Authentication routes
├── utils/
│   └── paseto.js                    # Token creation & verification
└── app.js                           # Main app setup
```

---

## Logging

Setiap langkah dalam proses autentikasi dicatat dengan logging:

### Login Process
```
[timestamp] [Level: debug] [Pesan: Menerima request login]
[timestamp] [Level: debug] [Pesan: Memvalidasi kredensial untuk email: admin@mail.com]
[timestamp] [Level: info] [Pesan: Kredensial valid untuk email: admin@mail.com]
[timestamp] [Level: debug] [Pesan: Membuat token dengan payload: {...}]
[timestamp] [Level: debug] [Pesan: Membuat token untuk user: admin@mail.com]
[timestamp] [Level: info] [Pesan: Token berhasil dibuat untuk user: admin@mail.com]
[timestamp] [Level: info] [Pesan: User admin@mail.com berhasil login]
```

### Token Verification
```
[timestamp] [Level: debug] [Pesan: Memproses auth middleware]
[timestamp] [Level: debug] [Pesan: Token ditemukan, memverifikasi...]
[timestamp] [Level: debug] [Pesan: Memverifikasi token...]
[timestamp] [Level: debug] [Pesan: Token berhasil diverifikasi untuk user: admin@mail.com]
[timestamp] [Level: info] [Pesan: Token berhasil diverifikasi untuk user: admin@mail.com]
```

---

## Catatan Penting

1. **Kredensial Default**: Email `admin@mail.com` dan password `123` adalah simulasi. Ganti dengan query database yang sebenarnya.

2. **PASETO_KEY**: Pastikan `PASETO_KEY` di `.env.dev` adalah base64 string dengan panjang 32 byte.

3. **Token Expiration**: Token berlaku 30 menit. Setelah itu, pengguna harus login kembali untuk mendapatkan token baru.

4. **Security**: Jangan pernah commit `.env` file ke repository. Gunakan `.env.example` untuk dokumentasi.

5. **HTTPS**: Dalam production, selalu gunakan HTTPS untuk melindungi token saat transit.

---

## Troubleshooting

### Error: "PASETO_KEY tidak ditemukan"
- Pastikan file `.env.dev` ada di root project
- Pastikan variabel `PASETO_KEY` sudah didefinisikan

### Error: "Token sudah kadaluarsa"
- Token berlaku 30 menit
- Lakukan login kembali untuk mendapatkan token baru

### Error: "Format token tidak valid"
- Pastikan menggunakan format: `Bearer <token>`
- Jangan lupa spasi antara `Bearer` dan token

### Error: "Token tidak valid"
- Token mungkin sudah dimodifikasi
- Coba login kembali untuk mendapatkan token baru
