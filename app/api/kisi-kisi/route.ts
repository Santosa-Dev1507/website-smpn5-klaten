import { NextResponse } from "next/server";
import type { Kelas, KisiKisiItem, KisiKisiResponse, KisiKisiStatus } from "../../kisi-kisi/types";

/**
 * Daftar master mata pelajaran SMPN 5 Klaten.
 * Setiap mapel yang belum ada di Spreadsheet untuk periode aktif otomatis
 * ditampilkan dengan status "segera" (Menunggu Pengunggahan).
 */
const MASTER_MAPEL: string[] = [
  "Pendidikan Agama & Budi Pekerti",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam (IPA)",
  "Ilmu Pengetahuan Sosial (IPS)",
  "Bahasa Inggris",
  "PJOK",
  "Informatika",
  "Seni Budaya",
  "Bahasa Jawa",
];

const ALL_KELAS: Kelas[] = ["VII", "VIII", "IX"];

/** Parser CSV yang menangani koma & tanda kutip di dalam sel */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
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

/** Normalisasi input kelas (7 / VII / Kelas 7 / Kelas VII -> VII) */
function normalizeKelas(raw: string): Kelas | null {
  const cleaned = raw
    .toUpperCase()
    .replace(/KELAS/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .trim();

  if (cleaned === "7" || cleaned === "VII") return "VII";
  if (cleaned === "8" || cleaned === "VIII") return "VIII";
  if (cleaned === "9" || cleaned === "IX") return "IX";
  return null;
}

/** Normalisasi nama mapel untuk pencocokan deduplikasi & master list */
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/** Ekstrak Google Drive File ID dari berbagai format URL Drive */
function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Format: https://drive.google.com/file/d/FILE_ID/view...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Format: https://drive.google.com/open?id=FILE_ID atau uc?id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  // Format: https://docs.google.com/document/d/FILE_ID/...
  const docsMatch = trimmed.match(/docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) return docsMatch[1];

  return null;
}

/** Bangun link unduh & link preview dari URL mentah (termasuk output Google Form) */
function resolveLinks(rawUnduh: string, rawPreview: string): { linkUnduh: string; linkPreview: string } {
  const sourceUrl = (rawUnduh || rawPreview || "").trim();
  if (!sourceUrl) return { linkUnduh: "", linkPreview: "" };

  const driveId = extractGoogleDriveId(sourceUrl) || extractGoogleDriveId(rawPreview);

  if (driveId) {
    const isGoogleDocs = sourceUrl.includes("docs.google.com/document/");
    return {
      linkUnduh:
        rawUnduh && rawUnduh.includes("export=download")
          ? rawUnduh
          : isGoogleDocs
            ? `https://docs.google.com/document/d/${driveId}/export?format=pdf`
            : `https://drive.google.com/uc?export=download&id=${driveId}`,
      linkPreview:
        rawPreview && rawPreview.includes("/preview")
          ? rawPreview
          : `https://drive.google.com/file/d/${driveId}/preview`,
    };
  }

  // Non-Drive URL fallback (mis. file PDF eksternal)
  const previewFallback =
    rawPreview ||
    `https://docs.google.com/gview?url=${encodeURIComponent(sourceUrl)}&embedded=true`;

  return {
    linkUnduh: sourceUrl,
    linkPreview: previewFallback,
  };
}

