const db = require('./config');

db.pragma('foreign_keys = OFF');

db.exec(`
    CREATE TABLE IF NOT EXISTS pengguna (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL ,
        password TEXT NOT NULL,
        peran TEXT NOT NULL CHECK(peran IN ('admin', 'dosen','mahasiswa')),
        reset_token TEXT,
        dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
        diperbarui_pada DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS mahasiswa(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pengguna_id INTEGER NOT NULL,
        nim TEXT NOT NULL UNIQUE,
        fakultas TEXT NOT NULL,
        program_studi TEXT NOT NULL,
        angkatan INTEGER,
        kelas_bimbingan_id INTEGER,
        FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE,
        FOREIGN KEY (kelas_bimbingan_id) REFERENCES kelas_bimbingan(id) ON DELETE SET NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS dosen(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pengguna_id INTEGER NOT NULL,
        nidn TEXT UNIQUE NOT NULL,
        fakultas TEXT NOT NULL,
        FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS kelas_bimbingan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kelas TEXT NOT NULL,
        fakultas TEXT NOT NULL,
        program_studi TEXT NOT NULL,
        angkatan INTEGER NOT NULL,
        dosen_id INTEGER NOT NULL,
        komting_id INTEGER,
        FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
        FOREIGN KEY (komting_id) REFERENCES mahasiswa(id) ON DELETE SET NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS bimbingan_kelas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kelas_bimbingan_id INTEGER NOT NULL,
        tanggal DATE NOT NULL,
        jam TIME NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('menunggu', 'diterima', 'ditolak', 'selesai')),
        catatan TEXT,
        FOREIGN KEY (kelas_bimbingan_id) REFERENCES kelas_bimbingan(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS notifikasi(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pengguna_id INTEGER NOT NULL,
        judul TEXT NOT NULL,
        pesan TEXT NOT NULL,
        status_baca TEXT NOT NULL CHECK(status_baca IN ('belum dibaca', 'sudah dibaca')),
        dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_mahasiswa_pengguna ON mahasiswa(pengguna_id);
    CREATE INDEX IF NOT EXISTS idx_dosen_pengguna ON dosen(pengguna_id);
    CREATE INDEX IF NOT EXISTS idx_kelas_bimbingan_dosen ON kelas_bimbingan(dosen_id);
    CREATE INDEX IF NOT EXISTS idx_bimbingan_kelas ON bimbingan_kelas(kelas_bimbingan_id);
    CREATE INDEX IF NOT EXISTS idx_notifikasi_pengguna ON notifikasi(pengguna_id);
`);