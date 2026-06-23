"use client";

import { useState, useId } from "react";
import styles from "./alumni.module.css";
import { validateNisn } from "./actions";

export default function AlumniForm() {
  const id = useId();
  const [step, setStep] = useState<"form" | "success" | "loading">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [docData, setDocData] = useState<{
    linkIjazah: string;
    linkShtka: string;
    nama: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    const result = await validateNisn({
      nisn:          (formData.get("nisn")          as string ?? "").trim(),
      nama:          (formData.get("nama")          as string ?? "").trim(),
      email:         (formData.get("email")         as string ?? "").trim(),
      telepon:       (formData.get("telepon")       as string ?? "").trim(),
      tahunLulus:    (formData.get("tahunLulus")    as string ?? "").trim(),
      kelasTerakhir: (formData.get("kelasTerakhir") as string ?? "").trim(),
      status:        (formData.get("status")        as string ?? "").trim(),
      instansi:      (formData.get("instansi")      as string ?? "").trim(),
    });

    if (result.success && result.data) {
      setDocData(result.data);
      setStep("success");
    } else {
      setErrorMsg(result.message || "Terjadi kesalahan.");
      setStep("form");
    }
  };

  if (step === "loading") {
    return (
      <div className={styles.loadingContainer} role="status" aria-live="polite" aria-label="Memproses data Anda">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Memproses data Anda...</p>
      </div>
    );
  }

  if (step === "success" && docData) {
    const hasIjazah = docData.linkIjazah && docData.linkIjazah.trim() !== "";
    const hasShtka = docData.linkShtka && docData.linkShtka.trim() !== "";

    return (
      <div className={styles.successContainer} role="region" aria-live="polite" aria-label="Dokumen berhasil ditemukan">
        <div className={styles.successIconWrap} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Terima Kasih, {docData.nama}!</h3>
        <p>Data profil Anda telah berhasil diperbarui.</p>
        <p className={styles.successNote}>
          Sebagai apresiasi, Anda sekarang dapat mengunduh dokumen kelulusan Anda di bawah ini:
        </p>

        {!hasIjazah && !hasShtka && (
          <p className={styles.noDocNote}>
            Dokumen Anda sedang disiapkan. Silakan hubungi sekolah untuk informasi lebih lanjut.
          </p>
        )}

        <div className={styles.docLinks}>
          {hasIjazah && (
            <a
              href={docData.linkIjazah}
              download
              className={styles.docButton}
              aria-label={`Unduh file Ijazah milik ${docData.nama}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
              </svg>
              Unduh File Ijazah
            </a>
          )}
          {hasShtka && (
            <a
              href={docData.linkShtka}
              download
              className={styles.docButtonAlt}
              aria-label={`Unduh file SH TKA milik ${docData.nama}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              Unduh File SH TKA
            </a>
          )}
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => { setStep("form"); setDocData(null); setErrorMsg(""); }}
          aria-label="Cek dokumen untuk alumni lain"
        >
          Cek NISN Lain
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.formHeaderIcon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h3>Lengkapi Profil Alumni</h3>
        <p>Isi data singkat Anda untuk mendapatkan akses ke dokumen kelulusan (Ijazah &amp; SH TKA).</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.alumniForm} noValidate>
        {errorMsg && (
          <div
            className={styles.errorMessage}
            role="alert"
            aria-live="assertive"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {errorMsg}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-nisn`}>
            NISN (Nomor Induk Siswa Nasional) <span className={styles.required} aria-label="wajib diisi">*</span>
          </label>
          <input
            type="text"
            id={`${id}-nisn`}
            name="nisn"
            required
            placeholder="Contoh: 0091785188"
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-describedby={`${id}-nisn-help`}
          />
          <span className={styles.helperText} id={`${id}-nisn-help`}>
            10 digit angka, tercetak pada halaman depan ijazah Anda
          </span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-nama`}>
            Nama Lengkap (Sesuai Ijazah) <span className={styles.required} aria-label="wajib diisi">*</span>
          </label>
          <input
            type="text"
            id={`${id}-nama`}
            name="nama"
            required
            placeholder="Masukkan nama lengkap Anda"
            autoComplete="name"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor={`${id}-tahunLulus`}>
              Tahun Lulus <span className={styles.required} aria-label="wajib diisi">*</span>
            </label>
            <input
              type="number"
              id={`${id}-tahunLulus`}
              name="tahunLulus"
              required
              placeholder="Contoh: 2024"
              min="1987"
              max="2026"
              autoComplete="off"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`${id}-kelasTerakhir`}>Kelas Terakhir</label>
            <input
              type="text"
              id={`${id}-kelasTerakhir`}
              name="kelasTerakhir"
              placeholder="Contoh: IX A"
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor={`${id}-email`}>
              Email Aktif <span className={styles.required} aria-label="wajib diisi">*</span>
            </label>
            <input
              type="email"
              id={`${id}-email`}
              name="email"
              required
              placeholder="email@contoh.com"
              autoComplete="email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`${id}-telepon`}>
              Nomor WhatsApp <span className={styles.required} aria-label="wajib diisi">*</span>
            </label>
            <input
              type="tel"
              id={`${id}-telepon`}
              name="telepon"
              required
              placeholder="0812xxxxxxxx"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-status`}>Status Saat Ini</label>
          <select id={`${id}-status`} name="status" autoComplete="off">
            <option value="">-- Pilih Status --</option>
            <option value="SMA">Melanjutkan ke SMA/SMK/MA</option>
            <option value="Kuliah">Sedang Kuliah / Mahasiswa</option>
            <option value="Bekerja">Sudah Bekerja</option>
            <option value="Wirausaha">Wirausaha / Freelance</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-instansi`}>Nama Sekolah / Instansi Saat Ini</label>
          <input
            type="text"
            id={`${id}-instansi`}
            name="instansi"
            placeholder="Contoh: SMAN 1 Klaten / Universitas Gadjah Mada"
            autoComplete="organization"
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitBtn}
            aria-label="Kirim data dan ambil dokumen kelulusan"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Kirim Data &amp; Dapatkan Dokumen
          </button>
        </div>
      </form>
    </div>
  );
}
