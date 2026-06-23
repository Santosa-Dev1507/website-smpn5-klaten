"use server";

import fs from "fs";
import path from "path";

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

/** Validasi NISN dan simpan data tracer study ke Google Sheets */
export async function validateNisn(payload: FormPayload) {
  try {
    // Baca data dokumen dari sisi server (tidak pernah dikirim ke browser)
    const filePath = path.join(process.cwd(), "data", "alumniDocs.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const alumniDocs = JSON.parse(fileContents);

    const nisn = payload.nisn.trim();

    // Cari dokumen berdasarkan NISN
    const foundData = alumniDocs.find((doc: any) => doc.nisn === nisn);

    if (foundData) {
      // NISN valid → simpan data tracer study ke Google Sheets (non-blocking)
      simpanKeSheet(payload);

      return {
        success: true,
        data: {
          nama: foundData.nama,
          // Konversi ke link download langsung di sisi server
          linkIjazah: toDownloadUrl(foundData.linkIjazah ?? ""),
          linkShtka:  toDownloadUrl(foundData.linkShtka ?? ""),
        },
      };
    }

    return {
      success: false,
      message:
        "Data dengan NISN tersebut tidak ditemukan atau belum tersedia. Pastikan NISN yang Anda masukkan benar.",
    };
  } catch (error) {
    console.error("Error di Server Action validateNisn:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
    };
  }
}
