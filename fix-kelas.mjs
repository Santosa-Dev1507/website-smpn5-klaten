import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixKelas() {
  console.log("Checking if 7G, 7H, 8G, 8H exist...");
  
  const kelasToAdd = [
    { nama_kelas: '7G', tingkat: 7, tahun_ajaran: '2025/2026' },
    { nama_kelas: '7H', tingkat: 7, tahun_ajaran: '2025/2026' },
    { nama_kelas: '8G', tingkat: 8, tahun_ajaran: '2025/2026' },
    { nama_kelas: '8H', tingkat: 8, tahun_ajaran: '2025/2026' }
  ];

  for (const k of kelasToAdd) {
    let { data: existing } = await supabase.from('kelas').select('id').eq('nama_kelas', k.nama_kelas).maybeSingle();
    if (!existing) {
      const { data: inserted, error } = await supabase.from('kelas').insert(k).select('id').single();
      if (error) {
        console.error("Error inserting", k.nama_kelas, error);
      } else {
        console.log("Inserted", k.nama_kelas, inserted.id);
        k.id = inserted.id;
      }
    } else {
      console.log(k.nama_kelas, "already exists", existing.id);
      k.id = existing.id;
    }
  }

  // Reload the IDs
  const { data: allKelas } = await supabase.from('kelas').select('*');
  const classMap = {};
  allKelas.forEach(k => classMap[k.nama_kelas] = k.id);

  console.log("Fetching Tanpa Kelas students...");
  const { data: users, error } = await supabase.from('users').select('id, nis_nip, nama_lengkap').eq('role', 'siswa').is('kelas_id', null).order('nis_nip');
  
  if (error) {
    console.error(error);
    return;
  }

  console.log("Found", users.length, "unassigned students.");

  for (const u of users) {
    const nis = parseInt(u.nis_nip);
    let targetClassName = null;
    if (nis >= 10133 && nis <= 10164) {
      targetClassName = '8G';
    } else if (nis >= 10165 && nis <= 10196) {
      targetClassName = '8H';
    } else if (nis >= 10391 && nis <= 10422) {
      targetClassName = '7G';
    } else if (nis >= 10423 && nis <= 10454) {
      targetClassName = '7H';
    }
    
    if (targetClassName && classMap[targetClassName]) {
      const { error: updateErr } = await supabase.from('users').update({ kelas_id: classMap[targetClassName] }).eq('id', u.id);
      if (updateErr) {
        console.error("Error updating", u.nama_lengkap, updateErr);
      } else {
        console.log("Updated", u.nama_lengkap, "to", targetClassName);
      }
    } else {
      console.log("Could not determine class for", u.nis_nip, u.nama_lengkap);
    }
  }
  
  console.log("Done.");
}

fixKelas();
