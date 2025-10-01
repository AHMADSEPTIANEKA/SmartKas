
-----

### Software Design Document (SDD) - SmartKas App

#### 1\. Pengenalan

  * **1.1 Tujuan Dokumen:** Dokumen ini memberikan gambaran teknis tentang arsitektur dan desain aplikasi SmartKas. Tujuannya adalah untuk memandu tim pengembangan dalam mengimplementasikan semua kebutuhan yang telah diidentifikasi dalam PRD dan SRS.
  * **1.2 Lingkup Desain:** Dokumen ini mencakup arsitektur umum (Clean Architecture), desain modul (berdasarkan fitur), dan desain database.

-----

#### 2\. Desain Arsitektur

Kita akan menggunakan **Clean Architecture** untuk memisahkan aplikasi ke dalam tiga lapisan utama. Pendekatan ini memastikan kode modular, mudah diuji, dan skalabel.

  * **`presentation` layer (Lapisan Presentasi):** Lapisan terluar yang berinteraksi langsung dengan pengguna. Ini berisi **UI (Flutter Widgets)**, **ViewModel (Riverpod Providers)**, dan **Router (GoRouter)**. Tugas utamanya adalah menerima input pengguna dan menampilkan data dari lapisan `domain`.
  * **`domain` layer (Lapisan Domain):** Lapisan inti yang berisi logika bisnis. Ini adalah bagian terpenting dan tidak bergantung pada lapisan lain. Di sini kita akan mendefinisikan **Model Data (Freezed)**, **Repositories (Interfaces)**, dan **Use Cases (Business Logic)**.
  * **`data` layer (Lapisan Data):** Lapisan terluar yang bertanggung jawab untuk mengambil data dari sumber eksternal (dalam hal ini, **Drift database**). Lapisan ini mengimplementasikan antarmuka *repository* yang didefinisikan di lapisan `domain`.

#### 3\. Desain Komponen dan Modul

Aplikasi akan dibagi ke dalam beberapa modul atau fitur, yang masing-masing memiliki tanggung jawab spesifik. Setiap modul akan mengikuti struktur Clean Architecture (presentation, domain, data).

  * **Modul `auth`:** Mengelola autentikasi pengguna, registrasi, dan data profil.
  * **Modul `transaction`:** Mengelola semua operasi terkait pemasukan dan pengeluaran.
  * **Modul `report`:** Berfokus pada logika untuk menghasilkan laporan keuangan dan visualisasinya.
  * **Modul `debt`:** Mengelola pencatatan dan status utang piutang.
  * **Modul `stock`:** Mengelola informasi dan kuantitas stok barang.

-----

#### 4\. Desain Basis Data (Drift)

Kita akan menggunakan **Drift** untuk implementasi database lokal. Berikut adalah desain skema, yang sudah kita sepakati sebelumnya, dengan detail implementasi teknis.

  * **Tabel `Users`:**
      * `id`: `TextColumn().withLength(min: 3, max: 20).unique()`
      * `name`: `TextColumn().withLength(min: 3, max: 50)`
      * `email`: `TextColumn().unique()`
      * `passwordHash`: `TextColumn()`
  * **Tabel `Transactions`:**
      * `id`: `TextColumn().unique()`
      * `userId`: `TextColumn().references(Users, #id)`
      * `type`: `TextColumn().withLength(min: 3, max: 10)` // 'income' or 'expense'
      * `amount`: `RealColumn()`
      * `categoryId`: `TextColumn().references(Categories, #id)`
      * `description`: `TextColumn().nullable()`
      * `date`: `DateTimeColumn()`
  * **Tabel `Categories`:**
      * `id`: `TextColumn().unique()`
      * `userId`: `TextColumn().references(Users, #id)`
      * `name`: `TextColumn()`
      * `type`: `TextColumn()`
  * **Tabel `Debts`:**
      * `id`: `TextColumn().unique()`
      * `userId`: `TextColumn().references(Users, #id)`
      * `contactName`: `TextColumn()`
      * `amount`: `RealColumn()`
      * `dueDate`: `DateTimeColumn()`
      * `isPaid`: `BoolColumn().withDefault(const Constant(false))`
  * **Tabel `Stocks`:**
      * `id`: `TextColumn().unique()`
      * `userId`: `TextColumn().references(Users, #id)`
      * `name`: `TextColumn()`
      * `currentStock`: `IntColumn().withDefault(const Constant(0))`
      * `purchasePrice`: `RealColumn()`
      * `salePrice`: `RealColumn()`

#### 5\. Alur Data dan Proses

  * **Flow Pencatatan Transaksi:**

    1.  UI memanggil *use case* `AddTransaction` dengan data input.
    2.  `AddTransactionUseCase` (lapisan `domain`) memvalidasi data.
    3.  *Use case* memanggil `TransactionRepository.addTransaction()` (lapisan `domain`).
    4.  Implementasi `TransactionRepository` (lapisan `data`) melakukan operasi `insert` ke tabel `transactions` di database `Drift`.
    5.  Database mengonfirmasi operasi.
    6.  Data diperbarui dan `StreamProvider` di Riverpod memberi tahu UI untuk *rebuild*.

  * **Flow Menampilkan Laporan:**

    1.  UI (halaman laporan) mendengarkan `StreamProvider` dari `ReportRepository`.
    2.  `ReportRepository` melakukan kueri (`SELECT`) ke tabel `transactions` dengan filter tanggal.
    3.  Data mentah dari `Drift` dipetakan ke model data (Freezed) dan dikirim ke UI.
    4.  UI menggunakan data tersebut untuk menggambar grafik dan tabel.

#### 6\. Teknologi dan Alat Tambahan

  * **State Management:** **Riverpod Generator** akan digunakan untuk menghasilkan *provider* yang secara otomatis memperbarui UI saat data berubah (misalnya, setelah transaksi baru disimpan).
  * **Routing:** **GoRouter** akan mengelola navigasi aplikasi. Kita akan mendefinisikan rute-rute (contoh: `/`, `/transactions`, `/reports`) secara deklaratif.
  * **Logging:** **Logger** akan diintegrasikan untuk melacak alur data dan mendeteksi kesalahan selama pengembangan.
