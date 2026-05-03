import styles from "./spmb.module.css";
import Header from "../components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPMB 2026/2027 - SMPN 5 Klaten",
  description:
    "Seleksi Penerimaan Murid Baru (SPMB) SMP Negeri 5 Klaten. Informasi jalur pendaftaran, jadwal, dan persyaratan lengkap.",
};

const jalur = [
  {
    icon: "🏠",
    title: "Jalur Zonasi",
    desc: "Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi yang ditetapkan.",
    details: ["Minimal 50% dari daya tampung sekolah", "Berdasarkan jarak tempat tinggal ke sekolah"],
    color: "#944535",
  },
  {
    icon: "🏆",
    title: "Jalur Prestasi",
    desc: "Bagi calon peserta didik yang memiliki prestasi akademik maupun non-akademik.",
    details: ["Nilai rapor 5 semester terakhir", "Sertifikat kejuaraan/perlombaan"],
    color: "#C0622F",
  },
  {
    icon: "🤝",
    title: "Jalur Afirmasi",
    desc: "Diperuntukkan bagi calon peserta didik dari keluarga ekonomi tidak mampu dan penyandang disabilitas.",
    details: ["Surat Keterangan Tidak Mampu (SKTM)", "Kartu Program Keluarga Harapan (PKH)"],
    color: "#944535",
  },
  {
    icon: "📋",
    title: "Jalur Perpindahan Tugas",
    desc: "Bagi calon peserta didik yang mengikuti perpindahan tugas orang tua/wali.",
    details: ["Surat tugas resmi dari instansi", "Berlaku untuk 1 tahun berjalan"],
    color: "#C0622F",
  },
];

const jadwal = [
  { kegiatan: "Sosialisasi SPMB", tanggal: "Mei 2025" },
  { kegiatan: "Pendaftaran Online", tanggal: "Juni 2025 (Minggu ke-3)" },
  { kegiatan: "Verifikasi Berkas", tanggal: "Juni 2025 (Minggu ke-4)" },
  { kegiatan: "Pengumuman", tanggal: "Juli 2025 (Awal)" },
  { kegiatan: "Daftar Ulang", tanggal: "Juli 2025 (Minggu ke-1)" },
];

const syarat = [
  "Berusia paling tinggi 15 (lima belas) tahun pada tanggal 1 Juli tahun berjalan.",
  "Memiliki ijazah SD/sederajat atau dokumen lain yang menjelaskan telah menyelesaikan kelas 6 SD.",
  "Akta Kelahiran / Surat Keterangan Lahir.",
  "Kartu Keluarga (KK) yang diterbitkan paling singkat 1 tahun sebelum tanggal pendaftaran.",
];

export default function SpmbPage() {
  return (
    <main className={styles.main}>

      <Header activePage="SPMB" />

      {/* PAGE HERO */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div className={styles.heroBreadcrumb}><a href="/">Beranda</a> / SPMB</div>
          <h1>Seleksi Penerimaan Murid Baru <span className={styles.highlight}>(SPMB)</span></h1>
          <p>
            Selamat datang di laman resmi SPMB SMP Negeri 5 Klaten. Kami mengundang
            putra-putri terbaik bangsa untuk bergabung menjadi bagian dari keluarga
            besar sekolah kami.
          </p>
          <a href="#daftar" className={styles.btnDaftar}>Daftar Sekarang →</a>
        </div>
        <div className={styles.pageHeroDecor}>
          <div className={styles.decCircle1}></div>
          <div className={styles.decCircle2}></div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>256</strong><span>Kuota Siswa</span></div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}><strong>4</strong><span>Jalur Masuk</span></div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}><strong>2026</strong><span>Tahun Ajaran</span></div>
          </div>
        </div>
      </section>

      {/* JALUR PENDAFTARAN */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Jalur Pendaftaran</div>
          <h2>Pilih Jalur yang <span className={styles.highlight}>Sesuai</span></h2>
          <p>Tersedia 4 jalur penerimaan resmi sesuai regulasi Dinas Pendidikan Kabupaten Klaten.</p>
        </div>
        <div className={styles.jalurGrid}>
          {jalur.map((j, i) => (
            <div key={i} className={styles.jalurCard}>
              <div className={styles.jalurIcon}>{j.icon}</div>
              <h3>{j.title}</h3>
              <p>{j.desc}</p>
              <ul className={styles.jalurDetails}>
                {j.details.map((d, di) => (
                  <li key={di}><span className={styles.checkmark}>✓</span>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* JADWAL + SYARAT (2 KOLOM) */}
      <section className={styles.sectionAlt}>
        <div className={styles.twoCol}>

          {/* JADWAL */}
          <div>
            <div className={styles.badge}>Jadwal Pelaksanaan</div>
            <h2 className={styles.colTitle}>Jadwal <span className={styles.highlight}>SPMB 2026</span></h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Kegiatan</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.map((j, i) => (
                    <tr key={i}>
                      <td>{j.kegiatan}</td>
                      <td><span className={styles.dateBadge}>{j.tanggal}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.tableNote}>
              ⚠️ Jadwal dapat berubah sewaktu-waktu mengikuti kebijakan Dinas Pendidikan Kabupaten Klaten.
            </p>
          </div>

          {/* SYARAT */}
          <div>
            <div className={styles.badge}>Persyaratan</div>
            <h2 className={styles.colTitle}>Persyaratan <span className={styles.highlight}>Umum</span></h2>
            <div className={styles.syaratList}>
              {syarat.map((s, i) => (
                <div key={i} className={styles.syaratItem}>
                  <div className={styles.syaratNumber}>{i + 1}</div>
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA DAFTAR */}
      <section className={styles.ctaSection} id="daftar">
        <div className={styles.ctaInner}>
          <h2>Siap Bergabung dengan Keluarga <span className={styles.highlightPeach}>JUARA?</span></h2>
          <p>Pendaftaran dilakukan secara online melalui portal resmi. Siapkan berkas Anda dan daftar sekarang sebelum kuota habis.</p>
          <div className={styles.ctaActions}>
            <a href="#" className={styles.btnCtaPrimary}>Daftar Online Sekarang</a>
            <a href="/#kontak" className={styles.btnCtaSecondary}>Hubungi Kami</a>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className={styles.footerMini}>
        <div className={styles.footerMiniInner}>
          <p>© 2026 SMPN 5 Klaten — Tempat Tumbuhnya Generasi JUARA.</p>
          <a href="/">← Kembali ke Beranda</a>
        </div>
      </footer>

    </main>
  );
}
