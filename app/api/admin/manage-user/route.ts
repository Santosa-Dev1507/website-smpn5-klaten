import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-secret";
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nis_nip, nama_lengkap, role, kelas_id, email, password } = body;

    if (!id || !nis_nip || !nama_lengkap || !email) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();

    // 1. Update Auth User (email & password jika ada)
    const updatePayload: any = { email };
    if (password && password.trim() !== "") {
      updatePayload.password = password;
    }
    const { error: authErr } = await adminClient.auth.admin.updateUserById(id, updatePayload);
    
    if (authErr) {
      return NextResponse.json({ success: false, message: authErr.message }, { status: 400 });
    }

    // 2. Update tabel users
    const { error: profileErr } = await adminClient.from("users").update({
      nis_nip,
      nama_lengkap,
      role,
      kelas_id: kelas_id || null,
    }).eq("id", id);

    if (profileErr) {
      return NextResponse.json({ success: false, message: profileErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Pengguna ${nama_lengkap} berhasil diperbarui.` });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID pengguna tidak ditemukan." }, { status: 400 });
    }

    // Delete Auth User (Supabase CASCADE will delete the profile in public.users automatically)
    const { error } = await getSupabaseAdmin().auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
