/* ==========================
   DATA STORAGE & INIT
   ========================== */
let dataKeuangan = {
    pemasukan: [],
    pengeluaran: [],
    saldo: 0
};

let currentMode = 'personal';
let chartKeuangan;

// Variabel untuk pagination transaksi terbaru
let currentPage = 1;
const rowsPerPage = 5;

// Inisialisasi aplikasi
function initApp() {
    loadDataFromStorage();             
    applyTheme(getPreferredTheme());
    
    // Inisialisasi chart hanya jika elemen ada
    const ctx = document.getElementById('chartKeuangan');
    if (ctx) {
        initChart();
    }
    
    // Update dashboard hanya jika user sudah login
    const contentPage = document.getElementById("content");
    if (contentPage && contentPage.style.display !== "none") {
        updateDashboard();
        setTimeout(updateChart, 200);
    }
}

// Load data dari localStorage
function loadDataFromStorage() {
    const savedData = localStorage.getItem('smartKasData');
    if (savedData) {
        dataKeuangan = JSON.parse(savedData);
    }
}

// Save data ke localStorage
function saveDataToStorage() {
    localStorage.setItem('smartKasData', JSON.stringify(dataKeuangan));
}

// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ==========================
   NAV & AUTH
   ========================== */
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const target = document.getElementById(pageId);
    if (target) {
        target.style.display = "block";
        
        // Update dashboard jika membuka dashboard
        if (pageId === 'dashboard') {
            setTimeout(updateDashboard, 100);
        }
        
        // Update profil saldo jika membuka pengaturan
        if (pageId === 'pengaturan') {
            updateProfilSaldo();
        }
    }
    
    // Update navbar active state
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(pageId)) {
            link.classList.add('active');
        }
    });
}

function goLogin() {
    document.getElementById("splash").classList.add("hidden");
    setTimeout(() => {
        document.getElementById("splash").style.display = "none";
        document.getElementById("authPage").style.display = "flex";
    }, 800);
}

function showRegister() {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if (!username || !password) {
        showNotification('Harap isi username dan password', 'warning');
        return;
    }
    
    document.getElementById("authPage").style.display = "none";
    document.getElementById("content").style.display = "block";
    document.getElementById("navbar").style.display = "flex";

    // Pulihkan mode terakhir jika ada
    const savedMode = getSavedMode();
    currentMode = savedMode || 'personal';
    renderNavbar(currentMode, currentMode === 'umkm' ? 'umkmDashboard' : 'dashboard');

    // 🔥 PERBAIKAN: Panggil fungsi untuk memperbarui semua data setelah login
    updateAllDataAfterLogin();
    
    showNotification('Login berhasil!', 'success');
}

function register() {
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    
    if (!username || !email || !password) {
        showNotification('Harap lengkapi semua data registrasi', 'warning');
        return;
    }
    
    showNotification("Akun berhasil dibuat! Silakan login.", "success");
    showLogin();
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        document.getElementById("content").style.display = "none";
        document.getElementById("navbar").style.display = "none";
        document.getElementById("splash").style.display = "flex";
        document.getElementById("authPage").style.display = "none";
        
        // Reset form login
        document.getElementById("username").value = '';
        document.getElementById("password").value = '';
        
        showNotification('Logout berhasil', 'info');
    }
}

/* ==========================
   FUNGSI BARU: Update Semua Data Setelah Login
   ========================== */
function updateAllDataAfterLogin() {
    // Reset ke halaman 1 setiap login
    currentPage = 1;
    
    // Update dashboard utama
    updateDashboard();
    
    // Update tabel-tabel
    updateTabelPemasukan();
    updateTabelPengeluaran();
    
    // Update transaksi terbaru
    updateTransaksiTerbaru();
    
    // Update profil saldo
    updateProfilSaldo();
    
    // Update chart dengan delay untuk memastikan elemen sudah tersedia
    setTimeout(() => {
        if (!chartKeuangan) {
            initChart();
        } else {
            updateChart();
        }
    }, 300);
    
    // Jika mode UMKM, update data UMKM juga
    if (currentMode === 'umkm') {
        updateTabelProduk();
        updateTabelPenjualan();
        updateTabelStok();
        updateStatUMKM();
    }
}

