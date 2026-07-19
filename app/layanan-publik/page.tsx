"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./layanan.module.css";
import Header from "../components/Header";

// ===== DATA =====
const layanan = [
  {
    id: "ijazah",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Pengambilan Ijazah",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan pengambilan ijazah kelulusan bagi siswa yang telah menyelesaikan pendidikan.",
    syarat: [
      "Kartu identitas diri (KTP/KK orang tua)",
      "Kartu Pelajar atau Bukti Lulus",
      "Sidik jari di TU sekolah",
      "Surat kuasa (jika diwakilkan)",
    ],
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
    waktu: "1 hari kerja",
  },
  {
    id: "ijazah-rusak",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Ijazah Hilang / Rusak",
    badge: "Gratis",
    badgeType: "free",
    desc: "Pengurusan surat keterangan pengganti ijazah yang hilang atau rusak sesuai prosedur dinas.",
    syarat: [
      "Surat kehilangan dari Kepolisian (jika hilang)",
      "Ijazah asli yang rusak (jika rusak)",
      "Fotokopi KTP/KK orang tua yang dilegalisir",
      "Foto terbaru ukuran 3x4 (2 lembar)",
      "Surat permohonan bermaterai",
    ],
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
    waktu: "3–5 hari kerja",
  },
  {
    id: "mutasi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: "Mutasi Siswa",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan perpindahan siswa masuk atau keluar dari SMPN 5 Klaten sesuai prosedur dinas pendidikan.",
    syarat: [
      "Surat permohonan mutasi dari orang tua/wali",
      "Rapor terakhir yang dilegalisir",
      "Surat pindah dari sekolah asal (mutasi masuk)",
      "Kartu Keluarga (KK)",
      "Rekomendasi dari Dinas Pendidikan",
    ],
    jadwal: "Sen–Kam 07.30–12.00 · Jumat 07.30–10.00 · Sabtu 07.30–11.30 WIB",
    waktu: "3–5 hari kerja",
  },
  {
    id: "perpustakaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Layanan Perpustakaan",
    badge: "Gratis",
    badgeType: "free",
    desc: "Akses koleksi buku, e-library, dan fasilitas ruang baca yang nyaman untuk siswa dan warga sekolah.",
    syarat: [
      "Kartu Pelajar / Kartu Anggota Perpustakaan",
      "Pendaftaran anggota bagi siswa baru",
      "Menaati tata tertib perpustakaan",
    ],
    jadwal: "Sen–Kam 07.00–13.30 · Jumat 07.00–10.45 · Sabtu 07.00–12.15 WIB",
    waktu: "Langsung",
  },
  {
    id: "ekstrakurikuler",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Layanan Ekstrakurikuler",
    badge: "Tersedia",
    badgeType: "info",
    desc: "Daftarkan minat dan bakat Anda di lebih dari 15 pilihan kegiatan ekstrakurikuler yang tersedia.",
    syarat: [
      "Siswa aktif SMPN 5 Klaten",
      "Mengisi formulir pendaftaran ekskul",
      "Persetujuan orang tua/wali",
      "Pendaftaran dibuka setiap awal semester",
    ],
    jadwal: "Disesuaikan per kegiatan",
    waktu: "Langsung diterima",
  },
  {
    id: "spmb",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "SPMB",
    badge: "Gratis",
    badgeType: "free",
    desc: "Panduan penerimaan peserta didik baru melalui jalur zonasi, prestasi, afirmasi, dan perpindahan tugas.",
    syarat: [
      "Kartu Keluarga (KK) dengan NIK valid",
      "Akta Kelahiran",
      "Ijazah / SKHUN SD/MI",
      "Dokumen pendukung jalur prestasi/afirmasi",
      "Pendaftaran melalui portal online resmi",
    ],
    jadwal: "Disesuaikan jadwal SPMB Dinas",
    waktu: "Sesuai tahapan SPMB",
  },
];

