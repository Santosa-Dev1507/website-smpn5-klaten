// Script: jalankan SQL schema ke Supabase via service role
// Usage: node _docs/run-schema.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY  = process.env.SUPABASE_SECRET_KEY || "";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Baca schema SQL
const schemaPath = join(__dirname, "supabase_schema.sql");
const schemaSql  = readFileSync(schemaPath, "utf-8");

// Baca seed SQL
const seedPath = join(__dirname, "supabase_seed.sql");
const seedSql  = readFileSync(seedPath, "utf-8");

// Pisahkan statement berdasarkan ; (perlu untuk exec satu per satu)
async function execSQL(label, sql) {
  console.log(`\n🔄 Menjalankan: ${label}...`);
  const { data, error } = await supabase.rpc("exec_sql", { sql });
  if (error) {
    // Jika rpc exec_sql tidak ada, coba via raw query
    console.log("  ↳ RPC exec_sql tidak tersedia, coba via fetch...");
    return false;
  }
  console.log(`  ✅ Selesai.`);
  return true;
}

// Gunakan Supabase Management API untuk exec SQL
async function runViaMgmtAPI(sql) {
  const projectId = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
  if (!projectId) throw new Error("Gagal parse project ID");

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("❌ Error:", res.status, text.slice(0, 500));
    return false;
  }
  console.log("✅ Response:", text.slice(0, 200));
  return true;
}

// Jalankan via direct pg connection (via Supabase REST + service role)
// Trik: Supabase memungkinkan exec SQL statement via POST ke /rest/v1/rpc/<fn>
// Kita gunakan fungsi pg yang built-in: exec via postgres wrappers

async function main() {
  console.log("🚀 SIM Ekskul SMPN 5 Klaten — Supabase Setup");
  console.log("📌 Project:", SUPABASE_URL);

  // Test koneksi
  const { data: test, error: testErr } = await supabase.from("users").select("count").limit(1);
  
  if (testErr && testErr.code === "42P01") {
    console.log("\n📋 Tabel belum ada — perlu jalankan schema.");
    console.log("\n⚠️  Script ini tidak bisa run DDL langsung via REST API.");
    console.log("   Silakan jalankan manual di Supabase Dashboard > SQL Editor:");
    console.log(`   File: ${schemaPath}`);
    console.log(`   File: ${seedPath}`);
  } else if (testErr) {
    console.log("⚠️  Koneksi error:", testErr.message);
    console.log("   Periksa SUPABASE_URL dan SERVICE_KEY.");
  } else {
    console.log("\n✅ Koneksi berhasil! Tabel 'users' sudah ada.");
    console.log("   Database sudah siap digunakan.");
    
    // Cek tabel lainnya
    const tables = ["kelas", "ekskul", "pendaftaran", "sesi_absensi", "absensi", "perlombaan", "laporan_kegiatan"];
    for (const t of tables) {
      const { error: e } = await supabase.from(t).select("count").limit(1);
      const status = e ? `❌ ${e.code}` : "✅";
      console.log(`   ${status} Tabel: ${t}`);
    }
  }
}

main().catch(console.error);
