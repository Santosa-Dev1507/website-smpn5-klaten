// app/api/admin/create-user/route.ts
// API route untuk admin membuat user baru via service role key
// Hanya bisa diakses jika caller adalah user dengan role 'admin'

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-secret";
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nis_nip, nama_lengkap, role, kelas_id, email, password } = body;

    if (!nis_nip || !nama_lengkap || !email || !password) {
      return NextResponse.json({ success: false, message: "Field tidak lengkap." }, { status: 400 });
    }

    // 1. Buat auth user
    const { data: authData, error: authErr } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true, // langsung confirm, tidak perlu email verifikasi
    });

    if (authErr) {
      return NextResponse.json({ success: false, message: authErr.message }, { status: 400 });
    }

    // 2. Insert ke tabel users (profil)
    const { error: profileErr } = await getSupabaseAdmin().from("users").insert({
      id: authData.user.id,
      nis_nip,
      nama_lengkap,
      role,
      kelas_id: kelas_id || null,
    });

    if (profileErr) {
      // Rollback: hapus auth user jika profil gagal
      await getSupabaseAdmin().auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ success: false, message: profileErr.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Pengguna ${nama_lengkap} berhasil dibuat.`,
      user_id: authData.user.id,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
