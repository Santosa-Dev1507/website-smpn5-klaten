import styles from "./spmb.module.css";
import Header from "../components/Header";
import DomisiliSearch from "./DomisiliSearch";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SPMB 2026/2027 - SMPN 5 Klaten",
  description:
    "Seleksi Penerimaan Murid Baru (SPMB) SMP Negeri 5 Klaten Tahun Ajaran 2026/2027. Informasi jalur pendaftaran, jadwal, persyaratan, dan panduan lengkap.",
};

const alasan = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "Sekolah Penggerak",
    desc: "Program unggulan inovasi pembelajaran untuk peningkatan kualitas pendidikan nasional."
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
        <line x1="12" y1="17" x2="12" y2="20"/>
      </svg>
    ),
    title: "Pembelajaran Modern",
    desc: "Pembelajaran mendalam, koding, dan AI untuk mempersiapkan siswa di era digital."
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a8.5 8.5 0 0 1-9 10Z"/>
        <path d="M19 2c-2.26 4.33-5.27 7.14-8 10"/>
      </svg>
    ),
    title: "Sekolah Adiwiyata Nasional",
    desc: "Meraih penghargaan Adiwiyata Nasional dari Kementerian Lingkungan Hidup dan Kehutanan RI."
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    title: "Akreditasi A",
    desc: "Menjamin kualitas pendidikan dan fasilitas terbaik untuk proses belajar siswa."
  },
];

