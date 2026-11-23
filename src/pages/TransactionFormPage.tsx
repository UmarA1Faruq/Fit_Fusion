import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  CalendarDays,
  Check,
  CreditCard,
  Landmark,
  QrCode,
  ReceiptText,
  Wallet,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { Input, Textarea } from '../components/ui/Inputs'
import { Avatar } from '../components/ui/Avatar'
import { MemberStatusBadge } from '../components/ui/StatusBadges'
import { MemberCombobox } from '../components/MemberCombobox'
import { delay, cn } from '../utils/cn'
import { formatTanggal, todayISO } from '../utils/date'
import { formatRupiah, labelDurasiPanjang } from '../utils/format'
import { hitungPeriodeBaru, resolveMemberStatus } from '../utils/member'
import type { MetodeBayar } from '../types'

type FormErrors = {
  memberId?: string
  paketId?: string
  tanggal?: string
  metode?: string
}

const METODE = [
  { value: 'Tunai' as const, label: 'Tunai', description: 'Bayar di tempat', icon: Banknote },
  { value: 'Transfer' as const, label: 'Transfer', description: 'Transfer bank', icon: Landmark },
  { value: 'QRIS' as const, label: 'QRIS', description: 'Scan kode QR', icon: QrCode },
]

export function TransactionFormPage() {
  const { members, packages, addTransaction } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const memberAwal = members.find((member) => member.id === searchParams.get('member'))

  const [memberId, setMemberId] = useState(memberAwal?.id ?? '')
  const [paketId, setPaketId] = useState(memberAwal?.paketId ?? packages[0]?.id ?? '')
  const [tanggal, setTanggal] = useState(todayISO())
  const [metode, setMetode] = useState<MetodeBayar>('Tunai')
  const [catatan, setCatatan] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const member = members.find((item) => item.id === memberId)
  const paket = packages.find((item) => item.id === paketId)
  const periodeBaru = member && paket && tanggal ? hitungPeriodeBaru(member, paket, tanggal) : null

  function pilihMember(id: string) {
    setMemberId(id)
    setErrors((prev) => ({ ...prev, memberId: undefined }))
    const dipilih = members.find((item) => item.id === id)
    if (dipilih) setPaketId(dipilih.paketId)
  }

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!memberId) {
      next.memberId = 'Pilih member yang melakukan pembayaran.'
    }
    if (!paketId) {
      next.paketId = 'Pilih paket membership.'
    }
    if (!tanggal) {
      next.tanggal = 'Tanggal transaksi wajib diisi.'
    } else if (tanggal > todayISO()) {
      next.tanggal = 'Tanggal transaksi tidak boleh melebihi hari ini.'
    }
    if (!metode) {
      next.metode = 'Pilih metode pembayaran.'
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: 'Periksa data pembayaran.',
        description: 'Lengkapi member, paket, dan tanggal sebelum menyimpan transaksi.',
        variant: 'error',
      })
      return
    }

    setSaving(true)
    await delay(700)

    const hasil = addTransaction({
      memberId,
      paketId,
      tanggal,
      metode,
      catatan,
    })

    setSaving(false)

    if (!hasil) {
      toast({
        title: 'Gagal menyimpan transaksi.',
        description: 'Member atau paket yang dipilih tidak ditemukan.',
        variant: 'error',
      })
      return
    }

    toast({
      title: 'Transaksi berhasil disimpan.',
      description: `${hasil.transaksi.invoice} · ${formatRupiah(hasil.transaksi.jumlah)} untuk ${hasil.member.nama}. Masa aktif diperbarui hingga ${formatTanggal(hasil.member.tanggalBerakhir)}.`,
      variant: 'success',
      duration: 5200,
    })
    navigate('/transaksi')
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Transaksi', to: '/transaksi' }, { label: 'Tambah Transaksi' }]} />

      <PageHeader
        title="Tambah Transaksi"
        description="Catat pembayaran membership. Masa aktif member dan invoice akan diperbarui otomatis."
        actions={
          <Link to="/transaksi">
            <Button variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
              Kembali
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <Card>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-[15px] font-bold tracking-tight text-slate-900">Detail Pembayaran</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Pilih member, paket, dan metode pembayaran yang diterima.
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <ReceiptText className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <FormField id="memberId" label="Member" required error={errors.memberId}>
                  <MemberCombobox
                    id="memberId"
                    members={members}
                    value={memberId}
                    onChange={pilihMember}
                    invalid={Boolean(errors.memberId)}
                  />
                </FormField>

                <fieldset aria-describedby={errors.paketId ? 'paketId-error' : undefined}>
                  <legend className="label">
                    Paket Membership
                    <span className="ml-1 text-brand-500" aria-hidden="true">*</span>
                    <span className="sr-only"> (wajib diisi)</span>
                  </legend>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {packages.map((item) => {
                      const dipilih = item.id === paketId
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            'relative flex cursor-pointer flex-col rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-brand-500/30',
                            dipilih
                              ? 'border-brand-400 bg-brand-50/70 ring-1 ring-brand-200'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60',
                          )}
                        >
                          <input
                            type="radio"
                            name="paketId"
                            value={item.id}
                            checked={dipilih}
                            onChange={() => {
                              setPaketId(item.id)
                              setErrors((prev) => ({ ...prev, paketId: undefined }))
                            }}
                            className="sr-only"
                          />
                          <span className={cn('text-sm font-bold', dipilih ? 'text-brand-800' : 'text-slate-800')}>
                            {item.nama}
                          </span>
                          <span className="mt-0.5 text-[11px] text-slate-500">{labelDurasiPanjang(item.durasiHari)}</span>
                          <span className={cn('mt-2 text-[13px] font-extrabold', dipilih ? 'text-brand-700' : 'text-slate-700')}>
                            {formatRupiah(item.harga)}
                          </span>
                          {dipilih && (
                            <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                  {errors.paketId && (
                    <p id="paketId-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                      • {errors.paketId}
                    </p>
                  )}
                </fieldset>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    id="tanggal"
                    label="Tanggal Transaksi"
                    required
                    error={errors.tanggal}
                    hint="Tanggal pembayaran diterima."
                  >
                    <Input
                      id="tanggal"
                      type="date"
                      max={todayISO()}
                      value={tanggal}
                      invalid={Boolean(errors.tanggal)}
                      onChange={(event) => {
                        setTanggal(event.target.value)
                        setErrors((prev) => ({ ...prev, tanggal: undefined }))
                      }}
                      aria-invalid={errors.tanggal ? true : undefined}
                      aria-describedby={errors.tanggal ? 'tanggal-error' : 'tanggal-hint'}
                    />
                  </FormField>

                  <div className="flex items-end">
                    <div className="flex w-full items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      <p>
                        Invoice dibuat otomatis setelah transaksi disimpan dan langsung muncul di riwayat
                        member.
                      </p>
                    </div>
                  </div>
                </div>

                <fieldset>
                  <legend className="label">
                    Metode Pembayaran
                    <span className="ml-1 text-brand-500" aria-hidden="true">*</span>
                  </legend>
                  <div className="grid grid-cols-3 gap-2.5">
                    {METODE.map((item) => {
                      const Icon = item.icon
                      const dipilih = item.value === metode
                      return (
                        <label
                          key={item.value}
                          className={cn(
                            'flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition focus-within:ring-2 focus-within:ring-brand-500/30',
                            dipilih
                              ? 'border-brand-400 bg-brand-50 text-brand-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                          )}
                        >
                          <input
                            type="radio"
                            name="metode"
                            value={item.value}
                            checked={dipilih}
                            onChange={() => setMetode(item.value)}
                            className="sr-only"
                          />
                          <Icon className="h-5 w-5" aria-hidden="true" />
                          <span className="text-xs font-bold">{item.label}</span>
                          <span className="hidden text-[10px] text-slate-400 sm:block">{item.description}</span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.metode && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                      • {errors.metode}
                    </p>
                  )}
                </fieldset>

                <FormField
                  id="catatan"
                  label="Catatan"
                  hint="Opsional. Misalnya nomor referensi transfer atau keterangan tambahan."
                >
                  <Textarea
                    id="catatan"
                    rows={3}
                    placeholder="Contoh: Transfer BCA, diterima oleh resepsionis…"
                    value={catatan}
                    onChange={(event) => setCatatan(event.target.value)}
                  />
                </FormField>
              </div>
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[92px] xl:self-start">
            <Card className="overflow-hidden">
              <div className="relative overflow-hidden bg-slate-950 p-5 text-white">
                <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-500/25 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Total Pembayaran
                    </p>
                    <p className="mt-1.5 text-3xl font-extrabold tracking-tight">{formatRupiah(paket?.harga ?? 0)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {paket ? `${paket.nama} · ${labelDurasiPanjang(paket.durasiHari)}` : 'Belum ada paket dipilih'}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300">
                    <Wallet className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Member</p>
                  {member ? (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <Avatar nama={member.nama} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{member.nama}</p>
                        <p className="text-[11px] text-slate-500">
                          {member.id} · berakhir {formatTanggal(member.tanggalBerakhir)}
                        </p>
                      </div>
                      <MemberStatusBadge status={resolveMemberStatus(member)} />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-3 text-xs text-slate-400">
                      Belum ada member dipilih.
                    </div>
                  )}
                </div>

                <dl className="space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Paket</dt>
                    <dd className="font-semibold text-slate-700">{paket?.nama ?? '—'}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Durasi</dt>
                    <dd className="font-semibold text-slate-700">
                      {paket ? labelDurasiPanjang(paket.durasiHari) : '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Tanggal bayar</dt>
                    <dd className="font-semibold text-slate-700">{tanggal ? formatTanggal(tanggal) : '—'}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Metode</dt>
                    <dd className="font-semibold text-slate-700">{metode}</dd>
                  </div>
                </dl>

                {member && paket && periodeBaru ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      Masa aktif baru
                    </div>
                    <p className="mt-1 text-base font-extrabold tracking-tight text-emerald-900">
                      {formatTanggal(periodeBaru.berakhir)}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-700">
                      Status member menjadi <span className="font-bold">Aktif</span>. Perpanjangan dihitung
                      dari masa aktif terakhir.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-[11px] text-slate-400">
                    Pilih member dan paket untuk melihat tanggal berakhir yang baru.
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <Button
                    type="submit"
                    fullWidth
                    loading={saving}
                    iconLeft={<CreditCard className="h-4 w-4" aria-hidden="true" />}
                  >
                    {saving ? 'Menyimpan transaksi…' : 'Simpan Transaksi'}
                  </Button>
                  <Link to="/transaksi" className="block">
                    <Button type="button" variant="ghost" fullWidth>
                      Batal
                    </Button>
                  </Link>
                </div>

                <p className="text-center text-[10px] leading-relaxed text-slate-400">
                  Nomor invoice dibuat otomatis. Data langsung diperbarui di halaman member dan dashboard.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </form>
    </div>
  )
}
