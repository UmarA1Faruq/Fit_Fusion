import { ChevronRight, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
        <li>
          <Link
            to="/dashboard"
            aria-label="Dashboard"
            className="grid h-6 w-6 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-slate-300" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link to={item.to} className="rounded px-0.5 py-0.5 transition hover:text-brand-600">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold text-slate-700' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
