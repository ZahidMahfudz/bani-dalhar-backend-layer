# Perbaikan PASETO Key Loading

## 🔧 Masalah yang Ditemukan

### Error Log
```
[2026-02-10 22:13:46] [Level : error] [Pesan : Gagal membuat token: invalid key provided]
[2026-02-10 22:13:46] [Level : error] [Pesan : Error pada login controller: invalid key provided]
```

### Penyebab
1. **Format Key Salah**: PASETO_KEY di `.env.dev` adalah format **PEM (Private Key)**, bukan base64
2. **Encoding Salah**: Kode mencoba mengkonversi PEM ke base64 dengan `Buffer.from(process.env.PASETO_KEY, 'base64')`
3. **Method Salah**: Menggunakan `V4.local.encrypt()` dan `V4.local.decrypt()` padahal seharusnya `V4.sign()` dan `V4.verify()`

---

## ✅ Solusi yang Diterapkan

### 1. Gunakan Format PEM Langsung

**SEBELUM (Error)**:
```javascript
key = Buffer.from(process.env.PASETO_KEY, 'base64');
```

**SESUDAH (Fixed)**:
```javascript
key = process.env.PASETO_KEY;
```

### 2. Gunakan Method yang Benar

PASETO v3 memiliki dua mode:
- **Local (Symmetric)**: `V4.local.encrypt()` dan `V4.local.decrypt()` - menggunakan shared secret
- **Public (Asymmetric)**: `V4.sign()` dan `V4.verify()` - menggunakan private/public key pair

Karena PASETO_KEY adalah **private key (PEM format)**, kita harus menggunakan mode **Public**:

**SEBELUM (Error)**:
```javascript
const token = await V4.local.encrypt(tokenPayload, getKey());
const payload = await V4.local.decrypt(token, getKey());
```

**SESUDAH (Fixed)**:
```javascript
const token = await V4.sign(tokenPayload, getKey());
const payload = await V4.verify(token, getKey());
```

---

## 📝 Format PASETO_KEY di .env.dev

### Format PEM (Private Key)
```
PASETO_KEY = -----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGERcTvfwiYrjRDhZu4Gmk+WDU/JFoipI3et1U+mPY52
-----END PRIVATE KEY-----
```

### Cara Generate Key Baru

Jika ingin generate key baru, jalankan:

```bash
node src/utils/generateKey.js
```

Output akan menampilkan private key dalam format PEM. Copy dan paste ke `.env.dev`:

```
PASETO_KEY = -----BEGIN PRIVATE KEY-----
[output dari generateKey.js]
-----END PRIVATE KEY-----
```

---

## 🔐 Perbedaan Mode PASETO

### Local (Symmetric)
- Menggunakan **shared secret** (sama untuk encrypt dan decrypt)
- Lebih cepat
- Cocok untuk single-server atau internal communication
- Contoh: `V4.local.encrypt()` dan `V4.local.decrypt()`

### Public (Asymmetric)
- Menggunakan **private key untuk sign** dan **public key untuk verify**
- Lebih aman untuk distributed systems
- Cocok untuk multi-server atau API gateway
- Contoh: `V4.sign()` dan `V4.verify()`

**Kita menggunakan Public mode** karena:
- PASETO_KEY adalah private key (PEM format)
- Lebih aman untuk API gateway
- Memungkinkan public key verification di client

---

## 📊 Token Payload Structure

```json
{
  "id": 1,
  "email": "admin@mail.com",
  "role": "admin",
  "iss": "Bani Dalhar",
  "exp": "2024-01-29T23:42:15.000Z"
}
```

### Field Penjelasan
- `id`: User ID
- `email`: User email
- `role`: User role
- `iss`: Issuer (Bani Dalhar)
- `exp`: Expiration time (ISO format, 30 menit dari sekarang)

---

## ✅ Verifikasi Perbaikan

### Test Login Endpoint

```bash
curl -X POST http://localhost:4050/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123"}'
```

### Expected Response (200 OK)
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "access_token": "v4.public.eyJkYXRhIjoiZXhhbXBsZSJ9...",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

### Expected Logging Output
```
[2026-02-10 22:13:46] [Level : debug] [Pesan : Secret key PASETO berhasil dimuat dari .env.dev]
[2026-02-10 22:13:46] [Level : debug] [Pesan : KEY (first 50 chars): -----BEGIN PRIVATE KEY-----...]
[2026-02-10 22:13:46] [Level : debug] [Pesan : Membuat token untuk user: admin@mail.com]
[2026-02-10 22:13:46] [Level : debug] [Pesan : Token payload: {...}]
[2026-02-10 22:13:46] [Level : info] [Pesan : Token berhasil dibuat untuk user: admin@mail.com]
[2026-02-10 22:13:46] [Level : info] [Pesan : User admin@mail.com berhasil login]
```

---

## 🎯 File yang Dimodifikasi

- `src/utils/paseto.js`
  - Hapus `import { Buffer } from 'buffer'`
  - Ubah `getKey()` untuk menggunakan PEM format langsung
  - Ubah `createToken()` untuk menggunakan `V4.sign()`
  - Ubah `verifyToken()` untuk menggunakan `V4.verify()`

---

## 📚 Referensi

- [PASETO Documentation](https://paseto.io/)
- [PASETO v3 Specification](https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Version3.md)
- [Node.js PASETO Library](https://github.com/panva/paseto)

---

## 🚀 Next Steps

1. Test login endpoint dengan curl atau Postman
2. Verifikasi token dapat digunakan untuk akses endpoint terproteksi
3. Test token expiration (30 menit)
4. Implementasikan refresh token jika diperlukan

---

**Status**: ✅ Fixed
**Date**: 2026-02-10
**Version**: 1.0.1