const jalurIcons = [
  <svg key="dom" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12l9-8 9 8" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="afr" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11v6M9 14h6" stroke="#944535" strokeWidth="2" strokeLinecap="round"/><rect x="8" y="2" width="8" height="4" rx="1" stroke="#944535" strokeWidth="2"/></svg>,
  <svg key="prs" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="#944535" strokeWidth="2" strokeLinejoin="round"/></svg>,
  <svg key="mut" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="#944535" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

const jalur = [
  {
    title: "Jalur Domisili",
    persen: "40%",
    kuota: 102,
    desc: "Diperuntukkan bagi calon murid yang berdomisili di wilayah yang ditetapkan oleh Bupati Klaten.",
    dokumen: [
      "Kartu Keluarga (KK) — diterbitkan min. 1 tahun sebelum tanggal pendaftaran",
      "Akta Kelahiran",
      "Ijazah / Surat Keterangan Lulus (SKL) SD atau sederajat",
      "Pas foto 3×4 berseragam sekolah, background warna bebas",
    ],
    catatanKhusus: [
      "KK dikecualikan jika perubahan elemen data bukan perpindahan domisili",
      "Hubungan dalam KK: anak kandung kepala keluarga, atau dalam satu KK terdapat orangtua dan anak",
      "Jika kedua orangtua meninggal, KK dapat dikecualikan dengan melampirkan akta kematian",
      "KK orangtua di luar Kab. Klaten + lulusan SD/MI di Klaten: wajib surat keterangan dari Dinas Pendidikan",
    ],
    seleksi: "Jarak terdekat → Usia tertua → Waktu pendaftaran SPMB",
  },
  {
    title: "Jalur Afirmasi",
    persen: "20%",
    kuota: 51,
    desc: "Ditujukan bagi calon murid dari keluarga ekonomi tidak mampu dan/atau penyandang disabilitas yang berdomisili dalam wilayah yang ditetapkan.",
    dokumen: [
      "Kartu Keluarga (KK)",
      "Akta Kelahiran",
      "Ijazah / Surat Keterangan Lulus (SKL) SD atau sederajat",
      "Pas foto 3×4 berseragam sekolah, background warna bebas",
      "KKS (Kartu Keluarga Sejahtera) dan/atau KIP (Kartu Indonesia Pintar) — KIP harus terverifikasi di aplikasi SiPintar",
      "Surat pernyataan orangtua/wali bersedia diproses hukum jika terbukti memalsukan dokumen",
    ],
    catatanKhusus: [
      "Penyandang disabilitas: surat keterangan dari DINSOSP3AKB yang memuat kategori & kriteria disabilitas yang dapat diterima di sekolah umum",
      "Penyandang disabilitas: surat keterangan hasil assessment dari jenjang pendidikan sebelumnya",
      "Penyandang disabilitas: surat keterangan dari dokter / dokter spesialis",
    ],
    seleksi: "Usia tertua → Waktu pendaftaran SPMB",
  },
  {
    title: "Jalur Prestasi",
    persen: "35%",
    kuota: 90,
    desc: "Ditujukan bagi calon murid yang memiliki prestasi akademik maupun non-akademik.",
    dokumen: [
      "Kartu Keluarga (KK)",
      "Akta Kelahiran",
      "Ijazah dan Transkrip Nilai — untuk lulusan sebelum TA 2025/2026",
      "Surat Keterangan Lulus (SKL) — untuk lulusan TA 2025/2026",
      "Pas foto 3×4 berseragam sekolah, background warna bebas",
      "Surat Keterangan Nilai 2 Mata Pelajaran TA 2025/2026 (SD Negeri/Swasta Kab. Klaten) — atau Nilai 2 Mapel dari Transkrip Nilai (lulusan SD luar Kab. Klaten & Madrasah sederajat)",
      "SHTKA — bagi lulusan tahun ajaran 2025/2026",
      "Piagam/sertifikat penghargaan lomba, bagi yang memiliki — diterbitkan maks. 3 tahun dari tanggal pendaftaran",
    ],
    catatanKhusus: [
      "Hanya 1 (satu) piagam dengan nilai tertinggi yang diperhitungkan jika memiliki lebih dari satu",
      "Piagam Akademik: OSN, SISPRES, LCC, FTBI, Dokter Kecil, Bercerita, KSM, AKSIOMA, JSIT",
      "Piagam Olahraga: POPDA, O2SN, Marching Band, PORSEMA, semua cabor KONI tingkat daerah/provinsi/nasional",
      "Piagam Kesenian & Keagamaan: FLS3N, MAPSI, MAPAK, JSM, Paduan Suara/Vocal Group, FLSDAK, FKP",
      "Piagam Ketrampilan: Jambore/Kemah Bakti, PMR, POCIL Klaten, Robotik",
    ],
    seleksi: "Nilai akhir tertinggi → Usia tertua → Waktu pendaftaran SPMB",
  },
  {
    title: "Jalur Mutasi",
    persen: "5%",
    kuota: 13,
    desc: "Ditujukan bagi calon murid yang mengikuti perpindahan tugas orangtua/wali, atau anak guru yang mendaftar di sekolah tempat orangtua mengajar.",
    dokumen: [
      "Kartu Keluarga (KK)",
      "Akta Kelahiran",
      "SKL / Ijazah SD atau sederajat",
      "Pas foto 3×4 berseragam sekolah, background warna bebas",
    ],
    catatanKhusus: [
      "Orangtua pindah tugas: surat keterangan dari instansi/lembaga/kantor/perusahaan — diterbitkan maks. 1 tahun sebelum pendaftaran",
      "Orangtua pindah tugas: surat keterangan dari Dinas Pendidikan",
      "Anak Guru: surat keputusan dari Kepala Satuan Pendidikan tempat orangtua bertugas",
      "Anak Guru: surat keterangan dari Dinas Pendidikan",
    ],
    seleksi: "Usia tertua → Waktu pendaftaran SPMB",
  },
];

const jadwal = [
  { kegiatan: "Pendaftaran", tanggal: "29 Juni – 2 Juli 2026", waktu: "Mulai Senin 29 Juni Pukul 07.00 WIB · Penutupan Kamis 2 Juli Pukul 12.00 WIB" },
  { kegiatan: "Analisis & Penyusunan Peringkat", tanggal: "2 – 3 Juli 2026", waktu: "Mulai 2 Juli Pukul 12.00 WIB s.d. 3 Juli 2026 Pukul 12.00 WIB" },
  { kegiatan: "Pengumuman Hasil", tanggal: "4 Juli 2026", waktu: "Pukul 07.00 WIB" },
  { kegiatan: "Daftar Ulang", tanggal: "6 – 7 Juli 2026", waktu: "07.00 – 14.00 WIB" },
  { kegiatan: "Hari Pertama Masuk Sekolah", tanggal: "13 Juli 2026", waktu: "" },
];

const syarat = [
  "Berusia maksimal 15 tahun per 1 Juli 2026 (kecuali bagi calon peserta didik penyandang disabilitas di sekolah yang menyelenggarakan layanan inklusi).",
  "Telah menyelesaikan kelas 6 (enam) SD atau bentuk lain yang sederajat, dibuktikan dengan Ijazah atau Surat Keterangan Lulus (SKL).",
  "Pas foto terbaru ukuran 3x4 dengan pakaian seragam sekolah (background warna bebas).",
  "Semua berkas di-scan dengan jelas (maksimal 1 MB per file) dalam format PDF atau JPG untuk diunggah pada portal online.",
];

const rekapPrev = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z"/>
      </svg>
    ),
    jalur: "Jalur Prestasi",
    info: "Nilai terendah diterima:",
    nilai: "262,45",
    satuan: ""
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    jalur: "Jalur Domisili",
    info: "Jarak terjauh diterima:",
    nilai: "1,5 KM",
    satuan: "(Desa Ngalas)"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
    jalur: "Jalur Afirmasi",
    info: "Usia termuda diterima:",
    nilai: "11 th 10 bl",
    satuan: "19 hr"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <path d="M9 14h6"/><path d="M9 18h6"/><path d="M9 10h3"/>
      </svg>
    ),
    jalur: "Jalur Mutasi",
    info: "Jumlah siswa diterima:",
    nilai: "2",
    satuan: "Siswa"
  },
];

