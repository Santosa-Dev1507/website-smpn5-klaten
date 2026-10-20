export type KategoriOsis = "Calon Ketua" | "Calon Pengurus";
export type JenisKelamin = "L" | "P";

export interface SiswaOsis {
  no: number;
  nama: string;
  kelas: string;
  jenisKelamin: JenisKelamin;
  kategori: KategoriOsis;
}

export const daftarSiswaOsis: SiswaOsis[] = [
  // ── 6 Calon Ketua (Susunan asli dipertahankan) ───────────────
  { no: 1,  nama: "Vania Regina Putri",           kelas: "VIII A", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 2,  nama: "Eillia Zahira Farha Andewsta",  kelas: "VIII B", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 3,  nama: "Muhammad Caesar Umam Prastyo",  kelas: "VIII E", jenisKelamin: "L", kategori: "Calon Ketua" },
  { no: 4,  nama: "Tanaya Nuansa Marenta",          kelas: "VIII B", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 5,  nama: "Olivia Rita Saputri",            kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 6,  nama: "Arkaan Nailufar Putra Daviya",   kelas: "VIII B", jenisKelamin: "L", kategori: "Calon Ketua" },

  // ── 29 Calon Pengurus (Diurutkan Kelas 7A–7H, lalu 8A–8H) ────
  // Kelas VII A
  { no: 7,  nama: "Iffa Astila Rahma",              kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 8,  nama: "Kayla Azra Qaireeen",            kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 9,  nama: "Hasna Aarifah",                  kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VII B
  { no: 10, nama: "Kheisha Atiiqah Shidqia Putri",  kelas: "VII B",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 11, nama: "Ashila Khaira Wilda",            kelas: "VII B",  jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VII C
  { no: 12, nama: "Anisa Citra Mutiara",            kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 13, nama: "Khaliila Nazla Anindya",         kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 14, nama: "Kartika Cinta Putri Azzahra",    kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 15, nama: "Kanaya Nur Abidah",              kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VII D
  { no: 16, nama: "Desta Satria Anggara",           kelas: "VII D",  jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VII F
  { no: 17, nama: "Zuniar Iznaini Putri",           kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 18, nama: "Joana Aisyah Rani",              kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 19, nama: "Aisyah Rahma Putri",             kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 20, nama: "Zyabil Ovi Abiyanto",            kelas: "VII F",  jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VII G
  { no: 21, nama: "Mishelina Riska Pamela",         kelas: "VII G",  jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VII H
  { no: 22, nama: "Nadia Faizan Ramadhani",         kelas: "VII H",  jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VIII A
  { no: 23, nama: "Satya Oktavian Saputra",         kelas: "VIII A", jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VIII B
  { no: 24, nama: "Raffa Disya Zura M.",            kelas: "VIII B", jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VIII C
  { no: 25, nama: "Adelia Kanaya Putri Benita",     kelas: "VIII C", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 26, nama: "Prima Surya Dewantara",          kelas: "VIII C", jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VIII E
  { no: 27, nama: "Sofiyah",                        kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 28, nama: "Danendra Aqil Zhafran",          kelas: "VIII E", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 29, nama: "Ambita Nur Hanifah",             kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Pengurus" },

  // Kelas VIII F
  { no: 30, nama: "Naila Alesha Acintua",           kelas: "VIII F", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 31, nama: "Aulia Hajar Jameela",            kelas: "VIII F", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 32, nama: "Brian Galen Putra Purnama",      kelas: "VIII F", jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VIII G
  { no: 33, nama: "Arreza Cahya Saputra",           kelas: "VIII G", jenisKelamin: "L", kategori: "Calon Pengurus" },

  // Kelas VIII H
  { no: 34, nama: "Kynara Suci Auryna",             kelas: "VIII H", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 35, nama: "Adila Nur Asfarina",             kelas: "VIII H", jenisKelamin: "P", kategori: "Calon Pengurus" },
];

export const totalSiswa = daftarSiswaOsis.length; // 35
export const totalCalonKetua = daftarSiswaOsis.filter((s) => s.kategori === "Calon Ketua").length; // 6
export const totalCalonPengurus = daftarSiswaOsis.filter((s) => s.kategori === "Calon Pengurus").length; // 29

/**
 * Ekstraksi 2 inisial huruf dari nama siswa untuk avatar visual (tanpa mengasumsikan nomor urut surat suara).
 */
export function getInitials(nama: string): string {
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
