import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../../utils/cn'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const variantStyles: Record<
  ToastVariant,
  { icon: typeof CircleCheck; tile: string; role: 'status' | 'alert' }
> = {
  success: { icon: CircleCheck, tile: 'bg-emerald-50 text-emerald-600', role: 'status' },
  error: { icon: CircleX, tile: 'bg-rose-50 text-rose-600', role: 'alert' },
  warning: { icon: TriangleAlert, tile: 'bg-amber-50 text-amber-600', role: 'status' },
  info: { icon: Info, tile: 'bg-sky-50 text-sky-600', role: 'status' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    const pending = timeouts.current
    return () => {
      pending.forEach((timeout) => window.clearTimeout(timeout))
    }
  }, [])

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }

  function toast(options: ToastOptions) {
    counter.current += 1
    const id = counter.current
    const item: ToastItem = {
      ...options,
      id,
      variant: options.variant ?? 'success',
      duration: options.duration ?? 4200,
    }
    setToasts((prev) => [...prev, item].slice(-3))
    const timeout = window.setTimeout(() => dismiss(id), item.duration)
    timeouts.current.push(timeout)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-stretch gap-2.5 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-full sm:max-w-sm"
        aria-live="polite"
        aria-label="Notifikasi"
      >
        {toasts.map((item) => {
          const config = variantStyles[item.variant]
          const Icon = config.icon
          return (
            <div
              key={item.id}
              role={config.role}
              className="pointer-events-auto flex animate-slide-in items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lift"
            >
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', config.tile)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Tutup notifikasi"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider.')
  }
  return context
}
