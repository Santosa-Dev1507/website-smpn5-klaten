// app/api/kokurikuler/penilaian/route.ts
// Simpan & baca penilaian kokurikuler via Google Apps Script (Sheets)
// Tidak memerlukan autentikasi Supabase — guru diidentifikasi via field dinilai_oleh
//
// POST /api/kokurikuler/penilaian  → GAS action SAVE_PENILAIAN (batch upsert)
// GET  /api/kokurikuler/penilaian  → GAS action GET_PENILAIAN  (baca rekap)

import { NextRequest, NextResponse } from 'next/server';

const GAS_URL =
  process.env.NEXT_PUBLIC_GAS_KELOMPOK_URL ||
  'https://script.google.com/macros/s/AKfycbyzwoslzbeNA2-8-x1mng1HBo9S5sE54PjUCpNtyIaF8cdG2-iC-mdLTMvgDors0OQ/exec';

// ── POST: Simpan batch nilai ke Sheets ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Dukung single record maupun array
    const records = Array.isArray(body) ? body : [body];

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang dikirim' },
        { status: 400 }
      );
    }

    // Validasi field wajib pada record pertama
    const required = ['nama_siswa', 'kelas', 'dimensi', 'predikat', 'dinilai_oleh'];
    for (const field of required) {
      if (!records[0][field]) {
        return NextResponse.json(
          { error: `Field "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'SAVE_PENILAIAN', records }),
    });

    if (!gasRes.ok) {
      return NextResponse.json(
        { error: `GAS error: HTTP ${gasRes.status}` },
        { status: 502 }
      );
    }

    const json = await gasRes.json();

    if (json.error) {
      return NextResponse.json({ error: json.error }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── GET: Baca rekap nilai dari Sheets ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const kelas = req.nextUrl.searchParams.get('kelas');
  const tahun = req.nextUrl.searchParams.get('tahun');

  try {
    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'GET_PENILAIAN', kelas, tahun }),
      cache: 'no-store',
    });

    if (!gasRes.ok) {
      return NextResponse.json(
        { error: `GAS error: HTTP ${gasRes.status}` },
        { status: 502 }
      );
    }

    const json = await gasRes.json();
    return NextResponse.json(json, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
