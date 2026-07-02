// ============================================================
// Code.gs — Router Utama SIM Ekskul & Lomba SMPN 5 Klaten
// ============================================================

// ID Google Spreadsheet — GANTI dengan ID Spreadsheet Anda
var SPREADSHEET_ID = '1Y9OkiPwXoOOqzNCruxJGkR3Oe90lI-UjgokEbYe8TdY';

/**
 * Entry point GET — serve halaman HTML (untuk UI Apps Script lama)
 */
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'login';

  if (page === 'login') {
    return HtmlService.createTemplateFromFile('login')
      .evaluate()
      .setTitle('Login — SMPN Manajemen')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Halaman utama (SPA) — semua role diarahkan ke sini
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('SMPN Manajemen — SIM Ekskul & Lomba')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Entry point POST — API Endpoint untuk Next.js Frontend
 */
function doPost(e) {
  try {
    // Parsing JSON dari body request
    var req = JSON.parse(e.postData.contents);
    var action = req.action;
    var result;

    // Routing action ke fungsi masing-masing
    if (action === 'login') {
      if (typeof login === 'undefined') {
         return responseJson({ success: false, message: 'Fungsi login() tidak ditemukan. Pastikan Auth.gs ada di project ini.' });
      }
      result = login(req.username, req.password, req.role);
    } 
    else if (action === 'getSiswaDaftarEkskul') {
      // Panggil fungsi getSiswaDaftarEkskul dari Ekskul.gs
      if (typeof getSiswaDaftarEkskul === 'undefined') {
         return responseJson({ success: false, message: 'Fungsi getSiswaDaftarEkskul() tidak ditemukan.' });
      }
      result = getSiswaDaftarEkskul(req.token, req.ekskul_id);
    }
    else if (action === 'getLombaList') {
      if (typeof getLombaList === 'undefined') return responseJson({ success: false, message: 'Fungsi getLombaList tidak ditemukan.' });
      result = getLombaList(req.token);
    }
    else if (action === 'tambahPrestasi') {
      if (typeof tambahPrestasi === 'undefined') return responseJson({ success: false, message: 'Fungsi tambahPrestasi tidak ditemukan.' });
      result = tambahPrestasi(req.token, req.data);
    }
    else if (action === 'getPrestasiEkskul') {
      if (typeof getPrestasiList === 'undefined') return responseJson({ success: false, message: 'Fungsi getPrestasiList tidak ditemukan.' });
      var list = getPrestasiList(req.token);
      // Filter by ekskul if needed, but getPrestasiList returns all. We can filter here.
      if (list.success && req.ekskulId) {
         list.data = list.data.filter(function(p) { return p.ekskul_id === req.ekskulId; });
      }
      result = list;
    }
    else if (action === 'daftarEkskul') {
      if (typeof daftarEkskul === 'undefined') return responseJson({ success: false, message: 'Fungsi daftarEkskul tidak ditemukan.' });
      result = daftarEkskul(req.token, req.ekskulId);
    }
    else if (action === 'getPendaftarMenunggu') {
      if (typeof getPendaftaranSiswa === 'undefined') return responseJson({ success: false, message: 'Fungsi getPendaftaranSiswa tidak ditemukan.' });
      var pend = getPendaftaranSiswa(req.token);
      if (pend.success && req.ekskulId) {
         pend.data = pend.data.filter(function(p) { return p.ekskul_id === req.ekskulId && p.status === 'MENUNGGU'; });
      }
      result = pend;
    }
    else if (action === 'updateStatusPendaftaran') {
      if (typeof updateStatusPendaftaran === 'undefined') return responseJson({ success: false, message: 'Fungsi updateStatusPendaftaran tidak ditemukan.' });
      result = updateStatusPendaftaran(req.token, req.pendaftaranId, req.status);
    }
    else if (action === 'tambahSiswaUndangan') {
      // Mock for now or implement in Ekskul.gs
      result = { success: true, message: 'Siswa berhasil diundang.' };
    }
    else if (action === 'getSesiAbsensi') {
      if (typeof getSiswaDaftarEkskul === 'undefined') return responseJson({ success: false, message: 'Fungsi getSiswaDaftarEkskul tidak ditemukan.' });
      var s = getSiswaDaftarEkskul(req.token, req.ekskulId);
      result = { success: s.success, message: s.message, siswaList: s.data || [] };
    }
    else if (action === 'simpanAbsensi') {
      if (typeof simpanAbsensi === 'undefined') return responseJson({ success: false, message: 'Fungsi simpanAbsensi tidak ditemukan.' });
      result = simpanAbsensi(req.token, req.ekskulId, req.absensiData, req.tanggal);
    }
    else if (action === 'getLaporanRekap') {
      if (typeof getStatistikAdmin === 'undefined') return responseJson({ success: false, message: 'Fungsi getStatistikAdmin tidak ditemukan.' });
      var stat = getStatistikAdmin(req.token);
      result = { success: true, data: { rekapEkskul: [] } }; // Placeholder until fully implemented
    }
    else {
      result = { success: false, message: 'Action tidak dikenal: ' + action };
    }

    return responseJson(result);
  } catch (err) {
    return responseJson({ success: false, message: 'Server error: ' + err.message });
  }
}

/**
 * Helper: Mengembalikan respons JSON dengan mime type yang benar
 */
function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: include file HTML lain (CSS, JS)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Ambil URL Web App (untuk redirect setelah login)
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}
