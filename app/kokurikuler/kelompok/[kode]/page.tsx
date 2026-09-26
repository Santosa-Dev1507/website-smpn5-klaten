// app/kokurikuler/kelompok/[kode]/page.tsx
// Halaman lihat & edit kelompok — public by kode
// Server component: fetch dari API route

import { notFound } from "next/navigation";
import KelompokDetail from "./KelompokDetail";

interface Props {
  params: Promise<{ kode: string }>;
}

async function fetchKelompok(kode: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/kokurikuler/kelompok?kode=${encodeURIComponent(kode)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props) {
  const { kode } = await params;
  return {
    title: `Kelompok ${kode} — Kokurikuler SMPN 5 Klaten`,
  };
}

export default async function KelompokKodePage({ params }: Props) {
  const { kode } = await params;
  const result = await fetchKelompok(kode.toUpperCase());

  if (!result?.data) {
    notFound();
  }

  return (
    <KelompokDetail
      kelompok={result.data}
      isEditable={result.isEditable ?? false}
    />
  );
}
