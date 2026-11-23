import { Dumbbell } from 'lucide-react'
import { cn } from '../../utils/cn'

interface BrandProps {
  className?: string
  subtitle?: string
  tone?: 'dark' | 'light'
}

export function Brand({ className, subtitle = 'Gym Admin', tone = 'dark' }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-glow">
        <Dumbbell className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block text-lg font-extrabold tracking-tight',
            tone === 'dark' ? 'text-white' : 'text-slate-900',
          )}
        >
          Fit<span className={tone === 'dark' ? 'text-brand-400' : 'text-brand-600'}>Fusion</span>
        </span>
        <span
          className={cn(
            'mt-1 block text-[9px] font-bold uppercase tracking-[0.22em]',
            tone === 'dark' ? 'text-slate-400' : 'text-slate-500',
          )}
        >
          {subtitle}
        </span>
      </span>
    </div>
  )
}
