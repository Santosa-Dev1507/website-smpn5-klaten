import styles from "./spmb.module.css";
import Header from "../components/Header";
import DomisiliSearch from "./DomisiliSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPMB 2026/2027 - SMPN 5 Klaten",
  description:
    "Seleksi Penerimaan Murid Baru (SPMB) SMP Negeri 5 Klaten Tahun Ajaran 2026/2027. Informasi jalur pendaftaran, jadwal, persyaratan, dan panduan lengkap.",
};

const alasan = [
  { icon: "⭐", title: "Sekolah Penggerak", desc: "Program unggulan inovasi pembelajaran untuk peningkatan kualitas pendidikan nasional." },
  { icon: "💻", title: "Pembelajaran Modern", desc: "Pembelajaran mendalam, koding, dan AI untuk mempersiapkan siswa di era digital." },
  { icon: "🌿", title: "Sekolah Adiwiyata Nasional", desc: "Meraih penghargaan Adiwiyata Nasional dari Kementerian Lingkungan Hidup dan Kehutanan RI." },
  { icon: "🏅", title: "Akreditasi A", desc: "Menjamin kualitas pendidikan dan fasilitas terbaik untuk proses belajar siswa." },
];

const halBaru = [
  { no: 1, lama: "Jalur Domisili 40%\nAfirmasi 20%\nPrestasi 35%\nMutasi 5%", baru: "Jalur Domisili 40%\nAfirmasi 20%\nPrestasi 35%\nMutasi 5%" },
  { no: 2, lama: "KK diterbitkan min. 1 tahun sebelum pendaftaran", baru: "KK diterbitkan min. 1 tahun sebelum pendaftaran (ketentuan tetap)" },
  { no: 3, lama: "Piagam/sertifikat maks 3 tahun dari tanggal pendaftaran", baru: "Piagam/sertifikat maks 3 tahun (tetap berlaku)" },
  { no: 4, lama: "Seleksi online via portal Dinas Pendidikan Klaten", baru: "Seleksi online via portal resmi — pantau pengumuman terbaru" },
];

