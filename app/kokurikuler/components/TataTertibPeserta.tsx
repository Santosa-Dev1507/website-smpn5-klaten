// app/kokurikuler/components/TataTertibPeserta.tsx
// Tata Tertib Peserta Kokurikuler — statis, teks verbatim dari dokumen resmi.

import { PackageCheck, ShieldAlert, ListChecks } from "lucide-react";
import styles from "../kokurikuler.module.css";

const PERBEKALAN = [
  "Perlengkapan dan bekal pribadi secukupnya..",
  "Obat-obatan pribadi, terutama bagi peserta yang diharuskan mengkonsumsi obat secara terus menerus, obat HARUS DIBAWA.",
  "Peralatan komunikasi/HP, dan perlengkapannya",
  "Jaket, topi, kacamata, apabila diperlukan.",
  "Alas kaki (sepatu atau sandal) yang nyaman.",
  "Makanan kecil/snack secukupnya.",
  "Kartu identitas diri (Kartu Pelajar, KTA Pramuka, dll).",
  "Uang Saku secukupnya.",
];

const KEWAJIBAN = [
  "Harus sudah hadir di Sekolah paling lambat Pukul 06.00 wib.",
  "Peserta masuk ke Bus sesuai dengan daftar penumpang bus masing-masing.",
  "Peserta wajib memakai tanda pengenal yang sudah ditetapkan oleh sekolah.",
  "Peserta wajib mengikuti dan selalu berada bersama kelompoknya dan guru pembimbingnya.",
  "Membawa perlengkapan ibadah sesuai agama masing-masing.",
  "Bagi peserta yang mempunyai penyakit khusus diwajibkan melapor pada Guru Pendamping, atau crew bus dan membawa obat pribadi.",
  "Wajib menjaga kebersihan di dalam Bus dan lingkungan sekitarnya, serta dilarang membuang sampah sembarangan.",
  "Wajib menaati peraturan-peraturan dan adat istiadat yang ada di daerah tujuan wisata.",
  "Wajib menjaga nama baik SMP NEGERI 5 KLATEN, menjaga nama baik pribadi, guru dan orang tua masing-masing.",
  "Peserta harus menghemat, dengan tidak membeli barang-barang yang tidak terlalu dibutuhkan.",
  "Wajib menjaga keharmonisan hubungan antar siswa, guru dan crew Biro Perjalanan.",
  "Peserta tidak boleh bepergian sendiri diluar rundown yang telah ditentukan",
];

const LARANGAN = [
  "Dilarang membawa rokok, minuman keras, obat-obatan terlarang, dan senjata tajam.",
  "Dilarang pindah bus, tanpa sepengetahuan Crew Bus dan seijin Guru Pendamping.",
];

export default function TataTertibPeserta() {
  return (
    <div className={styles.ttWrap}>

      {/* ── Kartu A: Perbekalan ─────────────────────────────────── */}
      <div className={styles.ttCard}>
        <div className={`${styles.ttCardHeader} ${styles.ttHeaderPerbekalan}`}>
          <div className={styles.ttHeaderIcon}>
            <PackageCheck size={22} aria-hidden="true" />
          </div>
          <div>

            <h3 className={styles.ttCardTitle}>PERBEKALAN PRIBADI YANG HARUS DIBAWA :</h3>
          </div>
        </div>
        <ol className={styles.ttList} aria-label="Daftar perbekalan pribadi">
          {PERBEKALAN.map((item, i) => (
            <li key={i} className={styles.ttListItem}>
              <span className={`${styles.ttBullet} ${styles.ttBulletPerbekalan}`} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.ttListText}>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Kartu B: Kewajiban ──────────────────────────────────── */}
      <div className={styles.ttCard}>
        <div className={`${styles.ttCardHeader} ${styles.ttHeaderKewajiban}`}>
          <div className={styles.ttHeaderIcon}>
            <ListChecks size={22} aria-hidden="true" />
          </div>
          <div>

            <h3 className={styles.ttCardTitle}>KEWAJIBAN PESERTA :</h3>
          </div>
        </div>
        <ol className={styles.ttList} aria-label="Daftar kewajiban peserta">
          {KEWAJIBAN.map((item, i) => (
            <li key={i} className={styles.ttListItem}>
              <span className={`${styles.ttBullet} ${styles.ttBulletKewajiban}`} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.ttListText}>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Kartu C: Larangan ───────────────────────────────────── */}
      <div className={`${styles.ttCard} ${styles.ttCardLarangan}`}>
        <div className={`${styles.ttCardHeader} ${styles.ttHeaderLarangan}`}>
          <div className={styles.ttHeaderIcon}>
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div>

            <h3 className={styles.ttCardTitle}>LARANGAN PESERTA :</h3>
          </div>
        </div>
        <ol className={styles.ttList} aria-label="Daftar larangan peserta">
          {LARANGAN.map((item, i) => (
            <li key={i} className={styles.ttListItem}>
              <span className={`${styles.ttBullet} ${styles.ttBulletLarangan}`} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.ttListText}>{item}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
