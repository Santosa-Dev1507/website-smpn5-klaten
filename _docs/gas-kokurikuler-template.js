/**
 * Google Apps Script — Web App Kokurikuler SMPN 5 Klaten
 * ═══════════════════════════════════════════════════════════════════
 * Cara deploy:
 * 1. Buka script.google.com > New Project
 * 2. Paste seluruh isi file ini
 * 3. Ganti SPREADSHEET_ID di bawah dengan ID spreadsheet kokurikuler
 * 4. Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL deployment ke .env.local sebagai GAS_KOKURIKULER_URL
 * ═══════════════════════════════════════════════════════════════════
 *
 * Struktur Tab Spreadsheet yang dibutuhkan:
 * - config      : nama_kegiatan, tema, tahun_pelajaran, tanggal_kegiatan,
 *                 destinasi_aktif, biaya, batas_pengumpulan_angket,
 *                 kontak_nama, kontak_hp
 * - destinasi   : nama_destinasi, tujuan_pembelajaran, dimensi_profil_lulusan,
 *                 mapel_terkait, objek_kunjungan
 * - rundown     : waktu, kegiatan
 * - fasilitas   : item_fasilitas
 * - kursi       : bus_id, nomor_kursi, nama_siswa, kelas
 * - kelompok    : nama_kelompok, kelas, anggota, sub_tema_objek_amatan, nama_pembimbing
 * - tugas_siswa : tahap, judul_tugas, deskripsi, kelompok_terkait
 * - tata_tertib : no, isi_tata_tertib
 * - faq         : pertanyaan, jawaban
 */

const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_KOKURIKULER';

/**
 * Handle GET request: ?tab=<nama_tab>
 * Contoh: ?tab=config, ?tab=kursi, ?tab=kelompok
 */
function doGet(e) {
  const tab = e.parameter.tab;

  if (!tab) {
    return jsonResponse({ error: 'Parameter "tab" diperlukan' }, 400);
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(tab);

    if (!sheet) {
      return jsonResponse({ error: `Tab "${tab}" tidak ditemukan` }, 404);
    }

    const rows = sheet.getDataRange().getValues();
    if (rows.length < 2) {
      return jsonResponse({ data: [] });
    }

    const headers = rows[0].map(h => String(h).trim().toLowerCase().replace(/\s+/g, '_'));
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        const val = row[i];
        obj[header] = val === '' ? null : val;
      });
      return obj;
    }).filter(row => {
      // Filter baris kosong (semua value null/empty)
      return Object.values(row).some(v => v !== null && v !== '');
    });

    return jsonResponse({ data, tab, count: data.length });

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

/**
 * Utilitas: kembalikan JSON response dengan CORS headers
 */
function jsonResponse(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function — jalankan di Apps Script editor untuk verifikasi
 */
function testDoGet() {
  const tabs = ['config', 'destinasi', 'rundown', 'fasilitas', 'kursi', 'kelompok', 'tugas_siswa', 'tata_tertib', 'faq'];
  tabs.forEach(tab => {
    const result = doGet({ parameter: { tab } });
    Logger.log(`Tab "${tab}": ${result.getContent()}`);
  });
}
