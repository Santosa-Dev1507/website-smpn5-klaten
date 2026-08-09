"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogIn, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import styles from "../portal.module.css";
import Link from "next/link";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Cek apakah user sudah terautentikasi
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        // Jika token kedaluwarsa / invalid, bersihkan sesi lokal agar tidak 400 error
        supabase.auth.signOut();
        return;
      }
      if (session) {
        router.replace("/kokurikuler/portal");
      }
    }).catch(() => {
      supabase.auth.signOut();
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email atau password salah. Pastikan menggunakan akun sekolah.");
        } else if (authError.message.includes("Failed to fetch")) {
          setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/kokurikuler/portal");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan yang tidak terduga. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.loginHeader}>
          <div className={styles.loginIconWrap}>
            <ShieldCheck size={28} aria-hidden="true" />
          </div>
          <h1 className={styles.loginTitle}>Portal Penilaian</h1>
          <p className={styles.loginSubtitle}>
            Khusus Guru &amp; Panitia Kokurikuler<br />
            <span className={styles.loginSchool}>SMP Negeri 5 Klaten</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.loginForm} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="portal-email" className={styles.formLabel}>
              Email Sekolah
            </label>
            <input
              id="portal-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@smpn5klaten.sch.id"
              required
              autoComplete="email"
              className={styles.formInput}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="portal-password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="portal-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
                className={styles.formInput}
                style={{ paddingRight: "48px" }}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert} role="alert" id="login-error">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <div className={styles.btnSpinner} aria-hidden="true" />
                Masuk…
              </>
            ) : (
              <>
                <LogIn size={16} aria-hidden="true" />
                Masuk ke Portal
              </>
            )}
          </button>
        </form>

        <p className={styles.loginBack}>
          <Link href="/kokurikuler">← Kembali ke halaman kokurikuler</Link>
        </p>
      </div>
    </div>
  );
}
