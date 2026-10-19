import type { Metadata } from "next";
import OsisEvoteClient from "./OsisEvoteClient";

export const metadata: Metadata = {
  title: "E-Voting Calon Ketua OSIS 2026/2027 — SMPN 5 Klaten",
  description:
    "Portal resmi pemilihan umum Calon Ketua OSIS SMP Negeri 5 Klaten Masa Bakti 2026/2027. Salurkan hak suara Anda untuk Generasi JUARA!",
  alternates: { canonical: "/osis/evote" },
  openGraph: {
    title: "E-Voting Calon Ketua OSIS — SMPN 5 Klaten",
    description:
      "Gunakan hak pilih Anda dalam Pemilihan Umum Calon Ketua OSIS SMP Negeri 5 Klaten Masa Bakti 2026/2027 secara jujur, adil, dan transparan.",
    url: "https://www.smpn5klaten.sch.id/osis/evote",
  },
};

export default function OsisEvotePage() {
  return <OsisEvoteClient />;
}
