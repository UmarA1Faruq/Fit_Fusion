import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Plus,
  ReceiptText,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Table, TBody, TD, TH, THead, TR, TableEmpty } from '../components/ui/Table'
import { StatusTransaksiBadge } from '../components/ui/StatusBadges'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../utils/format'
import {
  daysUntil,
  formatTanggal,
  getMonthKey,
  getRecentMonths,
  isSameMonth,
} from '../utils/date'
import { resolveMemberStatus, sisaMasaAktifLabel } from '../utils/member'
import { cn } from '../utils/cn'

export function DashboardPage() {
  const { members, transactions, packages, pengaturan } = useApp()
  const sekarang = new Date()
  const bulanIni = useMemo(() => getRecentMonths(6), [])

  const chartData = useMemo(
    () =>
      bulanIni.map((bulan) => ({
        ...bulan,
        total: transactions
          .filter((transaksi) => transaksi.status === 'Lunas' && getMonthKey(transaksi.tanggal) === bulan.key)
          .reduce((total, transaksi) => total + transaksi.jumlah, 0),
      })),
    [bulanIni, transactions],
  )

  const totalMember = members.length
  const memberAktif = members.filter((member) => resolveMemberStatus(member) === 'Aktif').length
  const memberBaru = members.filter((member) => isSameMonth(member.tanggalMulai, sekarang)).length

  const transaksiBulanIni = transactions.filter(
    (transaksi) => transaksi.status === 'Lunas' && isSameMonth(transaksi.tanggal, sekarang),
  )
  const pemasukanBulanIni = transaksiBulanIni.reduce((total, transaksi) => total + transaksi.jumlah, 0)

  const segeraBerakhir = members
    .filter((member) => {
      const sisa = daysUntil(member.tanggalBerakhir)
      return resolveMemberStatus(member) === 'Aktif' && sisa >= 0 && sisa <= 7
    })
    .sort((a, b) => a.tanggalBerakhir.localeCompare(b.tanggalBerakhir))

  const transaksiTerbaru = [...transactions]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.invoice.localeCompare(a.invoice))
    .slice(0, 5)

  const komposisi = [
    {
      label: 'Aktif',
      jumlah: memberAktif,
      warna: 'bg-emerald-500',
      dot: 'bg-emerald-500',
    },
    {
      label: 'Kedaluwarsa',
      jumlah: members.filter((member) => resolveMemberStatus(member) === 'Kedaluwarsa').length,
      warna: 'bg-rose-400',
      dot: 'bg-rose-400',
    },
    {
      label: 'Nonaktif',
      jumlah: members.filter((member) => resolveMemberStatus(member) === 'Nonaktif').length,
      warna: 'bg-slate-300',
      dot: 'bg-slate-300',
    },
  ]

  const totalEnamBulan = chartData.reduce((total, bulan) => total + bulan.total, 0)
  const maksimum = Math.max(...chartData.map((bulan) => bulan.total), 1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Selamat datang kembali, ${pengaturan.admin.nama.split(' ')[0]}. Ini ringkasan ${pengaturan.gym.nama} hari ini.`}
        actions={
          <>
            <Link to="/member/tambah">
              <Button variant="secondary" iconLeft={<UserPlus className="h-4 w-4" aria-hidden="true" />}>
                Tambah Member
              </Button>
            </Link>
            <Link to="/transaksi/tambah">
              <Button iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>Tambah Transaksi</Button>
            </Link>
          </>
        }
      />

      <section aria-label="Ringkasan utama" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Member"
          value={String(totalMember)}
          icon={Users}
          tone="orange"
          hint={
            <span>
              <span className="font-semibold text-emerald-600">+{memberBaru}</span> member baru bulan ini
            </span>
          }
        />
        <StatCard
          label="Member Aktif"
          value={String(memberAktif)}
          icon={UserCheck}
          tone="emerald"
          hint={
            <span>
              {formatPersen(totalMember > 0 ? (memberAktif / totalMember) * 100 : 0)} dari total member
            </span>
          }
        />
        <StatCard
          label="Pemasukan Bulan Ini"
          value={formatRupiah(pemasukanBulanIni)}
          icon={Wallet}
          tone="sky"
          hint={
            <span>
              Dari <span className="font-semibold text-slate-700">{transaksiBulanIni.length}</span> transaksi lunas
            </span>
          }
        />
        <StatCard
          label="Segera Berakhir"
          value={String(segeraBerakhir.length)}
          icon={CalendarClock}
          tone="amber"
          hint={
            <span className="text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Perlu pengingat perpanjangan
            </span>
          }
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Performa</p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                Pemasukan 6 Bulan Terakhir
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Total dari transaksi berstatus lunas, termasuk bulan berjalan.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total 6 bulan</p>
              <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                {formatRupiah(totalEnamBulan)}
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="relative h-52 sm:h-60" role="img" aria-label="Grafik batang pemasukan enam bulan terakhir">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div key={line} className="border-t border-dashed border-slate-100" />
                ))}
              </div>

              <div className="absolute inset-0 flex items-end gap-2 sm:gap-4">
                {chartData.map((bulan, index) => {
                  const tinggi = bulan.total > 0 ? Math.max(4, (bulan.total / maksimum) * 100) : 2
                  const bulanSekarang = index === chartData.length - 1
                  return (
                    <div
                      key={bulan.key}
                      className="group flex h-full flex-1 flex-col items-center justify-end"
                      aria-hidden="true"
                    >
                      <span
                        className={cn(
                          'mb-1.5 hidden text-[10px] font-semibold tabular-nums sm:block',
                          bulanSekarang ? 'text-brand-600' : 'text-slate-400',
                        )}
                      >
                        {bulan.total > 0 ? formatRupiahRingkas(bulan.total) : ''}
                      </span>
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div
                          className={cn(
                            'w-full max-w-[46px] rounded-t-lg bg-gradient-to-t transition-all duration-300 group-hover:opacity-80',
                            bulanSekarang
                              ? 'from-brand-600 to-brand-400'
                              : 'from-brand-500 to-brand-300',
                          )}
                          style={{ height: `${tinggi}%` }}
                          title={`${bulan.label} ${bulan.tahun}: ${formatRupiah(bulan.total)}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2 sm:gap-4">
              {chartData.map((bulan, index) => (
                <div
                  key={bulan.key}
                  className={cn(
                    'flex-1 text-center text-[11px] font-semibold',
                    index === chartData.length - 1 ? 'text-brand-600' : 'text-slate-500',
                  )}
                >
                  {bulan.label}
                </div>
              ))}
            </div>

            <ul className="sr-only">
              {chartData.map((bulan) => (
                <li key={bulan.key}>
                  {bulan.label} {bulan.tahun}: {formatRupiah(bulan.total)}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="Komposisi Member" subtitle="Berdasarkan status keanggotaan." />
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900">{totalMember}</p>
                <p className="mt-1 text-xs text-slate-500">member terdaftar</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              {komposisi.map((item) => (
                <div
                  key={item.label}
                  className={cn('h-full transition-all', item.warna)}
                  style={{ width: `${totalMember > 0 ? (item.jumlah / totalMember) * 100 : 0}%` }}
                />
              ))}
            </div>

            <ul className="mt-5 space-y-3">
              {komposisi.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm">
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', item.dot)} aria-hidden="true" />
                  <span className="flex-1 text-slate-600">{item.label}</span>
                  <span className="font-bold tabular-nums text-slate-900">{item.jumlah}</span>
                  <span className="w-10 text-right text-xs tabular-nums text-slate-400">
                    {totalMember > 0 ? formatPersen((item.jumlah / totalMember) * 100) : '0%'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <Link
                to="/member"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                Kelola semua member
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            title="Member Segera Berakhir"
            subtitle="Masa aktif habis dalam 7 hari ke depan."
            action={
              <Link
                to="/member"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700"
              >
                Lihat semua
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <Table minWidth="min-w-[560px]">
            <THead>
              <TH>Member</TH>
              <TH>Paket</TH>
              <TH>Berakhir</TH>
              <TH align="right">Aksi</TH>
            </THead>
            <TBody>
              {segeraBerakhir.length === 0 ? (
                <TableEmpty
                  colSpan={4}
                  icon={<CalendarClock className="h-6 w-6" aria-hidden="true" />}
                  title="Tidak ada member yang segera berakhir"
                  description="Semua member aktif masih punya sisa masa aktif lebih dari 7 hari."
                />
              ) : (
                segeraBerakhir.slice(0, 5).map((member) => {
                  const paket = packages.find((item) => item.id === member.paketId)?.nama ?? '—'
                  return (
                    <TR key={member.id}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <Avatar nama={member.nama} size="sm" />
                          <div className="min-w-0">
                            <Link
                              to={`/member/${member.id}`}
                              className="block truncate text-sm font-semibold text-slate-900 hover:text-brand-600"
                            >
                              {member.nama}
                            </Link>
                            <p className="text-[11px] text-slate-400">{member.id}</p>
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <Badge variant="brand">{paket}</Badge>
                      </TD>
                      <TD>
                        <p className="text-sm font-medium text-slate-700">{formatTanggal(member.tanggalBerakhir)}</p>
                        <p className="text-[11px] text-amber-600">{sisaMasaAktifLabel(member)}</p>
                      </TD>
                      <TD align="right">
                        <Link
                          to={`/member/${member.id}`}
                          aria-label={`Lihat detail ${member.nama}`}
                          className="inline-grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </TD>
                    </TR>
                  )
                })
              )}
            </TBody>
          </Table>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title="Transaksi Terbaru"
            subtitle="Pembayaran yang baru masuk."
            action={
              <Link
                to="/transaksi"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700"
              >
                Lihat semua
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <Table minWidth="min-w-[620px]">
            <THead>
              <TH>No. Invoice</TH>
              <TH>Member</TH>
              <TH>Tanggal</TH>
              <TH align="right">Jumlah</TH>
              <TH align="right">Status</TH>
            </THead>
            <TBody>
              {transaksiTerbaru.length === 0 ? (
                <TableEmpty
                  colSpan={5}
                  icon={<ReceiptText className="h-6 w-6" aria-hidden="true" />}
                  title="Belum ada transaksi"
                  description="Transaksi yang kamu catat akan muncul di sini."
                  action={
                    <Link to="/transaksi/tambah">
                      <Button size="sm" iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>
                        Tambah Transaksi
                      </Button>
                    </Link>
                  }
                />
              ) : (
                transaksiTerbaru.map((transaksi) => {
                  const member = members.find((item) => item.id === transaksi.memberId)
                  return (
                    <TR key={transaksi.id}>
                      <TD>
                        <p className="font-mono text-[11px] font-semibold text-slate-700">{transaksi.invoice}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">via {transaksi.metode}</p>
                      </TD>
                      <TD>
                        <div className="flex items-center gap-2.5">
                          <Avatar nama={member?.nama ?? '?'} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{member?.nama ?? 'Member dihapus'}</p>
                            <p className="text-[11px] text-slate-400">{transaksi.memberId}</p>
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <span className="text-sm text-slate-600">{formatTanggal(transaksi.tanggal)}</span>
                      </TD>
                      <TD align="right">
                        <span className="text-sm font-bold tabular-nums text-slate-900">
                          {formatRupiah(transaksi.jumlah)}
                        </span>
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
        </Card>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 text-[11px] text-slate-400">
        <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Angka pemasukan dihitung dari transaksi berstatus lunas. Data diperbarui otomatis saat kamu mencatat
        pembayaran baru.
      </div>
    </div>
  )
}
