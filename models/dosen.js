const db = require('../database/config');
const bcrypt = require("bcrypt");

function ambilSemuaDosen(){
    return db
    .prepare(
        `SELECT 
            pengguna.id, dosen.nidn, dosen.fakultas, pengguna.nama, pengguna.email
        FROM dosen
        JOIN pengguna 
            ON dosen.pengguna_id = pengguna.id
        `
    )
    .all();
}

function ambilDosenById(id){
    return db
    .prepare(`
        SELECT 
            pengguna.id, dosen.id AS dosen_id, dosen.nidn, dosen.fakultas, pengguna.nama, pengguna.email
        FROM dosen
        JOIN pengguna 
            ON dosen.pengguna_id = pengguna.id
        WHERE pengguna.id = ?
        `,
    )
    .get(id);
}

function ambilDosenByDbId(dosen_id){
    return db
    .prepare(`
        SELECT 
            pengguna.id, dosen.id as dosen_id, dosen.nidn, dosen.fakultas, pengguna.nama, pengguna.email
        FROM dosen
        JOIN pengguna 
            ON dosen.pengguna_id = pengguna.id
        WHERE dosen.id = ?
        `,
    )
    .get(dosen_id);
}

function buatDosen(nidn, nama, email, fakultas){
    const stmt = db.prepare(`
        INSERT INTO pengguna(nama,email,password,peran)
        VALUES(?,?,?,?)`);
        const result = stmt.run(nama,email,bcrypt.hashSync(nidn,10),"dosen");

        const penggunaId = result.lastInsertRowid;

        const dosenStmt = db.prepare(`
            INSERT INTO dosen(pengguna_id, nidn, fakultas)
            VALUES(?,?,?)`);
            dosenStmt.run(penggunaId,nidn,fakultas);
}

function updateDosen(id,nidn,nama,email,fakultas){
    const stmt = db.prepare(`
        UPDATE pengguna
        SET nama = ?, email = ?
        WHERE id = ?`);
        stmt.run(nama,email,id);

        const dosenStmt = db.prepare(`
            UPDATE dosen
            SET nidn = ?,
            fakultas = ?
            WHERE pengguna_id = ?`);
            dosenStmt.run(nidn,fakultas,id);
}

function hapusDosen(id){
    const stmt = db.prepare("DELETE FROM pengguna WHERE id =?");
    stmt.run(id);
}

module.exports ={
    ambilSemuaDosen,
    ambilDosenById,
    ambilDosenByDbId,
    buatDosen,
    updateDosen,
    hapusDosen
}