"use server";

export interface OsisPendaftaranPayload {
  nama_lengkap: string;
  nisn: string;
  kelas: string;
  no_wa: string;
  posisi: string;
  visi_misi: string;
  prestasi_akademik: string;
  prestasi_non_akademik: string;
  pengalaman_organisasi: string;
}

export type ActionResult =
  | { success: true }
  | { success: false; message: string };

/**
 * Kirim data pendaftaran OSIS ke Google Sheets via Apps Script Web App.
 * URL endpoint dikonfigurasi melalui env var OSIS_SCRIPT_URL di .env.local
 */
export async function daftarOsis(
  payload: OsisPendaftaranPayload
): Promise<ActionResult> {
  const url = process.env.OSIS_SCRIPT_URL;

  // Jika URL belum disetel di .env.local:
  if (!url) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[osis] Peringatan dev: OSIS_SCRIPT_URL belum disetel di .env.local. Simulasi pendaftaran berhasil untuk pengujian lokal."
      );
      return { success: true };
    }

    console.error("[osis] OSIS_SCRIPT_URL tidak ditemukan di .env.local");
    return {
      success: false,
      message:
        "Layanan pendaftaran sedang dalam konfigurasi akhir. Silakan hubungi panitia seleksi OSIS SMPN 5 Klaten.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        tahun_ajaran: "2026/2027",
      }),
    });

    if (!res.ok) {
      console.error("[osis] Google Script response status:", res.status);
      return {
        success: false,
        message:
          "Gagal menyimpan data ke sistem. Periksa koneksi internet dan silakan coba lagi.",
      };
    }

    const json = await res.json().catch(() => ({}));

    if (json?.result === "error") {
      return {
        success: false,
        message: json?.message ?? "Terjadi kesalahan saat memproses data pendaftaran.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[osis] Gagal menghubungi Google Apps Script:", err);
    return {
      success: false,
      message:
        "Terjadi kendala jaringan saat mengirim formulir. Silakan periksa koneksi Anda dan coba lagi.",
    };
  }
}