const jalurIcons = [
  <svg key="dom" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12l9-8 9 8" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="prs" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="#944535" strokeWidth="2" strokeLinejoin="round"/></svg>,
  <svg key="afr" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11v6M9 14h6" stroke="#944535" strokeWidth="2" strokeLinecap="round"/><rect x="8" y="2" width="8" height="4" rx="1" stroke="#944535" strokeWidth="2"/></svg>,
  <svg key="mut" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="#944535" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#944535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

const jalur = [
  {
    title: "Jalur Domisili (40%)",
    desc: "Bagi calon murid yang berdomisili di wilayah yang ditetapkan.",
    details: ["KK terbit minimal 1 tahun sebelum daftar", "Akta Kelahiran & SKL/Ijazah SD", "Seleksi: Usia tertua → Nilai → Waktu daftar"],
  },
  {
    title: "Jalur Prestasi (35%)",
    desc: "Bagi calon murid dengan prestasi akademik maupun non-akademik.",
    details: ["Rata-rata rapor 5 semester (Mat, BI, IPA)", "Sertifikat kejuaraan maks 3 tahun terakhir", "Hanya 1 piagam tertinggi yang dinilai"],
  },
  {
    title: "Jalur Afirmasi (20%)",
    desc: "Bagi pendaftar dari keluarga tidak mampu (KIP/KKS) & penyandang disabilitas.",
    details: ["Kartu PKH / KIP / Surat DISSOSP3APPKB", "Surat pernyataan tanggung jawab orang tua", "Seleksi: Usia → Nilai → Waktu daftar"],
  },
  {
    title: "Jalur Mutasi (5%)",
    desc: "Bagi calon murid yang mengikuti perpindahan tugas orang tua/wali atau anak guru.",
    details: ["Surat keterangan pindah tugas instansi", "Anak guru mendaftar di sekolah tempat ortu bertugas", "Seleksi: Usia → Nilai → Waktu daftar"],
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
  "Berusia maksimal 15 tahun per 1 Juli 2026 (pengecualian bagi difabel).",
  "Memiliki Ijazah/SKL dari satuan pendidikan dasar (SD/MI/sederajat).",
  "Akta Kelahiran asli dan fotokopi.",
  "Kartu Keluarga (KK) terbit minimal 1 tahun sebelum pendaftaran.",
  "Pas foto terbaru ukuran 3x4.",
  "Semua dokumen di-scan jelas maks 1 MB (PDF/JPG) untuk upload online.",
];

const rekapPrev = [
  { icon: "🏆", jalur: "Jalur Prestasi", info: "Nilai terendah diterima:", nilai: "262,45", satuan: "" },
  { icon: "🏠", jalur: "Jalur Domisili", info: "Jarak terjauh diterima:", nilai: "1,5 KM", satuan: "(Desa Ngalas)" },
  { icon: "🤝", jalur: "Jalur Afirmasi", info: "Usia termuda diterima:", nilai: "11 th 10 bl", satuan: "19 hr" },
  { icon: "📋", jalur: "Jalur Mutasi", info: "Jumlah siswa diterima:", nilai: "2", satuan: "Siswa" },
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
            <span className={styles.heroWord}>Seleksi </span>
            <span className={styles.heroWord}>Penerimaan </span>
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
            <span>Jadwal resmi akan diumumkan oleh Dinas Pendidikan Klaten</span>
          </div>
        </div>
      </section>

      {/* GRATIS BANNER */}
      <section className={styles.gratisBanner}>
        <div className={styles.gratisBannerInner}>
          <div className={styles.gratisAvatarWrap}>
            <img src="/panitia-spmb.png" alt="Panitia SPMB SMPN 5 Klaten" className={styles.gratisAvatarImg} />
          </div>
          <div className={styles.gratisContent}>
            <h3>SPMB SMPN 5 Klaten <span>GRATIS</span>,<br />tanpa pungutan apapun.</h3>
            <p>
              Seluruh proses Seleksi Penerimaan Murid Baru (SPMB) di SMPN 5 Klaten tidak dipungut biaya
              dalam bentuk apapun. Jika ada pihak yang meminta pembayaran atas nama sekolah,
              harap segera laporkan kepada panitia.
            </p>
            <div className={styles.gratisMeta}>
              <span className={styles.gratisStamp}>📞 Hubungi: 0895-3778-15555</span>
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
              <div className={styles.jalurIcon}>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JALUR PENDAFTARAN */}
      <section className={styles.section} id="jalur">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Jalur Pendaftaran</div>
          <h2>Pilih Jalur yang <span className={styles.highlight}>Sesuai</span></h2>
          <p>Tersedia 4 jalur penerimaan resmi sesuai regulasi Dinas Pendidikan Kabupaten Klaten.</p>
        </div>
        <div className={styles.jalurGrid}>
          {jalur.map((j, i) => (
            <div key={i} className={styles.jalurCard}>
              <div className={styles.jalurIcon}>{jalurIcons[i]}</div>
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

      {/* REGULASI LENGKAP ACCORDION */}
      <section className={styles.sectionAlt}>
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
              <h4>Persyaratan usia dibuktikan dengan:</h4>
              <ul>
                <li>Akta kelahiran atau surat keterangan lahir yang dikeluarkan oleh pihak yang berwenang dan dilegalisir oleh Lurah/Kepala Desa.</li>
              </ul>
              <h4>Persyaratan usia dikecualikan untuk sekolah dengan kriteria:</h4>
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
                <li>KK yang diterbitkan paling singkat 1 (satu) tahun sebelum tanggal pendaftaran.</li>
                <li>KK tersebut dikecualikan dalam hal perubahan elemen data selain perpindahan domisili.</li>
                <li>Hubungan dengan kepala keluarga sebagai anak atau dalam satu KK terdapat orangtua dan anak.</li>
                <li>Dikecualikan jika kedua orang tua meninggal dan dibuktikan dengan akta kematian.</li>
              </ul>
              <p>Jika terjadi persamaan jarak, seleksi berdasarkan: (1) Usia tertua; (2) Nilai SKL/Ijazah; (3) Waktu pendaftaran.</p>
              <h4>Jalur Afirmasi (20%):</h4>
              <ul>
                <li>Berdomisili dalam wilayah yang ditetapkan, berasal dari keluarga ekonomi tidak mampu (KKS/KIP).</li>
                <li>Surat pernyataan dari orang tua/wali yang bersedia diproses hukum jika memalsukan bukti.</li>
                <li>Penyandang disabilitas dibuktikan dengan surat keterangan dari DISSOSP3APPKB.</li>
              </ul>
            </div>
          </details>

          <details className={styles.accordion}>
            <summary>Ketentuan Detail: Jalur Prestasi & Mutasi</summary>
            <div className={styles.accordionContent}>
              <h4>Jalur Prestasi (35%):</h4>
              <ul>
                <li>Nilai rapor 3 mata pelajaran (Bahasa Indonesia, Matematika, IPA) dari akumulasi rata-rata 5 semester.</li>
                <li>Piagam penghargaan akademik/non-akademik (diterbitkan maksimal 3 tahun terakhir). Hanya 1 piagam tertinggi yang dinilai.</li>
                <li><strong>Piagam Akademik:</strong> OSN, SISPRES, LCC, Lomba Tunas Bahasa Ibu, Dokter Kecil, Bercerita.</li>
                <li><strong>Piagam Olahraga:</strong> POPDA, O2SN, semua cabor KONI tingkat daerah/nasional, Marching Band.</li>
                <li><strong>Piagam Kesenian & Keagamaan:</strong> FLS2N, MAPSI, JSM, Paduan Suara, FLSDAK, FKP.</li>
                <li><strong>Piagam Ketrampilan:</strong> Jambore/Kemah Bakti, PMR, POCIL Klaten, Robotik.</li>
              </ul>
              <h4>Jalur Mutasi (5%):</h4>
              <ul>
                <li>Orang tua pindah tugas yang masih berdomisili di luar daerah, dibuktikan dengan surat keterangan instansi dan Dinas Pendidikan.</li>
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
