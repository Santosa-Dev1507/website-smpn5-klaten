/**
 * ============================================================================
 * GOOGLE APPS SCRIPT — Otomatisasi Kisi-Kisi Ujian SMPN 5 Klaten
 * Mendukung 2 jalur sekaligus ke 1 Spreadsheet yang sama:
 *   Jalur A: Import massal 1-klik dari Folder Google Drive (hasil panen WA MCP)
 *   Jalur B: Upload mandiri guru lewat Google Form (otomatis publik)
 * ============================================================================
 *
 * CARA PAKAI JALUR A (PALING CEPAT — IMPORT 25 FILE HASIL PANEN WA):
 * 1. Upload / drag-and-drop folder `kisi-kisi-asas-gasal-2026-2027` ke Google Drive.
 * 2. Buka folder tersebut di Google Drive, lalu salin ID folder dari URL browser:
 *      https://drive.google.com/drive/folders/INI_ADALAH_FOLDER_ID
 * 3. Buat Google Sheets baru → menu Extensions → Apps Script.
 * 4. Hapus kode bawaan, tempel seluruh isi script ini.
 * 5. Isi `FOLDER_ID_KISIKISI` dan `PERIODE_IMPORT` di bawah ini → klik Save (Ctrl+S).
 * 6. Pilih fungsi `importDariFolderDrive` di dropdown atas → klik Run (izinkan akses).
 *    → Semua file otomatis diset publik (Viewer) & 25 baris langsung masuk ke Sheet!
 * 7. Di Google Sheets → File → Share → Publish to web:
 *    - Pilih sheet "Kisi-Kisi" & format "Comma-separated values (.csv)" → klik Publish.
 * 8. Salin URL CSV-nya ke `.env.local` (dan Vercel Environment Variables):
 *      KISIKISI_CSV_URL=https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv
 *
 * CARA PAKAI JALUR B (UPLOAD MANDIRI GURU LEWAT GOOGLE FORM):
 * 1. Buat Google Form dengan 4 pertanyaan:
 *    - Tahun Ajaran / Periode (Dropdown)
 *    - Kelas (Dropdown: VII, VIII, IX)
 *    - Mata Pelajaran (Dropdown daftar baku mapel)
 *    - File Kisi-Kisi (Upload File: Dokumen & PDF)
 * 2. Link jawaban Form ke Spreadsheet ini, lalu jalankan fungsi `setupTrigger` 1x.
 *    Setiap kali guru submit Form, izin file Drive otomatis menjadi publik!
 */

// ── KONFIGURASI JALUR A (IMPORT FOLDER DRIVE) ──
const FOLDER_ID_KISIKISI = "1UbvPZCPeNjEGqDYJ9TAbZ3zHGY9YiUaF";
const PERIODE_IMPORT = "2026/2027 · ASAS Gasal";
const SHEET_NAME = "Kisi-Kisi";

const HEADERS = [
  "tahun_ajaran",
  "kelas",
  "mata_pelajaran",
  "status",
  "link_unduh",
  "link_preview",
];

/**
 * JALUR A — Jalankan fungsi ini untuk membaca semua file berformat
 * "VII - Matematika.docx" dari folder Google Drive, mengatur izin publik,
 * dan menulis seluruh barisnya secara otomatis ke sheet "Kisi-Kisi".
 */
