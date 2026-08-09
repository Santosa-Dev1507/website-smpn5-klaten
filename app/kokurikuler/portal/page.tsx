"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Penilaian, KursiSiswa, KelompokKerja } from "@/lib/kokurikuler";
import { DIMENSI_LIST, PREDIKAT_LABELS, RUBRIK } from "@/lib/kokurikuler";
import {
  LogOut, Download, PlusCircle, Trash2, Users,
  CheckCircle, AlertCircle, Loader2, Search, Eye, Sparkles, CheckCheck, RefreshCw, FileSpreadsheet
} from "lucide-react";
import styles from "./portal.module.css";
import Link from "next/link";

const ASESMEN_LIST = ["Sumatif", "Formatif"] as const;
const KELAS_LIST   = ["VIII A", "VIII B", "VIII C", "VIII D", "VIII E", "VIII F", "VIII G", "VIII H"];

interface ClassStudentRow {
  nama_siswa: string;
  kelas: string;
  kelompok: string;
  penalaran_kritis: 'SB' | 'B' | 'C' | 'K';
  kolaborasi: 'SB' | 'B' | 'C' | 'K';
  komunikasi_kreativitas: 'SB' | 'B' | 'C' | 'K';
  catatan: string;
}

interface PenilaianRow extends Penilaian {
  id: string;
}

// Sample Roster per kelas untuk mode pratinjau / fallback
const DEFAULT_ROSTERS: Record<string, { nama: string; kelompok?: string }[]> = {
  "VIII A": [
    { nama: "Ahmad Rizky Pratama", kelompok: "Kelompok 1 — Benteng Willem I" },
    { nama: "Anisa Nur Rahma", kelompok: "Kelompok 1 — Benteng Willem I" },
    { nama: "Bagus Setyawan", kelompok: "Kelompok 1 — Benteng Willem I" },
    { nama: "Bintang Pamungkas", kelompok: "Kelompok 2 — Lawang Sewu" },
    { nama: "Citra Dewi Maharani", kelompok: "Kelompok 2 — Lawang Sewu" },
    { nama: "Dewa Adi Nugroho", kelompok: "Kelompok 2 — Lawang Sewu" },
    { nama: "Dian Wahyuni", kelompok: "Kelompok 3 — Saloka Park" },
    { nama: "Eka Putri Lestari", kelompok: "Kelompok 3 — Saloka Park" },
  ],
  "VIII B": [
    { nama: "Fajar Hidayat", kelompok: "Kelompok 4 — Ambarawa History" },
    { nama: "Fitri Astuti", kelompok: "Kelompok 4 — Ambarawa History" },
    { nama: "Gilang Ramadhan", kelompok: "Kelompok 4 — Ambarawa History" },
    { nama: "Hendra Wijaya", kelompok: "Kelompok 5 — Semarang Heritage" },
    { nama: "Indah Permata", kelompok: "Kelompok 5 — Semarang Heritage" },
    { nama: "Joko Susilo", kelompok: "Kelompok 5 — Semarang Heritage" },
  ],
  "VIII C": [
    { nama: "Kartika Sari", kelompok: "Kelompok 6 — Sains Saloka" },
    { nama: "Lestari Anggraini", kelompok: "Kelompok 6 — Sains Saloka" },
    { nama: "Muhammad Farhan", kelompok: "Kelompok 6 — Sains Saloka" },
    { nama: "Nadia Utami", kelompok: "Kelompok 7 — Budaya Bangsa" },
    { nama: "Naufal Hafizh", kelompok: "Kelompok 7 — Budaya Bangsa" },
  ],
};

