const db = require('./config');
const bcrypt = require('bcrypt');

db.pragma("foreign_keys = ON");

// Fungsi untuk hash password
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Fungsi untuk seed data
async function seedDatabase() {
    try {
        console.log('🌱 Memulai seeding database...');
        
        // ===== CLEAR EXISTING DATA =====
        console.log('\n🧹 Menghapus data lama...');
        db.prepare('DELETE FROM mahasiswa').run();
        db.prepare('DELETE FROM dosen').run();
        db.prepare('DELETE FROM pengguna').run();
        db.prepare('DELETE FROM kelas_bimbingan').run();
        db.prepare('DELETE FROM bimbingan_kelas').run();
        db.prepare('DELETE FROM notifikasi').run();

        // Admin
        const adminIds = [];
        for (let i = 1; i <= 2; i++) {
            const email = `admin${i}@ibbi.com`;
            const result = db.prepare(`
                INSERT INTO pengguna (nama, email, password, peran)
                VALUES (?, ?, ?, ?)
            `).run(
                `Admin ${i}`,
                email,
                bcrypt.hashSync(email, 10),
                'admin'
            );
            adminIds.push(result.lastInsertRowid);
        }

        // Dosen
        const dosenIds = [];
        const dosenDataList = [];
        const dosenList = [
            { nama: 'Dr. Budi Santoso', nidn: '1234567890' },
            { nama: 'Prof. Siti Nurhaliza', nidn: '1234567891' },
            { nama: 'Dr. Ahmad Wijaya', nidn: '1234567892' },
            { nama: 'Ir. Dewi Lestari', nidn: '1234567893' },
            { nama: 'Dr. Rudi Hartono', nidn: '1234567894' },
            { nama: 'Prof. Eko Priyanto', nidn: '1234567895' },
            { nama: 'Dr. Wahyu Kusuma', nidn: '1234567896' },
            { nama: 'Ir. Bambang Sutrisno', nidn: '1234567897' },
            { nama: 'Dr. Heri Kurniawan', nidn: '1234567898' },
            { nama: 'Prof. Tri Sulistiyono', nidn: '1234567899' }
        ];

        for (const dosen of dosenList) {
            const email = dosen.nama.toLowerCase().replace(/\s+/g, '.') + '@ibbi.com';
            const result = db.prepare(`
                INSERT INTO pengguna (nama, email, password, peran)
                VALUES (?, ?, ?, ?)
            `).run(
                dosen.nama,
                email,
                bcrypt.hashSync(email,10),
                'dosen'
            );
            dosenIds.push(result.lastInsertRowid);
            dosenDataList.push({ penggunaId: result.lastInsertRowid, ...dosen });
        }

        // Mahasiswa
        const mahasiswaIds = [];
        const mahasiswaDataList = [];
        const nimList = [];
        const namaList = [];
        const namaDepan = ['Adi', 'Bella', 'Citra', 'Dedi', 'Eka', 'Fajar', 'Gina', 'Haris', 'Indah', 'Joko', 'Kiki', 'Lintang', 'Meisya', 'Novita', 'Okta', 'Budi', 'Rudi', 'Siti', 'Dewi', 'Ahmad'];
        const namaBelakang = ['Pratama', 'Sanjaya', 'Dewi', 'Mulyadi', 'Putri', 'Rahman', 'Hermawan', 'Suryanto', 'Kusuma', 'Widodo', 'Amalia', 'Bima', 'Sakura', 'Sari', 'Prasetya', 'Santoso', 'Hartono', 'Nurhaliza', 'Lestari', 'Wijaya'];

        for (let i = 0; i < 50; i++) {
            const nim = (23010001 + i).toString();
            const depan = namaDepan[i % namaDepan.length];
            const belakang = namaBelakang[i % namaBelakang.length];
            const nama = `${depan} ${belakang} ${i + 1}`;
            nimList.push(nim);
            namaList.push(nama);
        }

        for (let i = 0; i < 50; i++) {
            const email = `mahasiswa${i}@ibbi.com`;
            const result = db.prepare(`
                INSERT INTO pengguna (nama, email, password, peran)
                VALUES (?, ?, ?, ?)
            `).run(
                namaList[i],
                email,
                bcrypt.hashSync(email,10),
                'mahasiswa'
            );
            mahasiswaIds.push(result.lastInsertRowid);
            mahasiswaDataList.push({ penggunaId: result.lastInsertRowid, nim: nimList[i], nama: namaList[i] });
        }

        // ===== SEED MAHASISWA =====
        console.log('📝 Seeding tabel mahasiswa...');
        const fakultasOptions = ['Fakultas Sains dan Teknologi (FaST)', 'Fakultas Ilmu Sosial dan Humaniora (FISH)'];
        // fast: SI, TI, IT
        // fish: Manajemen, Akuntansi
        const angkatanList = [2021, 2022, 2023, 2024];
        const mahasiswaTableIds = [];

        for (let i = 0; i < mahasiswaDataList.length; i++) {
            const { penggunaId, nim, nama } = mahasiswaDataList[i];
            const fakultas = fakultasOptions[i % fakultasOptions.length];
            const prodiList = fakultas === 'Fakultas Sains dan Teknologi (FaST)' ? ['Sistem Informasi (SI)', 'Teknik Informatika (TI)', 'Teknologi Informasi (IT)'] : ['Manajemen', 'Akuntansi'];
            const programStudi = prodiList[i % prodiList.length];
            const angkatan = angkatanList[i % angkatanList.length];

            const result = db.prepare(`
                INSERT INTO mahasiswa (pengguna_id, nim, fakultas, program_studi, angkatan)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                penggunaId,
                nim,
                fakultas,
                programStudi,
                angkatan
            );
            mahasiswaTableIds.push(result.lastInsertRowid);
        }

        // ===== SEED DOSEN =====
        console.log('📝 Seeding tabel dosen...');
        const dosenTableIds = [];

        for (let i = 0; i < dosenDataList.length; i++) {
            const { penggunaId, nidn } = dosenDataList[i];
            const fakultas = fakultasOptions[Math.floor(Math.random() * fakultasOptions.length)];

            const result = db.prepare(`
                INSERT INTO dosen (pengguna_id, nidn, fakultas)
                VALUES (?, ?, ?)
            `).run(
                penggunaId,
                nidn,
                fakultas
            );
            dosenTableIds.push(result.lastInsertRowid);
        }

        // ===== SEED KELAS BIMBINGAN =====
        console.log('📝 Seeding tabel kelas_bimbingan...');
        const kelasIds = [];
        const kelasData = [
            { nama: 'Sistem Informasi A', fakultas: 'Fakultas Sains dan Teknologi (FaST)', prodi: 'Sistem Informasi (SI)', angkatan: 2021 },
            { nama: 'Manajemen B', fakultas: 'Fakultas Ilmu Sosial dan Humaniora (FISH)', prodi: 'Manajemen', angkatan: 2022 },
        ];

        for (let i = 0; i < kelasData.length; i++) {
            const data = kelasData[i];
            const result = db.prepare(`
                INSERT INTO kelas_bimbingan (nama_kelas, fakultas, program_studi, angkatan, dosen_id)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                data.nama,
                data.fakultas,
                data.prodi,
                data.angkatan,
                dosenTableIds[i % dosenTableIds.length]
            );
            kelasIds.push(result.lastInsertRowid);
        }

        // Update mahasiswa to join class
        console.log('📝 Assigning mahasiswa to classes & setting komting...');
        for (let i = 0; i < mahasiswaTableIds.length; i++) {
            const kelasId = i < 5 ? kelasIds[0] : kelasIds[1];
            db.prepare('UPDATE mahasiswa SET kelas_bimbingan_id = ? WHERE id = ?').run(kelasId, mahasiswaTableIds[i]);
            
            // Set komting
            if (i === 0) {
                db.prepare('UPDATE kelas_bimbingan SET komting_id = ? WHERE id = ?').run(mahasiswaTableIds[i], kelasIds[0]);
            } else if (i === 5) {
                db.prepare('UPDATE kelas_bimbingan SET komting_id = ? WHERE id = ?').run(mahasiswaTableIds[i], kelasIds[1]);
            }
        }  

        console.log('\n✅ Seeding berhasil!');
        console.log(`   • Pengguna: ${adminIds.length + dosenTableIds.length + mahasiswaTableIds.length}`);
        console.log(`   • Mahasiswa: ${mahasiswaTableIds.length}`);
        console.log(`   • Dosen: ${dosenTableIds.length}`);
        console.log(`   • Kelas: ${kelasIds.length}`);
        console.log('\n🎉 Database siap digunakan!\n');

    } catch (error) {
        console.error('❌ Error saat seeding:', error);
        process.exit(1);
    }
}

seedDatabase().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
