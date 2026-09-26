-- Migration: kelompok_kokurikuler & anggota_kelompok
-- Jalankan di Supabase SQL Editor

-- ── Tabel kelompok ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kelompok_kokurikuler (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_kelompok    text UNIQUE NOT NULL,
  nama_kelompok    text NOT NULL,
  kelas            text NOT NULL CHECK (kelas IN ('VIII A','VIII B','VIII C','VIII D','VIII E','VIII F','VIII G','VIII H')),
  sub_tema         text,
  guru_pembimbing  text,
  tahun_kegiatan   text NOT NULL DEFAULT '2026/2027',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Tabel anggota ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anggota_kelompok (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kelompok_id  uuid NOT NULL REFERENCES kelompok_kokurikuler(id) ON DELETE CASCADE,
  urutan       int  NOT NULL CHECK (urutan BETWEEN 1 AND 6),
  nama         text NOT NULL,
  nis          text,
  peran        text NOT NULL CHECK (peran IN (
    'Koordinator Kelompok',
    'Juru Foto/Dokumentasi',
    'Pencatat',
    'Juru Wawancara',
    'Anggota'
  )),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Indeks ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_kelompok_kode  ON kelompok_kokurikuler (kode_kelompok);
CREATE INDEX IF NOT EXISTS idx_kelompok_kelas ON kelompok_kokurikuler (kelas);
CREATE INDEX IF NOT EXISTS idx_anggota_kelompok_id ON anggota_kelompok (kelompok_id);

-- ── Row Level Security ────────────────────────────────────────────────
ALTER TABLE kelompok_kokurikuler ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggota_kelompok     ENABLE ROW LEVEL SECURITY;

-- SELECT: siapa pun bisa baca (public)
CREATE POLICY "kelompok: public read"
  ON kelompok_kokurikuler FOR SELECT
  USING (true);

CREATE POLICY "anggota: public read"
  ON anggota_kelompok FOR SELECT
  USING (true);

-- INSERT: siapa pun bisa tambah (siswa tanpa auth)
CREATE POLICY "kelompok: public insert"
  ON kelompok_kokurikuler FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anggota: public insert"
  ON anggota_kelompok FOR INSERT
  WITH CHECK (true);

-- UPDATE: siapa pun bisa update (enforcement window waktu ada di API route)
CREATE POLICY "kelompok: public update"
  ON kelompok_kokurikuler FOR UPDATE
  USING (true);

CREATE POLICY "anggota: public update via cascade"
  ON anggota_kelompok FOR UPDATE
  USING (true);

-- DELETE anggota: via API route (service role melewati RLS)
CREATE POLICY "anggota: public delete"
  ON anggota_kelompok FOR DELETE
  USING (true);