export default function SpmbPage() {
  return (
    <main className={styles.main}>
      <Header activePage="SPMB" />

      {/* HERO */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div className={styles.heroBreadcrumb}><a href="/">Beranda</a> / SPMB</div>
          <div className={styles.heroTagline}>Penerimaan Murid Baru 2026/2027</div>
          <h1>
            <span className={styles.heroWord}>Seleksi</span>{" "}
            <span className={styles.heroWord}>Penerimaan</span>{" "}
            <span className={`${styles.heroWord} ${styles.highlight}`}>Murid Baru</span>
          </h1>
          <p>
            Selamat datang di laman resmi SPMB SMP Negeri 5 Klaten Tahun Ajaran 2026/2027.
            Kami mengundang putra-putri terbaik untuk bergabung menjadi generasi <strong>JUARA</strong>.
          </p>
          <div className={styles.heroCtas}>
            <a href="#daftar" className={styles.btnDaftar}>Portal Daftar Online →</a>
            <a href="#jalur" className={styles.btnDaftarOutline}>Lihat Jalur</a>
            <a href="#jadwal" className={styles.btnDaftarOutline}>Cek Jadwal</a>
          </div>
        </div>
        <div className={styles.pageHeroRight}>
          <div className={styles.heroStatsCard}>
            <div className={styles.heroStat}>
              <strong>256</strong>
              <span>Kuota Siswa (8 Kelas)</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>4</strong>
              <span>Jalur Masuk</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>2026</strong>
              <span>Tahun Ajaran</span>
            </div>
          </div>
          <div className={styles.heroNotice}>
            <span className={styles.heroNoticeDot} />
            <span>Pendaftaran Online dibuka tanggal 29 Juni – 2 Juli 2026</span>
          </div>
        </div>
      </section>

      {/* GRATIS BANNER */}
      <section className={styles.gratisBanner}>
        <div className={styles.gratisBannerInner}>
          <div className={styles.gratisAvatarWrap}>
            <Image src="/panitia-spmb.png" alt="Panitia SPMB SMPN 5 Klaten" width={400} height={450} priority className={styles.gratisAvatarImg} />
          </div>
          <div className={styles.gratisContent}>
            <h3>SPMB SMPN 5 Klaten <span>GRATIS</span>,<br />tanpa pungutan apapun.</h3>
            <p>
              Seluruh proses Seleksi Penerimaan Murid Baru (SPMB) di SMPN 5 Klaten tidak dipungut biaya
              dalam bentuk apapun. Jika ada pihak yang meminta pembayaran atas nama sekolah,
              harap segera laporkan kepada panitia.
            </p>
            <div className={styles.gratisMeta}>
              <a
                href="https://wa.me/62895377815555"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.gratisStampLink}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginRight: '4px' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.42 1.461 5.432.003 9.85-4.416 9.854-9.852.002-2.632-1.02-5.107-2.88-6.97C17.18 1.93 14.71 1.91 12.008 1.91c-5.435 0-9.856 4.417-9.86 9.854-.001 1.942.508 3.84 1.474 5.437L2.682 20.58l3.965-.826zm11.236-7.393c-.278-.14-.1.64-.1.64s-.266-.13-.506-.25c-1.208-.6-1.59-.757-1.87-.757-.282 0-.464.14-.77.518-.306.376-.59.734-.73.874-.138.14-.277.16-.554.02-.278-.14-1.173-.43-2.235-1.38-.824-.738-1.38-1.65-1.54-1.93-.16-.28-.018-.43.12-.57.125-.127.278-.328.417-.49.14-.165.185-.28.278-.465.09-.185.046-.347-.023-.487-.069-.14-.625-1.507-.856-2.07-.225-.55-.473-.47-.648-.48-.17-.008-.36-.01-.55-.01-.19 0-.5.07-.76.357-.26.29-1 .978-1 2.387 0 1.41 1.02 2.77 1.16 2.96.14.19 2.01 3.07 4.87 4.31.68.297 1.21.474 1.625.605.683.217 1.3.187 1.79.114.547-.08 1.685-.69 1.92-1.357.235-.668.235-1.24.165-1.36-.07-.12-.257-.185-.536-.327z"/>
                </svg>
                Hubungi: 0895-3778-15555
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ALASAN */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Keunggulan Kami</div>
          <h2>4 Alasan Memilih <span className={styles.highlight}>SMPN 5 Klaten</span></h2>
          <p>Keunggulan dan prestasi yang menjadikan kami pilihan terbaik untuk putra-putri Anda.</p>
        </div>
        <div className={styles.jalurGrid}>
          {alasan.map((a, i) => (
            <div key={i} className={styles.jalurCard}>
              <div className={styles.jalurIconAlasan}>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JADWAL + SYARAT */}
      <section className={styles.section} id="jadwal">
        <div className={styles.twoCol}>
          {/* JADWAL */}
          <div>
            <div className={styles.badge}>Jadwal Pelaksanaan</div>
            <h2 className={styles.colTitle}>Jadwal <span className={styles.highlight}>SPMB 2026</span></h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kegiatan</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.map((j, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{j.kegiatan}</td>
                      <td><span className={styles.dateBadge}>{j.tanggal}</span></td>
                      <td>{j.waktu || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* JALUR PENDAFTARAN */}
      <section className={styles.sectionAlt} id="jalur">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Jalur Pendaftaran</div>
          <h2>Pilih Jalur yang <span className={styles.highlight}>Sesuai</span></h2>
          <p>Tersedia 4 jalur penerimaan resmi sesuai regulasi Dinas Pendidikan Kabupaten Klaten.</p>
        </div>
        <div className={styles.jalurGrid}>
          {jalur.map((j, i) => (
            <div key={i} className={styles.jalurCard}>

              {/* Header: icon + title + kuota */}
              <div className={styles.jalurCardHeader}>
                <div className={styles.jalurIcon}>{jalurIcons[i]}</div>
                <div className={styles.jalurCardTitleWrap}>
                  <h3>{j.title}</h3>
                  <div className={styles.jalurKuota}>
                    <strong>Kuota {j.kuota} Siswa</strong>
                  </div>
                </div>
              </div>

              <p className={styles.jalurDesc}>{j.desc}</p>

              {/* Dokumen Wajib */}
              <div className={styles.jalurSectionLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dokumen yang Diperlukan
              </div>
              <ul className={styles.jalurDocList}>
                {j.dokumen.map((d, di) => (
                  <li key={di} className={styles.jalurDocItem}>
                    <span className={styles.docCheck} aria-hidden="true">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              {/* Catatan Khusus — collapsible */}
              {j.catatanKhusus.length > 0 && (
                <>
                  <div className={styles.jalurDivider} />
                  <details className={styles.jalurCatatanDetails}>
                    <summary className={styles.jalurCatatanSummary}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Catatan Khusus
                      <span className={styles.jalurCatatanCount}>Lihat Detail</span>
                    </summary>
                    <ul className={styles.jalurNoteList}>
                      {j.catatanKhusus.map((c, ci) => (
                        <li key={ci} className={styles.jalurNoteItem}>
                          <span className={styles.noteArrow} aria-hidden="true">→</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              )}

              {/* Dasar Seleksi */}
              <div className={styles.jalurSeleksi}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Dasar Seleksi:</span> {j.seleksi}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CEK DOMISILI RW */}
      <section className={styles.section} id="cek-domisili">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Jalur Domisili 2026/2027</div>
          <h2>Cek Jarak <span className={styles.highlight}>RW Anda</span></h2>
          <p>
            Hal baru SPMB 2026/2027 — seleksi Jalur Domisili kini berdasarkan <strong>jarak RW</strong> dari masing-masing desa ke SMPN 5 Klaten.
            Pilih desa dan nomor RW Anda untuk mengetahui jarak resmi.
          </p>
        </div>
        <DomisiliSearch />
      </section>

      {/* REKAP SPMB 2025/2026 */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Referensi Tahun Lalu</div>
          <h2>Rekap SPMB <span className={styles.highlight}>2025/2026</span></h2>
          <p>Data penerimaan tahun ajaran sebelumnya sebagai gambaran dan referensi Anda.</p>
        </div>
        <div className={styles.rekapGrid}>
          {rekapPrev.map((r, i) => (
            <div key={i} className={styles.rekapCard}>
              <div className={styles.rekapIcon}>{r.icon}</div>
              <div className={styles.rekapJalur}>{r.jalur}</div>
              <div className={styles.rekapInfo}>{r.info}</div>
              <div className={styles.rekapNilai}>{r.nilai}</div>
              {r.satuan && <div className={styles.rekapSatuan}>{r.satuan}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* REGULASI LENGKAP ACCORDION */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Buku Panduan</div>
          <h2>Detail Persyaratan & <span className={styles.highlight}>Regulasi SPMB</span></h2>
          <p>Informasi teknis dan detail lengkap mengenai tata cara pendaftaran, dokumen, dan kriteria seleksi.</p>
        </div>
        <div className={styles.regulasiContainer}>
          <details className={styles.accordion}>
            <summary>Persyaratan Usia & Pengecualian</summary>
            <div className={styles.accordionContent}>
              <p>Calon Murid kelas 7 (tujuh) SMP harus memenuhi persyaratan yaitu berusia paling tinggi 15 (lima belas) tahun pada tanggal 1 Juli tahun 2026.</p>
              <h3>Persyaratan usia dibuktikan dengan:</h3>
              <ul>
                <li>Akta kelahiran atau surat keterangan lahir yang dikeluarkan oleh pihak yang berwenang dan dilegalisir oleh Lurah/Kepala Desa.</li>
              </ul>
              <h3>Persyaratan usia dikecualikan untuk sekolah dengan kriteria:</h3>
              <ul>
                <li>Menyelenggarakan pendidikan khusus</li>
                <li>Menyelenggarakan pendidikan layanan khusus</li>
                <li>Telah menyelesaikan kelas 6 (enam) SD atau bentuk lain yang sederajat</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Dokumen yang Perlu Disiapkan</summary>
            <div className={styles.accordionContent}>
              <h3>Dokumen Pribadi:</h3>
              <ul>
                <li>Akta kelahiran (asli dan fotokopi)</li>
                <li>Kartu Keluarga (diterbitkan minimal 1 tahun sebelum pendaftaran)</li>
                <li>Pas foto terbaru ukuran 3x4</li>
                <li>Ijazah/SKL SD atau sederajat</li>
              </ul>
              <h3>Dokumen Tambahan (Sesuai Jalur Pendaftaran):</h3>
              <ul>
                <li><strong>Jalur Prestasi:</strong> Piagam/sertifikat kejuaraan (maksimal 3 tahun terakhir)</li>
                <li><strong>Jalur Afirmasi:</strong> Surat keterangan tidak mampu atau Kartu Indonesia Pintar (KIP)</li>
                <li><strong>Jalur Mutasi:</strong> Surat keterangan pindah tugas orang tua/wali</li>
              </ul>
              <p><strong>Catatan Penting:</strong> Semua dokumen harus discan dengan jelas maksimal 1 MB dalam format PDF atau JPG.</p>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Ketentuan Detail: Jalur Domisili & Afirmasi</summary>
            <div className={styles.accordionContent}>
              <h3>Jalur Domisili (40%):</h3>
              <ul>
                <li>KK yang diterbitkan paling singkat 1 (satu) tahun sebelum tanggal pendaftaran.</li>
                <li>KK tersebut dikecualikan dalam hal perubahan elemen data selain perpindahan domisili.</li>
                <li>Hubungan dengan kepala keluarga sebagai anak atau dalam satu KK terdapat orangtua dan anak.</li>
                <li>Dikecualikan jika kedua orang tua meninggal dan dibuktikan dengan akta kematian.</li>
              </ul>
              <p>Jika terjadi persamaan jarak, seleksi berdasarkan: (1) Usia tertua; (2) Nilai SKL/Ijazah; (3) Waktu pendaftaran.</p>
              <h3>Jalur Afirmasi (20%):</h3>
              <ul>
                <li>Berdomisili dalam wilayah yang ditetapkan, berasal dari keluarga ekonomi tidak mampu (KKS/KIP).</li>
                <li>Surat pernyataan dari orang tua/wali yang bersedia diproses hukum jika memalsukan bukti.</li>
                <li>Penyandang disabilitas dibuktikan dengan surat keterangan dari DINSOSP3AKB.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Ketentuan Detail: Jalur Prestasi & Mutasi</summary>
            <div className={styles.accordionContent}>
              <h3>Jalur Prestasi (35%):</h3>
              <ul>
                <li>Nilai hasil wisuda/kelulusan SD berupa SHTKA (Surat Hasil Test Kemampuan Akademik) untuk tahun ajaran 2025/2026.</li>
                <li>Surat Keterangan Nilai 2 Mata Pelajaran (SD Negeri/Swasta Kab. Klaten) atau Nilai 2 Mapel dari Transkrip Nilai (lulusan SD luar Kab. Klaten & Madrasah).</li>
                <li>Piagam penghargaan akademik/non-akademik (diterbitkan maksimal 3 tahun terakhir). Hanya 1 piagam tertinggi yang dinilai.</li>
                <li><strong>Piagam Akademik:</strong> OSN, SISPRES, LCC, Lomba Tunas Bahasa Ibu, Dokter Kecil, Bercerita.</li>
                <li><strong>Piagam Olahraga:</strong> POPDA, O2SN, semua cabor KONI tingkat daerah/nasional, Marching Band.</li>
                <li><strong>Piagam Kesenian & Keagamaan:</strong> FLS3N, MAPSI, JSM, Paduan Suara, FLSDAK, FKP.</li>
                <li><strong>Piagam Ketrampilan:</strong> Jambore/Kemah Bakti, PMR, POCIL Klaten, Robotik.</li>
              </ul>
              <h3>Jalur Mutasi (5%):</h3>
              <ul>
                <li>Orang tua pindah tugas yang masih berdomisili di luar daerah, dibuktikan dengan surat keterangan instansi dan Dinas Pendidikan.</li>
                <li>Anak Guru yang mendaftar di tempat orang tuanya bertugas.</li>
                <li>Anak Guru yang mendaftar di sekolah tempat orang tua mengajar dibuktikan dengan surat keterangan dari Dinas Pendidikan.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Pelaksanaan, Pengumuman & Daftar Ulang</summary>
            <div className={styles.accordionContent}>
              <h3>Sistem Online:</h3>
              <ul>
                <li>Calon Murid dapat memilih 2 (dua) sekolah untuk 1 (satu) jalur pendaftaran dalam 1 wilayah domisili.</li>
                <li>Selain jalur domisili, dapat mendaftar melalui jalur afirmasi atau prestasi.</li>
                <li>Pendaftar yang tidak masuk peringkat di pilihan 1/2 dapat mendaftar ke SMP lain selama masih dalam waktu pendaftaran.</li>
                <li>Bagi yang tidak bisa online dari rumah, panitia sekolah siap membantu proses entri data.</li>
              </ul>
              <h3>Pengumuman & Daftar Ulang:</h3>
              <ul>
                <li>Satuan Pendidikan wajib membuat jurnal harian rekap peringkat nilai pendaftar.</li>
                <li>Calon murid yang diterima wajib mendaftar ulang sesuai jadwal dengan membawa persyaratan asli.</li>
                <li>Pendaftar yang tidak mendaftar ulang pada waktunya dinyatakan gugur.</li>
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} id="daftar">
        <div className={styles.ctaInner}>
          <h2>Siap Bergabung dengan Keluarga <span className={styles.highlightPeach}>JUARA?</span></h2>
          <p>Pendaftaran dilakukan secara online melalui portal resmi Dinas Pendidikan Klaten. Pantau terus laman ini untuk informasi jadwal terbaru.</p>
          <div className={styles.ctaActions}>
            <a href="#" className={styles.btnCtaPrimary}>Portal Pendaftaran Online</a>
            <a href="https://wa.me/6289537781555" target="_blank" rel="noopener noreferrer" className={styles.btnCtaSecondary}>Tanya via WhatsApp</a>
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
