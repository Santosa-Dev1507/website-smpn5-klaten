// ============================================================
// Laporan.gs — Modul Laporan & Ekspor
// ============================================================

function getLaporanRekap(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  var absensi = getAllData('Absensi');
  var ekskul = getAllData('Ekskul');
  var lomba = getAllData('Lomba');
  var prestasi = getAllData('Prestasi');
  var pendaftaran = getAllData('Pendaftaran');

  // Rekap per ekskul
  var rekapEkskul = ekskul.map(function(e) {
    var siswaEkskul = pendaftaran.filter(function(p) { return p.ekskul_id === e.id && p.status === 'DITERIMA'; });
    var absensiEkskul = absensi.filter(function(a) { return a.ekskul_id === e.id; });
    var hadir = absensiEkskul.filter(function(a) { return a.status === 'hadir'; }).length;
    return {
      nama: e.nama,
      kategori: e.kategori,
      jumlahSiswa: siswaEkskul.length,
      totalSesi: absensiEkskul.length > 0 ? [...new Set(absensiEkskul.map(function(a) { return a.tanggal; }))].length : 0,
      persenKehadiran: absensiEkskul.length > 0 ? Math.round(hadir / absensiEkskul.length * 100) : 0
    };
  });

  return {
    success: true,
    data: {
      rekapEkskul: rekapEkskul,
      totalLomba: lomba.length,
      totalPrestasi: prestasi.length,
      lombaList: lomba,
      prestasiList: prestasi
    }
  };
}

/**
 * Generate data laporan BOS (bisa dikustomisasi)
 */
function generateLaporanBOS(token, params) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  // params: { ekskulId, namaPembina, jumlahPertemuan, jumlahPeserta, periodeAwal, periodeAkhir, useRealData }
  var ekskul = findRow('Ekskul', 'id', params.ekskulId);
  var laporanData = {
    namaEkskul: ekskul ? ekskul.nama : params.namaEkskul,
    namaPembina: params.useRealData ? (ekskul ? ekskul.pembina : '') : params.namaPembina,
    jumlahPertemuan: params.useRealData ? hitungPertemuanReal(params.ekskulId) : params.jumlahPertemuan,
    jumlahPeserta: params.useRealData ? hitungPesertaReal(params.ekskulId) : params.jumlahPeserta,
    periodeAwal: params.periodeAwal,
    periodeAkhir: params.periodeAkhir,
    generatedAt: new Date(),
    generatedBy: session.nama
  };

  return { success: true, data: laporanData };
}

function hitungPertemuanReal(ekskulId) {
  var absensi = getAllData('Absensi').filter(function(a) { return a.ekskul_id === ekskulId; });
  var tanggalUnik = [...new Set(absensi.map(function(a) { return String(a.tanggal).split('T')[0]; }))];
  return tanggalUnik.length;
}

function hitungPesertaReal(ekskulId) {
  return getAllData('Pendaftaran').filter(function(p) {
    return p.ekskul_id === ekskulId && p.status === 'DITERIMA';
  }).length;
}

function getRiwayatLaporan(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  // Simplified - in full implementation, store laporan history in Sheets
  return {
    success: true,
    data: [
      { tanggal: '14 Mei 2024', periode: 'Apr - Mei 2024', admin: 'Admin Utama', format: 'PDF', url: '' },
      { tanggal: '02 Mei 2024', periode: 'Jan - Mar 2024', admin: 'Admin Keuangan', format: 'XLSX', url: '' }
    ]
  };
}
