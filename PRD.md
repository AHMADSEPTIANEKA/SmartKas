# Product Requirements Document (PRD)

**Produk:** SmartKas – Manajemen Keuangan Pribadi & Mode UMKM
**Sumber dasar:** Folder aplikasi yang dikirim (HTML/CSS/JS) — **diupgrade menggunakan Appwrite** (Auth, Database, Functions, Storage, Realtime)
**Versi PRD:** 1.0
**Tanggal:** 30 Oktober 2025

---

## 1. Ringkasan Eksekutif

SmartKas adalah aplikasi manajemen keuangan ringan yang berjalan di browser (client-side only) dengan dua mode utama: **Personal** (pemasukan/pengeluaran, tagihan, laporan, profil) dan **UMKM** (produk, penjualan, stok, dasbor UMKM). Data disimpan di **localStorage**. Visualisasi menggunakan **Chart.js**, ikon dari **Font Awesome**, antarmuka dibuat dengan **HTML/CSS** vanilla dan interaksi **JavaScript** murni.

Tujuan PRD ini adalah mengkristalkan kebutuhan produk saat ini dan rencana pengembangan menuju rilis publik minimal (MVP+) serta peta jalan untuk fitur lanjutan (sinkronisasi awan, multi-perangkat, autentikasi sesungguhnya, dsb.).

---

## 2. Tujuan Produk & Sasaran Bisnis

* **Meningkatkan literasi finansial personal** dengan pencatatan cepat dan grafik ringkas.
* **Membantu UMKM mikro** mencatat produk, penjualan harian, dan memantau stok tanpa instalasi.
* **MVP yang dapat diakses offline** (PWA opsional) agar tetap berguna di area konektivitas rendah.
* **Konversi pengguna**: Dorong penggunaan berulang melalui laporan harian/bulanan, dan notifikasi lokal.

**KPI/Metrix awal**

* Retensi 7/30 hari (persentase pengguna yang kembali).
* Rata-rata transaksi yang dicatat per pengguna per minggu.
* Jumlah hari aktif per minggu per pengguna.
* Untuk UMKM: jumlah penjualan/produk aktif, frekuensi update stok.

---

## 3. Pengguna & Persona

1. **Individu pekerja/karyawan** – butuh catat pemasukan/pengeluaran, pantau saldo.
2. **Pelaku UMKM mikro** – butuh catat penjualan tunai sederhana, lihat stok rendah, pantau performa harian.
3. **Mahasiswa/rumah tangga** – butuh laporan bulanan sederhana dan tagihan (utang/piutang) yang mudah ditandai statusnya.

---

## 4. Ruang Lingkup (Scope)

### 4.1 Dalam Ruang Lingkup (MVP+)

* **Autentikasi Appwrite**: Email/Password (Account API) + session, reset kata sandi via link magic, verifikasi email.
* **Mode Personal** (tidak berubah fungsinya) dengan persistensi ke **Appwrite Database**.
* **Mode UMKM** (Produk, Penjualan, Stok, Dasbor) dengan persistensi ke **Appwrite Database** dan **Realtime** untuk update multi-perangkat.
* **Laporan** (Harian/Bulanan/Tahunan) dihitung via **Appwrite Cloud Functions** (Node.js) atau query agregasi di klien jika data kecil.
* **Penyimpanan** lampiran (opsional) via **Appwrite Storage**.
* **Caching lokal**: IndexedDB/localStorage untuk offline read-only; sinkronisasi saat online.
* **Notifikasi email** (opsional) menggunakan **Appwrite Functions + Mail**.

### 4.2 Di Luar Ruang Lingkup (Tahap Selanjutnya)

* **SSO OAuth** (Google/Apple) dan MFA.
* Kolaborasi multi-toko & peran lanjutan (Owner/Kasir/Auditor) di tingkat organisasi.
* Ekspor resmi PDF terformat dan tanda tangan digital.
* Integrasi akuntansi penuh (COGS otomatis, jurnal, neraca) & pajak.
* PWA advanced (background sync, push) — sebagian mungkin masuk roadmap.
* i18n (id/en) lengkap.

---

## 5. Fitur Terperinci & Kriteria Penerimaan

### 5.1 Splash & Navigasi

