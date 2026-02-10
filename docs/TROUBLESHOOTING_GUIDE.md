# Troubleshooting Guide - Fitur Autentikasi

## 🔴 Error: "invalid key provided"

### Gejala
```
[Level : error] [Pesan : Gagal membuat token: invalid key provided]
```

### Penyebab
1. PASETO_KEY tidak terload dengan benar dari `.env.dev`
2. Format PASETO_KEY salah
3. PASETO_KEY kosong atau undefined

### Solusi

#### 1. Verifikasi PASETO_KEY di .env.dev

Buka `.env.dev` dan pastikan:
```
PASETO_KEY = -----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGERcTvfwiYrjRDhZu4Gmk+WDU/JFoipI3et1U+mPY52
-----END PRIVATE KEY-----
```

**Penting**:
- Harus format PEM (dengan `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`)
- Tidak boleh ada spasi di awal atau akhir
- Harus multi-line (jangan di-compress menjadi satu baris)

#### 2. Generate Key Baru

Jika PASETO_KEY tidak valid, generate key baru:

```bash
node src/utils/generateKey.js
```

Output akan menampilkan private key. Copy dan paste ke `.env.dev`:

```
PASETO_KEY = -----BEGIN PRIVATE KEY-----
[output dari generateKey.js]
-----END PRIVATE KEY-----
```

#### 3. Restart Server

Setelah mengubah `.env.dev`, restart server:

```bash
# Stop server (Ctrl+C)
# Jalankan kembali
npm run dev
```

---

## 🔴 Error: "Token tidak ditemukan"

### Gejala
```json
{
  "status": "error",
  "message": "Token tidak ditemukan"
}
```

### Penyebab
Header `Authorization` tidak dikirim atau kosong

### Solusi

Pastikan mengirim header `Authorization` dengan format:
```
Authorization: Bearer <token>
```

**Contoh dengan cURL**:
```bash
curl -X GET http://localhost:4050/protected-endpoint \
  -H "Authorization: Bearer v4.public.eyJkYXRhIjoiZXhhbXBsZSJ9..."
```

**Contoh dengan JavaScript**:
```javascript
fetch('http://localhost:4050/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔴 Error: "Format token tidak valid"

### Gejala
```json
{
  "status": "error",
  "message": "Format token tidak valid. Gunakan: Bearer <token>"
}
```

### Penyebab
Format header `Authorization` salah

### Solusi

Format yang benar:
```
Authorization: Bearer <token>
```

**Contoh yang SALAH**:
```
Authorization: <token>                    # Tanpa "Bearer"
Authorization: bearer <token>             # Lowercase "bearer"
Authorization: Bearer<token>              # Tanpa spasi
Authorization: Bearer  <token>            # Spasi ganda
```

---

## 🔴 Error: "Token sudah kadaluarsa"

### Gejala
```json
{
  "status": "error",
  "message": "Token sudah kadaluarsa. Silakan login kembali"
}
```

### Penyebab
Token berlaku 30 menit, dan sudah melewati waktu tersebut

### Solusi

Login kembali untuk mendapatkan token baru:

```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

---

## 🔴 Error: "Token tidak valid"

### Gejala
```json
{
  "status": "error",
  "message": "Token tidak valid"
}
```

### Penyebab
1. Token sudah dimodifikasi
2. Token menggunakan key yang berbeda
3. Token corrupt

### Solusi

1. Pastikan token tidak dimodifikasi saat transit
2. Gunakan HTTPS di production
3. Login kembali untuk mendapatkan token baru

---

## 🔴 Error: "Email atau password salah"

### Gejala
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

### Penyebab
Kredensial yang dikirim tidak sesuai dengan database

### Solusi

Verifikasi kredensial:
- Email: `admin@mail.com`
- Password: `123`

**Contoh yang benar**:
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

---

## 🔴 Error: "Validasi gagal"

### Gejala
```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Email harus diisi"
    }
  ]
}
```

### Penyebab
Input tidak memenuhi validasi

### Solusi

Verifikasi input:
- Email harus diisi dan format valid
- Password harus diisi

**Contoh yang benar**:
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

---

## 🔴 Error: "Terjadi kesalahan pada server"

### Gejala
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server"
}
```

### Penyebab
Error tidak terduga di server

### Solusi

1. Lihat console log untuk detail error
2. Verifikasi PASETO_KEY di `.env.dev`
3. Restart server
4. Cek file `.env.dev` tidak ada syntax error

---

## 📋 Checklist Debugging

Jika mengalami error, ikuti checklist ini:

- [ ] Verifikasi `.env.dev` sudah ada dan tidak kosong
- [ ] Verifikasi `PASETO_KEY` format PEM (dengan `-----BEGIN PRIVATE KEY-----`)
- [ ] Verifikasi `NODE_ENV` = `development`
- [ ] Verifikasi `PORT` = `4050`
- [ ] Restart server setelah mengubah `.env.dev`
- [ ] Lihat console log untuk detail error
- [ ] Test dengan curl atau Postman
- [ ] Verifikasi request body JSON format benar
- [ ] Verifikasi header `Content-Type: application/json`

---

## 🧪 Test Commands

### Test Login
```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

### Test dengan Token Valid
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}' | jq -r '.data.access_token')

# 2. Akses endpoint terproteksi
curl -X GET http://localhost:4050/protected-endpoint \
  -H "Authorization: Bearer $TOKEN"
```

### Test Validasi Input
```bash
# Email kosong
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "", "password": "123"}'

# Email format tidak valid
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'

# Password kosong
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": ""}'
```

---

## 📞 Kontakt Support

Jika masalah tidak teratasi:

1. Lihat dokumentasi di `docs/AUTHENTICATION.md`
2. Lihat contoh implementasi di `docs/PROTECTED_ENDPOINT_EXAMPLE.md`
3. Lihat perbaikan PASETO di `docs/PASETO_KEY_FIX.md`
4. Lihat quick start di `docs/QUICK_START.md`

---

**Last Updated**: 2026-02-10
**Version**: 1.0.0
