// app/api/kokurikuler/penilaian/route.ts
// CRUD penilaian kokurikuler — tersimpan di Supabase
// POST: simpan penilaian (single record atau batch array per kelas)
// GET:  ambil semua penilaian untuk ekspor/rekap (perlu auth)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validasi session dari header Authorization: Bearer <token>
async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Dukungan untuk batch insert / upsert (array of records per kelas)
    if (Array.isArray(body)) {
      const recordsToInsert = body.map(item => ({
        nama_siswa:     item.nama_siswa,
        kelas:          item.kelas,
        kelompok:       item.kelompok ?? null,
        dimensi:        item.dimensi,
        predikat:       item.predikat,
        catatan:        item.catatan ?? null,
        dinilai_oleh:   item.dinilai_oleh,
        jenis_asesmen:  item.jenis_asesmen ?? 'Sumatif',
        tahun_kegiatan: item.tahun_kegiatan ?? '2026/2027',
        nama_kegiatan:  item.nama_kegiatan ?? 'Kokurikuler Kelas VIII — Destinasi Semarang',
        created_by:     user.id,
      }));

      const { data, error } = await supabaseAdmin
        .from('kokurikuler_penilaian')
        .upsert(recordsToInsert, { onConflict: 'nama_siswa,kelas,dimensi' })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, count: data?.length ?? 0, data });
    }

    // Single record insert
    const requiredFields = ['nama_siswa', 'kelas', 'dimensi', 'predikat', 'dinilai_oleh', 'jenis_asesmen'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from('kokurikuler_penilaian')
      .insert({
        nama_siswa:     body.nama_siswa,
        kelas:          body.kelas,
        kelompok:       body.kelompok ?? null,
        dimensi:        body.dimensi,
        predikat:       body.predikat,
        catatan:        body.catatan ?? null,
        dinilai_oleh:   body.dinilai_oleh,
        jenis_asesmen:  body.jenis_asesmen,
        tahun_kegiatan: body.tahun_kegiatan ?? '2026/2027',
        nama_kegiatan:  body.nama_kegiatan ?? 'Kokurikuler Kelas VIII — Destinasi Semarang',
        created_by:     user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tahun = req.nextUrl.searchParams.get('tahun');
  const kelas = req.nextUrl.searchParams.get('kelas');

  let query = supabaseAdmin
    .from('kokurikuler_penilaian')
    .select('*')
    .order('kelas', { ascending: true })
    .order('nama_siswa', { ascending: true });

  if (tahun) query = query.eq('tahun_kegiatan', tahun);
  if (kelas) query = query.eq('kelas', kelas);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count: data?.length ?? 0 });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  const kelas = req.nextUrl.searchParams.get('kelas');

  if (id) {
    const { error } = await supabaseAdmin
      .from('kokurikuler_penilaian')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (kelas) {
    const { error } = await supabaseAdmin
      .from('kokurikuler_penilaian')
      .delete()
      .eq('kelas', kelas)
      .eq('created_by', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Parameter "id" atau "kelas" diperlukan' }, { status: 400 });
}
