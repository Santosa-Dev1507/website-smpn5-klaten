"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./mpls.module.css";

const MplsPage = () => {
  // --- State untuk Countdown ---
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0
  });

  useEffect(() => {
    const targetDate = new Date("2026-07-13T07:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
        return;
      }

      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- State untuk Jadwal Accordion ---
  const [openJadwalId, setOpenJadwalId] = useState<number | null>(1);
  const toggleJadwal = (id: number) => {
    setOpenJadwalId(openJadwalId === id ? null : id);
  };

  // --- State untuk Checklist ---
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const toggleCheck = (id: number) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(i => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  // --- State untuk FAQ Accordion ---
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const dresscodeData = [
    { hari: "Senin, 13 Juli", pakaian: "Merah Putih (Seragam SD)" },
    { hari: "Selasa, 14 Juli", pakaian: "Seragam Olahraga" },
    { hari: "Rabu, 15 Juli", pakaian: "Merah Putih (Seragam SD)" },
    { hari: "Kamis, 16 Juli", pakaian: "Merah Putih (Seragam SD)" },
    { hari: "Jumat, 17 Juli", pakaian: "Batik" },
  ];

  // --- Data Jadwal ---
  const jadwalData = [
    {
      id: 1,
      hari: "Hari 1 — Senin, 13 Juli 2026",
      tema: "Pengenalan Diri & Lingkungan Sekolah",
      kegiatan: [
        { waktu: "06.30–07.00", ikon: "ti ti-users", judul: "Salam Sapa Murid Baru", desc: "Guru menyambut di gerbang dengan 5S, memutar lagu Hari Baru dan Rukun Sama Teman" },
        { waktu: "07.00–07.40", ikon: "ti ti-flag", judul: "Upacara Pembukaan", desc: "Seremonial pembukaan MPLS dengan pemasangan cocard dan Ikrar Pelajar Indonesia" },
        { waktu: "07.40–08.40", ikon: "ti ti-building-school", judul: "Pengenalan Diri & Wawasan Wiyata Mandala", desc: "Perkenalan diri, warga sekolah, visi misi, tata tertib, budaya sekolah, dan membuat kesepakatan kelas" },
        { waktu: "08.40–09.40", ikon: "ti ti-map", judul: "Aku dan Sekolahku", desc: "Tur keliling sekolah interaktif mengenal fasilitas dan mencatat denah (siswa membuat lembar observasi)" },
        { waktu: "09.40–10.00", ikon: "ti ti-coffee", judul: "Istirahat", desc: "Waktu istirahat" },
        { waktu: "10.00–11.00", ikon: "ti ti-star", judul: "Aku Anak Indonesia Hebat, Karakterku Kuat", desc: "Pengenalan 7 Kebiasaan Anak Indonesia Hebat dengan bernyanyi, beraksi, dan simulasi catatan harian" },
        { waktu: "11.00–11.30", ikon: "ti ti-messages", judul: "Refleksi & Pengecekan Persiapan Hari Selanjutnya", desc: "Merefleksikan pengalaman hari pertama MPLS" },
        { waktu: "11.30–12.00", ikon: "ti ti-building-mosque", judul: "Shalat Zuhur", desc: "Shalat zuhur berjamaah di masjid sekolah" },
        { waktu: "12.00", ikon: "ti ti-home", judul: "Murid Pulang", desc: "Waktu pulang" },
      ]
    },
    {
      id: 2,
      hari: "Hari 2 — Selasa, 14 Juli 2026",
      tema: "Pertemuan Pagi Ceria & Ruang Perjumpaan",
      kegiatan: [
        { waktu: "06.30–07.00", ikon: "ti ti-users", judul: "Salam Sapa Murid Baru", desc: "Guru menyambut dengan 5S, memutar lagu Hari Baru dan Rukun Sama Teman" },
        { waktu: "07.00–08.30", ikon: "ti ti-run", judul: "Pertemuan Pagi Ceria, Cek denyut jantung, dan tes fleksibilitas", desc: "Kegiatan Senam Anak Indonesia Hebat, menyanyikan Lagu Indonesia Raya, dan berdoa bersama" },
        { waktu: "08.30–09.40", ikon: "ti ti-friends", judul: "Ruang Perjumpaan Murid Baru", desc: "Berbagi cerita harapan dan kekhawatiran murid baru, mendiskusikan solusi dengan Pohon Harapan dan Pohon Solusi" },
        { waktu: "09.40–10.00", ikon: "ti ti-coffee", judul: "Istirahat", desc: "Waktu istirahat" },
        { waktu: "10.00–11.00", ikon: "ti ti-shield", judul: "Siaga Bencana", desc: "Membangun kesiapsiagaan bencana, mengenali ancaman, informasi peringatan dini, jalur evakuasi, dan praktik penyelamatan" },
        { waktu: "11.00–11.30", ikon: "ti ti-messages", judul: "Refleksi & Persiapan Hari Selanjutnya", desc: "Merefleksikan hari ini, menumbuhkan motivasi" },
        { waktu: "11.30–12.00", ikon: "ti ti-building-mosque", judul: "Shalat Zuhur", desc: "Shalat zuhur berjamaah di masjid sekolah" },
        { waktu: "12.00", ikon: "ti ti-home", judul: "Murid Pulang", desc: "Waktu pulang" },
      ]
    },
    {
      id: 3,
      hari: "Hari 3 — Rabu, 16 Juli 2026",
      tema: "Asesmen, Literasi Digital & NAPZA",
      kegiatan: [
        { waktu: "06.30–07.00", ikon: "ti ti-users", judul: "Salam Sapa Murid Baru", desc: "Penyambutan 5S di gerbang, diiringi lagu Hari Baru dan Rukun Sama Teman" },
        { waktu: "07.00–09.00", ikon: "ti ti-device-laptop", judul: "Identifikasi Kondisi Sosial-Emosional & Asesmen", desc: "Mengisi instrumen kondisi sosial-emosional, konsentrasi belajar, asesmen literasi/numerasi, dan identifikasi bakat minat menggunakan perangkat gawai/laptop" },
        { waktu: "09.00–09.40", ikon: "ti ti-movie", judul: "Literasi Digital", desc: "Nonton bersama film pencegahan judi online dan kampanye 3S (Screen Time, Screen Zone, Screen Break)" },
        { waktu: "09.40–10.00", ikon: "ti ti-coffee", judul: "Istirahat", desc: "Waktu istirahat" },
        { waktu: "10.00–11.00", ikon: "ti ti-ban", judul: "Pencegahan Isu NAPZA", desc: "Pengenalan NAPZA bersama Polres: Kenali, Pahami, Jauhi. Menonton film pendek, refleksi, dan komitmen" },
        { waktu: "11.00–11.30", ikon: "ti ti-messages", judul: "Refleksi & Persiapan Hari Selanjutnya", desc: "Merefleksikan hari ini, siswa diingatkan untuk membawa tanaman esok hari" },
        { waktu: "11.30–12.00", ikon: "ti ti-building-mosque", judul: "Shalat Zuhur", desc: "Shalat zuhur berjamaah di masjid sekolah" },
        { waktu: "12.00", ikon: "ti ti-home", judul: "Murid Pulang", desc: "Waktu pulang" },
      ]
    },
    {
      id: 4,
      hari: "Hari 4 — Kamis, 17 Juli 2026",
      tema: "Karakter, Kurikulum & Sekolah Adiwiyata",
      kegiatan: [
        { waktu: "06.30–07.00", ikon: "ti ti-users", judul: "Salam Sapa Murid Baru", desc: "Penyambutan 5S di gerbang, diiringi lagu Hari Baru dan Rukun Sama Teman" },
        { waktu: "07.00–07.30", ikon: "ti ti-medal", judul: "Budaya Sekolah Berbasis Kekhasan", desc: "Pengenalan program dan kekhasan Sekolah Adiwiyata" },
        { waktu: "07.30–09.00", ikon: "ti ti-leaf", judul: "ASRI: Aku, Kamu, dan Lingkungan Kita Bersama", desc: "Kegiatan menanam pohon, memilah sampah, atau membersihkan lingkungan sekolah bersama Tim OSIS dan Wali Kelas" },
        { waktu: "09.00–09.40", ikon: "ti ti-notebook", judul: "Pengenalan Kurikulum & Cara Belajar Efektif", desc: "Mengenal mata pelajaran wajib/pilihan, membangkitkan motivasi, teknik belajar efektif, dan mengatasi tantangan belajar" },
        { waktu: "09.40–10.00", ikon: "ti ti-coffee", judul: "Istirahat", desc: "Waktu istirahat" },
        { waktu: "10.00–11.00", ikon: "ti ti-heart-handshake", judul: "Sahabat Hebat: Dengar, Peduli, dan Hargai", desc: "Mengenali tanda teman tidak baik-baik saja, mendengarkan dengan empati, kapan harus meminta bantuan, dan komitmen Sahabat Hebat" },
        { waktu: "11.30–12.00", ikon: "ti ti-building-mosque", judul: "Shalat Zuhur", desc: "Shalat zuhur berjamaah di masjid sekolah" },
        { waktu: "12.00–12.30", ikon: "ti ti-settings", judul: "Persiapan Kegiatan Berikutnya", desc: "Pengkondisian kelas untuk penutupan dan unjuk karya esok hari" },
      ]
    },
    {
      id: 5,
      hari: "Hari 5 — Jumat, 18 Juli 2026",
      tema: "Unjuk Karya & Penutupan",
      kegiatan: [
        { waktu: "06.30–07.00", ikon: "ti ti-users", judul: "Salam Sapa Murid Baru", desc: "Penyambutan 5S di gerbang, diiringi lagu Hari Baru dan Rukun Sama Teman" },
        { waktu: "07.00–08.00", ikon: "ti ti-run", judul: "Pertemuan Pagi Ceria", desc: "Senam Anak Indonesia Hebat, menyanyikan lagu, dan berdoa bersama" },
        { waktu: "08.40–09.40", ikon: "ti ti-palette", judul: "Unjuk Karya (Bakat dan Minat Murid)", desc: "Menunjukkan bakat seni, olahraga, atau permainan tradisional secara sukarela, dilanjutkan apresiasi" },
        { waktu: "09.40–10.00", ikon: "ti ti-coffee", judul: "Istirahat", desc: "Waktu istirahat" },
        { waktu: "10.00–10.30", ikon: "ti ti-users-group", judul: "Perkenalan Walikelas", desc: "Wali kelas berkenalan, membuat struktur kelas, dan menginformasikan jadwal pelajaran" },
        { waktu: "10.30–11.00", ikon: "ti ti-flag", judul: "Penutupan", desc: "Penutupan resmi rangkaian kegiatan MPLS" },
      ]
    }
  ];

  // --- Data Checklist ---
  const checklistData = [
    { id: 1, judul: "Isi instrumen deteksi dini", desc: "Via portal Kemendikdasmen (6-26 Juli)" },
    { id: 2, judul: "Daftar Cek Kesehatan Gratis (CKG)", desc: <span style={{display: "inline-flex", alignItems: "center", gap: "0.2rem"}}>Via aplikasi Satu Sehat Mobile <a href="https://drive.google.com/file/d/1JD1LVAscF00UzLuzi8skqrPdZ9voklLi/view" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{color: "#944535", textDecoration: "underline", marginLeft: "4px"}}>(Unduh Panduan)</a></span> },
    { id: 3, judul: "Tanda tangani pakta integritas", desc: "Dokumen komitmen dari sekolah" },
    { id: 4, judul: "Siapkan bekal makanan sehat bergizi", desc: "Sesuai panduan gizi seimbang tiap hari" },
    { id: 5, judul: "Antar anak di hari pertama", desc: "Sangat disarankan Ayah dan Ibu ikut mengantar" },
  ];

  // --- Data FAQ ---
  const faqData = [
    { id: 1, q: "Bagaimana cara mendaftar Cek Kesehatan Gratis (CKG)?", a: "Gunakan aplikasi SATUSEHAT Mobile, masuk ke menu pendaftaran, lalu isi kuesioner kesehatan anak. Bukti pendaftaran akan didata oleh sekolah." },
    { id: 2, q: "Apa itu Instrumen Deteksi Dini?", a: "Formulir online resmi dari Kemendikdasmen untuk mengenali karakteristik dan kebutuhan belajar murid. Wajib diisi pada 6 - 26 Juli 2026." },
    { id: 3, q: "Apakah ada perpeloncoan atau tugas berat?", a: "TIDAK ADA. Sesuai asas Ramah, sekolah melarang keras perpeloncoan, tugas memberatkan, maupun pungutan biaya." },
    { id: 4, q: "Apa yang perlu dibawa anak setiap hari MPLS?", a: "Membawa bekal makanan sehat bergizi, alat tulis, pakaian sesuai dress code, serta semangat belajar." },
    { id: 5, q: "Bagaimana dengan Unjuk Karya di hari terakhir?", a: "Itu adalah panggung gembira di mana murid dapat menampilkan minat atau bakatnya (seperti menyanyi, puisi, dsb) secara sukarela dan tanpa tekanan." },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <i className="ti ti-school" style={{ fontSize: "1.5rem" }}></i>
          <span>MPLS Ramah 2026</span>
          <span className={styles.navBadge}>SMPN 5 Klaten</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#tentang" className={styles.navLink}>Tentang</a>
          <a href="#jadwal" className={styles.navLink}>Jadwal</a>
          <a href="#infografis" className={styles.navLink}>Alur</a>
          <a href="#checklist" className={styles.navLink}>Checklist</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className={styles.hero}>
        <span className={styles.heroSchoolChip}>SMPN 5 Klaten • 2026/2027</span>
        <div className={styles.badge}>Masa Pengenalan Lingkungan Sekolah</div>
        <h1 className={styles.heroTitle}>
          Selamat Datang di <br />
          <span className={styles.heroHighlight}>MPLS Ramah 2026</span>
        </h1>
        <p className={styles.heroDesc}>
          Melangkah bersama dengan senyum dan semangat. 
          Menyambut generasi hebat dengan cinta, keamanan, dan kebahagiaan di hari pertama mereka.
        </p>

        {/* Countdown */}
        <div className={styles.countdownWrapper}>
          <div className={styles.cdBox}>
            <span className={styles.cdNum}>{timeLeft.hari}</span>
            <span className={styles.cdLabel}>Hari</span>
          </div>
          <div className={styles.cdBox}>
            <span className={styles.cdNum}>{timeLeft.jam}</span>
            <span className={styles.cdLabel}>Jam</span>
          </div>
          <div className={styles.cdBox}>
            <span className={styles.cdNum}>{timeLeft.menit}</span>
            <span className={styles.cdLabel}>Menit</span>
          </div>
          <div className={styles.cdBox}>
            <span className={styles.cdNum}>{timeLeft.detik}</span>
            <span className={styles.cdLabel}>Detik</span>
          </div>
        </div>

        <div className={styles.heroActions}>
          <a href="#jadwal" className={styles.btnPrimary}>
            <i className="ti ti-calendar-event"></i> Lihat Jadwal MPLS
          </a>
          <a href="#checklist" className={styles.btnOutline}>
            <i className="ti ti-checklist"></i> Checklist Orang Tua
          </a>
        </div>
      </header>

      {/* 3. TENTANG MPLS */}
      <section id="tentang" className={styles.section}>
        <div style={{ textAlign: "center" }}>
          <span className={styles.badge}>Nilai Dasar</span>
        </div>
        <h2 className={styles.sectionTitle}>Tentang MPLS Ramah</h2>
        <p className={styles.sectionSubtitle}>Enam pilar utama yang menjadi fondasi kami dalam menyambut kedatangan anak Anda di sekolah.</p>

        <div className={styles.nilaiGrid}>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-heart-handshake"></i></div>
            <h3 className={styles.nilaiTitle}>Humanis</h3>
            <p className={styles.nilaiDesc}>Memuliakan martabat anak dan memperlakukannya tanpa kekerasan serta penuh kasih sayang.</p>
          </div>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-world"></i></div>
            <h3 className={styles.nilaiTitle}>Inklusif</h3>
            <p className={styles.nilaiDesc}>Mengakomodasi dan menjamin perlakuan setara bagi semua anak, termasuk penyandang disabilitas.</p>
          </div>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-users"></i></div>
            <h3 className={styles.nilaiTitle}>Partisipatif</h3>
            <p className={styles.nilaiDesc}>Melibatkan orang tua, guru, dan murid secara bermakna untuk menciptakan budaya sekolah yang aman.</p>
          </div>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-scale"></i></div>
            <h3 className={styles.nilaiTitle}>Nondiskriminatif</h3>
            <p className={styles.nilaiDesc}>Perlakuan yang adil tanpa membeda-bedakan suku, agama, gender, maupun kondisi fisik.</p>
          </div>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-friends"></i></div>
            <h3 className={styles.nilaiTitle}>Harmonis</h3>
            <p className={styles.nilaiDesc}>Membangun hubungan yang selaras, saling menghormati, dan berkeadaban antarwarga sekolah.</p>
          </div>
          <div className={styles.nilaiCard}>
            <div className={styles.nilaiIcon}><i className="ti ti-plant"></i></div>
            <h3 className={styles.nilaiTitle}>Berkelanjutan</h3>
            <p className={styles.nilaiDesc}>Budaya aman dan nyaman ini akan terus menjadi kebiasaan rutin sekolah setelah MPLS usai.</p>
          </div>
        </div>
      </section>

      {/* 4. ALUR 3 TAHAP */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <h2 className={styles.sectionTitle}>Alur Kegiatan MPLS</h2>
        <p className={styles.sectionSubtitle}>Rangkaian persiapan hingga pasca-kegiatan yang perlu diperhatikan.</p>

        <div className={styles.alurContainer}>
          <div className={styles.alurTahap}>
            <div className={styles.alurNum}>1</div>
            <h3 className={styles.alurTitle}>Pra-MPLS</h3>
            <span className={styles.alurDate}>6 – 26 Juli 2026</span>
            <ul className={styles.alurList}>
              <li>Sosialisasi kepada orang tua</li>
              <li>Pendaftaran CKG via SATUSEHAT</li>
              <li>Pengisian instrumen deteksi dini</li>
            </ul>
          </div>
          <div className={styles.alurTahap}>
            <div className={styles.alurNum}>2</div>
            <h3 className={styles.alurTitle}>Pelaksanaan</h3>
            <span className={styles.alurDate}>13 – 17 Juli 2026</span>
            <ul className={styles.alurList}>
              <li>5 hari kegiatan, 4 jam pelajaran/hari</li>
              <li>Fokus pengenalan warga & budaya sekolah</li>
              <li>Tanpa perpeloncoan dan pungutan liar</li>
            </ul>
          </div>
          <div className={styles.alurTahap}>
            <div className={styles.alurNum}>3</div>
            <h3 className={styles.alurTitle}>Pasca-MPLS</h3>
            <span className={styles.alurDate}>s.d. 31 Juli 2026</span>
            <ul className={styles.alurList}>
              <li>Sekolah melakukan evaluasi</li>
              <li>Skrining lanjutan untuk anak berkebutuhan khusus</li>
              <li>Laporan potensi murid ke guru BK & Wali Kelas</li>
            </ul>
          </div>
        </div>
      </section>


      <section id="jadwal" className={styles.section} style={{ backgroundColor: "#fff", maxWidth: "100%", padding: "4rem 5%" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <span className={styles.badge}>Rundown</span>
          </div>
          <h2 className={styles.sectionTitle}>Jadwal Kegiatan 5 Hari</h2>
          <p className={styles.sectionSubtitle}>Berikut adalah rincian kegiatan menyenangkan yang akan dilalui siswa selama minggu pertama di SMPN 5 Klaten.</p>

          <div className={styles.jadwalContainer}>
            {jadwalData.map((hari) => (
              <div key={hari.id} className={styles.accordionItem}>
                <div className={styles.accordionHeader} onClick={() => toggleJadwal(hari.id)}>
                  <div className={styles.accordionTitleWrapper}>
                    <span className={styles.accordionHari}>{hari.hari}</span>
                    <span className={styles.accordionTema}>{hari.tema}</span>
                  </div>
                  <i className={`ti ti-chevron-down ${styles.accordionIcon} ${openJadwalId === hari.id ? styles.open : ""}`} style={{ fontSize: "1.5rem" }}></i>
                </div>
                <div className={`${styles.accordionBody} ${openJadwalId === hari.id ? styles.open : ""}`}>
                  <table className={styles.jadwalTable}>
                    <thead>
                      <tr>
                        <th className={styles.colWaktu}>Waktu</th>
                        <th className={styles.colIcon}></th>
                        <th>Kegiatan & Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hari.kegiatan.map((keg, idx) => (
                        <tr key={idx}>
                          <td className={styles.colWaktu}>{keg.waktu}</td>
                          <td className={styles.colIcon}><i className={keg.ikon}></i></td>
                          <td>
                            <div className={styles.kegiatanTitle}>
                              <span className={styles.colIcon} style={{ display: "none" }}><i className={keg.ikon}></i> </span>
                              {keg.judul}
                            </div>
                            <div className={styles.kegiatanDesc}>{keg.desc}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CHECKLIST ORANG TUA */}
      <section id="checklist" className={styles.section}>
        <div style={{ textAlign: "center" }}>
          <span className={styles.badge}>Persiapan</span>
        </div>
        <h2 className={styles.sectionTitle}>Checklist Orang Tua</h2>
        <p className={styles.sectionSubtitle}>Bantu kelancaran kegiatan MPLS anak dengan melengkapi daftar persiapan di bawah ini.</p>

        <div className={styles.checklistCard}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress Persiapan</span>
            <span className={styles.progressCounter}>{checkedItems.length} / 5</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${(checkedItems.length / 5) * 100}%` }}></div>
          </div>

          <div className={styles.checkItemsWrapper}>
            {checklistData.map((item) => (
              <div 
                key={item.id} 
                className={`${styles.checkItem} ${checkedItems.includes(item.id) ? styles.done : ""}`}
                onClick={() => toggleCheck(item.id)}
              >
                <div className={styles.checkBox}>
                  <i className={`ti ti-check ${styles.checkIcon}`}></i>
                </div>
                <div className={styles.checkContent}>
                  <div className={styles.checkTitle}>{item.judul}</div>
                  <div className={styles.checkDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className={styles.section} style={{ paddingTop: 0 }}>
        <h2 className={styles.sectionTitle}>Tanya Jawab Umum (FAQ)</h2>
        <p className={styles.sectionSubtitle}>Pertanyaan yang sering ditanyakan seputar pelaksanaan MPLS Ramah.</p>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {faqData.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <div className={styles.faqHeader} onClick={() => toggleFaq(faq.id)}>
                <span>{faq.q}</span>
                <i className={`ti ${openFaqId === faq.id ? "ti-x" : "ti-plus"} ${styles.faqIcon} ${openFaqId === faq.id ? styles.open : ""}`}></i>
              </div>
              <div className={`${styles.faqBody} ${openFaqId === faq.id ? styles.open : ""}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INFORMASI PRAKTIS */}
      <section id="info-praktis" className={styles.section} style={{ paddingTop: 0 }}>
        <div style={{ textAlign: "center" }}>
          <span className={styles.badge}>Panduan Lengkap</span>
        </div>
        <h2 className={styles.sectionTitle}>Informasi Praktis</h2>
        <p className={styles.sectionSubtitle}>Semua yang perlu Bapak/Ibu dan ananda ketahui sebelum hari pertama MPLS.</p>

        <div className={styles.infoGrid}>
          {/* Dress Code */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <i className="ti ti-shirt" style={{ fontSize: "1.5rem", color: "#944535" }}></i>
              <h3 className={styles.infoCardTitle}>Dress Code Harian</h3>
            </div>
            <table className={styles.dresscodeTable}>
              <thead><tr><th>Hari</th><th>Pakaian</th></tr></thead>
              <tbody>
                {dresscodeData.map((d, i) => (
                  <tr key={i}>
                    <td>{d.hari}</td>
                    <td><strong>{d.pakaian}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tata Tertib MPLS */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <i className="ti ti-clipboard-list" style={{ fontSize: "1.5rem", color: "#944535" }}></i>
              <h3 className={styles.infoCardTitle}>Tata Tertib MPLS</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#454652", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Membuat dan mengunggah twibbon MPLS.</li>
                <li>Memakai nametag MPLS yang sudah disediakan.</li>

                <li>Membuat yel-yel dan jargon kelas.</li>
                <li>Mencatat materi selama MPLS dan mengerjakan tugas serta dikumpulkan di tautan yang sudah disediakan.</li>

                <li>Menyiapkan unjuk karya kelas.</li>
                <li>Mengisi tautan tugas "7 Kebiasaan Anak Indonesia Hebat".</li>
                <li>Membawa card holder ukuran B3 dengan warna tali merah untuk putri dan biru untuk putra</li>
                <li>Membuat poster deklarasi "Anti Bullying/Anti Judol/Anti NAPZA/ dengan ukuran A3 dibawa saat hari Rabu, 15 Juli 2026.</li>
              </ol>
              
              <div style={{ background: "#fdf8f2", padding: "1rem", borderRadius: "8px", border: "1px solid #FAD6A6" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#944535", marginBottom: "0.5rem" }}>NB (Catatan Tambahan):</div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#454652", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <li>Membawa alat tulis dan buku catatan.</li>
                  <li>Membawa HP dengan paket data untuk hari ke-3.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kontak Panitia */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <i className="ti ti-phone" style={{ fontSize: "1.5rem", color: "#944535" }}></i>
              <h3 className={styles.infoCardTitle}>Kontak Panitia MPLS</h3>
            </div>
            <div className={styles.kontakList}>
              {[
                { nama: "Namjuari, S.Pd.", peran: "Koordinator MPLS", wa: "081389092883" },
              ].map((k, i) => (
                <div key={i} className={styles.kontakCard}>
                  <div className={styles.kontakInfo}>
                    <div className={styles.kontakNama}>{k.nama}</div>
                    <div className={styles.kontakPeran}>{k.peran}</div>
                    <div className={styles.kontakWa}><i className="ti ti-phone"></i> {k.wa}</div>
                  </div>
                  <a href={`https://wa.me/${k.wa.replace(/[^0-9]/g, "62")}`} target="_blank" rel="noopener noreferrer" className={styles.btnWa}>
                    <i className="ti ti-brand-whatsapp"></i> Chat
                  </a>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", color: "#767683", marginTop: "1rem" }}>*Kontak tersedia pada hari kerja pukul 07.00–15.00 WIB</p>
          </div>

          {/* Peta Lokasi */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <i className="ti ti-map-pin" style={{ fontSize: "1.5rem", color: "#944535" }}></i>
              <h3 className={styles.infoCardTitle}>Peta & Lokasi Sekolah</h3>
            </div>
            <div className={styles.mapWrapper}>
              {/* Ganti src iframe dengan embed Google Maps sekolah Anda */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d110.6!3d-7.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSMPN+5+Klaten!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%" height="220" style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Peta SMPN 5 Klaten"
              ></iframe>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#454652", marginTop: "0.75rem" }}>
              <i className="ti ti-map-pin" style={{ color: "#944535" }}></i> Jl. [Alamat Sekolah], Klaten, Jawa Tengah
            </p>
            <a href="https://goo.gl/maps/..." target="_blank" rel="noopener noreferrer" className={styles.btnMaps}>
              <i className="ti ti-external-link"></i> Buka di Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* 8. CTA EVALUASI */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBanner}>
          <div className={styles.badge} style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
            Tersedia s.d. 31 Juli 2026
          </div>
          <h2 className={styles.ctaTitle}>Bantu Kami Berkembang</h2>
          <p className={styles.ctaDesc}>
            Umpan balik dari Bapak/Ibu sangat berharga untuk memastikan lingkungan SMPN 5 Klaten terus menjadi tempat yang aman, nyaman, dan menyenangkan bagi anak.
          </p>
          <a href="#" className={styles.btnCta} target="_blank" rel="noopener noreferrer">
            <i className="ti ti-edit"></i> Isi Formulir Evaluasi
          </a>
        </div>
      </section>

      {/* TAUTAN RESMI & LARANGAN */}
      <section className={styles.section} style={{ paddingTop: 0, paddingBottom: "2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(198,197,212,0.3)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1c1d", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="ti ti-link" style={{ color: "#944535" }}></i> Tautan Resmi Kemendikdasmen
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><a href="https://s.id/laguharibaru" target="_blank" rel="noopener noreferrer" style={{ color: "#944535", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ti ti-music"></i> Lagu "Hari Baru"</a></li>
              <li><a href="https://s.id/lagurukunsamateman" target="_blank" rel="noopener noreferrer" style={{ color: "#944535", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ti ti-music"></i> Lagu "Rukun Sama Teman"</a></li>
              <li><a href="https://drive.google.com/file/d/1JD1LVAscF00UzLuzi8skqrPdZ9voklLi/view" target="_blank" rel="noopener noreferrer" style={{ color: "#944535", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ti ti-stethoscope"></i> Panduan CKG SATUSEHAT</a></li>
              <li><a href="https://cerdasberkarakter.kemendikdasmen.go.id/deteksidini" target="_blank" rel="noopener noreferrer" style={{ color: "#944535", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ti ti-notes"></i> Portal Deteksi Dini</a></li>
              <li><a href="https://bit.ly/mpls7KAIH" target="_blank" rel="noopener noreferrer" style={{ color: "#944535", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ti ti-book"></i> Materi Tujuh Kebiasaan Hebat</a></li>

            </ul>
          </div>

          <div style={{ background: "#fff", padding: "2rem", borderRadius: "16px", border: "1px solid #fca5a5" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#991b1b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="ti ti-ban" style={{ color: "#ef4444" }}></i> Larangan MPLS
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#454652", marginBottom: "1rem" }}>Sekolah kami berkomitmen mengikuti peraturan resmi yang melarang keras:</p>
            <ul style={{ fontSize: "0.85rem", color: "#454652", paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>Segala bentuk <strong>perpeloncoan</strong> atau kekerasan.</li>
              <li>Pungutan biaya atau uang dalam bentuk apapun.</li>
              <li>Memberi tugas yang tidak relevan dengan tujuan MPLS.</li>
              <li>Mewajibkan atribut yang memberatkan/tidak edukatif.</li>
              <li>Melibatkan alumni sebagai penyelenggara MPLS.</li>
            </ul>
          </div>
          
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>SMPN 5 Klaten</div>
        <div>Tahun Ajaran 2026/2027</div>
        <div className={styles.footerHashtags}>
          #AmanNyaman #GembiradiSekolah #MPLSRamah2026
        </div>
        <div style={{ marginTop: "2rem", opacity: 0.5, fontSize: "0.8rem" }}>
          *Halaman ini berisi data dummy untuk keperluan demonstrasi.
        </div>
      </footer>
    </div>
  );
};

export default MplsPage;
