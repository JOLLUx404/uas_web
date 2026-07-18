const db = require('../database/config');

function ambilSemuaBimbinganKelas() {
    return db.prepare(`
        SELECT 
            bimbinganKelas.*,
            kelasBimbingan.nama_kelas,
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting,
            penggunaKomting.nama AS nama_komting
        FROM bimbingan_kelas AS bimbinganKelas
        JOIN kelas_bimbingan AS kelasBimbingan
            ON bimbinganKelas.kelas_bimbingan_id = kelasBimbingan.id
        JOIN dosen AS dosen
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting
            ON kelasBimbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna AS penggunaKomting
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
        WHERE dosen.id = ?
        ORDER BY bimbinganKelas.tanggal DESC, bimbinganKelas.jam DESC
    `).all();
}

function ambilBimbinganByKelasId(kelas_bimbingan_id) {
    return db.prepare(`
        SELECT 
            bimbinganKelas.*
        FROM bimbingan_kelas AS bimbinganKelas
        WHERE bimbinganKelas.kelas_bimbingan_id = ?
        ORDER BY bimbinganKelas.tanggal DESC, bimbinganKelas.jam DESC
    `).all(kelas_bimbingan_id);
}

function ambilBimbinganById(id) {
    return db.prepare(`
        SELECT 
            bimbinganKelas.*,
            kelasBimbingan.nama_kelas, 
            dosen.nidn, 
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting, 
            penggunaKomting.nama AS nama_komting
        FROM bimbingan_kelas AS bimbinganKelas
        JOIN kelas_bimbingan AS kelasBimbingan 
            ON bimbinganKelas.kelas_bimbingan_id = kelasBimbingan.id
        JOIN dosen AS dosen
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen 
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting 
            ON kelasBimbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna AS penggunaKomting 
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
        WHERE bimbinganKelas.id = ?
    `).get(id);
}

function buatBimbingan(kelas_bimbingan_id, tanggal, jam) {
    const stmt = db.prepare(`
        INSERT INTO bimbingan_kelas(kelas_bimbingan_id, tanggal, jam, status, catatan)
        VALUES(?, ?, ?, 'menunggu', '')
    `);
    const info = stmt.run(kelas_bimbingan_id, tanggal, jam);
    return info.lastInsertRowid;
}

function updateStatusBimbingan(id, status, catatan) {
    const stmt = db.prepare(`
        UPDATE bimbingan_kelas
        SET status = ?, catatan = ?
        WHERE id = ?
    `);
    stmt.run(status, catatan, id);
}

function hapusBimbingan(id) {
    const stmt = db.prepare(`DELETE FROM bimbingan_kelas WHERE id = ?`);
    stmt.run(id);
}

function ambilBimbinganByDosenId(dosen_id) {
    return db.prepare(`
        SELECT bimbinganKelas.*, 
            kelasBimbingan.nama_kelas, 
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting, 
            penggunaKomting.nama AS nama_komting
        FROM bimbingan_kelas AS bimbinganKelas
        JOIN kelas_bimbingan kb 
            ON bimbinganKelas.kelas_bimbingan_id = kelasBimbingan.id
        JOIN dosen AS dosen 
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen 
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting 
            ON kelasBmbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna penggunaKomting 
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
        WHERE dosen.id = ?
        ORDER BY bimbinganKelas.tanggal DESC, bimbinganKelas.jam DESC
    `).all(dosen_id);
}

module.exports = {
    ambilSemuaBimbinganKelas,
    ambilBimbinganByKelasId,
    ambilBimbinganById,
    buatBimbingan,
    updateStatusBimbingan,
    hapusBimbingan,
    ambilBimbinganByDosenId
};
