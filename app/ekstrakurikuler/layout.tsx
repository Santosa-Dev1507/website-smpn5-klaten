import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekstrakurikuler — SMPN 5 Klaten",
  description:
    "Temukan dan daftarkan diri ke kegiatan ekstrakurikuler SMPN 5 Klaten. 11 ekskul pilihan untuk mengembangkan bakat, karakter, dan prestasi siswa.",
  alternates: { canonical: "/ekstrakurikuler" },
  openGraph: {
    title: "Ekstrakurikuler SMPN 5 Klaten",
    description: "11 ekskul pilihan untuk mengembangkan bakat dan prestasi siswa SMPN 5 Klaten.",
    url: "https://www.smpn5klaten.sch.id/ekstrakurikuler",
  },
};

export default function EkstrakurikulerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
