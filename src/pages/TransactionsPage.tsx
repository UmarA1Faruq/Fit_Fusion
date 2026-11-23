import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Banknote,
  CalendarDays,
  Landmark,
  Plus,
  QrCode,
  ReceiptText,
  RotateCcw,
  SearchX,
  Wallet,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { MetodeLabel, StatusTransaksiBadge } from '../components/ui/StatusBadges'
import { SearchInput } from '../components/ui/SearchInput'
import { Input, Select } from '../components/ui/Inputs'
import { Table, TBody, TD, TH, THead, TR, TableEmpty } from '../components/ui/Table'
import { Pagination } from '../components/ui/Pagination'
import { Skeleton } from '../components/ui/Skeleton'
import { formatRupiah } from '../utils/format'
import { formatTanggal } from '../utils/date'
import { cn } from '../utils/cn'
import type { MetodeBayar } from '../types'

type FilterMetode = 'Semua' | MetodeBayar

const PER_HALAMAN = 8

const metodeRingkasan = [
  { metode: 'Tunai' as const, icon: Banknote, warna: 'text-emerald-400' },
  { metode: 'Transfer' as const, icon: Landmark, warna: 'text-sky-400' },
  { metode: 'QRIS' as const, icon: QrCode, warna: 'text-violet-400' },
]

