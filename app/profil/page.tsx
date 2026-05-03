"use client";
import { useState } from "react";
import styles from "./profil.module.css";
import Header from "../components/Header";

// ===== DATA =====
const misi = [
  "Menanamkan Iman dan Taqwa",
  "Menumbuhkan Rasa Cinta Tanah Air dan Nasionalisme",
  "Membiasakan Pola Hidup Sehat",
  "Mengembangkan Prestasi Akademik dan Non-Akademik",
  "Menanamkan Kepedulian Lingkungan",
  "Menyelenggarakan Pembelajaran Mendalam (Deep Learning)",
  "Mengembangkan Keterampilan Abad-21 (4C/6C)",
  "Meningkatkan Profesionalisme Pendidik dan Tenaga Kependidikan",
  "Membangun Kemitraan dengan Orang Tua, Komunitas, dan Dunia Industri",
];

const tujuan = [
  "Menumbuhkan keimanan dan ketakwaan peserta didik melalui pembiasaan ibadah, penghayatan nilai-nilai agama, dan penerapan akhlak mulia.",
  "Membangun rasa nasionalisme, kebanggaan, dan tanggung jawab peserta didik terhadap bangsa dan negara.",
  "Membentuk perilaku hidup bersih, sehat, dan bugar pada seluruh warga sekolah.",
  "Meningkatkan kualitas belajar peserta didik untuk meraih prestasi di tingkat sekolah, daerah, hingga nasional/internasional.",
  "Menumbuhkan kesadaran peserta didik dalam menjaga kelestarian alam dan mengelola lingkungan secara berkelanjutan.",
  "Memberikan pengalaman belajar yang bermakna, menantang, berbasis inkuiri/proyek, dan mengembangkan pemahaman konsep secara kritis.",
  "Membekali peserta didik dengan keterampilan 4C/6C (critical thinking, creativity, collaboration, communication, character, citizenship).",
  "Meningkatkan kompetensi pedagogik, profesional, sosial, dan kepribadian guru secara berkesinambungan.",
  "Memperkuat kerja sama dengan orang tua, masyarakat, dunia usaha/industri, dan pemerintah dalam mendukung pendidikan.",
];

