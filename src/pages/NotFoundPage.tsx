import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, LayoutDashboard } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl py-8">
      <Card>
        <EmptyState
          icon={<Compass className="h-6 w-6" aria-hidden="true" />}
          title="Halaman tidak ditemukan"
          description="Alamat yang kamu buka tidak tersedia. Kembali ke dashboard atau daftar member untuk melanjutkan."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link to="/dashboard">
                <Button iconLeft={<LayoutDashboard className="h-4 w-4" aria-hidden="true" />}>
                  Ke Dashboard
                </Button>
              </Link>
              <Link to="/member">
                <Button variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
                  Daftar Member
                </Button>
              </Link>
            </div>
          }
        />
        <p className="pb-6 text-center font-mono text-[11px] text-slate-400">Error 404</p>
      </Card>
    </div>
  )
}
