// app/api/kokurikuler/kursi/route.ts
// Fetch data kursi bus dari Google Sheets Gviz API
// GET /api/kokurikuler/kursi
// Returns: { data: KursiSiswa[], count: number }

import { NextResponse } from 'next/server';

const GVIZ_URL = process.env.GAS_KURSI_GVIZ_URL ?? '';

export const revalidate = 60; // ISR: cache 60 detik

interface GvizCell {
  v: string | number | null;
  f?: string;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

interface GvizTable {
  cols: { label: string; type: string }[];
  rows: GvizRow[];
}

interface GvizResponse {
  table?: GvizTable;
}

function cellVal(cell: GvizCell | null | undefined): string {
  if (!cell || cell.v === null || cell.v === undefined) return '';
  return String(cell.v).trim();
}

export async function GET() {
  if (!GVIZ_URL) {
    return NextResponse.json(
      { data: [], count: 0, warning: 'GAS_KURSI_GVIZ_URL belum dikonfigurasi.' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const res = await fetch(GVIZ_URL, {
      next: { revalidate: 60 },
      redirect: 'follow',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Gviz error: HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const text = await res.text();

    // Gviz mengembalikan: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      return NextResponse.json(
        { error: 'Respon Gviz tidak valid.' },
        { status: 502 }
      );
    }

    const json: GvizResponse = JSON.parse(text.substring(firstBrace, lastBrace + 1));
    const rows = json.table?.rows ?? [];
    const cols = json.table?.cols ?? [];

    if (rows.length === 0) {
      return NextResponse.json({ data: [], count: 0 });
    }

    // Deteksi indeks kolom dari header Gviz (cols[].label)
    let busCol = -1, kursiCol = -1, namaCol = -1, kelasCol = -1, nisCol = -1, genderCol = -1;

    cols.forEach((col, idx) => {
      const label = col.label.toLowerCase().replace(/[\s.]+/g, '');
      if (label === 'bus' || label === 'armadabus' || label === 'nobus') busCol = idx;
      else if (label === 'nokursi' || label === 'kursi' || label === 'nomorkursi') kursiCol = idx;
      else if (label.includes('nama')) namaCol = idx;
      else if (label.includes('kelas')) kelasCol = idx;
      else if (label.includes('induk') || label === 'nis') nisCol = idx;
      else if (label === 'l/p' || label.includes('gender') || label === 'jeniskelamin') genderCol = idx;
    });

    // Jika header tidak terdeteksi dari cols, coba baris pertama sebagai header manual
    if (kursiCol === -1 && rows.length > 0) {
      const firstRow = rows[0].c;
      firstRow?.forEach((cell, idx) => {
        const val = cellVal(cell).toLowerCase().replace(/[\s.]+/g, '');
        if (val === 'nokursi' || val === 'kursi') kursiCol = idx;
        else if (val === 'bus' || val === 'armadabus') busCol = idx;
        else if (val.includes('nama')) namaCol = idx;
        else if (val.includes('kelas')) kelasCol = idx;
        else if (val.includes('induk') || val === 'nis') nisCol = idx;
        else if (val === 'l/p' || val.includes('gender')) genderCol = idx;
      });
      // Jika baris pertama memang header, skip
      rows.shift();
    }

    // Fallback kolom default berdasarkan posisi GAS yang diketahui:
    // col 0 = No, col 1 = Bus, col 2 = Kursi, col 3 = Kelas, col 4 = NIS, col 5 = Nama, col 6 = L/P
    if (busCol === -1)    busCol = 1;
    if (kursiCol === -1)  kursiCol = 2;
    if (kelasCol === -1)  kelasCol = 3;
    if (nisCol === -1)    nisCol = 4;
    if (namaCol === -1)   namaCol = 5;
    if (genderCol === -1) genderCol = 6;

    const data = rows
      .map((row) => {
        const c = row.c ?? [];
        const kursi = cellVal(c[kursiCol]);
        if (!kursi) return null;
        return {
          bus_id:       cellVal(c[busCol]) || 'Bus 1',
          nomor_kursi:  kursi.replace(/[\s()]/g, '').toUpperCase(),
          nama_siswa:   cellVal(c[namaCol]),
          kelas:        cellVal(c[kelasCol]),
          nis:          cellVal(c[nisCol]),
          gender:       cellVal(c[genderCol]),
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { data, count: data.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Proxy error: ${message}` }, { status: 500 });
  }
}
