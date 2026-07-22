-- ============================================================
-- MIGRATION: Tambah tabel periode_ekskul
-- Jalankan di: Supabase Dashboard > SQL Editor
-- Tanggal: 2025 (setelah schema awal sudah dijalankan)
-- ============================================================

-- Hapus kolom ekskul_id lama jika ada (dari schema lama)
ALTER TABLE periode_pendaftaran DROP COLUMN IF EXISTS ekskul_id;

-- Buat tabel junction periode_ekskul
-- Kosong = semua ekskul aktif bisa didaftarkan
-- Berisi = hanya ekskul yang terdaftar di sini yang bisa didaftarkan
CREATE TABLE IF NOT EXISTS periode_ekskul (
  periode_id  uuid NOT NULL REFERENCES periode_pendaftaran(id) ON DELETE CASCADE,
  ekskul_id   uuid NOT NULL REFERENCES ekskul(id) ON DELETE CASCADE,
  PRIMARY KEY (periode_id, ekskul_id)
);

-- Enable RLS
ALTER TABLE periode_ekskul ENABLE ROW LEVEL SECURITY;

-- Policy: semua authenticated bisa read
CREATE POLICY "periode_ekskul_read" ON periode_ekskul
  FOR SELECT TO authenticated USING (true);

-- Policy: hanya admin yang bisa insert/delete
CREATE POLICY "periode_ekskul_admin_write" ON periode_ekskul
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
