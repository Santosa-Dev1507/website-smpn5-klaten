// src/lib/pdf-laporan.ts
// Generate 3 format laporan ekskul sebagai print-friendly HTML → PDF via window.print()
// Tidak butuh library eksternal — gunakan CSS @media print

import type { SesiAbsensi, Absensi, Ekskul, UserProfile, LaporanKegiatan } from "./supabase";

// ── Shared: Header Dokumen ──────────────────────────────────
function headerDokumen(judul1: string, judul2: string, judul3: string, judul4: string) {
  return `
    <div style="text-align:center;margin-bottom:16px;font-family:'Times New Roman',serif;">
      <div style="font-weight:bold;font-size:14px;text-transform:uppercase;">${judul1}</div>
      <div style="font-weight:bold;font-size:13px;text-transform:uppercase;">${judul2}</div>
      <div style="font-weight:bold;font-size:13px;">SMP NEGERI 5 KLATEN</div>
      <div style="font-size:12px;">${judul3}</div>
      ${judul4 ? `<div style="font-size:12px;">${judul4}</div>` : ""}
    </div>
  `;
}

// ── Shared: TTD Section ─────────────────────────────────────
function ttdSection(
  namaWKS: string, nipWKS: string,
  namaPembina: string, nipPembina: string,
  kota: string, bulan: string,
  showKepsek: boolean = true,
  namaKepsek: string = "Kamidi, S.Pd", nipKepsek: string = "NIP197107281998021002"
) {
  return `
    <div style="margin-top:32px;font-family:'Times New Roman',serif;font-size:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div>WKS Kesiswaan</div>
          <div style="height:60px;"></div>
          <div style="text-decoration:underline;">${namaWKS}</div>
          <div>${nipWKS}</div>
        </div>
        <div style="text-align:right;">
          <div>${kota}, ${bulan}</div>
          <div>Pembina Ekstrakurikuler</div>
          <div style="height:60px;"></div>
          <div style="text-decoration:underline;">${namaPembina}</div>
          <div>${nipPembina}</div>
        </div>
      </div>
      ${showKepsek ? `
      <div style="text-align:center;margin-top:24px;">
        <div>Mengetahui,</div>
        <div>Kepala Sekolah</div>
        <div style="height:60px;"></div>
        <div style="text-decoration:underline;">${namaKepsek}</div>
        <div>${nipKepsek}</div>
      </div>` : ""}
    </div>
  `;
}

