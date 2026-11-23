import type {
  JenisKelamin,
  Member,
  MetodeBayar,
  Paket,
  Pengaturan,
  StatusTransaksi,
  Transaksi,
} from '../types'
import { addDays, todayISO } from '../utils/date'

const PAKET: Paket[] = [
  {
    id: 'pkg-1',
    nama: 'Bulanan',
    durasiHari: 30,
    harga: 250_000,
    deskripsi: 'Cocok untuk kamu yang ingin mulai rutin latihan tanpa komitmen panjang.',
    fitur: ['Akses penuh area gym', 'Loker & kamar mandi', 'Konsultasi program dasar'],
  },
  {
    id: 'pkg-2',
    nama: '3 Bulan',
    durasiHari: 90,
    harga: 650_000,
    deskripsi: 'Paket favorit member FitFusion dengan harga yang lebih hemat.',
    fitur: ['Semua fasilitas Bulanan', '2 sesi personal trainer', 'Evaluasi program bulanan'],
  },
  {
    id: 'pkg-3',
    nama: 'Tahunan',
    durasiHari: 365,
    harga: 2_200_000,
    deskripsi: 'Komitmen setahun, hasil maksimal, dengan harga paling hemat.',
    fitur: ['Semua fasilitas 3 Bulanan', '8 sesi personal trainer', 'Bonus 1 bulan membership'],
  },
]

interface SeedMember {
  nama: string
  jenisKelamin: JenisKelamin
  tanggalLahir: string
  noHp: string
  email: string
  alamat: string
  catatan: string
  paketId: string
  /** Selisih hari tanggal berakhir dari hari ini. */
  akhirDalam: number
  nonaktif?: boolean
}

