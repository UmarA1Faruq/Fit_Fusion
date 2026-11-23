import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormField, fieldA11y } from '../components/ui/FormField'
import { Input, Select, Textarea } from '../components/ui/Inputs'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { MemberStatusBadge } from '../components/ui/StatusBadges'
import { EmptyState } from '../components/ui/EmptyState'
import { delay, cn } from '../utils/cn'
import { addDays, daysUntil, formatTanggal, todayISO } from '../utils/date'
import { formatRupiah, labelDurasiPanjang } from '../utils/format'
import {
  resolveMemberStatus,
  validasiEmail,
  validasiNomorHp,
} from '../utils/member'
import type { JenisKelamin, Member, MemberInput } from '../types'

type FormErrors = Partial<Record<keyof MemberInput, string>>

const URUTAN_FIELD: Array<keyof MemberInput> = [
  'nama',
  'noHp',
  'email',
  'tanggalLahir',
  'paketId',
  'tanggalMulai',
]

export function MemberFormPage() {
  const { id } = useParams()
  const { members } = useApp()
  const member = id ? members.find((item) => item.id === id) : undefined

  if (id && !member) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[{ label: 'Member', to: '/member' }, { label: 'Tidak ditemukan' }]} />
        <Card>
          <EmptyState
            icon={<Users className="h-6 w-6" aria-hidden="true" />}
            title="Member tidak ditemukan"
            description="Data member yang ingin kamu ubah mungkin sudah dihapus atau ID-nya tidak valid."
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

  return <MemberForm key={member?.id ?? 'baru'} member={member} />
}

