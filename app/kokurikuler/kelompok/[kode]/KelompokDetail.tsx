"use client";

import { useState, useCallback } from "react";
import {
  Users, Copy, Check, Edit2, X, Loader2, ArrowLeft,
  AlertCircle, CheckCircle, Printer, Info
} from "lucide-react";
import Link from "next/link";
import styles from "./kelompok-detail.module.css";

// ── Types ──────────────────────────────────────────────────────────────
interface AnggotaRow {
  id: string;
  urutan: number;
  nama: string;
  nis: string | null;
  peran: string;
}

interface KelompokData {
  id: string;
  kode_kelompok: string;
  nama_kelompok: string;
  kelas: string;
  sub_tema: string | null;
  guru_pembimbing: string | null;
  tahun_kegiatan: string;
  created_at: string;
  anggota_kelompok: AnggotaRow[];
}

interface Props {
  kelompok: KelompokData;
  isEditable: boolean;
}

const PERAN_EMOJI: Record<string, string> = {
  "Koordinator Kelompok":  "👑",
  "Juru Foto/Dokumentasi": "📷",
  "Pencatat":              "✍️",
  "Juru Wawancara":        "🎤",
  "Anggota":               "👤",
};

// ── Component ──────────────────────────────────────────────────────────
export default function KelompokDetail({ kelompok, isEditable }: Props) {
  const [copied, setCopied]     = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [data, setData]         = useState<KelompokData>(kelompok);

  // Edit state — hanya dipakai saat editMode
  const [editNama, setEditNama]           = useState(kelompok.nama_kelompok);
  const [editKelas, setEditKelas]         = useState(kelompok.kelas);
  const [editSubTema, setEditSubTema]     = useState(kelompok.sub_tema ?? "");
  const [editGuru, setEditGuru]           = useState(kelompok.guru_pembimbing ?? "");
  const [editAnggota, setEditAnggota]     = useState<AnggotaRow[]>([...kelompok.anggota_kelompok]);

  const KELAS_LIST = ["VIII A","VIII B","VIII C","VIII D","VIII E","VIII F","VIII G","VIII H"];

  // ── Copy kode ──────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.kode_kelompok);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // ── Edit anggota ───────────────────────────────────────────────────
  const updateEditAnggota = useCallback(
    (idx: number, field: "nama" | "nis", value: string) => {
      setEditAnggota(prev => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: value };
        return copy;
      });
    },
    []
  );

  const handleCancelEdit = () => {
    setEditNama(data.nama_kelompok);
    setEditKelas(data.kelas);
    setEditSubTema(data.sub_tema ?? "");
    setEditGuru(data.guru_pembimbing ?? "");
    setEditAnggota([...data.anggota_kelompok]);
    setSaveError(null);
    setEditMode(false);
  };

  // ── Simpan edit ────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaveError(null);
    if (!editNama.trim()) { setSaveError("Nama kelompok wajib diisi."); return; }
    for (let i = 0; i < editAnggota.length; i++) {
      if (!editAnggota[i].nama.trim()) {
        setSaveError(`Nama anggota ke-${i + 1} (${editAnggota[i].peran}) wajib diisi.`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/kokurikuler/kelompok", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kode_kelompok:  data.kode_kelompok,
          nama_kelompok:  editNama,
          kelas:          editKelas,
          sub_tema:       editSubTema || null,
          guru_pembimbing: editGuru || null,
          anggota: editAnggota.map(a => ({
            nama: a.nama,
            nis: a.nis ?? "",
            peran: a.peran,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.error ?? "Gagal menyimpan perubahan.");
        return;
      }

      // Update tampilan
      setData(prev => ({
        ...prev,
        nama_kelompok:   editNama,
        kelas:           editKelas,
        sub_tema:        editSubTema || null,
        guru_pembimbing: editGuru || null,
        anggota_kelompok: editAnggota,
      }));
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Gagal terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Back ── */}
      <Link href="/kokurikuler" className={styles.backLink}>
        <ArrowLeft size={16} /> Kembali ke Kokurikuler
      </Link>

      {/* ── Success toast ── */}
      {saveSuccess && (
        <div className={styles.toastSuccess} role="status">
          <CheckCircle size={16} /> Data kelompok berhasil diperbarui!
        </div>
      )}

      {/* ═══ KODE CARD ════════════════════════════════════════════════ */}
      <div className={styles.kodeCard}>
        <div className={styles.kodeCardLeft}>
          <span className={styles.kodeLabel}>Kode Kelompok</span>
          <span className={styles.kodeValue}>{data.kode_kelompok}</span>
          <span className={styles.kodeHint}>
            Bagikan kode ini ke seluruh anggota kelompok agar bisa melihat data ini kembali.
          </span>
        </div>
        <button className={styles.copyBtn} onClick={handleCopy} aria-label="Salin kode kelompok">
          {copied ? <><Check size={16} /> Disalin!</> : <><Copy size={16} /> Salin Kode</>}
        </button>
      </div>

      {/* ═══ INFO BANNER (editable atau locked) ══════════════════════ */}
      {isEditable ? (
        <div className={styles.bannerEditable}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>Data kelompok masih dapat diubah hingga <strong>30 September 2026</strong>. Klik tombol Edit untuk memperbarui.</span>
        </div>
      ) : (
        <div className={styles.bannerLocked}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>Periode pendaftaran telah berakhir. Data kelompok sudah terkunci.</span>
        </div>
      )}

      {/* ═══ DETAIL KELOMPOK ══════════════════════════════════════════ */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardIcon}><Users size={22} /></div>
            <div>
              {editMode ? (
                <input
                  className={styles.editTitle}
                  value={editNama}
                  onChange={e => setEditNama(e.target.value)}
                  placeholder="Nama kelompok"
                  maxLength={80}
                />
              ) : (
                <h1 className={styles.kelompokNama}>{data.nama_kelompok}</h1>
              )}
              <p className={styles.kelompokMeta}>
                {editMode ? (
                  <select
                    className={styles.editSelect}
                    value={editKelas}
                    onChange={e => setEditKelas(e.target.value)}
                  >
                    {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                ) : (
                  <>Kelas {data.kelas} &middot; {data.tahun_kegiatan}</>
                )}
              </p>
            </div>
          </div>
          {isEditable && !editMode && (
            <button className={styles.editBtn} onClick={() => setEditMode(true)}>
              <Edit2 size={15} /> Edit
            </button>
          )}
          {editMode && (
            <button className={styles.cancelBtn} onClick={handleCancelEdit}>
              <X size={15} /> Batal
            </button>
          )}
        </div>

        {/* Info tambahan */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Sub-Tema / Objek Fokus</span>
            {editMode ? (
              <input
                className={styles.editInput}
                value={editSubTema}
                onChange={e => setEditSubTema(e.target.value)}
                placeholder="Sub-tema (opsional)"
                maxLength={120}
              />
            ) : (
              <span className={styles.infoValue}>{data.sub_tema || <em style={{ color: "#94a3b8" }}>—</em>}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Guru Pembimbing</span>
            {editMode ? (
              <input
                className={styles.editInput}
                value={editGuru}
                onChange={e => setEditGuru(e.target.value)}
                placeholder="Nama guru pembimbing (opsional)"
                maxLength={80}
              />
            ) : (
              <span className={styles.infoValue}>{data.guru_pembimbing || <em style={{ color: "#94a3b8" }}>—</em>}</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══ TABEL ANGGOTA ════════════════════════════════════════════ */}
      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        <div className={styles.anggotaHeader}>
          Anggota Kelompok &amp; Pembagian Peran
        </div>
        <table className={styles.anggotaTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>NIS</th>
              <th>Peran</th>
            </tr>
          </thead>
          <tbody>
            {(editMode ? editAnggota : data.anggota_kelompok).map((a, idx) => (
              <tr key={a.id ?? idx}>
                <td className={styles.tdNo}>{a.urutan ?? idx + 1}</td>
                <td className={styles.tdNama}>
                  {editMode ? (
                    <input
                      className={styles.cellInput}
                      value={a.nama}
                      onChange={e => updateEditAnggota(idx, "nama", e.target.value)}
                      placeholder="Nama siswa"
                      maxLength={60}
                    />
                  ) : (
                    a.nama
                  )}
                </td>
                <td className={styles.tdNis}>
                  {editMode ? (
                    <input
                      className={styles.cellInput}
                      value={a.nis ?? ""}
                      onChange={e => updateEditAnggota(idx, "nis", e.target.value)}
                      placeholder="NIS"
                      maxLength={20}
                    />
                  ) : (
                    a.nis || <span style={{ color: "#94a3b8" }}>—</span>
                  )}
                </td>
                <td className={styles.tdPeran}>
                  <span className={styles.peranChip}>
                    {PERAN_EMOJI[a.peran] ?? "👤"} {a.peran}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Save error ── */}
      {saveError && (
        <div className={styles.errorBox} role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className={styles.actions}>
        {editMode ? (
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader2 size={16} className={styles.spin} /> Menyimpan…</>
              : <><CheckCircle size={16} /> Simpan Perubahan</>
            }
          </button>
        ) : (
          <>
            <button className={styles.printBtn} onClick={() => window.print()}>
              <Printer size={16} /> Cetak / Simpan PDF
            </button>
            <Link href="/kokurikuler/kelompok/daftar" className={styles.newBtn}>
              <Users size={16} /> Daftarkan Kelompok Lain
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
