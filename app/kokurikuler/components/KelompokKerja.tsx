"use client";

import { useState, useEffect } from "react";
import { Search, Users, BookOpen, User, X, ChevronRight, Check, Calendar, Lock, AlertCircle, MapPin } from "lucide-react";
import styles from "./kelompok.module.css";
import type { KelompokKerja, TugasSiswa } from "@/lib/kokurikuler";

interface Props {
  initialKelompok?: KelompokKerja[];
  initialTugas?: TugasSiswa[];
  tanggalKegiatan?: string | null;
}

const TAHAP_ICONS: Record<string, React.ReactNode> = {
  "Pra-Kegiatan":      <BookOpen size={16} />,
  "Saat Pelaksanaan":  <ChevronRight size={16} />,
  "Pasca-Kegiatan":    <Users size={16} />,
};

const TAHAP_LIST = ["Pra-Kegiatan", "Saat Pelaksanaan", "Pasca-Kegiatan"] as const;

/** Hitung Date object target berdasarkan baseDate & offset. */
function getTargetDate(baseDateStr: string, offsetDays: number): Date {
  const yearMatch = baseDateStr.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
  let baseDate = new Date(year, 9, 5); // 5 Oktober 2026

  const parsed = Date.parse(baseDateStr);
  if (!isNaN(parsed)) baseDate = new Date(parsed);

  const target = new Date(baseDate);
  target.setDate(target.getDate() + offsetDays);
  target.setHours(0, 0, 0, 0);
  return target;
}

