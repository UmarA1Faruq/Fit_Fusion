import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function fieldA11y(id: string, error?: string, hint?: string) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  }
}

export function FormField({ id, label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="label">
        {label}
        {required && (
          <span className="ml-1 text-brand-500" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (wajib diisi)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-rose-600">
          <span aria-hidden="true">•</span>
          {error}
        </p>
      )}
    </div>
  )
}
