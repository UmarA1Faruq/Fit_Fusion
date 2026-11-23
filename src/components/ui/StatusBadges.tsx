import { Banknote, Landmark, QrCode } from 'lucide-react'
import type { MemberStatus, MetodeBayar, StatusTransaksi } from '../../types'
import { Badge } from './Badge'

const statusMember: Record<MemberStatus, { label: MemberStatus; variant: 'success' | 'danger' | 'neutral' }> = {
  Aktif: { label: 'Aktif', variant: 'success' },
  Kedaluwarsa: { label: 'Kedaluwarsa', variant: 'danger' },
  Nonaktif: { label: 'Nonaktif', variant: 'neutral' },
}

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const config = statusMember[status]
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  )
}

export function StatusTransaksiBadge({ status }: { status: StatusTransaksi }) {
  return (
    <Badge variant={status === 'Lunas' ? 'success' : 'warning'} dot>
      {status}
    </Badge>
  )
}

const metodeIkon = {
  Tunai: Banknote,
  Transfer: Landmark,
  QRIS: QrCode,
} as const

export function MetodeLabel({ metode, className }: { metode: MetodeBayar; className?: string }) {
  const Icon = metodeIkon[metode]
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm text-slate-600 ${className ?? ''}`}>
      <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
      {metode}
    </span>
  )
}
