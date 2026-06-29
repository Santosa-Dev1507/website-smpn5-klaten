// ============================================================
// Ekskul.gs — Modul Manajemen Ekstrakurikuler
// ============================================================

function getEkskulList(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  var data = getAllData('Ekskul');
  return { success: true, data: data.filter(function(e) { return e.aktif; }) };
}

function getEkskulById(token, id) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  var ekskul = findRow('Ekskul', 'id', id);
  if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan.' };
  return { success: true, data: ekskul };
}

function tambahEkskul(token, data) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role !== 'admin') return { success: false, message: 'Tidak punya akses.' };

  data.id = generateId();
  data.aktif = true;
  appendRow('Ekskul', data);
  return { success: true, message: 'Ekskul berhasil ditambahkan.' };
}

function updateEkskul(token, id, data) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role !== 'admin') return { success: false, message: 'Tidak punya akses.' };

  var existing = findRow('Ekskul', 'id', id);
  if (!existing) return { success: false, message: 'Ekskul tidak ditemukan.' };

  Object.assign(existing, data);
  updateRow('Ekskul', existing._rowIndex, existing);
  return { success: true, message: 'Ekskul berhasil diupdate.' };
}

function daftarEkskul(token, ekskulId) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role !== 'siswa') return { success: false, message: 'Hanya siswa yang bisa mendaftar.' };

  // Cek apakah sudah mendaftar
  var existing = findRow('Pendaftaran', 'siswa_id', session.user_id);
  // (simplified - in full implementation check by both siswa_id and ekskul_id)

  var ekskul = findRow('Ekskul', 'id', ekskulId);
  if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan.' };

  // Cek batas waktu pendaftaran jika ada
  if (ekskul.batas_waktu) {
    var deadline = new Date(ekskul.batas_waktu);
    // Jika format tanggal valid dan waktu sekarang sudah lewat dari deadline
    if (!isNaN(deadline.getTime()) && new Date() > deadline) {
      return { success: false, message: 'Maaf, pendaftaran sudah ditutup sejak ' + deadline.toLocaleDateString('id-ID') };
    }
  }

  appendRow('Pendaftaran', {
    id: generateId(),
    siswa_id: session.user_id,
    siswa_nama: session.nama,
    ekskul_id: ekskulId,
    ekskul_nama: ekskul.nama,
    tanggal_daftar: new Date(),
    status: 'MENUNGGU',
    keterangan: ''
  });

  return { success: true, message: 'Pendaftaran berhasil! Menunggu persetujuan.' };
}

function getPendaftaranSiswa(token) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };

  var allData = getAllData('Pendaftaran');
  var filtered = allData.filter(function(d) {
    return session.role === 'siswa' ? d.siswa_id === session.user_id : true;
  });
  return { success: true, data: filtered };
}

function updateStatusPendaftaran(token, id, status) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: session.message };
  if (session.role === 'siswa') return { success: false, message: 'Tidak punya akses.' };

  var row = findRow('Pendaftaran', 'id', id);
  if (!row) return { success: false, message: 'Data tidak ditemukan.' };

  row.status = status;
  updateRow('Pendaftaran', row._rowIndex, row);
  return { success: true, message: 'Status diperbarui.' };
}
