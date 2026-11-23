const formatter = new Intl.NumberFormat('id-ID')

/** Rp250.000 */
export function formatRupiah(value: number): string {
  return `Rp${formatter.format(Math.round(value))}`
}

/** Rp2,4 jt — untuk label grafik yang sempit. */
export function formatRupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  }
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
  }
  if (value >= 1_000) {
    return `Rp${(value / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`
  }
  return formatRupiah(value)
}

export function formatAngka(value: number): string {
  return formatter.format(value)
}

export function formatPersen(value: number): string {
  return `${Math.round(value)}%`
}

export function labelDurasi(hari: number): string {
  if (hari === 30) return 'bulan'
  if (hari === 90) return '3 bulan'
  if (hari === 365) return 'tahun'
  if (hari === 7) return 'minggu'
  if (hari % 30 === 0) return `${hari / 30} bulan`
  return `${hari} hari`
}

export function labelDurasiPanjang(hari: number): string {
  if (hari === 30) return '1 bulan'
  if (hari === 365) return '1 tahun'
  return `${hari} hari`
}