const SEED_MEMBER: SeedMember[] = [
  {
    nama: 'Ahmad Fauzi',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1995-04-12',
    noHp: '081234567801',
    email: 'ahmad.fauzi@gmail.com',
    alamat: 'Jl. Merdeka No. 12, Bandung',
    catatan: 'Fokus latihan strength, target deadlift 150 kg.',
    paketId: 'pkg-1',
    akhirDalam: 5,
  },
  {
    nama: 'Siti Nurhaliza',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1993-08-21',
    noHp: '081234567802',
    email: 'siti.nurhaliza@gmail.com',
    alamat: 'Jl. Cihampelas No. 45, Bandung',
    catatan: 'Prefer kelas yoga pagi.',
    paketId: 'pkg-2',
    akhirDalam: 4,
  },
  {
    nama: 'Budi Santoso',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1988-01-15',
    noHp: '081234567803',
    email: 'budi.santoso@yahoo.com',
    alamat: 'Jl. Diponegoro No. 8, Bandung',
    catatan: 'Member sejak 2022, rutin 4x seminggu.',
    paketId: 'pkg-3',
    akhirDalam: 21,
  },
  {
    nama: 'Dewi Lestari',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1997-11-03',
    noHp: '081234567804',
    email: 'dewi.lestari@gmail.com',
    alamat: 'Jl. Sukajadi No. 21, Bandung',
    catatan: 'Sering ikut kelas HIIT.',
    paketId: 'pkg-1',
    akhirDalam: 2,
  },
  {
    nama: 'Rizky Pratama',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1999-06-27',
    noHp: '081234567805',
    email: 'rizky.pratama@gmail.com',
    alamat: 'Jl. Setiabudi No. 67, Bandung',
    catatan: 'Target turun 5 kg dalam 3 bulan.',
    paketId: 'pkg-2',
    akhirDalam: 6,
  },
  {
    nama: 'Maya Anggraini',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1994-02-09',
    noHp: '081234567806',
    email: 'maya.anggraini@gmail.com',
    alamat: 'Jl. Pasteur No. 33, Bandung',
    catatan: 'Suka latihan pagi sebelum kerja.',
    paketId: 'pkg-1',
    akhirDalam: 13,
  },
  {
    nama: 'Andi Wijaya',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1990-09-18',
    noHp: '081234567807',
    email: 'andi.wijaya@yahoo.com',
    alamat: 'Jl. Buah Batu No. 90, Bandung',
    catatan: 'Belum memperpanjang sejak bulan lalu.',
    paketId: 'pkg-1',
    akhirDalam: -3,
  },
  {
    nama: 'Putri Maharani',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1996-05-30',
    noHp: '081234567808',
    email: 'putri.maharani@gmail.com',
    alamat: 'Jl. Dago No. 18, Bandung',
    catatan: 'Ikut program body shaping.',
    paketId: 'pkg-3',
    akhirDalam: 7,
  },
  {
    nama: 'Fajar Nugroho',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1992-12-11',
    noHp: '081234567809',
    email: 'fajar.nugroho@gmail.com',
    alamat: 'Jl. Riau No. 55, Bandung',
    catatan: 'Sementara nonaktif karena pindah kota.',
    paketId: 'pkg-2',
    akhirDalam: 45,
    nonaktif: true,
  },
  {
    nama: 'Rina Kartika',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1998-07-07',
    noHp: '081234567810',
    email: 'rina.kartika@gmail.com',
    alamat: 'Jl. Ahmad Yani No. 102, Bandung',
    catatan: 'Rutin latihan bareng pasangan.',
    paketId: 'pkg-1',
    akhirDalam: 16,
  },
  {
    nama: 'Dimas Saputra',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1991-03-22',
    noHp: '081234567811',
    email: 'dimas.saputra@gmail.com',
    alamat: 'Jl. Gatot Subroto No. 77, Bandung',
    catatan: 'Menunggu konfirmasi perpanjangan.',
    paketId: 'pkg-2',
    akhirDalam: -12,
  },
  {
    nama: 'Laila Sari',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2000-10-14',
    noHp: '081234567812',
    email: 'laila.sari@gmail.com',
    alamat: 'Jl. Braga No. 9, Bandung',
    catatan: 'Member baru, fokus pembentukan otot.',
    paketId: 'pkg-1',
    akhirDalam: 9,
  },
  {
    nama: 'Yoga Permana',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1989-06-05',
    noHp: '081234567813',
    email: 'yoga.permana@gmail.com',
    alamat: 'Jl. Ciumbuleuit No. 41, Bandung',
    catatan: 'Nonaktif sementara karena cedera ringan.',
    paketId: 'pkg-1',
    akhirDalam: -20,
    nonaktif: true,
  },
  {
    nama: 'Nadia Safitri',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1995-09-26',
    noHp: '081234567814',
    email: 'nadia.safitri@gmail.com',
    alamat: 'Jl. Kemuning No. 16, Bandung',
    catatan: 'Latihan 3x seminggu, program endurance.',
    paketId: 'pkg-3',
    akhirDalam: 27,
  },
  {
    nama: 'Hendra Gunawan',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1987-02-17',
    noHp: '081234567815',
    email: 'hendra.gunawan@gmail.com',
    alamat: 'Jl. Kiaracondong No. 230, Bandung',
    catatan: 'Terakhir aktif pertengahan tahun ini.',
    paketId: 'pkg-3',
    akhirDalam: -45,
  },
]

interface SeedRiwayat {
  memberId: string
  hariLalu: number
  status?: StatusTransaksi
  catatan?: string
}

/** Riwayat perpanjangan sebelum periode aktif saat ini. */
const RIWAYAT_TAMBAHAN: SeedRiwayat[] = [
  { memberId: 'MBR-001', hariLalu: 55, catatan: 'Perpanjangan paket bulanan.' },
  { memberId: 'MBR-001', hariLalu: 85, catatan: 'Pembayaran di resepsionis.' },
  { memberId: 'MBR-001', hariLalu: 115, catatan: 'Perpanjangan paket bulanan.' },
  { memberId: 'MBR-001', hariLalu: 145, catatan: 'Pembayaran via QRIS.' },
  { memberId: 'MBR-004', hariLalu: 58, catatan: 'Perpanjangan paket bulanan.' },
  { memberId: 'MBR-004', hariLalu: 118, catatan: 'Transfer BCA terverifikasi.' },
  { memberId: 'MBR-004', hariLalu: 148, catatan: 'Perpanjangan paket bulanan.' },
  { memberId: 'MBR-006', hariLalu: 47, catatan: 'Perpanjangan paket bulanan.' },
  { memberId: 'MBR-006', hariLalu: 77, catatan: 'Pembayaran tunai di resepsionis.' },
  { memberId: 'MBR-006', hariLalu: 107, catatan: 'Perpanjangan paket bulanan.' },
  {
    memberId: 'MBR-010',
    hariLalu: 74,
    catatan: 'Pembayaran tunai di resepsionis.',
  },
  {
    memberId: 'MBR-010',
    hariLalu: 104,
    status: 'Menunggu',
    catatan: 'Menunggu verifikasi transfer.',
  },
  {
    memberId: 'MBR-012',
    hariLalu: 51,
    status: 'Menunggu',
    catatan: 'Menunggu verifikasi transfer.',
  },
]