// ── FORMAT 1: Daftar Hadir Siswa ───────────────────────────
export function generateDaftarHadirSiswa(params: {
  ekskul: Ekskul;
  bulan: string;        // "Mei 2026"
  tahunAjaran: string;  // "2025/2026"
  siswa: UserProfile[];
  sesi: SesiAbsensi[];
  absensi: Absensi[];
  namaPembina: string;
  nipPembina: string;
  namaPelatih?: string;
}) {
  const { ekskul, bulan, tahunAjaran, siswa, sesi, absensi, namaPembina, nipPembina } = params;

  // Kolom tanggal: ambil hari dari tiap sesi
  const tanggalCols = sesi.map(s => {
    const d = new Date(s.tanggal);
    return d.getDate(); // angka tanggal
  });

  const rows = siswa.map((sw, idx) => {
    const kelasTxt = (sw.kelas as { nama_kelas: string } | undefined)?.nama_kelas ?? "-";
    const cells = sesi.map(s => {
      const rec = absensi.find(a => a.sesi_id === s.id && a.siswa_id === sw.id);
      if (!rec) return `<td style="${tdStyle}"></td>`;
      const sym = rec.status === "hadir" ? "✓" : rec.status === "izin" ? "I" : "A";
      return `<td style="${tdStyle};text-align:center;">${sym}</td>`;
    }).join("");
    return `<tr>
      <td style="${tdStyle};text-align:center;">${idx + 1}</td>
      <td style="${tdStyle};font-weight:${idx < 3 ? "bold" : "normal"};">${sw.nama_lengkap}</td>
      <td style="${tdStyle};text-align:center;">${kelasTxt}</td>
      ${cells}
    </tr>`;
  }).join("");

  const thStyle = "border:1px solid #000;padding:4px 8px;background:#f0f0f0;font-weight:bold;";
  const tdStyle2 = "border:1px solid #000;padding:4px 8px;";

  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>body{font-family:'Times New Roman',serif;font-size:12px;}
    @media print{body{margin:0;padding:16px;}}</style></head><body>
    ${headerDokumen(
      `DAFTAR HADIR SISWA EKSTRAKURIKULER ${ekskul.nama.toUpperCase()}`,
      `BULAN ${bulan.toUpperCase()}`,
      "TAHUN PELAJARAN " + tahunAjaran,
      ""
    )}
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <thead><tr>
        <th style="${thStyle};width:40px;">NO</th>
        <th style="${thStyle};">NAMA</th>
        <th style="${thStyle};width:60px;">KELAS</th>
        ${tanggalCols.map(t => `<th style="${thStyle};width:40px;">${t}</th>`).join("")}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${ttdSection("Namjuari, S.Pd.", "NIP. 196701011992031024", namaPembina, nipPembina, "Klaten", bulan, false)}
    </body></html>
  `.replace(/tdStyle2/g, tdStyle2);
}

// ── FORMAT 2: Jurnal Kegiatan Ekstrakurikuler ──────────────
export function generateJurnalKegiatan(params: {
  ekskul: Ekskul;
  bulan: string;
  semester: string;   // "Semester Genap"
  tahunAjaran: string;
  sesi: SesiAbsensi[];
  namaPembina: string;
  nipPembina: string;
  namaPelatih?: string;
}) {
  const { ekskul, bulan, semester, tahunAjaran, sesi, namaPembina, nipPembina, namaPelatih } = params;

  const hariNames = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const bulanNames = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const rows = sesi.map((s, idx) => {
    const d = new Date(s.tanggal);
    const hariStr = hariNames[d.getDay()];
    const tgl = d.getDate().toString().padStart(2, "0");
    const bln = bulanNames[d.getMonth() + 1];
    const thn = d.getFullYear();
    const namaGuru = s.nama_pelatih_sesi || namaPelatih || ekskul.nama_pelatih || namaPembina;
    return `<tr>
      <td style="border:1px solid #000;padding:6px;text-align:center;">${idx + 1}</td>
      <td style="border:1px solid #000;padding:6px;text-decoration:underline;">${hariStr},&nbsp;${tgl} ${bln} ${thn}</td>
      <td style="border:1px solid #000;padding:6px;text-decoration:underline;">${s.materi ?? ""}</td>
      <td style="border:1px solid #000;padding:6px;text-decoration:underline;">${namaGuru}</td>
      <td style="border:1px solid #000;padding:6px;"></td>
    </tr>`;
  }).join("");

  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>body{font-family:'Times New Roman',serif;font-size:12px;}
    @media print{body{margin:0;padding:16px;}}</style></head><body>
    ${headerDokumen(
      `JURNAL KEGIATAN EKSTRAKURIKULER ${ekskul.nama.toUpperCase()}`,
      `BULAN ${bulan.toUpperCase()}`,
      `${semester.toUpperCase()} TAHUN PELAJARAN ${tahunAjaran}`,
      ""
    )}
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <thead><tr>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:40px;">NO</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:160px;">HARI/TANGGAL</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;">MATERI</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:180px;">NAMA</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:100px;">Tanda tangan</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${ttdSection("Namjuari, S.Pd.", "NIP. 196701011992031024", namaPembina, nipPembina, "Klaten", bulan, true)}
    </body></html>
  `;
}

