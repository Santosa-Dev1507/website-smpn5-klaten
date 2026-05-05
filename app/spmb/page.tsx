import styles from "./spmb.module.css";
import Header from "../components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPMB 2025/2026 - SMPN 5 Klaten",
  description:
    "Seleksi Penerimaan Murid Baru (SPMB) SMP Negeri 5 Klaten Tahun Ajaran 2025/2026. Informasi jalur pendaftaran, jadwal, dan persyaratan lengkap.",
};

const alasan = [
  { icon: "🌟", title: "Sekolah Penggerak", desc: "Periode 2022–2025 dengan inovasi pembelajaran untuk peningkatan kualitas pendidikan." },
  { icon: "💻", title: "Pembelajaran Modern", desc: "Pembelajaran mendalam, koding, dan AI untuk mempersiapkan siswa di era digital." },
  { icon: "🌿", title: "Sekolah Adiwiyata", desc: "Berkomitmen pada pendidikan lingkungan hidup dan pembangunan berkelanjutan tingkat provinsi." },
  { icon: "A", title: "Akreditasi A", desc: "Menjamin kualitas pendidikan dan fasilitas terbaik untuk proses belajar siswa." },
];

const halBaru = [
  { no: 1, old: "Jalur Zonasi", new: "Berubah nama menjadi Jalur Domisili" },
  { no: 2, old: "Zonasi 50%\nAfirmasi 15%\nPrestasi 30%\nPerpindahan Ortu 5%", new: "Domisili 40%\nAfirmasi 20%\nPrestasi 35%\nMutasi 5%" },
  { no: 3, old: "Tanggal KK dikeluarkan tidak ada batas", new: "KK diterbitkan paling singkat 1 (satu) tahun sebelum pendaftaran" },
  { no: 4, old: "Piagam/sertifikat maksimal 1 tahun", new: "Piagam/sertifikat maksimal 3 (tiga) tahun dari tanggal pendaftaran" },
];

const jalur = [
  {
    icon: "🏠",
    title: "Jalur Domisili (40%)",
    desc: "Bagi calon murid yang berdomisili di dalam wilayah yang ditetapkan.",
    details: ["KK terbit minimal 1 tahun", "Akta Kelahiran & SKL/Ijazah", "Seleksi: Usia tertua, Nilai SKL, Waktu daftar"],
    color: "#944535",
  },
  {
    icon: "🏆",
    title: "Jalur Prestasi (35%)",
    desc: "Bagi calon murid dengan prestasi akademik maupun non-akademik.",
    details: ["Rata-rata rapor 5 semester (Mat, BI, IPA)", "Sertifikat kejuaraan maks 3 tahun", "Hanya 1 piagam tertinggi yang dinilai"],
    color: "#C0622F",
  },
  {
    icon: "🤝",
    title: "Jalur Afirmasi (20%)",
    desc: "Bagi pendaftar dari keluarga tidak mampu (KIP/KKS) & penyandang disabilitas.",
    details: ["Kartu PKH / KIP / Surat DISSOSP3APPKB", "Surat pernyataan tanggung jawab ortu", "Seleksi: Usia, Nilai, Waktu daftar"],
    color: "#944535",
  },
  {
    icon: "📋",
    title: "Jalur Mutasi (5%)",
    desc: "Bagi calon murid yang mengikuti perpindahan tugas ortu/wali atau anak guru.",
    details: ["Surat keterangan pindah tugas instansi", "Anak guru mendaftar di sekolah ortu", "Seleksi: Usia, Nilai, Waktu daftar"],
    color: "#C0622F",
  },
];

const jadwal = [
  { kegiatan: "Pendaftaran Online", tanggal: "16 - 19 Juni 2025 (Tutup 12.00)" },
  { kegiatan: "Analisis & Peringkat", tanggal: "19 Juni 2025 (Pukul 18.00)" },
  { kegiatan: "Pengumuman", tanggal: "20 Juni 2025 (Pukul 00.00)" },
  { kegiatan: "Daftar Ulang", tanggal: "23 - 24 Juni 2025 (07.00 - 14.00)" },
  { kegiatan: "Hari Pertama Masuk", tanggal: "14 Juli 2025" },
];

