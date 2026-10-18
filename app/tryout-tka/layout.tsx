import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hasil Try Out TKA — SMP Negeri 5 Klaten",
  description:
    "Portal Resmi Pengumuman Hasil Try Out Tes Kemampuan Akademik (TKA) Siswa SMP Negeri 5 Klaten.",
  openGraph: {
    title: "Hasil Try Out TKA — SMP Negeri 5 Klaten",
    description:
      "Cek capaian nilai hasil Try Out Tes Kemampuan Akademik (TKA) SMP Negeri 5 Klaten dengan memasukkan NISN.",
  },
};

export default function TryOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
