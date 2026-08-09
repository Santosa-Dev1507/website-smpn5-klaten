// app/api/kokurikuler/data/route.ts
// Proxy server-side ke Google Apps Script — menyembunyikan URL GAS dari client
// GET /api/kokurikuler/data?tab=<nama_tab>

import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_KOKURIKULER_URL ?? '';

const ALLOWED_TABS = [
  'config', 'destinasi', 'rundown', 'fasilitas',
  'kursi', 'kelompok', 'tugas_siswa', 'tata_tertib', 'faq',
] as const;

type AllowedTab = typeof ALLOWED_TABS[number];

// Revalidation per tab (seconds)
const REVALIDATE: Record<AllowedTab, number> = {
  config:       300,
  destinasi:    300,
  rundown:      300,
  fasilitas:    300,
  kursi:         60,
  kelompok:      60,
  tugas_siswa:  300,
  tata_tertib: 3600,
  faq:         3600,
};

export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get('tab') as AllowedTab | null;

  if (!tab) {
    return NextResponse.json({ error: 'Parameter "tab" diperlukan' }, { status: 400 });
  }

  if (!ALLOWED_TABS.includes(tab)) {
    return NextResponse.json(
      { error: `Tab "${tab}" tidak diizinkan. Pilihan: ${ALLOWED_TABS.join(', ')}` },
      { status: 400 }
    );
  }

  // Jika GAS belum dikonfigurasi, kembalikan data demo kosong
  if (!GAS_URL || GAS_URL.includes('GANTI_SETELAH_DEPLOY')) {
    return NextResponse.json(
      {
        data: [],
        tab,
        count: 0,
        warning: 'GAS_KOKURIKULER_URL belum dikonfigurasi. Lihat _docs/gas-kokurikuler-template.js',
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  try {
    const gasUrl = `${GAS_URL}?tab=${encodeURIComponent(tab)}`;
    const revalidate = REVALIDATE[tab];

    const gasRes = await fetch(gasUrl, {
      next: { revalidate },
      redirect: 'follow',
    });

    if (!gasRes.ok) {
      return NextResponse.json(
        { error: `GAS error: HTTP ${gasRes.status}` },
        { status: 502 }
      );
    }

    const json = await gasRes.json();

    return NextResponse.json(json, {
      headers: {
        'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Proxy error: ${message}` },
      { status: 500 }
    );
  }
}
