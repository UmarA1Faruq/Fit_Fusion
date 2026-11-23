import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

function judulDokumen(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/member') return 'Member'
  if (pathname === '/member/tambah') return 'Tambah Member'
  if (pathname.endsWith('/ubah') && pathname.startsWith('/member/')) return 'Ubah Member'
  if (pathname.startsWith('/member/')) return 'Detail Member'
  if (pathname === '/transaksi') return 'Transaksi'
  if (pathname === '/transaksi/tambah') return 'Tambah Transaksi'
  if (pathname === '/paket') return 'Paket Membership'
  if (pathname === '/pengaturan') return 'Pengaturan'
  return 'FitFusion'
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.title = `${judulDokumen(location.pathname)} · FitFusion`
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#konten-utama"
        className="sr-only z-[110] rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten
      </a>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-[272px]">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main
          id="konten-utama"
          className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
        <footer className="mx-auto w-full max-w-[1440px] px-4 pb-8 text-center text-[11px] text-slate-400 sm:px-6 lg:px-8 lg:text-left">
          FitFusion Admin · Prototype UI — data tersimpan di sesi ini.
        </footer>
      </div>
    </div>
  )
}
