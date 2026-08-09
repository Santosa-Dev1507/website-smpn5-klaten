-- ═══════════════════════════════════════════════════════════════════
-- Tabel kokurikuler_penilaian
-- Digunakan oleh Portal Penilaian Guru di /kokurikuler/portal
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS kokurikuler_penilaian (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_siswa      text        NOT NULL,
  kelas           text        NOT NULL,
  kelompok        text,
  dimensi         text        NOT NULL,     -- 'Penalaran Kritis' | 'Kolaborasi' | 'Komunikasi/Kreativitas'
  predikat        text        NOT NULL,     -- 'SB' | 'B' | 'C' | 'K'
  catatan         text,
  dinilai_oleh    text        NOT NULL,     -- nama guru mapel yang menilai
  jenis_asesmen   text        NOT NULL DEFAULT 'Sumatif',  -- 'Formatif' | 'Sumatif'
  tahun_kegiatan  text,                    -- e.g. '2026/2027'
  nama_kegiatan   text,                    -- e.g. 'Kokurikuler Kelas VIII — Destinasi Semarang'
  created_at      timestamptz DEFAULT now(),
  created_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index untuk query umum
CREATE INDEX IF NOT EXISTS idx_kokurikuler_penilaian_kelas     ON kokurikuler_penilaian(kelas);
CREATE INDEX IF NOT EXISTS idx_kokurikuler_penilaian_kelompok  ON kokurikuler_penilaian(kelompok);
CREATE INDEX IF NOT EXISTS idx_kokurikuler_penilaian_tahun     ON kokurikuler_penilaian(tahun_kegiatan);

-- ── Row Level Security ──────────────────────────────────────────────
ALTER TABLE kokurikuler_penilaian ENABLE ROW LEVEL SECURITY;

-- Hanya user yang terautentikasi (guru/panitia) bisa INSERT
CREATE POLICY "guru_dapat_insert" ON kokurikuler_penilaian
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Hanya user yang terautentikasi bisa SELECT
CREATE POLICY "guru_dapat_baca" ON kokurikuler_penilaian
  FOR SELECT
  TO authenticated
  USING (true);

-- User hanya bisa UPDATE/DELETE record miliknya sendiri
CREATE POLICY "guru_dapat_update_milik_sendiri" ON kokurikuler_penilaian
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "guru_dapat_delete_milik_sendiri" ON kokurikuler_penilaian
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ── Constraint validasi ────────────────────────────────────────────
ALTER TABLE kokurikuler_penilaian
  ADD CONSTRAINT chk_predikat    CHECK (predikat IN ('SB', 'B', 'C', 'K')),
  ADD CONSTRAINT chk_dimensi     CHECK (dimensi IN ('Penalaran Kritis', 'Kolaborasi', 'Komunikasi/Kreativitas')),
  ADD CONSTRAINT chk_asesmen     CHECK (jenis_asesmen IN ('Formatif', 'Sumatif'));
