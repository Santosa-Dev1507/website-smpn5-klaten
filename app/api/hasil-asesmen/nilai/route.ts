// app/api/hasil-asesmen/nilai/route.ts
// Proxy ke Google Apps Script — ambil hasil asesmen per NIS
// Catatan: gunakan app/api/ (bukan src/app/hasil-asesmen/api/) agar
// sesuai dengan pola routing project ini yang pakai /app

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const nis   = searchParams.get("nis")?.trim();
  const mapel = searchParams.get("mapel")?.toUpperCase() ?? "PAI";
  // ta tidak di-hardcode — jika tidak disertakan, GAS baca dari _CONFIG
  const ta    = searchParams.get("ta") ?? "";

  if (!nis) {
    return Response.json(
      { error: "NIS diperlukan" },
      { status: 400 }
    );
  }

  const GAS_URL = process.env.GAS_HASIL_ASESMEN_URL;
  if (!GAS_URL) {
    return Response.json(
      { error: "Konfigurasi server belum lengkap (GAS_HASIL_ASESMEN_URL)" },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({ nis, mapel });
  if (ta) params.set("ta", ta); // hanya kirim jika ada — biarkan GAS fallback ke _CONFIG

  try {
    const gasRes = await fetch(`${GAS_URL}?${params.toString()}`, {
      redirect: "follow",              // GAS Web App selalu pakai redirect 302
      headers: { Accept: "application/json" },
      cache: "no-store",               // nilai bisa diupdate kapan saja
    });

    if (!gasRes.ok) {
      return Response.json(
        { error: `GAS error: HTTP ${gasRes.status}` },
        { status: 502 }
      );
    }

    const contentType = gasRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const body = await gasRes.text();
      console.error("[hasil-asesmen/nilai] GAS non-JSON:", body.slice(0, 200));
      return Response.json(
        { error: "Respons dari server data tidak valid" },
        { status: 502 }
      );
    }

    const data: unknown = await gasRes.json();
    return Response.json(data);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[hasil-asesmen/nilai] fetch gagal:", msg);
    return Response.json(
      { error: "Tidak dapat terhubung ke server data. Coba lagi." },
      { status: 503 }
    );
  }
}
