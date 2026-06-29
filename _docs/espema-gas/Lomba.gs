// ============================================================
// Lomba.gs — Modul Manajemen Lomba & Prestasi
// ============================================================

function getLombaList(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  return { success: true, data: getAllData('Lomba') };
}

function tambahLomba(token, data) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role !== 'admin') return { success: false, message: 'Tidak punya akses.' };

  data.id = generateId();
  if (!data.status) data.status = 'MENUNGGU';
  appendRow('Lomba', data);
  return { success: true, message: 'Lomba berhasil ditambahkan.' };
}

function updateLomba(token, id, data) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  var existing = findRow('Lomba', 'id', id);
  if (!existing) return { success: false, message: 'Lomba tidak ditemukan.' };

  Object.assign(existing, data);
  updateRow('Lomba', existing._rowIndex, existing);
  return { success: true, message: 'Data lomba diperbarui.' };
}

function getPrestasiList(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };

  var data = getAllData('Prestasi');
  if (session.role === 'siswa') {
    data = data.filter(function(p) { return p.siswa_id === session.user_id; });
  }
  return { success: true, data: data };
}

function tambahPrestasi(token, data) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  data.id = generateId();
  data.tanggal = data.tanggal || new Date();
  appendRow('Prestasi', data);
  return { success: true, message: 'Prestasi berhasil dicatat.' };
}

function getStatistikAdmin(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role !== 'admin') return { success: false, message: 'Tidak punya akses.' };

  var users = getAllData('Users');
  var ekskul = getAllData('Ekskul');
  var lomba = getAllData('Lomba');
  var prestasi = getAllData('Prestasi');

  return {
    success: true,
    data: {
      totalSiswa: users.filter(function(u) { return u.role === 'siswa' && u.aktif; }).length,
      totalEkskul: ekskul.filter(function(e) { return e.aktif; }).length,
      totalLomba: lomba.length,
      totalPrestasi: prestasi.length,
      lombaList: lomba.slice(0, 5)
    }
  };
}
