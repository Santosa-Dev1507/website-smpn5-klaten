// ============================================================
// Database.gs — Operasi Google Sheets
// ============================================================

/**
 * Ambil spreadsheet utama
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Ambil sheet berdasarkan nama, buat jika belum ada
 */
function getSheet(name) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Ambil semua data dari sheet sebagai array of objects
 */
function getAllData(sheetName) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (Object.prototype.toString.call(val) === '[object Date]') {
        val = val.toISOString();
      }
      row[headers[j]] = val;
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Cari baris berdasarkan kolom dan nilai
 */
function findRow(sheetName, column, value) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;

  var headers = data[0];
  var colIndex = headers.indexOf(column);
  if (colIndex === -1) return null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]).toLowerCase() === String(value).toLowerCase()) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      row['_rowIndex'] = i + 1; // 1-based row number
      return row;
    }
  }
  return null;
}

/**
 * Tambah baris baru
 */
function appendRow(sheetName, rowData) {
  var sheet = getSheet(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function(h) { return rowData[h] || ''; });
  sheet.appendRow(row);
}

/**
 * Update baris berdasarkan row index
 */
function updateRow(sheetName, rowIndex, rowData) {
  var sheet = getSheet(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function(h) { return rowData[h] !== undefined ? rowData[h] : sheet.getRange(rowIndex, headers.indexOf(h) + 1).getValue(); });
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
}

/**
 * Generate ID unik
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Generate token sesi
 */
function generateToken() {
  return Utilities.base64Encode(Utilities.getUuid() + new Date().getTime());
}

// ============================================================
// Inisialisasi Database — Jalankan sekali untuk setup awal
// ============================================================

/**
 * Setup semua sheet dengan header yang benar
 * Jalankan fungsi ini SEKALI dari editor GAS setelah deploy
 */
function setupDatabase() {
  // Sheet Users
  var usersSheet = getSheet('Users');
  if (usersSheet.getLastRow() === 0) {
    usersSheet.appendRow(['id', 'nama', 'username', 'password', 'role', 'aktif', 'created_at']);
    // Akun demo awal
    usersSheet.appendRow([generateId(), 'Administrator', 'admin', 'admin123', 'admin', true, new Date()]);
    usersSheet.appendRow([generateId(), 'Budi Santoso', 'NIP001', 'pass123', 'pembina', true, new Date()]);
    usersSheet.appendRow([generateId(), 'Ahmad Fauzi', '12345', 'pass123', 'siswa', true, new Date()]);
    usersSheet.appendRow([generateId(), 'Raditya Pratama', '12346', 'pass123', 'siswa', true, new Date()]);
  }

  // Sheet Sessions
  var sessSheet = getSheet('Sessions');
  if (sessSheet.getLastRow() === 0) {
    sessSheet.appendRow(['token', 'user_id', 'nama', 'role', 'username', 'created_at', 'expired_at']);
  }

  // Sheet Ekskul
  var ekskulSheet = getSheet('Ekskul');
  if (ekskulSheet.getLastRow() === 0) {
    ekskulSheet.appendRow(['id', 'nama', 'kategori', 'jadwal', 'waktu', 'lokasi', 'kapasitas', 'pembina', 'deskripsi', 'rating', 'aktif']);
    ekskulSheet.appendRow([generateId(), 'Klub Basket (Bimasakti)', 'Olahraga', 'Selasa & Kamis', '15:30-17:00', 'Lapangan Basket', 30, 'Budi Santoso', 'Pelatihan teknik dasar hingga strategi kompetisi profesional.', 4.9, true]);
    ekskulSheet.appendRow([generateId(), 'Paduan Suara (Gita Swara)', 'Seni', 'Rabu & Jumat', '15:00-16:30', 'Aula Sekolah', 25, 'Siti Aminah', 'Mengembangkan teknik vokal harmonis untuk kompetisi nasional.', 4.8, true]);
    ekskulSheet.appendRow([generateId(), 'Klub Robotik (RoboTech)', 'Sains', 'Setiap Senin', '15:30-17:30', 'Lab Komputer', 20, 'Hendra Wijaya', 'Eksplorasi teknologi melalui pemrograman dan perakitan robotika.', 5.0, true]);
    ekskulSheet.appendRow([generateId(), 'Palang Merah Remaja', 'Sosial', 'Setiap Kamis', '15:00-16:30', 'Ruang PMR', 30, 'Dewi Kusuma', 'Pelajari pertolongan pertama dan kembangkan jiwa kemanusiaan.', 4.7, true]);
    ekskulSheet.appendRow([generateId(), 'Paskibra', 'Olahraga', 'Setiap Sabtu', '07:00-10:00', 'Lapangan Upacara', 40, 'Ahmad Ridwan', 'Latihan baris berbaris dan kepemimpinan.', 4.8, true]);
    ekskulSheet.appendRow([generateId(), 'Karawitan', 'Seni', 'Setiap Jumat', '14:00-16:00', 'Ruang Seni', 20, 'Sunaryo', 'Melestarikan seni gamelan Jawa.', 4.6, true]);
  }

  // Sheet Lomba
  var lombaSheet = getSheet('Lomba');
  if (lombaSheet.getLastRow() === 0) {
    lombaSheet.appendRow(['id', 'nama', 'kategori', 'tingkat', 'tanggal', 'lokasi', 'penyelenggara', 'ekskul_terkait', 'status', 'keterangan']);
    lombaSheet.appendRow([generateId(), 'Olimpiade Sains Nasional', 'Akademik', 'Nasional', '2024-10-15', 'Jakarta', 'Kemendikbud', 'Klub Sains', 'TERDAFTAR', '']);
    lombaSheet.appendRow([generateId(), 'Lomba Baris Berbaris Klaten', 'Olahraga', 'Kota', '2024-10-22', 'GOR Klaten', 'Dinas Pendidikan', 'Paskibra', 'PERSIAPAN', '']);
    lombaSheet.appendRow([generateId(), 'Turnamen Futsal Cup V', 'Olahraga', 'Kecamatan', '2024-11-05', 'Lapangan Futsal', 'KONI Klaten', 'Futsal', 'MENUNGGU', '']);
    lombaSheet.appendRow([generateId(), 'Festival Karawitan Jateng', 'Seni', 'Provinsi', '2024-11-12', 'Semarang', 'Dinas Jateng', 'Karawitan', 'TERDAFTAR', '']);
  }

  // Sheet Absensi
  var absensiSheet = getSheet('Absensi');
  if (absensiSheet.getLastRow() === 0) {
    absensiSheet.appendRow(['id', 'ekskul_id', 'ekskul_nama', 'user_id', 'siswa_nama', 'tanggal', 'status', 'keterangan', 'pembina_id', 'created_at']);
  }

  // Sheet Pendaftaran
  var daftarSheet = getSheet('Pendaftaran');
  if (daftarSheet.getLastRow() === 0) {
    daftarSheet.appendRow(['id', 'siswa_id', 'siswa_nama', 'ekskul_id', 'ekskul_nama', 'tanggal_daftar', 'status', 'keterangan']);
  }

  // Sheet Prestasi
  var prestasiSheet = getSheet('Prestasi');
  if (prestasiSheet.getLastRow() === 0) {
    prestasiSheet.appendRow(['id', 'siswa_id', 'siswa_nama', 'lomba_id', 'lomba_nama', 'hasil', 'tingkat', 'tanggal', 'sertifikat_url', 'keterangan']);
  }

  return { success: true, message: 'Database berhasil diinisialisasi!' };
}
