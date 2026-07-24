const db = require('../database/config');

function ambilSemuaBimbinganKelas() {
    return db.prepare(`
        SELECT bk.*, kb.nama_kelas, d.nidn, pd.nama as nama_dosen,
               m.nim as nim_komting, pm.nama as nama_komting
        FROM bimbingan_kelas bk
        JOIN kelas_bimbingan kb ON bk.kelas_bimbingan_id = kb.id
        JOIN dosen d ON kb.dosen_id = d.id
        JOIN pengguna pd ON d.pengguna_id = pd.id
        LEFT JOIN mahasiswa m ON kb.komting_id = m.id
        LEFT JOIN pengguna pm ON m.pengguna_id = pm.id
        ORDER BY bk.tanggal DESC, bk.jam DESC
    `).all();
}

function ambilBimbinganByKelasId(kelas_bimbingan_id) {
    return db.prepare(`
        SELECT bk.*
        FROM bimbingan_kelas bk
        WHERE bk.kelas_bimbingan_id = ?
        ORDER BY bk.tanggal DESC, bk.jam DESC
    `).all(kelas_bimbingan_id);
}

function ambilBimbinganById(id) {
    return db.prepare(`
        SELECT bk.*, kb.nama_kelas, d.nidn, pd.nama as nama_dosen,
               m.nim as nim_komting, pm.nama as nama_komting
        FROM bimbingan_kelas bk
        JOIN kelas_bimbingan kb ON bk.kelas_bimbingan_id = kb.id
        JOIN dosen d ON kb.dosen_id = d.id
        JOIN pengguna pd ON d.pengguna_id = pd.id
        LEFT JOIN mahasiswa m ON kb.komting_id = m.id
        LEFT JOIN pengguna pm ON m.pengguna_id = pm.id
        WHERE bk.id = ?
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
        SELECT bk.*, kb.nama_kelas, pd.nama as nama_dosen,
               m.nim as nim_komting, pm.nama as nama_komting
        FROM bimbingan_kelas bk
        JOIN kelas_bimbingan kb ON bk.kelas_bimbingan_id = kb.id
        JOIN dosen d ON kb.dosen_id = d.id
        JOIN pengguna pd ON d.pengguna_id = pd.id
        LEFT JOIN mahasiswa m ON kb.komting_id = m.id
        LEFT JOIN pengguna pm ON m.pengguna_id = pm.id
        WHERE d.id = ?
        ORDER BY bk.tanggal DESC, bk.jam DESC
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
