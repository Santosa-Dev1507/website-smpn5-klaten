"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, PlusCircle, Trash2, CheckCircle, AlertCircle, Loader2, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "./daftar.module.css";

// ── Konstanta ──────────────────────────────────────────────────────────
const KELAS_LIST = ["VIII A","VIII B","VIII C","VIII D","VIII E","VIII F","VIII G","VIII H"];

/** Peran fixed sesuai LKPD — urutan menentukan slot */
const PERAN_SLOTS = [
  "Koordinator Kelompok",
  "Juru Foto/Dokumentasi",
  "Pencatat",
  "Juru Wawancara",
  "Anggota",
] as const;

const PERAN_EMOJI: Record<string, string> = {
  "Koordinator Kelompok": "👑",
  "Juru Foto/Dokumentasi": "📷",
  "Pencatat": "✍️",
  "Juru Wawancara": "🎤",
  "Anggota": "👤",
};

const REGISTRATION_OPEN  = new Date("2026-09-27T00:00:00+07:00");
const REGISTRATION_CLOSE = new Date("2026-09-30T23:59:59+07:00");

interface AnggotaForm {
  nama: string;
  nis: string;
  peran: string;
}

const emptyAnggota = (peran: string): AnggotaForm => ({ nama: "", nis: "", peran });

const defaultAnggota = (): AnggotaForm[] =>
  PERAN_SLOTS.map(p => emptyAnggota(p));

interface Student {
  kelas: string;
  nis: string;
  nama: string;
}

