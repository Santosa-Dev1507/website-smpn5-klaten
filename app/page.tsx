import styles from "./page.module.css";
import Image from "next/image";
import Header from "./components/Header";
import Script from "next/script";

// ===== KONFIGURASI SPMB =====
// Ubah ke `true` saat pendaftaran dibuka, `false` saat belum dibuka
const isSpmbOpen = true;

// --- DATA PLACEHOLDER (Ganti dengan data asli nanti) ---
const stats = [
  { number: "42+", label: "Tahun Berdiri", sub: "Berdiri sejak 1984" },
  { number: "768", label: "Siswa Aktif", sub: "Tahun ajaran 2025/2026" },
  { number: "40", label: "Tenaga Pengajar", sub: "Guru profesional & berdedikasi" },
  { number: "2025", label: "Adiwiyata Nasional", sub: "Penghargaan lingkungan hidup" },
];

const ekskulList = [
  { icon: "👥", name: "OSIS", desc: "Wadah pengembangan kepemimpinan dan manajerial organisasi siswa" },
  { icon: "🏥", name: "PMR", desc: "Melatih keterampilan pertolongan pertama dan kepedulian sosial (Palang Merah Remaja)" },
  { icon: "📖", name: "Tuntas Baca Al-Qur'an", desc: "Membangun kemampuan membaca Al-Qur'an dengan tartil dan benar" },
  { icon: "⛺", name: "Pramuka", desc: "Membentuk karakter mandiri, tangguh, dan berjiwa kepemimpinan" },
  { icon: "🥋", name: "Tae Kwon Do", desc: "Olahraga bela diri yang melatih disiplin, ketangkasan, dan mental" },
  { icon: "💃", name: "Seni Tari", desc: "Mengembangkan bakat seni dan kecintaan terhadap budaya Indonesia" },
  { icon: "🪖", name: "PBB (Baris Berbaris)", desc: "Melatih kedisiplinan, ketertiban, dan jiwa korsa siswa" },
];

const achievements = [
  // Prestasi Sekolah
  { year: "2025", title: "Sekolah Adiwiyata Nasional", level: "Penghargaan Nasional — Kementerian LHK RI", cat: "🌿 Sekolah" },
  // Prestasi Guru
  { year: "2025", title: "Juara 2 Festival Paduan Suara HGN", level: "Tingkat Kabupaten Klaten — Tim Guru SMPN 5", cat: "🎤 Guru" },
  { year: "2025", title: "Narasumber Pembelajaran Mendalam Guru IPS", level: "Santi Nurrohmawati, SE — Tingkat Kabupaten", cat: "📚 Guru" },
  // Prestasi Siswa
  { year: "2025", title: "Juara 1 Senam Anak Indonesia Hebat", level: "Fahira, Aryana, Triska — Tingkat Kabupaten Klaten", cat: "🤸 Siswa" },
  { year: "2024", title: "Juara 1 Jumbara PMR Kabupaten Klaten", level: "Adinda Putri & Aisyah Sarifa — Kelas 9H", cat: "🏥 Siswa" },
  { year: "2024", title: "Juara 3 Open Kata Karate Inkai Cup", level: "Khanza Shaulika — Tingkat Kabupaten Klaten", cat: "🥋 Siswa" },
  { year: "2024", title: "Juara 2 & 3 Nulis Cerkak Bahasa Jawa", level: "Briliant Ardie & Ismy Ayu — Tingkat Kabupaten", cat: "✍️ Siswa" },
];

const testimonials = [
  {
    name: "Resty Nur Safni",
    role: "Alumni — SMKN 3 Klaten, Jurusan Tata Busana",
    avatar: "RN",
    photo: "/alumni-resty.jpg",
    text: "Banyak hal baru yang saya temukan di sini. Kebersamaan dengan teman-teman menjadi kenangan paling berkesan yang akan selalu saya ingat.",
  },
  {
    name: "Madana Naura Althafuabiya",
    role: "Alumni — SMAN 1 Klaten",
    avatar: "MN",
    photo: "/alumni-madana.jpg",
    text: "Di SMPN 5 Klaten, saya belajar bukan hanya ilmu, tapi juga arti persahabatan dan tanggung jawab. Guru-guru yang sabar benar-benar membantu saya berkembang. Bangga menjadi bagian dari keluarga ESPEMA!",
  },
  {
    name: "Rafka Aniszava Pratama",
    role: "Alumni — SMKN 1 Klaten",
    avatar: "RA",
    photo: "/alumni-rafka.jpg",
    text: "Awalnya saya belum mengenal diri sendiri. Berkat bimbingan guru-guru SMPN 5 Klaten, saya akhirnya menemukan potensi dan arah tujuan saya.",
  },
];

