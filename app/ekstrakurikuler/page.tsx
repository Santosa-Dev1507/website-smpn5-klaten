"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import ScrollReveal from "../components/ScrollReveal";
import styles from "./ekstrakurikuler.module.css";
import { supabase } from "@/lib/supabase";
import type { Ekskul } from "@/lib/supabase";
import {
  Trophy, Users, MapPin, Clock, ChevronRight,
  Dumbbell, Palette, FlaskConical, Heart, BookOpen,
  Music, Swords, Target, Globe, Microscope, Calculator,
} from "lucide-react";

type FilterKey = "Semua" | "Olahraga" | "Seni" | "Akademik" | "Lainnya";

const filters: { label: FilterKey; Icon: typeof Trophy; kategoriList: string[] | null }[] = [
  { label: "Semua",     Icon: Trophy,       kategoriList: null },
  { label: "Olahraga", Icon: Dumbbell,      kategoriList: ["Olahraga"] },
  { label: "Seni",     Icon: Palette,       kategoriList: ["Seni"] },
  { label: "Akademik", Icon: FlaskConical,  kategoriList: ["Akademik"] },
  { label: "Lainnya",  Icon: Heart,         kategoriList: ["Sosial", "Kepanduan", "Kedisiplinan", "Keagamaan"] },
];

// Helper warna kategori
const getColor = (kategori: string) => {
  if (kategori === "Olahraga") return "#006b5f";
  if (kategori === "Seni") return "#7b2d8b";
  if (kategori === "Akademik") return "#00429c";
  if (kategori === "Kepanduan") return "#2d6a4f";
  if (kategori === "Sosial") return "#c0392b";
  if (kategori === "Kedisiplinan") return "#1a237e";
  if (kategori === "Keagamaan") return "#5c3317";
  return "#444444";
};

