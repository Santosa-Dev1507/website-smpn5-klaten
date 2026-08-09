import styles from "./page.module.css";
import Image from "next/image";
import Header from "./components/Header";
import StatsCounter from "./components/StatsCounter";
import ScrollReveal from "./components/ScrollReveal";
import Script from "next/script";
import InstagramFeed from "./components/InstagramFeed";
import SpmbCountdown from "./components/SpmbCountdown";
import AchievementsTab from "./components/AchievementsTab";

// Menggunakan waktu target: 28 Juni 2026 23:59:00 WIB (UTC+7)
const isSpmbOpen = new Date() >= new Date("2026-06-28T23:59:00+07:00");

// ===== KONFIGURASI PENGUMUMAN HASIL TKA =====
// Ubah ke `true` saat pengumuman hasil TKA dibuka, `false` saat sudah lewat masanya
const isTkaOpen = false;

// ===== KONFIGURASI PENGUMUMAN KELULUSAN =====
// Ubah ke `true` saat pengumuman kelulusan dibuka, `false` saat ditutup/disembunyikan
const isKelulusanOpen = false;


// --- DATA PLACEHOLDER (Ganti dengan data asli nanti) ---

const ekskulList = [
  { image: "/PMR.jpg", name: "PMR", desc: "Melatih keterampilan pertolongan pertama dan kepedulian sosial (Palang Merah Remaja)" },
  { image: "/TBQ.jpg", name: "Tuntas Baca Al-Qur'an", desc: "Membangun kemampuan membaca Al-Qur'an dengan tartil dan benar" },
  { image: "/Pramuka.jpg", name: "Pramuka", desc: "Membentuk karakter mandiri, tangguh, dan berjiwa kepemimpinan" },
  { image: "/Jiujitsu.jpg", name: "Jiu Jitsu", desc: "Olahraga bela diri yang melatih disiplin, ketangkasan, dan mental" },
  { image: "/senitari.jpg", name: "Seni Tari", desc: "Mengembangkan bakat seni dan kecintaan terhadap budaya Indonesia" },
  { image: "/PBB.jpg", name: "PBB (Baris Berbaris)", desc: "Melatih kedisiplinan, ketertiban, dan jiwa korsa siswa" },
];

