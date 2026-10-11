"use client";

import { useState, useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import { daftarOsis, type OsisPendaftaranPayload } from "./actions";
import styles from "./osis-daftar.module.css";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Award,
  Users,
  FileText,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Send,
  Home,
  Check,
} from "lucide-react";

// ── Data & Konstanta ─────────────────────────────────────────────────────────

const TAHUN_AJARAN = "2026/2027";

const TIMELINE = [
  {
    step: 1,
    stage: "Pendaftaran",
    dates: "12–14 Oktober 2026",
    accent: "#944535",
    badgeBg: "rgba(148, 69, 53, 0.08)",
    badgeColor: "#944535",
    statusText: "Tahap 1",
    items: [
      "Pengisian formulir pendaftaran daring",
      "Penyerahan berkas fisik persyaratan ke Bu Dewi Widayati",
      "Verifikasi keabsahan data administrasi calon",
    ],
  },
  {
    step: 2,
    stage: "Seleksi & Wawancara",
    dates: "19–21 Oktober 2026",
    accent: "#782e21",
    badgeBg: "rgba(120, 46, 33, 0.08)",
    badgeColor: "#782e21",
    statusText: "Tahap 2",
    items: [
      "Penyampaian visi & misi bakal calon",
      "Wawancara kepemimpinan, kepribadian & komitmen",
      "Penilaian kompetensi dan pengumuman calon tetap",
    ],
  },
  {
    step: 3,
    stage: "Pemilihan & Orasi",
    dates: "27 Oktober 2026",
    accent: "#b45309",
    badgeBg: "rgba(180, 83, 9, 0.08)",
    badgeColor: "#b45309",
    statusText: "Tahap 3",
    items: [
      "Presentasi calon dan orasi terbuka program kerja",
      "Pemungutan suara secara online dan penetapan ketua OSIS terpilih",
    ],
  },
];

const SYARAT_UMUM = [
  {
    text: "Siswa aktif SMP Negeri 5 Klaten kelas VII atau kelas VIII",
  },
  {
    text: "Memiliki nilai rata-rata rapor minimal 75",
    sub: "* Khusus bagi siswa kelas VII, menggunakan nilai ASTS (Asesmen Sumatif Tengah Semester) ganjil",
  },
  {
    text: "Berkelakuan baik, berakhlak mulia, serta tidak pernah mendapatkan sanksi tata tertib sekolah",
  },
  {
    text: "Memiliki jiwa kepemimpinan, integritas, dan kemampuan komunikasi yang baik",
  },
  {
    text: "Bersedia berkomitmen penuh dan bertanggung jawab selama masa bakti kepengurusan",
  },
];

const KOMPETENSI = [
  "Kemampuan komunikasi publik, presentasi, dan orasi ide",
  "Visi dan misi kepengurusan yang realistis, solutif, dan inovatif",
  "Pengalaman organisasi atau kepanitiaan (menjadi nilai tambah)",
  "Kecakapan kerja sama tim (teamwork) dan penyelesaian masalah (problem solving)",
  "Dedikasi, loyalitas, dan integritas tinggi terhadap nama baik almamater",
];

const KELAS_OPTIONS = [
  "VII A", "VII B", "VII C", "VII D", "VII E", "VII F", "VII G", "VII H",
  "VIII A", "VIII B", "VIII C", "VIII D", "VIII E", "VIII F", "VIII G", "VIII H",
];

const POSISI_OPTIONS = [
  "Ketua OSIS",
  "Wakil Ketua OSIS",
  "Sekretaris I",
  "Sekretaris II",
  "Bendahara I",
  "Bendahara II",
  "Seksi Ketaqwaan & Budi Pekerti Luhur",
  "Seksi Kepribadian Unggul & Wawasan Kebangsaan",
  "Seksi Prestasi Akademik & IPTEK",
  "Seksi Kreativitas, Seni & Budaya",
  "Seksi Kebugaran Jasmani & Olahraga",
  "Seksi Demokrasi, HAM & Pendidikan Politik",
  "Seksi Lingkungan Hidup & Kebersihan",
  "Seksi Teknologi Informasi & Komunikasi",
];

