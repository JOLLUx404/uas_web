### nama: paskah alfeus ginting
### judul project: sistem bimbingan akademik
### deskripsi project: 

System bimbingan akademik merupakan aplikasi berbasis web yang dipakai untuk mengelola proses konsultasi antara mahasiswa dan dosen PA. dengan adanya system ini, proses bimbingan menjadi lebih terstruktur, dan mudah diakses oleh banyak pengguna.

### penjelasan database

sistem ini menggunakan enam tabel database diantaranya **pengguna**, **mahasiswa**, **dosen**, **jadwal_konsul**, **booking_konsul**, **catatan_bimbingan**, dan **notifikasi**. 

tabel **pengguna** dapat menyimpan akun yang dipakai untuk login ke sistem dengan tiap role yang ada (admin, dosen, dan mahasiswa). tabel **mahasiswa** digunakan untuk menyimpan data khusus mahasiswa. tabel **dosen** akan menyimpan data dosen pembimbing. tabel **jadwal_konsul** akan menyimpan data jadwal yang disediakan oleh dosen yang kemudian akan dipilih oleh mahasiswa. tabel **booking_konsul** akan membaca jadwal yang telah dipilih oleh mahasiswa. tabel **catatan_konsul** kemudian akan menyimpan inputan yang diisi oleh dosen setelah masa bimbingan selesai. tabel **notifikasi** disini akan menyimpan catatan aktivitas terkait proses bimbingan


## Quick Start

```bash
# 1. Clone & masuk direktori
cd web-absensi

# 2. Install dependencies
npm install

# 3. Inisialisasi database SQLite
npm run db:init

# 4. Jalankan development server (port 3000)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## akun login

admin: admin1@ibbi.com (admin123)
mahasiswa mahasiswa1@ibbi.com(mahasiswa1@ibbi.com)
dosen: dr..budi.santoso@ibbi.com(dr..budi.santoso@ibbi.com)