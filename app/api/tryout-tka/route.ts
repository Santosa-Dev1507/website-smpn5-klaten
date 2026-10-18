import { NextRequest, NextResponse } from "next/server";

// Struktur data hasil Try Out TKA siswa
export interface TryOutStudentResult {
  nisn: string;
  nama: string;
  kelas: string;
  bhsIndonesia: number | null;
  matematika: number | null;
  rataRata: number | null;
  toIndex: number; // 1, 2, 3, atau 4
  toLabel: string;
}

// Deteksi delimiter CSV (, atau ;)
function detectDelimiter(headerLine: string): string {
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

// Parser baris CSV yang mendukung kutip ganda dan delimiter
function parseCSVRow(row: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

// Normalisasi angka dari string (mendukung koma desimal Indonesia: 78,5 -> 78.5)
function parseScore(val: string | undefined): number | null {
  if (!val) return null;
  const cleaned = val.trim().replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Ambil URL CSV berdasarkan nomor Try Out (1 s.d. 4)
function getCsvUrlForTO(toIndex: number): string | undefined {
  switch (toIndex) {
    case 1:
      return (
        process.env.TRYOUT_TKA_CSV_TO1 ||
        process.env.TRYOUT_TKA_CSV_URL ||
        process.env.TKA_TRYOUT_CSV_URL
      );
    case 2:
      return process.env.TRYOUT_TKA_CSV_TO2;
    case 3:
      return process.env.TRYOUT_TKA_CSV_TO3;
    case 4:
      return process.env.TRYOUT_TKA_CSV_TO4;
    default:
      return undefined;
  }
}

// Mengecek ketersediaan link CSV untuk masing-masing TO
function getAvailableTOList() {
  return [1, 2, 3, 4].map((to) => {
    const url = getCsvUrlForTO(to);
    return {
      to,
      label: `Try Out ${to}`,
      isAvailable: to === 1 || Boolean(url && url.trim().length > 0),
    };
  });
}

// Helper fetch dan parse satu sheet CSV untuk NISN tertentu
async function fetchTOData(
  csvUrl: string,
  targetNisn: string,
  toIndex: number
): Promise<TryOutStudentResult | null> {
  const res = await fetch(csvUrl, {
    // Cache 60 detik di server Next.js agar cepat & hemat request ke Google
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil data dari Google Sheets (HTTP ${res.status})`);
  }

  const csvText = await res.text();
  const rawRows = csvText.split(/\r?\n/).filter((r) => r.trim().length > 0);
  if (rawRows.length < 2) return null;

  const delimiter = detectDelimiter(rawRows[0]);
  const headerCols = parseCSVRow(rawRows[0], delimiter).map((h) =>
    h.toLowerCase().trim()
  );

  // Deteksi kolom secara cerdas berdasarkan nama header
  let colNisn = headerCols.findIndex((h) => h.includes("nisn") || h === "nis");
  let colNama = headerCols.findIndex((h) => h.includes("nama"));
  let colKelas = headerCols.findIndex((h) => h.includes("kelas") || h.includes("rombel"));
  let colIndo = headerCols.findIndex(
    (h) => h.includes("indo") || h.includes("bahasa") || h.includes("b_indo")
  );
  let colMat = headerCols.findIndex(
    (h) => h.includes("mat") || h.includes("mtk") || h.includes("hitung")
  );

  // Fallback posisi indeks jika header tidak terdeteksi otomatis
  if (colNisn === -1) colNisn = 0;
  if (colNama === -1) colNama = 1;
  if (colKelas === -1) colKelas = 2;
  if (colIndo === -1) colIndo = 3;
  if (colMat === -1) colMat = 4;

  const dataRows = rawRows.slice(1).map((r) => parseCSVRow(r, delimiter));

  // Cari baris data siswa yang cocok dengan NISN
  const foundRow = dataRows.find((row) => {
    const cellNisn = String(row[colNisn] ?? "").trim();
    return cellNisn === targetNisn;
  });

  if (!foundRow) return null;

  const bhsIndonesia = parseScore(foundRow[colIndo]);
  const matematika = parseScore(foundRow[colMat]);

  let rataRata: number | null = null;
  if (bhsIndonesia !== null && matematika !== null) {
    rataRata = Math.round(((bhsIndonesia + matematika) / 2) * 100) / 100;
  } else if (bhsIndonesia !== null) {
    rataRata = bhsIndonesia;
  } else if (matematika !== null) {
    rataRata = matematika;
  }

  return {
    nisn: String(foundRow[colNisn] ?? "").trim(),
    nama: String(foundRow[colNama] ?? "").trim(),
    kelas: String(foundRow[colKelas] ?? "").trim(),
    bhsIndonesia,
    matematika,
    rataRata,
    toIndex,
    toLabel: `Try Out ${toIndex}`,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawNisn = searchParams.get("nisn");
    const rawTo = searchParams.get("to");

    const availableTOs = getAvailableTOList();

    // Jika hanya cek status ketersediaan TO tanpa NISN
    if (!rawNisn) {
      return NextResponse.json({
        availableTOs,
        message: "Silakan masukkan NISN untuk melihat hasil Try Out.",
      });
    }

    const nisn = String(rawNisn).trim().replace(/\D/g, "");
    if (!nisn || nisn.length < 5 || nisn.length > 15) {
      return NextResponse.json(
        { error: "NISN tidak valid. Masukkan 10 digit angka NISN kamu." },
        { status: 400 }
      );
    }

    // Nomor Try Out yang dipilih (default ke TO 1 jika tidak ditentukan)
    let selectedTo = rawTo ? parseInt(rawTo, 10) : 1;
    if (isNaN(selectedTo) || selectedTo < 1 || selectedTo > 4) {
      selectedTo = 1;
    }

    const targetCsvUrl = getCsvUrlForTO(selectedTo);

    // MODE DEMO / UJI COBA: Jika link CSV belum diisi di .env.local
    if (!targetCsvUrl) {
      const DEMO_STUDENTS: Record<
        string,
        { nama: string; kelas: string; bhsIndonesia: number; matematika: number }
      > = {
        "0091234567": {
          nama: "Ahmad Fauzi",
          kelas: "9A",
          bhsIndonesia: 86.0,
          matematika: 82.5,
        },
        "0091234568": {
          nama: "Bunga Citra Lestari",
          kelas: "9B",
          bhsIndonesia: 92.0,
          matematika: 88.0,
        },
        "0091234569": {
          nama: "Dimas Pratama Putra",
          kelas: "9C",
          bhsIndonesia: 74.0,
          matematika: 68.5,
        },
      };

      const demoData = DEMO_STUDENTS[nisn] || {
        nama: "Siswa Uji Coba",
        kelas: "9A",
        bhsIndonesia: 84.0,
        matematika: 78.5,
      };

      const demoRataRata =
        Math.round(((demoData.bhsIndonesia + demoData.matematika) / 2) * 100) / 100;

      const demoResult: TryOutStudentResult = {
        nisn,
        nama: demoData.nama,
        kelas: demoData.kelas,
        bhsIndonesia: selectedTo === 1 ? demoData.bhsIndonesia : null,
        matematika: selectedTo === 1 ? demoData.matematika : null,
        rataRata: selectedTo === 1 ? demoRataRata : null,
        toIndex: selectedTo,
        toLabel: `Try Out ${selectedTo}`,
      };

      const demoHistory = [
        {
          toIndex: 1,
          toLabel: "Try Out 1",
          isAvailable: true,
          rataRata: demoRataRata,
          bhsIndonesia: demoData.bhsIndonesia,
          matematika: demoData.matematika,
        },
        {
          toIndex: 2,
          toLabel: "Try Out 2",
          isAvailable: false,
          rataRata: null,
          bhsIndonesia: null,
          matematika: null,
        },
        {
          toIndex: 3,
          toLabel: "Try Out 3",
          isAvailable: false,
          rataRata: null,
          bhsIndonesia: null,
          matematika: null,
        },
        {
          toIndex: 4,
          toLabel: "Try Out 4",
          isAvailable: false,
          rataRata: null,
          bhsIndonesia: null,
          matematika: null,
        },
      ];

      return NextResponse.json({
        success: true,
        isDemo: true,
        data: demoResult,
        history: demoHistory,
        availableTOs: [
          { to: 1, label: "Try Out 1", isAvailable: true },
          { to: 2, label: "Try Out 2", isAvailable: false },
          { to: 3, label: "Try Out 3", isAvailable: false },
          { to: 4, label: "Try Out 4", isAvailable: false },
        ],
        selectedTo,
      });
    }

    // Ambil data untuk Try Out yang dipilih
    const currentResult = await fetchTOData(targetCsvUrl, nisn, selectedTo);

    if (!currentResult) {
      return NextResponse.json(
        {
          error: `Data untuk NISN ${nisn} tidak ditemukan pada Try Out ${selectedTo}. Pastikan nomor NISN sudah benar.`,
          availableTOs,
          selectedTo,
        },
        { status: 404 }
      );
    }

    // Ambil ringkasan riwayat TO lainnya jika sudah tersedia link-nya
    const allHistory: {
      toIndex: number;
      toLabel: string;
      isAvailable: boolean;
      rataRata: number | null;
      bhsIndonesia: number | null;
      matematika: number | null;
    }[] = [];

    for (const item of availableTOs) {
      if (item.to === selectedTo) {
        allHistory.push({
          toIndex: item.to,
          toLabel: item.label,
          isAvailable: true,
          rataRata: currentResult.rataRata,
          bhsIndonesia: currentResult.bhsIndonesia,
          matematika: currentResult.matematika,
        });
      } else if (item.isAvailable) {
        try {
          const otherUrl = getCsvUrlForTO(item.to);
          if (otherUrl) {
            const otherRes = await fetchTOData(otherUrl, nisn, item.to);
            allHistory.push({
              toIndex: item.to,
              toLabel: item.label,
              isAvailable: true,
              rataRata: otherRes?.rataRata ?? null,
              bhsIndonesia: otherRes?.bhsIndonesia ?? null,
              matematika: otherRes?.matematika ?? null,
            });
          } else {
            allHistory.push({
              toIndex: item.to,
              toLabel: item.label,
              isAvailable: false,
              rataRata: null,
              bhsIndonesia: null,
              matematika: null,
            });
          }
        } catch {
          allHistory.push({
            toIndex: item.to,
            toLabel: item.label,
            isAvailable: true,
            rataRata: null,
            bhsIndonesia: null,
            matematika: null,
          });
        }
      } else {
        allHistory.push({
          toIndex: item.to,
          toLabel: item.label,
          isAvailable: false,
          rataRata: null,
          bhsIndonesia: null,
          matematika: null,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: currentResult,
      history: allHistory,
      availableTOs,
      selectedTo,
    });
  } catch (err: unknown) {
    console.error("[tryout-tka] Error:", err);
    return NextResponse.json(
      {
        error:
          "Terjadi kendala saat menghubungkan ke database Google Sheets. Silakan coba beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}
