import { useState, type FormEvent } from 'react'
import { Dumbbell, Info, Mail, MapPin, Phone, Save, UserRound } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { Input, Textarea } from '../components/ui/Inputs'
import { Avatar } from '../components/ui/Avatar'
import { delay } from '../utils/cn'
import { validasiEmail } from '../utils/member'

type GymErrors = { nama?: string; alamat?: string; telepon?: string }
type AdminErrors = { nama?: string; email?: string; telepon?: string }

function validasiTelepon(value: string): boolean {
  return /^[0-9+\-()\s]{7,20}$/.test(value.trim())
}

export function SettingsPage() {
  const { pengaturan, updatePengaturan, members, transactions, packages } = useApp()
  const { toast } = useToast()

  const [gym, setGym] = useState(pengaturan.gym)
  const [admin, setAdmin] = useState(pengaturan.admin)
  const [gymErrors, setGymErrors] = useState<GymErrors>({})
  const [adminErrors, setAdminErrors] = useState<AdminErrors>({})
  const [savingGym, setSavingGym] = useState(false)
  const [savingAdmin, setSavingAdmin] = useState(false)

  async function simpanGym(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: GymErrors = {}

    if (!gym.nama.trim()) {
      next.nama = 'Nama gym wajib diisi.'
    }
    if (!gym.alamat.trim()) {
      next.alamat = 'Alamat gym wajib diisi.'
    } else if (gym.alamat.trim().length < 8) {
      next.alamat = 'Alamat terlalu singkat. Lengkapi nama jalan dan kota.'
    }
    if (!gym.telepon.trim()) {
      next.telepon = 'Nomor telepon wajib diisi.'
    } else if (!validasiTelepon(gym.telepon)) {
      next.telepon = 'Format nomor telepon tidak valid. Contoh: 022-423-8899.'
    }

    setGymErrors(next)
    if (Object.keys(next).length > 0) {
      toast({ title: 'Periksa profil gym.', description: 'Beberapa kolom belum diisi dengan benar.', variant: 'error' })
      return
    }

    setSavingGym(true)
    await delay(550)
    updatePengaturan({
      gym: { nama: gym.nama.trim(), alamat: gym.alamat.trim(), telepon: gym.telepon.trim() },
    })
    setSavingGym(false)
    toast({
      title: 'Profil gym berhasil disimpan.',
      description: 'Nama dan informasi gym sudah diperbarui.',
      variant: 'success',
    })
  }

  async function simpanAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: AdminErrors = {}

    if (!admin.nama.trim()) {
      next.nama = 'Nama admin wajib diisi.'
    }
    if (!admin.email.trim()) {
      next.email = 'Email admin wajib diisi.'
    } else if (!validasiEmail(admin.email.trim())) {
      next.email = 'Format email tidak valid. Contoh: admin@fitfusion.id.'
    }
    if (!admin.telepon.trim()) {
      next.telepon = 'Nomor telepon wajib diisi.'
    } else if (!validasiTelepon(admin.telepon)) {
      next.telepon = 'Format nomor telepon tidak valid. Contoh: 0812-3456-7890.'
    }

    setAdminErrors(next)
    if (Object.keys(next).length > 0) {
      toast({ title: 'Periksa profil admin.', description: 'Beberapa kolom belum diisi dengan benar.', variant: 'error' })
      return
    }

    setSavingAdmin(true)
    await delay(550)
    updatePengaturan({
      admin: { nama: admin.nama.trim(), email: admin.email.trim(), telepon: admin.telepon.trim() },
    })
    setSavingAdmin(false)
    toast({
      title: 'Profil admin berhasil disimpan.',
      description: 'Informasi akun admin sudah diperbarui.',
      variant: 'success',
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola informasi gym dan profil admin yang digunakan di aplikasi."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="flex flex-col overflow-hidden">
          <form onSubmit={simpanGym} noValidate className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Dumbbell className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">Profil Gym</h2>
                <p className="text-xs text-slate-500">Informasi utama tempat usaha kamu.</p>
              </div>
            </div>

            <div className="flex-1 space-y-5 p-5 sm:p-6">
              <FormField id="gym-nama" label="Nama Gym" required error={gymErrors.nama}>
                <Input
                  id="gym-nama"
                  value={gym.nama}
                  placeholder="Nama gym"
                  invalid={Boolean(gymErrors.nama)}
                  onChange={(event) => {
                    setGym((prev) => ({ ...prev, nama: event.target.value }))
                    setGymErrors((prev) => ({ ...prev, nama: undefined }))
                  }}
                  aria-invalid={gymErrors.nama ? true : undefined}
                  aria-describedby={gymErrors.nama ? 'gym-nama-error' : undefined}
                />
              </FormField>

              <FormField id="gym-telepon" label="No. Telepon" required error={gymErrors.telepon}>
                <Input
                  id="gym-telepon"
                  type="tel"
                  value={gym.telepon}
                  placeholder="022-423-8899"
                  leadingIcon={<Phone className="h-4 w-4" aria-hidden="true" />}
                  invalid={Boolean(gymErrors.telepon)}
                  onChange={(event) => {
                    setGym((prev) => ({ ...prev, telepon: event.target.value }))
                    setGymErrors((prev) => ({ ...prev, telepon: undefined }))
                  }}
                  aria-invalid={gymErrors.telepon ? true : undefined}
                  aria-describedby={gymErrors.telepon ? 'gym-telepon-error' : undefined}
                />
              </FormField>

              <FormField id="gym-alamat" label="Alamat" required error={gymErrors.alamat}>
                <Textarea
                  id="gym-alamat"
                  rows={3}
                  value={gym.alamat}
                  placeholder="Jalan, nomor, kota, kode pos"
                  invalid={Boolean(gymErrors.alamat)}
                  onChange={(event) => {
                    setGym((prev) => ({ ...prev, alamat: event.target.value }))
                    setGymErrors((prev) => ({ ...prev, alamat: undefined }))
                  }}
                  aria-invalid={gymErrors.alamat ? true : undefined}
                  aria-describedby={gymErrors.alamat ? 'gym-alamat-error' : undefined}
                />
              </FormField>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                Informasi ini tampil pada sapaan dashboard. Pastikan nama gym sudah benar.
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
              <Button type="submit" loading={savingGym} iconLeft={<Save className="h-4 w-4" aria-hidden="true" />}>
                {savingGym ? 'Menyimpan…' : 'Simpan Profil Gym'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <form onSubmit={simpanAdmin} noValidate className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <UserRound className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">Profil Admin</h2>
                <p className="text-xs text-slate-500">Data pemilik atau pengelola akun.</p>
              </div>
            </div>

            <div className="flex-1 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Avatar nama={admin.nama || 'Admin'} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{admin.nama || 'Nama admin'}</p>
                  <p className="truncate text-xs text-slate-500">{admin.email || 'Email belum diisi'}</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                    Owner / Admin
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <FormField id="admin-nama" label="Nama Lengkap" required error={adminErrors.nama}>
                  <Input
                    id="admin-nama"
                    value={admin.nama}
                    placeholder="Nama lengkap admin"
                    invalid={Boolean(adminErrors.nama)}
                    onChange={(event) => {
                      setAdmin((prev) => ({ ...prev, nama: event.target.value }))
                      setAdminErrors((prev) => ({ ...prev, nama: undefined }))
                    }}
                    aria-invalid={adminErrors.nama ? true : undefined}
                    aria-describedby={adminErrors.nama ? 'admin-nama-error' : undefined}
                  />
                </FormField>

                <FormField id="admin-email" label="Email" required error={adminErrors.email}>
                  <Input
                    id="admin-email"
                    type="email"
                    value={admin.email}
                    placeholder="admin@fitfusion.id"
                    leadingIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                    invalid={Boolean(adminErrors.email)}
                    onChange={(event) => {
                      setAdmin((prev) => ({ ...prev, email: event.target.value }))
                      setAdminErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    aria-invalid={adminErrors.email ? true : undefined}
                    aria-describedby={adminErrors.email ? 'admin-email-error' : undefined}
                  />
                </FormField>

                <FormField id="admin-telepon" label="No. Telepon" required error={adminErrors.telepon}>
                  <Input
                    id="admin-telepon"
                    type="tel"
                    value={admin.telepon}
                    placeholder="0812-3456-7890"
                    leadingIcon={<Phone className="h-4 w-4" aria-hidden="true" />}
                    invalid={Boolean(adminErrors.telepon)}
                    onChange={(event) => {
                      setAdmin((prev) => ({ ...prev, telepon: event.target.value }))
                      setAdminErrors((prev) => ({ ...prev, telepon: undefined }))
                    }}
                    aria-invalid={adminErrors.telepon ? true : undefined}
                    aria-describedby={adminErrors.telepon ? 'admin-telepon-error' : undefined}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
              <Button type="submit" loading={savingAdmin} iconLeft={<Save className="h-4 w-4" aria-hidden="true" />}>
                {savingAdmin ? 'Menyimpan…' : 'Simpan Profil Admin'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Card className="relative overflow-hidden border-slate-800 bg-slate-950 p-5 text-white shadow-soft sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300">
              <Info className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Tentang mode prototype</h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400">
                FitFusion versi ini berjalan tanpa backend dan tanpa database. Semua member, transaksi, paket,
                dan pengaturan tersimpan di memori selama sesi berjalan — halaman ulang akan memuat data awal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 lg:min-w-[300px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <p className="text-xl font-extrabold tracking-tight">{members.length}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Member</p>
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">{transactions.length}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Transaksi</p>
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">{packages.length}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Paket</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
