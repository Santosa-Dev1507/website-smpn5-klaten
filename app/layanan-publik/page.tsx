"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./layanan.module.css";
import Header from "../components/Header";

// ===== TYPE =====
type Layanan = {
  id: string;
  nomor: string;
  unit: string;
  icon: React.ReactNode;
  title: string;
  badge: string;
  badgeType: "free" | "info";
  desc: string;
  syarat: string[];
  prosedur: string[];
  waktu: string;
  biaya: string;
  produk: string;
  pengaduan: string;
  jadwal: string;
};

// ===== DATA =====
const layanan: Layanan[] = [
  {
    id: "spmb",
    nomor: "01",
    unit: "Kesiswaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "PPDB / SPMB",
    badge: "Gratis",
    badgeType: "free",
    desc: "Penerimaan Peserta Didik Baru melalui jalur zonasi, prestasi, afirmasi, dan perpindahan tugas sesuai jadwal Dinas Pendidikan Klaten.",
    syarat: [
      "Usia maksimal 15 tahun per 1 Juli tahun berjalan",
      "Akta Kelahiran dan Kartu Keluarga (NIK valid)",
      "Ijazah / Surat Keterangan Lulus (SKL) SD/MI",
      "Dokumen jalur afirmasi: KIP/KKS/SKTM (jika jalur afirmasi)",
      "Dokumen jalur prestasi: piagam/sertifikat (jika jalur prestasi)",
      "Surat tugas orang tua + surat domisili (jika jalur perpindahan)",
    ],
    prosedur: [
      "Pendaftaran online/mandiri melalui portal PPDB resmi Dinas Pendidikan Klaten.",
      "Penyerahan berkas fisik ke panitia sesuai jadwal verifikasi.",
      "Validasi data dan kelengkapan dokumen oleh panitia sekolah.",
      "Pengumuman hasil seleksi melalui website dan papan pengumuman sekolah.",
      "Daftar ulang bagi peserta yang diterima sesuai jadwal yang ditentukan.",
    ],
    waktu: "Sesuai agenda Dinas Pendidikan Klaten",
    biaya: "GRATIS · Rp 0,-",
    produk: "Tanda Bukti Diterima sebagai Peserta Didik Baru SMPN 5 Klaten",
    pengaduan: "Kotak Pengaduan PPDB, WA Panitia, Link Pengaduan Dinas Pendidikan Klaten",
    jadwal: "Disesuaikan jadwal PPDB/SPMB Dinas Pendidikan Klaten",
  },
  {
    id: "mutasi",
    nomor: "02",
    unit: "Kesiswaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: "Mutasi Siswa",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan perpindahan siswa masuk atau keluar dari SMPN 5 Klaten sesuai prosedur dinas pendidikan.",
    syarat: [
      "Keluar: Surat permohonan tertulis orang tua/wali + surat penerimaan sekolah tujuan",
      "Masuk: Surat Keterangan Lepas dari sekolah asal + rekomendasi Dinas Pendidikan",
      "Rapor asli beserta fotokopi yang telah dilegalisir",
      "Fotokopi Kartu Keluarga (KK) dan Akta Kelahiran",
      "Pas foto terbaru ukuran 3×4 (2 lembar)",
    ],
    prosedur: [
      "Orang tua/wali mengajukan berkas permohonan ke Tata Usaha.",
      "Wakasek Kesiswaan memverifikasi kelengkapan dokumen.",
      "Disposisi dan persetujuan Kepala Sekolah.",
      "Penerbitan surat keterangan mutasi resmi.",
      "Update data siswa pada sistem Dapodik.",
    ],
    waktu: "Maksimal 2 hari kerja",
    biaya: "GRATIS · Rp 0,-",
    produk: "Surat Keterangan Mutasi + Surat Keterangan Validasi Dapodik",
    pengaduan: "Kotak Pengaduan, Email smpn5klaten@sch.id, Ruang Humas TU",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "surat-aktif",
    nomor: "03",
    unit: "Tata Usaha",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Surat Keterangan Siswa Aktif",
    badge: "Gratis",
    badgeType: "free",
    desc: "Penerbitan surat keterangan resmi bahwa siswa masih aktif terdaftar di SMPN 5 Klaten, untuk keperluan tunjangan, beasiswa, atau BPJS.",
    syarat: [
      "Fotokopi Kartu Pelajar siswa bersangkutan",
      "Mengisi formulir permohonan dengan mencantumkan tujuan pembuatan (tunjangan anak PNS, beasiswa, BPJS, dll.)",
    ],
    prosedur: [
      "Pemohon menyerahkan form dan berkas di loket Tata Usaha.",
      "Petugas memverifikasi kesesuaian nama siswa pada Buku Induk & Dapodik.",
      "Pencetakan draf surat keterangan untuk ditandatangani Kepala Sekolah.",
      "Penomoran, pembubuhan stempel, dan penyerahan surat kepada siswa/orang tua.",
    ],
    waktu: "Maksimal 30 menit (jika Kepala Sekolah/pejabat berwenang di tempat)",
    biaya: "GRATIS · Rp 0,-",
    produk: "Surat Keterangan Aktif Siswa resmi dengan tanda tangan asli dan stempel basah",
    pengaduan: "Kotak Pengaduan, Telp Sekolah (0272) 321487",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "kartu-pelajar",
    nomor: "04",
    unit: "Kesiswaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Kartu Pelajar",
    badge: "Gratis",
    badgeType: "free",
    desc: "Pembuatan Kartu Pelajar baru bagi siswa kelas VII atau kartu pengganti bagi siswa yang kartunya hilang/rusak.",
    syarat: [
      "Status siswa aktif tercatat di sekolah",
      "Pas foto berseragam sekolah ukuran 2×3 cm (file digital)",
      "Surat Keterangan Hilang dari sekolah/kepolisian (khusus kartu pengganti karena hilang)",
    ],
    prosedur: [
      "Siswa mendaftar ke bagian kesiswaan / operator kartu.",
      "Verifikasi data identitas siswa (NISN) dan pengambilan/penyerahan pas foto.",
      "Proses pencetakan kartu pelajar menggunakan mesin ID Card Printer sekolah.",
      "Penyerahan kartu pelajar baru yang sudah disahkan kepada siswa.",
    ],
    waktu: "Maksimal 1 hari kerja",
    biaya: "GRATIS · Rp 0,-",
    produk: "Kartu Tanda Anggota Pelajar (Kartu Pelajar) berbasis PVC berlaminasi resmi",
    pengaduan: "Petugas Loket Tata Usaha, WhatsApp aduan internal sekolah",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "beasiswa",
    nomor: "05",
    unit: "Kesiswaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: "Beasiswa / Bantuan PIP",
    badge: "Gratis",
    badgeType: "free",
    desc: "Pengajuan dan penyaluran beasiswa atau bantuan pendidikan PIP (Program Indonesia Pintar) dan bantuan GAKIN bagi siswa kurang mampu.",
    syarat: [
      "Fotokopi KIP / PKH / KKS atau Surat Keterangan Tidak Mampu (SKTM) dari Desa/Kelurahan",
      "Fotokopi Kartu Keluarga (KK) dan Akta Kelahiran",
      "Berkas usulan tertulis dari Wali Kelas atau pengajuan mandiri oleh Orang Tua",
    ],
    prosedur: [
      "Penyerahan berkas persyaratan beasiswa ke Koordinator Bantuan Sekolah.",
      "Penginputan penanda layak bansos/beasiswa ke dalam aplikasi Dapodik Pusat.",
      "Setelah SK Penerima turun dari Kemendikbud, sekolah menerbitkan Surat Pengantar Pencairan.",
      "Siswa dan orang tua mencairkan dana langsung di Bank Penyalur yang ditunjuk.",
    ],
    waktu: "Pengusulan berkala sesuai jadwal Dapodik; Surat Pengantar maksimal 1 hari kerja",
    biaya: "GRATIS · Rp 0,-",
    produk: "Surat Pengantar Aktivasi/Pencairan Rekening Beasiswa PIP / Bantuan Pemkab",
    pengaduan: "Layanan Pengaduan Bansos/Beasiswa Sekolah, Wakasek Kesiswaan",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "legalisasi",
    nomor: "06",
    unit: "Tata Usaha",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 12 18 15 15" />
        <line x1="12" y1="12" x2="12" y2="18" />
      </svg>
    ),
    title: "Legalisasi Ijazah & SKHU",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan legalisasi fotokopi Ijazah dan SKHU (Surat Keterangan Hasil Ujian) oleh Kepala Sekolah dengan stempel basah resmi.",
    syarat: [
      "Fotokopi Ijazah/SKHU asli yang akan dilegalisasi (maksimal 5 lembar per permohonan)",
      "Wajib membawa/menunjukkan dokumen Ijazah/SKHU asli untuk verifikasi fisik",
    ],
    prosedur: [
      "Pemohon menyerahkan berkas di loket Tata Usaha.",
      "Petugas mencocokkan fisik berkas fotokopi dengan ijazah/SKHU asli.",
      "Pemarafan berkas oleh Kaur TU dan penandatanganan oleh Kepala Sekolah.",
      "Pembubuhan stempel resmi basah sekolah dan penyerahan berkas kepada pemohon.",
    ],
    waktu: "Maksimal 15 menit (jika pimpinan berada di tempat)",
    biaya: "GRATIS · Rp 0,-",
    produk: "Lembaran fotokopi Ijazah/SKHU yang sah dilegalisasi Kepala Sekolah dengan stempel basah",
    pengaduan: "Kotak Saran Sekolah, Email resmi smpn5klaten@sch.id",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "skpi",
    nomor: "07",
    unit: "Tata Usaha",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Pengganti Ijazah Hilang/Rusak",
    badge: "Gratis",
    badgeType: "free",
    desc: "Penerbitan Surat Keterangan Pengganti Ijazah (SKPI) bagi alumni yang ijazahnya hilang atau rusak, bernilai hukum setara ijazah asli.",
    syarat: [
      "Surat Keterangan Kehilangan dari Kepolisian sektor setempat",
      "Surat pernyataan tanggung jawab mutlak dari pemohon bermeterai Rp10.000",
      "Fotokopi ijazah lama (jika ada) atau saksi teman seangkatan kelulusan (minimal 2 orang)",
    ],
    prosedur: [
      "Pemohon berkonsultasi dan membawa berkas ke Tata Usaha.",
      "Petugas menelusuri data kelulusan pemohon pada Buku Induk Kelulusan / Arsip Nilai Ujian.",
      "Pembuatan draf Surat Keterangan Pengganti Ijazah (SKPI).",
      "Pemohon bersama Kepala Sekolah menandatangani SKPI di depan saksi, dilampiri cap tiga jari.",
    ],
    waktu: "Maksimal 3 hari kerja (termasuk verifikasi buku induk lama)",
    biaya: "GRATIS · Rp 0,-",
    produk: "Surat Keterangan Pengganti Ijazah (SKPI) yang sah dan bernilai hukum setara ijazah asli",
    pengaduan: "Humas Sekolah, Dinas Pendidikan Kabupaten Klaten",
    jadwal: "Sen–Kam 07.30–13.00 · Jumat 07.30–10.30 · Sabtu 07.30–12.00 WIB",
  },
  {
    id: "bk",
    nomor: "08",
    unit: "Kesiswaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Bimbingan Konseling (BK)",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan bimbingan dan konseling tatap muka oleh Guru BK untuk siswa maupun orang tua/wali dalam menyelesaikan masalah pribadi, belajar, sosial, atau karier.",
    syarat: [
      "Peserta didik aktif atau orang tua/wali murid SMPN 5 Klaten",
      "Mengisi formulir perjanjian waktu konseling atau membawa surat panggilan resmi dari sekolah",
    ],
    prosedur: [
      "Pemohon hadir di Ruang BK sesuai jadwal kesepakatan.",
      "Guru BK melakukan proses konseling (pribadi, belajar, sosial, atau karier) tatap muka.",
      "Penyusunan rencana tindak lanjut (RTL) penyelesaian masalah anak.",
      "Pendokumentasian lembar ringkasan konseling secara rahasia.",
    ],
    waktu: "30 hingga 60 menit per sesi konseling (kondisional)",
    biaya: "GRATIS · Rp 0,-",
    produk: "Solusi bimbingan / rekomendasi RTL perkembangan perilaku dan akademik siswa",
    pengaduan: "Kotak Pengaduan Masalah Siswa, Komite Sekolah, Wakasek Kesiswaan",
    jadwal: "Sen–Kam 07.00–14.00 · Jumat 07.00–11.00 · Sabtu 07.00–12.30 WIB",
  },
  {
    id: "perpustakaan",
    nomor: "09",
    unit: "Perpustakaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Peminjaman Buku & Kartu Anggota",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan peminjaman buku cetak dan buku paket, serta pendaftaran dan penggantian Kartu Anggota Perpustakaan SMPN 5 Klaten.",
    syarat: [
      "Memiliki Kartu Anggota Perpustakaan digital atau fisik yang masih aktif",
      "Tidak memiliki tunggakan keterlambatan pengembalian buku sebelumnya",
    ],
    prosedur: [
      "Pengunjung mencari buku di rak perpustakaan atau melalui katalog sistem komputer OPAC.",
      "Menyerahkan buku dan kartu anggota ke meja sirkulasi.",
      "Pustakawan memindai barcode buku dan kartu anggota pada Sistem Perpustakaan Digital.",
      "Penyerahan buku dengan batas waktu pinjam maksimal 1 minggu.",
    ],
    waktu: "Proses sirkulasi peminjaman maksimal 5 menit",
    biaya: "GRATIS · Rp 0,-",
    produk: "Hak pinjam buku cetak / buku paket / buku referensi pelajaran sekolah",
    pengaduan: "Kotak Masukan Koleksi Buku Baru, Meja Kepala Perpustakaan",
    jadwal: "Sen–Kam 07.00–13.30 · Jumat 07.00–10.45 · Sabtu 07.00–12.15 WIB",
  },
  {
    id: "pengaduan-publik",
    nomor: "10",
    unit: "Humas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Informasi Publik & Pengaduan",
    badge: "Gratis",
    badgeType: "free",
    desc: "Layanan permintaan informasi publik, konsultasi, dan penanganan pengaduan masyarakat terkait penyelenggaraan pendidikan di SMPN 5 Klaten.",
    syarat: [
      "Menunjukkan kartu identitas diri pelapor (KTP/SIM/Paspor) yang sah",
      "Menyampaikan aduan secara tertulis atau lisan disertai bukti awal yang dapat dipertanggungjawabkan",
    ],
    prosedur: [
      "Pelapor menyampaikan pengaduan via desk pengaduan langsung, WhatsApp, atau email resmi.",
      "Tim Pengaduan Sekolah (Humas) mencatat dan mengklasifikasikan jenis aduan.",
      "Investigasi internal dan koordinasi dengan unit terkait di dalam sekolah.",
      "Penyampaian umpan balik / jawaban penyelesaian masalah resmi kepada pelapor.",
    ],
    waktu: "Maksimal 5 hari kerja untuk penanganan tingkat sekolah",
    biaya: "GRATIS · Rp 0,-",
    produk: "Surat Tanggapan Pengaduan Resmi / Berita Acara Penyelesaian Masalah Publik",
    pengaduan: "Diteruskan ke Inspektorat Daerah Kabupaten Klaten / Dinas Pendidikan via portal SP4N-LAPOR!",
    jadwal: "Sen–Kam 07.00–14.00 · Jumat 07.00–11.00 · Sabtu 07.00–12.30 WIB",
  },
];

