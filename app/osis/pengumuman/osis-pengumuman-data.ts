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
  // Calon Ketua (6 orang)
  { no: 1,  nama: "Vania Regina Putri",           kelas: "VIII A", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 2,  nama: "Eillia Zahira Farha Andewsta",  kelas: "VIII B", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 3,  nama: "Muhammad Caesar Umam Prastyo",  kelas: "VIII E", jenisKelamin: "L", kategori: "Calon Ketua" },
  { no: 4,  nama: "Tanaya Nuansa Marenta",          kelas: "VIII B", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 5,  nama: "Olivia Rita Saputri",            kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Ketua" },
  { no: 6,  nama: "Arkaan Nailufar Putra Daviya",   kelas: "VIII B", jenisKelamin: "L", kategori: "Calon Ketua" },

  // Calon Pengurus (29 orang)
  { no: 7,  nama: "Zuniar Iznaini Putri",           kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 8,  nama: "Anisa Citra Mutiara",            kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 9,  nama: "Desta Satria Anggara",           kelas: "VII D",  jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 10, nama: "Satya Oktavian Saputra",         kelas: "VIII A", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 11, nama: "Khaliila Nazla Anindya",         kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 12, nama: "Kartika Cinta Putri Azzahra",    kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 13, nama: "Naila Alesha Acintua",           kelas: "VIII F", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 14, nama: "Joana Aisyah Rani",              kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 15, nama: "Sofiyah",                        kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 16, nama: "Iffa Astila Rahma",              kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 17, nama: "Arreza Cahya Saputra",           kelas: "VIII G", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 18, nama: "Aisyah Rahma Putri",             kelas: "VII F",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 19, nama: "Kheisha Atiiqah Shidqia Putri",  kelas: "VII B",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 20, nama: "Adelia Kanaya Putri Benita",     kelas: "VIII C", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 21, nama: "Prima Surya Dewantara",          kelas: "VIII C", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 22, nama: "Mishelina Riska Pamela",         kelas: "VII G",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 23, nama: "Kayla Azra Qaireeen",            kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 24, nama: "Kanaya Nur Abidah",              kelas: "VII C",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 25, nama: "Danendra Aqil Zhafran",          kelas: "VIII E", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 26, nama: "Hasna Aarifah",                  kelas: "VII A",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 27, nama: "Kynara Suci Auryna",             kelas: "VIII H", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 28, nama: "Adila Nur Asfarina",             kelas: "VIII H", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 29, nama: "Nadia Faizan Ramadhani",         kelas: "VII H",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 30, nama: "Ashila Khaira Wilda",            kelas: "VII B",  jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 31, nama: "Raffa Disya Zura M.",            kelas: "VIII B", jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 32, nama: "Ambita Nur Hanifah",             kelas: "VIII E", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 33, nama: "Aulia Hajar Jameela",            kelas: "VIII F", jenisKelamin: "P", kategori: "Calon Pengurus" },
  { no: 34, nama: "Zyabil Ovi Abiyanto",            kelas: "VII F",  jenisKelamin: "L", kategori: "Calon Pengurus" },
  { no: 35, nama: "Brian Galen Putra Purnama",      kelas: "VIII F", jenisKelamin: "L", kategori: "Calon Pengurus" },
];

export const totalSiswa = daftarSiswaOsis.length; // 35
export const totalCalonKetua = daftarSiswaOsis.filter((s) => s.kategori === "Calon Ketua").length; // 6
export const totalCalonPengurus = daftarSiswaOsis.filter((s) => s.kategori === "Calon Pengurus").length; // 29
