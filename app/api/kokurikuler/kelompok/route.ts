// app/api/kokurikuler/kelompok/route.ts
// CRUD kelompok kokurikuler — diisi mandiri oleh siswa (tanpa auth)
// POST: buat kelompok baru → kembalikan kode_kelompok
// GET:  ambil data kelompok by kode
// PUT:  update kelompok (hanya dalam window pendaftaran)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Konstanta ────────────────────────────────────────────────────────
const TAHUN_KEGIATAN = '2026/2027';
const REGISTRATION_OPEN  = new Date('2026-09-27T00:00:00+07:00');
const REGISTRATION_CLOSE = new Date('2026-09-30T23:59:59+07:00');

const PERAN_LIST = [
  'Koordinator Kelompok',
  'Juru Foto/Dokumentasi',
  'Pencatat',
  'Juru Wawancara',
  'Anggota',
] as const;

const KELAS_LIST = ['VIII A','VIII B','VIII C','VIII D','VIII E','VIII F','VIII G','VIII H'];

// ── Helper: cek window waktu ─────────────────────────────────────────
function isRegistrationOpen(): boolean {
  const now = new Date();
  return now >= REGISTRATION_OPEN && now <= REGISTRATION_CLOSE;
}

// ── Helper: validasi payload ─────────────────────────────────────────
function validatePayload(body: Record<string, unknown>): string | null {
  if (!body.nama_kelompok || typeof body.nama_kelompok !== 'string' || !body.nama_kelompok.trim()) {
    return 'Nama kelompok wajib diisi.';
  }
  if (!body.kelas || !KELAS_LIST.includes(body.kelas as string)) {
    return 'Kelas tidak valid. Pilih salah satu dari VIII A – VIII H.';
  }
  const anggota = body.anggota as unknown[];
  if (!Array.isArray(anggota) || anggota.length < 5 || anggota.length > 6) {
    return 'Kelompok harus terdiri dari 5–6 anggota.';
  }
  for (let i = 0; i < anggota.length; i++) {
    const a = anggota[i] as Record<string, unknown>;
    if (!a.nama || typeof a.nama !== 'string' || !a.nama.trim()) {
      return `Nama anggota ke-${i + 1} wajib diisi.`;
    }
    if (!a.peran || !PERAN_LIST.includes(a.peran as typeof PERAN_LIST[number])) {
      return `Peran anggota ke-${i + 1} tidak valid.`;
    }
  }
  return null;
}

// ── GET: ambil kelompok by ?kode=KOK-XXXXXX ─────────────────────────
export async function GET(req: NextRequest) {
  const kode = req.nextUrl.searchParams.get('kode');
  if (!kode) {
    return NextResponse.json({ error: 'Parameter "kode" diperlukan.' }, { status: 400 });
  }

  const { data: kelompok, error } = await supabaseAdmin
    .from('kelompok_kokurikuler')
    .select('*, anggota_kelompok(*)')
    .eq('kode_kelompok', kode.toUpperCase())
    .single();

  if (error || !kelompok) {
    return NextResponse.json({ error: 'Kelompok tidak ditemukan.' }, { status: 404 });
  }

  // Urutkan anggota
  if (Array.isArray(kelompok.anggota_kelompok)) {
    kelompok.anggota_kelompok.sort(
      (a: Record<string, number>, b: Record<string, number>) => a.urutan - b.urutan
    );
  }

  return NextResponse.json({
    data: kelompok,
    isEditable: isRegistrationOpen(),
  });
}

