
---

### Software Requirements Specification (SRS) - SmartKas App

#### 1. Pengenalan

* **1.1 Tujuan Dokumen:** Dokumen ini mendefinisikan secara detail kebutuhan perangkat lunak untuk aplikasi SmartKas, sebuah aplikasi pencatat keuangan yang simpel dan ringan untuk platform mobile. Tujuannya adalah memastikan semua pemangku kepentingan, termasuk pengembang dan desainer, memiliki pemahaman yang seragam tentang fitur, performa, dan batasan sistem.
* **1.2 Ruang Lingkup Produk:** Aplikasi ini akan menjadi solusi mandiri (standalone) yang berjalan secara lokal di perangkat pengguna. Fungsi utamanya mencakup pencatatan transaksi, pembuatan laporan keuangan, dan manajemen utang piutang.

#### 2. Kebutuhan Fungsional (Functional Requirements)

* **2.1 Autentikasi dan Profil Pengguna**
    * **REQ-AUTH-001:** Sistem harus memungkinkan pengguna membuat akun dengan **email** dan **password** yang unik.
    * **REQ-AUTH-002:** Sistem harus memvalidasi format email yang dimasukkan.
    * **REQ-AUTH-003:** Pengguna harus dapat masuk menggunakan kredensial yang telah terdaftar.
    * **REQ-AUTH-004:** Pengguna harus dapat memperbarui nama dan avatar profil mereka.

* **2.2 Manajemen Transaksi Keuangan**
    * **REQ-TRANS-001:** Pengguna harus dapat menambahkan transaksi **pemasukan** atau **pengeluaran**.
    * **REQ-TRANS-002:** Setiap transaksi harus memiliki detail seperti jumlah ($$), tanggal (DateTime), kategori, dan deskripsi opsional.
    * **REQ-TRANS-003:** Pengguna harus dapat memilih kategori yang ada atau membuat kategori baru. Kategori harus memiliki tipe (pemasukan/pengeluaran).
    * **REQ-TRANS-004:** Pengguna harus dapat mengedit dan menghapus transaksi yang sudah tercatat.
    * **REQ-TRANS-005:** Sistem harus menyimpan semua transaksi dalam database lokal (`Drift`).

* **2.3 Laporan Keuangan**
    * **REQ-REPORT-001:** Halaman utama (dashboard) harus menampilkan ringkasan saldo, total pemasukan, dan total pengeluaran.
    * **REQ-REPORT-002:** Pengguna harus dapat melihat laporan keuangan berdasarkan periode waktu yang telah ditentukan (hari ini, minggu ini, bulan ini) atau rentang kustom.
    * **REQ-REPORT-003:** Laporan harus menyajikan data secara visual, seperti grafik batang untuk perbandingan pemasukan dan pengeluaran, atau diagram lingkaran untuk komposisi pengeluaran per kategori.

* **2.4 Manajemen Utang Piutang**
    * **REQ-DEBT-001:** Pengguna harus dapat mencatat utang dengan detail: nama kontak, jumlah, tanggal jatuh tempo, dan status (lunas/belum lunas).
    * **REQ-DEBT-002:** Pengguna harus dapat mencatat piutang dengan detail yang sama.
    * **REQ-DEBT-003:** Sistem harus menyediakan daftar terpisah untuk utang dan piutang yang belum lunas.
    * **REQ-DEBT-004:** Pengguna harus dapat mengubah status utang atau piutang menjadi "lunas".

* **2.5 Manajemen Stok Barang (Fitur Tambahan)**
    * **REQ-STOCK-001:** Pengguna harus dapat menambahkan produk baru dengan detail: nama, jumlah awal stok, harga beli, dan harga jual.
    * **REQ-STOCK-002:** Sistem harus secara otomatis mengurangi jumlah stok ketika ada transaksi pengeluaran (penjualan) yang terkait.
    * **REQ-STOCK-003:** Pengguna harus dapat memperbarui jumlah stok secara manual.

---

#### 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

* **3.1 Performa**
    * **NFR-PERF-001:** Setiap operasi pencatatan transaksi harus selesai dalam waktu **kurang dari 1 detik**.
    * **NFR-PERF-002:** Navigasi antar halaman harus lancar dan bebas dari *lag*.
    * **NFR-PERF-003:** Aplikasi harus menggunakan sumber daya sistem (CPU, RAM) seminimal mungkin agar tidak membebani perangkat.

* **3.2 Keandalan**
    * **NFR-REL-001:** Aplikasi harus stabil dan tidak mengalami *crash* saat mencatat atau menampilkan data, bahkan jika data berjumlah besar.
    * **NFR-REL-002:** Data harus disimpan secara konsisten di database lokal dan tidak boleh hilang saat aplikasi ditutup atau perangkat mati.

* **3.3 Usabilitas**
    * **NFR-USAB-001:** Antarmuka pengguna (UI) harus minimalis dan intuitif, dirancang untuk alur kerja yang cepat dan sederhana.
    * **NFR-USAB-002:** Teks dan ikon harus mudah dibaca dan dipahami.
    * **NFR-USAB-003:** Aplikasi harus memberikan umpan balik visual atau notifikasi untuk setiap aksi pengguna yang berhasil atau gagal (misalnya, "Transaksi berhasil disimpan").

* **3.4 Lingkungan Teknis**
    * **NFR-ENV-001:** Aplikasi harus dibangun menggunakan **Flutter** dan **Dart**.
    * **NFR-ENV-002:** Manajemen state harus diimplementasikan menggunakan **Riverpod Generator**.
    * **NFR-ENV-003:** Navigasi aplikasi harus dikelola oleh **GoRouter**.
    * **NFR-ENV-004:** Model data harus dibuat menggunakan **Freezed** untuk immutability.
    * **NFR-ENV-005:** Database lokal harus menggunakan **Drift**.
    * **NFR-ENV-006:** Logika bisnis harus memanfaatkan **fpdart** untuk pendekatan fungsional.
    * **NFR-ENV-007:** Log aplikasi dan debugging harus menggunakan **Logger**.

* **3.5 Keamanan**
    * **NFR-SEC-001:** Data pengguna harus disimpan secara lokal di perangkat dan dienkripsi saat dibutuhkan (misalnya, password).
    * **NFR-SEC-002:** Aplikasi tidak boleh mengirim data sensitif pengguna ke server eksternal tanpa persetujuan eksplisit.

---

#### 4. Kebutuhan Desain UI/UX

* **4.1 Desain Antarmuka:**
    * Halaman utama (Dashboard) akan menampilkan saldo terkini, ringkasan transaksi, dan tombol navigasi utama.
    * Halaman pencatatan transaksi harus berupa formulir sederhana dengan input yang jelas.
    * Halaman laporan akan menampilkan grafik dan tabel dengan filter periode waktu.
    * Halaman utang piutang akan berisi daftar kontak dan jumlah yang terperinci.

