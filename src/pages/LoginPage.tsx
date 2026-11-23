import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { AKUN_DEMO } from '../data/mockData'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { Brand } from '../components/ui/Brand'
import { Button } from '../components/ui/Button'
import { FormField, fieldA11y } from '../components/ui/FormField'
import { Input } from '../components/ui/Inputs'
import { delay } from '../utils/cn'
import { validasiEmail } from '../utils/member'

const fitur = [
  {
    icon: Users,
    title: 'Data member rapi',
    description: 'Pantau status dan masa aktif semua member tanpa catatan manual.',
  },
  {
    icon: CalendarClock,
    title: 'Pengingat perpanjangan',
    description: 'Lihat siapa yang akan berakhir dalam 7 hari ke depan.',
  },
  {
    icon: TrendingUp,
    title: 'Pemasukan terukur',
    description: 'Rekap transaksi dan tren pemasukan gym dalam satu dashboard.',
  },
]

export function LoginPage() {
  const { isAuthenticated, login, pengaturan } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(AKUN_DEMO.email)
  const [password, setPassword] = useState(AKUN_DEMO.password)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const redirectTo = from?.pathname ? `${from.pathname}${from.search ?? ''}` : '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      nextErrors.email = 'Email wajib diisi.'
    } else if (!validasiEmail(email.trim())) {
      nextErrors.email = 'Format email tidak valid. Contoh: nama@email.com.'
    }

    if (!password) {
      nextErrors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 6) {
      nextErrors.password = 'Kata sandi minimal 6 karakter.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: 'Gagal masuk',
        description: 'Periksa kembali email dan kata sandi kamu.',
        variant: 'error',
      })
      return
    }

    setLoading(true)
    await delay(650)
    login(email, password)
    toast({
      title: 'Berhasil masuk!',
      description: `Selamat datang kembali, ${pengaturan.admin.nama.split(' ')[0]}.`,
      variant: 'success',
    })
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_1fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col xl:p-16">
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full border border-white/5" />
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative z-10">
          <Brand />
        </div>

        <div className="relative z-10 my-auto max-w-xl py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Aplikasi admin gym
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-[52px]">
            Kelola gym-mu,
            <br />
            <span className="text-brand-400">tumbuh lebih kuat.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
            Satu dashboard untuk member, perpanjangan membership, dan pemasukan. Fokus melayani,
            biar administrasi yang beres.
          </p>

          <ul className="mt-9 space-y-4">
            {fitur.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-brand-400 ring-1 ring-white/10">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
            <div className="flex -space-x-2" aria-hidden="true">
              {['AF', 'SN', 'BS', 'DL'].map((initials, index) => (
                <span
                  key={initials}
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 border-slate-900 text-[10px] font-bold text-white ${
                    ['bg-orange-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500'][index]
                  }`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-white">15 member terdaftar</p>
              <p className="text-[11px] text-slate-400">10 di antaranya aktif berlatih minggu ini.</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-slate-500">
          © 2026 FitFusion. Dibuat untuk gym yang bergerak cepat.
        </p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-[#FAFAFB] px-4 py-10 sm:px-8 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Brand tone="light" />
          </div>

          <div className="mt-10 lg:mt-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
              Selamat datang kembali
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Masuk ke akun kamu
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Kelola member, transaksi, dan paket gym FitFusion dalam satu tempat.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <FormField id="login-email" label="Email" required error={errors.email}>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="nama@email.com"
                leadingIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                value={email}
                invalid={Boolean(errors.email)}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                {...fieldA11y('login-email', errors.email)}
              />
            </FormField>

            <FormField id="login-password" label="Kata Sandi" required error={errors.password}>
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                leadingIcon={<LockKeyhole className="h-4 w-4" aria-hidden="true" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                }
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                {...fieldA11y('login-password', errors.password)}
              />
            </FormField>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              {loading ? 'Memeriksa akun…' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Akun demo</p>
            <div className="mt-2 flex flex-col gap-1 font-mono text-xs text-slate-700">
              <span>{AKUN_DEMO.email}</span>
              <span>{AKUN_DEMO.password}</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Klik <span className="font-semibold text-slate-700">Masuk</span> untuk langsung menjelajahi
              aplikasi. Tidak perlu backend.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Ini adalah prototype UI. Data hanya tersimpan di memori selama sesi berjalan dan tidak
              dikirim ke server.
            </p>
          </div>

          <p className="mt-10 text-center text-[11px] text-slate-400 lg:hidden">
            © 2026 FitFusion. Dibuat untuk gym yang bergerak cepat.
          </p>
        </div>
      </section>
    </div>
  )
}
