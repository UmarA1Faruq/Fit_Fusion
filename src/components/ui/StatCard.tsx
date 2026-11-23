import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type StatTone = 'orange' | 'emerald' | 'sky' | 'amber'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: StatTone
  hint?: ReactNode
  className?: string
}

const tones: Record<StatTone, { tile: string; blob: string }> = {
  orange: { tile: 'bg-brand-50 text-brand-600', blob: 'bg-brand-50' },
  emerald: { tile: 'bg-emerald-50 text-emerald-600', blob: 'bg-emerald-50' },
  sky: { tile: 'bg-sky-50 text-sky-600', blob: 'bg-sky-50' },
  amber: { tile: 'bg-amber-50 text-amber-600', blob: 'bg-amber-50' },
}

export function StatCard({ label, value, icon: Icon, tone = 'orange', hint, className }: StatCardProps) {
  return (
    <div className={cn('panel relative overflow-hidden p-5', className)}>
      <div
        className={cn('pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full', tones[tone].blob)}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="pt-1 text-[13px] font-semibold text-slate-500">{label}</p>
        <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', tones[tone].tile)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-3 text-[26px] font-extrabold leading-none tracking-tight text-slate-900 sm:text-[28px]">
        {value}
      </p>
      {hint && <div className="relative mt-3 flex items-center gap-1.5 text-xs text-slate-500">{hint}</div>}
    </div>
  )
}
