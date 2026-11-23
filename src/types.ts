export type JenisKelamin = 'Laki-laki' | 'Perempuan'

export type MemberStatus = 'Aktif' | 'Kedaluwarsa' | 'Nonaktif'

export type MetodeBayar = 'Tunai' | 'Transfer' | 'QRIS'

export type StatusTransaksi = 'Lunas' | 'Menunggu'

export interface Paket {
  id: string
  nama: string
  durasiHari: number
  harga: number
  deskripsi: string
  fitur: string[]
}

export interface Member {
  id: string
  nama: string
  jenisKelamin: JenisKelamin
  tanggalLahir: string
  noHp: string
  email: string
  alamat: string
  catatan: string
  paketId: string
  tanggalMulai: string
  tanggalBerakhir: string
  status: MemberStatus
}

export interface Transaksi {
  id: string
  invoice: string
  memberId: string
  paketId: string
  tanggal: string
  jumlah: number
  metode: MetodeBayar
  status: StatusTransaksi
  catatan: string
}

export interface MemberInput {
  nama: string
  jenisKelamin: JenisKelamin
  tanggalLahir: string
  noHp: string
  email: string
  alamat: string
  catatan: string
  paketId: string
  tanggalMulai: string
}

export interface TransaksiInput {
  memberId: string
  paketId: string
  tanggal: string
  metode: MetodeBayar
  catatan: string
}

export interface PaketInput {
  nama: string
  durasiHari: number
  harga: number
  deskripsi: string
  fitur: string[]
}

export interface ProfilGym {
  nama: string
  alamat: string
  telepon: string
}

export interface ProfilAdmin {
  nama: string
  email: string
  telepon: string
}

export interface Pengaturan {
  gym: ProfilGym
  admin: ProfilAdmin
}