const tataKelola = [
  {
    id: "kebijakan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Kebijakan & Maklumat",
    content: [
      { label: "Visi Pelayanan", value: "Mewujudkan SIPP sebagai portal pelayanan pendidikan yang transparan, akuntabel, dan prima bagi seluruh masyarakat." },
      { label: "Maklumat", value: "Dokumen maklumat resmi dengan tanda tangan Kepala Sekolah tersedia di bawah (No. 800.1/042 Tahun 2026)." },
      { label: "Standar Waktu", value: "Setiap permohonan layanan melalui SIPP diselesaikan sesuai SOP dengan rentang waktu 1–5 hari kerja, tergantung jenis layanan." },
      { label: "Biaya Layanan", value: "Seluruh layanan administratif melalui SIPP tidak dipungut biaya (GRATIS / Rp 0)." },
    ],
    dokumen: [
      {
        id: "maklumat",
        judul: "Maklumat Pelayanan",
        keterangan: "No. 800.1/042 Tahun 2026 · TTD Kepala Sekolah",
        src: "/dokumen/maklumat-pelayanan.jpg",
        alt: "Maklumat Pelayanan SMPN 5 Klaten — Keputusan Kepala Sekolah No. 800.1/042 Tahun 2026 dengan tanda tangan Kamidi, S.Pd",
      },
      {
        id: "ikm",
        judul: "Indeks Kepuasan Masyarakat",
        keterangan: "Nilai 89,8 · Periode Jan–Mar 2026",
        src: "/dokumen/ikm-2026.jpg",
        alt: "Indeks Kepuasan Masyarakat SMPN 5 Klaten nilai 89,8 periode Januari hingga Maret 2026",
      },
    ],
  },
  {
    id: "sdm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "SDM & Sarpras",
    content: [
      { label: "Kompetensi Petugas", value: "Semua petugas pelayanan telah mendapatkan pelatihan standar pelayanan publik dan diklat administrasi pendidikan." },
      { label: "Fasilitas Ruang Tunggu", value: "Tersedia ruang tunggu yang nyaman dengan kursi, kipas angin, dan nomor antrian di kantor Tata Usaha." },
      { label: "Aksesibilitas", value: "Fasilitas sekolah dilengkapi akses bagi penyandang disabilitas sesuai standar nasional." },
      { label: "Waktu Operasional", value: "Senin – Kamis 07.00–14.00 WIB | Jumat 07.00–11.00 WIB | Sabtu 07.00–12.30 WIB. Pelayanan TU: 07.30–13.00 WIB." },
    ],
  },
  {
    id: "inovasi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
    title: "SIPP & Inovasi",
    content: [
      { label: "Platform SIPP", value: "SMPN 5 Klaten mengoperasikan SIPP (Sistem Informasi Pelayanan Publik) sebagai portal resmi untuk transparansi dan efisiensi seluruh layanan administratif." },
      { label: "Portal Resmi", value: "Informasi layanan, pengumuman, dan berita sekolah dapat diakses melalui SIPP di smpn5klaten.sch.id." },
      { label: "Inovasi SIPP", value: "SIPP terus dikembangkan dengan mengintegrasikan fitur digital untuk mempermudah pengajuan, pemantauan, dan evaluasi layanan." },
      { label: "Media Sosial", value: "Ikuti akun resmi sekolah untuk informasi terkini dan pengumuman penting dari SIPP." },
    ],
  },
  {
    id: "tambahan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: "Biaya & Hak Pengguna",
    content: [
      { label: "Biaya Layanan", value: "Semua layanan administratif SMPN 5 Klaten GRATIS (Rp 0). Tidak ada pungutan dalam bentuk apapun." },
      { label: "Pengaduan Pungli", value: "Jika menemukan pungutan liar, segera laporkan melalui formulir pengaduan atau langsung ke Kepala Sekolah." },
      { label: "Transparansi", value: "Data layanan dan penyelenggaraan pendidikan dapat diakses publik melalui portal SP4N-LAPOR! dan SIPPN." },
      { label: "Hak Pengguna", value: "Setiap pengguna layanan berhak mendapatkan pelayanan yang adil, tidak diskriminatif, dan sesuai standar yang berlaku." },
    ],
  },
];

