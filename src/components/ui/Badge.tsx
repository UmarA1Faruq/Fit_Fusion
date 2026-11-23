import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'brand' | 'violet'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/15',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/15',
}

const dots: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-400',
  info: 'bg-sky-500',
  brand: 'bg-brand-500',
  violet: 'bg-violet-500',
}

export function Badge({ children, variant = 'neutral', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset',
        styles[variant],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[variant])} aria-hidden="true" />}
      {children}
    </span>
  )
}
