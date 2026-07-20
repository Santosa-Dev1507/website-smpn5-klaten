-- ============================================================
-- SEED DATA: SIM Ekstrakurikuler SMPN 5 Klaten
-- Jalankan SETELAH schema.sql
-- ============================================================

-- Catatan: Ekskul HANYA untuk kelas 7 dan 8. Kelas 9 TIDAK dimasukkan.
INSERT INTO kelas (nama_kelas, tingkat, tahun_ajaran) VALUES
  ('7A', 7, '2025/2026'), ('7B', 7, '2025/2026'), ('7C', 7, '2025/2026'),
  ('7D', 7, '2025/2026'), ('7E', 7, '2025/2026'), ('7F', 7, '2025/2026'),
  ('8A', 8, '2025/2026'), ('8B', 8, '2025/2026'), ('8C', 8, '2025/2026'),
  ('8D', 8, '2025/2026'), ('8E', 8, '2025/2026'), ('8F', 8, '2025/2026');

-- ── Ekskul (data statis dari sistem lama) ──────────────────
-- CATATAN: pembina_id diisi setelah user guru dibuat di Supabase Auth
INSERT INTO ekskul (kode, nama, kategori, jenis, jadwal, waktu, lokasi, emoji, deskripsi, nama_pelatih) VALUES
  ('pramuka',      'Pramuka',             'Kepanduan',    'wajib',   'Sabtu',          '07:00–09:00', 'Lapangan Sekolah',  '⚜️', 'Membentuk karakter mandiri, tangguh, dan berjiwa kepemimpinan melalui kegiatan kepramukaan.', NULL),
  ('pmr',          'PMR / UKS',           'Sosial',       'pilihan', 'Kamis',          '15:00–16:30', 'Ruang PMR',         '🏥', 'Melatih keterampilan pertolongan pertama dan menumbuhkan kepedulian sosial.', NULL),
  ('pbb',          'PBB / Tata Upacara',  'Kedisiplinan', 'pilihan', 'Jumat',          '15:00–16:30', 'Lapangan Upacara',  '🎖️', 'Melatih kedisiplinan, ketertiban, dan jiwa korsa melalui baris-berbaris.', NULL),
  ('tbq',          'TBQ',                 'Keagamaan',    'pilihan', 'Rabu',           '15:00–16:00', 'Masjid Sekolah',    '📖', 'Membangun kemampuan membaca Al-Qur''an dengan tartil dan benar.', 'Muhammad Rosyid, S.Sos.I'),
  ('osn-mat',      'OSN Matematika',      'Akademik',     'pilihan', 'Selasa',         '14:30–16:00', 'Ruang Kelas',       '📐', 'Persiapan olimpiade sains nasional bidang matematika.', NULL),
  ('osn-ips',      'OSN IPS',             'Akademik',     'pilihan', 'Senin',          '14:30–16:00', 'Ruang Kelas',       '🌍', 'Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Sosial.', NULL),
  ('osn-ipa',      'OSN IPA',             'Akademik',     'pilihan', 'Kamis',          '14:30–16:00', 'Laboratorium IPA',  '🔬', 'Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Alam.', NULL),
  ('seni-tari',    'Seni Tari',           'Seni',         'pilihan', 'Rabu',           '14:00–15:30', 'Aula Sekolah',      '💃', 'Mengembangkan bakat seni dan kecintaan terhadap budaya Indonesia melalui tari tradisional.', NULL),
  ('paduan-suara', 'Paduan Suara',        'Seni',         'pilihan', 'Jumat',          '14:00–15:30', 'Aula Sekolah',      '🎵', 'Mengembangkan teknik vokal harmonis untuk kompetisi dan penampilan sekolah.', NULL),
  ('futsal',       'Futsal',              'Olahraga',     'pilihan', 'Selasa & Kamis', '15:30–17:00', 'Lapangan Futsal',   '⚽', 'Melatih teknik dan strategi futsal serta mempersiapkan tim untuk kompetisi.', NULL),
  ('jiu-jitsu',   'Jiu Jitsu',           'Olahraga',     'pilihan', 'Sabtu',          '08:00–10:00', 'Lapangan Sekolah',  '🥋', 'Olahraga bela diri yang melatih disiplin, ketangkasan, dan mental juara.', NULL);

-- ── CATATAN SETUP MANUAL DI SUPABASE AUTH ──────────────────
-- 1. Buat akun admin di Supabase Authentication > Users > Invite
--    Email: admin@smpn5klaten.sch.id  Password: (set kuat)
-- 2. Setelah dibuat, insert ke tabel users:
--    INSERT INTO users (id, nis_nip, nama_lengkap, role)
--    VALUES ('[uuid dari auth]', 'ADMIN001', 'Administrator', 'admin');
--
-- 3. Untuk pembina, buat akun dengan email format: [NIP]@smpn5klaten.sch.id
--    Lalu UPDATE ekskul SET pembina_id = '[uuid]' WHERE kode = 'tbq';
--
-- 4. Import siswa secara massal bisa pakai fungsi admin di halaman /admin
