import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ReceiptText,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { MemberStatusBadge, MetodeLabel, StatusTransaksiBadge } from '../components/ui/StatusBadges'
import { Table, TBody, TD, TH, THead, TR, TableEmpty } from '../components/ui/Table'
import { EmptyState } from '../components/ui/EmptyState'
import { formatTanggal, daysUntil } from '../utils/date'
import { formatRupiah, labelDurasiPanjang } from '../utils/format'
import { persenMasaAktif, resolveMemberStatus, sisaMasaAktifLabel } from '../utils/member'
import { cn } from '../utils/cn'

export function MemberDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { members, transactions, packages } = useApp()
  const member = members.find((item) => item.id === id)

  if (!member) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[{ label: 'Member', to: '/member' }, { label: 'Tidak ditemukan' }]} />
        <Card>
          <EmptyState
            icon={<Users className="h-6 w-6" aria-hidden="true" />}
            title="Member tidak ditemukan"
            description="Member yang kamu cari mungkin sudah dihapus atau ID-nya tidak valid."
            action={
              <Link to="/member">
                <Button variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                  Kembali ke daftar member
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    )
  }

  const paket = packages.find((item) => item.id === member.paketId)
  const status = resolveMemberStatus(member)
  const sisaHari = daysUntil(member.tanggalBerakhir)
  const riwayat = transactions
    .filter((transaksi) => transaksi.memberId === member.id)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.invoice.localeCompare(a.invoice))
  const totalPembayaran = riwayat
    .filter((transaksi) => transaksi.status === 'Lunas')
    .reduce((total, transaksi) => total + transaksi.jumlah, 0)
  const persen = persenMasaAktif(member)
  const mendesak = status === 'Aktif' && sisaHari >= 0 && sisaHari <= 7

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Member', to: '/member' }, { label: member.nama }]} />

      <PageHeader
        title="Detail Member"
        description="Profil lengkap, status keanggotaan, dan riwayat pembayaran member."
        actions={
          <>
            <Link to="/member">
              <Button variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
                Kembali
              </Button>
            </Link>
            <Link to={`/member/${member.id}/ubah`}>
              <Button variant="secondary" iconLeft={<Pencil className="h-4 w-4" aria-hidden="true" />}>
                Ubah Data
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="relative h-24 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-700">
            <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/10" aria-hidden="true" />
            <Avatar
              nama={member.nama}
              size="xl"
              ring
              className="absolute -bottom-10 left-5 sm:left-7"
            />
          </div>

          <div className="px-5 pb-6 pt-14 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    {member.nama}
                  </h2>
                  <MemberStatusBadge status={status} />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                    {member.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Member sejak {formatTanggal(member.tanggalMulai)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/transaksi/tambah?member=${member.id}`)}
                iconLeft={<CreditCard className="h-4 w-4" aria-hidden="true" />}
                className="shrink-0"
              >
                Perpanjang
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <InfoItem
                icon={Phone}
                label="No. HP"
                value={member.noHp}
                href={`tel:${member.noHp}`}
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={member.email || 'Belum diisi'}
                href={member.email ? `mailto:${member.email}` : undefined}
              />
              <InfoItem
                icon={CalendarDays}
                label="Tanggal Lahir"
                value={member.tanggalLahir ? formatTanggal(member.tanggalLahir) : 'Belum diisi'}
              />
              <InfoItem icon={UserRound} label="Jenis Kelamin" value={member.jenisKelamin} />
              <InfoItem
                icon={MapPin}
                label="Alamat"
                value={member.alamat || 'Belum diisi'}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Catatan Member
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {member.catatan || 'Belum ada catatan khusus untuk member ini.'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold tracking-tight text-slate-900">Masa Aktif</h2>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <CalendarClock className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            </div>

            {status === 'Nonaktif' ? (
              <div className="mt-4">
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">Nonaktif</p>
                <p className="mt-1 text-xs text-slate-500">Keanggotaan sedang dibekukan sementara.</p>
              </div>
            ) : sisaHari < 0 ? (
              <div className="mt-4">
                <p className="text-2xl font-extrabold tracking-tight text-rose-600">
                  {Math.abs(sisaHari)} <span className="text-sm font-semibold text-slate-500">hari lalu berakhir</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{sisaMasaAktifLabel(member)}</p>
              </div>
            ) : (
              <div className="mt-4">
                <p
                  className={cn(
                    'text-3xl font-extrabold tracking-tight',
                    mendesak ? 'text-amber-600' : 'text-slate-900',
                  )}
                >
                  {sisaHari} <span className="text-sm font-semibold text-slate-500">hari tersisa</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {mendesak ? 'Segera ingatkan member untuk perpanjangan.' : sisaMasaAktifLabel(member)}
                </p>
              </div>
            )}

            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    status === 'Nonaktif'
                      ? 'bg-slate-300'
                      : sisaHari < 0
                        ? 'bg-rose-400'
                        : mendesak
                          ? 'bg-amber-500'
                          : 'bg-brand-500',
                  )}
                  style={{ width: `${status === 'Nonaktif' ? 100 : persen}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-slate-400">
                <span>{formatTanggal(member.tanggalMulai)}</span>
                <span>{formatTanggal(member.tanggalBerakhir)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <dl className="space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-slate-500">Paket aktif</dt>
                <dd>
                  <Badge variant="brand">{paket?.nama ?? '—'}</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-slate-500">Durasi paket</dt>
                <dd className="text-xs font-semibold text-slate-700">
                  {paket ? labelDurasiPanjang(paket.durasiHari) : '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-slate-500">Berakhir pada</dt>
                <dd className="text-xs font-semibold text-slate-700">{formatTanggal(member.tanggalBerakhir)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-slate-500">Status</dt>
                <dd>
                  <MemberStatusBadge status={status} />
                </dd>
              </div>
            </dl>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Transaksi</p>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{riwayat.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Total bayar</p>
                <p className="mt-1 truncate text-[13px] font-extrabold tracking-tight text-slate-900">
                  {formatRupiah(totalPembayaran)}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              <Button
                fullWidth
                onClick={() => navigate(`/transaksi/tambah?member=${member.id}`)}
                iconLeft={<Wallet className="h-4 w-4" aria-hidden="true" />}
              >
                Perpanjang / Catat Pembayaran
              </Button>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Invoice akan dibuat otomatis setelah disimpan.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader
          title="Riwayat Transaksi"
          subtitle={`${riwayat.length} transaksi tercatat untuk ${member.nama}.`}
          action={
            <Link
              to="/transaksi"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700"
            >
              Lihat semua transaksi
            </Link>
          }
        />
        <Table minWidth="min-w-[760px]">
          <THead>
            <TH>No. Invoice</TH>
            <TH>Tanggal</TH>
            <TH>Paket</TH>
            <TH align="right">Jumlah</TH>
            <TH>Metode</TH>
            <TH align="right">Status</TH>
          </THead>
          <TBody>
            {riwayat.length === 0 ? (
              <TableEmpty
                colSpan={6}
                icon={<ReceiptText className="h-6 w-6" aria-hidden="true" />}
                title="Belum ada transaksi"
                description="Catat pembayaran pertama untuk member ini agar riwayat dan masa aktifnya tercatat."
                action={
                  <Button
                    size="sm"
                    onClick={() => navigate(`/transaksi/tambah?member=${member.id}`)}
                    iconLeft={<CreditCard className="h-4 w-4" />}
                  >
                    Catat Pembayaran
                  </Button>
                }
              />
            ) : (
              riwayat.map((transaksi) => {
                const paketTransaksi = packages.find((item) => item.id === transaksi.paketId)
                return (
                  <TR key={transaksi.id}>
                    <TD>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">{transaksi.invoice}</span>
                    </TD>
                    <TD>
                      <span className="text-sm text-slate-600">{formatTanggal(transaksi.tanggal)}</span>
                    </TD>
                    <TD>
                      <span className="text-sm text-slate-600">{paketTransaksi?.nama ?? '—'}</span>
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
      </Card>
    </div>
  )
}

interface InfoItemProps {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  className?: string
}

function InfoItem({ icon: Icon, label, value, href, className }: InfoItemProps) {
  return (
    <div className={cn('flex min-w-0 items-start gap-2.5', className)}>
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
        {href ? (
          <a
            href={href}
            className="mt-0.5 block truncate text-sm font-medium text-slate-700 transition hover:text-brand-600"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-medium leading-relaxed text-slate-700">{value}</p>
        )}
      </div>
    </div>
  )
}