const tataKelola = [
  {
    id: "kebijakan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Kebijakan & Maklumat",
    content: [
      { label: "Visi Pelayanan", value: "Mewujudkan SIPP sebagai portal pelayanan pendidikan yang transparan, akuntabel, dan prima bagi seluruh masyarakat." },
      { label: "Maklumat", value: "Kami berkomitmen memberikan pelayanan melalui SIPP sesuai standar yang ditetapkan, dan siap menerima sanksi apabila tidak menepati janji ini." },
      { label: "Standar Waktu", value: "Setiap permohonan layanan melalui SIPP diselesaikan sesuai SOP dengan rentang waktu 1–5 hari kerja, tergantung jenis layanan." },
      { label: "Biaya Layanan", value: "Seluruh layanan administratif melalui SIPP tidak dipungut biaya (GRATIS / Rp 0)." },
    ],
  },
  {
    id: "sdm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "SDM & Sarpras",
    content: [
      { label: "Kompetensi Petugas", value: "Semua petugas pelayanan telah mendapatkan pelatihan standar pelayanan publik dan diklat administrasi pendidikan." },
      { label: "Fasilitas Ruang Tunggu", value: "Tersedia ruang tunggu yang nyaman dengan kursi, kipas angin, dan nomor antrian di kantor Tata Usaha." },
      { label: "Aksesibilitas", value: "Fasilitas sekolah dilengkapi akses bagi penyandang disabilitas sesuai standar nasional." },
      { label: "Waktu Operasional", value: "Senin – Kamis 07.00–14.00 WIB | Jumat 07.00–11.00 WIB | Sabtu 07.00–12.30 WIB. Pelayanan TU: 07.30–13.00 WIB." },
    ],
  },
  {
    id: "inovasi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
    title: "SIPP & Inovasi",
    content: [
      { label: "Platform SIPP", value: "SMPN 5 Klaten mengoperasikan SIPP (Sistem Informasi Pelayanan Publik) sebagai portal resmi untuk transparansi dan efisiensi seluruh layanan administratif." },
      { label: "Portal Resmi", value: "Informasi layanan, pengumuman, dan berita sekolah dapat diakses melalui SIPP di smpn5klaten.sch.id." },
      { label: "Inovasi SIPP", value: "SIPP terus dikembangkan dengan mengintegrasikan fitur digital untuk mempermudah pengajuan, pemantauan, dan evaluasi layanan." },
      { label: "Media Sosial", value: "Ikuti akun resmi sekolah untuk informasi terkini dan pengumuman penting dari SIPP." },
    ],
  },
  {
    id: "tambahan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: "Biaya & Hak Pengguna",
    content: [
      { label: "Biaya Layanan", value: "Semua layanan administratif SMPN 5 Klaten GRATIS (Rp 0). Tidak ada pungutan dalam bentuk apapun." },
      { label: "Pengaduan Pungli", value: "Jika menemukan pungutan liar, segera laporkan melalui formulir pengaduan atau langsung ke Kepala Sekolah." },
      { label: "Transparansi", value: "Data layanan dan penyelenggaraan pendidikan dapat diakses publik melalui portal SP4N-LAPOR! dan SIPPN." },
      { label: "Hak Pengguna", value: "Setiap pengguna layanan berhak mendapatkan pelayanan yang adil, tidak diskriminatif, dan sesuai standar yang berlaku." },
    ],
  },
];

