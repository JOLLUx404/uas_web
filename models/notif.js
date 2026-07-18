const db = require('../database/config');

function ambilSemuaNotif(){
    return db.prepare(`
        SELECT
            notifikasi_id,
            pengguna.nama,
            pengguna.email,
            notifikasi.judul,
            notifikasi.pesan,
            notifikasi.status_baca,
            notifikasi.dibuat_pada
        FROM notifikasi
        JOIN pengguna
            ON notifikasi.pengguna_id = pengguna.id
        ORDER BY notifikasi.dibuat_pada DESC
    `).all();
}

function ambilNotifiById(id){
    return db.prepare(`
        SELECT * FROM notifikasi
        WHERE id = ?
    `).get(id);
}

function ambilNotifikasiPengguna(penggunaId){
    return db.prepare(`
        SELECT * FROM notifikasi
        WHERE pengguna+id = ?
        ORDER BY dibuat_pada DESC
    `).all(penggunaId);
}

function tambahNotifikasi(
    penggunaId,
    judul,
    pesan
){
    const stmt = db.prepare(`
        INSERT INTO notifikasi(
        pengguna_id,
        judul,
        pesan,
        status_baca,
        dibuat_pada
        )
        VALUES(?,?,?,'belum_dibaca',datetime('now')
    )`);

    stmt.run(penggunaId,
        judul,
        pesan
    );
}

function tandaiSudahDibaca(id){
    const stmt = db.prepare(`
        UPDATE notifikasi 
        SET status_baca = 'sudah_dibaca'
        WHERE id = ?
    `);
    stmt.run(id);
}

function hapusNotifikasi(id){
    const stmt = db.prepare(`
        DELETE FROM notifikasi
        WHERE id = ?
    `);
    stmt.run(id);
}

module.exports =(
    ambilSemuaNotif,
    ambilNotifiById,
    ambilNotifikasiPengguna,
    tambahNotifikasi,
    tandaiSudahDibaca,
    hapusNotifikasi
);