# Backend Bani Dalhar

Lapisan backend Node.js yang berfungsi sebagai API gateway untuk aplikasi Bani Dalhar. Bertindak sebagai middleware antara klien frontend dan layanan backend Google Apps Script (GAS), menangani autentikasi, transformasi data, dan routing request.

## Tujuan Inti
- Menyediakan endpoint RESTful API untuk manajemen data keluarga dan orang
- Mengintegrasikan dengan backend Google Apps Script untuk persistensi data
- Menangani autentikasi melalui token PASETO
- Mengelola transformasi dan validasi request/response

## Fitur Utama
- Autentikasi berbasis token (PASETO)
- Operasi CRUD data keluarga dan orang
- Integrasi dengan layanan GAS eksternal
- Logging komprehensif untuk debugging dan monitoring