/** Hitung string tanggal Indonesia terformat. */
function calculateRelativeDate(baseDateStr: string, offsetDays: number): string {
  const targetDate = getTargetDate(baseDateStr, offsetDays);
  return targetDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const DETAILED_STUDENT_TASKS: Record<string, { id: string; judul: string; deskripsi: string; dateOffset: number }[]> = {
  "Pra-Kegiatan": [
    { id: "s-pra-1", judul: "Menyimak Pembekalan", deskripsi: "Menyimak materi pengantar sejarah & nilai perjuangan bangsa dari guru IPS/PPKn.", dateOffset: -7 },
    { id: "s-pra-2", judul: "Mengenali Anggota Kelompok", deskripsi: "Bergabung dengan kelompok kerja (5-6 orang) dan koordinasi bersama anggota.", dateOffset: -7 },
    { id: "s-pra-3", judul: "Membagi Peran Kelompok", deskripsi: "Membagi peran: Juru Foto/Dokumentasi, Pencatat Data, Juru Wawancara, & Koordinator Kelompok.", dateOffset: -3 },
    { id: "s-pra-4", judul: "Mempelajari LKPD & Pertanyaan", deskripsi: "Mempelajari LKPD kelompok dan menyusun daftar pertanyaan wawancara terstruktur (Bahasa Indonesia).", dateOffset: -3 },
    { id: "s-pra-5", judul: "Menyiapkan Perlengkapan", deskripsi: "Menyiapkan alat tulis, clipboard, LKPD terhitung, seragam sesuai instruksi, & P3K pribadi.", dateOffset: -1 },
    { id: "s-pra-6", judul: "Briefing Akhir H-1", deskripsi: "Mengikuti pengarahan akhir (jam 06.30 titik kumpul), memimpin doa bersama, & cek kesiapan.", dateOffset: -1 },
  ],
  "Saat Pelaksanaan": [
    { id: "s-saat-1", judul: "Menjalankan Peran Kelompok", deskripsi: "Menjalankan tugas sesuai peran (Juru Foto mendokumentasikan, Pencatat mengisi LKPD, Juru Wawancara bertanya).", dateOffset: 0 },
    { id: "s-saat-2", judul: "Observasi & Data Foto", deskripsi: "Mengumpulkan data foto arsitektur, papan informasi, dan catatan LKPD di setiap lokasi.", dateOffset: 0 },
    { id: "s-saat-3", judul: "Ketertiban & Rundown", deskripsi: "Mematuhi urutan lokasi (Saloka -> Benteng Willem I -> Lawang Sewu) & arahan guru pendamping.", dateOffset: 0 },
  ],
  "Pasca-Kegiatan": [
    { id: "s-pasca-1", judul: "Menyusun Karya Kelompok", deskripsi: "Menyusun karya kelompok dalam salah satu bentuk: Laporan Tertulis, Poster Edukatif, atau Vlog Singkat.", dateOffset: 3 },
    { id: "s-pasca-2", judul: "Kelengkapan Konten Karya", deskripsi: "Memastikan karya memuat fakta sejarah, nilai perjuangan yang diperoleh, & pesan pelestarian warisan budaya.", dateOffset: 3 },
    { id: "s-pasca-3", judul: "Presentasi di Depan Kelas", deskripsi: "Mempresentasikan hasil karya kelompok di depan kelas & menjawab pertanyaan teman.", dateOffset: 7 },
    { id: "s-pasca-4", judul: "Tanggapan Presentasi", deskripsi: "Memberikan pertanyaan/tanggapan positif saat kelompok lain presentasi (dimensi Komunikasi).", dateOffset: 7 },
    { id: "s-pasca-5", judul: "Refleksi Individu", deskripsi: "Menuliskan lembar refleksi individu tentang hal yang dipelajari dan komitmen pelestarian budaya.", dateOffset: 7 },
  ],
};

export default function KelompokKerja({
  initialKelompok = [],
  initialTugas = [],
  tanggalKegiatan = "Senin, 5 Oktober 2026",
}: Props) {
  const baseDateText = tanggalKegiatan || "Senin, 5 Oktober 2026";
  const [kelompokList, setKelompokList] = useState<KelompokKerja[]>(initialKelompok);
  const [loading, setLoading]           = useState(initialKelompok.length === 0);
  const [query, setQuery]               = useState("");
  const [activeTahap, setActiveTahap]   = useState<typeof TAHAP_LIST[number]>("Pra-Kegiatan");
  const [foundKelompok, setFound]       = useState<KelompokKerja | null>(null);
  const [searched, setSearched]         = useState(false);
  const [completedMap, setCompleted]   = useState<Record<string, boolean>>({});

  // Auto detect active stage dari tanggal hari ini vs tanggal kegiatan
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yearMatch = baseDateText.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
    const targetDate = new Date(year, 9, 5); // 5 Okt 2026
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) setActiveTahap("Pra-Kegiatan");
    else if (diffDays === 0) setActiveTahap("Saat Pelaksanaan");
    else setActiveTahap("Pasca-Kegiatan");
  }, [baseDateText]);

  // Load checklist state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smpn5_siswa_checklist");
      if (saved) setCompleted(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (initialKelompok.length > 0) { setLoading(false); return; }
    fetch("/api/kokurikuler/data?tab=kelompok")
      .then(r => r.json())
      .then(data => {
        setKelompokList(data.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialKelompok.length]);

  const handleSearch = () => {
    setSearched(true);
    const q = query.trim().toLowerCase();
    if (!q) { setFound(null); return; }

    const found = kelompokList.find(k =>
      k.anggota.toLowerCase().includes(q) ||
      k.nama_kelompok.toLowerCase().includes(q)
    );
    setFound(found ?? null);
  };

  const handleClear = () => {
    setQuery("");
    setFound(null);
    setSearched(false);
  };

  const toggleCheck = (id: string, unlocked: boolean) => {
    if (!unlocked) return; // Tidak bisa dicentang jika masih terkunci
    setCompleted(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("smpn5_siswa_checklist", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const currentTasks = DETAILED_STUDENT_TASKS[activeTahap] ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <span>Memuat data kelompok…</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Alert Keterangan Belum Tersedia */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#fff7ed",
        border: "1.5px solid #fdba74",
        color: "#c2410c",
        padding: "12px 18px",
        borderRadius: "14px",
        fontSize: "0.88rem",
        fontWeight: 600,
        marginBottom: "16px"
      }}>
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
        <span><strong>Pemberitahuan:</strong> Data pembagian kelompok kerja belum tersedia (dalam proses pembentukan oleh guru pendamping).</span>
      </div>

      {/* Search (Disabled) */}
      <div className={styles.searchBar} style={{ opacity: 0.7 }}>
        <div className={styles.searchInputWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="text"
            disabled={true}
            value={query}
            placeholder="Cari kelompok belum tersedia..."
            className={styles.searchField}
            style={{ cursor: "not-allowed", background: "#f8fafc" }}
            aria-label="Cari kelompok (Belum tersedia)"
          />
        </div>
        <button
          className={styles.searchBtn}
          disabled={true}
          style={{ cursor: "not-allowed", opacity: 0.7 }}
        >
          Belum Tersedia
        </button>
      </div>

      {/* Hasil kelompok */}
      {searched && !foundKelompok && (
        <p className={styles.notFound} role="alert">
          Nama "<strong>{query}</strong>" tidak ditemukan dalam data kelompok.
        </p>
      )}

      {foundKelompok && (
        <div className={styles.kelompokCard} role="region" aria-label="Info kelompok ditemukan">
          <div className={styles.kelompokCardHeader}>
            <div className={styles.kelompokIcon}><Users size={22} /></div>
            <div>
              <p className={styles.kelompokNama}>{foundKelompok.nama_kelompok}</p>
              <p className={styles.kelompokKelas}>{foundKelompok.kelas}</p>
            </div>
          </div>

          <div className={styles.kelompokDetail}>
            <div className={styles.kelompokDetailItem}>
              <span className={styles.kelompokDetailLabel}>Sub-tema / Objek Amatan</span>
              <span className={styles.kelompokDetailValue}>{foundKelompok.sub_tema_objek_amatan}</span>
            </div>
            <div className={styles.kelompokDetailItem}>
              <span className={styles.kelompokDetailLabel}>Guru Pembimbing</span>
              <span className={styles.kelompokDetailValue}>
                <User size={13} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                {foundKelompok.nama_pembimbing}
              </span>
            </div>
            <div className={styles.kelompokDetailItem}>
              <span className={styles.kelompokDetailLabel}>Anggota Kelompok</span>
              <div className={styles.anggotaList}>
                {foundKelompok.anggota.split(",").map((nama, i) => (
                  <span key={i} className={`${styles.anggotaChip} ${nama.trim().toLowerCase() === query.trim().toLowerCase() ? styles.anggotaChipHighlight : ""}`}>
                    {nama.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Tugas Siswa per Tahap */}
      <div className={styles.tugasSection}>
        <div className={styles.tahapHeaderInfo}>
          <h3 className={styles.tugasTitle}>Daftar Tugas Peserta Didik</h3>
          
          <span className={styles.tahapDateBadge}>
            <Calendar size={14} aria-hidden="true" />
            <span>
              {activeTahap === "Pra-Kegiatan" && `${calculateRelativeDate(baseDateText, -7)} (H-7 s.d H-1)`}
              {activeTahap === "Saat Pelaksanaan" && `${calculateRelativeDate(baseDateText, 0)} (Hari-H)`}
              {activeTahap === "Pasca-Kegiatan" && `${calculateRelativeDate(baseDateText, 3)} (H+1 s.d H+7)`}
            </span>
          </span>
        </div>

        {/* Tab tahap */}
        <div className={styles.tahapTabs} role="tablist" aria-label="Pilih tahap kegiatan">
          {TAHAP_LIST.map(tahap => (
            <button
              key={tahap}
              role="tab"
              aria-selected={activeTahap === tahap}
              className={`${styles.tahapTab} ${activeTahap === tahap ? styles.tahapTabActive : ""}`}
              onClick={() => setActiveTahap(tahap)}
            >
              {TAHAP_ICONS[tahap]}
              <span>{tahap}</span>
            </button>
          ))}
        </div>

        {/* Panduan Kartu Objek Kunjungan khusus Tahap 2 */}
        {activeTahap === "Saat Pelaksanaan" && (
          <div className={styles.locationCardGrid}>
            <div className={styles.locationCard}>
              <div className={styles.locationCardTitle}>
                <MapPin size={16} aria-hidden="true" /> Saloka Theme Park
              </div>
              <p className={styles.locationCardText}>
                <strong>Tugas:</strong> Mengikuti kegiatan kebersamaan kelompok (Kolaborasi) &amp; mengamati pengelolaan kawasan wisata ekonomi kreatif.
              </p>
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationCardTitle}>
                <MapPin size={16} aria-hidden="true" /> Benteng Willem I
              </div>
              <p className={styles.locationCardText}>
                <strong>Tugas:</strong> Mengamati arsitektur bangunan kolonial, mencatat fakta sejarah dari papan informasi, &amp; nilai perjuangan.
              </p>
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationCardTitle}>
                <MapPin size={16} aria-hidden="true" /> Museum Lawang Sewu
              </div>
              <p className={styles.locationCardText}>
                <strong>Tugas:</strong> Observasi terstruktur sesuai LKPD (sejarah, fungsi awal, peristiwa pertempuran 5 hari) &amp; wawancara pemandu.
              </p>
            </div>
          </div>
        )}

        {/* Checklist Tugas Dengan Penguncian Tanggal Real-Time Murni */}
        <div className={styles.tugasList} role="tabpanel">
          {currentTasks.map((t) => {
            const isDone = !!completedMap[t.id];
            const targetDate = getTargetDate(baseDateText, t.dateOffset);
            const dateStr = calculateRelativeDate(baseDateText, t.dateOffset);
            const isUnlocked = today >= targetDate;

            return (
              <div
                key={t.id}
                className={`${styles.checkItemInteractive} ${isDone ? styles.checkItemDone : ""} ${!isUnlocked ? styles.checkItemLocked : ""}`}
                onClick={() => toggleCheck(t.id, isUnlocked)}
                style={{ cursor: isUnlocked ? "pointer" : "not-allowed", opacity: isUnlocked ? 1 : 0.75 }}
              >
                <div className={styles.checkboxSquare} style={{ background: !isUnlocked ? "#f1f5f9" : undefined }}>
                  {isUnlocked ? (
                    isDone && <Check size={15} aria-hidden="true" />
                  ) : (
                    <Lock size={12} style={{ color: "#94a3b8" }} aria-hidden="true" />
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, color: isUnlocked ? (isDone ? "#64748b" : "#0D0C13") : "#64748b" }}>
                      {t.judul}
                    </span>
                    <span style={{
                      fontSize: "0.72rem",
                      background: isUnlocked ? (isDone ? "#e2e8f0" : "rgba(148,69,53,0.1)") : "#f1f5f9",
                      color: isUnlocked ? (isDone ? "#64748b" : "#944535") : "#64748b",
                      padding: "2px 10px",
                      borderRadius: "100px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      {!isUnlocked && <Lock size={10} />}
                      {isUnlocked ? dateStr : `Terkunci — Terbuka pada ${dateStr}`}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <p style={{ fontSize: "0.88rem", color: isDone ? "#94a3b8" : "#475569", lineHeight: 1.5, margin: 0, textDecoration: isDone ? "line-through" : "none" }}>
                      {t.deskripsi}
                    </p>
                  ) : (
                    <p style={{ fontSize: "0.83rem", color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                      Penjelasan &amp; petunjuk detail tugas ini belum tampil. Tugas akan terbuka otomatis pada tanggal <strong>{dateStr}</strong>.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
