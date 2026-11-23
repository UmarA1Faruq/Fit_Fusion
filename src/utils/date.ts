export const BULAN_SINGKAT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

export const BULAN_PANJANG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

/** Mengubah Date menjadi string YYYY-MM-DD berdasarkan waktu lokal. */
export function toISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Membaca YYYY-MM-DD sebagai tengah malam waktu lokal (menghindari geser zona waktu). */
export function parseISO(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function todayISO(): string {
  return toISO(new Date())
}

export function addDays(value: string, days: number): string {
  const date = parseISO(value)
  date.setDate(date.getDate() + days)
  return toISO(date)
}

/** Selisih hari dari hari ini menuju tanggal target. Negatif berarti sudah lewat. */
export function daysUntil(value: string): number {
  const target = parseISO(value)
  const today = startOfDay(new Date())
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000)
}

export function formatTanggal(value: string): string {
  if (!value) return '—'
  const date = parseISO(value)
  return `${date.getDate()} ${BULAN_SINGKAT[date.getMonth()]} ${date.getFullYear()}`
}

export function formatTanggalLengkap(date: Date): string {
  return `${HARI[date.getDay()]}, ${date.getDate()} ${BULAN_PANJANG[date.getMonth()]} ${date.getFullYear()}`
}

export function formatTanggalLahir(value: string): string {
  return formatTanggal(value)
}

export function isSameMonth(value: string, date: Date): boolean {
  const parsed = parseISO(value)
  return parsed.getMonth() === date.getMonth() && parsed.getFullYear() === date.getFullYear()
}

export interface RentangBulan {
  key: string
  label: string
  bulan: number
  tahun: number
}

/** Enam bulan terakhir termasuk bulan berjalan. */
export function getRecentMonths(count: number): RentangBulan[] {
  const now = new Date()
  const months: RentangBulan[] = []
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: BULAN_SINGKAT[date.getMonth()],
      bulan: date.getMonth(),
      tahun: date.getFullYear(),
    })
  }
  return months
}

/** Selisih bulan (bisa negatif) antara dua tanggal. */
export function monthsDiff(value: string, reference: Date): number {
  const date = parseISO(value)
  return (date.getFullYear() - reference.getFullYear()) * 12 + (date.getMonth() - reference.getMonth())
}

export function getMonthKey(value: string): string {
  const date = parseISO(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}
