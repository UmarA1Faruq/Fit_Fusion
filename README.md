# FitFusion — Admin Gym

Prototype antarmuka aplikasi admin gym untuk mengelola member, transaksi, paket membership,
dan profil gym. Dibangun sebagai **single-page app** dengan React + TypeScript + Tailwind CSS,
tanpa backend dan tanpa database.

Seluruh data disimpan di memori (React Context) selama sesi berjalan, sehingga perubahan langsung
tercermin di dashboard, daftar member, dan daftar transaksi.

## Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru (disarankan 20+)
- npm (sudah termasuk bersama Node.js)

## Instalasi & Menjalankan

```bash
# 1. Clone repositori
git clone https://github.com/USERNAME/Fit_Fusion.git
cd Fit_Fusion

# 2. Pasang dependensi
npm install

# 3. Jalankan dev server
npm run dev
```

Buka `http://localhost:5173`. Halaman login sudah terisi otomatis dengan akun demo:

| Field      | Nilai               |
| ---------- | ------------------- |
| Email      | `admin@fitfusion.id` |
| Kata sandi | `fitfusion123`       |

Login menggunakan autentikasi mock: email dengan format valid dan kata sandi minimal 6 karakter
akan diterima. Tombol **Keluar** tersedia di sidebar dan menu avatar topbar.

## Perintah

| Perintah          | Keterangan                          |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Menjalankan dev server Vite         |
| `npm run build`   | Type-check (`tsc -b`) + build produksi |
| `npm run preview` | Melihat hasil build produksi        |
| `npm run lint`    | Menjalankan Oxlint                  |

## Fitur

- **Login mock** — validasi email/kata sandi, tampilkan/sembunyikan kata sandi, toast selamat datang.
- **Dashboard** — 4 kartu statistik, grafik pemasukan 6 bulan terakhir, 5 member yang segera berakhir,
  5 transaksi terbaru, komposisi status member, dan tombol aksi cepat.
- **Member** — pencarian nama/ID/no. HP, filter status (Aktif, Kedaluwarsa, Nonaktif), paginasi,
  badge status berwarna, serta aksi lihat, ubah, dan hapus dengan modal konfirmasi.
- **Tambah/Ubah Member** — validasi kolom wajib, pratinjau kartu member, dan perhitungan tanggal
  berakhir otomatis dari durasi paket.
- **Detail Member** — profil lengkap, progress masa aktif, sisa hari, total pembayaran, dan riwayat
  transaksi. Tombol perpanjangan langsung membuka form transaksi dengan member terpilih.
- **Transaksi** — pencarian invoice/member, filter metode dan rentang tanggal, total pemasukan
  (hanya transaksi lunas), paginasi, serta status pembayaran.
- **Tambah Transaksi** — dropdown member yang bisa dicari, pemilihan paket dengan harga otomatis,
  tanggal, metode bayar, catatan, dan pratinjau masa aktif baru. Invoice dibuat otomatis
  (`INV-YYYY-####`), status member menjadi Aktif, dan tanggal berakhir diperbarui.
- **Paket** — kartu paket (Bulanan, 3 Bulan, Tahunan) dengan modal tambah/ubah paket, durasi, harga,
  deskripsi, dan fasilitas.
- **Pengaturan** — form profil gym dan admin dengan validasi serta toast konfirmasi.
- **UX** — sidebar aktif otomatis, drawer mobile, breadcrumb, empty state informatif, skeleton singkat,
  toast, modal yang bisa ditutup dengan Escape, fokus terlihat, dan format Rupiah/tanggal Indonesia.

## Data Demo

Data awal dibuat relatif terhadap tanggal hari ini agar demo tetap relevan:

- 15 member dengan nama Indonesia dan status campuran (10 Aktif, 3 Kedaluwarsa, 2 Nonaktif).
- 28 transaksi dengan `memberId` dan `paketId` yang konsisten.
- 3 paket: Bulanan `Rp250.000`, 3 Bulan `Rp650.000`, Tahunan `Rp2.200.000`.

Muat ulang halaman akan mengembalikan seluruh data ke kondisi awal karena tidak ada penyimpanan
permanen (sesuai batasan prototype).

## Struktur Proyek

```
src/
├─ components/
│  ├─ layout/        Sidebar, Topbar, AppLayout
│  ├─ ui/            Button, Badge, Card, Table, Modal, Toast, FormField, StatCard, dll.
│  └─ MemberCombobox.tsx
├─ data/mockData.ts  Seed member, paket, transaksi, dan pengaturan
├─ pages/            Login, Dashboard, Member, Transaksi, Paket, Pengaturan, 404
├─ store/AppContext  State global + aksi CRUD & autentikasi mock
├─ utils/            Format Rupiah/tanggal, status & masa aktif, helper umum
├─ App.tsx           Routing + provider + route protection
├─ index.css         Base style, kelas form/tabel, animasi
└─ types.ts          Tipe entity dan input
```

## Catatan Teknis

- React 19, React Router 7, TypeScript, Vite, Tailwind CSS 3, dan Lucide React.
- Format mata uang memakai `Intl.NumberFormat('id-ID')`; tanggal ditampilkan sebagai `19 Nov 2026`.
- Status member disimpan, tetapi status Aktif/Kedaluwarsa dihitung ulang dari tanggal berakhir.
  Status Nonaktif dipertahankan sebagai penanda manual.
- Perpanjangan memperpanjang dari tanggal terakhir yang paling relevan (tanggal bayar, hari ini,
  atau tanggal berakhir sebelumnya), lalu mengubah status member menjadi Aktif.
- Menghapus member juga menghapus transaksi terkait dan mengurangi total pemasukan.
