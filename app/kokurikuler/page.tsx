// app/kokurikuler/page.tsx
// Halaman Kokurikuler SMPN 5 Klaten — smpn5klaten.sch.id/kokurikuler
// Server Component: data di-fetch server-side, revalidate per-fetch

import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Calendar, Phone, BookOpen, Bus, Users,
  Clock, CheckCircle, MessageCircle, ShieldCheck, ArrowRight,
  AlertTriangle, FileText, Send, Sparkles
} from "lucide-react";
import styles from "./kokurikuler.module.css";
import Header from "../components/Header";
import DenahKursi from "./components/DenahKursi";
import KelompokKerja from "./components/KelompokKerja";
import FaqAccordion from "./components/FaqAccordion";
import PanduanRangkaianTugas from "./components/PanduanRangkaianTugas";
import ScrollReveal from "../components/ScrollReveal";
import {
  fetchAllKokurikulerData,
  fetchKursi,
  fetchKelompok,
  fetchTugasSiswa,
} from "@/lib/kokurikuler";

export const metadata: Metadata = {
  title: "Kokurikuler Kelas VIII — SMP Negeri 5 Klaten",
  description:
    "Informasi kegiatan Kokurikuler Kelas VIII SMPN 5 Klaten: Jejak Sejarah dan Warisan Budaya Bangsa. Denah kursi bus, kelompok kerja, tugas siswa, dan portal penilaian guru.",
  alternates: { canonical: "/kokurikuler" },
  openGraph: {
    title: "Kokurikuler Kelas VIII — SMPN 5 Klaten",
    description:
      "Kegiatan pembelajaran kolaboratif lintas disiplin: Jejak Sejarah dan Warisan Budaya Bangsa. Destinasi Semarang, TP 2026/2027.",
    url: "https://www.smpn5klaten.sch.id/kokurikuler",
    siteName: "SMPN 5 Klaten",
  },
};

function formatRupiah(angka: number | string | null | undefined): string {
  if (!angka) return "—";
  const num = Number(angka);
  if (isNaN(num)) return String(angka);
  return `Rp ${num.toLocaleString("id-ID")}`;
}

// Helper: format nomor WA untuk link WhatsApp
function formatWaLink(hp: string): string {
  if (!hp) return "#";
  const clean = hp.replace(/[^0-9]/g, "");
  const intl = clean.startsWith("0") ? "62" + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}

