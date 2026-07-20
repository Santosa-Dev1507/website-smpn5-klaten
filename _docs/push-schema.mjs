// Script: Push schema ke Supabase via Management API
// Usage: node _docs/push-schema.mjs

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL  = process.env.SUPABASE_URL || "";
const SERVICE_KEY   = process.env.SUPABASE_SECRET_KEY || "";
const PROJECT_ID    = process.env.SUPABASE_PROJECT_ID || "";

const schemaFile = join(__dirname, "supabase_schema.sql");
const seedFile   = join(__dirname, "supabase_seed.sql");

async function execQuery(sql, label) {
  console.log(`\n🔄 ${label}...`);
  
  // Coba Supabase DB Query API
  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "apikey": SERVICE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (res.ok) {
    const data = await res.json().catch(() => ({}));
    console.log(`  ✅ ${label} selesai.`, JSON.stringify(data).slice(0, 100));
    return true;
  }

  const errText = await res.text();
  console.log(`  ⚠️  Status ${res.status}:`, errText.slice(0, 200));
  return false;
}

async function execViaPgRest(sql, label) {
  console.log(`\n🔄 ${label}...`);
  
  // Gunakan PostgREST rpc endpoint dengan superuser
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "apikey": SERVICE_KEY,
      "Prefer": "params=single-object",
    },
    body: JSON.stringify({ query: sql }),
  });
  
  const text = await res.text();
  console.log(`  Status ${res.status}:`, text.slice(0, 200));
  return res.ok;
}

// Split SQL ke statements individual, filter empty
function splitSQL(sql) {
  return sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));
}

async function main() {
  console.log("🚀 Push Schema ke Supabase");
  console.log("📌 Project ID:", PROJECT_ID);
  
  const schemaSql = readFileSync(schemaFile, "utf-8");
  const seedSql   = readFileSync(seedFile, "utf-8");
  
  // Coba via Supabase Admin REST API (SQL execution)
  const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: "SELECT version();" }),
  });
  
  console.log("\n📡 Test Management API:", mgmtRes.status);
  const mgmtText = await mgmtRes.text();
  console.log("   Response:", mgmtText.slice(0, 300));

  if (mgmtRes.ok) {
    console.log("\n✅ Management API tersedia! Menjalankan schema...");
    
    // Jalankan schema
    const schemaRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: schemaSql }),
    });
    
    const schemaText = await schemaRes.text();
    if (schemaRes.ok) {
      console.log("✅ Schema berhasil dibuat!");
    } else {
      console.log("❌ Schema error:", schemaText.slice(0, 500));
    }
    
    // Jalankan seed
    const seedRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: seedSql }),
    });
    
    const seedText = await seedRes.text();
    if (seedRes.ok) {
      console.log("✅ Seed data berhasil dimasukkan!");
    } else {
      console.log("❌ Seed error:", seedText.slice(0, 500));
    }
  } else {
    console.log("\n❌ Management API tidak bisa diakses dengan key ini.");
    console.log("   Keys yang diberikan mungkin adalah publishable/secret untuk SDK,");
    console.log("   bukan Management API key (yang ada di dashboard.supabase.com).");
    console.log("\n📋 SOLUSI MANUAL:");
    console.log("   1. Buka: https://supabase.com/dashboard/project/hewaufnkbrhxxrwddiei/sql/new");
    console.log("   2. Salin isi file: _docs/supabase_schema.sql → klik Run");
    console.log("   3. Salin isi file: _docs/supabase_seed.sql → klik Run");
    console.log("   4. Buat bucket storage 'ekskul-foto' (Public) di tab Storage");
  }
}

main().catch(console.error);
