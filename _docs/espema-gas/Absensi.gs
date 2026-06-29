// ============================================================
// Absensi.gs — Modul Absensi Digital
// ============================================================

function getSesiAbsensi(token, ekskulId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };

  var ekskul = findRow('Ekskul', 'id', ekskulId);
  if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan.' };

  // Ambil daftar siswa yang terdaftar di ekskul ini
  var pendaftaran = getAllData('Pendaftaran').filter(function(p) {
    return p.ekskul_id === ekskulId && p.status === 'DITERIMA';
  });

  return {
    success: true,
    ekskul: ekskul,
    siswaList: pendaftaran
  };
}

function simpanAbsensi(token, ekskulId, absensiData, tanggal) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  var ekskul = findRow('Ekskul', 'id', ekskulId);
  if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan.' };

  var tgl = tanggal || new Date();

  // absensiData: [ { siswa_id, siswa_nama, status } ]
  absensiData.forEach(function(item) {
    appendRow('Absensi', {
      id: generateId(),
      ekskul_id: ekskulId,
      ekskul_nama: ekskul.nama,
      user_id: item.siswa_id,
      siswa_nama: item.siswa_nama,
      tanggal: tgl,
      status: item.status || 'hadir',
      keterangan: item.keterangan || '',
      pembina_id: session.user_id,
      created_at: new Date()
    });
  });

  return { success: true, message: 'Absensi berhasil disimpan untuk ' + absensiData.length + ' siswa.' };
}

function getRekapAbsensi(token, ekskulId, bulan, tahun) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };

  var allAbsensi = getAllData('Absensi');
  var filtered = allAbsensi.filter(function(a) {
    var tgl = new Date(a.tanggal);
    var matchEkskul = ekskulId ? a.ekskul_id === ekskulId : true;
    var matchBulan = bulan ? tgl.getMonth() + 1 === parseInt(bulan) : true;
    var matchTahun = tahun ? tgl.getFullYear() === parseInt(tahun) : true;
    var matchSiswa = session.role === 'siswa' ? a.user_id === session.user_id : true;
    return matchEkskul && matchBulan && matchTahun && matchSiswa;
  });

  return { success: true, data: filtered };
}

function getAbsensiSiswa(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };

  var data = getAllData('Absensi').filter(function(a) {
    return a.user_id === session.user_id;
  });

  // Hitung statistik per ekskul
  var stats = {};
  data.forEach(function(a) {
    if (!stats[a.ekskul_nama]) {
      stats[a.ekskul_nama] = { total: 0, hadir: 0 };
    }
    stats[a.ekskul_nama].total++;
    if (a.status === 'hadir') stats[a.ekskul_nama].hadir++;
  });

  return { success: true, data: data, stats: stats };
}