const achievements = [
  // Prestasi 2026
  { year: "2026", title: "Juara 1 Lomba Gebyar Inovasi Pendidikan kategori guru SMP", level: "Bapak Budi Santosa, S.Pd.I (Aplikasi RihlahQu) — Tingkat Kabupaten Klaten (6 Agt 2026)", cat: "Guru" },
  { year: "2026", title: "Juara 3 Lomba Yel-Yel Anti Korupsi", level: "Tim Yel-Yel Blue & She — Klaten Integrity Challenge di Graha Bung Karno Klaten", cat: "Siswa" },
  { year: "2026", title: "Juara 3 Kejurkab Tinju Kelompok Umur Tahun 2026", level: "Vania Regina Putri (Kelas VIII A) — di GOR GELARSENA Klaten", cat: "Siswa" },
  { year: "2026", title: "Juara 3 POPDA Tenis Lapangan", level: "Muhammad Ghazi Amzar (Kelas IX E) — Tingkat Kabupaten Klaten", cat: "Siswa" },
  // Prestasi Sekolah
  { year: "2025", title: "Sekolah Adiwiyata Nasional", level: "Penghargaan Nasional — Kementerian LHK RI", cat: "Sekolah" },
  // Prestasi Guru
  { year: "2025", title: "Juara 2 Festival Paduan Suara HGN", level: "Tingkat Kabupaten Klaten — Tim Guru SMPN 5", cat: "Guru" },
  { year: "2025", title: "Narasumber Pembelajaran Mendalam Guru IPS", level: "Santi Nurrohmawati, SE — Tingkat Kabupaten", cat: "Guru" },
  // Prestasi Siswa
  { year: "2025", title: "Juara 1 Senam Anak Indonesia Hebat", level: "Fahira, Aryana, Triska — Tingkat Kabupaten Klaten", cat: "Siswa" },
  { year: "2024", title: "Juara 1 Jumbara PMR Kabupaten Klaten", level: "Adinda Putri & Aisyah Sarifa — Kelas 9H", cat: "Siswa" },
  { year: "2024", title: "Juara 3 Open Kata Karate Inkai Cup", level: "Khanza Shaulika — Tingkat Kabupaten Klaten", cat: "Siswa" },
  { year: "2024", title: "Juara 2 & 3 Nulis Cerkak Bahasa Jawa", level: "Briliant Ardie & Ismy Ayu — Tingkat Kabupaten", cat: "Siswa" },
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

      <ScrollReveal />
      <Header activePage="Beranda" />

      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero} id="beranda">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Sekolah Adiwiyata Tingkat Nasional</div>
          <h1 className={styles.heroTitle}>
            <span className="staggerWord">Setiap&nbsp;</span>
            <span className="staggerWord">Anak&nbsp;</span>
            <span className="staggerWord">Punya&nbsp;</span>
            <span className={`staggerWord ${styles.underlineHighlight}`}>Cara Sendiri</span>
            <span className="staggerWord">&nbsp;untuk&nbsp;</span>
            <span className="staggerWord">Jadi&nbsp;</span>
            <span className={`staggerWord ${styles.highlightRed}`}>JUARA.</span>
          </h1>
          <p className={styles.heroDescription}>
            Bukan sekolah biasa — tempat anak Anda dikenal namanya, ditemukan bakatnya,
            dan disiapkan untuk masa depan yang lebih dari sekadar nilai.
          </p>

          {isKelulusanOpen && (
            <div className={styles.announcementAlert}>
              <div className={styles.announcementIcon}>🎓</div>
              <div className={styles.announcementText}>
                <strong>Pengumuman Kelulusan TA 2025/2026</strong>
              </div>
              <a href="/pengumuman" className={styles.btnAnnouncement}>Cek Kelulusan</a>
            </div>
          )}

          {isTkaOpen && (
            <div className={styles.announcementAlert}>
              <div className={styles.announcementIcon}>📊</div>
              <div className={styles.announcementText}>
                <strong>Hasil Tes Kemampuan Akademik (TKA) Sudah Tersedia</strong>
              </div>
              <a href="/hasiltka" className={styles.btnAnnouncement}>Cek Hasil TKA</a>
            </div>
          )}

          <div className={styles.heroActions}>
            <a href="/ekstrakurikuler" className={styles.btnPrimary}>Pendaftaran Ekskul</a>
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
            <div className={styles.floatingCard} data-loop>
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
      <StatsCounter />

      {/* ===== NILAI JUARA ===== */}
      <section className={styles.values} id="profil">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Karakter &amp; Nilai</div>
          <h2>Lima nilai yang membentuk siswa <span className={styles.highlightRed}>siap menghadapi dunia nyata</span></h2>
          <p>Bukan hafalan, bukan teori — ini cara kami membentuk anak Anda menjadi pribadi <strong>JUARA</strong> yang kuat dari dalam.</p>
        </div>
        <div className={styles.valuesGrid}>
          {[
            { letter: "J", title: "Jujur", desc: "Kami membiasakan siswa berkata dan bertindak apa adanya — karena kejujuran adalah fondasi kepercayaan yang dibutuhkan di mana pun.", color: "#944535" },
            { letter: "U", title: "Unggul", desc: "Setiap anak punya keunggulan yang berbeda. Tugas kami menemukan dan mengembangkannya — bukan menyeragamkan.", color: "#C0622F" },
            { letter: "A", title: "Amanah", desc: "Dari tugas kecil hingga peran besar, siswa belajar bahwa tanggung jawab bukan beban — tapi bukti kepercayaan.", color: "#944535" },
            { letter: "R", title: "Religius", desc: "Karakter yang kuat dimulai dari dalam. Kami membimbing siswa tumbuh dengan akhlak yang baik sebagai kompas hidupnya.", color: "#C0622F" },
            { letter: "A", title: "Aktif & Berdaya", desc: "Siswa kami tidak hanya belajar — mereka berkarya, berkontribusi, dan memberi dampak nyata bagi lingkungan sekitarnya.", color: "#944535" },
          ].map((v, i) => (
            <div key={i} className={`${styles.valueCard} reveal`}>
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
          <h2>Belajar yang <span className={styles.highlightRed}>menyiapkan, bukan sekadar mengajar</span></h2>
          <p>Kurikulum kami dirancang agar siswa tidak hanya tahu jawabannya — tapi tahu cara berpikir, bekerja sama, dan berkembang.</p>
        </div>
        <div className={styles.kurikulumGrid}>
          {[
            { icon: "📚", title: "Kurikulum Merdeka", desc: "Siswa belajar sesuai minat dan kemampuannya — bukan satu ukuran untuk semua. Lebih mandiri, lebih bermakna." },
            { icon: "🎓", title: "Program Unggulan", desc: "Literasi, numerasi, dan pembentukan karakter bukan pelajaran terpisah — tapi menyatu dalam setiap kegiatan belajar." },
            { icon: "👥", title: "Belajar Bersama", desc: "Siswa belajar cara berdiskusi, mendengarkan, dan menyelesaikan masalah bersama — skill yang dibutuhkan di dunia nyata." },
            { icon: "✅", title: "Penilaian Menyeluruh", desc: "Kami tidak hanya menilai dari ujian. Sikap, kreativitas, dan proses belajar siswa sama pentingnya." },
          ].map((k, i) => (
            <div key={i} className={`${styles.kurikulumCard} reveal`}>
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
            <div key={i} className={`${styles.ekskulCardOverlay} reveal`} style={{ backgroundImage: `url(${e.image})` }}>
              <div className={styles.ekskulOverlay}>
                <h4>{e.name}</h4>
                <p>{e.desc}</p>
              </div>
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
            <p>Prestasi bukan kebetulan. Ini hasil kerja keras siswa, guru, dan seluruh keluarga ESPEMA dalam beberapa tahun terakhir.</p>
            <div className={styles.achievementHighlight}>
              <span>Sekolah Adiwiyata Nasional 2025 — penghargaan tertinggi bidang lingkungan hidup dari Kementerian LHK RI</span>
            </div>
          </div>
          <AchievementsTab achievements={achievements} />
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Kata Mereka</div>
          <h2>Apa kata mereka yang <span className={styles.highlightRed}>pernah ada di sini?</span></h2>
          <p>Bukan janji kami — tapi cerita nyata dari alumni yang telah merasakan sendiri menjadi bagian dari ESPEMA.</p>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`${styles.testimonialCard} reveal`}>
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
                  Hanya <strong>256 kuota siswa</strong> tersedia untuk tahun ajaran 2026/2027.{" "}
                  Daftarkan putra-putri Anda lebih awal &mdash; sebelum tempat habis dan kesempatan ini terlewat.
                </p>
                <div className={styles.ppdbActions}>
                  <a href="/spmb" className={styles.btnPpdbPrimary}>Daftar Siswa Baru →</a>
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
                <SpmbCountdown />
                <div className={styles.ppdbActions} style={{ marginTop: "1.5rem" }}>
                  <a href="https://chat.whatsapp.com/CQbZAGUZmb22MOKr4LnWmz?mlu=2&s=em&p=a" target="_blank" rel="noopener noreferrer" className={styles.btnPpdbPrimary}>💬 Gabung Grup WhatsApp</a>
                  <a href="/spmb" className={styles.btnPpdbSecondary}>Lihat Informasi SPMB</a>
                </div>
              </>
            )}

          </div>
          <div className={styles.ppdbDecor}>
            {/* ── CIRCULAR STAMP ── */}
            <div className={styles.gratisStamp}>
              <span>Seluruh</span>
              <span>Proses SPMB</span>
              <span className={styles.gratisStampMain}>TIDAK</span>
              <span className={styles.gratisStampMain}>DIPUNGUT</span>
              <span>Biaya</span>
            </div>
            <div className={styles.ppdbImageWrapper}>
              <img src="/foto-spmb.png" alt="Siswa Berprestasi" className={styles.ppdbImage} />
            </div>
            <div className={styles.ppdbInfo}>
              <div className={styles.ppdbInfoItem}><strong>29 Juni 2026</strong><span>Pendaftaran</span></div>
              <div className={styles.ppdbInfoDivider}></div>
              <div className={styles.ppdbInfoItem}><strong>4 Juli 2026</strong><span>Pengumuman</span></div>
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
          <h2>Kabar Para <span className={styles.highlightRed}>Juara</span></h2>
          <p>Prestasi terbaru, info SPMB, dan kegiatan siswa — semua yang perlu Anda tahu ada di sini.</p>
        </div>
        <div className={styles.newsGrid}>
          {news.map((n, i) => (
            <article key={i} className={`${styles.newsCard} reveal`}>
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

      {/* ===== INSTAGRAM FEED ===== */}
      <InstagramFeed />

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