// ===== COMPONENT =====
export default function LayananPublikPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("kebijakan");
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Parallax — direct DOM write, zero React re-renders
  useEffect(() => {
    const el = heroBgRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveModal(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  const activeLayanan = layanan.find((l) => l.id === activeModal);

  return (
    <main className={styles.main}>
      <Header activePage="Layanan" />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} ref={heroBgRef} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
            <a href="/">Beranda</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">SIPP</span>
          </nav>
          <div className={styles.heroBadge} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SIPP &mdash; SMP Negeri 5 Klaten
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>Sistem Informasi</span>
            <span className={styles.heroLineAccent}>Pelayanan Publik</span>
            <span className={styles.heroLine3}>SMP Negeri 5 Klaten</span>
          </h1>
          <p className={styles.heroDesc}>
            SIPP adalah portal terpadu untuk mengakses seluruh layanan administratif sekolah secara transparan, akuntabel, dan gratis.
          </p>
          <div className={styles.heroCtas}>
            <a href="#layanan" className={styles.ctaPrimary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Lihat Layanan
            </a>
            <a href="#pengaduan" className={styles.ctaSecondary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Ajukan Pengaduan
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.heroStats} aria-label="Statistik layanan">
          {[
            { value: "6", label: "Jenis Layanan" },
            { value: "Rp 0", label: "Biaya Layanan" },
            { value: "≤5", label: "Hari Proses" },
            { value: "6x", label: "Hari/Minggu" },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN UTAMA */}
      <section id="layanan" className={styles.layananSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} reveal`}>
            <span className={styles.sectionPill}>Layanan SIPP</span>
            <h2 className={styles.sectionTitle}>
              Layanan yang Tersedia di <span className={styles.accent}>SIPP</span>
            </h2>
            <p className={styles.sectionDesc}>
              Seluruh layanan administratif SMPN 5 Klaten tersedia melalui SIPP secara gratis dan transparan. Klik kartu untuk melihat persyaratan lengkap.
            </p>
          </div>

          <div className={styles.layananGrid}>
            {layanan.map((item, i) => (
              <button
                key={item.id}
                className={`${styles.layananCard} reveal`}
                style={{ transitionDelay: `${i * 55}ms` }}
                aria-label={`Lihat syarat layanan ${item.title}`}
                onClick={() => setActiveModal(item.id)}
              >
                <div className={styles.cardIconWrap}>
                  <div className={styles.cardIcon}>{item.icon}</div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardTitle}>{item.title}</span>
                    <span className={`${styles.cardBadge} ${item.badgeType === "free" ? styles.badgeFree : styles.badgeInfo}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardMeta}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{item.waktu}</span>
                  </div>
                  <span className={styles.cardCta} aria-hidden="true">
                    Lihat Syarat
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TATA KELOLA */}
      <section id="tata-kelola" className={styles.tataKelolaSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} reveal`}>
            <span className={styles.sectionPill}>Standar Pelayanan</span>
            <h2 className={styles.sectionTitle}>
              Tata Kelola <span className={styles.accent}>SIPP</span>
            </h2>
            <p className={styles.sectionDesc}>
              Prinsip dan standar yang menjadi landasan SIPP dalam memberikan pelayanan yang berkualitas, akuntabel, dan bertanggung jawab.
            </p>
          </div>

          <div className={`${styles.accordionWrapper} reveal`}>
            {/* Sidebar tabs */}
            <div className={styles.accordionNav} role="tablist" aria-label="Kategori tata kelola">
              {tataKelola.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={activeAccordion === item.id}
                  aria-controls={`panel-${item.id}`}
                  className={`${styles.accordionNavBtn} ${activeAccordion === item.id ? styles.accordionNavActive : ""}`}
                  onClick={() => setActiveAccordion(item.id)}
                >
                  <span className={styles.accordionNavIcon}>{item.icon}</span>
                  <span className={styles.accordionNavLabel}>{item.title}</span>
                  <svg className={styles.accordionNavArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className={styles.accordionPanel}>
              {tataKelola.map((item) => (
                <div
                  key={item.id}
                  id={`panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${item.id}`}
                  className={`${styles.accordionContent} ${activeAccordion === item.id ? styles.accordionContentActive : ""}`}
                >
                  <div className={styles.panelHeader}>
                    <div className={styles.panelIconWrap}>{item.icon}</div>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={styles.panelItems}>
                    {item.content.map((c) => (
                      <div key={c.label} className={styles.panelItem}>
                        <div className={styles.panelItemLabel}>{c.label}</div>
                        <div className={styles.panelItemValue}>{c.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PENGADUAN & AKSI */}
      <section id="pengaduan" className={styles.actionSection}>
        <div className={styles.container}>
          <div className={styles.actionGrid}>
            {/* Form Card */}
            <div className={`${styles.formCard} reveal`}>
              <div className={styles.formCardHeader}>
                <div className={styles.formCardIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  {/* h3 bukan h2 — menjaga hierarki heading yang benar */}
                  <h3 className={styles.formCardTitle}>Formulir Pengaduan SIPP</h3>
                  <p className={styles.formCardSubtitle}>Sampaikan keluhan atau masukan layanan kepada kami</p>
                </div>
              </div>

              <form className={styles.form} noValidate>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nama" className={styles.formLabel}>
                      Nama Lengkap <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="nama"
                      type="text"
                      className={styles.formInput}
                      placeholder="Masukkan nama lengkap"
                      disabled
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="kontak" className={styles.formLabel}>
                      Email / No. WhatsApp <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="kontak"
                      type="text"
                      className={styles.formInput}
                      placeholder="email@contoh.com atau 08xx"
                      disabled
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="kategori" className={styles.formLabel}>
                    Kategori Layanan <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <select id="kategori" className={styles.formSelect} disabled>
                    <option value="">-- Pilih Kategori --</option>
                    <option>Pengambilan Ijazah</option>
                    <option>Ijazah Hilang / Rusak</option>
                    <option>Mutasi Siswa</option>
                    <option>Layanan Perpustakaan</option>
                    <option>Ekstrakurikuler</option>
                    <option>SPMB</option>
                    <option>Pungutan Liar (Pungli)</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pesan" className={styles.formLabel}>
                    Isi Laporan / Pengaduan <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="pesan"
                    className={styles.formTextarea}
                    placeholder="Ceritakan secara detail laporan atau masukan Anda..."
                    rows={4}
                    disabled
                  />
                </div>

                {/* Formulir menunggu tautan */}
                <div className={styles.formComingSoon} role="status">
                  <div className={styles.formComingSoonIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={26} height={26} aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <strong>Tautan Formulir Segera Hadir</strong>
                    <p>Formulir digital sedang dalam proses penyiapan. Gunakan saluran di bawah ini untuk pengaduan saat ini.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/62895377815555?text=Halo%20SMPN%205%20Klaten%2C%20saya%20ingin%20menyampaikan%20pengaduan%20layanan..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.formSubmitAlt}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Kirim via WhatsApp
                </a>
              </form>
            </div>

            {/* Saluran eksternal + jam */}
            <div className={styles.actionLinks}>
              <div className={`${styles.actionCard} reveal`} style={{ transitionDelay: "80ms" }}>
                <h3 className={styles.actionCardTitle}>Saluran Pengaduan Resmi</h3>
                <div className={styles.externalLinks}>
                  {[
                    {
                      href: "https://www.lapor.go.id",
                      label: "Buka portal SP4N-LAPOR! di tab baru",
                      cls: styles.extLinkLapor,
                      name: "SP4N-LAPOR!",
                      desc: "Portal pengaduan nasional terintegrasi",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      ),
                    },
                    {
                      href: "https://sippn.menpan.go.id",
                      label: "Buka portal SIPPN di tab baru",
                      cls: styles.extLinkSippn,
                      name: "SIPPN",
                      desc: "Sistem Informasi Pelayanan Publik Nasional",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      ),
                    },
                    {
                      href: "https://wa.me/62895377815555?text=Halo%20SMPN%205%20Klaten%2C%20saya%20ingin%20bertanya%20tentang%20layanan...",
                      label: "Hubungi SMPN 5 Klaten via WhatsApp",
                      cls: styles.extLinkWa,
                      name: "WhatsApp Sekolah",
                      desc: "0895-3778-15555 — respons cepat",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                    },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.extLink} ${link.cls}`}
                      aria-label={link.label}
                    >
                      <div className={styles.extLinkIcon}>{link.icon}</div>
                      <div className={styles.extLinkBody}>
                        <strong>{link.name}</strong>
                        <span>{link.desc}</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} className={styles.extArrow} aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Jam operasional */}
              <div className={`${styles.operasionalCard} reveal`} style={{ transitionDelay: "160ms" }}>
                <div className={styles.operasionalHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={19} height={19} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3>Jam Operasional</h3>
                </div>
                <div className={styles.jamList}>
                  {[
                    { hari: "Senin – Kamis", jam: "07.00 – 14.00 WIB", active: true },
                    { hari: "Jumat", jam: "07.00 – 11.00 WIB", active: true },
                    { hari: "Sabtu", jam: "07.00 – 12.30 WIB", active: true },
                    { hari: "Minggu", jam: "Tutup", active: false },
                  ].map((j) => (
                    <div key={j.hari} className={`${styles.jamItem} ${!j.active ? styles.jamClosed : ""}`}>
                      <span className={styles.jamHari}>{j.hari}</span>
                      <span className={styles.jamWaktu}>{j.jam}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.operasionalNote}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Layanan TU: 07.30 – 13.00 WIB (Senin – Sabtu)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/logo_smpn5.png" alt="Logo SMPN 5 Klaten" width={44} height={44} />
            <div>
              <strong>SMP Negeri 5 Klaten</strong>
              <span>Generasi JUARA</span>
            </div>
          </div>
          <div className={styles.footerMeta}>
            <div className={styles.footerContact}>
              <address className={styles.footerAddress}>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Jl. Kendali Sodo, Jomboran, Klaten Tengah, Klaten
                </span>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.47 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (0272) 321487
                </span>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  smpn5klaten@gmail.com
                </span>
              </address>
            </div>
            <p className={styles.footerCopy}>&#169; 2026 SMPN 5 Klaten &#8212; Tempat Tumbuhnya Generasi JUARA.</p>
            <a href="/" className={styles.footerBack}>&#8592; Kembali ke Beranda</a>
          </div>
        </div>
      </footer>

      {/* MODAL SYARAT */}
      {activeLayanan && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Syarat layanan ${activeLayanan.title}`}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setActiveModal(null)}
              aria-label="Tutup modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>{activeLayanan.icon}</div>
              <div>
                <h2 className={styles.modalTitle}>{activeLayanan.title}</h2>
                <span className={`${styles.cardBadge} ${activeLayanan.badgeType === "free" ? styles.badgeFree : styles.badgeInfo}`}>
                  {activeLayanan.badge}
                </span>
              </div>
            </div>

            <p className={styles.modalDesc}>{activeLayanan.desc}</p>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} aria-hidden="true">
                  <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                Persyaratan Dokumen
              </h3>
              <ul className={styles.modalList}>
                {activeLayanan.syarat.map((s) => (
                  <li key={s} className={styles.modalListItem}>
                    <span className={styles.modalListDot} aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.modalMeta}>
              <div className={styles.modalMetaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span>Jadwal</span>
                  <strong>{activeLayanan.jadwal}</strong>
                </div>
              </div>
              <div className={styles.modalMetaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <span>Estimasi</span>
                  <strong>{activeLayanan.waktu}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <a
                href="#pengaduan"
                className={styles.modalBtnSecondary}
                onClick={() => setActiveModal(null)}
              >
                Butuh Bantuan?
              </a>
              <button className={styles.modalBtnPrimary} onClick={() => setActiveModal(null)}>
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