/* ==========================
   DASHBOARD & CHART
   ========================== */
function updateDashboard() {
    const totalPemasukan = dataKeuangan.pemasukan.reduce((sum, item) => sum + item.jumlah, 0);
    const totalPengeluaran = dataKeuangan.pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
    const sisaSaldo = totalPemasukan - totalPengeluaran;

    // Update summary cards
    document.getElementById('totalPemasukan').textContent = formatRupiah(totalPemasukan);
    document.getElementById('totalPengeluaran').textContent = formatRupiah(totalPengeluaran);
    document.getElementById('sisaSaldo').textContent = formatRupiah(sisaSaldo);

    // Update saldo di data
    dataKeuangan.saldo = sisaSaldo;
    
    // Update chart jika sudah diinisialisasi
    if (chartKeuangan) {
        updateChart();
    }
    
    // Update tabel transaksi terbaru (dengan pagination)
    updateTransaksiTerbaru();
    
    // Update profil saldo
    updateProfilSaldo();
    
    // Update tabel pemasukan dan pengeluaran
    updateTabelPemasukan();
    updateTabelPengeluaran();
    
    // Save data
    saveDataToStorage();
}

function updateProfilSaldo() {
    const profilSaldo = document.getElementById('profilSaldo');
    if (profilSaldo) {
        profilSaldo.textContent = formatRupiah(dataKeuangan.saldo);
    }
}

function initChart() {
  const ctx = document.getElementById('chartKeuangan');
  if (!ctx) return;

  chartKeuangan = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Pemasukan',
          data: [],
          backgroundColor: 'rgba(46, 204, 113, 0.8)',
          borderColor: 'rgba(39, 174, 96, 1)',
          borderWidth: 1,
          borderRadius: 8
        },
        {
          label: 'Pengeluaran',
          data: [],
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          borderColor: 'rgba(192, 57, 43, 1)',
          borderWidth: 1,
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
          }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              label += formatRupiah(context.parsed.y);
              return label;
            }
          }
        }
      }
    }
  });

  updateChart();
}

let chartView = 'bulanan';

function updateChartView(mode) {
  chartView = mode;
  updateChart();
}

function updateChart() {
  if (!chartKeuangan) return;

  const pemasukan = dataKeuangan.pemasukan || [];
  const pengeluaran = dataKeuangan.pengeluaran || [];

  let labels = [], dataIn = [], dataOut = [];

  function parseDate(tgl) {
    return new Date(tgl + "T00:00:00");
  }

  if (chartView === 'harian') {
    labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    dataIn = Array(7).fill(0);
    dataOut = Array(7).fill(0);
    pemasukan.forEach(p => dataIn[(parseDate(p.tanggal).getDay() + 6) % 7] += p.jumlah);
    pengeluaran.forEach(p => dataOut[(parseDate(p.tanggal).getDay() + 6) % 7] += p.jumlah);
  } 
  else if (chartView === 'bulanan') {
    labels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    dataIn = Array(12).fill(0);
    dataOut = Array(12).fill(0);
    pemasukan.forEach(p => dataIn[parseDate(p.tanggal).getMonth()] += p.jumlah);
    pengeluaran.forEach(p => dataOut[parseDate(p.tanggal).getMonth()] += p.jumlah);
  } 
  else {
    const tahunSekarang = new Date().getFullYear();
    labels = [tahunSekarang - 2, tahunSekarang - 1, tahunSekarang];
    dataIn = [0, 0, 0];
    dataOut = [0, 0, 0];
    pemasukan.forEach(p => {
      const y = parseDate(p.tanggal).getFullYear();
      const idx = labels.indexOf(y);
      if (idx !== -1) dataIn[idx] += p.jumlah;
    });
    pengeluaran.forEach(p => {
      const y = parseDate(p.tanggal).getFullYear();
      const idx = labels.indexOf(y);
      if (idx !== -1) dataOut[idx] += p.jumlah;
    });
  }

  chartKeuangan.data.labels = labels;
  chartKeuangan.data.datasets[0].data = dataIn;
  chartKeuangan.data.datasets[1].data = dataOut;
  chartKeuangan.update();
}