export function TransactionsPage() {
  const { transactions, members, packages } = useApp()

  const [query, setQuery] = useState('')
  const [metode, setMetode] = useState<FilterMetode>('Semua')
  const [dari, setDari] = useState('')
  const [sampai, setSampai] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const rentangTidakValid = Boolean(dari && sampai && dari > sampai)

  const filtered = useMemo(() => {
    const kata = query.trim().toLowerCase()
    return transactions
      .filter((transaksi) => {
        const member = members.find((item) => item.id === transaksi.memberId)
        const cocokCari =
          !kata ||
          transaksi.invoice.toLowerCase().includes(kata) ||
          transaksi.memberId.toLowerCase().includes(kata) ||
          (member?.nama.toLowerCase().includes(kata) ?? false)
        const cocokMetode = metode === 'Semua' || transaksi.metode === metode
        const cocokDari = !dari || transaksi.tanggal >= dari
        const cocokSampai = !sampai || transaksi.tanggal <= sampai
        return cocokCari && cocokMetode && cocokDari && cocokSampai
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.invoice.localeCompare(a.invoice))
  }, [transactions, members, query, metode, dari, sampai])

  const lunas = filtered.filter((transaksi) => transaksi.status === 'Lunas')
  const totalPemasukan = lunas.reduce((total, transaksi) => total + transaksi.jumlah, 0)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_HALAMAN))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PER_HALAMAN
  const visible = filtered.slice(startIndex, startIndex + PER_HALAMAN)
  const adaFilter = Boolean(query.trim() || dari || sampai || metode !== 'Semua')

  function resetFilter() {
    setQuery('')
    setMetode('Semua')
    setDari('')
    setSampai('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaksi"
        description="Pantau pembayaran membership, invoice, dan pemasukan gym."
        actions={
          <Link to="/transaksi/tambah">
            <Button iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>Tambah Transaksi</Button>
          </Link>
        }
      />

      <section
        aria-label="Ringkasan pemasukan"
        className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-soft sm:p-6"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full border border-white/10" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
              <Wallet className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Total Pemasukan · Lunas
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {formatRupiah(totalPemasukan)}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                {lunas.length} transaksi lunas dari {filtered.length} hasil filter
                {adaFilter ? ' saat ini' : ' keseluruhan'}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 lg:min-w-[340px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {metodeRingkasan.map((item) => {
              const Icon = item.icon
              const total = lunas
                .filter((transaksi) => transaksi.metode === item.metode)
                .reduce((jumlah, transaksi) => jumlah + transaksi.jumlah, 0)
              return (
                <div key={item.metode}>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Icon className={cn('h-3.5 w-3.5', item.warna)} aria-hidden="true" />
                    {item.metode}
                  </div>
                  <p className="mt-1 truncate text-[11px] font-bold tabular-nums text-white sm:text-xs">
                    {formatRupiah(total)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Cari invoice, nama, atau ID member…"
              ariaLabel="Cari transaksi berdasarkan invoice atau member"
              className="w-full sm:max-w-sm"
            />

            <Select
              id="filter-metode"
              aria-label="Filter metode pembayaran"
              value={metode}
              onChange={(event) => {
                setMetode(event.target.value as FilterMetode)
                setPage(1)
              }}
              className="sm:w-40"
            >
              <option value="Semua">Semua metode</option>
              <option value="Tunai">Tunai</option>
              <option value="Transfer">Transfer</option>
              <option value="QRIS">QRIS</option>
            </Select>

            {adaFilter && (
              <Button variant="ghost" size="sm" onClick={resetFilter} iconLeft={<RotateCcw className="h-3.5 w-3.5" />}>
                Reset filter
              </Button>
            )}

            <p className="text-xs text-slate-500 sm:ml-auto">
              <span className="font-bold text-slate-700">{filtered.length}</span> transaksi
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              Rentang tanggal
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                aria-label="Filter tanggal mulai"
                value={dari}
                onChange={(event) => {
                  setDari(event.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-40"
              />
              <span className="shrink-0 text-xs text-slate-400">s.d.</span>
              <Input
                type="date"
                aria-label="Filter tanggal akhir"
                value={sampai}
                onChange={(event) => {
                  setSampai(event.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-40"
              />
            </div>
          </div>

          {rentangTidakValid && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              Tanggal awal tidak boleh setelah tanggal akhir. Perbaiki rentang untuk melihat hasil.
            </p>
          )}
        </div>

        <Table minWidth="min-w-[1000px]">
          <THead>
            <TH>No. Invoice</TH>
            <TH>Tanggal</TH>
            <TH>Member</TH>
            <TH>Paket</TH>
            <TH align="right">Jumlah</TH>
            <TH>Metode</TH>
            <TH align="right">Status</TH>
          </THead>
          <TBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0">
                  <TD><Skeleton className="h-4 w-28" /></TD>
                  <TD><Skeleton className="h-4 w-20" /></TD>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                    </div>
                  </TD>
                  <TD><Skeleton className="h-4 w-16" /></TD>
                  <TD align="right"><Skeleton className="ml-auto h-4 w-24" /></TD>
                  <TD><Skeleton className="h-5 w-20" /></TD>
                  <TD align="right"><Skeleton className="ml-auto h-5 w-16 rounded-full" /></TD>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <TableEmpty
                colSpan={7}
                icon={adaFilter ? <SearchX className="h-6 w-6" aria-hidden="true" /> : <ReceiptText className="h-6 w-6" aria-hidden="true" />}
                title={adaFilter ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi'}
                description={
                  rentangTidakValid
                    ? 'Rentang tanggal yang dipilih tidak valid. Perbaiki filter untuk melanjutkan.'
                    : adaFilter
                      ? 'Coba ubah kata kunci, metode, atau rentang tanggal pencarian.'
                      : 'Catat pembayaran member pertamamu. Invoice akan dibuat otomatis.'
                }
                action={
                  adaFilter ? (
                    <Button variant="secondary" size="sm" onClick={resetFilter} iconLeft={<RotateCcw className="h-3.5 w-3.5" />}>
                      Reset filter
                    </Button>
                  ) : (
                    <Link to="/transaksi/tambah">
                      <Button size="sm" iconLeft={<Plus className="h-4 w-4" />}>Tambah Transaksi</Button>
                    </Link>
                  )
                }
              />
            ) : (
              visible.map((transaksi) => {
                const member = members.find((item) => item.id === transaksi.memberId)
                const paket = packages.find((item) => item.id === transaksi.paketId)
                return (
                  <TR key={transaksi.id}>
                    <TD>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">{transaksi.invoice}</span>
                    </TD>
                    <TD>
                      <span className="text-sm text-slate-600">{formatTanggal(transaksi.tanggal)}</span>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <Avatar nama={member?.nama ?? '?'} size="sm" />
                        <div className="min-w-0">
                          {member ? (
                            <Link
                              to={`/member/${member.id}`}
                              className="block max-w-[180px] truncate text-sm font-semibold text-slate-900 transition hover:text-brand-600"
                            >
                              {member.nama}
                            </Link>
                          ) : (
                            <p className="text-sm font-semibold text-slate-400">Member dihapus</p>
                          )}
                          <p className="text-[11px] text-slate-400">{transaksi.memberId}</p>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <Badge variant="brand">{paket?.nama ?? '—'}</Badge>
                    </TD>
                    <TD align="right">
                      <span className="text-sm font-bold tabular-nums text-slate-900">
                        {formatRupiah(transaksi.jumlah)}
                      </span>
                    </TD>
                    <TD>
                      <MetodeLabel metode={transaksi.metode} />
                    </TD>
                    <TD align="right">
                      <StatusTransaksiBadge status={transaksi.status} />
                    </TD>
                  </TR>
                )
              })
            )}
          </TBody>
        </Table>

        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{startIndex + 1}</span>–
              <span className="font-semibold text-slate-700">{Math.min(startIndex + PER_HALAMAN, filtered.length)}</span>{' '}
              dari <span className="font-semibold text-slate-700">{filtered.length}</span> transaksi
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>

      <p className="text-[11px] leading-relaxed text-slate-400">
        Total pemasukan hanya menghitung transaksi berstatus <span className="font-semibold text-slate-500">Lunas</span>.
        Transaksi berstatus Menunggu tetap tampil pada tabel tetapi belum dihitung sebagai pemasukan.
      </p>
    </div>
  )
}
