-- ============================================================
-- SCHEMA: SIM Ekstrakurikuler SMPN 5 Klaten
-- Jalankan di: Supabase Dashboard > SQL Editor
-- Urutan: jalankan dari atas ke bawah
-- ============================================================

-- ── 0. Extensions ──────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. KELAS ───────────────────────────────────────────────
CREATE TABLE kelas (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_kelas   text NOT NULL,          -- "7A", "8B", "9C"
  tingkat      integer NOT NULL CHECK (tingkat IN (7, 8, 9)),
  tahun_ajaran text NOT NULL,          -- "2025/2026"
  created_at   timestamptz DEFAULT now()
);

-- ── 2. USERS (profil, melengkapi auth.users) ───────────────
CREATE TABLE users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nis_nip       text UNIQUE,           -- NIS siswa / NIP guru
  nama_lengkap  text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin','siswa','pembina','walikelas')),
  kelas_id      uuid REFERENCES kelas(id),  -- siswa: kelasnya; walikelas: kelas yang diampu
  foto_url      text,
  created_at    timestamptz DEFAULT now()
);

-- ── 3. EKSKUL ──────────────────────────────────────────────
CREATE TABLE ekskul (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode               text UNIQUE NOT NULL,  -- "pramuka", "futsal"
  nama               text NOT NULL,
  kategori           text NOT NULL,         -- "Olahraga","Seni","Akademik","Kepanduan","Sosial","Kedisiplinan","Keagamaan"
  jenis              text NOT NULL CHECK (jenis IN ('wajib','pilihan')),
  jadwal             text,                  -- "Sabtu"
  waktu              text,                  -- "07:00–09:00"
  lokasi             text,
  emoji              text DEFAULT '🏆',
  deskripsi          text,
  pembina_id         uuid REFERENCES users(id),
  nama_pelatih       text,                  -- nama pelatih (bisa orang luar)
  kontak_pelatih     text,                  -- HP/email pelatih
  aktif              boolean DEFAULT true,
  created_at         timestamptz DEFAULT now()
);

