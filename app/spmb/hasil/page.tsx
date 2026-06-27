import type { Metadata } from "next";
import HasilSpmbClient from "./HasilSpmbClient";

export const metadata: Metadata = {
  title: "Pengumuman Hasil SPMB 2026/2027 — SMPN 5 Klaten",
  description:
    "Cek hasil seleksi Penerimaan Murid Baru (SPMB) SMPN 5 Klaten Tahun Pelajaran 2026/2027. Masukkan NISN atau nama untuk mengetahui status kelulusan dan petunjuk daftar ulang.",
};

export default function HasilSpmbPage() {
  return <HasilSpmbClient />;
}
