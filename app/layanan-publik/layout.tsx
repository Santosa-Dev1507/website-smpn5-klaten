import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIPP — SMP Negeri 5 Klaten",
  description:
    "SIPP (Sistem Informasi Pelayanan Publik) SMP Negeri 5 Klaten. Portal terpadu untuk layanan ijazah, mutasi siswa, perpustakaan, SPMB, dan ekstrakurikuler — transparan, akuntabel, dan gratis.",
  alternates: { canonical: "/layanan-publik" },
  openGraph: {
    title: "SIPP — SMP Negeri 5 Klaten",
    description:
      "SIPP SMP Negeri 5 Klaten: portal pelayanan publik terpadu untuk akses layanan ijazah, mutasi, perpustakaan, dan SPMB secara transparan.",
    url: "https://www.smpn5klaten.sch.id/layanan-publik",
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

export { default } from "./page";
