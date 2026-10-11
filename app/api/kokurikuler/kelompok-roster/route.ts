// app/api/kokurikuler/kelompok-roster/route.ts
// GET /api/kokurikuler/kelompok-roster?kelas=VIII+A
// Memanggil GAS action LIST_BY_KELAS → mengembalikan daftar siswa per kelas
// berdasarkan data kelompok (tab Kelompok_Siswa di Spreadsheet)

import { NextRequest, NextResponse } from 'next/server';

const GAS_URL =
  process.env.NEXT_PUBLIC_GAS_KELOMPOK_URL ||
  'https://script.google.com/macros/s/AKfycbyzwoslzbeNA2-8-x1mng1HBo9S5sE54PjUCpNtyIaF8cdG2-iC-mdLTMvgDors0OQ/exec';

export const dynamic = 'force-dynamic'; // selalu fresh, tidak di-cache

export async function GET(req: NextRequest) {
  const kelas = req.nextUrl.searchParams.get('kelas');

  if (!kelas) {
    return NextResponse.json(
      { error: 'Parameter "kelas" diperlukan. Contoh: ?kelas=VIII+A' },
      { status: 400 }
    );
  }

  try {
    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'LIST_BY_KELAS', kelas }),
      cache: 'no-store',
    });

    if (!gasRes.ok) {
      return NextResponse.json(
        { error: `GAS error: HTTP ${gasRes.status}` },
        { status: 502 }
      );
    }

    const json = await gasRes.json();

    if (json.error) {
      return NextResponse.json({ error: json.error }, { status: 404 });
    }

    return NextResponse.json(json, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Proxy error: ${message}` },
      { status: 500 }
    );
  }
}