export default function PortalDashboard() {
  const router = useRouter();

  // ── Auth & User State ──
  const [userName, setUserName]   = useState("Guru Pendamping (Mode Pratinjau)");
  const [authToken, setAuthToken] = useState<string | null>("preview-mode");

  // ── Header Form Sekali Isi (Per Kelas) ──
  const [selectedKelas, setSelectedKelas] = useState<string>("VIII A");
  const [dinilaiOleh, setDinilaiOleh]     = useState<string>("Budi Santoso, S.Pd");
  const [jenisAsesmen, setJenisAsesmen]   = useState<string>("Sumatif");
  const [tahunKegiatan, setTahunKegiatan] = useState<string>("2026/2027");

  // ── Roster & Matriks Penilaian 1 Kelas ──
  const [matrixRows, setMatrixRows]       = useState<ClassStudentRow[]>([]);
  const [allSiswaData, setAllSiswaData]   = useState<{ nama_siswa: string; kelas: string; kelompok?: string }[]>([]);

  // ── Data Rekap Tersimpan ──
  const [rekapList, setRekapList]         = useState<PenilaianRow[]>([]);
  const [loadingData, setLoadingData]     = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [formSuccess, setFormSuccess]     = useState<string | null>(null);
  const [formError, setFormError]         = useState<string | null>(null);

  // ── Filter Tabel Rekap ──
  const [filterKelasRekap, setFilterKelasRekap] = useState<string>("");
  const [searchNamaRekap, setSearchNamaRekap]   = useState<string>("");

  // 1. Ambil data siswa dari GAS (kursi/kelompok) jika tersedia
  useEffect(() => {
    fetch("/api/kokurikuler/data?tab=kursi")
      .then(r => r.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          const mapped = json.data.map((k: KursiSiswa) => ({
            nama_siswa: k.nama_siswa,
            kelas: k.kelas,
            kelompok: `Bus ${k.bus_id} · Kursi ${k.nomor_kursi}`,
          }));
          setAllSiswaData(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Load daftar siswa saat kelas berubah
  const loadClassRoster = useCallback((kelas: string) => {
    let siswaInClass: { nama: string; kelompok?: string }[] = [];

    // Cari dari data GAS jika ada
    const fromGas = allSiswaData.filter(s => s.kelas === kelas);
    if (fromGas.length > 0) {
      siswaInClass = fromGas.map(s => ({ nama: s.nama_siswa, kelompok: s.kelompok }));
    } else if (DEFAULT_ROSTERS[kelas]) {
      siswaInClass = DEFAULT_ROSTERS[kelas];
    } else {
      // Dummy 5 siswa untuk kelas lain
      siswaInClass = Array.from({ length: 5 }, (_, i) => ({
        nama: `Siswa ${i + 1} (${kelas})`,
        kelompok: `Kelompok ${i + 1}`,
      }));
    }

    // Bangun matriks baris
    const rows: ClassStudentRow[] = siswaInClass.map(s => ({
      nama_siswa: s.nama,
      kelas,
      kelompok: s.kelompok ?? "-",
      penalaran_kritis: "B",
      kolaborasi: "B",
      komunikasi_kreativitas: "B",
      catatan: "",
    }));

    setMatrixRows(rows);
  }, [allSiswaData]);

  useEffect(() => {
    loadClassRoster(selectedKelas);
  }, [selectedKelas, loadClassRoster]);

  // Cek session Supabase jika ada
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthToken(session.access_token);
        setUserName(session.user.email ?? "Guru");
        fetchRekapFromDatabase(session.access_token);
      }
    });
  }, []);

  const fetchRekapFromDatabase = async (token: string) => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/kokurikuler/penilaian", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.data) setRekapList(json.data);
    } catch {
      // silent
    } finally {
      setLoadingData(false);
    }
  };

  // ── Quick Fill Actions (Isi Cepat 1 Kelas) ──
  const handleQuickFill = (predikat: 'SB' | 'B' | 'C' | 'K') => {
    setMatrixRows(prev => prev.map(r => ({
      ...r,
      penalaran_kritis: predikat,
      kolaborasi: predikat,
      komunikasi_kreativitas: predikat,
    })));
  };

  // ── Handle Per-Row Input ──
  const updateRowField = (idx: number, field: keyof ClassStudentRow, value: string) => {
    setMatrixRows(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // ── Submit Penilaian Massal 1 Kelas ──
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!dinilaiOleh) {
      setFormError("Mohon isi Nama Guru yang menilai.");
      return;
    }

    if (matrixRows.length === 0) {
      setFormError("Belum ada siswa di kelas ini.");
      return;
    }

    setSubmitting(true);

    // Ubah 1 siswa × 3 dimensi menjadi array record penilaian
    const recordsToInsert: PenilaianRow[] = [];
    matrixRows.forEach((r, idx) => {
      const dimensiArr = [
        { dimensi: "Penalaran Kritis" as const, predikat: r.penalaran_kritis },
        { dimensi: "Kolaborasi" as const, predikat: r.kolaborasi },
        { dimensi: "Komunikasi/Kreativitas" as const, predikat: r.komunikasi_kreativitas },
      ];

      dimensiArr.forEach(d => {
        recordsToInsert.push({
          id: `local-${Date.now()}-${idx}-${d.dimensi}`,
          nama_siswa: r.nama_siswa,
          kelas: r.kelas,
          kelompok: r.kelompok,
          dimensi: d.dimensi,
          predikat: d.predikat,
          catatan: r.catatan || undefined,
          dinilai_oleh: dinilaiOleh,
          jenis_asesmen: jenisAsesmen as any,
          tahun_kegiatan: tahunKegiatan,
          created_at: new Date().toISOString(),
        });
      });
    });

    // Jika terautentikasi ke Supabase, kirim POST batch
    if (authToken && authToken !== "preview-mode") {
      try {
        const res = await fetch("/api/kokurikuler/penilaian", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(recordsToInsert),
        });
        const json = await res.json();
        if (res.ok) {
          fetchRekapFromDatabase(authToken);
        } else {
          setRekapList(prev => [...recordsToInsert, ...prev]);
        }
      } catch {
        setRekapList(prev => [...recordsToInsert, ...prev]);
      }
    } else {
      // Simpan langsung di local state untuk peninjauan
      setRekapList(prev => [...recordsToInsert, ...prev]);
    }

    setSubmitting(false);
    setFormSuccess(`Berhasil menyimpan ${recordsToInsert.length} data penilaian untuk seluruh siswa ${selectedKelas}!`);
    setTimeout(() => setFormSuccess(null), 4000);
  };

  // ── Ekspor Excel (.xlsx) per kelas / seluruh kelas ──
  const handleExportExcel = async (targetKelas?: string) => {
    const { utils, writeFile } = await import("xlsx");

    const dataToExport = targetKelas
      ? rekapList.filter(r => r.kelas === targetKelas)
      : (rekapList.length > 0 ? rekapList : generatePreviewMatrixForExport());

    if (dataToExport.length === 0) {
      alert("Belum ada data nilai untuk diekspor. Silakan klik 'Simpan Nilai Kelas' terlebih dahulu.");
      return;
    }

    // Kelompokkan per (nama_siswa, kelas) untuk format matriks e-rapor
    const studentMap = new Map<string, Record<string, string>>();

    dataToExport.forEach(item => {
      const key = `${item.kelas}_${item.nama_siswa}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          "Nama Siswa": item.nama_siswa,
          "Kelas": item.kelas,
          "Kelompok": item.kelompok ?? "-",
          "Penalaran Kritis": "-",
          "Kolaborasi": "-",
          "Komunikasi/Kreativitas": "-",
          "Catatan Deskripsi Capaian": item.catatan ?? "-",
          "Guru Penilai": item.dinilai_oleh,
          "Jenis Asesmen": item.jenis_asesmen,
          "Tahun Kegiatan": item.tahun_kegiatan ?? "2026/2027",
        });
      }
      const record = studentMap.get(key)!;
      record[item.dimensi] = `${item.predikat} (${PREDIKAT_LABELS[item.predikat] ?? item.predikat})`;
      if (item.catatan && record["Catatan Deskripsi Capaian"] === "-") {
        record["Catatan Deskripsi Capaian"] = item.catatan;
      }
    });

    const exportRows = Array.from(studentMap.values());
    const ws = utils.json_to_sheet(exportRows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, targetKelas ? `Kelas ${targetKelas}` : "Rekap Nilai E-Rapor");

    // Set lebar kolom yang rapi
    ws["!cols"] = [
      { wch: 30 }, { wch: 10 }, { wch: 25 },
      { wch: 22 }, { wch: 22 }, { wch: 26 },
      { wch: 45 }, { wch: 24 }, { wch: 14 }, { wch: 16 }
    ];

    const fileName = targetKelas
      ? `E-Rapor_Kokurikuler_Kelas_${targetKelas.replace(" ", "_")}.xlsx`
      : `E-Rapor_Kokurikuler_Seluruh_Kelas.xlsx`;

    writeFile(wb, fileName);
  };

  // Helper jika ekspor diklik sebelum simpan di mode pratinjau
  const generatePreviewMatrixForExport = () => {
    const list: PenilaianRow[] = [];
    matrixRows.forEach((r, idx) => {
      list.push(
        { id: `exp-1-${idx}`, nama_siswa: r.nama_siswa, kelas: r.kelas, kelompok: r.kelompok, dimensi: "Penalaran Kritis", predikat: r.penalaran_kritis, catatan: r.catatan, dinilai_oleh: dinilaiOleh, jenis_asesmen: jenisAsesmen as any, tahun_kegiatan: tahunKegiatan },
        { id: `exp-2-${idx}`, nama_siswa: r.nama_siswa, kelas: r.kelas, kelompok: r.kelompok, dimensi: "Kolaborasi", predikat: r.kolaborasi, catatan: r.catatan, dinilai_oleh: dinilaiOleh, jenis_asesmen: jenisAsesmen as any, tahun_kegiatan: tahunKegiatan },
        { id: `exp-3-${idx}`, nama_siswa: r.nama_siswa, kelas: r.kelas, kelompok: r.kelompok, dimensi: "Komunikasi/Kreativitas", predikat: r.komunikasi_kreativitas, catatan: r.catatan, dinilai_oleh: dinilaiOleh, jenis_asesmen: jenisAsesmen as any, tahun_kegiatan: tahunKegiatan }
      );
    });
    return list;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/kokurikuler");
  };

  const handleDeleteRekap = (id: string) => {
    if (!confirm("Hapus baris data penilaian ini?")) return;
    setRekapList(prev => prev.filter(r => r.id !== id));
  };

  // Filter rekap
  const filteredRekap = rekapList.filter(r => {
    const matchKelas = !filterKelasRekap || r.kelas === filterKelasRekap;
    const matchNama  = !searchNamaRekap  || r.nama_siswa.toLowerCase().includes(searchNamaRekap.toLowerCase());
    return matchKelas && matchNama;
  });

  return (
    <div className={styles.dashboard}>
      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <Link href="/kokurikuler" className={styles.topbarBack}>← Kembali ke Kokurikuler</Link>
          <span className={styles.topbarTitle}>Portal Penilaian Guru — Matriks Per Kelas</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.topbarUser}>
            <Eye size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            {userName}
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} aria-hidden="true" />
            Tutup Portal
          </button>
        </div>
      </header>

      <div className={styles.dashContent}>

        {/* Banner Pratinjau */}
        {authToken === "preview-mode" && (
          <div className={styles.previewBanner}>
            <Eye size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Mode Pratinjau &amp; Penilaian Massal Per Kelas Aktif:</strong> Anda tidak perlu mengetik nama siswa 1 per 1 lagi. Cukup pilih kelas, klik tombol <em>&quot;Set Semua B (Baik)&quot;</em>, atur nilai 3 dimensi sekaligus, dan unduh format **Excel (.xlsx)** untuk e-rapor!
            </div>
          </div>
        )}

        {/* ══ MATRIKS PENILAIAN 1 KELAS ═════════════════════════════════ */}
        <section className={styles.formSection}>
          <div className={styles.sectionHeaderWrap}>
            <div>
              <h2 className={styles.sectionTitle}>
                <PlusCircle size={20} aria-hidden="true" />
                Matriks Penilaian Kokurikuler Massal
              </h2>
              <p className={styles.sectionSub}>
                Input nilai 3 Dimensi Profil Lulusan sekaligus untuk seluruh siswa di kelas.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveClass} className={styles.form}>
            {/* Header Informasi Sekali Isi */}
            <div className={styles.headerControlGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pilih Kelas <span className={styles.req}>*</span></label>
                <select
                  className={styles.selectHighlight}
                  value={selectedKelas}
                  onChange={e => setSelectedKelas(e.target.value)}
                >
                  {KELAS_LIST.map(k => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Dinilai Oleh Guru Mapel <span className={styles.req}>*</span></label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={dinilaiOleh}
                  onChange={e => setDinilaiOleh(e.target.value)}
                  placeholder="Nama lengkap &amp; gelar guru"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Jenis Asesmen</label>
                <select
                  className={styles.select}
                  value={jenisAsesmen}
                  onChange={e => setJenisAsesmen(e.target.value)}
                >
                  {ASESMEN_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tahun Pelajaran</label>
                <input
                  type="text"
                  className={styles.input}
                  value={tahunKegiatan}
                  onChange={e => setTahunKegiatan(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Fill Actions (Isi Cepat 1 Kelas) */}
            <div className={styles.quickFillBar}>
              <span className={styles.quickFillLabel}>
                <Sparkles size={16} /> Fitur Aksi Cepat ({selectedKelas}):
              </span>
              <button
                type="button"
                className={styles.quickBtn}
                onClick={() => handleQuickFill("B")}
              >
                <CheckCheck size={15} /> Set Semua &quot;B (Baik)&quot;
              </button>
              <button
                type="button"
                className={styles.quickBtnSecondary}
                onClick={() => handleQuickFill("SB")}
              >
                ⭐ Set Semua &quot;SB (Sangat Baik)&quot;
              </button>
              <button
                type="button"
                className={styles.quickBtnGhost}
                onClick={() => loadClassRoster(selectedKelas)}
              >
                <RefreshCw size={14} /> Reset
              </button>
            </div>

            {/* Tabel Matriks Penilaian Siswa */}
            <div className={styles.matrixTableWrapper}>
              <table className={styles.matrixTable}>
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>No</th>
                    <th style={{ minWidth: "180px" }}>Nama Siswa</th>
                    <th style={{ minWidth: "140px" }}>Kelompok</th>
                    <th style={{ width: "160px" }}>Penalaran Kritis</th>
                    <th style={{ width: "160px" }}>Kolaborasi</th>
                    <th style={{ width: "160px" }}>Komunikasi/Kreativitas</th>
                    <th style={{ minWidth: "200px" }}>Catatan Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.tdCenter}>{idx + 1}</td>
                      <td className={styles.tdNama}>{row.nama_siswa}</td>
                      <td className={styles.tdKelompok}>{row.kelompok}</td>
                      
                      {/* Dropdown Dimensi 1 */}
                      <td>
                        <select
                          className={`${styles.cellSelect} ${styles[`badge${row.penalaran_kritis}`]}`}
                          value={row.penalaran_kritis}
                          onChange={e => updateRowField(idx, "penalaran_kritis", e.target.value)}
                        >
                          <option value="SB">SB — Sangat Baik</option>
                          <option value="B">B — Baik</option>
                          <option value="C">C — Cukup</option>
                          <option value="K">K — Kurang</option>
                        </select>
                      </td>

                      {/* Dropdown Dimensi 2 */}
                      <td>
                        <select
                          className={`${styles.cellSelect} ${styles[`badge${row.kolaborasi}`]}`}
                          value={row.kolaborasi}
                          onChange={e => updateRowField(idx, "kolaborasi", e.target.value)}
                        >
                          <option value="SB">SB — Sangat Baik</option>
                          <option value="B">B — Baik</option>
                          <option value="C">C — Cukup</option>
                          <option value="K">K — Kurang</option>
                        </select>
                      </td>

                      {/* Dropdown Dimensi 3 */}
                      <td>
                        <select
                          className={`${styles.cellSelect} ${styles[`badge${row.komunikasi_kreativitas}`]}`}
                          value={row.komunikasi_kreativitas}
                          onChange={e => updateRowField(idx, "komunikasi_kreativitas", e.target.value)}
                        >
                          <option value="SB">SB — Sangat Baik</option>
                          <option value="B">B — Baik</option>
                          <option value="C">C — Cukup</option>
                          <option value="K">K — Kurang</option>
                        </select>
                      </td>

                      {/* Input Catatan */}
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          placeholder="Catatan siswa (opsional)"
                          value={row.catatan}
                          onChange={e => updateRowField(idx, "catatan", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {formError && (
              <div className={styles.alertError} role="alert">
                <AlertCircle size={16} /> <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className={styles.alertSuccess} role="status">
                <CheckCircle size={16} /> <span>{formSuccess}</span>
              </div>
            )}

            {/* Bottom Actions Form */}
            <div className={styles.formBottomBar}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? (
                  <><Loader2 size={16} className={styles.spin} /> Menyimpan Kelas {selectedKelas}…</>
                ) : (
                  <><CheckCircle size={16} /> Simpan Nilai Kelas {selectedKelas}</>
                )}
              </button>

              <button
                type="button"
                className={styles.exportClassBtn}
                onClick={() => handleExportExcel(selectedKelas)}
              >
                <FileSpreadsheet size={16} /> Ekspor Excel Kelas {selectedKelas} (.xlsx)
              </button>
            </div>
          </form>
        </section>

        {/* ══ TABEL REKAPITULASI PENILAIAN ═════════════════════════════ */}
        <section className={styles.tableSection}>
          <div className={styles.tableTopBar}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Users size={18} /> Rekapitulasi Penilaian Tersimpan ({filteredRekap.length})
              </h2>
              <p className={styles.sectionSub}>Seluruh rekapitulasi data nilai yang telah disimpan ke sistem.</p>
            </div>
            <div className={styles.tableActions}>
              <select
                className={styles.filterSelect}
                value={filterKelasRekap}
                onChange={e => setFilterKelasRekap(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <div className={styles.searchWrap}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Cari nama siswa…"
                  className={styles.searchInput}
                  value={searchNamaRekap}
                  onChange={e => setSearchNamaRekap(e.target.value)}
                />
              </div>
              <button className={styles.exportBtn} onClick={() => handleExportExcel()}>
                <Download size={15} /> Ekspor Seluruh Rekap (.xlsx)
              </button>
            </div>
          </div>

          {filteredRekap.length === 0 ? (
            <div className={styles.emptyState}>
              <Users size={36} strokeWidth={1.5} />
              <p>Belum ada data rekap tersimpan. Klik <strong>&quot;Simpan Nilai Kelas&quot;</strong> di atas untuk menyimpan.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Kelompok</th>
                    <th>Dimensi Profil Lulusan</th>
                    <th>Predikat</th>
                    <th>Guru Penilai</th>
                    <th>Catatan</th>
                    <th><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRekap.map(r => (
                    <tr key={r.id}>
                      <td className={styles.tdNama}>{r.nama_siswa}</td>
                      <td>{r.kelas}</td>
                      <td>{r.kelompok ?? "—"}</td>
                      <td><span className={styles.badgeDimensi}>{r.dimensi}</span></td>
                      <td>
                        <span className={`${styles.badge} ${styles[`badge${r.predikat}`]}`}>
                          {r.predikat} — {PREDIKAT_LABELS[r.predikat]}
                        </span>
                      </td>
                      <td>{r.dinilai_oleh}</td>
                      <td className={styles.tdCatatan}>{r.catatan || "—"}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteRekap(r.id)}
                          aria-label="Hapus nilai"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ══ PANDUAN & CHECKLIST TUGAS GURU PENDAMPING ═══════════════════ */}
        <section className={styles.formSection} style={{ marginTop: 24 }}>
          <div className={styles.sectionHeaderWrap}>
            <div>
              <h2 className={styles.sectionTitle}>
                <CheckCheck size={20} aria-hidden="true" />
                Panduan &amp; Checklist Tugas Guru Pendamping
              </h2>
              <p className={styles.sectionSub}>
                Petunjuk alur kerja guru pendamping dari pra-kegiatan, pendampingan lapangan Semarang, hingga asesmen sumatif &amp; e-rapor.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {/* Pra Kegiatan */}
            <div style={{ background: "#fdf8f2", border: "1.5px solid rgba(148, 69, 53, 0.15)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#944535", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>1.</span> Pra-Kegiatan (H-7 s.d H-1)
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem", color: "#334155" }}>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pra-1" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pra-1"><strong>Materi Pembekalan:</strong> Menyampaikan pengantar sejarah &amp; nilai perjuangan (Guru IPS/PPKn).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pra-2" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pra-2"><strong>Instrumen LKPD:</strong> Menyusun &amp; membagikan panduan observasi LKPD tiap kelompok.</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pra-3" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pra-3"><strong>Bimbingan Pertanyaan:</strong> Membimbing susunan pertanyaan wawancara pemandu (Bahasa Indonesia).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pra-4" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pra-4"><strong>Kelompok Heterogen:</strong> Membentuk kelompok 5–6 siswa &amp; membagikan perannya.</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pra-5" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pra-5"><strong>Briefing Akhir H-1:</strong> Cek kesiapan kelompok, memimpin doa bersama, &amp; pengarahan jam 06.30 WIB.</label>
                </li>
              </ul>
            </div>

            {/* Saat Pelaksanaan */}
            <div style={{ background: "#fdf8f2", border: "1.5px solid rgba(148, 69, 53, 0.15)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#944535", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>2.</span> Saat Pelaksanaan (Hari-H)
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem", color: "#334155" }}>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-saat-1" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-saat-1"><strong>Saloka Park:</strong> Memandu kegiatan kebersamaan kelompok (penguatan dimensi Kolaborasi).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-saat-2" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-saat-2"><strong>Benteng Willem I &amp; Lawang Sewu:</strong> Mengarahkan siswa ke papan informasi &amp; sumber fakta sejarah.</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-saat-3" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-saat-3"><strong>Asesmen Formatif:</strong> Mencatat keterlibatan &amp; perilaku siswa (Catatan Anekdotal).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-saat-4" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-saat-4"><strong>Refleksi Singkat:</strong> Mengaitkan amatan fisik museum dengan nilai kewargaan &amp; cinta tanah air.</label>
                </li>
              </ul>
            </div>

            {/* Pasca Kegiatan */}
            <div style={{ background: "#fdf8f2", border: "1.5px solid rgba(148, 69, 53, 0.15)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#944535", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>3.</span> Pasca-Kegiatan &amp; Rapor
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: "0.88rem", color: "#334155" }}>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pasca-1" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pasca-1"><strong>Bimbingan Karya:</strong> Membimbing aspek kreativitas penyajian karya Laporan/Poster/Vlog (Guru Seni Budaya).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pasca-2" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pasca-2"><strong>Presentasi Kelas:</strong> Memandu sesi presentasi kelompok &amp; memfasilitasi tanya-jawab antar kelompok.</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pasca-3" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pasca-3"><strong>Asesmen Sumatif Rubrik:</strong> Menilai karya 3 Dimensi (Penalaran Kritis, Kolaborasi, Komunikasi/Kreativitas).</label>
                </li>
                <li style={{ display: "flex", gap: 10 }}>
                  <input type="checkbox" id="g-pasca-4" style={{ marginTop: 3, accentColor: "#944535" }} />
                  <label htmlFor="g-pasca-4"><strong>Input Matriks &amp; Ekspor:</strong> Mengisi Matriks Penilaian Massal di atas &amp; mengunduh <strong>Excel (.xlsx)</strong> untuk e-rapor.</label>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
