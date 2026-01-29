# Struktur Proyek

## Tata Letak Direktori

```
.
├── src/
│   ├── app.js                 # Setup Express app & mounting route
│   ├── config/                # Konfigurasi & inisialisasi
│   │   ├── dotenvBootstrap.js # Pemuatan variabel environment
│   │   ├── gasConnectTest.js  # Koneksi layanan GAS
│   │   ├── httpClient.js      # Instance HTTP client Axios
│   │   └── logger.js          # Konfigurasi logger Winston
│   ├── controller/            # Handler request
│   │   └── dataFamilyController.js
│   ├── middleware/            # Middleware Express
│   │   └── loggerMiddleware.js
│   ├── routes/                # Definisi route
│   │   └── dataFamilyRoutes.js
│   ├── service/               # Logika bisnis & panggilan layanan eksternal
│   │   └── gasService.js      # Integrasi GAS API
│   ├── utils/                 # Fungsi utility
│   │   ├── generateKey.js
│   │   ├── paseto.js          # Pembuatan & verifikasi token
│   │   └── payloadParsing.js  # Transformasi payload request
│   └── validator/             # Skema validasi (kosong)
├── server.js                  # Entry point development
├── index.js                   # Entry point production
├── package.json               # Dependencies & scripts
└── .env.dev                   # Variabel environment development
```

## Pola Arsitektur

### Arsitektur Berlapis
1. **Routes** - Mendefinisikan endpoint dan HTTP method
2. **Controllers** - Menangani request, memanggil service, mengembalikan response
3. **Services** - Logika bisnis dan integrasi API eksternal
4. **Utils** - Fungsi yang dapat digunakan kembali (auth, parsing, dll)
5. **Config** - Inisialisasi dan konfigurasi

### Gaya Kode
- **ES6 Modules**: Semua file menggunakan sintaks `import/export`
- **Async/Await**: Operasi asinkron menggunakan pola async/await
- **Error Handling**: Blok try-catch dengan logging
- **Logging**: Logger Winston digunakan di seluruh kode untuk level debug/info/error
- **Komentar**: Campuran bahasa Indonesia dan Inggris dalam codebase
- **Routes**: Semua end point gunakan pendekatan layering sebagai contoh router.[method]("/]nama_endpoint]", logger.requestLogger, middleware1, middleware2, ..., controller);

### Konvensi Kunci
- Controller menangani siklus request/response HTTP
- Service berisi logika bisnis dan panggilan eksternal
- Semua panggilan eksternal dicatat dengan level debug sebelum dan sesudah
- Response error mengikuti pola: `{ status: 'error', message: '...' }`
- Response sukses mengembalikan data langsung atau dibungkus dalam objek status
- Variabel environment diakses melalui `process.env`
- Logger digunakan untuk semua operasi dan error yang signifikan
- letakan validasi dalam satu file validator lalu simpan di folder validator
- validasi dipanggil di routes sebagai middleware
- validasi dilakukan sebelum memasuki controller