const kepalaSekolah = [
  { nama: "Alm. Bp. Soekarto, B.A.", periode: "1984 – 1997", durasi: "13 Tahun", catatan: "Kepala Sekolah definitif pertama. Mengembangkan sekolah dari 3 kelas menjadi 6 kelas. Meraih Juara Umum PERBINAR 1994 dan masuk peringkat 8, 12, dan 16 UN dari 176 sekolah se-Kabupaten Klaten." },
  { nama: "Alm. Bp. Supardi, B.A.", periode: "1996 – 2001", durasi: "5 Tahun", catatan: "Pembangunan fisik berkembang pesat. Sekolah memiliki 18 ruang kelas, ruang Kepsek, TU, Guru, Ketrampilan, dan Perpustakaan. Jumlah guru & karyawan ~50 orang." },
  { nama: "Bp. Drs. Sutarman", periode: "2001 – 2004", durasi: "3 Tahun", catatan: "Melanjutkan estafet kepemimpinan dan menjaga stabilitas mutu pendidikan sekolah." },
  { nama: "Bp. Drs. Widodo", periode: "2004 – 2008", durasi: "4 Tahun", catatan: "Modernisasi teknologi dimulai. Sekolah mendapatkan bantuan perangkat komputer untuk pelajaran TIK. Laboratorium Komputer pertama berdiri." },
  { nama: "Bp. H. Joko Siswanto, S.Pd.", periode: "2008 – 2010", durasi: "2 Tahun", catatan: "Melanjutkan pengembangan manajemen dan program sekolah." },
  { nama: "Bp. Drs. Sugeng Rusmanto, M.P.", periode: "2010 – 2014", durasi: "4 Tahun", catatan: "Sekolah meraih status Sekolah Standar Nasional (SSN). Berkembang menjadi 24 kelas. Juara Umum Gerak Jalan Kepurun Klaten (2011, 2012, 2013)." },
  { nama: "Bp. Sugiyarto, S.Pd., M.Pd.", periode: "2014 – 2016", durasi: "2 Tahun", catatan: "Fokus pada peningkatan kualitas pembelajaran dan disiplin siswa." },
  { nama: "Bp. Gumawang Setiyanto, S.Pd., M.Pd.", periode: "2016 – 2022", durasi: "6 Tahun", catatan: "Merupakan guru SMPN 5 Klaten yang kemudian dipercaya memimpin sekolah. Membawa sekolah terus maju dan berkembang." },
  { nama: "Bp. Kamidi, S.Pd.", periode: "2022 – Sekarang", durasi: "Kepala Sekolah Saat Ini", catatan: "Memimpin SMPN 5 Klaten dengan semangat JUARA, membawa sekolah meraih penghargaan Adiwiyata Nasional 2025 dan terus mengembangkan kualitas pembelajaran." },
];
// ===== END DATA =====

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("visi");

  return (
    <main className={styles.main}>

      <Header activePage="Profil" />

      {/* PAGE HERO */}
      <section className={styles.pageHero}>
        <div className={styles.heroBreadcrumb}><a href="/">Beranda</a> / Profil Sekolah</div>
        <h1>Profil <span className={styles.highlight}>SMPN 5 Klaten</span></h1>
        <p>Mengenal lebih dekat SMP Negeri 5 Klaten — visi, misi, sambutan pimpinan, dan perjalanan panjang sejak 1984.</p>
      </section>

      {/* TABS */}
      <div className={styles.tabWrapper}>
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === "visi" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("visi")}
          >
            📋 Visi & Misi
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "sambutan" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("sambutan")}
          >
            🎙️ Sambutan Kepala Sekolah
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "sejarah" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("sejarah")}
          >
            📜 Sejarah Sekolah
          </button>
        </div>

        {/* TAB: VISI MISI */}
        {activeTab === "visi" && (
          <div className={styles.tabContent}>
            {/* VISI */}
            <div className={styles.visiCard}>
              <div className={styles.visiLabel}>VISI</div>
              <p className={styles.visiText}>
                "Terwujudnya Peserta Didik yang Berimtaq Tangguh, Cinta Tanah Air, Sehat, Berprestasi, Peduli Lingkungan, dan Mampu Berpikir Kritis, Kreatif, Kolaboratif, serta Komunikatif untuk Menghadapi Tantangan Global Melalui Pembelajaran Mendalam yang Bermakna"
              </p>
            </div>

            {/* MISI */}
            <div className={styles.twoColSection}>
              <div>
                <h2 className={styles.sectionTitle}>MISI</h2>
                <div className={styles.misiList}>
                  {misi.map((m, i) => (
                    <div key={i} className={styles.misiItem}>
                      <div className={styles.misiNumber}>{i + 1}</div>
                      <p>{m}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TUJUAN */}
              <div>
                <h2 className={styles.sectionTitle}>TUJUAN SEKOLAH</h2>
                <div className={styles.tujuanList}>
                  {tujuan.map((t, i) => (
                    <div key={i} className={styles.tujuanItem}>
                      <span className={styles.tujuanCheck}>✓</span>
                      <p>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SAMBUTAN */}
        {activeTab === "sambutan" && (
          <div className={styles.tabContent}>
            <div className={styles.sambutanLayout}>
              <div className={styles.sambutanPhoto}>
                <img
                  src="/kepsek.jpg"
                  alt="Kepala Sekolah SMPN 5 Klaten"
                  className={styles.kepsekPhoto}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x500/fdf8f2/944535?text=Foto+Kepala+Sekolah";
                  }}
                />
                <div className={styles.kepsekInfo}>
                  <strong>Kamidi, S.Pd.</strong>
                  <span>Kepala SMP Negeri 5 Klaten</span>
                </div>
              </div>

              <div className={styles.sambutanText}>
                <div className={styles.sambutanQuote}>"</div>
                <h2>Sambutan <span className={styles.highlight}>Kepala Sekolah</span></h2>

                <div className={styles.sambutanContent}>
                  <p><em>Assalamu'alaikum Warahmatullahi Wabarakatuh,</em></p>
                  <p>Puji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya, sehingga SMP Negeri 5 Klaten terus dapat menjalankan amanah mulia dalam mendidik generasi penerus bangsa.</p>
                  <p>Selamat datang di website resmi SMP Negeri 5 Klaten. Melalui laman ini, kami ingin membuka jendela seluas-luasnya bagi masyarakat — khususnya para orang tua dan calon peserta didik — untuk mengenal lebih dekat keluarga besar SMPN 5 Klaten.</p>
                  <p>Selama lebih dari empat dekade berdiri, sekolah kami telah melewati berbagai fase perjalanan yang membentuk karakter dan identitas kami. Kami bukan sekolah yang paling besar, bukan pula yang paling banyak trofi. Namun kami adalah sekolah yang <strong>sungguh-sungguh peduli pada setiap siswa</strong> — pada pertumbuhan karakter, keimanan, dan potensi unik mereka masing-masing.</p>
                  <p>Nilai <strong>JUARA</strong> — Jujur, Unggul, Amanah, Religius, dan Aktif — bukan sekadar akronim di dinding sekolah. Ini adalah napas yang kami hidup setiap hari, dari cara guru mengajar, cara siswa berinteraksi, hingga cara kami menjaga lingkungan sekolah yang telah meraih penghargaan <strong>Adiwiyata Nasional</strong>.</p>
                  <p>Kepada para orang tua yang mempercayakan pendidikan putra-putri kepada kami, terima kasih atas kepercayaan yang luar biasa ini. Kami berkomitmen untuk terus meningkatkan mutu layanan pendidikan, membuka ruang dialog, dan berjalan bersama dalam mendampingi tumbuh kembang anak-anak kita.</p>
                  <p>Kepada calon peserta didik yang sedang mempertimbangkan SMPN 5 Klaten — kami menyambut Anda dengan tangan terbuka. Di sini, <em>setiap anak punya cara sendiri untuk jadi JUARA.</em></p>
                  <p><em>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</em></p>
                </div>

                <div className={styles.sambutanSign}>
                  <div className={styles.signLine}></div>
                  <strong>Kamidi, S.Pd.</strong>
                  <span style={{display:'block', fontSize:'0.85rem', color:'#888', marginTop:'0.25rem'}}>Kepala SMP Negeri 5 Klaten</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SEJARAH */}
        {activeTab === "sejarah" && (
          <div className={styles.tabContent}>
            {/* INTRO */}
            <div className={styles.sejarahIntro}>
              <h2>Berdiri Sejak <span className={styles.highlight}>1984</span>, Mengabdi untuk Negeri</h2>
              <p>SMP Negeri 5 Klaten mulai menorehkan sejarahnya pada tahun 1984. Sekolah ini secara resmi diresmikan pada <strong>18 Februari 1986</strong> oleh Bapak Prof. Dr. Fuad Hasan, dan tanggal tersebut ditetapkan sebagai hari jadi sekolah.</p>
            </div>

            {/* MASA PERINTISAN */}
            <div className={styles.sejarahBlock}>
              <div className={styles.sejarahBlockHeader}>
                <span className={styles.sejarahEra}>1984 – 1986</span>
                <h3>Masa Perintisan</h3>
              </div>
              <div className={styles.sejarahBlockContent}>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <strong>Semester 1 — Menumpang di SMPN 2 Klaten</strong>
                      <p>KBM diampu oleh Alm. Bp. Sriyono, B.A. Para siswa menumpang di gedung SMP Negeri 2 Klaten di Pondok.</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <strong>Semester 2 — Pindah ke Gedung Sendiri</strong>
                      <p>Sekolah mulai menempati gedung sendiri di Desa Jomboran (lokasi saat ini) dengan fasilitas awal: 3 ruang kelas, 1 ruang guru, dan 1 ruang TU. Angkatan pertama: <strong>120 siswa dalam 3 kelas</strong>.</p>
                    </div>
                  </div>
                </div>

                <div className={styles.perintisBox}>
                  <h4>🌟 Tokoh Perintis</h4>
                  <div className={styles.perintisGrid}>
                    <div>
                      <strong>Guru Perintis</strong>
                      <ul><li>Ibu Sumarmi</li><li>Ibu Sribudiningsih</li><li>Bp. Sardiman</li></ul>
                    </div>
                    <div>
                      <strong>Tata Usaha Perintis</strong>
                      <ul><li>Ibu Sri Sumiyati</li><li>Ibu Endang LR</li></ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* JEJAK KEPEMIMPINAN */}
            <div className={styles.sejarahBlock}>
              <div className={styles.sejarahBlockHeader}>
                <span className={styles.sejarahEra}>1984 – Sekarang</span>
                <h3>Jejak Kepemimpinan</h3>
              </div>
              <div className={styles.kepalaGrid}>
                {kepalaSekolah.map((k, i) => (
                  <div key={i} className={styles.kepalaCard}>
                    <div className={styles.kepalaNumber}>{i + 1}</div>
                    <div className={styles.kepalaInfo}>
                      <strong>{k.nama}</strong>
                      <div className={styles.kepalaPeriode}>{k.periode} · {k.durasi}</div>
                      <p>{k.catatan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

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