type Step = "form" | "loading" | "success";

export default function OsisDaftarClient() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedCandidate, setSubmittedCandidate] = useState<{
    nama: string;
    posisi: string;
    kelas: string;
  } | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const handleWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setWordCount(0);
      return;
    }
    const words = trimmed.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string ?? "").trim();

    const payload: OsisPendaftaranPayload = {
      nama_lengkap: get("nama_lengkap"),
      nisn: get("nisn"),
      kelas: get("kelas"),
      no_wa: get("no_wa"),
      posisi: get("posisi"),
      visi_misi: get("visi_misi"),
      prestasi_akademik: get("prestasi_akademik"),
      prestasi_non_akademik: get("prestasi_non_akademik"),
      pengalaman_organisasi: get("pengalaman_organisasi"),
    };

    // ── Validasi Klien ──────────────────────────────────────────
    if (!payload.nama_lengkap) {
      setErrorMsg("Nama lengkap wajib diisi sesuai identitas sekolah.");
      return;
    }
    if (!payload.nisn || !/^\d{10}$/.test(payload.nisn)) {
      setErrorMsg("NISN wajib terdiri dari 10 digit angka yang sah.");
      return;
    }
    if (!payload.kelas) {
      setErrorMsg("Silakan pilih kelas Anda saat ini (Kelas VII atau VIII).");
      return;
    }
    if (!payload.no_wa || !/^08\d{8,11}$/.test(payload.no_wa)) {
      setErrorMsg("Nomor WhatsApp wajib aktif dengan format 08xxxxxxxxxx (10–13 digit).");
      return;
    }
    if (!payload.posisi) {
      setErrorMsg("Silakan pilih posisi kepengurusan yang Anda minati.");
      return;
    }
    if (!payload.visi_misi) {
      setErrorMsg("Visi & Misi wajib diisi untuk penilaian awal.");
      return;
    }

    const words = payload.visi_misi.trim().split(/\s+/).filter(Boolean);
    if (words.length > 500) {
      setErrorMsg("Visi & Misi tidak boleh melebihi 500 kata.");
      return;
    }

    if (!agreed) {
      setErrorMsg("Harap centang surat pernyataan kesediaan sebelum mengirimkan pendaftaran.");
      return;
    }

    setSubmittedCandidate({
      nama: payload.nama_lengkap,
      posisi: payload.posisi,
      kelas: payload.kelas,
    });
    setStep("loading");

    try {
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), 20000)
      );
      const result = await Promise.race([daftarOsis(payload), timeout]);

      if (result.success) {
        setStep("success");
      } else {
        setErrorMsg(result.message);
        setStep("form");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message === "timeout"
          ? "Pengiriman formulir memakan waktu terlalu lama. Periksa koneksi internet Anda dan coba lagi."
          : "Terjadi gangguan sistem. Silakan coba beberapa saat lagi."
      );
      setStep("form");
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ── Top Header Navigation ── */}
      <Header activePage="Pendaftaran OSIS" />

      {/* ── Breadcrumb Bar ── */}
      <nav className={styles.breadcrumbBar} aria-label="Navigasi rekam jejak">
        <div className={styles.breadcrumbInner}>
          <Link href="/" className={styles.breadcrumbLink}>
            Beranda
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden>
            /
          </span>
          <Link href="/ekstrakurikuler" className={styles.breadcrumbLink}>
            Ekskul
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden>
            /
          </span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            Pendaftaran OSIS
          </span>
        </div>
      </nav>

      {/* ── Hero Section (School Brand Identity) ── */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroSubtitle}>
              Tahun Ajaran {TAHUN_AJARAN}
            </p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Pendaftaran Calon Pengurus OSIS
            </h1>
            <p className={styles.heroDescription}>
              Bergabunglah dengan Organisasi Siswa Intra Sekolah (OSIS) SMP Negeri 5
              Klaten. Wujudkan ide kreatif, asah kepemimpinan, dan bangun
              lingkungan sekolah yang berprestasi dan berkarakter.
            </p>
          </div>
          <div className={styles.heroLogoWrap}>
            <Image
              src="/logo_smpn5.png"
              alt="Logo Resmi SMPN 5 Klaten"
              width={88}
              height={88}
              className={styles.heroLogo}
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Main Body Content ── */}
      {step === "loading" ? (
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <div className={styles.loadingSpinner} aria-hidden />
          <p className={styles.loadingText}>
            Sedang memproses pendaftaran {submittedCandidate?.nama}…
          </p>
          <p className={styles.loadingSub}>
            Menyimpan data calon ke pangkalan data panitia seleksi OSIS.
          </p>
        </div>
      ) : step === "success" && submittedCandidate ? (
        <section className={styles.successContainer} aria-live="polite">
          <div className={styles.successCard}>
            <div className={styles.successIconCircle} aria-hidden>
              <Check size={36} strokeWidth={2.6} />
            </div>
            <h2 className={styles.successTitle}>Pendaftaran Berhasil Dikirim!</h2>
            <p className={styles.successName}>{submittedCandidate.nama}</p>
            <p className={styles.successMessage}>
              Formulir pendaftaran calon pengurus OSIS Tahun Ajaran {TAHUN_AJARAN}{" "}
              telah berhasil dicatat oleh sistem.
            </p>

            <div className={styles.successSummaryBox}>
              <h3 className={styles.successSummaryTitle}>
                Ringkasan Pendaftaran
              </h3>
              <ul className={styles.successSummaryList}>
                <li>
                  <strong>Posisi yang Dilamar:</strong> {submittedCandidate.posisi}
                </li>
                <li>
                  <strong>Kelas Saat Ini:</strong> {submittedCandidate.kelas}
                </li>
                <li>
                  <strong>Status Seleksi:</strong> Menunggu Verifikasi Berkas Fisik
                </li>
              </ul>
            </div>

            <div className={styles.docNoticeBox} style={{ width: "100%", marginBottom: "1.75rem", textAlign: "left" }}>
              <div className={styles.docNoticeHeader}>
                <ClipboardList size={18} className={styles.docNoticeHeaderIcon} aria-hidden />
                <h4 className={styles.docNoticeTitle}>
                  Langkah Penting Berikutnya:
                </h4>
              </div>
              <p className={styles.docNoticeLead}>
                Serahkan dokumen fisik persyaratan seleksi secara langsung kepada{" "}
                <span className={styles.docNoticeRecipient}>Bu Dewi Widayati</span>{" "}
                paling lambat saat verifikasi data:
              </p>
              <ul className={styles.docNoticeList}>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>
                    Fotokopi rapor semester terakhir (rata-rata min. 75). Bagi kelas VII menggunakan nilai ASTS semester ganjil.
                  </span>
                </li>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>Surat rekomendasi resmi dari Wali Kelas</span>
                </li>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>Pas foto formal ukuran 3x4 (2 lembar)</span>
                </li>
              </ul>
            </div>

            <div className={styles.successActionRow}>
              <Link href="/" className={styles.btnBackHome}>
                <Home size={16} aria-hidden />
                Kembali ke Beranda
              </Link>
              <button
                type="button"
                className={styles.btnNewForm}
                onClick={() => {
                  setStep("form");
                  setAgreed(false);
                  setWordCount(0);
                  setErrorMsg("");
                  formRef.current?.reset();
                }}
              >
                Daftarkan Calon Lain
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.mainContent}>
          {/* ── Section: Jadwal Rangkaian Kegiatan ── */}
          <section aria-labelledby="timeline-heading">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>
                <Clock size={13} aria-hidden />
                Agenda Resmi
              </span>
              <h2 id="timeline-heading" className={styles.sectionTitle}>
                Jadwal Rangkaian Kegiatan
              </h2>
              <p className={styles.sectionSubtitle}>
                Perhatikan tanggal pelaksanaan setiap tahapan seleksi agar tidak
                terlewat.
              </p>
            </div>

            <div className={styles.timelineGrid}>
              {TIMELINE.map((item) => (
                <article
                  key={item.step}
                  className={styles.timelineCard}
                  style={
                    {
                      "--card-accent": item.accent,
                      "--badge-bg": item.badgeBg,
                      "--badge-color": item.badgeColor,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.timelineCardTop}>
                    <span className={styles.timelineStepNum}>{item.step}</span>
                    <span className={styles.timelineStatusBadge}>
                      {item.statusText}
                    </span>
                  </div>
                  <h3 className={styles.timelineStageName}>{item.stage}</h3>
                  <div className={styles.timelineDates}>
                    <Calendar size={14} aria-hidden />
                    <span>{item.dates}</span>
                  </div>
                  <ul className={styles.timelineItemList}>
                    {item.items.map((desc, idx) => (
                      <li key={idx} className={styles.timelineItem}>
                        <CheckCircle2
                          size={14}
                          className={styles.timelineCheckIcon}
                          aria-hidden
                        />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* ── Section: Syarat & Ketentuan ── */}
          <section aria-labelledby="requirements-heading">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>
                <ShieldCheck size={13} aria-hidden />
                Kualifikasi & Persyaratan
              </span>
              <h2 id="requirements-heading" className={styles.sectionTitle}>
                Syarat & Ketentuan Calon Pengurus
              </h2>
              <p className={styles.sectionSubtitle}>
                Pastikan Anda memenuhi standar kualifikasi kepemimpinan yang telah
                ditetapkan oleh Pembina OSIS.
              </p>
            </div>

            <div className={styles.requirementsGrid}>
              {/* Syarat Umum */}
              <div className={styles.reqCard}>
                <div className={styles.reqCardHeader}>
                  <div className={styles.reqIconCircle}>
                    <CheckCircle2 size={20} aria-hidden />
                  </div>
                  <h3 className={styles.reqCardTitle}>Syarat Umum Pendaftar</h3>
                </div>
                <ul className={styles.reqList}>
                  {SYARAT_UMUM.map((s, i) => (
                    <li key={i} className={styles.reqItem}>
                      <ChevronRight
                        size={16}
                        className={styles.reqItemIcon}
                        aria-hidden
                      />
                      <div>
                        <span>{s.text}</span>
                        {s.sub && (
                          <span className={styles.reqSubNote}>{s.sub}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kompetensi yang Dinilai */}
              <div className={styles.reqCard}>
                <div className={styles.reqCardHeader}>
                  <div className={styles.reqIconCircle}>
                    <Award size={20} aria-hidden />
                  </div>
                  <h3 className={styles.reqCardTitle}>Kompetensi yang Dinilai</h3>
                </div>
                <ul className={styles.reqList}>
                  {KOMPETENSI.map((k, i) => (
                    <li key={i} className={styles.reqItem}>
                      <ChevronRight
                        size={16}
                        className={styles.reqItemIcon}
                        aria-hidden
                      />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dokumen Fisik Notice */}
            <div className={styles.docNoticeBox} role="note">
              <div className={styles.docNoticeHeader}>
                <ClipboardList size={20} className={styles.docNoticeHeaderIcon} aria-hidden />
                <h3 className={styles.docNoticeTitle}>
                  Persyaratan Dokumen Fisik
                </h3>
              </div>
              <p className={styles.docNoticeLead}>
                Dokumen fisik wajib diserahkan langsung saat tahapan verifikasi data
                kepada{" "}
                <span className={styles.docNoticeRecipient}>Bu Dewi Widayati</span>:
              </p>
              <ul className={styles.docNoticeList}>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>
                    Fotokopi rapor semester terakhir (rata-rata minimal 75). *Bagi
                    kelas VII menggunakan nilai ASTS semester ganjil.
                  </span>
                </li>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>Surat rekomendasi resmi dari Wali Kelas masing-masing.</span>
                </li>
                <li className={styles.docNoticeItem}>
                  <CheckCircle2 size={15} className={styles.docNoticeItemIcon} aria-hidden />
                  <span>Pas foto formal ukuran 3x4 berwarna (2 lembar).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* ── Section: Formulir Pendaftaran ── */}
          <section id="formulir" className={styles.formWrapper} aria-labelledby="form-heading">
            <div className={styles.formBanner}>
              <div>
                <h2 id="form-heading" className={styles.formBannerTitle}>
                  Formulir Pendaftaran Calon Pengurus
                </h2>
                <p className={styles.formBannerDesc}>
                  Isi data identitas diri dan visi misi dengan cermat dan jujur.
                </p>
              </div>
              <span className={styles.formBannerBadge}>
                Tahun Ajaran {TAHUN_AJARAN}
              </span>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={styles.formBody}
              noValidate
            >
              {errorMsg && (
                <div
                  className={styles.errorBanner}
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle
                    size={18}
                    className={styles.errorBannerIcon}
                    aria-hidden
                  />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ── 1. Data Diri ── */}
              <div className={styles.formSectionHeader}>
                <span className={styles.formSectionHeaderNumber}>1</span>
                <h3 className={styles.formSectionHeaderText}>
                  Identitas Calon Pengurus
                </h3>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${id}-nama`} className={styles.formLabel}>
                    Nama Lengkap{" "}
                    <span className={styles.requiredMark} aria-label="wajib diisi">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`${id}-nama`}
                    name="nama_lengkap"
                    className={styles.formInput}
                    placeholder="Contoh: Muhammad Rafka Santosa"
                    required
                    autoComplete="name"
                  />
                  <span className={styles.formHelper}>
                    Sesuai nama yang terdaftar di buku induk sekolah
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${id}-nisn`} className={styles.formLabel}>
                    NISN{" "}
                    <span className={styles.requiredMark} aria-label="wajib diisi">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`${id}-nisn`}
                    name="nisn"
                    className={styles.formInput}
                    placeholder="Contoh: 0091234567"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="off"
                  />
                  <span className={styles.formHelper}>
                    10 digit Nomor Induk Siswa Nasional
                  </span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${id}-kelas`} className={styles.formLabel}>
                    Kelas Saat Ini{" "}
                    <span className={styles.requiredMark} aria-label="wajib diisi">
                      *
                    </span>
                  </label>
                  <select
                    id={`${id}-kelas`}
                    name="kelas"
                    className={styles.formSelect}
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Pilih Kelas (VII atau VIII) --
                    </option>
                    {KELAS_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <span className={styles.formHelper}>
                    Hanya terbuka bagi siswa aktif kelas 7 & 8
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${id}-nowa`} className={styles.formLabel}>
                    Nomor WhatsApp Siswa / Orang Tua{" "}
                    <span className={styles.requiredMark} aria-label="wajib diisi">
                      *
                    </span>
                  </label>
                  <input
                    type="tel"
                    id={`${id}-nowa`}
                    name="no_wa"
                    className={styles.formInput}
                    placeholder="08xxxxxxxxxx"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  <span className={styles.formHelper}>
                    Untuk koordinasi seleksi dan grup pengumuman
                  </span>
                </div>
              </div>

              {/* ── 2. Pilihan Posisi & Visi Misi ── */}
              <div className={styles.formSectionHeader}>
                <span className={styles.formSectionHeaderNumber}>2</span>
                <h3 className={styles.formSectionHeaderText}>
                  Posisi & Visi Misi Kepengurusan
                </h3>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${id}-posisi`} className={styles.formLabel}>
                  Posisi yang Dilamar{" "}
                  <span className={styles.requiredMark} aria-label="wajib diisi">
                    *
                  </span>
                </label>
                <select
                  id={`${id}-posisi`}
                  name="posisi"
                  className={styles.formSelect}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Pilih Posisi / Seksi Bidang --
                  </option>
                  {POSISI_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className={styles.formHelper}>
                  Pilih posisi yang paling sesuai dengan minat dan bakat Anda
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${id}-visimisi`} className={styles.formLabel}>
                  <span>
                    Visi & Misi Kepengurusan{" "}
                    <span className={styles.requiredMark} aria-label="wajib diisi">
                      *
                    </span>
                  </span>
                  <span
                    className={`${styles.counterPill} ${
                      wordCount > 500
                        ? styles.counterPillLimit
                        : wordCount > 0
                        ? styles.counterPillValid
                        : ""
                    }`}
                  >
                    {wordCount} / 500 kata
                  </span>
                </label>
                <textarea
                  id={`${id}-visimisi`}
                  name="visi_misi"
                  rows={6}
                  className={styles.formTextarea}
                  placeholder="Tuliskan gagasan utama Anda jika terpilih menjadi pengurus OSIS (apa visi Anda untuk memajukan SMPN 5 Klaten dan program nyata apa yang ingin Anda jalankan)..."
                  required
                  onChange={(e) => handleWordCount(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Maksimal 500 kata. Sampaikan dengan jelas, terstruktur, dan
                  realistis.
                </span>
              </div>

              {/* ── 3. Rekam Jejak & Prestasi ── */}
              <div className={styles.formSectionHeader}>
                <span className={styles.formSectionHeaderNumber}>3</span>
                <h3 className={styles.formSectionHeaderText}>
                  Rekam Jejak, Prestasi & Pengalaman (Opsional)
                </h3>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${id}-aka`} className={styles.formLabel}>
                  Prestasi Akademik
                </label>
                <textarea
                  id={`${id}-aka`}
                  name="prestasi_akademik"
                  rows={3}
                  className={styles.formTextarea}
                  placeholder="Contoh: Juara 2 OSN Matematika Tingkat Kabupaten, Peringkat 1 Paralel Kelas VII (opsional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${id}-nonaka`} className={styles.formLabel}>
                  Prestasi Non-Akademik
                </label>
                <textarea
                  id={`${id}-nonaka`}
                  name="prestasi_non_akademik"
                  rows={3}
                  className={styles.formTextarea}
                  placeholder="Contoh: Juara 1 Turnamen Futsal Antar-SMP, Juara Festival Seni Tari Tradisional (opsional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${id}-org`} className={styles.formLabel}>
                  Pengalaman Organisasi / Kepanitiaan
                </label>
                <textarea
                  id={`${id}-org`}
                  name="pengalaman_organisasi"
                  rows={3}
                  className={styles.formTextarea}
                  placeholder="Contoh: Pengurus Dewan Penggalang Pramuka, Panitia Class Meeting, Ketua Kelas VII C (opsional)"
                />
              </div>

              {/* ── 4. Pernyataan & Persetujuan ── */}
              <div className={styles.agreementBox}>
                <label className={styles.agreementLabel}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className={styles.agreementCheckbox}
                    required
                  />
                  <span>
                    <strong>Surat Pernyataan Kesediaan:</strong> Saya menyatakan
                    bahwa data yang saya isi di atas adalah benar dan dapat
                    dipertanggungjawabkan. Saya bersedia mengikuti seluruh
                    rangkaian seleksi serta berkomitmen aktif dalam kepengurusan
                    OSIS SMP Negeri 5 Klaten apabila dinyatakan terpilih.
                    <span className={styles.requiredMark} aria-label="wajib dicentang">
                      {" "}
                      *
                    </span>
                  </span>
                </label>
              </div>

              {/* ── Submit Action ── */}
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={!agreed}
                  aria-label="Kirimkan formulir pendaftaran calon pengurus OSIS"
                >
                  <Send size={18} aria-hidden />
                  Daftar Sekarang
                </button>
                <span className={styles.formSecurityNote}>
                  <ShieldCheck size={14} className={styles.formSecurityNoteIcon} aria-hidden />
                  Data pendaftaran terenkripsi dan hanya digunakan untuk keperluan seleksi resmi sekolah.
                </span>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ── Official School Footer ── */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image
              src="/logo_smpn5.png"
              alt="Logo SMPN 5 Klaten"
              width={28}
              height={28}
            />
            <span className={styles.footerBrandName}>SMPN 5 KLATEN</span>
            <span>— Generasi JUARA</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>
              Beranda
            </Link>
            <Link href="/ekstrakurikuler" className={styles.footerLink}>
              Ekskul
            </Link>
            <Link href="/profil" className={styles.footerLink}>
              Profil
            </Link>
          </div>

          <p>© {new Date().getFullYear()} SMP Negeri 5 Klaten. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