function makeSlug(tahunAjaran: string, kelas: Kelas, mapel: string): string {
  return `${tahunAjaran}-${kelas}-${mapel}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Cari indeks kolom secara fleksibel agar kompatibel dengan Sheet manual maupun Google Form */
function findColIndex(headers: string[], candidates: string[]): number {
  const normalized = headers.map((h) => h.toLowerCase().trim());
  for (const candidate of candidates) {
    const exact = normalized.indexOf(candidate);
    if (exact !== -1) return exact;
  }
  for (const candidate of candidates) {
    const partial = normalized.findIndex((h) => h.includes(candidate));
    if (partial !== -1) return partial;
  }
  return -1;
}

/** Cocokkan nama mapel dari sheet ke nama baku master (jika mirip, mis. "IPA" -> "Ilmu Pengetahuan Alam (IPA)") */
function canonicalMapelName(rawMapel: string): string {
  const norm = normalizeKey(rawMapel);
  if (norm === "ipa") return "Ilmu Pengetahuan Alam (IPA)";
  if (norm === "ips") return "Ilmu Pengetahuan Sosial (IPS)";
  if (norm === "pai" || norm === "pabp" || norm.includes("agama")) {
    return "Pendidikan Agama & Budi Pekerti";
  }
  if (norm === "pkn" || norm === "ppkn" || norm.includes("pancasila")) {
    return "Pendidikan Pancasila";
  }
  if (norm === "mtk" || norm === "matematika") return "Matematika";
  if (norm === "bindo" || norm === "bahasaindonesia" || norm === "bindonesia") {
    return "Bahasa Indonesia";
  }
  if (norm === "bing" || norm === "bahasainggris" || norm === "binggris") {
    return "Bahasa Inggris";
  }
  if (norm === "bjawa" || norm === "bahasajawa") return "Bahasa Jawa";
  if (norm === "tik" || norm === "informatika") return "Informatika";
  if (norm === "kka" || norm.includes("koding") || norm.includes("artifisial")) {
    return "Koding & Kecerdasan Artifisial (KKA)";
  }
  if (norm === "pjok" || norm === "penjas" || norm === "olahraga") return "PJOK";
  if (norm === "sbk" || norm === "senibudaya" || norm === "senirupa") return "Seni Budaya";

  const matched = MASTER_MAPEL.find((m) => normalizeKey(m) === norm);
  return matched || rawMapel.trim();
}

/** Data pratinjau sementara sebelum KISIKISI_CSV_URL diatur di .env.local */
function buildDemoResponse(): KisiKisiResponse {
  const periods = ["2026/2027 · ASAS Gasal", "2025/2026 · ASAT Genap"];
  const items: KisiKisiItem[] = [];

  // Mapel yang disimulasikan sudah tersedia untuk periode aktif
  const availableActive = new Set([
    "VII::Matematika",
    "VII::Bahasa Indonesia",
    "VII::Ilmu Pengetahuan Alam (IPA)",
    "VII::Bahasa Inggris",
    "VII::Pendidikan Agama & Budi Pekerti",
    "VII::Informatika",
    "VIII::Matematika",
    "VIII::Bahasa Indonesia",
    "VIII::Ilmu Pengetahuan Sosial (IPS)",
    "VIII::Bahasa Inggris",
    "VIII::Pendidikan Pancasila",
    "IX::Matematika",
    "IX::Bahasa Indonesia",
    "IX::Ilmu Pengetahuan Alam (IPA)",
    "IX::Bahasa Inggris",
    "IX::Bahasa Jawa",
  ]);

  const demoPdf = "/denah-daftar-ulang.pdf";

  for (const period of periods) {
    const isArchive = period.startsWith("2025/2026");
    for (const kelas of ALL_KELAS) {
      for (const mapel of MASTER_MAPEL) {
        const ready = isArchive || availableActive.has(`${kelas}::${mapel}`);
        items.push({
          id: makeSlug(period, kelas, mapel),
          tahunAjaran: period,
          kelas,
          mataPelajaran: mapel,
          status: ready ? "tersedia" : "segera",
          linkUnduh: ready ? demoPdf : "",
          linkPreview: ready ? demoPdf : "",
        });
      }
    }
  }

  return {
    items,
    tahunAjaranList: periods,
    isDemo: true,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const csvUrl = process.env.KISIKISI_CSV_URL?.trim();

    if (!csvUrl) {
      return NextResponse.json(buildDemoResponse(), {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    const res = await fetch(csvUrl, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("[api/kisi-kisi] Gagal fetch CSV:", res.status);
      return NextResponse.json(
        { error: "Gagal memuat data kisi-kisi dari server. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return NextResponse.json({
        items: [],
        tahunAjaranList: [],
        isDemo: false,
        updatedAt: new Date().toISOString(),
      } satisfies KisiKisiResponse);
    }

    const headers = parseCSVRow(lines[0]);

    const idxTahun = findColIndex(headers, ["tahun_ajaran", "tahun ajaran", "periode", "semester"]);
    const idxKelas = findColIndex(headers, ["kelas", "tingkat"]);
    const idxMapel = findColIndex(headers, ["mata_pelajaran", "mata pelajaran", "mapel"]);
    const idxStatus = findColIndex(headers, ["status"]);
    const idxUnduh = findColIndex(headers, [
      "link_unduh",
      "link unduh",
      "link_file",
      "upload file",
      "unggah file",
      "file kisi",
      "file",
      "tautan",
    ]);
    const idxPreview = findColIndex(headers, ["link_preview", "link preview", "preview"]);

    // Simpan baris yang sudah ada — baris lebih bawah (revisi terbaru) menimpa baris lama
    const recordMap = new Map<string, KisiKisiItem>();
    const periodOrder: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVRow(lines[i]);
      const rawTahun = (idxTahun !== -1 ? cols[idxTahun] : cols[0])?.trim() || "";
      const rawKelas = (idxKelas !== -1 ? cols[idxKelas] : cols[1])?.trim() || "";
      const rawMapel = (idxMapel !== -1 ? cols[idxMapel] : cols[2])?.trim() || "";
      const rawStatus = (idxStatus !== -1 ? cols[idxStatus] : "")?.trim().toLowerCase() || "";
      const rawUnduh = (idxUnduh !== -1 ? cols[idxUnduh] : cols[4])?.trim() || "";
      const rawPreview = (idxPreview !== -1 ? cols[idxPreview] : cols[5])?.trim() || "";

      const kelas = normalizeKelas(rawKelas);
      if (!rawTahun || !kelas || !rawMapel) continue;

      const mataPelajaran = canonicalMapelName(rawMapel);
      const { linkUnduh, linkPreview } = resolveLinks(rawUnduh, rawPreview);

      let status: KisiKisiStatus;
      if (rawStatus === "segera" || rawStatus === "menunggu" || rawStatus === "belum") {
        status = "segera";
      } else if (linkUnduh || linkPreview) {
        status = "tersedia";
      } else {
        status = "segera";
      }

      if (!periodOrder.includes(rawTahun)) {
        periodOrder.push(rawTahun);
      }

      const key = `${rawTahun}::${kelas}::${normalizeKey(mataPelajaran)}`;
      recordMap.set(key, {
        id: makeSlug(rawTahun, kelas, mataPelajaran),
        tahunAjaran: rawTahun,
        kelas,
        mataPelajaran,
        status,
        linkUnduh: status === "tersedia" ? linkUnduh : "",
        linkPreview: status === "tersedia" ? linkPreview : "",
      });
    }

    // Urutkan periode terbaru di atas (mis. 2027/2028 > 2026/2027 > 2025/2026)
    const tahunAjaranList = [...periodOrder].sort((a, b) =>
      b.localeCompare(a, "id", { numeric: true })
    );

    // Lengkapi periode yang ada dengan daftar master mapel agar yang belum diunggah
    // otomatis tampil sebagai "Segera Hadir"
    const items: KisiKisiItem[] = [];
    const seenKeys = new Set<string>();

    for (const period of tahunAjaranList) {
      for (const kelas of ALL_KELAS) {
        for (const mapel of MASTER_MAPEL) {
          const key = `${period}::${kelas}::${normalizeKey(mapel)}`;
          seenKeys.add(key);
          const existing = recordMap.get(key);
          if (existing) {
            items.push(existing);
          } else {
            items.push({
              id: makeSlug(period, kelas, mapel),
              tahunAjaran: period,
              kelas,
              mataPelajaran: mapel,
              status: "segera",
              linkUnduh: "",
              linkPreview: "",
            });
          }
        }

        // Sertakan juga mapel tambahan di luar master list jika guru mengunggahnya
        for (const [key, item] of recordMap.entries()) {
          if (
            !seenKeys.has(key) &&
            item.tahunAjaran === period &&
            item.kelas === kelas
          ) {
            seenKeys.add(key);
            items.push(item);
          }
        }
      }
    }

    const payload: KisiKisiResponse = {
      items,
      tahunAjaranList,
      isDemo: false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("[api/kisi-kisi] Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses data kisi-kisi." },
      { status: 500 }
    );
  }
}
