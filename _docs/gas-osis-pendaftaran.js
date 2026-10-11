/**
 * Google Apps Script — Web App untuk menerima pendaftaran OSIS
 * dan menyimpannya ke Google Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1oKjXcgyrpLQx9REsrNPhf8Q35bC30s5AMtJLPMYvgBI
 *
 * CARA DEPLOY:
 * 1. Buka Google Sheets di atas → Extensions → Apps Script
 * 2. Salin seluruh kode ini ke editor
 * 3. Klik Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Salin URL web app yang dihasilkan
 * 5. Simpan URL di .env.local proyek Next.js:
 *    OSIS_SCRIPT_URL=https://script.google.com/macros/s/xxxx.../exec
 */

const SHEET_NAME = "Pendaftaran OSIS";

// Header kolom di baris pertama spreadsheet
const HEADERS = [
  "Timestamp",
  "Nama Lengkap",
  "NISN",
  "Kelas",
  "No. WhatsApp",
  "Posisi yang Dilamar",
  "Visi & Misi",
  "Prestasi Akademik",
  "Prestasi Non-Akademik",
  "Pengalaman Organisasi",
  "Tahun Ajaran",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Buat sheet baru dan tambah header jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#6c63c6");
      headerRange.setFontColor("#ffffff");
    }

    // Tambah baris data baru
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data.nama_lengkap || "",
      data.nisn || "",
      data.kelas || "",
      data.no_wa || "",
      data.posisi || "",
      data.visi_misi || "",
      data.prestasi_akademik || "",
      data.prestasi_non_akademik || "",
      data.pengalaman_organisasi || "",
      data.tahun_ajaran || "2026/2027",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handler GET untuk tes koneksi
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", app: "OSIS Pendaftaran Web App" }))
    .setMimeType(ContentService.MimeType.JSON);
}
