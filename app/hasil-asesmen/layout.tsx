import type { Metadata } from "next";
import ScrollReveal from "../components/ScrollReveal";

export const metadata: Metadata = {
  title: "Hasil Asesmen Siswa — SMPN 5 Klaten",
  description:
    "Portal Hasil Asesmen SMP Negeri 5 Klaten. Pantau capaian nilai, posisi belajar, refleksi, tindakan perbaikan, dan motivasi tumbuh.",
  alternates: { canonical: "/hasil-asesmen" },
  openGraph: {
    title: "Hasil Asesmen Siswa — SMPN 5 Klaten",
    description: "Portal Hasil Asesmen SMPN 5 Klaten: Nilai, Posisi, Refleksi, Tindakan, dan Motivasi.",
    url: "https://www.smpn5klaten.sch.id/hasil-asesmen",
  },
};

export default function HasilAsesmenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollReveal />
      {children}
    </>
  );
}
