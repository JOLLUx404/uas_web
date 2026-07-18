const db = require('../database/config');
const bcrypt = require('bcrypt');

function ambilSemuaMahasiswa(){
    return db.prepare(`
        SELECT pengguna.id, mahasiswa.id as mahasiswa_id, mahasiswa.nim, mahasiswa.fakultas, mahasiswa.program_studi,
        mahasiswa.angkatan, pengguna.nama, pengguna.email, mahasiswa.kelas_bimbingan_id, kelas_bimbingan.nama_kelas
        FROM mahasiswa
        JOIN pengguna ON mahasiswa.pengguna_id = pengguna.id
        LEFT JOIN kelas_bimbingan ON mahasiswa.kelas_bimbingan_id = kelas_bimbingan.id
        `).all();
}

function ambilMahasiswaById(id){
    return db.prepare(`
        SELECT pengguna.id, mahasiswa.id as mahasiswa_id, mahasiswa.nim, mahasiswa.fakultas, mahasiswa.program_studi,
        mahasiswa.angkatan, pengguna.nama, pengguna.email, mahasiswa.kelas_bimbingan_id, kelas_bimbingan.nama_kelas
        FROM mahasiswa
        JOIN pengguna ON mahasiswa.pengguna_id = pengguna.id
        LEFT JOIN kelas_bimbingan ON mahasiswa.kelas_bimbingan_id = kelas_bimbingan.id
        WHERE pengguna.id = ?
        `).get(id);
}

function ambilMahasiswaByDbId(mahasiswa_id){
    return db.prepare(`
        SELECT pengguna.id, mahasiswa.id as mahasiswa_id, mahasiswa.nim, mahasiswa.fakultas, mahasiswa.program_studi,
        mahasiswa.angkatan, pengguna.nama, pengguna.email, mahasiswa.kelas_bimbingan_id
        FROM mahasiswa
        JOIN pengguna ON mahasiswa.pengguna_id = pengguna.id
        WHERE mahasiswa.id = ?
        `).get(mahasiswa_id);
}

function buatMahasiswa(nim,nama,email,fakultas,program_studi,angkatan){
    const stmt = db.prepare(`
        INSERT INTO pengguna(nama,email,password,peran)
        VALUES (?,?,?,?)`);
        const result = stmt.run(nama,email, bcrypt.hashSync(nim,10),'mahasiswa');

        const penggunaId = result.lastInsertRowid;

        const mahasiswaStmt = db.prepare(`
            INSERT INTO mahasiswa(pengguna_id, nim, fakultas, program_studi,angkatan)
            VALUES(?,?,?,?,?)`);
        mahasiswaStmt.run(penggunaId, nim, fakultas, program_studi, angkatan);
}     

function updateMahasiswa(id,nim,nama,email,fakultas,program_studi,angkatan){
    const stmt = db.prepare(`
        UPDATE pengguna
        SET nama= ?, email = ?
        WHERE id = ?`);
    stmt.run(nama,email,id);

    const mahasiswaStmt = db.prepare(`
        UPDATE mahasiswa
        SET nim = ?, fakultas = ?, program_studi = ?, angkatan = ?
        WHERE pengguna_id = ?`);
    mahasiswaStmt.run(nim,fakultas,program_studi,angkatan,id)
}

function updateKelasMahasiswa(mahasiswa_id, kelas_bimbingan_id) {
    const stmt = db.prepare(`
        UPDATE mahasiswa SET kelas_bimbingan_id = ? WHERE id = ?
    `);
    stmt.run(kelas_bimbingan_id, mahasiswa_id);
}

function hapusMahasiswa(id){
    const stmt = db.prepare('DELETE FROM pengguna WHERE id = ?');
    stmt.run(id);
}

function ambilAngkatanByKriteria(fakultas, program_studi) {
    const rows = db.prepare(`
        SELECT DISTINCT angkatan 
        FROM mahasiswa 
        WHERE fakultas = ? AND program_studi = ? AND angkatan IS NOT NULL
        ORDER BY angkatan DESC
    `).all(fakultas, program_studi);
    return rows.map(r => r.angkatan);
}

module.exports = {
    ambilSemuaMahasiswa,
    ambilMahasiswaById,
    ambilMahasiswaByDbId,
    buatMahasiswa,
    updateMahasiswa,
    updateKelasMahasiswa,
    hapusMahasiswa,
    ambilAngkatanByKriteria
}