// app/api/kokurikuler/kelompok/route.ts
// CRUD kelompok kokurikuler — Disimpan ke GOOGLE SHEETS via GAS
// POST: buat kelompok baru
// GET:  ambil data kelompok by kode (dikirim via POST action "GET" ke GAS)
// PUT:  update kelompok (dikirim via POST action "UPDATE" ke GAS)

import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_KELOMPOK_URL || "ISI_DENGAN_URL_WEB_APP_GAS_BAPAK";

// ── Konstanta ────────────────────────────────────────────────────────
const REGISTRATION_OPEN  = new Date('2026-09-26T00:00:00+07:00');
const REGISTRATION_CLOSE = new Date('2026-09-30T23:59:59+07:00');

function isRegistrationOpen(): boolean {
  const now = new Date();
  return now >= REGISTRATION_OPEN && now <= REGISTRATION_CLOSE;
}

// ── GET: ambil kelompok by ?kode=VIIIA-01 ─────────────────────────
export async function GET(req: NextRequest) {
  const kode = req.nextUrl.searchParams.get('kode');
  if (!kode) {
    return NextResponse.json({ error: 'Parameter "kode" diperlukan.' }, { status: 400 });
  }

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // GAS lebih aman menerima text/plain
      body: JSON.stringify({ action: "GET", kode_kelompok: kode.toUpperCase() })
    });
    const json = await res.json();
    
    if (json.error) return NextResponse.json({ error: json.error }, { status: 404 });
    return NextResponse.json({ data: json.data, isEditable: isRegistrationOpen() });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menarik data dari Spreadsheet." }, { status: 500 });
  }
}

// ── POST: buat kelompok baru ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json({ error: 'Pendaftaran kelompok ditutup. Periode: 26–30 September 2026.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const payload = { ...body, action: "CREATE" };

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.error) return NextResponse.json({ error: json.error }, { status: 500 });
    return NextResponse.json({ success: true, kode_kelompok: json.kode_kelompok }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghubungi Spreadsheet.' }, { status: 500 });
  }
}

// ── PUT: update kelompok ─────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json({ error: 'Periode edit ditutup (26–30 September 2026).' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const payload = { ...body, action: "UPDATE" };

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.error) return NextResponse.json({ error: json.error }, { status: 500 });
    return NextResponse.json({ success: true, kode_kelompok: body.kode_kelompok });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghubungi Spreadsheet.' }, { status: 500 });
  }
}