* **Splash** menampilkan logo dan tombol *Masuk*.
* **Navbar dinamis** berdasarkan mode (Personal/UMKM) dan halaman aktif.
  **Kriteria penerimaan**:
* Setelah login, navbar tampil dengan item yang relevan; klik menu memanggil `showPage()` dan menampilkan halaman target (elemen `.page`).

### 5.2 Autentikasi (semu)

* **Login**: input `username`, `password`.
* **Register**: `regUsername`, `regEmail`, `regPassword`.
  **Kriteria**:
* Validasi isian kosong memunculkan notifikasi peringatan; sukses menyembunyikan `#authPage`, menampilkan `#content` & `#navbar`, memulihkan mode terakhir (jika ada) via `getSavedMode()`.

### 5.3 Dasbor Personal

* Kartu ringkas: total pemasukan, total pengeluaran, sisa saldo.
* Grafik: tampilan **harian/bulanan/tahunan** dari data pemasukan/pengeluaran memakai Chart.js.
* Tabel **Transaksi Terbaru**: paginasi **Prev/Next**, 5 baris/halaman.
* **Theme toggle** (ikon berubah 🌞/🌙).
  **Kriteria**:
* Perubahan data memicu `updateDashboard()` → angka kartu, grafik, dan tabel terbaru ter-update; data saldo disimpan di state dan persist di localStorage.

### 5.4 Pemasukan & Pengeluaran

* Form tambah dengan input sumber/kebutuhan dan jumlah.
* Tanggal otomatis hari ini (lokal).
* Tabel daftar dengan aksi hapus.
  **Kriteria**:
* Input valid menghasilkan entri baru (memiliki `id`, `sumber/kebutuhan`, `jumlah`, `tanggal`).
* `saveDataToStorage()` dipanggil setelah perubahan; nilai kartu & grafik berubah konsisten.

### 5.5 Tagihan (Utang/Piutang)

* Tambah baris dengan **jenis** (utang/piutang), **nama**, **jumlah**, **tanggal** (opsional).
* Toggle status **Belum Lunas/Lunas** via switch; mengubah atribut `data-status`.
* Aksi hapus baris.
  **Kriteria**:
* Baris baru muncul di `#tabelTagihan tbody` dengan badge jenis, nominal terformat `formatRupiah()`, dan switch berfungsi (teks status berubah).
* Hapus menghilangkan baris dan (opsional) persist jika disimpan ke struktur data.

### 5.6 Laporan (Harian/Bulanan/Tahunan)

* Tab tiga level; isi tabel dari gabungan pemasukan/pengeluaran yang di-*map* menjadi {tanggal, jenis, deskripsi, jumlah}.
* Dropdown **filter tahun** otomatis (N…N-5).
  **Kriteria**:
* Mengganti tab mengubah sumber data & render tabel.
* Pada dataset kosong, tampil placeholder "Belum ada data…".

### 5.7 Profil & Tentang

* **Profil**: ringkasan saldo (sisa) dan statistik ringkas.
* **Tentang**: informasi pengembang (nama-nama tertera: *Ahmad Septian Eka Setiawan* & *Ihsanul Hafidzin*).
  **Kriteria**:
* Halaman dapat diakses, konten informatif tampil benar.

### 5.8 Mode UMKM

* **Masuk/Keluar Mode**: tombol mengubah `currentMode`, menyimpan preferensi, dan merender navbar UMKM.
* **Dasbor UMKM**: kartu Produk Aktif, Penjualan Hari Ini, Stok Rendah.
* **Produk**: CRUD sederhana (minimal Create/Delete) untuk nama, harga, stok.
* **Penjualan**: tambah penjualan (produk, qty, harga → total), daftar, hapus baris.
* **Stok**: tabel stok, penanda stok rendah.
* **Pengaturan**: tombol keluar mode.
  **Kriteria**:
* Menambah produk menambah hitungan Produk Aktif; menambah penjualan memperbarui Penjualan Hari Ini; item stok rendah tercermin di stat.
* Data UMKM persist di localStorage (kunci terpisah), ikut dipulihkan saat login.

---

## 6. Arsitektur & Teknologi

