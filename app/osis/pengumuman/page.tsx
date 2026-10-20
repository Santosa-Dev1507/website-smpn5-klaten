import type { Metadata } from "next";
import OsisPengumumanClient from "./OsisPengumumanClient";

export const metadata: Metadata = {
  title: "Pengumuman Hasil Seleksi OSIS — SMPN 5 Klaten",
  description:
    "Pengumuman resmi hasil seleksi Calon Pengurus dan Calon Ketua OSIS SMP Negeri 5 Klaten Periode 2026/2027. Informasi 35 murid terpilih dan tautan grup koordinasi.",
  alternates: { canonical: "/osis/pengumuman" },
  openGraph: {
    title: "Pengumuman Hasil Seleksi Calon Pengurus OSIS — SMPN 5 Klaten",
    description:
      "Daftar 35 murid terpilih seleksi OSIS SMP Negeri 5 Klaten Tahun Ajaran 2026/2027. Generasi JUARA siap memimpin!",
    url: "https://www.smpn5klaten.sch.id/osis/pengumuman",
  },
};

export default function OsisPengumumanPage() {
  return <OsisPengumumanClient />;
}
