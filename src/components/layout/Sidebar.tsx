import { useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  Package,
  Settings,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/Toast'
import { Avatar } from '../ui/Avatar'
import { Brand } from '../ui/Brand'
import { cn } from '../../utils/cn'

const menuUtama = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/member', label: 'Member', icon: Users },
  { to: '/transaksi', label: 'Transaksi', icon: ReceiptText },
  { to: '/paket', label: 'Paket', icon: Package },
]

const menuSistem = [{ to: '/pengaturan', label: 'Pengaturan', icon: Settings }]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { members, transactions, pengaturan, logout } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const jumlah: Record<string, number> = {
    '/member': members.length,
    '/transaksi': transactions.length,
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  function handleLogout() {
    logout()
    toast({ title: 'Kamu telah keluar.', description: 'Sampai jumpa lagi di FitFusion!', variant: 'info' })
    navigate('/login', { replace: true })
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-slate-950 transition-transform duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigasi utama"
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />

        <div className="relative flex h-[72px] shrink-0 items-center justify-between border-b border-white/5 px-5">
          <Link to="/dashboard" onClick={onClose} className="rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500">
            <Brand />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Menu Utama</p>
          <div className="mt-3 space-y-1">
            {menuUtama.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {jumlah[item.to] !== undefined && (
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
                            isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 group-hover:text-slate-300',
                          )}
                        >
                          {jumlah[item.to]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>

          <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Sistem</p>
          <div className="mt-3 space-y-1">
            {menuSistem.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </nav>

        <div className="relative shrink-0 space-y-3 border-t border-white/5 p-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-transparent p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-brand-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Mode Prototype
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              Data hanya tersimpan di sesi ini dan akan kembali seperti semula setelah halaman dimuat ulang.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5">
            <Avatar nama={pengaturan.admin.nama} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{pengaturan.admin.nama}</p>
              <p className="truncate text-[10px] text-slate-400">Owner / Admin</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar dari akun"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