* **Klien**: `index.html`, `css/style.css`, `js/script.js`.
* **Backend**: **Appwrite** (Self‑host atau Cloud).

  * **Auth**: Account API (email/password, email verification, password recovery).
  * **Database**: Collections untuk Personal & UMKM (lihat skema di bawah) dengan **Document-level Permissions**.
  * **Functions**: Node.js/TypeScript untuk agregasi laporan, notifikasi jatuh tempo, backup berkala.
  * **Storage**: bucket untuk lampiran (nota/faktur) — opsional.
  * **Realtime**: subscription pada koleksi `penjualan`, `produk` untuk update multi-perangkat.
* **Pustaka eksternal**:

  * `Chart.js` (grafik), `Font Awesome` (ikon).
  * **Appwrite Web SDK** untuk semua operasi backend.
* **Konfigurasi Klien** (ENV build-time):

  * `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_PLATFORM` (web), `APPWRITE_DATABASE_ID`, `APPWRITE_BUCKET_ID`.
* **Caching & Offline**: IndexedDB (via `idb`/custom) sebagai cache; ketika offline, aplikasi menjadi read-only dan mengantrikan mutasi untuk dikirim saat online.

### 6.1 Skema Koleksi Appwrite (Database)

**Database ID:** `smartkas`

**Collection: `users_profile`**

* `userId` (string, required, unique, `auth.userId`)
* `displayName` (string)
* `theme` (enum: `light|dark`)
* **Permissions**: `read: user(userId)`, `write: user(userId)`

**Collection: `personal_transactions`**

* `userId` (string, index)
* `type` (enum: `in|out`)
* `title` (string)
* `amount` (double)
* `date` (string, format `YYYY-MM-DD`, index by date)
* `createdAt` (datetime)
* **Permissions**: `read/write: user(userId)`
* **Indexes**: `byUserDate (userId+date)`, `byUserType (userId+type)`

**Collection: `bills`**

* `userId` (string, index)
* `kind` (enum: `utang|piutang`)
* `name` (string)
* `amount` (double)
* `date` (string `YYYY-MM-DD`)
* `status` (enum: `belum_lunas|lunas`, index)
* **Permissions**: `read/write: user(userId)`

**Collection: `products`**

* `ownerId` (string, index)
* `name` (string)
* `price` (double)
* `stock` (integer)
* `stockMin` (integer, default 0)
* **Permissions**: `read/write: user(ownerId)`
* **Indexes**: `byOwnerName (ownerId+name)`

**Collection: `sales`**

* `ownerId` (string, index)
* `productId` (string, relation products)
* `productName` (string) // denormalized
* `qty` (integer)
* `price` (double)
* `total` (double)
* `date` (string `YYYY-MM-DD`, index)
* `createdAt` (datetime)
* **Permissions**: `read/write: user(ownerId)`
* **Indexes**: `byOwnerDate (ownerId+date)`, `byOwnerProduct (ownerId+productId)`

### 6.2 Kontrak Operasi (via Appwrite SDK)

* **Auth**

  * `account.createEmailSession(email, password)`
  * `account.create(userId, email, password)` → verifikasi email
  * `account.createRecovery(email, url)` untuk reset
* **Personal**

  * Tambah pemasukan/pengeluaran → `databases.createDocument('smartkas','personal_transactions', ID.unique(), payload)`
  * Query laporan harian/bulanan/tahunan → `databases.listDocuments` dengan filter `userId` + rentang `date` (atau lewat Function agregasi)
* **Tagihan**

  * CRUD dokumen di `bills`, toggle `status`
* **UMKM**

  * Produk CRUD di `products`
  * Penjualan create di `sales` + (opsional) Function untuk decrement stok produk secara atomik
* **Realtime**

  * `client.subscribe('databases.smartkas.collections.sales.documents', handler)` untuk update dasbor UMKM

### 6.3 Keamanan

* Terapkan **Document Permissions** ketat: setiap dokumen hanya dapat dibaca/ditulis pemiliknya.
* Validasi di Functions (mis. operasi stok) untuk mencegah mismatch.
* Rate limit di layer edge (Cloudflare/NGINX) bila self-hosted.

### 6.4 Migrasi dari localStorage

1. Setelah login pertama, klien membaca data lokal lama (`smartKasData`, dll.).
2. Menyajikan dialog "Migrasi data ke cloud" → jika setuju, push batch ke koleksi terkait.
3. Menandai bendera `isMigrated=true` di `users_profile`.
4. Menonaktifkan penulisan ke localStorage kecuali sebagai cache.