// ── Component ──────────────────────────────────────────────────────────
export default function DaftarKelompokPage() {
  const router = useRouter();

  // Cek window pendaftaran (client-side check, enforcement ada di server)
  const now = new Date();
  const isOpen = now >= REGISTRATION_OPEN && now <= REGISTRATION_CLOSE;

  const [namaKelompok, setNamaKelompok] = useState("");
  const [kelas, setKelas]               = useState("");
  const [subTema, setSubTema]           = useState("");
  const [guruPembimbing, setGuruPembimbing] = useState("");
  const [anggota, setAnggota]           = useState<AnggotaForm[]>(defaultAnggota());
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // Data Siswa
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    fetch("/api/kokurikuler/siswa")
      .then(res => res.json())
      .then(json => {
        if (json.data) setStudents(json.data);
        setLoadingStudents(false);
      })
      .catch(() => setLoadingStudents(false));
  }, []);

  const classStudents = students.filter(s => s.kelas === kelas);

  // Tambah anggota ke-6 (slot Anggota tambahan)
  const canAddMore = anggota.length < 6;
  const canRemoveLast = anggota.length > 5;

  const handleAddAnggota = () => {
    if (!canAddMore) return;
    setAnggota(prev => [...prev, emptyAnggota("Anggota")]);
  };

  const handleRemoveAnggota = () => {
    if (!canRemoveLast) return;
    setAnggota(prev => prev.slice(0, -1));
  };

  const updateAnggota = useCallback(
    (idx: number, field: keyof AnggotaForm, value: string) => {
      setAnggota(prev => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: value };
        return copy;
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validasi awal
    if (!namaKelompok.trim()) { setError("Nama kelompok wajib diisi."); return; }
    if (!kelas) { setError("Pilih kelas terlebih dahulu."); return; }
    for (let i = 0; i < anggota.length; i++) {
      if (!anggota[i].nama.trim()) {
        setError(`Nama anggota ke-${i + 1} (${anggota[i].peran}) wajib diisi.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/kokurikuler/kelompok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_kelompok: namaKelompok,
          kelas,
          sub_tema: subTema || null,
          guru_pembimbing: guruPembimbing || null,
          anggota,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }

      // Redirect ke halaman lihat kelompok
      router.push(`/kokurikuler/kelompok/${json.kode_kelompok}`);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <Link href="/kokurikuler" className={styles.backLink}>
          <ArrowLeft size={16} />
          Kembali ke Kokurikuler
        </Link>
        <h1 className={styles.pageTitle}>
          <Users size={26} />
          Daftarkan Kelompok Kerja
        </h1>
        <p className={styles.pageSubtitle}>
          Kokurikuler Kelas VIII — Destinasi Semarang 2026/2027
        </p>
      </div>

      {/* ── Banner window pendaftaran ── */}
      <div className={isOpen ? styles.bannerOpen : styles.bannerClosed}>
        <Info size={18} style={{ flexShrink: 0 }} />
        {isOpen ? (
          <span>
            <strong>Pendaftaran kelompok dibuka</strong> hingga{" "}
            <strong>Rabu, 30 September 2026 pukul 23.59 WIB</strong>.
            Simpan kode kelompok yang muncul setelah pendaftaran!
          </span>
        ) : (
          <span>
            <strong>Pendaftaran kelompok ditutup.</strong> Periode pendaftaran: Ahad–Rabu, 27–30 September 2026.
          </span>
        )}
      </div>

      {!isOpen ? (
        <div className={styles.closedState}>
          <AlertCircle size={48} strokeWidth={1.5} />
          <p>Formulir pendaftaran tidak tersedia di luar periode pendaftaran.</p>
          <Link href="/kokurikuler" className={styles.closedBtn}>
            Kembali ke Halaman Kokurikuler
          </Link>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* ══ INFORMASI KELOMPOK ════════════════════════════════════ */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informasi Kelompok</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="nama-kelompok">
                  Nama Kelompok <span className={styles.req}>*</span>
                </label>
                <input
                  id="nama-kelompok"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Contoh: Kelompok Sejarah 1"
                  value={namaKelompok}
                  onChange={e => setNamaKelompok(e.target.value)}
                  maxLength={80}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="kelas">
                  Kelas <span className={styles.req}>*</span>
                </label>
                <select
                  id="kelas"
                  required
                  className={styles.select}
                  value={kelas}
                  onChange={e => {
                    setKelas(e.target.value);
                    setAnggota(defaultAnggota()); // reset anggota jika kelas berubah
                  }}
                >
                  <option value="">— Pilih Kelas —</option>
                  {KELAS_LIST.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.label} htmlFor="sub-tema">
                  Sub-Tema / Objek Fokus{" "}
                  <span className={styles.optional}>(opsional)</span>
                </label>
                <input
                  id="sub-tema"
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: Arsitektur kolonial & nilai perjuangan di Benteng Pendem"
                  value={subTema}
                  onChange={e => setSubTema(e.target.value)}
                  maxLength={120}
                />
              </div>

              <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.label} htmlFor="guru-pembimbing">
                  Guru Pembimbing Kelompok{" "}
                  <span className={styles.optional}>(opsional)</span>
                </label>
                <input
                  id="guru-pembimbing"
                  type="text"
                  className={styles.input}
                  placeholder="Nama guru pendamping kelompok ini"
                  value={guruPembimbing}
                  onChange={e => setGuruPembimbing(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>
          </section>

          {/* ══ ANGGOTA KELOMPOK ══════════════════════════════════════ */}
          <section className={styles.section}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>
                Anggota Kelompok &amp; Pembagian Peran
              </h2>
              <span className={styles.anggotaCount}>
                {anggota.length}/6 anggota
              </span>
            </div>

            <p className={styles.sectionNote}>
              Pilih kelas terlebih dahulu. Setelah itu, pilih nama siswa dari daftar yang tersedia. NIS akan terisi otomatis.
            </p>

            <div className={styles.anggotaTable}>
              {/* Header */}
              <div className={styles.anggotaHeader}>
                <span className={styles.colNo}>No</span>
                <span className={styles.colPeran}>Peran</span>
                <span className={styles.colNama}>Nama Siswa <span className={styles.req}>*</span></span>
                <span className={styles.colNis}>NIS <span className={styles.optional}>(opt.)</span></span>
              </div>

              {/* Rows */}
              {anggota.map((a, idx) => (
                <div key={idx} className={styles.anggotaRow}>
                  <span className={styles.colNo}>{idx + 1}</span>
                  <span className={styles.colPeran}>
                    <span className={styles.peranBadge}>
                      {PERAN_EMOJI[a.peran]} {a.peran}
                    </span>
                  </span>
                  <div className={styles.colNama}>
                    <select
                      required
                      className={styles.select}
                      value={a.nama}
                      onChange={e => {
                        const selectedName = e.target.value;
                        const student = classStudents.find(s => s.nama === selectedName);
                        if (student) {
                          updateAnggota(idx, "nama", student.nama);
                          updateAnggota(idx, "nis", student.nis);
                        } else {
                          updateAnggota(idx, "nama", "");
                          updateAnggota(idx, "nis", "");
                        }
                      }}
                      disabled={!kelas || loadingStudents}
                      aria-label={`Nama anggota ${idx + 1} — ${a.peran}`}
                    >
                      <option value="">
                        {!kelas ? "— Pilih Kelas Dulu —" : loadingStudents ? "Memuat Data..." : "— Pilih Siswa —"}
                      </option>
                      {classStudents.map(s => {
                        // disable if already selected in another slot
                        const isSelected = anggota.some((ang, i) => i !== idx && ang.nama === s.nama);
                        return (
                          <option key={s.nis} value={s.nama} disabled={isSelected}>
                            {s.nama}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className={styles.colNis}>
                    <input
                      type="text"
                      className={styles.inputInline}
                      placeholder="Auto-fill"
                      value={a.nis}
                      readOnly
                      style={{ background: "#f1f5f9", cursor: "not-allowed", color: "#64748b" }}
                      aria-label={`NIS anggota ${idx + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tambah / hapus baris ke-6 */}
            <div className={styles.anggotaActions}>
              {canAddMore && (
                <button type="button" className={styles.addBtn} onClick={handleAddAnggota}>
                  <PlusCircle size={16} /> Tambah Anggota ke-6
                </button>
              )}
              {canRemoveLast && (
                <button type="button" className={styles.removeBtn} onClick={handleRemoveAnggota}>
                  <Trash2 size={14} /> Hapus Anggota ke-6
                </button>
              )}
            </div>
          </section>

          {/* ── Warning & Error ── */}
          <div className={styles.warningBox}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>
              Pastikan semua data sudah benar sebelum mendaftar. Data <em>masih dapat diubah</em> hingga 30 September 2026 menggunakan kode kelompok.
            </span>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? (
              <><Loader2 size={18} className={styles.spin} /> Mendaftarkan Kelompok…</>
            ) : (
              <><CheckCircle size={18} /> Daftarkan Kelompok</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