const syarat = [
  "Berusia maksimal 15 tahun per 1 Juli 2025 (pengecualian bagi difabel).",
  "Memiliki Ijazah/SKL dari satuan pendidikan sebelumnya.",
  "Akta Kelahiran asli dan fotokopi.",
  "Kartu Keluarga (KK) terbit minimal 1 tahun sebelum pendaftaran.",
  "Pas foto terbaru ukuran 3x4.",
  "Semua dokumen di-scan jelas maks 1 MB (PDF/JPG) untuk upload online.",
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
            Selamat datang di laman resmi SPMB SMP Negeri 5 Klaten Tahun Ajaran 2025/2026. Kami mengundang
            putra-putri terbaik untuk bergabung menjadi generasi JUARA.
          </p>
          <a href="#daftar" className={styles.btnDaftar}>Panduan & Pendaftaran →</a>
        </div>
        <div className={styles.pageHeroDecor}>
          <div className={styles.decCircle1}></div>
          <div className={styles.decCircle2}></div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>256</strong><span>Kuota Siswa (8 Kelas)</span></div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}><strong>4</strong><span>Jalur Masuk</span></div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}><strong>2025</strong><span>Tahun Ajaran</span></div>
          </div>
        </div>
      </section>

      {/* 4 ALASAN MEMILIH */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Keunggulan</div>
          <h2>4 Alasan Memilih <span className={styles.highlight}>SMPN 5 Klaten</span></h2>
          <p>Keunggulan dan prestasi yang menjadikan kami pilihan terbaik untuk pendidikan putra-putri Anda.</p>
        </div>
        <div className={styles.jalurGrid}>
          {alasan.map((a, i) => (
            <div key={i} className={styles.jalurCard}>
              <div className={styles.jalurIcon}>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERUBAHAN BARU (TABLE) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Informasi Penting</div>
          <h2>4 Hal Baru dalam <span className={styles.highlight}>SPMB 2025/2026</span></h2>
          <p>Perubahan penting dalam sistem penerimaan murid baru tahun ini yang perlu Anda ketahui.</p>
        </div>
        <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }} className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>No</th>
                <th>PPDB 2024/2025</th>
                <th>SPMB 2025/2026</th>
              </tr>
            </thead>
            <tbody>
              {halBaru.map((h, i) => (
                <tr key={i}>
                  <td>{h.no}</td>
                  <td style={{ whiteSpace: "pre-line" }}>{h.old}</td>
                  <td style={{ whiteSpace: "pre-line", fontWeight: "600", color: "#944535" }}>{h.new}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      <section className={styles.section}>
        <div className={styles.twoCol}>

          {/* JADWAL */}
          <div>
            <div className={styles.badge}>Jadwal Pelaksanaan</div>
            <h2 className={styles.colTitle}>Jadwal <span className={styles.highlight}>SPMB 2025</span></h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Kegiatan</th>
                    <th>Tanggal / Waktu</th>
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
              Pelaksanaan pendaftaran dilakukan secara <strong>online</strong>. Bagi calon murid yang tidak bisa mendaftar dari rumah, dapat langsung menyerahkan berkas ke sekolah untuk dibantu oleh panitia.
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

      {/* REKAP PPDB 2024 */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Referensi</div>
          <h2>Rekap PPDB <span className={styles.highlight}>2024/2025</span></h2>
          <p>Informasi penerimaan siswa pada tahun ajaran sebelumnya sebagai referensi Anda.</p>
        </div>
        <div className={styles.jalurGrid}>
          <div className={styles.jalurCard} style={{ textAlign: "center" }}>
            <div className={styles.jalurIcon}>🏆</div>
            <h3>Jalur Prestasi</h3>
            <p style={{ margin: 0, fontSize: "1.1rem" }}>Nilai terendah diterima:<br/><strong style={{fontSize:"1.5rem", color:"var(--primary)"}}>262,45</strong></p>
          </div>
          <div className={styles.jalurCard} style={{ textAlign: "center" }}>
            <div className={styles.jalurIcon}>🏠</div>
            <h3>Jalur Zonasi</h3>
            <p style={{ margin: 0, fontSize: "1.1rem" }}>Jarak terjauh diterima:<br/><strong style={{fontSize:"1.5rem", color:"var(--primary)"}}>1,5 KM</strong> (Desa Ngalas)</p>
          </div>
          <div className={styles.jalurCard} style={{ textAlign: "center" }}>
            <div className={styles.jalurIcon}>🤝</div>
            <h3>Jalur Afirmasi</h3>
            <p style={{ margin: 0 }}>Usia Termuda: <strong>11 th 10 bl 19 hr</strong><br/>Usia Tertua: <strong>13 th 5 bl 22 hr</strong></p>
          </div>
          <div className={styles.jalurCard} style={{ textAlign: "center" }}>
            <div className={styles.jalurIcon}>📋</div>
            <h3>Perpindahan Ortu</h3>
            <p style={{ margin: 0, fontSize: "1.1rem" }}>Jumlah siswa diterima:<br/><strong style={{fontSize:"1.5rem", color:"var(--primary)"}}>2 Siswa</strong></p>
          </div>
        </div>
      </section>

      {/* REGULASI & TATA CARA LENGKAP */}
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
              <p>Calon Murid kelas 7 (tujuh) SMP harus memenuhi persyaratan yaitu berusia paling tinggi 15 (lima belas) tahun pada tanggal 1 Juli tahun 2025.</p>
              <h4>Persyaratan usia dibuktikan dengan:</h4>
              <ul>
                <li>Akta kelahiran atau surat keterangan lahir yang dikeluarkan oleh pihak yang berwenang dan dilegalisir oleh Lurah/Kepala Desa atau Pejabat setempat lain yang berwenang sesuai dengan domisili calon murid.</li>
              </ul>
              <h4>Persyaratan surat keterangan lahir, harus dibuktikan dengan:</h4>
              <ul>
                <li>Ijazah; atau</li>
                <li>SKL dari satuan pendidikan sebelumnya</li>
              </ul>
              <h4>Persyaratan usia dikecualikan untuk sekolah dengan kriteria:</h4>
              <ul>
                <li>Menyelenggarakan pendidikan khusus</li>
                <li>Menyelenggarakan pendidikan layanan khusus</li>
                <li>Telah menyelesaikan kelas 6 (enam) SD atau bentuk lain yang sederajat</li>
              </ul>
              <h4>Catatan Tambahan:</h4>
              <ul>
                <li>Bagi tamatan SD/MI sebelum tahun 2024/2025 menggunakan nilai ijazah tahun yang bersangkutan.</li>
                <li>Bagi tamatan SD luar Kabupaten Klaten / MI yang lulus tahun pelajaran 2024/2025 menggunakan nilai SKL yang diterbitkan oleh sekolah yang bersangkutan.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Dokumen yang Perlu Disiapkan (Detail)</summary>
            <div className={styles.accordionContent}>
              <h4>Dokumen Pribadi:</h4>
              <ul>
                <li>Akta kelahiran (asli dan fotokopi)</li>
                <li>Kartu Keluarga (diterbitkan minimal 1 tahun sebelum pendaftaran)</li>
                <li>Pas foto terbaru ukuran 3x4</li>
                <li>Ijazah/SKL SD atau sederajat</li>
              </ul>
              <h4>Dokumen Tambahan (Sesuai Jalur Pendaftaran):</h4>
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
              <h4>Jalur Domisili (40%):</h4>
              <ul>
                <li>KK yang diterbitkan paling singkat 1 (satu) tahun sebelum tanggal pendaftaran penerimaan Murid baru.</li>
                <li>KK tersebut dikecualikan dalam hal perubahan elemen data selain perpindahan domisili dibuktikan dengan surat hasil verifikasi dari panitia.</li>
                <li>Hubungan dengan kepala keluarga sebagai anak atau dalam satu KK terdapat orangtua dan anak.</li>
                <li>Dikecualikan jika kedua orang tua meninggal dan dibuktikan dengan akta kematian.</li>
                <li>Bagi KK di luar Kabupaten Klaten yang merupakan lulusan SD di wilayah Kabupaten Klaten dibuktikan dengan surat keterangan dari Dinas Pendidikan Kabupaten Klaten.</li>
              </ul>
              <p>Dalam hal terjadi persamaan jarak pendaftar, maka diseleksi berdasarkan: (1) Usia tertua calon siswa; (2) Jumlah nilai pada Surat Keterangan SPMB/ SKL/Ijazah; (3) Waktu pendaftaran SPMB.</p>
              
              <h4>Jalur Afirmasi (20%):</h4>
              <ul>
                <li>Berdomisili dalam wilayah domisili yang ditetapkan, berasal dari keluarga ekonomi tidak mampu (KKS/KIP).</li>
                <li>Surat pernyataan dari orang tua/wali murid yang menyatakan bersedia diproses secara hukum jika terbukti memalsukan bukti.</li>
                <li>Penyandang disabilitas dibuktikan dengan surat keterangan dari DISSOSP3APPKB memuat kategori dan kriteria disabilitas yang dapat diterima di sekolah umum dengan melampirkan surat keterangan hasil assessment dari jenjang Pendidikan sebelumnya dan surat keterangan dari dokter spesialis.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Ketentuan Detail: Jalur Prestasi & Mutasi</summary>
            <div className={styles.accordionContent}>
              <h4>Jalur Prestasi (35%):</h4>
              <ul>
                <li>Surat Keterangan SPMB tiga mata pelajaran (Bahasa Indonesia, Matematika, IPA) dari akumulasi rata-rata nilai raport lima semester (kelas 4, 5, dan 6 semester 1).</li>
                <li>Piagam penghargaan akademik/non-akademik tingkat kecamatan hingga internasional (diterbitkan maksimal 3 tahun terakhir). Hanya 1 piagam tertinggi yang dinilai.</li>
                <li><strong>Jenis Piagam Akademik:</strong> OSN, SISPRES, LCC, Lomba Tunas Bahasa Ibu, Lomba Dokter Kecil, Lomba Bercerita.</li>
                <li><strong>Jenis Piagam Olahraga:</strong> POPDA, O2SN, Semua cabor KONI tingkat daerah/nasional, Lomba Marching Band.</li>
                <li><strong>Jenis Piagam Kesenian & Keagamaan:</strong> FLS2N, MAPSI, JSM, Paduan Suara, FLSDAK, FKP.</li>
                <li><strong>Jenis Piagam Ketrampilan:</strong> Jambore/Kemah Bakti, PMR, POCIL Klaten, Robotik.</li>
              </ul>

              <h4>Jalur Mutasi (5%):</h4>
              <ul>
                <li>Orang tua pindah tugas yang masih berdomisili di Luar Daerah dibuktikan dengan surat keterangan dari instansi pemerintah/lembaga/kantor/perusahaan dan surat keterangan Dinas Pendidikan.</li>
                <li>Anak Guru yang mendaftar di tempat orang tuanya bertugas.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Pelaksanaan, Pengumuman & Daftar Ulang</summary>
            <div className={styles.accordionContent}>
              <h4>Sistem Online:</h4>
              <ul>
                <li>Calon Murid dapat memilih 2 (dua) sekolah untuk 1 (satu) jalur pendaftaran dalam 1 wilayah domisili.</li>
                <li>Selain jalur domisili, dapat mendaftar melalui jalur afirmasi atau prestasi.</li>
                <li>Pendaftar yang tidak masuk peringkat di pilihan 1/2 dapat mendaftar ke SMP lain selama masih dalam waktu pendaftaran.</li>
                <li>Bagi yang tidak bisa online dari rumah, panitia sekolah siap membantu proses entri data.</li>
              </ul>
              <h4>Pengumuman & Daftar Ulang:</h4>
              <ul>
                <li>Satuan Pendidikan wajib membuat jurnal harian tentang rekap peringkat nilai pendaftar.</li>
                <li>Calon murid yang diterima wajib mendaftar ulang sesuai jadwal dengan membawa persyaratan asli (termasuk menunjukkan ijazah asli).</li>
                <li>Pendaftar yang tidak mendaftar ulang pada waktunya dinyatakan gugur dan digantikan oleh peringkat di bawahnya.</li>
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* CTA DAFTAR */}
      <section className={styles.ctaSection} id="daftar">
        <div className={styles.ctaInner}>
          <h2>Siap Bergabung dengan Keluarga <span className={styles.highlightPeach}>JUARA?</span></h2>
          <p>Pendaftaran dilakukan secara online melalui portal resmi Dinas Pendidikan Klaten. Pastikan dokumen Anda sudah di-scan dengan jelas sesuai persyaratan.</p>
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
