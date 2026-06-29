import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SMPN Manajemen – SIM Ekstrakurikuler & Lomba SMPN 5 Klaten",
  description:
    "Sistem Informasi Manajemen Ekstrakurikuler dan Lomba SMPN 5 Klaten. Kelola kegiatan ekskul, jadwal kompetisi, absensi, dan portofolio siswa secara digital.",
  keywords: ["SMPN 5 Klaten", "ekstrakurikuler", "lomba", "SIM sekolah", "manajemen akademik"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} font-[var(--font-inter)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
