import type { Metadata } from "next";
import OsisDaftarClient from "./OsisDaftarClient";

export const metadata: Metadata = {
  title: "Pendaftaran OSIS — SMPN 5 Klaten",
  description:
    "Formulir resmi pendaftaran calon pengurus OSIS SMP Negeri 5 Klaten Tahun Ajaran 2026/2027. Informasi jadwal seleksi, persyaratan dokumen, dan formulir pendaftaran daring.",
  alternates: { canonical: "/osis/daftar" },
  openGraph: {
    title: "Pendaftaran Calon Pengurus OSIS — SMPN 5 Klaten",
    description:
      "Daftarkan dirimu sebagai calon pengurus OSIS SMP Negeri 5 Klaten Tahun Ajaran 2026/2027. Generasi JUARA siap memimpin!",
    url: "https://www.smpn5klaten.sch.id/osis/daftar",
  },
};

export default function OsisDaftarPage() {
  return <OsisDaftarClient />;
}