/* ==========================
   TRANSACTION MANAGEMENT - PERBAIKAN PAGINATION
   ========================== */
function updateTransaksiTerbaru() {
    const tbody = document.querySelector('#tabelTransaksiTerbaru tbody');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';

    // Gabungkan dan sort transaksi terbaru
    const allTransactions = [
        ...dataKeuangan.pemasukan.map(p => ({
            ...p,
            type: 'pemasukan',
            deskripsi: p.sumber,
            status: 'Masuk'
        })),
        ...dataKeuangan.pengeluaran.map(p => ({
            ...p,
            type: 'pengeluaran',
            deskripsi: p.kebutuhan,
            status: 'Keluar'
        }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Hitung total pages
    const totalPages = Math.ceil(allTransactions.length / rowsPerPage);
    
    // Get data untuk page saat ini
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = allTransactions.slice(startIndex, endIndex);

    // Jika tidak ada data
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #999; padding: 20px;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                    Belum ada transaksi
                </td>
            </tr>
        `;
        
        // Sembunyikan pagination jika tidak ada data
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }

    // Tampilkan data
    pageData.forEach(transaksi => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaksi.tanggal)}</td>
            <td>${transaksi.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</td>
            <td>${transaksi.deskripsi}</td>
            <td>${formatRupiah(transaksi.jumlah)}</td>
            <td>
                <span class="badge ${transaksi.type === 'pemasukan' ? 'badge-piutang' : 'badge-utang'}">
                    ${transaksi.status}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Update pagination controls
    updatePaginationControls(allTransactions.length, totalPages);
}

function updatePaginationControls(totalItems, totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (!paginationContainer || !pageInfo || !prevBtn || !nextBtn) return;
    
    // Tampilkan pagination container
    paginationContainer.style.display = 'flex';
    
    // Update page info
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    
    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Update button styles berdasarkan state
    prevBtn.classList.toggle('disabled', prevBtn.disabled);
    nextBtn.classList.toggle('disabled', nextBtn.disabled);
}

// 🔥 PERBAIKAN: Fungsi changePage yang menerima parameter number
function changePage(direction) {
    // Hitung total transaksi untuk menentukan total pages
    const allTransactions = [
        ...dataKeuangan.pemasukan,
        ...dataKeuangan.pengeluaran
    ];
    const totalPages = Math.ceil(allTransactions.length / rowsPerPage);
    
    // Update current page berdasarkan direction number
    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }
    
    // Update tampilan
    updateTransaksiTerbaru();
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/* ==========================
   PEMASUKAN / PENGELUARAN
   ========================== */
function tambahPemasukan() {
    const sumber = document.getElementById("sumberIn").value;
    const jumlah = parseInt(document.getElementById("jumlahIn").value);

    if (!sumber || !jumlah) {
        showNotification('Harap isi sumber dan jumlah pemasukan', 'warning');
        return;
    }

    const today = new Date();
    const tanggalLokal = today.getFullYear() + '-' +
                         String(today.getMonth() + 1).padStart(2, '0') + '-' +
                         String(today.getDate()).padStart(2, '0');

    const newPemasukan = {
        id: Date.now(),
        sumber: sumber,
        jumlah: jumlah,
        tanggal: tanggalLokal
    };

    dataKeuangan.pemasukan.push(newPemasukan);
    updateDashboard();
    updateTabelPemasukan();
    
    document.getElementById("sumberIn").value = '';
    document.getElementById("jumlahIn").value = '';
    
    showNotification('Pemasukan berhasil ditambahkan', 'success');
}

function tambahPengeluaran() {
    const kebutuhan = document.getElementById("sumberOut").value;
    const jumlah = parseInt(document.getElementById("jumlahOut").value);

    if (!kebutuhan || !jumlah) {
        showNotification('Harap isi kebutuhan dan jumlah pengeluaran', 'warning');
        return;
    }

    const today = new Date();
    const tanggalLokal = today.getFullYear() + '-' +
                         String(today.getMonth() + 1).padStart(2, '0') + '-' +
                         String(today.getDate()).padStart(2, '0');

    const newPengeluaran = {
        id: Date.now(),
        kebutuhan: kebutuhan,
        jumlah: jumlah,
        tanggal: tanggalLokal
    };

    dataKeuangan.pengeluaran.push(newPengeluaran);
    updateDashboard();
    updateTabelPengeluaran();
    
    document.getElementById("sumberOut").value = '';
    document.getElementById("jumlahOut").value = '';
    
    showNotification('Pengeluaran berhasil ditambahkan', 'success');
}

function updateTabelPemasukan() {
    const tbody = document.querySelector('#tabelPemasukan tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataKeuangan.pemasukan.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.sumber}</td>
            <td>${formatRupiah(item.jumlah)}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="hapusPemasukan(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTabelPengeluaran() {
    const tbody = document.querySelector('#tabelPengeluaran tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataKeuangan.pengeluaran.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.kebutuhan}</td>
            <td>${formatRupiah(item.jumlah)}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="hapusPengeluaran(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function hapusPemasukan(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pemasukan ini?')) {
        dataKeuangan.pemasukan = dataKeuangan.pemasukan.filter(item => item.id !== id);
        updateDashboard();
        updateTabelPemasukan();
        showNotification('Pemasukan berhasil dihapus', 'success');
    }
}

function hapusPengeluaran(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
        dataKeuangan.pengeluaran = dataKeuangan.pengeluaran.filter(item => item.id !== id);
        updateDashboard();
        updateTabelPengeluaran();
        showNotification('Pengeluaran berhasil dihapus', 'success');
    }
}

/* ==========================
   TAGIHAN
   ========================== */
function toggleStatusTagihan(checkbox, index) {
    const row = checkbox.closest('tr');
    const isLunas = checkbox.checked;
    
    row.setAttribute('data-status', isLunas ? 'lunas' : 'belum-lunas');
    updateRingkasanTagihan();
    
    const jenis = row.querySelector('.badge').textContent.trim();
    const nama = row.cells[1].textContent;
    const status = isLunas ? 'lunas' : 'belum lunas';
    
    showNotification(`${jenis} ke ${nama} ditandai sebagai ${status}`, 'success');
}

function filterTagihan(filter) {
    const rows = document.querySelectorAll('#tabelTagihan tbody tr');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    rows.forEach(row => {
        const jenis = row.getAttribute('data-jenis');
        const status = row.getAttribute('data-status');
        
        let showRow = false;
        
        switch(filter) {
            case 'semua':
                showRow = true;
                break;
            case 'utang':
                showRow = jenis === 'utang';
                break;
            case 'piutang':
                showRow = jenis === 'piutang';
                break;
            case 'belum-lunas':
                showRow = status === 'belum-lunas';
                break;
            case 'lunas':
                showRow = status === 'lunas';
                break;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

function tambahTagihan() {
    const jenis = document.getElementById('jenisTagihan').value;
    const nama = document.getElementById('namaTagihan').value;
    const jumlah = document.getElementById('jumlahTagihan').value;
    const tenggat = document.getElementById('tenggatTagihan').value;
    
    if (!nama || !jumlah) {
        showNotification('Harap isi nama dan jumlah tagihan', 'warning');
        return;
    }
    
    const tanggal = tenggat ? new Date(tenggat).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }) : '-';
    
    const tbody = document.querySelector('#tabelTagihan tbody');
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-jenis', jenis);
    newRow.setAttribute('data-status', 'belum-lunas');
    
    newRow.innerHTML = `
        <td>
            <span class="badge ${jenis === 'utang' ? 'badge-utang' : 'badge-piutang'}">
                <i class="fas fa-${jenis === 'utang' ? 'arrow-down' : 'arrow-up'}"></i> 
                ${jenis === 'utang' ? 'Utang' : 'Piutang'}
            </span>
        </td>
        <td>${nama}</td>
        <td>${formatRupiah(parseInt(jumlah))}</td>
        <td>${tanggal}</td>
        <td>
            <label class="toggle-switch">
                <input type="checkbox" onchange="toggleStatusTagihan(this, ${tbody.children.length})">
                <span class="slider">
                    <span class="status-text belum-lunas">Belum Lunas</span>
                    <span class="status-text lunas">Lunas</span>
                </span>
            </label>
        </td>
        <td>
            <button class="btn-icon btn-danger" onclick="hapusTagihan(this)" title="Hapus">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    
    document.getElementById('namaTagihan').value = '';
    document.getElementById('jumlahTagihan').value = '';
    document.getElementById('tenggatTagihan').value = '';
    
    updateRingkasanTagihan();
    showNotification('Tagihan berhasil ditambahkan', 'success');
}

function hapusTagihan(button) {
    if (confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
        const row = button.closest('tr');
        row.remove();
        updateRingkasanTagihan();
        showNotification('Tagihan berhasil dihapus', 'success');
    }
}

function updateRingkasanTagihan() {
    const rows = document.querySelectorAll('#tabelTagihan tbody tr');
    let totalUtang = 0;
    let totalPiutang = 0;
    
    rows.forEach(row => {
        const jenis = row.getAttribute('data-jenis');
        const status = row.getAttribute('data-status');
        const jumlahText = row.cells[2].textContent.replace('Rp ', '').replace(/\./g, '');
        const jumlah = parseInt(jumlahText) || 0;
        
        if (status === 'belum-lunas') {
            if (jenis === 'utang') {
                totalUtang += jumlah;
            } else {
                totalPiutang += jumlah;
            }
        }
    });
    
    const saldoBersih = totalPiutang - totalUtang;
    
    document.querySelector('.summary-value.utang').textContent = formatRupiah(totalUtang);
    document.querySelector('.summary-value.piutang').textContent = formatRupiah(totalPiutang);
    
    const saldoElement = document.querySelector('.summary-value.net');
    if (saldoBersih >= 0) {
        saldoElement.textContent = formatRupiah(saldoBersih);
        saldoElement.style.color = '#2ecc71';
    } else {
        saldoElement.textContent = formatRupiah(Math.abs(saldoBersih));
        saldoElement.style.color = '#e74c3c';
    }
}

/* ==========================
   LAPORAN
   ========================== */
function printLaporan() { 
    window.print(); 
}

function showLaporan(type, el) {
    // Hapus kelas aktif dari semua tombol tab
    document.querySelectorAll("#laporan .tabs button").forEach(b => b.classList.remove("active"));
    el.classList.add("active");

    // Sembunyikan semua div laporan
    document.querySelectorAll("#laporan .laporan-section").forEach(div => div.style.display = "none");
    
    // Tampilkan div sesuai tipe
    const targetDiv = document.getElementById("lap" + type.charAt(0).toUpperCase() + type.slice(1));
    if (targetDiv) targetDiv.style.display = "block";

    // Update laporan
    updateLaporan(type);
}

function updateLaporan(type) {
    const pemasukan = dataKeuangan?.pemasukan || [];
    const pengeluaran = dataKeuangan?.pengeluaran || [];
    let laporanData = [];
    const today = new Date();

    // 🔹 Ambil nilai filter
    let filterTanggal;
    if (type === 'harian') {
        filterTanggal = document.getElementById("filterHarian")?.value || today.toISOString().split('T')[0];
    } else if (type === 'bulanan') {
        filterTanggal = document.getElementById("filterBulanan")?.value || today.toISOString().slice(0, 7);
    } else if (type === 'tahunan') {
        filterTanggal = document.getElementById("filterTahunan")?.value || today.getFullYear().toString();
    }

    // 🔹 Filter data sesuai tipe
    if (type === 'harian') {
        laporanData = [
            ...pemasukan.filter(p => p.tanggal === filterTanggal).map(p => ({
                tanggal: p.tanggal, jenis: 'Pemasukan', deskripsi: p.sumber, jumlah: p.jumlah
            })),
            ...pengeluaran.filter(p => p.tanggal === filterTanggal).map(p => ({
                tanggal: p.tanggal, jenis: 'Pengeluaran', deskripsi: p.kebutuhan, jumlah: p.jumlah
            }))
        ];
    } else if (type === 'bulanan') {
        laporanData = [
            ...pemasukan.filter(p => p.tanggal.startsWith(filterTanggal)).map(p => ({
                tanggal: p.tanggal, jenis: 'Pemasukan', deskripsi: p.sumber, jumlah: p.jumlah
            })),
            ...pengeluaran.filter(p => p.tanggal.startsWith(filterTanggal)).map(p => ({
                tanggal: p.tanggal, jenis: 'Pengeluaran', deskripsi: p.kebutuhan, jumlah: p.jumlah
            }))
        ];
    } else if (type === 'tahunan') {
        laporanData = [
            ...pemasukan.filter(p => p.tanggal.startsWith(filterTanggal)).map(p => ({
                tanggal: p.tanggal, jenis: 'Pemasukan', deskripsi: p.sumber, jumlah: p.jumlah
            })),
            ...pengeluaran.filter(p => p.tanggal.startsWith(filterTanggal)).map(p => ({
                tanggal: p.tanggal, jenis: 'Pengeluaran', deskripsi: p.kebutuhan, jumlah: p.jumlah
            }))
        ];
    }

    // 🔹 Urutkan dari terbaru
    laporanData.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

    // 🔹 Tampilkan di tabel
    const tbody = document.querySelector(`#lap${type.charAt(0).toUpperCase() + type.slice(1)} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';
    if (laporanData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:gray;">Belum ada data untuk ${type}</td></tr>`;
        return;
    }

    laporanData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.tanggal)}</td>
            <td>${item.jenis}</td>
            <td>${item.deskripsi}</td>
            <td>${formatRupiah(item.jumlah)}</td>
        `;
        tbody.appendChild(row);
    });
}

// 🔹 Isi dropdown tahun otomatis & load tab harian default
window.addEventListener("DOMContentLoaded", () => {
    const tahunSelect = document.getElementById("filterTahunan");
    if (tahunSelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= currentYear - 5; y--) {
            const opt = document.createElement("option");
            opt.value = y;
            opt.textContent = y;
            tahunSelect.appendChild(opt);
        }
    }

    // Load tab harian default
    const defaultTab = document.querySelector("#laporan .tabs button.active") || document.querySelector("#laporan .tabs button");
    if (defaultTab) defaultTab.click();
});

/* ==========================
   MODE UMKM
   ========================== */
const NAV_PERSONAL = [
    { id: 'dashboard',   label: 'Dashboard',   icon: 'fas fa-chart-pie' },
    { id: 'pemasukan',   label: 'Pemasukan',   icon: 'fas fa-plus-circle' },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: 'fas fa-minus-circle' },
    { id: 'utang',       label: 'Tagihan',     icon: 'fas fa-file-invoice-dollar' },
    { id: 'laporan',     label: 'Laporan',     icon: 'fas fa-file-alt' },
    { id: 'pengaturan',  label: 'Pengaturan',  icon: 'fas fa-gear' },
];

const NAV_UMKM = [
    { id: 'umkmDashboard', label: 'UMKM',      icon: 'fas fa-store' },
    { id: 'umkmPage',      label: 'Produk',    icon: 'fas fa-box' },
    { id: 'umkmPenjualan', label: 'Penjualan', icon: 'fas fa-cash-register' },
    { id: 'umkmInventori', label: 'Inventori', icon: 'fas fa-boxes-stacked' },
    { id: 'umkmLaporan',   label: 'Laporan',   icon: 'fas fa-file-invoice' },
    { id: 'umkmPengaturan',label: 'Pengaturan',icon: 'fas fa-gear' },
];

function renderNavbar(mode = 'personal', activeId = null) {
    const nav = document.getElementById('navbar');
    const items = (mode === 'umkm') ? NAV_UMKM : NAV_PERSONAL;

    nav.innerHTML = '';
    nav.classList.toggle('umkm', mode === 'umkm');

    items.forEach((item, idx) => {
        const a = document.createElement('a');
        a.href = '#';
        a.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(item.id);
        });
        nav.appendChild(a);

        if ((activeId && item.id === activeId) || (!activeId && idx === 0)) {
            a.classList.add('active');
            if (!activeId) showPage(item.id);
        }
    });

    saveMode(mode);
}

function aktifkanModeUmkm() {
    showPage('umkmIntro');
}

function enterUMKM() {
    currentMode = 'umkm';
    renderNavbar('umkm', 'umkmDashboard');
    showNotification('Mode UMKM diaktifkan', 'success');
}

function exitUMKM() {
    if (confirm('Keluar dari Mode UMKM?')) {
        currentMode = 'personal';
        renderNavbar('personal', 'dashboard');
        showNotification('Kembali ke mode personal', 'info');
    }
}

// Data UMKM
let dataUMKM = {
    produk: [],
    penjualan: [],
    stok: []
};

function loadUMKMData() {
    const savedData = localStorage.getItem('smartKasUMKMData');
    if (savedData) {
        dataUMKM = JSON.parse(savedData);
    }
}

function saveUMKMData() {
    localStorage.setItem('smartKasUMKMData', JSON.stringify(dataUMKM));
}

function tambahProduk() {
    const nama = document.getElementById("namaProduk")?.value;
    const harga = parseInt(document.getElementById("hargaProduk")?.value);
    
    if (!nama || !harga) {
        showNotification('Harap isi nama dan harga produk', 'warning');
        return;
    }

    const newProduk = {
        id: Date.now(),
        nama: nama,
        harga: harga
    };

    dataUMKM.produk.push(newProduk);
    updateTabelProduk();
    
    document.getElementById("namaProduk").value = "";
    document.getElementById("hargaProduk").value = "";
    
    // Update stat produk
    updateStatUMKM();
    
    showNotification('Produk berhasil ditambahkan', 'success');
}

function updateTabelProduk() {
    const tbody = document.querySelector('#tabelProduk tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><th>Nama Produk</th><th>Harga</th><th>Aksi</th></tr>';
    
    dataUMKM.produk.forEach(produk => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produk.nama}</td>
            <td>${formatRupiah(produk.harga)}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="hapusProduk(${produk.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function hapusProduk(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        dataUMKM.produk = dataUMKM.produk.filter(item => item.id !== id);
        updateTabelProduk();
        updateStatUMKM();
        showNotification('Produk berhasil dihapus', 'success');
    }
}

function tambahPenjualan() {
    const nama = (document.getElementById('jualNama')?.value || '').trim();
    const qty  = parseInt(document.getElementById('jualQty')?.value || '0');
    const harga= parseInt(document.getElementById('jualHarga')?.value || '0');
    
    if (!nama || qty <= 0 || harga <= 0) {
        showNotification('Harap isi semua data penjualan dengan benar', 'warning');
        return;
    }

    const total = qty * harga;
    const newPenjualan = {
        id: Date.now(),
        nama: nama,
        qty: qty,
        harga: harga,
        total: total,
        tanggal: new Date().toISOString().split('T')[0]
    };

    dataUMKM.penjualan.push(newPenjualan);
    updateTabelPenjualan();
    
    document.getElementById('jualNama').value = '';
    document.getElementById('jualQty').value = '';
    document.getElementById('jualHarga').value = '';

    updateStatUMKM();
    showNotification('Penjualan berhasil dicatat', 'success');
}

function updateTabelPenjualan() {
    const tbody = document.querySelector('#tabelPenjualan tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><th>Tanggal</th><th>Produk</th><th>Qty</th><th>Total</th><th>Aksi</th></tr>';
    
    dataUMKM.penjualan.forEach(penjualan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(penjualan.tanggal)}</td>
            <td>${penjualan.nama}</td>
            <td>${penjualan.qty}</td>
            <td>${formatRupiah(penjualan.total)}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="hapusPenjualan(${penjualan.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function hapusPenjualan(id) {
    if (confirm('Apakah Anda yakin ingin menghapus penjualan ini?')) {
        dataUMKM.penjualan = dataUMKM.penjualan.filter(item => item.id !== id);
        updateTabelPenjualan();
        updateStatUMKM();
        showNotification('Penjualan berhasil dihapus', 'success');
    }
}

function tambahStok() {
    const nama = (document.getElementById('stokNama')?.value || '').trim();
    const qty  = parseInt(document.getElementById('stokQty')?.value || '0');
    
    if (!nama || qty <= 0) {
        showNotification('Harap isi nama produk dan jumlah stok', 'warning');
        return;
    }

    // Cek apakah produk sudah ada
    const existingIndex = dataUMKM.stok.findIndex(item => item.nama.toLowerCase() === nama.toLowerCase());
    
    if (existingIndex !== -1) {
        // Update stok existing
        dataUMKM.stok[existingIndex].qty += qty;
    } else {
        // Tambah stok baru
        dataUMKM.stok.push({
            id: Date.now(),
            nama: nama,
            qty: qty
        });
    }

    updateTabelStok();
    
    document.getElementById('stokNama').value = '';
    document.getElementById('stokQty').value = '';

    updateStatUMKM();
    showNotification('Stok berhasil ditambahkan', 'success');
}

function updateTabelStok() {
    const tbody = document.querySelector('#tabelStok tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><th>Produk</th><th>Stok</th><th>Aksi</th></tr>';
    
    dataUMKM.stok.forEach(stok => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stok.nama}</td>
            <td>${stok.qty}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="hapusStok(${stok.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function hapusStok(id) {
    if (confirm('Apakah Anda yakin ingin menghapus stok ini?')) {
        dataUMKM.stok = dataUMKM.stok.filter(item => item.id !== id);
        updateTabelStok();
        updateStatUMKM();
        showNotification('Stok berhasil dihapus', 'success');
    }
}

function updateStatUMKM() {
    // Stat produk aktif
    const statProduk = document.getElementById('statProduk');
    if (statProduk) {
        statProduk.textContent = dataUMKM.produk.length.toString();
    }
    
    // Stat penjualan hari ini
    const statPenjualan = document.getElementById('statPenjualan');
    if (statPenjualan) {
        const today = new Date().toISOString().split('T')[0];
        const penjualanHariIni = dataUMKM.penjualan
            .filter(p => p.tanggal === today)
            .reduce((sum, p) => sum + p.total, 0);
        statPenjualan.textContent = formatRupiah(penjualanHariIni);
    }
    
    // Stat stok rendah
    const statStok = document.getElementById('statStok');
    if (statStok) {
        const stokRendah = dataUMKM.stok.filter(item => item.qty <= 5).length;
        statStok.textContent = `${stokRendah} Item`;
    }
    
    saveUMKMData();
}

/* ==========================
   THEME MANAGER
   ========================== */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const icons = document.querySelectorAll('#themeIcon, #umkmThemeIcon');
    icons.forEach(icon => {
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    });

    try { 
        localStorage.setItem('smartkas-theme', theme); 
    } catch (e) {}
}

function getPreferredTheme() {
    try { 
        const saved = localStorage.getItem('smartkas-theme'); 
        if (saved) return saved; 
    } catch (e) {}
    
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
    showNotification(`Mode ${current === 'dark' ? 'terang' : 'gelap'} diaktifkan`, 'info');
}

/* ==========================
   NOTIFICATION SYSTEM
   ========================== */
function showNotification(message, type = 'info') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : 'info'}"></i>
        <span>${message}</span>
    `;
    
    // Style notifikasi
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Tambahkan style untuk animasi notifikasi
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);

/* ==========================
   PERSISTENCE
   ========================== */
function saveMode(mode) {
    try { 
        localStorage.setItem('smartkas-mode', mode); 
    } catch (e) {}
}

function getSavedMode() {
    try { 
        return localStorage.getItem('smartkas-mode'); 
    } catch (e) { 
        return null; 
    }
}

/* ==========================
   EDIT PROFIL
   ========================== */
function editProfile() {
    showNotification('Fitur edit profil akan segera tersedia!', 'info');
}

/* ==========================
   INITIALIZATION
   ========================== */
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadUMKMData();
    
    // Update tabel UMKM jika diperlukan
    updateTabelProduk();
    updateTabelPenjualan();
    updateTabelStok();
    updateStatUMKM();
    
    // Auto-hide splash setelah 3 detik
    setTimeout(() => {
        if (document.getElementById("splash").style.display !== "none") {
            goLogin();
        }
    }, 3000);
});