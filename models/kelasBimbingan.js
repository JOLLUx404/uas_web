const db = require('../database/config');

function ambilSemuaKelasBimbingan(){
    return db.prepare(`
        SELECT 
            kelasBimbingan.*, 
            dosen.nidn, 
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting, 
            penggunaKomting.nama AS nama_komting
        FROM kelas_bimbingan AS kelasBimbingan 
        JOIN dosen AS dosen 
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen 
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting 
            ON kelasBimbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna penggunaKomting 
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
    `).all();
}

function ambilKelasBimbinganById(id){
    return db.prepare(`
        SELECT 
            kelasBimbingan.*, 
            dosen.nidn, 
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting, 
            penggunaKomting.nama AS nama_komting
        FROM kelas_bimbingan AS kelasBimbingan
        JOIN dosen AS dosen 
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen 
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting 
            ON kelasBimbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna AS penggunaKomting 
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
        WHERE kelasBimbingan.id = ?
    `).get(id);
}

function ambilKelasBimbinganByDosenId(dosen_id){
    return db.prepare(`
        SELECT 
            kelasBimbingan.*, 
            dosen.nidn, 
            penggunaDosen.nama AS nama_dosen,
            mahasiswaKomting.nim AS nim_komting, 
            penggunaKomting.nama AS nama_komting
        FROM kelas_bimbingan AS kelasBimbingan
        JOIN dosen AS dosen 
            ON kelasBimbingan.dosen_id = dosen.id
        JOIN pengguna AS penggunaDosen 
            ON dosen.pengguna_id = penggunaDosen.id
        LEFT JOIN mahasiswa AS mahasiswaKomting 
            ON  kelasBimbingan.komting_id = mahasiswaKomting.id
        LEFT JOIN pengguna AS penggunaKomting 
            ON mahasiswaKomting.pengguna_id = penggunaKomting.id
        WHERE kelasBimbingan.dosen_id = ?
    `).all(dosen_id);
}

function buatKelasBimbingan(nama_kelas, fakultas, program_studi, angkatan, dosen_id){
    console.log({
    nama_kelas,
    fakultas,
    program_studi,
    angkatan,
    dosen_id
});
    const stmt = db.prepare(`
        INSERT INTO kelas_bimbingan(nama_kelas, fakultas, program_studi, angkatan, dosen_id)
        VALUES (?,?,?,?,?)
    `);
    const info = stmt.run(nama_kelas, fakultas, program_studi, angkatan, dosen_id);
    return info.lastInsertRowid;
}

function updateKelasBimbingan(id, nama_kelas, fakultas, program_studi,angkatan, dosen_id){
    const stmt = db.prepare(`
        UPDATE kelas_bimbingan
        SET nama_keas = ?, fakultas = ?, program_studi = ?, angkatan = ?, dosen_id = ?
        WHERE id = ?
    `);
    stmt.run(nama_kelas, fakultas, program_studi, angkatan, dosen_id,id);
}

function updateKomting(id,komting_id){
    const stmt = db.prepare(`
        UPDATE kelas_bimbingan
        SET komting_id = ?
        WHERE id = ?
    `);
    stmt.run(komting_id,id);
}

function hapusKelasBimbingan(id){
    const stmt =db.prepare('DELETE FROM kelas_bimbingan WHERE id =?');
    stmt.run(id);
}

function ambilMahasiswaByKelasId(kelas_bimbingan_id){
    return db.prepare(`
        SELECT 
            mahasiswakomting.id AS mahasiswa_id, 
            mahasiswaKomting.nim, 
            mahasiswaKomting.fakultas,
            mahasiswaKomting.program_studi, 
            mahasiswaKomting.angkatan,
            pengguna.nama, pengguna.email
        FROM mahasiswa AS mahasiswaKomting
        JOIN pengguna AS pengguna 
            ON mahasiswaKomting.pengguna_id = pengguna.id
        WHERE mahasiswaKomting.kelas_bimbingan_id = ?
    `).all(kelas_bimbingan_id);
}

module.exports = {
    ambilKelasBimbinganByDosenId,
    ambilKelasBimbinganById,
    ambilSemuaKelasBimbingan,
    buatKelasBimbingan,
    updateKelasBimbingan,
    updateKomting,
    hapusKelasBimbingan,
    ambilMahasiswaByKelasId
};