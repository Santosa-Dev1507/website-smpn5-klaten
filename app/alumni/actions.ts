"use server";

// URL CSV publik Google Sheets — data alumni diambil langsung dari sini.
// Update data cukup di Google Sheets, tidak perlu deploy ulang.
const ALUMNI_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSe61fz7e8uqj44YUDETwIV2zgTl8WYY6kaqIwu6Ukk1r9-iGo14u-eVVmc47kSojHyo14apugUWhML/pub?output=csv";

// Kolom CSV (0-indexed): NISN, Nama, Link SH TKA, Link Ijazah, Link Transkrip Nilai
const COL = { nisn: 0, nama: 1, linkShtka: 2, linkIjazah: 3, linkTranskripNilai: 4 };

interface FormPayload {
  nisn: string;
  nama: string;
  email: string;
  telepon: string;
  tahunLulus: string;
  kelasTerakhir: string;
  status: string;
  instansi: string;
}

/** Parser CSV sederhana yang menangani nilai dengan koma di dalam tanda kutip */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Mengubah berbagai format URL Google Drive menjadi link download langsung.
 * Mendukung format:
 *   - https://drive.google.com/file/d/FILE_ID/view?...
 *   - https://drive.google.com/open?id=FILE_ID
 *   - https://drive.google.com/uc?id=FILE_ID (sudah uc, tambah export=download)
 */
function toDownloadUrl(driveUrl: string): string {
  if (!driveUrl) return "";

  // Format: /file/d/FILE_ID/...
  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }

  // Format: open?id=FILE_ID atau uc?id=FILE_ID
  const idMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }

  // Jika format tidak dikenali, kembalikan URL asli
  return driveUrl;
}

/** Kirim data form ke Google Sheets via Apps Script Web App */
async function simpanKeSheet(data: FormPayload): Promise<void> {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) {
    console.warn("GOOGLE_SCRIPT_URL tidak ditemukan di .env.local");
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Gagal menyimpan data ke Google Sheets:", err);
  }
}

/** Validasi NISN dari Google Sheets CSV dan simpan data tracer study */
export async function validateNisn(payload: FormPayload) {
  try {
    const nisn = payload.nisn.trim();

    // Fetch CSV langsung dari Google Sheets (cache 5 menit)
    const res = await fetch(ALUMNI_CSV_URL, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error("[alumni] Gagal fetch CSV:", res.status);
      return {
        success: false,
        message: "Terjadi kesalahan pada server. Silakan coba lagi.",
      };
    }

    const csvText = await res.text();
    // Hapus BOM jika ada, lalu split per baris
    const rows = csvText
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((r) => r.trim().length > 0);

    // Lewati baris header (baris pertama)
    const dataRows = rows.slice(1).map(parseCSVRow);

    // Cari berdasarkan NISN (kolom 0)
    const found = dataRows.find((row) => row[COL.nisn] === nisn);

    if (found) {
      // NISN valid → simpan data tracer study ke Google Sheets (non-blocking)
      simpanKeSheet(payload);

      return {
        success: true,
        data: {
          nama: found[COL.nama] ?? "",
          linkIjazah: toDownloadUrl(found[COL.linkIjazah] ?? ""),
          linkShtka: toDownloadUrl(found[COL.linkShtka] ?? ""),
          linkTranskripNilai: toDownloadUrl(found[COL.linkTranskripNilai] ?? ""),
        },
      };
    }

    return {
      success: false,
      message:
        "Data dengan NISN tersebut tidak ditemukan atau belum tersedia. Pastikan NISN yang kamu masukkan benar.",
    };
  } catch (error) {
    console.error("Error di Server Action validateNisn:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
    };
  }
}