-- ── 4. PERIODE PENDAFTARAN (dikendalikan Admin) ────────────
CREATE TABLE periode_pendaftaran (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Gunakan tabel periode_ekskul untuk menentukan ekskul yang dibuka
  nama_periode    text NOT NULL,               -- "Pendaftaran Semester 1 2025/2026"
  tanggal_buka    timestamptz NOT NULL,
  tanggal_tutup   timestamptz NOT NULL,
  dibuat_oleh     uuid REFERENCES users(id),
  aktif           boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- ── 4b. EKSKUL YANG DIBUKA PER PERIODE ────────────────────
-- Kosong  = semua ekskul aktif bisa didaftarkan
-- Berisi  = hanya ekskul terdaftar di sini yang bisa didaftarkan
CREATE TABLE periode_ekskul (
  periode_id  uuid NOT NULL REFERENCES periode_pendaftaran(id) ON DELETE CASCADE,
  ekskul_id   uuid NOT NULL REFERENCES ekskul(id) ON DELETE CASCADE,
  PRIMARY KEY (periode_id, ekskul_id)
);

-- ── 5. PENDAFTARAN EKSKUL ──────────────────────────────────
CREATE TABLE pendaftaran (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  siswa_id         uuid NOT NULL REFERENCES users(id),
  ekskul_id        uuid NOT NULL REFERENCES ekskul(id),
  periode_id       uuid REFERENCES periode_pendaftaran(id),
  status           text NOT NULL DEFAULT 'menunggu'
                   CHECK (status IN ('menunggu','disetujui','ditolak')),
  catatan_pembina  text,
  tanggal_daftar   timestamptz DEFAULT now(),
  UNIQUE (siswa_id, ekskul_id, periode_id)
);

-- ── 6. SESI ABSENSI (per pertemuan) ───────────────────────
CREATE TABLE sesi_absensi (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ekskul_id        uuid NOT NULL REFERENCES ekskul(id),
  pembina_id       uuid REFERENCES users(id),
  tanggal          date NOT NULL,
  materi           text,
  pembina_hadir    boolean DEFAULT true,
  pelatih_hadir    boolean DEFAULT false,
  nama_pelatih_sesi text,           -- pelatih yang hadir sesi ini (bisa beda)
  created_at       timestamptz DEFAULT now()
);

-- ── 7. ABSENSI SISWA (per sesi) ───────────────────────────
CREATE TABLE absensi (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_id     uuid NOT NULL REFERENCES sesi_absensi(id) ON DELETE CASCADE,
  siswa_id    uuid NOT NULL REFERENCES users(id),
  ekskul_id   uuid NOT NULL REFERENCES ekskul(id),
  status      text NOT NULL CHECK (status IN ('hadir','izin','alpa')),
  keterangan  text,
  UNIQUE (sesi_id, siswa_id)
);

-- ── 8. PERLOMBAAN ──────────────────────────────────────────
CREATE TABLE perlombaan (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ekskul_id          uuid NOT NULL REFERENCES ekskul(id),
  nama_lomba         text NOT NULL,
  tingkat            text NOT NULL
                     CHECK (tingkat IN ('sekolah','kecamatan','kota','provinsi','nasional','internasional')),
  penyelenggara      text,
  tanggal_mulai      date,
  tanggal_selesai    date,
  lokasi             text,
  nama_pelatih_lomba text,          -- pelatih pendamping di lomba ini
  pembina_id         uuid REFERENCES users(id),
  created_at         timestamptz DEFAULT now()
);

-- ── 9. PESERTA LOMBA ───────────────────────────────────────
CREATE TABLE peserta_lomba (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lomba_id    uuid NOT NULL REFERENCES perlombaan(id) ON DELETE CASCADE,
  siswa_id    uuid NOT NULL REFERENCES users(id),
  hasil       text NOT NULL CHECK (hasil IN ('juara_1','juara_2','juara_3','harapan_1','harapan_2','harapan_3','peserta')),
  keterangan  text,
  UNIQUE (lomba_id, siswa_id)
);

-- ── 10. LAPORAN KEGIATAN ───────────────────────────────────
CREATE TABLE laporan_kegiatan (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ekskul_id             uuid NOT NULL REFERENCES ekskul(id),
  pembina_id            uuid NOT NULL REFERENCES users(id),
  nama_pelatih          text,             -- nama pelatih (free text)
  jenis_laporan         text NOT NULL
                        CHECK (jenis_laporan IN ('daftar_hadir_siswa','jurnal_kegiatan','daftar_hadir_pelatih','bulanan','semester','tahunan','insidental')),
  periode_laporan       text NOT NULL,    -- "April 2026", "Semester 1 2025/2026"
  judul                 text NOT NULL,
  -- Field konten laporan naratif
  isi_laporan           text,
  capaian               text,
  kendala               text,
  rencana_tindak_lanjut text,
  -- Statistik (bisa diisi otomatis dari data absensi)
  jumlah_pertemuan      integer DEFAULT 0,
  rata_kehadiran        numeric(5,2) DEFAULT 0,
  -- Status workflow
  status                text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','terkirim','disetujui')),
  disetujui_oleh        uuid REFERENCES users(id),
  disetujui_at          timestamptz,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ── 11. FOTO KEGIATAN (Supabase Storage) ──────────────────
CREATE TABLE foto_kegiatan (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ekskul_id    uuid NOT NULL REFERENCES ekskul(id),
  sesi_id      uuid REFERENCES sesi_absensi(id),   -- bisa null (foto umum ekskul)
  lomba_id     uuid REFERENCES perlombaan(id),      -- bisa null
  storage_path text NOT NULL,                        -- path di Supabase Storage
  storage_url  text NOT NULL,                        -- URL publik
  keterangan   text,
  uploaded_by  uuid REFERENCES users(id),
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE kelas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ekskul             ENABLE ROW LEVEL SECURITY;
ALTER TABLE periode_pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftaran        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesi_absensi       ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi            ENABLE ROW LEVEL SECURITY;
ALTER TABLE perlombaan         ENABLE ROW LEVEL SECURITY;
ALTER TABLE peserta_lomba      ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_kegiatan   ENABLE ROW LEVEL SECURITY;
ALTER TABLE foto_kegiatan      ENABLE ROW LEVEL SECURITY;

-- Helper function: ambil role user yang sedang login
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: ambil kelas_id user yang sedang login
CREATE OR REPLACE FUNCTION get_my_kelas_id()
RETURNS uuid AS $$
  SELECT kelas_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ── RLS: kelas ─────────────────────────────────────────────
CREATE POLICY "kelas_read_all" ON kelas FOR SELECT USING (true);
CREATE POLICY "kelas_admin_all" ON kelas FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: users ─────────────────────────────────────────────
-- Semua bisa lihat daftar users (untuk dropdown, dll)
CREATE POLICY "users_read_all" ON users FOR SELECT USING (true);
-- User hanya bisa update profilnya sendiri
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (id = auth.uid());
-- Admin bisa semua
CREATE POLICY "users_admin_all" ON users FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: ekskul ────────────────────────────────────────────
CREATE POLICY "ekskul_read_all" ON ekskul FOR SELECT USING (true);
CREATE POLICY "ekskul_pembina_update" ON ekskul FOR UPDATE
  USING (pembina_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "ekskul_admin_all" ON ekskul FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: periode_pendaftaran ───────────────────────────────
CREATE POLICY "periode_read_all" ON periode_pendaftaran FOR SELECT USING (true);
CREATE POLICY "periode_admin_all" ON periode_pendaftaran FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: pendaftaran ───────────────────────────────────────
-- Siswa: lihat & buat pendaftaran milik sendiri
CREATE POLICY "pendaftaran_siswa_own" ON pendaftaran FOR SELECT
  USING (siswa_id = auth.uid());
CREATE POLICY "pendaftaran_siswa_insert" ON pendaftaran FOR INSERT
  WITH CHECK (siswa_id = auth.uid());
-- Pembina: lihat pendaftaran di ekskulnya
CREATE POLICY "pendaftaran_pembina_read" ON pendaftaran FOR SELECT
  USING (ekskul_id IN (SELECT id FROM ekskul WHERE pembina_id = auth.uid()));
CREATE POLICY "pendaftaran_pembina_update" ON pendaftaran FOR UPDATE
  USING (ekskul_id IN (SELECT id FROM ekskul WHERE pembina_id = auth.uid()));
-- Walikelas: lihat pendaftaran siswa di kelasnya
CREATE POLICY "pendaftaran_walikelas_read" ON pendaftaran FOR SELECT
  USING (siswa_id IN (SELECT id FROM users WHERE kelas_id = get_my_kelas_id())
         AND get_my_role() = 'walikelas');
-- Admin: semua
CREATE POLICY "pendaftaran_admin_all" ON pendaftaran FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: sesi_absensi ──────────────────────────────────────
CREATE POLICY "sesi_read_pembina" ON sesi_absensi FOR SELECT
  USING (pembina_id = auth.uid() OR get_my_role() IN ('admin','walikelas'));
CREATE POLICY "sesi_insert_pembina" ON sesi_absensi FOR INSERT
  WITH CHECK (pembina_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "sesi_update_pembina" ON sesi_absensi FOR UPDATE
  USING (pembina_id = auth.uid() OR get_my_role() = 'admin');

-- ── RLS: absensi ───────────────────────────────────────────
-- Siswa: lihat absensi diri sendiri
CREATE POLICY "absensi_siswa_own" ON absensi FOR SELECT USING (siswa_id = auth.uid());
-- Pembina: lihat & kelola absensi di ekskulnya
CREATE POLICY "absensi_pembina_all" ON absensi FOR ALL
  USING (ekskul_id IN (SELECT id FROM ekskul WHERE pembina_id = auth.uid()));
-- Walikelas: lihat absensi siswa di kelasnya
CREATE POLICY "absensi_walikelas_read" ON absensi FOR SELECT
  USING (siswa_id IN (SELECT id FROM users WHERE kelas_id = get_my_kelas_id())
         AND get_my_role() = 'walikelas');
-- Admin: semua
CREATE POLICY "absensi_admin_all" ON absensi FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: perlombaan ────────────────────────────────────────
CREATE POLICY "lomba_read_all" ON perlombaan FOR SELECT USING (true);
CREATE POLICY "lomba_pembina_manage" ON perlombaan FOR ALL
  USING (pembina_id = auth.uid() OR get_my_role() = 'admin');

-- ── RLS: peserta_lomba ─────────────────────────────────────
CREATE POLICY "peserta_read_all" ON peserta_lomba FOR SELECT USING (true);
CREATE POLICY "peserta_pembina_manage" ON peserta_lomba FOR ALL
  USING (lomba_id IN (SELECT id FROM perlombaan WHERE pembina_id = auth.uid())
         OR get_my_role() = 'admin');

-- ── RLS: laporan_kegiatan ──────────────────────────────────
CREATE POLICY "laporan_pembina_own" ON laporan_kegiatan FOR ALL
  USING (pembina_id = auth.uid());
CREATE POLICY "laporan_admin_all" ON laporan_kegiatan FOR ALL USING (get_my_role() = 'admin');

-- ── RLS: foto_kegiatan ─────────────────────────────────────
CREATE POLICY "foto_read_all" ON foto_kegiatan FOR SELECT USING (true);
CREATE POLICY "foto_pembina_manage" ON foto_kegiatan FOR ALL
  USING (uploaded_by = auth.uid() OR get_my_role() = 'admin');

-- ============================================================
-- STORAGE BUCKET (jalankan di Supabase Dashboard > Storage)
-- atau via SQL:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('ekskul-foto', 'ekskul-foto', true);

-- ============================================================
-- TRIGGER: update updated_at otomatis
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER laporan_updated_at
  BEFORE UPDATE ON laporan_kegiatan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