// ===== COMPONENT =====
export default function LayananPublikPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("kebijakan");
  const [activeDoc, setActiveDoc] = useState<{ src: string; alt: string; judul: string } | null>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Parallax — direct DOM write, zero React re-renders
  useEffect(() => {
    const el = heroBgRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close modal or doc lightbox on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeDoc) setActiveDoc(null);
        else setActiveModal(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDoc]);

  // Lock scroll when modal or doc open
  useEffect(() => {
    document.body.style.overflow = (activeModal || activeDoc) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal, activeDoc]);

  const activeLayanan = layanan.find((l) => l.id === activeModal);

  return (
    <main className={styles.main}>
      <Header activePage="Layanan" />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} ref={heroBgRef} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
            <a href="/">Beranda</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">SIPP</span>
          </nav>
          <div className={styles.heroBadge} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SIPP &mdash; SMP Negeri 5 Klaten
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>Sistem Informasi</span>
            <span className={styles.heroLineAccent}>Pelayanan Publik</span>
            <span className={styles.heroLine3}>SMP Negeri 5 Klaten</span>
          </h1>
          <p className={styles.heroDesc}>
            SIPP adalah portal terpadu untuk mengakses seluruh layanan administratif sekolah secara transparan, akuntabel, dan gratis.
          </p>
          <div className={styles.heroCtas}>
            <a href="#layanan" className={styles.ctaPrimary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Lihat Layanan
            </a>
            <a href="#pengaduan" className={styles.ctaSecondary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Ajukan Pengaduan
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.heroStats} aria-label="Statistik layanan">
          {[
            { value: "10", label: "Jenis Layanan" },
            { value: "Rp 0", label: "Biaya Layanan" },
            { value: "≤5", label: "Hari Proses" },
            { value: "6x", label: "Hari/Minggu" },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN UTAMA */}
      <section id="layanan" className={styles.layananSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} reveal`}>
            <span className={styles.sectionPill}>Layanan SIPP</span>
            <h2 className={styles.sectionTitle}>
              Layanan yang Tersedia di <span className={styles.accent}>SIPP</span>
            </h2>
            <p className={styles.sectionDesc}>
              Seluruh 10 layanan administratif SMPN 5 Klaten tersedia melalui SIPP secara gratis dan transparan. Klik kartu untuk melihat standar pelayanan lengkap.
            </p>
          </div>

          <div className={styles.layananGrid}>
            {layanan.map((item, i) => (
              <button
                key={item.id}
                className={`${styles.layananCard} reveal`}
                style={{ transitionDelay: `${i * 55}ms` }}
                aria-label={`Lihat standar pelayanan ${item.title}`}
                onClick={() => setActiveModal(item.id)}
              >
                <div className={styles.cardIconWrap}>
                  <div className={styles.cardIcon}>{item.icon}</div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardTitle}>{item.title}</span>
                    <span className={`${styles.cardBadge} ${item.badgeType === "free" ? styles.badgeFree : styles.badgeInfo}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className={styles.cardUnit}>
                    <span>{item.unit}</span>
                    <span className={styles.cardNomor}>#{item.nomor}</span>
                  </div>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardMeta}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{item.waktu}</span>
                  </div>
                  <span className={styles.cardCta} aria-hidden="true">
                    Lihat Standar Pelayanan
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TATA KELOLA */}
      <section id="tata-kelola" className={styles.tataKelolaSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} reveal`}>
            <span className={styles.sectionPill}>Standar Pelayanan</span>
            <h2 className={styles.sectionTitle}>
              Tata Kelola <span className={styles.accent}>SIPP</span>
            </h2>
            <p className={styles.sectionDesc}>
              Prinsip dan standar yang menjadi landasan SIPP dalam memberikan pelayanan yang berkualitas, akuntabel, dan bertanggung jawab.
            </p>
          </div>

          <div className={`${styles.accordionWrapper} reveal`}>
            {/* Sidebar tabs */}
            <div className={styles.accordionNav} role="tablist" aria-label="Kategori tata kelola">
              {tataKelola.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={activeAccordion === item.id}
                  aria-controls={`panel-${item.id}`}
                  className={`${styles.accordionNavBtn} ${activeAccordion === item.id ? styles.accordionNavActive : ""}`}
                  onClick={() => setActiveAccordion(item.id)}
                >
                  <span className={styles.accordionNavIcon}>{item.icon}</span>
                  <span className={styles.accordionNavLabel}>{item.title}</span>
                  <svg className={styles.accordionNavArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className={styles.accordionPanel}>
              {tataKelola.map((item) => (
                <div
                  key={item.id}
                  id={`panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${item.id}`}
                  className={`${styles.accordionContent} ${activeAccordion === item.id ? styles.accordionContentActive : ""}`}
                >
                  <div className={styles.panelHeader}>
                    <div className={styles.panelIconWrap}>{item.icon}</div>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={styles.panelItems}>
                    {item.content.map((c) => (
                      <div key={c.label} className={styles.panelItem}>
                        <div className={styles.panelItemLabel}>{c.label}</div>
                        <div className={styles.panelItemValue}>{c.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Dokumen resmi — hanya pada tab yang memiliki properti dokumen */}
                  {"dokumen" in item && Array.isArray((item as typeof item & { dokumen?: unknown[] }).dokumen) && (
                    <div className={styles.dokumenSection}>
                      <div className={styles.dokumenSectionLabel}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Dokumen Resmi
                      </div>
                      <div className={styles.dokumenGrid}>
                        {((item as typeof item & { dokumen: { id: string; judul: string; keterangan: string; src: string; alt: string }[] }).dokumen).map((doc) => (
                          <button
                            key={doc.id}
                            className={styles.dokumenCard}
                            onClick={() => setActiveDoc({ src: doc.src, alt: doc.alt, judul: doc.judul })}
                            aria-label={`Lihat dokumen ${doc.judul} dalam tampilan penuh`}
                          >
                            <div className={styles.dokumenThumbWrap}>
                              <Image
                                src={doc.src}
                                alt={doc.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 260px"
                                className={styles.dokumenThumb}
                              />
                              <div className={styles.dokumenOverlay} aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22} aria-hidden="true">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                  <line x1="11" y1="8" x2="11" y2="14" />
                                  <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                              </div>
                            </div>
                            <div className={styles.dokumenInfo}>
                              <span className={styles.dokumenJudul}>{doc.judul}</span>
                              <span className={styles.dokumenKet}>{doc.keterangan}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PENGADUAN & AKSI */}
      <section id="pengaduan" className={styles.actionSection}>
        <div className={styles.container}>
          <div className={styles.actionGrid}>
            {/* Form Card */}
            <div className={`${styles.formCard} reveal`}>
              <div className={styles.formCardHeader}>
                <div className={styles.formCardIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  {/* h3 bukan h2 — menjaga hierarki heading yang benar */}
                  <h3 className={styles.formCardTitle}>Formulir Pengaduan SIPP</h3>
                  <p className={styles.formCardSubtitle}>Sampaikan keluhan atau masukan layanan kepada kami</p>
                </div>
              </div>

              <form className={styles.form} noValidate>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nama" className={styles.formLabel}>
                      Nama Lengkap <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="nama"
                      type="text"
                      className={styles.formInput}
                      placeholder="Masukkan nama lengkap"
                      disabled
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="kontak" className={styles.formLabel}>
                      Email / No. WhatsApp <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="kontak"
                      type="text"
                      className={styles.formInput}
                      placeholder="email@contoh.com atau 08xx"
                      disabled
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="kategori" className={styles.formLabel}>
                    Kategori Layanan <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <select id="kategori" className={styles.formSelect} disabled>
                    <option value="">-- Pilih Kategori --</option>
                    <option>PPDB / SPMB</option>
                    <option>Mutasi Siswa</option>
                    <option>Surat Keterangan Siswa Aktif</option>
                    <option>Kartu Pelajar</option>
                    <option>Beasiswa / Bantuan PIP</option>
                    <option>Legalisasi Ijazah &amp; SKHU</option>
                    <option>Pengganti Ijazah Hilang/Rusak</option>
                    <option>Bimbingan Konseling (BK)</option>
                    <option>Peminjaman Buku &amp; Kartu Anggota</option>
                    <option>Informasi Publik &amp; Pengaduan</option>
                    <option>Pungutan Liar (Pungli)</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pesan" className={styles.formLabel}>
                    Isi Laporan / Pengaduan <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="pesan"
                    className={styles.formTextarea}
                    placeholder="Ceritakan secara detail laporan atau masukan Anda..."
                    rows={4}
                    disabled
                  />
                </div>

                {/* Formulir menunggu tautan */}
                <div className={styles.formComingSoon} role="status">
                  <div className={styles.formComingSoonIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={26} height={26} aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <strong>Tautan Formulir Segera Hadir</strong>
                    <p>Formulir digital sedang dalam proses penyiapan. Gunakan saluran di bawah ini untuk pengaduan saat ini.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/62895377815555?text=Halo%20SMPN%205%20Klaten%2C%20saya%20ingin%20menyampaikan%20pengaduan%20layanan..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.formSubmitAlt}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Kirim via WhatsApp
                </a>
              </form>
            </div>

            {/* Saluran eksternal + jam */}
            <div className={styles.actionLinks}>
              <div className={`${styles.actionCard} reveal`} style={{ transitionDelay: "80ms" }}>
                <h3 className={styles.actionCardTitle}>Saluran Pengaduan Resmi</h3>
                <div className={styles.externalLinks}>
                  {[
                    {
                      href: "https://www.lapor.go.id",
                      label: "Buka portal SP4N-LAPOR! di tab baru",
                      cls: styles.extLinkLapor,
                      name: "SP4N-LAPOR!",
                      desc: "Portal pengaduan nasional terintegrasi",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      ),
                    },
                    {
                      href: "https://sippn.menpan.go.id",
                      label: "Buka portal SIPPN di tab baru",
                      cls: styles.extLinkSippn,
                      name: "SIPPN",
                      desc: "Sistem Informasi Pelayanan Publik Nasional",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      ),
                    },
                    {
                      href: "https://wa.me/62895377815555?text=Halo%20SMPN%205%20Klaten%2C%20saya%20ingin%20bertanya%20tentang%20layanan...",
                      label: "Hubungi SMPN 5 Klaten via WhatsApp",
                      cls: styles.extLinkWa,
                      name: "WhatsApp Sekolah",
                      desc: "0895-3778-15555 — respons cepat",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                    },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.extLink} ${link.cls}`}
                      aria-label={link.label}
                    >
                      <div className={styles.extLinkIcon}>{link.icon}</div>
                      <div className={styles.extLinkBody}>
                        <strong>{link.name}</strong>
                        <span>{link.desc}</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} className={styles.extArrow} aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Jam operasional */}
              <div className={`${styles.operasionalCard} reveal`} style={{ transitionDelay: "160ms" }}>
                <div className={styles.operasionalHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={19} height={19} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3>Jam Operasional</h3>
                </div>
                <div className={styles.jamList}>
                  {[
                    { hari: "Senin – Kamis", jam: "07.00 – 14.00 WIB", active: true },
                    { hari: "Jumat", jam: "07.00 – 11.00 WIB", active: true },
                    { hari: "Sabtu", jam: "07.00 – 12.30 WIB", active: true },
                    { hari: "Minggu", jam: "Tutup", active: false },
                  ].map((j) => (
                    <div key={j.hari} className={`${styles.jamItem} ${!j.active ? styles.jamClosed : ""}`}>
                      <span className={styles.jamHari}>{j.hari}</span>
                      <span className={styles.jamWaktu}>{j.jam}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.operasionalNote}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Layanan TU: 07.30 – 13.00 WIB (Senin – Sabtu)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/logo_smpn5.png" alt="Logo SMPN 5 Klaten" width={44} height={44} />
            <div>
              <strong>SMP Negeri 5 Klaten</strong>
              <span>Generasi JUARA</span>
            </div>
          </div>
          <div className={styles.footerMeta}>
            <div className={styles.footerContact}>
              <address className={styles.footerAddress}>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Jl. Kendali Sodo, Jomboran, Klaten Tengah, Klaten
                </span>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.47 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (0272) 321487
                </span>
                <span className={styles.footerContactItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  smpn5klaten@gmail.com
                </span>
              </address>
            </div>
            <p className={styles.footerCopy}>&#169; 2026 SMPN 5 Klaten &#8212; Tempat Tumbuhnya Generasi JUARA.</p>
            <a href="/" className={styles.footerBack}>&#8592; Kembali ke Beranda</a>
          </div>
        </div>
      </footer>

      {/* MODAL STANDAR PELAYANAN — 6 Komponen */}
      {activeLayanan && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Standar pelayanan ${activeLayanan.title}`}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setActiveModal(null)}
              aria-label="Tutup modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>{activeLayanan.icon}</div>
              <div className={styles.modalHeaderInfo}>
                <div className={styles.modalMeta2}>
                  <span className={styles.modalNomor}>Layanan {activeLayanan.nomor}/10</span>
                  <span className={styles.modalUnit}>{activeLayanan.unit}</span>
                </div>
                <h2 className={styles.modalTitle}>{activeLayanan.title}</h2>
                <span className={`${styles.cardBadge} ${activeLayanan.badgeType === "free" ? styles.badgeFree : styles.badgeInfo}`}>
                  {activeLayanan.badge}
                </span>
              </div>
            </div>

            <p className={styles.modalDesc}>{activeLayanan.desc}</p>

            {/* 6 Komponen Grid */}
            <div className={styles.komponenGrid}>
              {/* Komponen 1 — Persyaratan */}
              <div className={styles.komponenCard}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span>Persyaratan</span>
                </div>
                <ul className={styles.komponenList}>
                  {activeLayanan.syarat.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Komponen 2 — Prosedur */}
              <div className={styles.komponenCard}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <span>Prosedur</span>
                </div>
                <ol className={styles.komponenOl}>
                  {activeLayanan.prosedur.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ol>
              </div>

              {/* Komponen 3 — Waktu */}
              <div className={`${styles.komponenCard} ${styles.komponenCardSmall}`}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Jangka Waktu</span>
                </div>
                <p className={styles.komponenValue}>{activeLayanan.waktu}</p>
              </div>

              {/* Komponen 4 — Biaya */}
              <div className={`${styles.komponenCard} ${styles.komponenCardSmall} ${styles.komponenCardAccent}`}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>Biaya / Tarif</span>
                </div>
                <p className={styles.komponenValueBig}>{activeLayanan.biaya}</p>
              </div>

              {/* Komponen 5 — Produk */}
              <div className={`${styles.komponenCard} ${styles.komponenCardSmall}`}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Produk Layanan</span>
                </div>
                <p className={styles.komponenValue}>{activeLayanan.produk}</p>
              </div>

              {/* Komponen 6 — Pengaduan */}
              <div className={`${styles.komponenCard} ${styles.komponenCardSmall}`}>
                <div className={styles.komponenHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Pengaduan</span>
                </div>
                <p className={styles.komponenValue}>{activeLayanan.pengaduan}</p>
              </div>
            </div>

            {/* Jadwal + Aksi */}
            <div className={styles.modalMeta}>
              <div className={styles.modalMetaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span>Jadwal Layanan</span>
                  <strong>{activeLayanan.jadwal}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <a
                href="#pengaduan"
                className={styles.modalBtnSecondary}
                onClick={() => setActiveModal(null)}
              >
                Butuh Bantuan?
              </a>
              <button className={styles.modalBtnPrimary} onClick={() => setActiveModal(null)}>
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT LIGHTBOX */}
      {activeDoc && (
        <div
          className={styles.docLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeDoc.judul}
          onClick={() => setActiveDoc(null)}
        >
          <div className={styles.docLightboxInner} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.docLightboxClose}
              onClick={() => setActiveDoc(null)}
              aria-label="Tutup tampilan dokumen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <p className={styles.docLightboxCaption}>{activeDoc.judul}</p>
            <div className={styles.docLightboxImgWrap}>
              <Image
                src={activeDoc.src}
                alt={activeDoc.alt}
                fill
                sizes="(max-width: 768px) 95vw, 800px"
                className={styles.docLightboxImg}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
