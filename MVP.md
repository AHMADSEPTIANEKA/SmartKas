
---

# ✅ Checklist Timeline Sprint 1: MVP SmartKas

**Durasi:** 10 Hari Kerja (2 Minggu)
**Tujuan:** Membuat aplikasi SmartKas versi MVP dengan fitur pencatatan transaksi dan laporan keuangan sederhana.

---

## 📌 Minggu 1

### Hari 1 – Setup Proyek

* [ ] Buat proyek Flutter baru
* [ ] Tambahkan dependencies utama (`riverpod`, `go_router`, `drift`, `freezed`, dll.)
* [ ] Konfigurasi Clean Architecture (buat direktori `data`, `domain`, `presentation`)
* [ ] Buat halaman *splash screen* dan struktur routing dasar

### Hari 2 – Modul `auth` & `domain`

* [ ] Buat model data pengguna dengan Freezed
* [ ] Definisikan `UserRepository` (interface) di lapisan `domain`
* [ ] Buat use case `SignUp` dan `SignIn`

### Hari 3 – Modul `auth` & `data`

* [ ] Implementasi `UserRepository` dengan Drift
* [ ] Buat skema tabel `users` di Drift
* [ ] Implementasi logika registrasi dan login ke database

### Hari 4 – Modul `transaction` & `domain`

* [ ] Buat model data `Transaction` dan `Category` dengan Freezed
* [ ] Definisikan `TransactionRepository` (interface) di `domain`
* [ ] Buat use case `AddTransaction`

### Hari 5 – Modul `transaction` & `data`

* [ ] Implementasi `TransactionRepository` dengan Drift
* [ ] Buat skema tabel `transactions` dan `categories` di Drift
* [ ] Implementasi logika simpan transaksi ke database

---

## 📌 Minggu 2

### Hari 6 – UI/UX Login & Dashboard

* [ ] Rancang UI untuk halaman *sign-up* dan *sign-in*
* [ ] Rancang UI dasbor: saldo, total pemasukan, total pengeluaran
* [ ] Hubungkan UI dengan *provider* autentikasi Riverpod

### Hari 7 – UI/UX Pencatatan Transaksi

* [ ] Rancang UI formulir pencatatan transaksi (pemasukan/pengeluaran)
* [ ] Implementasi fitur pemilihan kategori
* [ ] Hubungkan UI dengan use case `AddTransaction`

### Hari 8 – UI/UX Laporan Sederhana

* [ ] Buat tampilan laporan sederhana (ringkasan total pemasukan/pengeluaran)
* [ ] Implementasi *provider* Riverpod untuk mengambil data laporan
* [ ] Tampilkan data laporan di dasbor

### Hari 9 – Integrasi & Perbaikan

* [ ] Integrasikan semua modul (autentikasi, transaksi, laporan)
* [ ] Lakukan debugging dan perbaikan bug
* [ ] Pastikan alur pengguna berjalan lancar (login → dasbor → catat transaksi → kembali ke dasbor)

### Hari 10 – Finalisasi & Uji Coba

* [ ] Uji coba end-to-end (E2E) untuk skenario MVP
* [ ] Pastikan performa aplikasi stabil
* [ ] Siapkan kode untuk deployment / release ke internal testing

---

# ✅ Checklist Timeline Sprint 2: Penyempurnaan SmartKas

**Durasi:** 10 Hari Kerja (2 Minggu)
**Tujuan:** Menyempurnakan MVP dengan validasi, laporan lanjutan, dan persiapan rilis internal.

---

## 📌 Minggu 3

### Hari 1–2 – Kategori & Validasi

* [ ] Tambahkan kategori transaksi custom
* [ ] Validasi input (nominal, kategori wajib)
* [ ] Perbaikan UX dasar (loading, error handling)

### Hari 3–4 – Laporan Lanjutan

* [ ] Tambahkan filter transaksi (tanggal/kategori)
* [ ] Grafik sederhana pemasukan vs pengeluaran
* [ ] Optimasi query Drift untuk laporan

### Hari 5 – Penyempurnaan UI/UX

* [ ] Perbaiki tampilan dashboard agar lebih user-friendly
* [ ] Tambahkan indikator loading saat fetch data
* [ ] Tambahkan notifikasi (snackbar/dialog) saat transaksi berhasil

---

## 📌 Minggu 4

### Hari 6–7 – Pengujian Internal

* [ ] Uji coba skenario edge case (login gagal, data kosong, input invalid)
* [ ] Debugging & fixing bug dari testing

### Hari 8 – Dokumentasi Proyek

* [ ] Tambahkan dokumentasi teknis (README, struktur kode, arsitektur)
* [ ] Dokumentasi cara menjalankan aplikasi (developer guide)

### Hari 9–10 – Finalisasi & Rilis

* [ ] Build APK/TestFlight untuk internal testing
* [ ] Sprint review & retrospective
* [ ] Rencana pengembangan fitur selanjutnya (utang/piutang, stok barang, dll.)

---
