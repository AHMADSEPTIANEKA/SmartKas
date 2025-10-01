
---

### Product Requirements Document (PRD) - SmartKas App

#### 1. Pengenalan

**Nama Produk:** SmartKas
**Versi:** 1.0.0 (Initial Release)

**Tujuan:**
SmartKas adalah aplikasi mobile yang dirancang untuk membantu individu dan pemilik usaha kecil dalam mengelola keuangan mereka dengan cara yang sederhana, ringan, dan efisien. Aplikasi ini fokus pada pencatatan transaksi keuangan, manajemen utang piutang, dan pelacakan stok barang dengan antarmuka yang intuitif.

**Target Pengguna:**
* Individu yang ingin melacak pengeluaran harian mereka.
* Pemilik usaha kecil yang membutuhkan alat sederhana untuk mengelola keuangan dan stok tanpa kerumitan.

#### 2. Fitur-fitur Utama (High-Level Features)

* **Pencatatan Keuangan:** Fitur inti untuk mencatat pemasukan dan pengeluaran.
* **Laporan Keuangan:** Menyajikan data keuangan dalam laporan yang mudah dibaca.
* **Manajemen Utang Piutang:** Memantau utang yang harus dibayar dan piutang yang harus diterima.
* **Manajemen Stok Barang:** Melacak jumlah dan nilai stok barang.

#### 3. Kebutuhan Fungsional (Functional Requirements)

**3.1. User Account**
* **FR-1.1:** Pengguna dapat membuat akun dengan email dan password.
* **FR-1.2:** Pengguna dapat masuk dan keluar dari akun mereka.
* **FR-1.3:** Pengguna dapat melihat dan mengedit profil pribadi mereka (nama, foto).

**3.2. Pencatatan Transaksi**
* **FR-2.1:** Pengguna dapat mencatat **transaksi pemasukan** dengan detail berikut:
    * Jumlah (wajib)
    * Kategori (opsional, bisa pilih dari daftar atau tambah baru)
    * Deskripsi/Catatan (opsional)
    * Tanggal (wajib)
* **FR-2.2:** Pengguna dapat mencatat **transaksi pengeluaran** dengan detail yang sama seperti pemasukan.
* **FR-2.3:** Pengguna dapat mengedit atau menghapus transaksi yang sudah tercatat.
* **FR-2.4:** Aplikasi harus menyediakan daftar kategori bawaan (misalnya: Gaji, Jual, Belanja, Makan) dan memungkinkan pengguna untuk menambah/menghapus kategori kustom.

**3.3. Laporan Keuangan**
* **FR-3.1:** Aplikasi harus menampilkan ringkasan **saldo, total pemasukan, dan total pengeluaran** di halaman utama (dasbor).
* **FR-3.2:** Pengguna dapat melihat laporan keuangan berdasarkan periode waktu: harian, mingguan, bulanan, dan rentang tanggal kustom.
* **FR-3.3:** Laporan harus menampilkan data dalam format visual (misalnya: diagram lingkaran untuk komposisi pengeluaran/pemasukan per kategori).

**3.4. Manajemen Utang Piutang**
* **FR-4.1:** Pengguna dapat menambahkan catatan **utang** baru dengan detail: nama kontak, jumlah, tanggal jatuh tempo, dan deskripsi.
* **FR-4.2:** Pengguna dapat menambahkan catatan **piutang** baru dengan detail yang sama seperti utang.
* **FR-4.3:** Pengguna dapat melihat daftar utang dan piutang yang belum lunas.
* **FR-4.4:** Pengguna dapat menandai catatan utang/piutang sebagai "Lunas".

**3.5. Manajemen Stok Barang**
* **FR-5.1:** Pengguna dapat menambahkan item stok baru dengan detail: nama barang, jumlah awal, harga beli per unit, dan harga jual per unit.
* **FR-5.2:** Aplikasi harus secara otomatis mengurangi stok ketika ada transaksi penjualan yang tercatat.
* **FR-5.3:** Aplikasi harus menyediakan opsi untuk menambahkan atau mengurangi stok secara manual.
* **FR-5.4:** Pengguna dapat melihat daftar stok barang saat ini.

#### 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

* **NFR-1 (Performa):** Aplikasi harus ringan, cepat, dan responsif. Transaksi harus tercatat dalam waktu kurang dari 1 detik.
* **NFR-2 (Keandalan):** Aplikasi harus stabil dan tidak mudah crash, terutama saat mencatat data.
* **NFR-3 (Keamanan):** Data pengguna, terutama informasi keuangan, harus disimpan dengan aman di perangkat menggunakan database lokal (Drift).
* **NFR-4 (Usabilitas):** Antarmuka pengguna harus intuitif dan minimalis, dirancang agar pengguna dapat melakukan tugas dengan sedikit langkah.
* **NFR-5 (Kompabilitas):** Aplikasi harus dapat berjalan di platform iOS dan Android.

#### 5. Lingkungan Teknis

* **Front-end:** Flutter
* **State Management:** Riverpod Generator
* **Routing:** GoRouter
* **Data Models:** Freezed
* **Database:** Drift
* **Functional Programming:** fpdart
* **Logging:** Logger

#### 6. Metrik Keberhasilan

* **Jumlah Unduhan:** Target 1,000 unduhan dalam 3 bulan pertama.
* **Retensi Pengguna:** 50% pengguna yang menginstal aplikasi masih aktif setelah 1 bulan.
* **Kepuasan Pengguna:** Rating aplikasi rata-rata di atas 4.5 bintang di Google Play Store dan Apple App Store.

Dokumen ini adalah dasar yang kuat untuk memulai. Selanjutnya, kita bisa mulai dengan perancangan arsitektur dan UI/UX yang lebih detail berdasarkan kebutuhan ini.