import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/Toast'
import { Avatar } from '../ui/Avatar'
import { formatTanggalLengkap, daysUntil } from '../../utils/date'
import { resolveMemberStatus } from '../../utils/member'
import { cn } from '../../utils/cn'

function judulHalaman(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/member') return 'Member'
  if (pathname === '/member/tambah') return 'Tambah Member'
  if (pathname.endsWith('/ubah') && pathname.startsWith('/member/')) return 'Ubah Member'
  if (pathname.startsWith('/member/')) return 'Detail Member'
  if (pathname === '/transaksi') return 'Transaksi'
  if (pathname === '/transaksi/tambah') return 'Tambah Transaksi'
  if (pathname === '/paket') return 'Paket Membership'
  if (pathname === '/pengaturan') return 'Pengaturan'
  return 'Halaman'
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pengaturan, members, logout } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const judul = judulHalaman(location.pathname)
  const akanBerakhir = members.filter(
    (member) => resolveMemberStatus(member) === 'Aktif' && daysUntil(member.tanggalBerakhir) <= 7,
  ).length

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return

    function handlePointer(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  function handleNotifikasi() {
    if (akanBerakhir > 0) {
      toast({
        title: `${akanBerakhir} member segera berakhir`,
        description: 'Cek daftar member dan kirim pengingat perpanjangan.',
        variant: 'warning',
      })
    } else {
      toast({
        title: 'Tidak ada notifikasi baru',
        description: 'Semua member masih memiliki masa aktif yang aman.',
        variant: 'info',
      })
    }
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
    toast({ title: 'Kamu telah keluar.', description: 'Sampai jumpa lagi di FitFusion!', variant: 'info' })
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Buka menu navigasi"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Admin Panel</p>
        <h2 className="truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">{judul}</h2>
      </div>

      <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 xl:flex">
        <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
        {formatTanggalLengkap(new Date())}
      </div>

      <button
        type="button"
        onClick={handleNotifikasi}
        aria-label={
          akanBerakhir > 0 ? `${akanBerakhir} notifikasi member segera berakhir` : 'Notifikasi'
        }
        title="Notifikasi"
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {akanBerakhir > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        )}
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 rounded-xl border border-transparent py-1 pl-1 pr-1.5 transition hover:border-slate-200 hover:bg-slate-50 sm:pr-2.5"
        >
          <Avatar nama={pengaturan.admin.nama} size="sm" />
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block max-w-[140px] truncate text-xs font-bold text-slate-900">
              {pengaturan.admin.nama}
            </span>
            <span className="block text-[10px] text-slate-500">Owner / Admin</span>
          </span>
          <ChevronDown
            className={cn('hidden h-3.5 w-3.5 text-slate-400 transition sm:block', menuOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-64 animate-pop overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
              <Avatar nama={pengaturan.admin.nama} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{pengaturan.admin.nama}</p>
                <p className="truncate text-xs text-slate-500">{pengaturan.admin.email}</p>
              </div>
            </div>
            <div className="p-1.5">
              <Link
                to="/pengaturan"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <UserRound className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Profil Admin
              </Link>
              <Link
                to="/pengaturan"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Pengaturan
              </Link>
            </div>
            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