// ── FORMAT 3: Daftar Hadir Pelatih & Pembina ──────────────
export function generateDaftarHadirPelatih(params: {
  ekskul: Ekskul;
  bulan: string;
  semester: string;
  tahunAjaran: string;
  sesi: SesiAbsensi[];
  namaPembina: string;
  nipPembina: string;
  namaPelatih?: string;
}) {
  const { ekskul, bulan, semester, tahunAjaran, sesi, namaPembina, nipPembina, namaPelatih } = params;

  const hariNames = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const bulanNames = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const rows = sesi.map((s, idx) => {
    const d = new Date(s.tanggal);
    const hariStr = hariNames[d.getDay()];
    const tgl = d.getDate().toString().padStart(2, "0");
    const bln = bulanNames[d.getMonth() + 1];
    const thn = d.getFullYear();
    const pelatihName = s.nama_pelatih_sesi || namaPelatih || ekskul.nama_pelatih;
    
    const namaLines: string[] = [];
    const ttdLines: string[] = [];
    if (pelatihName && s.pelatih_hadir !== false) {
      namaLines.push(`1. ${pelatihName} (Pelatih)`);
      ttdLines.push(`1. .....................`);
    }
    if (s.pembina_hadir !== false || !namaLines.length) {
      const idxNum = namaLines.length + 1;
      namaLines.push(`${idxNum}. ${namaPembina} (Pembina)`);
      ttdLines.push(`${idxNum}. .....................`);
    }

    return `<tr>
      <td style="border:1px solid #000;padding:8px;text-align:center;vertical-align:top;">${idx + 1}</td>
      <td style="border:1px solid #000;padding:8px;text-decoration:underline;vertical-align:top;">${hariStr},&nbsp;${tgl} ${bln} ${thn}</td>
      <td style="border:1px solid #000;padding:8px;vertical-align:top;line-height:1.6;">${namaLines.join("<br/>")}</td>
      <td style="border:1px solid #000;padding:8px;min-height:60px;vertical-align:top;line-height:2.2;">${ttdLines.join("<br/>")}</td>
    </tr>`;
  }).join("");

  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>body{font-family:'Times New Roman',serif;font-size:12px;}
    @media print{body{margin:0;padding:16px;}}</style></head><body>
    ${headerDokumen(
      "DAFTAR HADIR PELATIH DAN PEMBINA",
      `KEGIATAN EKSTRAKURIKULER ${ekskul.nama.toUpperCase()}`,
      `BULAN ${bulan.toUpperCase()}`,
      `${semester.toUpperCase()} TAHUN PELAJARAN ${tahunAjaran}`
    )}
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <thead><tr>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:40px;">NO</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:180px;">TANGGAL</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;">NAMA</th>
        <th style="border:1px solid #000;padding:6px;background:#f0f0f0;width:160px;">TANDA TANGAN</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${ttdSection("Namjuari, S.Pd.", "NIP. 196701011992031024", namaPembina, nipPembina, "Klaten", bulan, false)}
    </body></html>
  `;
}

// ── FORMAT 4: Laporan Kegiatan Naratif (Bulanan / Semester) ──
export function generateLaporanKegiatanPdf(params: {
  ekskul: Ekskul;
  laporan: LaporanKegiatan;
  namaPembina: string;
  nipPembina: string;
}) {
  const { ekskul, laporan, namaPembina, nipPembina } = params;
  const pelatihTxt = laporan.nama_pelatih || ekskul.nama_pelatih || "-";

  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>
      body{font-family:'Times New Roman',serif;font-size:13px;line-height:1.5;color:#000;}
      .section{margin-top:16px;}
      .sec-title{font-weight:bold;border-bottom:1px solid #000;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase;}
      .meta-table{width:100%;margin-bottom:16px;}
      .meta-table td{padding:4px 0;vertical-align:top;}
      .meta-label{width:160px;font-weight:bold;}
      @media print{body{margin:0;padding:24px;}}
    </style></head><body>
    ${headerDokumen(
      "LAPORAN KEGIATAN EKSTRAKURIKULER",
      `EKSTRAKURIKULER ${ekskul.nama.toUpperCase()}`,
      `PERIODE: ${laporan.periode_laporan.toUpperCase()}`,
      `JENIS LAPORAN: ${laporan.jenis_laporan.toUpperCase()}`
    )}
    
    <div style="margin-top:24px;">
      <table class="meta-table">
        <tr><td class="meta-label">Judul Laporan</td><td>: ${laporan.judul}</td></tr>
        <tr><td class="meta-label">Nama Ekskul</td><td>: ${ekskul.nama}</td></tr>
        <tr><td class="meta-label">Pembina Ekstrakurikuler</td><td>: ${namaPembina}</td></tr>
        <tr><td class="meta-label">Nama Pelatih</td><td>: ${pelatihTxt}</td></tr>
        <tr><td class="meta-label">Jumlah Pertemuan</td><td>: ${laporan.jumlah_pertemuan} kali pertemuan</td></tr>
        <tr><td class="meta-label">Rata-rata Kehadiran</td><td>: ${laporan.rata_kehadiran}%</td></tr>
      </table>
    </div>

    <div class="section">
      <div class="sec-title">A. Narasi & Uraian Kegiatan</div>
      <div style="white-space:pre-wrap;text-align:justify;">${laporan.isi_laporan || "Tidak ada uraian kegiatan."}</div>
    </div>

    <div class="section">
      <div class="sec-title">B. Capaian & Prestasi</div>
      <div style="white-space:pre-wrap;text-align:justify;">${laporan.capaian || "Tidak ada catatan capaian khusus."}</div>
    </div>

    <div class="section">
      <div class="sec-title">C. Kendala & Hambatan</div>
      <div style="white-space:pre-wrap;text-align:justify;">${laporan.kendala || "Tidak ada kendala berarti."}</div>
    </div>

    <div class="section">
      <div class="sec-title">D. Rencana Tindak Lanjut</div>
      <div style="white-space:pre-wrap;text-align:justify;">${laporan.rencana_tindak_lanjut || "Melanjutkan program latihan rutin sesuai jadwal."}</div>
    </div>

    ${ttdSection("Namjuari, S.Pd.", "NIP. 196701011992031024", namaPembina, nipPembina, "Klaten", laporan.periode_laporan, true)}
    </body></html>
  `;
}

// ── Util: Buka jendela print ───────────────────────────────
export function printHtml(html: string) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

// ── Util: Download HTML sebagai MS Word (.doc) ─────────────
export function downloadWord(html: string, filename: string) {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; margin-bottom: 10px; }
        th, td { border: 1px solid #000; padding: 4px 8px; font-size: 10pt; }
        th { background-color: #f2f2f2; text-align: center; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;
  const blob = new Blob(["\uFEFF" + content], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".doc") ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Util: Download data sebagai MS Excel (.csv) ────────────
export function exportToExcel(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const csvLines = [
    headers.map(h => `"${String(h ?? "").replace(/"/g, '""')}"`).join(","),
    ...rows.map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
  ];
  const csvContent = csvLines.join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const tdStyle = "border:1px solid #000;padding:4px 8px;";
void tdStyle;
