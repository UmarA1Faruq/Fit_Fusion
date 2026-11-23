import { inisial } from '../../utils/member'
import { cn } from '../../utils/cn'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  nama: string
  size?: AvatarSize
  className?: string
  ring?: boolean
}

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl',
}

const tones = [
  'bg-orange-100 text-orange-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-800',
  'bg-teal-100 text-teal-700',
]

function toneFor(nama: string): string {
  let total = 0
  for (let index = 0; index < nama.length; index += 1) {
    total += nama.charCodeAt(index)
  }
  return tones[total % tones.length]
}

export function Avatar({ nama, size = 'md', className, ring = false }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-bold uppercase tracking-wide',
        sizes[size],
        toneFor(nama),
        ring && 'ring-4 ring-white',
        className,
      )}
      aria-hidden="true"
    >
      {inisial(nama)}
    </span>
  )
}
