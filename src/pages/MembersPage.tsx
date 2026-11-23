import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  SearchX,
  Trash2,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { MemberStatusBadge } from '../components/ui/StatusBadges'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Inputs'
import { Table, TBody, TD, TH, THead, TR, TableEmpty } from '../components/ui/Table'
import { Pagination } from '../components/ui/Pagination'
import { Skeleton } from '../components/ui/Skeleton'
import { Modal } from '../components/ui/Modal'
import { formatTanggal, daysUntil } from '../utils/date'
import { resolveMemberStatus, sisaMasaAktifLabel } from '../utils/member'
import { delay } from '../utils/cn'
import type { Member, MemberStatus } from '../types'

type FilterStatus = 'Semua' | MemberStatus

const PER_HALAMAN = 8

export function MembersPage() {
  const { members, transactions, packages, deleteMember } = useApp()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<FilterStatus>('Semua')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const kata = query.trim().toLowerCase()
    return members.filter((member) => {
      const cocokCari =
        !kata ||
        member.nama.toLowerCase().includes(kata) ||
        member.id.toLowerCase().includes(kata) ||
        member.noHp.includes(kata)
      const cocokStatus = status === 'Semua' || resolveMemberStatus(member) === status
      return cocokCari && cocokStatus
    })
  }, [members, query, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_HALAMAN))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PER_HALAMAN
  const visible = filtered.slice(startIndex, startIndex + PER_HALAMAN)
  const adaFilter = query.trim() !== '' || status !== 'Semua'

  const transaksiTerkait = deleteTarget
    ? transactions.filter((transaksi) => transaksi.memberId === deleteTarget.id).length
    : 0

  function resetFilter() {
    setQuery('')
    setStatus('Semua')
    setPage(1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleting(true)
    await delay(550)
    const deleted = deleteMember(target.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (deleted) {
      toast({
        title: 'Member berhasil dihapus.',
        description:
          transaksiTerkait > 0
            ? `${target.nama} beserta ${transaksiTerkait} transaksi terkait sudah dihapus.`
            : `${target.nama} sudah dihapus dari daftar member.`,
        variant: 'success',
      })
    } else {
      toast({ title: 'Gagal menghapus member.', description: 'Data member tidak ditemukan.', variant: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member"
        description="Kelola data member, masa aktif keanggotaan, dan status mereka."
        actions={
          <Link to="/member/tambah">
            <Button iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>Tambah Member</Button>
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Cari nama, ID, atau no. HP…"
            ariaLabel="Cari member berdasarkan nama atau ID"
            className="w-full sm:max-w-sm"
          />

          <Select
            id="filter-status-member"
            aria-label="Filter status member"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as FilterStatus)
              setPage(1)
            }}
            className="sm:w-44"
          >
            <option value="Semua">Semua status</option>
            <option value="Aktif">Aktif</option>
            <option value="Kedaluwarsa">Kedaluwarsa</option>
            <option value="Nonaktif">Nonaktif</option>
          </Select>

          {adaFilter && (
            <Button variant="ghost" size="sm" onClick={resetFilter} iconLeft={<RotateCcw className="h-3.5 w-3.5" />}>
              Reset filter
            </Button>
          )}

          <p className="text-xs text-slate-500 sm:ml-auto">
            <span className="font-bold text-slate-700">{filtered.length}</span> dari {members.length} member
          </p>
        </div>

        <Table minWidth="min-w-[980px]">
          <THead>
            <TH>ID Member</TH>
            <TH>Nama</TH>
            <TH>No. HP</TH>
            <TH>Paket</TH>
            <TH>Tanggal Berakhir</TH>
            <TH>Status</TH>
            <TH align="right">Aksi</TH>
          </THead>
          <TBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0">
                  <TD><Skeleton className="h-6 w-16" /></TD>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-2.5 w-40" />
                      </div>
                    </div>
                  </TD>
                  <TD><Skeleton className="h-4 w-24" /></TD>
                  <TD><Skeleton className="h-5 w-16 rounded-full" /></TD>
                  <TD>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </TD>
                  <TD><Skeleton className="h-5 w-20 rounded-full" /></TD>
                  <TD align="right"><Skeleton className="ml-auto h-8 w-24" /></TD>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <TableEmpty
                colSpan={7}
                icon={adaFilter ? <SearchX className="h-6 w-6" aria-hidden="true" /> : <Users className="h-6 w-6" aria-hidden="true" />}
                title={adaFilter ? 'Member tidak ditemukan' : 'Belum ada member'}
                description={
                  adaFilter
                    ? 'Coba kata kunci lain atau ubah filter status untuk melihat hasil lainnya.'
                    : 'Tambahkan member pertama untuk mulai mencatat keanggotaan gym.'
                }
                action={
                  adaFilter ? (
                    <Button variant="secondary" size="sm" onClick={resetFilter} iconLeft={<RotateCcw className="h-3.5 w-3.5" />}>
                      Reset filter
                    </Button>
                  ) : (
                    <Link to="/member/tambah">
                      <Button size="sm" iconLeft={<Plus className="h-4 w-4" />}>Tambah Member</Button>
                    </Link>
                  )
                }
              />
            ) : (
              visible.map((member) => {
                const statusMember = resolveMemberStatus(member)
                const paket = packages.find((item) => item.id === member.paketId)
                const sisa = daysUntil(member.tanggalBerakhir)
                const akanBerakhir = statusMember === 'Aktif' && sisa >= 0 && sisa <= 7

                return (
                  <TR key={member.id}>
                    <TD>
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-600">
                        {member.id}
                      </span>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Avatar nama={member.nama} size="md" />
                        <div className="min-w-0">
                          <Link
                            to={`/member/${member.id}`}
                            className="block max-w-[220px] truncate text-sm font-semibold text-slate-900 transition hover:text-brand-600"
                          >
                            {member.nama}
                          </Link>
                          <p className="max-w-[220px] truncate text-[11px] text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <span className="text-sm tabular-nums text-slate-600">{member.noHp}</span>
                    </TD>
                    <TD>
                      <Badge variant="brand">{paket?.nama ?? '—'}</Badge>
                    </TD>
                    <TD>
                      <p className="text-sm font-medium text-slate-700">{formatTanggal(member.tanggalBerakhir)}</p>
                      <p
                        className={
                          statusMember === 'Kedaluwarsa'
                            ? 'text-[11px] text-rose-500'
                            : akanBerakhir
                              ? 'text-[11px] font-medium text-amber-600'
                              : 'text-[11px] text-slate-400'
                        }
                      >
                        {sisaMasaAktifLabel(member)}
                      </p>
                    </TD>
                    <TD>
                      <MemberStatusBadge status={statusMember} />
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/member/${member.id}`}
                          title="Lihat detail"
                          aria-label={`Lihat detail ${member.nama}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/member/${member.id}/ubah`}
                          title="Ubah member"
                          aria-label={`Ubah data ${member.nama}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(member)}
                          title="Hapus member"
                          aria-label={`Hapus ${member.nama}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
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
              dari <span className="font-semibold text-slate-700">{filtered.length}</span> member
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>

      <Modal
        open={deleteTarget !== null}
        onClose={() => {
          if (!deleting) setDeleteTarget(null)
        }}
        title="Hapus member?"
        description="Tindakan ini tidak dapat dibatalkan."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Batal
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete} iconLeft={<Trash2 className="h-4 w-4" />}>
              {deleting ? 'Menghapus…' : 'Hapus Member'}
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Avatar nama={deleteTarget.nama} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{deleteTarget.nama}</p>
                <p className="text-xs text-slate-500">
                  {deleteTarget.id} ·{' '}
                  {packages.find((item) => item.id === deleteTarget.paketId)?.nama ?? 'Tanpa paket'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                {transaksiTerkait > 0
                  ? `Ada ${transaksiTerkait} transaksi milik member ini yang juga akan dihapus dan tidak lagi dihitung pada pemasukan.`
                  : 'Member ini belum memiliki transaksi. Data tetap akan dihapus permanen dari sesi ini.'}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Yakin ingin menghapus <span className="font-semibold text-slate-700">{deleteTarget.nama}</span> dari
              daftar member FitFusion?
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