const news = [
  {
    date: "15 Apr 2026",
    category: "SPMB",
    title: "Pendaftaran Siswa Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    desc: "SMPN 5 Klaten membuka pendaftaran siswa baru. Kuota terbatas, segera daftarkan putra-putri Anda sebelum batas waktu pendaftaran.",
    color: "#944535",
    url: "/spmb",
  },
  {
    date: "14 Des 2025",
    category: "Prestasi",
    title: "SMPN 5 Klaten Raih Penghargaan Adiwiyata Nasional 2025",
    desc: "SMPN 5 Klaten masuk dalam 9 sekolah di Klaten yang meraih penghargaan Adiwiyata Nasional, diserahkan langsung oleh Menteri Lingkungan Hidup di Jakarta.",
    color: "#2D7D46",
    url: "https://solopos.espos.id/top-9-sekolah-di-klaten-raih-penghargaan-adiwiyata-nasional-2172305",
  },
  {
    date: "26 Jun 2024",
    category: "Prestasi",
    title: "SMPN 5 Klaten Dinobatkan Jadi Sekolah Adiwiyata Tingkat Provinsi",
    desc: "SMPN 5 Klaten meraih penghargaan Sekolah Adiwiyata Tingkat Provinsi Jawa Tengah, atas inovasi program Buntol dan berbagai kegiatan peduli lingkungan yang melibatkan seluruh warga sekolah.",
    color: "#2D7D46",
    url: "https://solopos.espos.id/smpn-5-klaten-dinobatkan-jadi-sekolah-adiwiyata-tingkat-provinsi-1948890",
  },
];
// --- END DATA ---

