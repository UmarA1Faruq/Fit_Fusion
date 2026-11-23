import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { EmptyState } from './EmptyState'

interface TableProps {
  children: ReactNode
  className?: string
  minWidth?: string
}

export function Table({ children, className, minWidth = 'min-w-[780px]' }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-left', minWidth, className)}>{children}</table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
}

interface THProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
}

export function TH({ children, className, align = 'left', ...props }: THProps) {
  return (
    <th
      scope="col"
      className={cn(
        'table-head whitespace-nowrap px-4 py-3 sm:px-5',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

interface TRProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export function TR({ children, className, ...props }: TRProps) {
  return (
    <tr
      className={cn(
        'border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

interface TDProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
}

export function TD({ children, className, align = 'left', ...props }: TDProps) {
  return (
    <td
      className={cn(
        'table-cell',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  )
}

interface TableEmptyProps {
  colSpan: number
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function TableEmpty({ colSpan, icon, title, description, action }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState icon={icon} title={title} description={description} action={action} className="py-12" />
      </td>
    </tr>
  )
}
