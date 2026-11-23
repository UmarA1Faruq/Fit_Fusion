import type { Member, MemberStatus, Paket } from '../types'
import { addDays, daysUntil, parseISO, todayISO } from './date'

/**
 * Status tersimpan hanya dipakai untuk penanda manual "Nonaktif".
 * Status Aktif/Kedaluwarsa selalu dihitung dari tanggal berakhir agar akurat.
 */
export function resolveMemberStatus(member: Member): MemberStatus {
  if (member.status === 'Nonaktif') return 'Nonaktif'
  return daysUntil(member.tanggalBerakhir) < 0 ? 'Kedaluwarsa' : 'Aktif'
}

export function sisaMasaAktifLabel(member: Member): string {
  if (member.status === 'Nonaktif') return 'Keanggotaan dinonaktifkan'
  const days = daysUntil(member.tanggalBerakhir)
  if (days < -1) return `Berakhir ${Math.abs(days)} hari lalu`
  if (days === -1) return 'Berakhir kemarin'
  if (days === 0) return 'Berakhir hari ini'
  if (days === 1) return 'Sisa 1 hari'
  return `Sisa ${days} hari`
}

export function persenMasaAktif(member: Member): number {
  const mulai = parseISO(member.tanggalMulai).getTime()
  const berakhir = parseISO(member.tanggalBerakhir).getTime()
  const sekarang = parseISO(todayISO()).getTime()
  const total = berakhir - mulai
  if (total <= 0) return 100
  const terpakai = sekarang - mulai
  return Math.min(100, Math.max(0, Math.round((terpakai / total) * 100)))
}

export interface PeriodeBaru {
  mulai: string
  berakhir: string
}

/**
 * Perpanjangan dihitung dari masa aktif yang masih berjalan (jika ada),
 * atau dari hari ini. Tanggal pembayaran yang mundur tidak memotong masa aktif.
 */
export function hitungPeriodeBaru(member: Member, paket: Paket, tanggalBayar: string): PeriodeBaru {
  const today = todayISO()
  const kandidat = [tanggalBayar, today, member.tanggalBerakhir]
  const dasar = kandidat.reduce((terbaru, nilai) => (nilai > terbaru ? nilai : terbaru), kandidat[0])
  const masihAktif = member.tanggalBerakhir >= today && member.status !== 'Nonaktif'
  const mulai = dasar === member.tanggalBerakhir && masihAktif ? member.tanggalMulai : dasar
  return {
    mulai,
    berakhir: addDays(dasar, paket.durasiHari),
  }
}

export function inisial(nama: string): string {
  const parts = nama.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function namaDepan(nama: string): string {
  return nama.trim().split(/\s+/)[0] ?? nama
}

export function normalisasiNomorHp(value: string): string {
  return value.replace(/[^\d+]/g, '')
}

export function validasiNomorHp(value: string): boolean {
  const nomor = normalisasiNomorHp(value)
  return /^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(nomor)
}

export function validasiEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}
