import { NextRequest, NextResponse } from "next/server";

// Struktur kolom CSV yang diharapkan (urutan kolom, mulai index 0):
// 0: nisn | 1: nama | 2: kelas | 3: tanggal_lahir (YYYY-MM-DD) | 4: b_indonesia | 5: matematika | 6: tempat_lahir
const COL = {
  nisn: 0,
  nama: 1,
  kelas: 2,
  tanggalLahir: 3,
  bhsIndonesia: 4,
  matematika: 5,
  tempatLahir: 6,
};

// Parser CSV sederhana yang menangani koma di dalam tanda kutip
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((s) => s.trim().replace(/^"|"$/g, ""));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nisn = String(body?.nisn ?? "").trim();
    const tanggalLahir = String(body?.tanggalLahir ?? "").trim();

    // Validasi input
    if (!nisn || !tanggalLahir) {
      return NextResponse.json(
        { error: "NISN dan tanggal lahir wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d{6,15}$/.test(nisn)) {
      return NextResponse.json(
        { error: "NISN tidak valid." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir)) {
      return NextResponse.json(
        { error: "Format tanggal lahir tidak valid." },
        { status: 400 }
      );
    }

    const csvUrl = process.env.TKA_CSV_URL;
    if (!csvUrl) {
      console.error("[hasiltka] TKA_CSV_URL belum dikonfigurasi");
      return NextResponse.json(
        { error: "Layanan belum siap. Silakan hubungi sekolah." },
        { status: 503 }
      );
    }

    // Fetch CSV dengan cache 60 detik — request siswa bersamaan akan share cache
    const csvRes = await fetch(csvUrl, {
      next: { revalidate: 60 },
    });

    if (!csvRes.ok) {
      console.error("[hasiltka] CSV fetch failed:", csvRes.status);
      return NextResponse.json(
        { error: "Gagal mengambil data. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const csvText = await csvRes.text();
    const rows = csvText.split(/\r?\n/).filter((r) => r.trim().length > 0);

    // Lewati header (baris pertama)
    const dataRows = rows.slice(1).map(parseCSVRow);

    const foundRow = dataRows.find(
      (row) =>
        row[COL.nisn] === nisn && row[COL.tanggalLahir] === tanggalLahir
    );

    if (!foundRow) {
      return NextResponse.json(
        {
          error:
            "Data tidak ditemukan. Pastikan NISN dan tanggal lahir sudah benar.",
        },
        { status: 404 }
      );
    }

    const bhsIndonesiaRaw = (foundRow[COL.bhsIndonesia] || "").trim();
    const matematikaRaw = (foundRow[COL.matematika] || "").trim();

    const bhsIndonesia = bhsIndonesiaRaw
      ? parseFloat(bhsIndonesiaRaw.replace(",", "."))
      : null;
    const matematika = matematikaRaw
      ? parseFloat(matematikaRaw.replace(",", "."))
      : null;

    const rataRata =
      bhsIndonesia !== null && matematika !== null
        ? Math.round(((bhsIndonesia + matematika) / 2) * 100) / 100
        : null;

    return NextResponse.json({
      nisn: foundRow[COL.nisn],
      nama: foundRow[COL.nama],
      kelas: foundRow[COL.kelas],
      tempatLahir: (foundRow[COL.tempatLahir] || "").trim(),
      tanggalLahir: foundRow[COL.tanggalLahir],
      bhsIndonesia,
      matematika,
      rataRata,
    });
  } catch (err) {
    console.error("[hasiltka] Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
