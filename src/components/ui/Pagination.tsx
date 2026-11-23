import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

function daftarHalaman(page: number, totalPages: number): Array<number | 'gap'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const halaman = new Set<number>([1, totalPages, page - 1, page, page + 1])
  const urut = [...halaman].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b)
  const hasil: Array<number | 'gap'> = []

  urut.forEach((item, index) => {
    if (index > 0 && item - urut[index - 1] > 1) {
      hasil.push('gap')
    }
    hasil.push(item)
  })

  return hasil
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      <div className="hidden items-center gap-1 sm:flex">
        {daftarHalaman(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-xs text-slate-400" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-label={`Halaman ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition',
                item === page
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                  : 'border border-transparent text-slate-600 hover:bg-slate-100',
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <span className="px-1 text-xs font-semibold text-slate-500 sm:hidden">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