function MemberForm({ member }: { member?: Member }) {
  const { packages, addMember, updateMember } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [values, setValues] = useState<MemberInput>(() =>
    member
      ? {
          nama: member.nama,
          jenisKelamin: member.jenisKelamin,
          tanggalLahir: member.tanggalLahir,
          noHp: member.noHp,
          email: member.email,
          alamat: member.alamat,
          catatan: member.catatan,
          paketId: member.paketId,
          tanggalMulai: member.tanggalMulai,
        }
      : {
          nama: '',
          jenisKelamin: 'Laki-laki',
          tanggalLahir: '',
          noHp: '',
          email: '',
          alamat: '',
          catatan: '',
          paketId: packages[0]?.id ?? '',
          tanggalMulai: todayISO(),
        },
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const paket = packages.find((item) => item.id === values.paketId) ?? packages[0]
  const tanggalBerakhir = paket && values.tanggalMulai ? addDays(values.tanggalMulai, paket.durasiHari) : ''
  const lewat = tanggalBerakhir ? daysUntil(tanggalBerakhir) < 0 : false
  const jumlahError = Object.keys(errors).length

  function updateField<K extends keyof MemberInput>(field: K, value: MemberInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const nama = values.nama.trim()

    if (!nama) {
      next.nama = 'Nama lengkap wajib diisi.'
    } else if (nama.length < 3) {
      next.nama = 'Nama lengkap minimal 3 karakter.'
    }

    if (!values.noHp.trim()) {
      next.noHp = 'Nomor HP wajib diisi.'
    } else if (!validasiNomorHp(values.noHp)) {
      next.noHp = 'Format nomor HP tidak valid. Contoh: 081234567890.'
    }

    if (values.email.trim() && !validasiEmail(values.email.trim())) {
      next.email = 'Format email tidak valid. Contoh: nama@email.com.'
    }

    if (values.tanggalLahir && values.tanggalLahir > todayISO()) {
      next.tanggalLahir = 'Tanggal lahir tidak boleh di masa depan.'
    }

    if (!values.paketId) {
      next.paketId = 'Pilih paket membership.'
    }

    if (!values.tanggalMulai) {
      next.tanggalMulai = 'Tanggal mulai wajib diisi.'
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: 'Periksa kembali data member.',
        description: 'Beberapa kolom wajib belum diisi dengan benar.',
        variant: 'error',
      })
      const field = URUTAN_FIELD.find((key) => nextErrors[key])
      if (field) document.getElementById(field)?.focus()
      return
    }

    setSaving(true)
    await delay(650)

    const payload: MemberInput = {
      ...values,
      nama: values.nama.trim(),
      email: values.email.trim(),
      alamat: values.alamat.trim(),
      catatan: values.catatan.trim(),
      noHp: values.noHp.trim(),
    }

    if (member) {
      const updated = updateMember(member.id, payload)
      if (!updated) {
        toast({ title: 'Gagal menyimpan perubahan.', description: 'Data member tidak ditemukan.', variant: 'error' })
        setSaving(false)
        return
      }
      toast({
        title: 'Perubahan berhasil disimpan.',
        description: `Data ${updated.nama} sudah diperbarui.`,
        variant: 'success',
      })
    } else {
      const created = addMember(payload)
      toast({
        title: 'Member berhasil ditambahkan.',
        description: `${created.nama} terdaftar dengan ID ${created.id}.`,
        variant: 'success',
      })
    }

    setSaving(false)
    navigate('/member')
  }

  const judul = member ? 'Ubah Member' : 'Tambah Member'
  const statusPratinjau = tanggalBerakhir
    ? daysUntil(tanggalBerakhir) < 0
      ? 'Kedaluwarsa'
      : 'Aktif'
    : member
      ? resolveMemberStatus(member)
      : 'Aktif'

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Member', to: '/member' }, { label: judul }]} />

      <PageHeader
        title={judul}
        description={
          member
            ? 'Perbarui data pribadi atau perpanjang paket member. Perubahan langsung tercermin di seluruh halaman.'
            : 'Lengkapi data member baru. Tanggal berakhir akan dihitung otomatis dari paket yang dipilih.'
        }
        actions={
          <Link to="/member">
            <Button variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
              Kembali
            </Button>
          </Link>
        }
      />

      {jumlahError > 0 && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Ada <span className="font-bold">{jumlahError} data</span> yang perlu diperiksa. Lihat pesan di bawah
            kolom terkait.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <Card>
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">Data Pribadi</h2>
                <p className="mt-0.5 text-xs text-slate-500">Informasi dasar dan kontak yang bisa dihubungi.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <FormField
                  id="nama"
                  label="Nama Lengkap"
                  required
                  error={errors.nama}
                  className="sm:col-span-2"
                >
                  <Input
                    id="nama"
                    autoFocus
                    placeholder="Contoh: Ahmad Fauzi"
                    value={values.nama}
                    invalid={Boolean(errors.nama)}
                    onChange={(event) => updateField('nama', event.target.value)}
                    {...fieldA11y('nama', errors.nama)}
                  />
                </FormField>

                <fieldset>
                  <legend className="label">Jenis Kelamin</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Laki-laki', 'Perempuan'] as JenisKelamin[]).map((gender) => {
                      const selected = values.jenisKelamin === gender
                      return (
                        <label
                          key={gender}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-brand-500/30',
                            selected
                              ? 'border-brand-400 bg-brand-50 text-brand-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                          )}
                        >
                          <input
                            type="radio"
                            name="jenisKelamin"
                            value={gender}
                            checked={selected}
                            onChange={() => updateField('jenisKelamin', gender)}
                            className="sr-only"
                          />
                          {gender}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <FormField
                  id="tanggalLahir"
                  label="Tanggal Lahir"
                  error={errors.tanggalLahir}
                  hint="Opsional, untuk data profil member."
                >
                  <Input
                    id="tanggalLahir"
                    type="date"
                    max={todayISO()}
                    value={values.tanggalLahir}
                    invalid={Boolean(errors.tanggalLahir)}
                    onChange={(event) => updateField('tanggalLahir', event.target.value)}
                    {...fieldA11y('tanggalLahir', errors.tanggalLahir)}
                  />
                </FormField>

                <FormField id="noHp" label="No. HP" required error={errors.noHp}>
                  <Input
                    id="noHp"
                    type="tel"
                    inputMode="tel"
                    placeholder="081234567890"
                    value={values.noHp}
                    invalid={Boolean(errors.noHp)}
                    onChange={(event) => updateField('noHp', event.target.value)}
                    {...fieldA11y('noHp', errors.noHp)}
                  />
                </FormField>

                <FormField id="email" label="Email" error={errors.email} hint="Opsional.">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={values.email}
                    invalid={Boolean(errors.email)}
                    onChange={(event) => updateField('email', event.target.value)}
                    {...fieldA11y('email', errors.email)}
                  />
                </FormField>

                <FormField id="alamat" label="Alamat" className="sm:col-span-2">
                  <Textarea
                    id="alamat"
                    rows={3}
                    placeholder="Jalan, nomor, kota"
                    value={values.alamat}
                    onChange={(event) => updateField('alamat', event.target.value)}
                  />
                </FormField>

                <FormField
                  id="catatan"
                  label="Catatan"
                  className="sm:col-span-2"
                  hint="Misalnya target latihan, preferensi kelas, atau informasi penting lainnya."
                >
                  <Textarea
                    id="catatan"
                    rows={3}
                    placeholder="Tulis catatan tambahan tentang member…"
                    value={values.catatan}
                    onChange={(event) => updateField('catatan', event.target.value)}
                  />
                </FormField>
              </div>
            </Card>

            <Card>
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
                  {member ? 'Keanggotaan' : 'Paket Awal'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Tentukan paket dan tanggal mulai. Tanggal berakhir dihitung otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <FormField id="paketId" label="Paket Membership" required error={errors.paketId}>
                  <Select
                    id="paketId"
                    value={values.paketId}
                    invalid={Boolean(errors.paketId)}
                    onChange={(event) => updateField('paketId', event.target.value)}
                    {...fieldA11y('paketId', errors.paketId)}
                  >
                    {packages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama} · {formatRupiah(item.harga)}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField id="tanggalMulai" label="Tanggal Mulai" required error={errors.tanggalMulai}>
                  <Input
                    id="tanggalMulai"
                    type="date"
                    value={values.tanggalMulai}
                    invalid={Boolean(errors.tanggalMulai)}
                    onChange={(event) => updateField('tanggalMulai', event.target.value)}
                    {...fieldA11y('tanggalMulai', errors.tanggalMulai)}
                  />
                </FormField>

                <div
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-4 sm:col-span-2',
                    lewat ? 'border-amber-200 bg-amber-50' : 'border-brand-100 bg-brand-50/60',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                      lewat ? 'bg-amber-100 text-amber-600' : 'bg-brand-100 text-brand-600',
                    )}
                  >
                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 text-xs">
                    <p className={lewat ? 'font-semibold text-amber-800' : 'font-semibold text-slate-600'}>
                      {lewat ? 'Tanggal berakhir sudah lewat' : 'Masa aktif akan berakhir pada'}
                    </p>
                    <p className="mt-0.5 text-base font-extrabold tracking-tight text-slate-900">
                      {tanggalBerakhir ? formatTanggal(tanggalBerakhir) : '—'}
                    </p>
                    <p className="mt-0.5 text-slate-500">
                      {paket
                        ? `${paket.nama} · ${labelDurasiPanjang(paket.durasiHari)} · ${formatRupiah(paket.harga)}`
                        : 'Pilih paket terlebih dahulu.'}
                    </p>
                    {lewat && (
                      <p className="mt-1 text-amber-700">
                        Member akan tersimpan dengan status Kedaluwarsa. Ubah tanggal mulai atau paket jika perlu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <Link to="/member">
                <Button type="button" variant="secondary" fullWidth>
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                loading={saving}
                iconLeft={member ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              >
                {saving ? 'Menyimpan…' : member ? 'Simpan Perubahan' : 'Tambah Member'}
              </Button>
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[92px] xl:self-start">
            <Card className="overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600/80" />
              <div className="px-5 pb-5">
                <div className="-mt-8 flex items-end justify-between gap-3">
                  <Avatar nama={values.nama || 'Member Baru'} size="lg" ring />
                  <MemberStatusBadge status={statusPratinjau} />
                </div>
                <h3 className="mt-3 truncate text-lg font-extrabold tracking-tight text-slate-900">
                  {values.nama.trim() || 'Nama member'}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                    {member?.id ?? 'ID otomatis'}
                  </span>
                  {paket && <Badge variant="brand">{paket.nama}</Badge>}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    {values.noHp.trim() || 'Nomor HP belum diisi'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="truncate">{values.email.trim() || 'Email belum diisi'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="line-clamp-2">{values.alamat.trim() || 'Alamat belum diisi'}</span>
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Masa Aktif</p>
                    {paket && <span className="text-[11px] font-semibold text-slate-500">{paket.nama}</span>}
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-900">
                    {values.tanggalMulai ? formatTanggal(values.tanggalMulai) : '—'}
                    <span className="mx-1.5 text-slate-300">→</span>
                    {tanggalBerakhir ? formatTanggal(tanggalBerakhir) : '—'}
                  </p>
                  {paket && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {formatRupiah(paket.harga)} / {labelDurasiPanjang(paket.durasiHari)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-soft">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Tips pengisian
              </div>
              <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-400">
                <li>• Nomor HP dipakai untuk menghubungi member saat masa aktif hampir habis.</li>
                <li>• Tanggal berakhir dihitung otomatis dari durasi paket yang dipilih.</li>
                <li>• Data hanya tersimpan selama sesi prototype ini berjalan.</li>
              </ul>
            </div>
          </aside>
        </div>
      </form>
    </div>
  )
}