export default function EkstrakulikulerPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("Semua");
  const [ekskulList, setEkskulList] = useState<Ekskul[]>([]);
  const [openEkskulIds, setOpenEkskulIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch active ekskul
      const { data: eks } = await supabase.from("ekskul").select("*, pembina:pembina_id(nama_lengkap)").eq("aktif", true).order("nama");
      const list = eks ?? [];
      setEkskulList(list as any[]);

      // 2. Cek periode
      const now = new Date().toISOString();
      const { data: per } = await supabase
        .from("periode_pendaftaran")
        .select("*")
        .eq("aktif", true)
        .lte("tanggal_buka", now)
        .gte("tanggal_tutup", now)
        .limit(1)
        .maybeSingle();
      
      if (per) {
        const { data: pe } = await supabase.from("periode_ekskul").select("ekskul_id").eq("periode_id", per.id);
        if (pe && pe.length > 0) {
          setOpenEkskulIds(pe.map((r: any) => r.ekskul_id));
        } else {
          setOpenEkskulIds(list.map(e => e.id));
        }
      } else {
        setOpenEkskulIds([]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // ── Count-up animation for stat pills ──
  useEffect(() => {
    const targets = [ekskulList.length || 11, 500, 25];
    const el = statsRef.current;
    if (!el || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        el.querySelectorAll<HTMLElement>("." + styles.heroStatNum).forEach((node, i) => {
          const end = targets[i];
          if (!end) return;
          let start = 0;
          const duration = 1200;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const suffix = i > 0 ? "+" : "";
            node.textContent = Math.round(ease * end) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, ekskulList.length]);

  const activeKategoriList = filters.find((f) => f.label === activeFilter)?.kategoriList;
  const filteredEkskul = activeKategoriList
    ? ekskulList.filter((e) => activeKategoriList.includes(e.kategori))
    : ekskulList;

  return (
    <main>
      <ScrollReveal />
      <Header activePage="Ekskul" />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Temukan Ekskul yang{" "}
              <span className={styles.heroTitleAccent}>Tepat Untukmu</span>
            </h1>
            <p className={styles.heroDesc}>
              {ekskulList.length > 0 ? ekskulList.length : 11} kegiatan ekstrakurikuler pilihan — dari olahraga, seni, hingga olimpiade sains.
              Pilih yang sesuai minatmu, daftar dalam hitungan menit.
            </p>
            <div className={styles.heroActions}>
              <a
                href="/ekstrakurikuler/daftar"
                className={styles.btnPrimary}
                id="btn-daftar-ekskul"
              >
                Pilih Ekskul Saya
                <ChevronRight size={18} aria-hidden />
              </a>
              <a
                href="/ekstrakurikuler/siswa"
                className={styles.btnSecondary}
                id="btn-dashboard-siswa"
              >
                Login Siswa
              </a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden>
            <div className={styles.heroOrb} />
            <div className={styles.heroStats} ref={statsRef}>
              {[
                { num: "0", label: "Ekskul Aktif" },
                { num: "0", label: "Siswa Bergabung" },
                { num: "0", label: "Prestasi Diraih" },
              ].map((s) => (
                <div key={s.label} className={styles.heroStatPill}>
                  <span className={styles.heroStatNum}>{s.num}</span>
                  <span className={styles.heroStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className={styles.filterSection}>
        <div className={styles.filterBar} role="tablist" aria-label="Filter kategori ekskul">
          {filters.map(({ label, Icon }) => (
            <button
              key={label}
              role="tab"
              aria-selected={activeFilter === label}
              className={`${styles.filterChip} ${activeFilter === label ? styles.filterChipActive : ""}`}
              onClick={() => setActiveFilter(label)}
            >
              <Icon size={14} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Daftar Ekskul ── */}
      <section className={styles.section} aria-label="Daftar ekstrakurikuler">
        <div className={styles.ekskulGrid}>
          {loading ? (
            <div style={{gridColumn:"1/-1", textAlign:"center", padding:"40px", color:"#666"}}>Memuat data ekstrakurikuler...</div>
          ) : filteredEkskul.length === 0 ? (
            <div style={{gridColumn:"1/-1", textAlign:"center", padding:"40px", color:"#666"}}>Tidak ada ekskul di kategori ini.</div>
          ) : (
            filteredEkskul.map((ekskul: any) => {
              const isOpen = openEkskulIds.includes(ekskul.id);
              const color = getColor(ekskul.kategori);
              return (
                <article
                  key={ekskul.id}
                  className={`${styles.ekskulCard} reveal`}
                  id={`ekskul-${ekskul.nama.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className={styles.ekskulCardHeader}
                    style={{ "--card-color": color } as React.CSSProperties}
                  >
                    <div className={styles.ekskulIconWrap} style={{fontSize:24}}>
                      {ekskul.emoji || "⭐"}
                    </div>
                    <span className={styles.ekskulCategory}>{ekskul.kategori}</span>
                  </div>
                  <div className={styles.ekskulBody}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <h2 className={styles.ekskulName}>{ekskul.nama}</h2>
                      {isOpen ? (
                        <span style={{fontSize:11,background:"#dcfce7",color:"#166534",padding:"2px 8px",borderRadius:12,fontWeight:600,whiteSpace:"nowrap",height:"fit-content"}}>Buka</span>
                      ) : (
                        <span style={{fontSize:11,background:"#f3f4f6",color:"#4b5563",padding:"2px 8px",borderRadius:12,fontWeight:600,whiteSpace:"nowrap",height:"fit-content"}}>Tutup</span>
                      )}
                    </div>
                    <p className={styles.ekskulDesc}>{ekskul.deskripsi}</p>
                    <div className={styles.ekskulMeta}>
                      <div className={styles.ekskulMetaItem}>
                        <Clock size={13} aria-hidden />
                        <span>{ekskul.jadwal || "-"}, {ekskul.waktu || "-"}</span>
                      </div>
                      <div className={styles.ekskulMetaItem}>
                        <MapPin size={13} aria-hidden />
                        <span>{ekskul.lokasi || "-"}</span>
                      </div>
                      <div className={styles.ekskulMetaItem}>
                        <Users size={13} aria-hidden />
                        <span>{ekskul.nama_pelatih || (ekskul.pembina?.nama_lengkap) || "-"}</span>
                      </div>
                    </div>
                    {isOpen ? (
                      <a href="/ekstrakurikuler/daftar" className={styles.ekskulBtn} aria-label={`Daftar ekskul ${ekskul.nama}`}>
                        Daftar Sekarang
                        <ChevronRight size={15} aria-hidden />
                      </a>
                    ) : (
                      <button className={styles.ekskulBtn} style={{background:"#f3f4f6",color:"#9ca3af",cursor:"not-allowed",border:"none"}} disabled>
                        Pendaftaran Ditutup
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaBanner} aria-labelledby="cta-heading">
        <div className={styles.ctaInner}>
          <Trophy size={40} className={styles.ctaIcon} aria-hidden />
          <h2 id="cta-heading" className={styles.ctaTitle}>Pendaftaran Dibuka</h2>
          <p className={styles.ctaDesc}>
            Jangan sampai kuota habis — pilih ekskul yang ingin kamu ikuti dan daftarkan dirimu sekarang.
          </p>
          <a href="/ekstrakurikuler/daftar" className={styles.ctaBtnPrimary} id="btn-daftar-ekskul-cta">
            Pilih Ekskul Saya
            <ChevronRight size={18} aria-hidden />
          </a>
          <div className={styles.ctaLinks}>
            <a href="/ekstrakurikuler/siswa" className={styles.ctaLink} id="btn-siswa-cta">Dashboard Siswa</a>
            <span className={styles.ctaSep} aria-hidden>·</span>
            <a href="/ekstrakurikuler/pembina" className={styles.ctaLink} id="btn-pembina-cta">Login Pembina</a>
            <span className={styles.ctaSep} aria-hidden>·</span>
            <a href="/ekstrakurikuler/walikelas" className={styles.ctaLink} id="btn-walikelas-cta">Wali Kelas</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SMPN 5 Klaten — Sistem Manajemen Ekstrakurikuler</p>
        <a href="/ekstrakurikuler/admin" className={styles.footerAdminLink} id="btn-admin-footer">
          Admin
        </a>
      </footer>
    </main>
  );
}
