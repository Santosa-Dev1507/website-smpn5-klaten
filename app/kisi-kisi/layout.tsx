import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kisi-Kisi ASTS dan ASAS — SMP Negeri 5 Klaten",
  description:
    "Portal resmi kisi-kisi ASTS dan ASAS SMP Negeri 5 Klaten untuk Kelas VII, VIII, dan IX. Lihat pratinjau langsung, unduh dokumen, atau salin tautan untuk dibagikan ke kelas.",
  alternates: { canonical: "/kisi-kisi" },
  openGraph: {
    title: "Kisi-Kisi ASTS dan ASAS — SMP Negeri 5 Klaten",
    description:
      "Akses cepat kisi-kisi ujian seluruh mata pelajaran SMP Negeri 5 Klaten — pratinjau online, unduh file, dan arsip multi-tahun ajaran.",
    url: "https://www.smpn5klaten.sch.id/kisi-kisi",
    siteName: "SMPN 5 Klaten",
    images: [
      {
        url: "/logo_smpn5.png",
        width: 512,
        height: 512,
        alt: "Logo SMPN 5 Klaten",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function KisiKisiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
