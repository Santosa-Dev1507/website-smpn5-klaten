"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Calendar, Check, CheckSquare, ChevronRight, Compass,
  FileText, GraduationCap, MapPin, User, Users, CheckCircle2
} from "lucide-react";
import styles from "./panduan.module.css";

interface Props {
  tanggalKegiatan?: string | null;
  tema?: string;
}

type Role = "siswa" | "guru";
type StageId = "pra" | "saat" | "pasca";

interface StageInfo {
  id: StageId;
  label: string;
  sublabel: string;
  offsetRange: string;
  offsetDays: number;
}

const STAGES: StageInfo[] = [
  { id: "pra", label: "Tahap 1 — Pra-Kegiatan", sublabel: "Memahami", offsetRange: "H-7 s.d. H-1", offsetDays: -7 },
  { id: "saat", label: "Tahap 2 — Saat Pelaksanaan", sublabel: "Mengaplikasi", offsetRange: "Hari-H", offsetDays: 0 },
  { id: "pasca", label: "Tahap 3 — Pasca-Kegiatan", sublabel: "Merefleksi", offsetRange: "H+1 s.d. H+7", offsetDays: 3 },
];

/** Hitung tanggal Indonesia terformat berdasarkan offset hari relatif dari tanggal kegiatan. */
function calculateRelativeDate(baseDateStr: string, offsetDays: number): string {
  // Format baku "Senin, 5 Oktober 2026" -> parse tanggal
  const yearMatch = baseDateStr.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
  
  // Tanggal default jika parse custom string: 5 Oktober 2026
  let baseDate = new Date(year, 9, 5); // Month is 0-indexed (9 = Oct)

  // Coba parse jika string ISO
  const parsed = Date.parse(baseDateStr);
  if (!isNaN(parsed)) {
    baseDate = new Date(parsed);
  }

  const targetDate = new Date(baseDate);
  targetDate.setDate(targetDate.getDate() + offsetDays);

  return targetDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PanduanRangkaianTugas({
  tanggalKegiatan = "Senin, 5 Oktober 2026",
  tema = "Jejak Sejarah dan Warisan Budaya Bangsa",
}: Props) {
  const baseDateText = tanggalKegiatan || "Senin, 5 Oktober 2026";
  const [role, setRole] = useState<Role>("siswa");
  const [activeStage, setActiveStage] = useState<StageId>("pra");
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Auto-detect stage aktif berdasarkan tanggal hari ini vs tanggal kegiatan
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yearMatch = baseDateText.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
    const targetDate = new Date(year, 9, 5); // 5 Oktober 2026
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      setActiveStage("pra");
    } else if (diffDays === 0) {
      setActiveStage("saat");
    } else {
      setActiveStage("pasca");
    }
  }, [baseDateText]);

  // Load completed items dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smpn5_kokurikuler_checklist");
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleCheck = (id: string) => {
    setCompletedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("smpn5_kokurikuler_checklist", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.panduanWrap}>
      {/* ══ HEADER METADATA BANNER ════════════════════════════════════ */}
      <div className={styles.headerMetaCard}>
        <div className={styles.headerMetaBgGrid} aria-hidden="true" />
        <div className={styles.headerMetaTop}>
          <span className={styles.headerMetaBadge}>
            <Compass size={14} aria-hidden="true" />
            Panduan Alur &amp; Tugas Kokurikuler
          </span>
          <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
            Pelaksanaan: <strong>{baseDateText}</strong>
          </span>
        </div>
        <h3 className={styles.headerMetaTitle}>
          Rangkaian Kegiatan Kokurikuler — Destinasi Semarang
        </h3>

        <div className={styles.headerMetaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tema Pembelajaran</span>
            <span className={styles.metaVal}>"{tema}"</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dimensi Profil Lulusan</span>
            <span className={styles.metaVal}>Kewargaan · Komunikasi · Kreativitas</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Mata Pelajaran Terkait</span>
            <span className={styles.metaVal}>IPS, PPKn, Bahasa Indonesia, Seni Budaya</span>
          </div>
        </div>
      </div>

      {/* ══ TOP CONTROLS (ROLE SWITCHER & STAGE TABS) ═════════════════ */}
      <div className={styles.controlBar}>
        {/* Toggle Peran */}
        <div className={styles.roleToggle} role="group" aria-label="Pilih Tampilan Peran">
          <button
            type="button"
            className={`${styles.roleBtn} ${role === "siswa" ? styles.roleBtnActive : ""}`}
            onClick={() => setRole("siswa")}
          >
            <GraduationCap size={16} aria-hidden="true" />
            🎒 Tampilan Siswa
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === "guru" ? styles.roleBtnActive : ""}`}
            onClick={() => setRole("guru")}
          >
            <User size={16} aria-hidden="true" />
            👩‍🏫 Tampilan Guru Pendamping
          </button>
        </div>

        {/* Tab Tahapan */}
        <div className={styles.stageTabs} role="tablist" aria-label="Tahapan Kegiatan">
          {STAGES.map((stg) => {
            const isActive = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.stageTabBtn} ${isActive ? styles.stageTabBtnActive : ""}`}
                onClick={() => setActiveStage(stg.id)}
              >
                <span>{stg.label}</span>
                {isActive && <span className={styles.activeBadge}>Aktif</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ CONTENT CARD TAHAP AKTIF ═══════════════════════════════════ */}
      <div className={styles.stageContentCard}>
        {/* Tahap 1: Pra-Kegiatan */}
        {activeStage === "pra" && (
          <>
            <header className={styles.stageHeader}>
              <div className={styles.stageTitleGroup}>
                <span className={styles.stageEyebrow}>TAHAP 1 — PRA-KEGIATAN (Memahami)</span>
                <h4 className={styles.stageTitle}>Persiapan &amp; Pembekalan Lapangan di Sekolah</h4>
              </div>
              <div className={styles.stageDateTag}>
                <Calendar size={16} aria-hidden="true" />
                <span>{calculateRelativeDate(baseDateText, -7)} (H-7 s.d. H-1)</span>
              </div>
            </header>

            {role === "siswa" ? (
              <div className={styles.checklistSection}>
                <div className={styles.sectionHeading}>
                  <CheckSquare size={18} style={{ color: "#944535" }} aria-hidden="true" />
                  🎒 Checklist Tugas Peserta Didik (Pra-Kegiatan)
                </div>
                <div className={styles.checkGrid}>
                  <CheckItem
                    id="pra-s1"
                    checked={!!completedItems["pra-s1"]}
                    onToggle={toggleCheck}
                    title="Menyimak Materi Pembekalan"
                    desc="Menyimak materi pengantar sejarah & nilai perjuangan bangsa dari guru IPS/PPKn."
                  />
                  <CheckItem
                    id="pra-s2"
                    checked={!!completedItems["pra-s2"]}
                    onToggle={toggleCheck}
                    title="Mengenali Anggota Kelompok Kerja"
                    desc="Bergabung dengan kelompok kerja (5-6 orang) dan mencatat nama anggota."
                  />
                  <CheckItem
                    id="pra-s3"
                    checked={!!completedItems["pra-s3"]}
                    onToggle={toggleCheck}
                    title="Membagi Peran dalam Kelompok"
                    desc="Menentukan peran: Juru Foto/Dokumentasi, Pencatat Data, Juru Wawancara, dan Koordinator Kelompok."
                  />
                  <CheckItem
                    id="pra-s4"
                    checked={!!completedItems["pra-s4"]}
                    onToggle={toggleCheck}
                    title="Mempelajari LKPD &amp; Menyusun Pertanyaan"
                    desc="Mempelajari panduan observasi LKPD dan menyusun daftar pertanyaan wawancara (Bahasa Indonesia)."
                  />
                  <CheckItem
                    id="pra-s5"
                    checked={!!completedItems["pra-s5"]}
                    onToggle={toggleCheck}
                    title="Menyiapkan Perlengkapan Pribadi"
                    desc="Alat tulis, clipboard, LKPD kelompok, pakaian seragam sesuai ketentuan, & P3K pribadi."
                  />
                  <CheckItem
                    id="pra-s6"
                    checked={!!completedItems["pra-s6"]}
                    onToggle={toggleCheck}
                    title="Mengikuti Briefing Akhir (H-1)"
                    desc="Memastikan kesiapan kelompok, titik kumpul jam 06.30, dan memimpin doa bersama."
                  />
                </div>
              </div>
            ) : (
              <div className={styles.checklistSection}>
                <div className={styles.sectionHeading}>
                  <User size={18} style={{ color: "#944535" }} aria-hidden="true" />
                  👩‍🏫 Checklist Tugas Guru Pendamping (Pra-Kegiatan)
                </div>
                <div className={styles.checkGrid}>
                  <CheckItem
                    id="pra-g1"
                    checked={!!completedItems["pra-g1"]}
                    onToggle={toggleCheck}
                    title="Penyampaian Materi Pengantar"
                    desc="Menyampaikan materi pengantar sejarah & nilai perjuangan terkait lokasi Semarang (Guru IPS/PPKn)."
                  />
                  <CheckItem
                    id="pra-g2"
                    checked={!!completedItems["pra-g2"]}
                    onToggle={toggleCheck}
                    title="Menyusun &amp; Membagikan LKPD"
                    desc="Menyusun Lembar Kerja Peserta Didik (LKPD) berisi panduan observasi untuk tiap kelompok."
                  />
                  <CheckItem
                    id="pra-g3"
                    checked={!!completedItems["pra-g3"]}
                    onToggle={toggleCheck}
                    title="Bimbingan Pertanyaan Observasi"
                    desc="Membimbing peserta didik menyusun pertanyaan wawancara terstruktur (Guru Bahasa Indonesia)."
                  />
                  <CheckItem
                    id="pra-g4"
                    checked={!!completedItems["pra-g4"]}
                    onToggle={toggleCheck}
                    title="Pembentukan Kelompok Heterogen"
                    desc="Membentuk kelompok kerja secara heterogen (5–6 orang per kelompok) dan mengumumkan pembagiannya."
                  />
                  <CheckItem
                    id="pra-g5"
                    checked={!!completedItems["pra-g5"]}
                    onToggle={toggleCheck}
                    title="Sosialisasi Teknis &amp; Tata Tertib"
                    desc="Menyampaikan titik kumpul (06.30 WIB), jadwal keberangkatan, tata tertib, dan daftar bawaan."
                  />
                  <CheckItem
                    id="pra-g6"
                    checked={!!completedItems["pra-g6"]}
                    onToggle={toggleCheck}
                    title="Briefing Akhir (H-1)"
                    desc="Pengecekan kesiapan kelompok, memimpin doa bersama, dan memberikan pengarahan akhir."
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Tahap 2: Saat Pelaksanaan */}
        {activeStage === "saat" && (
          <>
            <header className={styles.stageHeader}>
              <div className={styles.stageTitleGroup}>
                <span className={styles.stageEyebrow}>TAHAP 2 — SAAT PELAKSANAAN (Mengaplikasi)</span>
                <h4 className={styles.stageTitle}>Kunjungan Pembelajaran Lapangan di Semarang</h4>
              </div>
              <div className={styles.stageDateTag}>
                <Calendar size={16} aria-hidden="true" />
                <span>{calculateRelativeDate(baseDateText, 0)} (Hari-H)</span>
              </div>
            </header>

            {/* Kartu Khusus 3 Objek Kunjungan */}
            <div>
              <div className={styles.sectionHeading} style={{ marginBottom: "14px" }}>
                <MapPin size={18} style={{ color: "#944535" }} aria-hidden="true" />
                🏛️ Panduan Khusus per Objek Kunjungan Lapangan
              </div>
              <div className={styles.objekGrid}>
                {/* 1. Saloka */}
                <div className={styles.objekCard}>
                  <div className={styles.objekCardHeader}>
                    <span className={styles.objekIcon}>🎡</span>
                    <div>
                      <h5 className={styles.objekTitle}>Saloka Theme Park</h5>
                      <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>Tuntang, Kab. Semarang</span>
                    </div>
                  </div>
                  <div className={styles.objekCardBody}>
                    <span className={styles.objekTag}>Dimensi: Kolaborasi &amp; Kreativitas</span>
                    <p>
                      <strong>Peserta Didik:</strong> Mengikuti kegiatan kebersamaan kelompok; mengamati sekilas pengelolaan kawasan wisata sebagai bentuk ekonomi kreatif daerah (IPS).
                    </p>
                    <p>
                      <strong>Guru Pendamping:</strong> Memandu kegiatan kebersamaan kelompok sebagai penguatan dimensi Kolaborasi &amp; menjaga ketertiban rombongan.
                    </p>
                  </div>
                </div>

                {/* 2. Benteng Willem I */}
                <div className={styles.objekCard}>
                  <div className={styles.objekCardHeader}>
                    <span className={styles.objekIcon}>🏰</span>
                    <div>
                      <h5 className={styles.objekTitle}>Benteng Pendem Willem I</h5>
                      <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>Ambarawa, Kab. Semarang</span>
                    </div>
                  </div>
                  <div className={styles.objekCardBody}>
                    <span className={styles.objekTag}>Dimensi: Penalaran Kritis &amp; Kewargaan</span>
                    <p>
                      <strong>Peserta Didik:</strong> Mengamati arsitektur bangunan kolonial, mencatat fakta sejarah dari papan informasi, dan berdiskusi tentang nilai perjuangan serta fungsi benteng pada masanya.
                    </p>
                    <p>
                      <strong>Guru Pendamping:</strong> Mendampingi kelompok dan mengarahkan ke sumber fakta sejarah yang relevan (IPS/PPKn).
                    </p>
                  </div>
                </div>

                {/* 3. Lawang Sewu */}
                <div className={styles.objekCard}>
                  <div className={styles.objekCardHeader}>
                    <span className={styles.objekIcon}>🏛️</span>
                    <div>
                      <h5 className={styles.objekTitle}>Museum Lawang Sewu</h5>
                      <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>Kota Semarang</span>
                    </div>
                  </div>
                  <div className={styles.objekCardBody}>
                    <span className={styles.objekTag}>Dimensi: Penalaran Kritis &amp; Komunikasi</span>
                    <p>
                      <strong>Peserta Didik:</strong> Observasi terstruktur sesuai LKPD (sejarah bangunan, fungsi awal, peristiwa pertempuran 5 hari) &amp; wawancara singkat pemandu.
                    </p>
                    <p>
                      <strong>Guru Pendamping:</strong> Memandu refleksi singkat di lokasi, mengaitkan hasil pengamatan dengan nilai kewargaan &amp; cinta tanah air.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Hari-H */}
            <div className={styles.checklistSection} style={{ marginTop: "12px" }}>
              <div className={styles.sectionHeading}>
                <CheckSquare size={18} style={{ color: "#944535" }} aria-hidden="true" />
                {role === "siswa" ? "🎒 Checklist Tugas Siswa (Hari-H)" : "👩‍🏫 Checklist Tugas Guru (Hari-H)"}
              </div>
              <div className={styles.checkGrid}>
                {role === "siswa" ? (
                  <>
                    <CheckItem
                      id="saat-s1"
                      checked={!!completedItems["saat-s1"]}
                      onToggle={toggleCheck}
                      title="Menjalankan Peran Kelompok"
                      desc="Menjalankan tugas sesuai peran (Juru Foto mendokumentasikan, Pencatat mengisi LKPD, Juru Wawancara bertanya)."
                    />
                    <CheckItem
                      id="saat-s2"
                      checked={!!completedItems["saat-s2"]}
                      onToggle={toggleCheck}
                      title="Mengumpulkan Data Foto &amp; Catatan"
                      desc="Mendokumentasikan foto arsitektur, papan informasi, dan jawaban LKPD di tiap lokasi."
                    />
                    <CheckItem
                      id="saat-s3"
                      checked={!!completedItems["saat-s3"]}
                      onToggle={toggleCheck}
                      title="Menjaga Ketertiban &amp; Waktu"
                      desc="Selalu bersama kelompok, mematuhi instruksi guru pendamping &amp; rundown perjalanan."
                    />
                  </>
                ) : (
                  <>
                    <CheckItem
                      id="saat-g1"
                      checked={!!completedItems["saat-g1"]}
                      onToggle={toggleCheck}
                      title="Pengawasan Kehadiran &amp; Ketertiban"
                      desc="Memastikan seluruh kelompok berkumpul dan dalam pengawasan di setiap lokasi."
                    />
                    <CheckItem
                      id="saat-g2"
                      checked={!!completedItems["saat-g2"]}
                      onToggle={toggleCheck}
                      title="Asesmen Formatif (Catatan Anekdotal)"
                      desc="Melakukan observasi keterlibatan dan karakter peserta didik di setiap lokasi kunjungan."
                    />
                    <CheckItem
                      id="saat-g3"
                      checked={!!completedItems["saat-g3"]}
                      onToggle={toggleCheck}
                      title="Memandu Refleksi Singkat"
                      desc="Mengaitkan pengamatan fisik benteng &amp; museum dengan nilai kewargaan dan cinta tanah air."
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Tahap 3: Pasca-Kegiatan */}
        {activeStage === "pasca" && (
          <>
            <header className={styles.stageHeader}>
              <div className={styles.stageTitleGroup}>
                <span className={styles.stageEyebrow}>TAHAP 3 — PASCA-KEGIATAN (Merefleksi)</span>
                <h4 className={styles.stageTitle}>Penyusunan Karya, Presentasi &amp; Penilaian Rapor</h4>
              </div>
              <div className={styles.stageDateTag}>
                <Calendar size={16} aria-hidden="true" />
                <span>{calculateRelativeDate(baseDateText, 3)} (H+1 s.d. H+7)</span>
              </div>
            </header>

            {role === "siswa" ? (
              <div className={styles.checklistSection}>
                <div className={styles.sectionHeading}>
                  <CheckSquare size={18} style={{ color: "#944535" }} aria-hidden="true" />
                  🎒 Checklist Tugas Peserta Didik (Pasca-Kegiatan)
                </div>
                <div className={styles.checkGrid}>
                  <CheckItem
                    id="pasca-s1"
                    checked={!!completedItems["pasca-s1"]}
                    onToggle={toggleCheck}
                    title="Menyusun Karya Kelompok (Pilih 1 Bentuk)"
                    desc="Menyusun karya berupa: Laporan Tertulis, Poster Edukatif, atau Vlog Singkat berdasarkan observasi lapangan."
                  />
                  <CheckItem
                    id="pasca-s2"
                    checked={!!completedItems["pasca-s2"]}
                    onToggle={toggleCheck}
                    title="Memastikan Kelengkapan Konten Karya"
                    desc="Karya memuat fakta sejarah objek, nilai/pelajaran perjuangan, dan pesan pelestarian warisan budaya."
                  />
                  <CheckItem
                    id="pasca-s3"
                    checked={!!completedItems["pasca-s3"]}
                    onToggle={toggleCheck}
                    title="Mempresentasikan Karya di Depan Kelas"
                    desc="Seluruh anggota kelompok berbagi peran mempresentasikan karya di depan kelas &amp; menjawab pertanyaan."
                  />
                  <CheckItem
                    id="pasca-s4"
                    checked={!!completedItems["pasca-s4"]}
                    onToggle={toggleCheck}
                    title="Memberikan Tanggapan Presentasi Kelompok Lain"
                    desc="Aktif bertanya/memberi apresiasi saat kelompok lain presentasi (penguatan dimensi Komunikasi)."
                  />
                  <CheckItem
                    id="pasca-s5"
                    checked={!!completedItems["pasca-s5"]}
                    onToggle={toggleCheck}
                    title="Menuliskan Refleksi Individu"
                    desc="Menuliskan hal yang dipelajari dan komitmen tindak lanjut menghargai warisan budaya bangsa."
                  />
                  <CheckItem
                    id="pasca-s6"
                    checked={!!completedItems["pasca-s6"]}
                    onToggle={toggleCheck}
                    title="Mengumpulkan Karya Sebelum Deadline (H+7)"
                    desc="Mengumpulkan file karya &amp; refleksi individu kepada guru pendamping."
                  />
                </div>
              </div>
            ) : (
              <div className={styles.checklistSection}>
                <div className={styles.sectionHeading}>
                  <User size={18} style={{ color: "#944535" }} aria-hidden="true" />
                  👩‍🏫 Checklist Tugas Guru Pendamping (Pasca-Kegiatan)
                </div>
                <div className={styles.checkGrid}>
                  <CheckItem
                    id="pasca-g1"
                    checked={!!completedItems["pasca-g1"]}
                    onToggle={toggleCheck}
                    title="Pembimbingan Penyusunan Karya"
                    desc="Membimbing aspek kreativitas penyajian karya laporan/poster/vlog (Guru Seni Budaya/Bahasa Indonesia)."
                  />
                  <CheckItem
                    id="pasca-g2"
                    checked={!!completedItems["pasca-g2"]}
                    onToggle={toggleCheck}
                    title="Memandu Sesi Presentasi Kelas"
                    desc="Menjadwalkan dan memandu presentasi kelompok serta memfasilitasi tanya jawab."
                  />
                  <CheckItem
                    id="pasca-g3"
                    checked={!!completedItems["pasca-g3"]}
                    onToggle={toggleCheck}
                    title="Penilaian Sumatif Rubrik"
                    desc="Melakukan penilaian sumatif terhadap laporan/karya &amp; presentasi menggunakan rubrik penilaian."
                  />
                  <CheckItem
                    id="pasca-g4"
                    checked={!!completedItems["pasca-g4"]}
                    onToggle={toggleCheck}
                    title="Input Nilai ke Rapor Kokurikuler"
                    desc="Menginput dan melaporkan hasil nilai 3 dimensi pada Portal Penilaian Kokurikuler untuk rapor."
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ MATRIX SUMMARY TABLE PER TAHAP ═════════════════════════════ */}
      <div className={styles.matrixSection}>
        <div className={styles.matrixTitle}>
          <FileText size={20} aria-hidden="true" />
          Ringkasan Output &amp; Bukti Kerja Per Tahap
        </div>
        <div className={styles.matrixTableWrap}>
          <table className={styles.matrixTable} aria-label="Tabel ringkasan output kegiatan kokurikuler">
            <thead>
              <tr>
                <th scope="col">Tahap Kegiatan</th>
                <th scope="col">Output Peserta Didik</th>
                <th scope="col">Output / Bukti Kerja Guru Pendamping</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tdTahap}>
                  Pra-Kegiatan<br />
                  <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}>({calculateRelativeDate(baseDateText, -7)})</span>
                </td>
                <td>
                  LKPD terisi (rencana observasi &amp; daftar pertanyaan wawancara), kesepakatan pembagian peran anggota kelompok.
                </td>
                <td>
                  Materi pembekalan sejarah, instrumen LKPD kelompok, daftar pembagian kelompok heterogen, catatan briefing teknis H-1.
                </td>
              </tr>
              <tr>
                <td className={styles.tdTahap}>
                  Saat Pelaksanaan<br />
                  <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}>({calculateRelativeDate(baseDateText, 0)})</span>
                </td>
                <td>
                  Catatan observasi fakta sejarah di Benteng Willem I &amp; Lawang Sewu, foto dokumentasi, dan hasil wawancara pemandu.
                </td>
                <td>
                  Catatan anekdotal observasi karakter (asesmen formatif), dokumentasi pendampingan di 3 lokasi kunjungan.
                </td>
              </tr>
              <tr>
                <td className={styles.tdTahap}>
                  Pasca-Kegiatan<br />
                  <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}>({calculateRelativeDate(baseDateText, 3)})</span>
                </td>
                <td>
                  Karya kelompok (Laporan tertulis / Poster / Vlog singkat), materi presentasi kelas, dan lembar refleksi individu.
                </td>
                <td>
                  Rubrik penilaian sumatif terisi, rekap nilai 3 dimensi terinput di Portal Kokurikuler untuk rapor sekolah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CheckItem({
  id,
  checked,
  onToggle,
  title,
  desc,
}: {
  id: string;
  checked: boolean;
  onToggle: (id: string) => void;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={`${styles.checkItem} ${checked ? styles.checkItemDone : ""}`}
      onClick={() => onToggle(id)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle(id);
        }
      }}
    >
      <div className={styles.checkbox}>
        {checked && <Check size={14} aria-hidden="true" />}
      </div>
      <div className={styles.checkText}>
        <span className={styles.checkTextBold}>{title}: </span>
        {desc}
      </div>
    </div>
  );
}