const METODE: MetodeBayar[] = ['QRIS', 'Transfer', 'Tunai', 'Transfer', 'QRIS', 'Tunai']

export interface SeedData {
  members: Member[]
  transactions: Transaksi[]
  packages: Paket[]
  pengaturan: Pengaturan
}

export function createSeedData(): SeedData {
  const packages = PAKET.map((paket) => ({ ...paket, fitur: [...paket.fitur] }))
  const today = todayISO()

  const members: Member[] = SEED_MEMBER.map((seed, index) => {
    const paket = packages.find((item) => item.id === seed.paketId) ?? packages[0]
    const tanggalBerakhir = addDays(today, seed.akhirDalam)
    const tanggalMulai = addDays(tanggalBerakhir, -paket.durasiHari)
    return {
      id: `MBR-${String(index + 1).padStart(3, '0')}`,
      nama: seed.nama,
      jenisKelamin: seed.jenisKelamin,
      tanggalLahir: seed.tanggalLahir,
      noHp: seed.noHp,
      email: seed.email,
      alamat: seed.alamat,
      catatan: seed.catatan,
      paketId: paket.id,
      tanggalMulai,
      tanggalBerakhir,
      status: seed.nonaktif ? 'Nonaktif' : seed.akhirDalam < 0 ? 'Kedaluwarsa' : 'Aktif',
    }
  })

  interface TransaksiSeed {
    memberId: string
    paketId: string
    tanggal: string
    status: StatusTransaksi
    catatan: string
  }

  const seeds: TransaksiSeed[] = members.map((member) => {
    const paket = packages.find((item) => item.id === member.paketId) ?? packages[0]
    return {
      memberId: member.id,
      paketId: member.paketId,
      tanggal: member.tanggalMulai,
      status: 'Lunas',
      catatan: `Perpanjangan paket ${paket.nama}.`,
    }
  })

  RIWAYAT_TAMBAHAN.forEach((riwayat) => {
    const member = members.find((item) => item.id === riwayat.memberId)
    const paket = packages.find((item) => item.id === member?.paketId)
    if (!member || !paket) return
    seeds.push({
      memberId: member.id,
      paketId: paket.id,
      tanggal: addDays(today, -riwayat.hariLalu),
      status: riwayat.status ?? 'Lunas',
      catatan: riwayat.catatan ?? `Perpanjangan paket ${paket.nama}.`,
    })
  })

  seeds.sort((a, b) => a.tanggal.localeCompare(b.tanggal))

  const transactions: Transaksi[] = seeds.map((seed, index) => {
    const paket = packages.find((item) => item.id === seed.paketId) ?? packages[0]
    return {
      id: `trx-${String(index + 1).padStart(3, '0')}`,
      invoice: `INV-${seed.tanggal.slice(0, 4)}-${String(index + 1).padStart(4, '0')}`,
      memberId: seed.memberId,
      paketId: seed.paketId,
      tanggal: seed.tanggal,
      jumlah: paket.harga,
      metode: seed.status === 'Menunggu' ? 'Transfer' : METODE[index % METODE.length],
      status: seed.status,
      catatan: seed.catatan,
    }
  })

  const pengaturan: Pengaturan = {
    gym: {
      nama: 'FitFusion Club',
      alamat: 'Jl. Asia Afrika No. 88, Bandung, Jawa Barat 40111',
      telepon: '022-423-8899',
    },
    admin: {
      nama: 'Raka Pratama',
      email: 'admin@fitfusion.id',
      telepon: '0812-3456-7890',
    },
  }

  return { members, transactions, packages, pengaturan }
}

export const AKUN_DEMO = {
  email: 'admin@fitfusion.id',
  password: 'fitfusion123',
}