---

## 7. UX/UI & Komponen Kunci

* **Tema**: tombol toggle tema pada dasbor personal dan UMKM.
* **Grid & Kartu**: kartu ringkasan, kartu formulir, tabel responsif dengan aksi.
* **Pagination**: transaksi terbaru di dasbor (5 baris per halaman).
* **Badge**: utang/piutang, toggle switch status tagihan.

**Aksesibilitas minimal**:

* Fokus yang terlihat pada tombol dan input.
* Kontras memadai pada tema gelap/terang.
* Label/placeholder jelas.

---

## 8. Non-Fungsional

* **Performa**: query paginasi (limit 50) di Appwrite; agregasi laporan via Function dengan cold start <1s (target) dan p95 <2s.
* **Reliabilitas**: operasi mutasi idempoten (gunakan `ID.unique()` dan deduplikasi di client bila retry).
* **Ketersediaan**: manfaatkan Appwrite Cloud SLA / HA pada self-host.
* **Privasi & Keamanan**: dokumen ter-ACL per pengguna; data dalam transit TLS; at-rest mengikuti enkripsi Appwrite.
* **Offline**: cache IndexedDB, antrian mutasi (outbox) yang dikirim saat online.

---

## 9. Alur Pengguna (Ringkas)

1. **Pertama kali**: buka → Splash (otomatis pindah ke Login dalam ≤3 detik atau tombol *Masuk*).
2. **Login**: input data → masuk ke Dasbor.
3. **Catat transaksi**: pergi ke Pemasukan/Pengeluaran → tambah → kembali ke Dasbor untuk melihat ringkasan & grafik.
4. **Kelola Tagihan**: tambah utang/piutang → toggle status saat lunas.
5. **Laporan**: cek ringkasan Harian/Bulanan/Tahunan.
6. **UMKM**: aktifkan Mode UMKM → kelola Produk/Penjualan/Stok; keluar dari mode saat selesai.

---

## 10. Dependensi & Risiko

* **CDN** (Chart.js, Font Awesome) → tidak tersedia saat offline. **Mitigasi**: bundling lokal & PWA.
* **LocalStorage** batas ~5–10MB → data besar (penjualan harian panjang) bisa penuh. **Mitigasi**: ekspor berkala, kompresi ringan, atau pindah ke IndexedDB/backend.
* **Autentikasi semu** → tidak aman. **Mitigasi**: rencana migrasi ke backend OAuth/email.
* **Integritas data** (hapus baris langsung di DOM pada Tagihan) tidak tersinkron ke model terpadu. **Mitigasi**: satukan model data Tagihan di state + persist.

---

## 11. Roadmap & Rilis

**Rilis 0.1 – Appwrite Enablement (1–2 minggu)**

* Setup project Appwrite, Database & Collections, Permissions.
* Integrasi Auth (login/register/verify/recovery).
* Migrasi CRUD Personal & UMKM ke Appwrite Database.

**Rilis 0.2 – Realtime & Functions (1–2 minggu)**

* Realtime untuk `sales` & `products` (UMKM dashboard live).
* Function: agregasi laporan H/B/T, decrement stok atomik.
* Caching offline (IndexedDB) & antrian mutasi.

**Rilis 0.3 – Ekosistem & Ekspor (1–2 minggu)**

* Ekspor CSV (Functions) + backup/restore JSON.
* Notifikasi jatuh tempo tagihan (scheduler Function).
* Bundling Chart.js & Font Awesome lokal.

**Rilis 0.4 – PWA & Hardening (1–2 minggu)**

* Service Worker, manifest, background sync.
* Penguatan keamanan, audit permission, observability (logs Functions).

## 12. Analytics & Telemetri (opsional saat ada backend)

* Event dikirim via Function/event collector: tambah transaksi, tambah produk/penjualan, toggle tagihan, ganti tab laporan, mode UMKM on/off.
* Error logging: kegagalan query/mutasi Appwrite, konflik stok.

--- Analytics & Telemetri (opsional saat ada backend)