export default async function KokurikulerPage() {
  // Fetch semua data secara paralel
  const [
    { config, destinasi, rundown, fasilitas, tata_tertib, faq },
    kursiData,
    kelompokData,
    tugasData,
  ] = await Promise.all([
    fetchAllKokurikulerData(),
    fetchKursi(),
    fetchKelompok(),
    fetchTugasSiswa(),
  ]);

  // Fallback config saat GAS belum dikonfigurasi
  const nama_kegiatan   = config?.nama_kegiatan   ?? "Kokurikuler Kelas VIII";
  const tema            = config?.tema            ?? "Jejak Sejarah dan Warisan Budaya Bangsa";
  const tahun_pelajaran = config?.tahun_pelajaran  ?? "2026/2027";
  const tanggal_kegiatan= config?.tanggal_kegiatan ?? "Senin, 5 Oktober 2026";
  const biaya           = config?.biaya           ?? 565000;
  const batas_angket    = config?.batas_pengumpulan_angket ?? null;
  const kontak_nama     = config?.kontak_nama     ?? "Namjuari, S.Pd.";
  const kontak_hp       = config?.kontak_hp       ?? "";

  // Fasilitas fallback (dengan Sub-Judul Point Siswa & Penekanan Warna)
  const fasilitasList = fasilitas.length > 0
    ? fasilitas.map(f => ({
        kategori: f.kategori || "Fasilitas Peserta",
        item_fasilitas: f.item_fasilitas
      }))
    : [
        { kategori: "Transportasi & Armada", item_fasilitas: "Bus pariwisata ber-AC, TV/LCD, audio, USB port charger, dan reclining seat" },
        { kategori: "Konsumsi & Mineral", item_fasilitas: "Makan 2 kali prasmanan, 1 kali snack perjalanan, dan air mineral selama perjalanan" },
        { kategori: "Tiket Objek Wisata", item_fasilitas: "Tiket masuk objek wisata: Saloka Theme Park, Benteng Pendem Fort Willem I Ambarawa, Museum Lawang Sewu" },
        { kategori: "Atribut & Dokumentasi", item_fasilitas: "Lanyard/ID Card peserta serta dokumentasi foto dan video kegiatan" },
        { kategori: "Kesehatan & Asuransi", item_fasilitas: "Obat-obatan (P3K) dan asuransi perjalanan bagi seluruh peserta" },
        { kategori: "Pendampingan Resmi", item_fasilitas: "Pendampingan Tour Leader profesional, guru pendamping, dan wali kelas" },
      ];

  const tataTertibList = tata_tertib.length > 0
    ? tata_tertib
    : [
        { no: 1, isi_tata_tertib: "Wajib mengikuti seluruh rangkaian kegiatan pra, saat, dan pasca-kegiatan" },
        { no: 2, isi_tata_tertib: "Selalu berada dalam kelompok dan pengawasan guru pendamping" },
        { no: 3, isi_tata_tertib: "Mengenakan seragam/identitas sekolah" },
        { no: 4, isi_tata_tertib: "Dilarang membawa rokok, minuman keras, dan barang terlarang lainnya" },
        { no: 5, isi_tata_tertib: "Menjaga sopan santun, kebersihan, dan ketertiban" },
        { no: 6, isi_tata_tertib: "Melapor ke wali kelas bila memiliki kondisi kesehatan khusus" },
      ];

  const faqList = faq.length > 0
    ? faq
    : [
        { pertanyaan: "Apakah kegiatan ini wajib?", jawaban: "Tidak. Peserta didik boleh memilih BERSEDIA atau TIDAK BERSEDIA sesuai pertimbangan orang tua/wali." },
        { pertanyaan: "Bagaimana jika siswa memilih TIDAK BERSEDIA?", jawaban: "Peserta didik yang tidak bersedia akan mengikuti kegiatan kokurikuler alternatif lainnya yang disiapkan di sekolah." },
        { pertanyaan: "Apakah biaya bisa dicicil?", jawaban: "Bisa, pembayaran Rp 565.000,- dapat dilakukan secara bertahap sesuai kesepakatan dengan sekolah." },
        { pertanyaan: "Apakah pilihan angket yang sudah dikumpulkan bisa dibatalkan?", jawaban: "Tidak. Pilihan bersifat FINAL dan TIDAK DAPAT DIBATALKAN atau diubah dengan alasan apa pun." },
      ];

  return (
    <main className={styles.page}>
      <Header activePage="Kokurikuler" />
      <ScrollReveal />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBgPattern} aria-hidden="true" />
        <div className={styles.heroBgGrid} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <div className={styles.heroBadgeDot} aria-hidden="true" />
            SMP Negeri 5 Klaten · {tahun_pelajaran}
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>{nama_kegiatan}</span>
          </h1>
          <p className={styles.heroTheme}>"{tema}"</p>
          <p className={styles.heroMeta}>Pelaksanaan: <strong>{tanggal_kegiatan}</strong> · Destinasi Semarang</p>
          {/* ══ Hero-10 Image Fan 3 Destinasi Resmi ══════════════════════ */}
          <div className={styles.heroFanWrap}>
            <div className={styles.heroFan}>
              <div className={`${styles.fanCard} ${styles.fanCardLeft}`}>
                <div className={styles.fanImageWrapper}>
                  <img
                    src="/saloka.jpeg"
                    alt="Saloka Theme Park Tuntang"
                    className={styles.fanImage}
                  />
                  <div className={styles.fanCardOverlay}>
                    <span className={styles.fanCardLabel}>Saloka Theme Park</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.fanCard} ${styles.fanCardCenter}`}>
                <div className={styles.fanImageWrapper}>
                  <img
                    src="/benteng.jpg"
                    alt="Benteng Pendem Fort Willem I Ambarawa"
                    className={styles.fanImage}
                  />
                  <div className={styles.fanCardOverlay}>
                    <span className={styles.fanCardLabel}>Benteng Pendem Fort Willem I</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.fanCard} ${styles.fanCardRight}`}>
                <div className={styles.fanImageWrapper}>
                  <img
                    src="/lawang-sewu.jpg"
                    alt="Museum Lawang Sewu Semarang"
                    className={styles.fanImage}
                  />
                  <div className={styles.fanCardOverlay}>
                    <span className={styles.fanCardLabel}>Museum Lawang Sewu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Aksi di Bawah Gambar */}
          <div className={styles.heroActions}>
            <a href="#denah-kursi" className={styles.heroBtnPrimary}>
              <Bus size={18} aria-hidden="true" />
              Cari Kursi Saya
            </a>
            <a href="#kelompok-kerja" className={styles.heroBtnSecondary}>
              <Users size={18} aria-hidden="true" />
              Cari Tugas Kelompok
            </a>
          </div>
        </div>
      </section>

      {/* ══ INFO KEGIATAN ══════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="info-kegiatan">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Info Kegiatan</div>
            <h2 className={styles.sectionTitle}>Tentang Kokurikuler &amp; Objek Kunjungan</h2>
            <p className={styles.sectionLead}>
              Kegiatan pembelajaran kolaboratif lintas disiplin ilmu bertema &quot;{tema}&quot; dengan lokasi kunjungan edukatif di Semarang.
            </p>
          </header>

          <div className={`${styles.narasiPembuka} reveal`}>
            Berdasarkan hasil musyawarah bersama komite dan perwakilan walimurid Kelas VIII pada hari <strong>Sabtu, 08 Agustus 2026</strong>, 
            kegiatan Kokurikuler Kelas VIII dilaksanakan dengan destinasi Semarang pada <strong>{tanggal_kegiatan}</strong> dengan biaya <strong className={styles.biayaHighlight}>Rp 565.000/siswa yang ditanggung orang tua murid</strong>.
            Kegiatan ini bersifat tidak wajib; peserta didik yang memilih tidak bersedia akan mengikuti kegiatan kokurikuler alternatif lainnya.
          </div>

          {destinasi.length > 0 ? (
            <div className={styles.destinasiGrid}>
              {destinasi.map((dest, i) => (
                <article key={i} className={`${styles.destinasiCard} reveal`}>
                  <div className={styles.destinasiCardHeader}>
                    <div className={styles.destinasiCardIcon}>
                      <MapPin size={20} aria-hidden="true" />
                    </div>
                    <h3 className={styles.destinasiCardNama}>{dest.nama_destinasi}</h3>
                  </div>
                  <div className={styles.destinasiCardBody}>
                    {dest.dimensi_profil_lulusan && (
                      <div className={styles.destinasiItem}>
                        <span className={styles.destinasiItemLabel}>Profil Lulusan</span>
                        <span className={styles.destinasiItemValue}>{dest.dimensi_profil_lulusan}</span>
                      </div>
                    )}
                    {dest.mapel_terkait && (
                      <div className={styles.destinasiItem}>
                        <span className={styles.destinasiItemLabel}>Mata Pelajaran</span>
                        <span className={styles.destinasiItemValue}>{dest.mapel_terkait}</span>
                      </div>
                    )}
                    {dest.tujuan_pembelajaran && (
                      <div className={styles.destinasiItem}>
                        <span className={styles.destinasiItemLabel}>Tujuan</span>
                        <span className={styles.destinasiItemValue}>{dest.tujuan_pembelajaran}</span>
                      </div>
                    )}
                    {dest.objek_kunjungan && (
                      <div className={styles.destinasiItem}>
                        <span className={styles.destinasiItemLabel}>Objek Kunjungan</span>
                        <span className={styles.destinasiItemValue}>{dest.objek_kunjungan}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`${styles.destinasiGrid} reveal`}>
              <article className={styles.destinasiCard}>
                <div className={styles.destinasiCardHeader}>
                  <div className={styles.destinasiCardIcon}><MapPin size={20} /></div>
                  <h3 className={styles.destinasiCardNama}>Saloka Theme Park</h3>
                </div>
                <div className={styles.destinasiCardBody}>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Profil Lulusan</span>
                    <span className={styles.destinasiItemValue}>Kolaborasi &amp; Komunikasi/Kreativitas</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Fokus Pembelajaran</span>
                    <span className={styles.destinasiItemValue}>Wahana rekreasi edukatif, pengamatan sains terapan &amp; dinamika kelompok</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Objek Kunjungan</span>
                    <span className={styles.destinasiItemValue}>Tuntang, Kab. Semarang</span>
                  </div>
                </div>
              </article>

              <article className={styles.destinasiCard}>
                <div className={styles.destinasiCardHeader}>
                  <div className={styles.destinasiCardIcon}><MapPin size={20} /></div>
                  <h3 className={styles.destinasiCardNama}>Benteng Pendem Fort Willem I</h3>
                </div>
                <div className={styles.destinasiCardBody}>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Profil Lulusan</span>
                    <span className={styles.destinasiItemValue}>Penalaran Kritis &amp; Kebinekaan Global</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Mata Pelajaran</span>
                    <span className={styles.destinasiItemValue}>IPS (Sejarah), Bahasa Indonesia</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Objek Kunjungan</span>
                    <span className={styles.destinasiItemValue}>Ambarawa, Kab. Semarang</span>
                  </div>
                </div>
              </article>

              <article className={styles.destinasiCard}>
                <div className={styles.destinasiCardHeader}>
                  <div className={styles.destinasiCardIcon}><MapPin size={20} /></div>
                  <h3 className={styles.destinasiCardNama}>Museum Lawang Sewu</h3>
                </div>
                <div className={styles.destinasiCardBody}>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Profil Lulusan</span>
                    <span className={styles.destinasiItemValue}>Penalaran Kritis &amp; Komunikasi/Kreativitas</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Mata Pelajaran</span>
                    <span className={styles.destinasiItemValue}>IPS (Sejarah), Seni Budaya</span>
                  </div>
                  <div className={styles.destinasiItem}>
                    <span className={styles.destinasiItemLabel}>Objek Kunjungan</span>
                    <span className={styles.destinasiItemValue}>Kota Semarang</span>
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </section>

      {/* ══ RUNDOWN & FASILITAS ════════════════════════════════════════ */}
      <section className={styles.section} id="rundown">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Jadwal &amp; Fasilitas</div>
            <h2 className={styles.sectionTitle}>Rundown Kegiatan &amp; Fasilitas</h2>
          </header>

          {/* ══ ALUR TAHAPAN KRONOLOGIS KEGIATAN ═══════════════════════ */}
          <div className={`${styles.rundownStepperWrap} reveal`}>
            <div className={styles.rundownStepperTitle}>
              <Calendar size={18} aria-hidden="true" />
              Alur Tahapan Kegiatan &amp; Administrasi
            </div>
            <div className={styles.rundownStepperGrid}>
              <div className={styles.stepperCard}>
                <div className={styles.stepperHeader}>
                  <span className={styles.stepperStepBadge}>Tahap 1</span>
                  <FileText size={18} style={{ color: '#944535' }} aria-hidden="true" />
                </div>
                <div className={styles.stepperDate}>Selasa, 11 Agustus 2026</div>
                <p className={styles.stepperLabel}>
                  <span className={styles.stepperLabelBold}>Pembagian Angket Kesediaan Mengikuti Kegiatan Kokurikuler</span> kepada peserta didik Kelas VIII.
                </p>
              </div>

              <div className={styles.stepperCard}>
                <div className={styles.stepperHeader}>
                  <span className={styles.stepperStepBadge}>Tahap 2</span>
                  <Send size={18} style={{ color: '#944535' }} aria-hidden="true" />
                </div>
                <div className={styles.stepperDate}>Jumat, 14 Agustus 2026</div>
                <p className={styles.stepperLabel}>
                  <span className={styles.stepperLabelBold}>Pengumpulan angket</span> kesediaan di sekolah (Pilihan bersifat <span className={styles.angketAlertHighlight}>FINAL &amp; TIDAK DAPAT DIBATALKAN</span>).
                </p>
              </div>

              <div className={styles.stepperCard}>
                <div className={styles.stepperHeader}>
                  <span className={styles.stepperStepBadge}>Tahap 3</span>
                  <Bus size={18} style={{ color: '#944535' }} aria-hidden="true" />
                </div>
                <div className={styles.stepperDate}>Senin, 5 Oktober 2026</div>
                <p className={styles.stepperLabel}>
                  <span className={styles.stepperLabelBold}>Pelaksanaan Pembelajaran Lapangan</span> destinasi Semarang (Saloka, Benteng Willem I &amp; Lawang Sewu).
                </p>
              </div>
            </div>
          </div>

          <div className={styles.rundownFasilitasGrid}>
            {/* Rundown */}
            <div className="reveal">
              <table className={styles.rundownTable} aria-label="Jadwal kegiatan kokurikuler">
                <thead>
                  <tr>
                    <th scope="col">Waktu</th>
                    <th scope="col">Kegiatan</th>
                  </tr>
                </thead>
                <tbody>
                  {rundown.length > 0 ? (
                    rundown.map((r, i) => (
                      <tr key={i}>
                        <td className={styles.rundownTime}>{r.waktu}</td>
                        <td>{r.kegiatan}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr><td className={styles.rundownTime}>06.30</td><td>Peserta berkumpul di sekolah, koordinasi dan pengecekan peserta.</td></tr>
                      <tr><td className={styles.rundownTime}>07.30</td><td>Rombongan berangkat menuju Semarang, pembagian snack.</td></tr>
                      <tr><td className={styles.rundownTime}>09.00</td><td>Tiba di Semarang, kegiatan pembelajaran lapangan di Saloka Theme Park.</td></tr>
                      <tr><td className={styles.rundownTime}>13.00</td><td>Istirahat, sholat, makan siang.</td></tr>
                      <tr><td className={styles.rundownTime}>14.30</td><td>Kunjungan pembelajaran ke Benteng Pendem Fort Willem I, Ambarawa.</td></tr>
                      <tr><td className={styles.rundownTime}>16.30</td><td>Kunjungan pembelajaran ke Museum Lawang Sewu.</td></tr>
                      <tr><td className={styles.rundownTime}>17.30</td><td>Belanja oleh-oleh khas Semarang.</td></tr>
                      <tr><td className={styles.rundownTime}>18.30</td><td>Rombongan menuju rumah makan untuk istirahat, sholat, dan makan malam.</td></tr>
                      <tr><td className={styles.rundownTime}>21.00</td><td>Rombongan bertolak kembali menuju Klaten.</td></tr>
                      <tr><td className={styles.rundownTime}>22.00</td><td>Rombongan diperkirakan tiba kembali di sekolah.</td></tr>
                    </>
                  )}
                </tbody>
              </table>
              <p className={styles.rundownNote}>
                *Catatan: susunan acara dapat menyesuaikan situasi dan kondisi selama perjalanan.*
              </p>
            </div>

            {/* Fasilitas */}
            <div className="reveal">
              <div className={styles.fasilitasSubHeader}>
                <Sparkles size={20} className={styles.fasilitasSubHeaderIcon} aria-hidden="true" />
                <h3 className={styles.fasilitasSubHeaderTitle}>Fasilitas</h3>
              </div>
              <ul className={styles.fasilitasList} aria-label="Daftar fasilitas yang disediakan">
                {fasilitasList.map((f, i) => (
                  <li key={i} className={styles.fasilitasItem}>
                    <div className={styles.fasilitasItemIcon}>
                      <CheckCircle size={16} aria-hidden="true" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span className={styles.fasilitasCategoryBadge}>{f.kategori}</span>
                      <span>{f.item_fasilitas}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DENAH KURSI BUS ══════════════════════════════════════════ */}
      <section className={styles.section} id="denah-kursi">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Denah Kursi Bus</div>
            <h2 className={styles.sectionTitle}>Cari Nomor Kursi Kamu</h2>
            <p className={styles.sectionLead}>
              Ketik nama untuk menemukan posisi dudukmu di bus.
            </p>
          </header>
          <div className="reveal">
            <DenahKursi initialData={kursiData} />
          </div>
        </div>
      </section>

      {/* ══ KELOMPOK KERJA & TUGAS ════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="kelompok-kerja">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Kelompok Kerja</div>
            <h2 className={styles.sectionTitle}>Kelompok & Tugas Kamu</h2>
            <p className={styles.sectionLead}>
              Cari namamu untuk melihat kelompok, sub-tema, dan daftar tugas per tahap kegiatan.
            </p>
          </header>
          <div className="reveal">
            <KelompokKerja
              initialKelompok={kelompokData}
              initialTugas={tugasData}
              tanggalKegiatan={tanggal_kegiatan}
            />
          </div>
        </div>
      </section>

      {/* ══ TATA TERTIB ══════════════════════════════════════════════ */}
      <section className={styles.section} id="tata-tertib">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Tata Tertib</div>
            <h2 className={styles.sectionTitle}>Ketentuan Peserta</h2>
          </header>
          <ul className={styles.tataTertibList} aria-label="Daftar tata tertib kokurikuler">
            {tataTertibList.map((item, i) => (
              <li key={i} className={`${styles.tataTertibItem} reveal`}>
                <div className={styles.tataTertibNumber}>{item.no}</div>
                <p className={styles.tataTertibText}>{item.isi_tata_tertib}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>FAQ</div>
            <h2 className={styles.sectionTitle}>Pertanyaan Umum</h2>
          </header>
          <div className="reveal">
            <FaqAccordion faqs={faqList} />
          </div>
        </div>
      </section>

      {/* ══ KONTAK ══════════════════════════════════════════════════ */}
      <section className={styles.section} id="kontak">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} reveal`}>
            <div className={styles.sectionEyebrow}>Kontak</div>
            <h2 className={styles.sectionTitle}>Narahubung</h2>
          </header>
          <div className={`${styles.kontakCard} reveal`}>
            <div className={styles.kontakAvatar} aria-hidden="true">
              <Phone size={28} />
            </div>
            <div className={styles.kontakInfo}>
              <p className={styles.kontakNama}>{kontak_nama}</p>
              <p className={styles.kontakJabatan}>Koordinator Kokurikuler · SMP Negeri 5 Klaten</p>
              {kontak_hp ? (
                <a
                  href={formatWaLink(kontak_hp)}
                  className={styles.kontakWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat WhatsApp dengan ${kontak_nama}`}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Chat WhatsApp — {kontak_hp}
                </a>
              ) : (
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Namjuari, S.Pd.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PORTAL GURU ══════════════════════════════════════════════ */}
      <section className={`${styles.section}`} id="portal-guru">
        <div className={styles.container}>
          <div className={`${styles.portalBanner} reveal`}>
            <div className={styles.portalBannerText}>
              <p className={styles.portalBannerTitle}>
                <ShieldCheck size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} aria-hidden="true" />
                Portal Penilaian Guru
              </p>
              <p className={styles.portalBannerDesc}>
                Khusus guru & panitia kokurikuler. Input nilai Profil Lulusan dan ekspor ke Excel untuk e-rapor.
              </p>
            </div>
            <Link href="/kokurikuler/portal" className={styles.portalBannerBtn}>
              Masuk Portal
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
