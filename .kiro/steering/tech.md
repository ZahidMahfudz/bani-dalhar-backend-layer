# Stack Teknologi

## Runtime & Framework
- **Node.js** dengan ES6 modules (`"type": "module"` di package.json)
- **Express.js** (v5.2.1) - Web framework
- **Nodemon** - Development server dengan auto-reload

## Autentikasi & Keamanan
- **PASETO** (v3.1.4) - Autentikasi berbasis token (enkripsi lokal)
- **bcrypt** (v6.0.0) - Password hashing
- **JWT** (jsonwebtoken v9.0.3) - Penanganan token
- **dotenv** (v17.2.3) - Konfigurasi environment

## HTTP & Data
- **axios** (v1.13.2) - HTTP client untuk panggilan layanan GAS
- **express-validator** (v7.3.1) - Validasi request
- **cookie-parser** (v1.4.7) - Penanganan cookie
- **CORS** (v2.8.5) - Cross-origin resource sharing

## Utilities
- **winston** (v3.19.0) - Logging
- **uuid** (v13.0.0) - Pembuatan identifier unik

## Build & Development

### Perintah Umum
```bash
# Mode development (auto-reload dengan nodemon)
npm run dev

# Mode production
npm start

# Tests (belum diimplementasikan)
npm test
```

### Setup Environment
- Development: `.env.dev` (dimuat otomatis)
- Production: `.env.production` (jika ada)
- Variabel kunci: `NODE_ENV`, `GAS_URL`, `API_KEY`, `PORT`, `PASETO_KEY`

### Entry Points
- **Development**: `server.js` (direkomendasikan)
- **Production**: `index.js`