// ── POST: buat kelompok baru ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json(
      { error: 'Pendaftaran kelompok sudah ditutup. Periode pendaftaran: 27–30 September 2026.' },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid.' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Generate kode berurut berdasarkan kelas (misal: "VIII A" -> "VIIIA-01")
  const classCode = (body.kelas as string).replace(/\s+/g, '').toUpperCase();
  
  // Cari tebakan awal nomor (hitung jumlah kelompok di kelas ini)
  const { count } = await supabaseAdmin
    .from('kelompok_kokurikuler')
    .select('*', { count: 'exact', head: true })
    .eq('kelas', body.kelas as string);
    
  let groupNum = (count || 0) + 1;
  let kode = "";
  let kelompok = null;
  let errKelompok = null;

  // Coba insert dengan retry hingga 10 kali untuk menghindari duplikat (race condition)
  for (let attempt = 0; attempt < 10; attempt++) {
    kode = `${classCode}-${groupNum.toString().padStart(2, '0')}`;
    
    const { data, error } = await supabaseAdmin
      .from('kelompok_kokurikuler')
      .insert({
        kode_kelompok:  kode,
        nama_kelompok:  (body.nama_kelompok as string).trim(),
        kelas:          body.kelas,
        sub_tema:       body.sub_tema ? (body.sub_tema as string).trim() : null,
        guru_pembimbing: body.guru_pembimbing ? (body.guru_pembimbing as string).trim() : null,
        tahun_kegiatan: TAHUN_KEGIATAN,
      })
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') { // 23505: Unique Violation di PostgreSQL
        groupNum++;
        continue;
      } else {
        errKelompok = error;
        break; // Error lain, hentikan
      }
    } else {
      kelompok = data;
      errKelompok = null;
      break; // Sukses
    }
  }

  if (errKelompok || !kelompok) {
    return NextResponse.json({ error: errKelompok?.message ?? 'Gagal menyimpan kelompok. Coba lagi.' }, { status: 500 });
  }

  // Insert anggota
  const anggota = body.anggota as Array<{ nama: string; nis?: string; peran: string }>;
  const anggotaRows = anggota.map((a, idx) => ({
    kelompok_id: kelompok.id,
    urutan: idx + 1,
    nama: a.nama.trim(),
    nis: a.nis?.trim() || null,
    peran: a.peran,
  }));

  const { error: errAnggota } = await supabaseAdmin
    .from('anggota_kelompok')
    .insert(anggotaRows);

  if (errAnggota) {
    // Rollback kelompok
    await supabaseAdmin.from('kelompok_kokurikuler').delete().eq('id', kelompok.id);
    return NextResponse.json({ error: errAnggota.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, kode_kelompok: kode }, { status: 201 });
}

// ── PUT: update kelompok (dalam window waktu) ────────────────────────
export async function PUT(req: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json(
      { error: 'Periode edit sudah ditutup (27–30 September 2026).' },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid.' }, { status: 400 });
  }

  const kode = body.kode_kelompok as string;
  if (!kode) {
    return NextResponse.json({ error: 'Kode kelompok diperlukan untuk edit.' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Cari kelompok
  const { data: existing, error: errFind } = await supabaseAdmin
    .from('kelompok_kokurikuler')
    .select('id')
    .eq('kode_kelompok', kode.toUpperCase())
    .single();

  if (errFind || !existing) {
    return NextResponse.json({ error: 'Kelompok tidak ditemukan.' }, { status: 404 });
  }

  const kelompokId = existing.id;

  // Update header kelompok
  const { error: errUpdate } = await supabaseAdmin
    .from('kelompok_kokurikuler')
    .update({
      nama_kelompok:   (body.nama_kelompok as string).trim(),
      kelas:           body.kelas,
      sub_tema:        body.sub_tema ? (body.sub_tema as string).trim() : null,
      guru_pembimbing: body.guru_pembimbing ? (body.guru_pembimbing as string).trim() : null,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', kelompokId);

  if (errUpdate) {
    return NextResponse.json({ error: errUpdate.message }, { status: 500 });
  }

  // Hapus anggota lama, insert baru
  await supabaseAdmin.from('anggota_kelompok').delete().eq('kelompok_id', kelompokId);

  const anggota = body.anggota as Array<{ nama: string; nis?: string; peran: string }>;
  const anggotaRows = anggota.map((a, idx) => ({
    kelompok_id: kelompokId,
    urutan: idx + 1,
    nama: a.nama.trim(),
    nis: a.nis?.trim() || null,
    peran: a.peran,
  }));

  const { error: errAnggota } = await supabaseAdmin
    .from('anggota_kelompok')
    .insert(anggotaRows);

  if (errAnggota) {
    return NextResponse.json({ error: errAnggota.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, kode_kelompok: kode.toUpperCase() });
}