export default function Home() {
  return (
    <main className={styles.main}>

      <Header activePage="Beranda" />

      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero} id="beranda">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Sekolah Adiwiyata Tingkat Nasional</div>
          <h1 className={styles.heroTitle}>
            Setiap Anak Punya <span className={styles.underlineHighlight}>Cara Sendiri</span> untuk Jadi{" "}
            <span className={styles.highlightRed}>JUARA.</span>
          </h1>
          <p className={styles.heroDescription}>
            Di SMPN 5 Klaten, kami percaya juara bukan hanya soal nilai tertinggi. Di sini, siswa tumbuh
            dengan karakter, keterampilan, dan kepercayaan diri untuk menghadapi masa depan.
          </p>
          <div className={styles.heroActions}>
            <a href="#spmb" className={styles.btnPrimary}>Mulai Perjalananmu →</a>
            <a href="#prestasi" className={styles.btnSecondary}>Lihat Prestasi Siswa</a>
          </div>

        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.imageWrapper}>
            <img
              src="/foto-school.jpg"
              alt="Gedung SMPN 5 Klaten"
              className={styles.schoolPhoto}
            />
            <div className={styles.decorativeShape}></div>
            <div className={styles.floatingCard}>
              <span className={styles.floatingIcon}>🌿</span>
              <div>
                <strong>Adiwiyata Nasional</strong>
                <span>Penghargaan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS / SCHOOL BY NUMBERS ===== */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <strong>{s.number}</strong>
              <span>{s.label}</span>
              <small>{s.sub}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NILAI JUARA ===== */}
      <section className={styles.values} id="profil">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Identitas Sekolah</div>
          <h2>Dibentuk oleh Nilai <span className={styles.highlightRed}>JUARA</span></h2>
          <p>Lima pilar karakter yang menjadi napas kehidupan di SMPN 5 Klaten.</p>
        </div>
        <div className={styles.valuesGrid}>
          {[
            { letter: "J", title: "Jujur", desc: "Jujur adalah dasar kepercayaan. Kami membiasakan siswa berkata dan bertindak apa adanya.", color: "#944535" },
            { letter: "U", title: "Unggul", desc: "Setiap anak punya keunggulan. Tugas kami membantu menemukannya dan mengembangkannya.", color: "#C0622F" },
            { letter: "A", title: "Amanah", desc: "Belajar bertanggung jawab sejak dini. Dari tugas kecil hingga peran besar.", color: "#944535" },
            { letter: "R", title: "Religius", desc: "Karakter kuat berawal dari nilai spiritual. Membentuk pribadi yang berakhlak mulia.", color: "#C0622F" },
            { letter: "A", title: "Berdaya", desc: "Berdaya dalam ilmu, kreativitas, dan karya nyata. Siswa yang mampu memberi manfaat bagi diri dan lingkungannya.", color: "#944535" },
          ].map((v, i) => (
            <div key={i} className={styles.valueCard}>
              <div className={styles.valueLetter} style={{ backgroundColor: v.color }}>{v.letter}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== KURIKULUM ===== */}
      <section className={styles.kurikulum}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Kurikulum</div>
          <h2>Kurikulum <span className={styles.highlightRed}>Pembelajaran</span></h2>
          <p>Menerapkan Kurikulum Merdeka dengan pendekatan pembelajaran yang inovatif dan berpusat pada siswa.</p>
        </div>
        <div className={styles.kurikulumGrid}>
          {[
            { icon: "📚", title: "Kurikulum Merdeka", desc: "Pembelajaran yang fleksibel dan berpusat pada siswa dengan pendekatan project-based learning." },
            { icon: "🎓", title: "Program Unggulan", desc: "Pengembangan karakter, literasi, dan numerasi terintegrasi dalam setiap mata pelajaran." },
            { icon: "👥", title: "Pembelajaran Kolaboratif", desc: "Mendorong kerja sama tim dan komunikasi efektif antar siswa dalam proses belajar." },
            { icon: "✅", title: "Asesmen Komprehensif", desc: "Penilaian holistik yang mencakup aspek kognitif, afektif, dan psikomotorik." },
          ].map((k, i) => (
            <div key={i} className={styles.kurikulumCard}>
              <div className={styles.kurikulumIcon}>{k.icon}</div>
              <h3>{k.title}</h3>
              <p>{k.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== EKSKUL ===== */}
      <section className={styles.ekskul} id="ekskul">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Ekstrakurikuler</div>
          <h2>Temukan Bakatmu. Tunjukkan Caramu <span className={styles.highlightRed}>Menjadi JUARA.</span></h2>
          <p>Mulai dari akademik, olahraga, hingga seni — setiap siswa punya ruang untuk berkembang.</p>
        </div>
        <div className={styles.ekskulGrid}>
          {ekskulList.map((e, i) => (
            <div key={i} className={styles.ekskulCard}>
              <div className={styles.ekskulIcon}>{e.icon}</div>
              <h4>{e.name}</h4>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRESTASI ===== */}
      <section className={styles.achievements} id="prestasi">
        <div className={styles.achievementsLayout}>
          <div className={styles.achievementsLeft}>
            <div className={styles.sectionBadge}>Prestasi & Penghargaan</div>
            <h2>Pencapaian <span className={styles.highlightRed}>Juara</span> yang Kami Raih Bersama</h2>
            <p>Berikut adalah prestasi nyata yang diraih oleh siswa, guru, dan sekolah dalam beberapa tahun terakhir.</p>
            <div className={styles.achievementHighlight}>
              <span>Sekolah Adiwiyata Nasional 2025 — penghargaan tertinggi bidang lingkungan hidup dari Kementerian LHK RI</span>
            </div>
          </div>
          <div className={styles.achievementsRight}>
            {achievements.map((a, i) => (
              <div key={i} className={styles.achievementItem}>
                <div className={styles.achievementYear}>{a.year}</div>
                <div className={styles.achievementInfo}>
                  <strong>{a.title}</strong>
                  <span>{a.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Kata Mereka</div>
          <h2>Suara <span className={styles.highlightRed}>Alumni ESPEMA</span></h2>
          <p>Pengalaman nyata dari generasi JUARA yang telah merasakan langsung belajar di SMPN 5 Klaten.</p>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <div className={styles.testimonialPhotoWrap}>
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className={styles.avatarPhoto} />
                ) : (
                  <div className={styles.avatar}>{t.avatar}</div>
                )}
              </div>
              <div className={styles.quoteIcon}>&ldquo;</div>
              <p className={styles.testimonialText}>{t.text}</p>
              <div className={styles.testimonialAuthor}>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ===== SPMB CTA ===== */}
      <section className={styles.ppdb} id="spmb">
        <div className={styles.ppdbInner}>
          <div className={styles.ppdbContent}>

            {isSpmbOpen ? (
              /* ── MODE: SPMB DIBUKA ── */
              <>
                <div className={styles.ppdbBadge}>📢 SPMB 2026/2027 Dibuka</div>
                <h2>Saatnya Jadi Bagian dari<br />Sekolah Para <span className={styles.ppdbHighlight}>JUARA.</span></h2>
                <p>
                  Seleksi Penerimaan Murid Baru (SPMB) SMPN 5 Klaten tahun ajaran 2026/2027 telah dibuka.<br />
                  <strong>Tempat terbatas</strong> — pastikan putra-putri Anda mendapatkan lingkungan belajar terbaik sejak sekarang.
                </p>
                <div className={styles.ppdbActions}>
                  <a href="/spmb" className={styles.btnPpdbPrimary}>Daftar Sekarang</a>
                  <a href="/spmb" className={styles.btnPpdbSecondary}>Lihat Syarat & Jadwal</a>
                </div>
              </>
            ) : (
              /* ── MODE: SPMB BELUM DIBUKA ── */
              <>
                <div className={styles.ppdbBadgeClosed}>🔒 SPMB Belum Dibuka</div>
                <h2>Bersiaplah Bergabung<br />Bersama Keluarga <span className={styles.ppdbHighlight}>JUARA.</span></h2>
                <p>
                  Pendaftaran SPMB SMPN 5 Klaten tahun ajaran 2026/2027 akan segera dibuka.<br />
                  Pantau terus halaman ini atau hubungi kami untuk informasi terbaru.
                </p>
                <div className={styles.ppdbActions}>
                  <a href="https://wa.me/6289537781555?text=Halo,%20saya%20ingin%20tanya%20info%20SPMB%20SMPN%205%20Klaten" target="_blank" rel="noopener noreferrer" className={styles.btnPpdbPrimary}>💬 Tanya via WhatsApp</a>
                  <a href="/spmb" className={styles.btnPpdbSecondary}>Lihat Informasi SPMB</a>
                </div>
              </>
            )}

          </div>
          <div className={styles.ppdbDecor}>
            <div className={styles.ppdbCircle1}></div>
            <div className={styles.ppdbCircle2}></div>
            <div className={styles.ppdbInfo}>
              <div className={styles.ppdbInfoItem}><strong>Juni</strong><span>Buka Pendaftaran</span></div>
              <div className={styles.ppdbInfoDivider}></div>
              <div className={styles.ppdbInfoItem}><strong>Juli</strong><span>Pengumuman</span></div>
              <div className={styles.ppdbInfoDivider}></div>
              <div className={styles.ppdbInfoItem}><strong>256</strong><span>Kuota Siswa</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BERITA TERBARU ===== */}
      <section className={styles.news}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Berita & Pengumuman</div>
          <h2>Selalu <span className={styles.highlightRed}>Terkini</span></h2>
          <p>Ikuti perkembangan terbaru dari SMPN 5 Klaten.</p>
        </div>
        <div className={styles.newsGrid}>
          {news.map((n, i) => (
            <article key={i} className={styles.newsCard}>
              <div className={styles.newsCategory} style={{ color: n.color, borderColor: n.color }}>
                {n.category}
              </div>
              <h4>{n.title}</h4>
              <p>{n.desc}</p>
              <div className={styles.newsFooter}>
                <span className={styles.newsDate}>{n.date}</span>
                <a href={n.url} target={n.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className={styles.newsLink} style={{ color: n.color }}>Baca Selengkapnya →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== INSTAGRAM CTA ===== */}
      <section className={styles.instagramSection}>
        <div className={styles.instagramCta}>
          <div className={styles.instagramCtaIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <div className={styles.instagramCtaText}>
            <div className={styles.sectionBadge}>Media Sosial</div>
            <h2>Ikuti Kami di <span className={styles.highlightRed}>Instagram</span></h2>
            <p>Dapatkan update terbaru kegiatan, prestasi, dan momen berkesan SMPN 5 Klaten melalui Instagram kami.</p>
          </div>
          <a
            href="https://www.instagram.com/espema_klaten"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramCtaBtn}
          >
            @espema_klaten
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <Image
                src="/logo_smpn5.png"
                alt="Logo SMPN 5 Klaten"
                width={55}
                height={55}
              />
              <div>
                <strong>SMPN 5 KLATEN</strong>
                <span>Generasi JUARA</span>
              </div>
            </div>
            <p className={styles.footerDesc}>Mendidik dengan hati, membentuk karakter, dan menginspirasi siswa menjadi pribadi JUARA di masa depan.</p>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/profile.php?id=100083650097233" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/espema_klaten" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.tiktok.com/@espema.klaten" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://youtube.com/@smpnegeri5klaten" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h5>Navigasi</h5>
            <ul>
              <li><a href="#">Beranda</a></li>
              <li><a href="#profil">Profil Sekolah</a></li>
              <li><a href="#ekskul">Ekstrakurikuler</a></li>
              <li><a href="#prestasi">Prestasi</a></li>
              <li><a href="/spmb">Info SPMB</a></li>
            </ul>
          </div>




          <div className={styles.footerContact}>
            <h5>Kontak & Lokasi</h5>
            <div className={styles.contactItem}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </span>
              <p>Jalan Kendali Sodo, Jomboran, Kecamatan Klaten Tengah, Kabupaten Klaten, Jawa Tengah 57418</p>
            </div>
            <div className={styles.contactItem}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <p>WA 0895377815555</p>
            </div>
            <div className={styles.contactItem}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <p>smp5negeriklaten@gmail.com</p>
            </div>
            <div className={styles.contactItem}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              <p>Senin – Jumat: 07.00 – 14.00 WIB</p>
            </div>
            <div className={styles.contactItem}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </span>
              <p><a href="https://www.smpn5klaten.sch.id" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>www.smpn5klaten.sch.id</a></p>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 SMPN 5 Klaten · <a href="https://www.smpn5klaten.sch.id" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>www.smpn5klaten.sch.id</a></p>
        </div>
      </footer>

    </main>
  );
}
