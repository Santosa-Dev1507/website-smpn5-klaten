import { NextResponse } from 'next/server';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRn4K839nGtGnW3ERXBQ4sOLk-OWxqRgJsdHQnI_3jggRBBCL46iXUshGASSBjAyh9Nq7ofJvLVHD0/pub?gid=858801583&single=true&output=csv';

export async function GET() {
  try {
    const res = await fetch(CSV_URL, { 
      // Revalidate setiap 1 jam agar data siswa selalu up to date tanpa membebani Google
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('Gagal mengunduh data siswa dari Google Sheets');
    const text = await res.text();

    // Parse CSV (pemisah koma)
    // Format: No, Kelas, No. Induk, Nama, L/ P
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    const data = lines.slice(1).map(line => {
      // Split by comma
      const cols = line.split(',');
      return {
        kelas: cols[1]?.trim(),
        nis:   cols[2]?.trim(),
        nama:  cols[3]?.trim(),
      };
    }).filter(item => item.kelas && item.nama); // Hanya ambil baris yang valid

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