function importDariFolderDrive() {
  if (!FOLDER_ID_KISIKISI || FOLDER_ID_KISIKISI.indexOf("TEMPEL_") === 0) {
    throw new Error("Isi dulu konstanta FOLDER_ID_KISIKISI dengan ID folder Google Drive.");
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    const hdrRange = sheet.getRange(1, 1, 1, HEADERS.length);
    hdrRange.setFontWeight("bold");
    hdrRange.setBackground("#944535");
    hdrRange.setFontColor("#ffffff");
  }

  // Petakan baris yang sudah ada agar saat dijalankan ulang bisa update tanpa duplikat
  const existingData = sheet.getDataRange().getValues();
  const rowIndexByKey = {};
  for (let r = 1; r < existingData.length; r++) {
    const k = [
      String(existingData[r][0] || "").trim().toLowerCase(),
      String(existingData[r][1] || "").trim().toUpperCase(),
      String(existingData[r][2] || "").trim().toLowerCase(),
    ].join("::");
    rowIndexByKey[k] = r + 1;
  }

  const folder = DriveApp.getFolderById(FOLDER_ID_KISIKISI);
  const files = folder.getFiles();
  let inserted = 0;
  let updated = 0;

  while (files.hasNext()) {
    const file = files.next();
    const rawName = file.getName();
    // Hapus ekstensi file (.pdf / .docx / .doc)
    const baseName = rawName.replace(/\.[^.]+$/, "").trim();

    // Cocokkan pola "VII - Matematika" / "VIII - Ilmu Pengetahuan Alam (IPA)"
    const match = baseName.match(/^(VII|VIII|IX)\s*-\s*(.+)$/i);
    if (!match) {
      Logger.log("Lewati file (format nama tidak sesuai 'KELAS - MAPEL'): " + rawName);
      continue;
    }

    const kelas = match[1].toUpperCase();
    const mapel = match[2].trim();
    const fileId = file.getId();

    // Set izin publik (hanya lihat) agar siswa tidak terkena "Minta Akses"
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const linkUnduh = "https://drive.google.com/uc?export=download&id=" + fileId;
    const linkPreview = "https://drive.google.com/file/d/" + fileId + "/preview";
    const rowValues = [PERIODE_IMPORT, kelas, mapel, "tersedia", linkUnduh, linkPreview];

    const key = [PERIODE_IMPORT.toLowerCase(), kelas, mapel.toLowerCase()].join("::");
    if (rowIndexByKey[key]) {
      sheet.getRange(rowIndexByKey[key], 1, 1, HEADERS.length).setValues([rowValues]);
      updated++;
    } else {
      sheet.appendRow(rowValues);
      inserted++;
    }
  }

  Logger.log(
    "Import selesai! Ditambahkan: " + inserted + " baris, diperbarui: " + updated + " baris."
  );
}

/**
 * JALUR B — Jalankan SEKALI untuk mengaktifkan otomatisasi izin publik
 * setiap kali guru mengirim file lewat Google Form.
 */
function setupTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === "onFormSubmitKisiKisi") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("onFormSubmitKisiKisi")
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  Logger.log("Trigger onFormSubmitKisiKisi berhasil dipasang!");
}

/** Trigger otomatis saat guru submit Google Form */
function onFormSubmitKisiKisi(e) {
  try {
    const range = e && e.range ? e.range : null;
    if (!range) return;

    const sheet = range.getSheet();
    const row = range.getRow();
    const lastCol = sheet.getLastColumn();
    const rowValues = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

    for (let i = 0; i < rowValues.length; i++) {
      const fileId = extractDriveFileId_(String(rowValues[i] || "").trim());
      if (fileId) setFilePublicView_(fileId);
    }
  } catch (err) {
    console.error("[onFormSubmitKisiKisi] Error:", err);
  }
}

/** Utilitas manual: perbaiki izin publik untuk seluruh URL Drive di sheet aktif */
function perbaikiSemuaIzinFile() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  let count = 0;

  for (let r = 1; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const fileId = extractDriveFileId_(String(data[r][c] || ""));
      if (fileId && setFilePublicView_(fileId)) count++;
    }
  }

  Logger.log("Selesai. Total file diset publik: " + count);
}

function extractDriveFileId_(url) {
  if (!url || (url.indexOf("drive.google.com") === -1 && url.indexOf("docs.google.com") === -1)) {
    return null;
  }
  const byFilePath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (byFilePath) return byFilePath[1];

  const byDocsPath = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (byDocsPath) return byDocsPath[1];

  const byIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (byIdParam) return byIdParam[1];

  return null;
}

function setFilePublicView_(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return true;
  } catch (err) {
    console.error("[setFilePublicView_] Gagal set izin file " + fileId + ":", err);
    return false;
  }
}