* Event: tambah pemasukan/pengeluaran, tambah produk/penjualan, toggle tagihan, ganti tab laporan, masuk/keluar mode UMKM.
* Screen view: Dashboard, Pemasukan, Pengeluaran, Tagihan, Laporan(H/B/T), Profil, UMKM(Dashboard/Produk/Penjualan/Stok/Pengaturan).
* Error logging: validasi input, kegagalan persist, anomali saldo.

---

## 13. Kebutuhan Teknis Detail & Kontrak Komponen

**Komponen Grafik (Chart.js)**

* Tidak berubah; sumber data kini berasal dari query Appwrite/Function.

**SDK Inisialisasi**

```js
import { Client, Account, Databases, Storage } from 'appwrite';
const client = new Client()
  .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
  .setProject(import.meta.env.APPWRITE_PROJECT_ID);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
```

**Konstanta**

```ts
const DB = 'smartkas';
const COL = {
  PROFILE: 'users_profile',
  PERSONAL: 'personal_transactions',
  BILLS: 'bills',
  PRODUCTS: 'products',
  SALES: 'sales'
};
```

**Operasi Kritis**

* Tambah transaksi personal:

```js
databases.createDocument(DB, COL.PERSONAL, 'unique()', {
  userId, type, title, amount, date, createdAt: new Date().toISOString()
});
```

* Query laporan bulanan (klien):

```js
databases.listDocuments(DB, COL.PERSONAL, [
  Query.equal('userId', userId),
  Query.greaterThanEqual('date', `${year}-${month}-01`),
  Query.lessThanEqual('date', `${year}-${month}-${lastDay}`)
]);
```

* Decrement stok atomik (Function):

```ts
// pseudo: within serverless function
await databases.updateDocument(DB, COL.PRODUCTS, productId, { stock: stock - qty });
```

---

## 14. Kriteria Kualitas & Uji (Acceptance Tests)

* **Tambah pemasukan** mengubah total pemasukan dan sisa saldo; muncul di transaksi terbaru & laporan harian.
* **Tambah pengeluaran** mengubah total pengeluaran dan sisa saldo.
* **Grafik** berubah sesuai perubahan data dan pilihan tampilan.
* **Tagihan**: toggle status memperbarui tampilan status; baris dapat dihapus; (jika dipersist) reload menampilkan status yang sama.
* **UMKM**: tambah produk menaikkan hitungan produk aktif; tambah penjualan menambah penjualan hari ini dan mengurangi stok produk terkait (bila diterapkan).
* **Tema**: toggle mengubah ikon dan variabel CSS; preferensi disimpan.
* **Persistensi**: reload halaman memulihkan semua data terakhir.

---

## 15. Pertanyaan Terbuka

* Apakah butuh **multi-toko** dan multi-user (peran owner/kasir)?
* Target platform awal: **web saja** atau sekalian PWA + Android WebView?
* Apakah perlu ekspor **PDF** resmi untuk laporan bulanan/tahunan?
* Ambang **stok minimum** default untuk penanda stok rendah?
* Mekanisme **backup/restore** data lokal yang diinginkan?

---

## 16. Lampiran

* Struktur folder saat ini:

```
lofi/
 ├─ index.html
 ├─ css/
 │   └─ style.css
 └─ js/
     └─ script.js
```

* Pustaka via CDN: Chart.js, Font Awesome, Appwrite Web SDK.

### 16.1 Checklist Implementasi Appwrite

* [ ] Buat Project + API Key (jika perlu untuk Functions)
* [ ] Buat Database `smartkas` & Collections (`users_profile`, `personal_transactions`, `bills`, `products`, `sales`)
* [ ] Set Permissions per dokumen (`read/write: user(userId)`) dan indeks
* [ ] Konfigurasi Auth (email verification & recovery URLs)
* [ ] Deploy Functions: agregasi laporan, decrement stok, scheduler tagihan
* [ ] Konfigurasi Realtime subscription di klien
* [ ] Tambah caching IndexedDB & strategi sync
* [ ] Implement migrasi dari localStorage

---

> Revisi ini memigrasikan PRD ke arsitektur **Appwrite** end‑to‑end, lengkap dengan skema koleksi, permission, dan rencana migrasi. Siap untuk dipecah menjadi tiket implementasi (Auth, DB CRUD, Realtime, Functions, Offline/PWA).
