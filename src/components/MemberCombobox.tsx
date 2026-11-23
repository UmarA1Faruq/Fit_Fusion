import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown, Search, SearchX } from 'lucide-react'
import type { Member } from '../types'
import { Avatar } from './ui/Avatar'
import { MemberStatusBadge } from './ui/StatusBadges'
import { resolveMemberStatus } from '../utils/member'
import { cn } from '../utils/cn'

interface MemberComboboxProps {
  members: Member[]
  value: string
  onChange: (id: string) => void
  invalid?: boolean
  id?: string
}

export function MemberCombobox({ members, value, onChange, invalid, id }: MemberComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selected = members.find((member) => member.id === value)

  const hasil = useMemo(() => {
    const kata = query.trim().toLowerCase()
    if (!kata) return members
    return members.filter(
      (member) =>
        member.nama.toLowerCase().includes(kata) ||
        member.id.toLowerCase().includes(kata) ||
        member.noHp.includes(kata),
    )
  }, [members, query])

  useEffect(() => {
    if (!open) return

    function handlePointer(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointer)
    inputRef.current?.focus()
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [open])

  function buka() {
    setQuery('')
    setActiveIndex(0)
    setOpen(true)
  }

  function pilih(id: string) {
    onChange(id)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(0, hasil.length - 1)))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(0, index - 1))
      return
    }
    if (event.key === 'Enter' && open && hasil[activeIndex]) {
      event.preventDefault()
      pilih(hasil[activeIndex].id)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => (open ? setOpen(false) : buka())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            buka()
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="member-combobox-list"
        aria-invalid={invalid || undefined}
        className={cn(
          'flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border bg-white px-3 py-2 text-left text-sm shadow-sm outline-none transition',
          'focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10',
          invalid ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300',
        )}
      >
        {selected ? (
          <>
            <Avatar nama={selected.nama} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-900">{selected.nama}</span>
              <span className="block text-[10px] text-slate-400">{selected.id}</span>
            </span>
            <span className="hidden sm:block">
              <MemberStatusBadge status={resolveMemberStatus(selected)} />
            </span>
          </>
        ) : (
          <span className="flex-1 text-sm text-slate-400">Pilih member…</span>
        )}
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-slate-400 transition', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute z-40 mt-2 w-full animate-pop overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
          onKeyDown={handleKeyDown}
        >
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                placeholder="Cari nama, ID, atau no. HP…"
                aria-label="Cari member"
                aria-controls="member-combobox-list"
                aria-autocomplete="list"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/10"
              />
            </div>
          </div>

          <ul
            id="member-combobox-list"
            role="listbox"
            aria-label="Daftar member"
            className="max-h-64 overflow-y-auto p-1.5"
          >
            {hasil.length === 0 ? (
              <li className="flex flex-col items-center px-4 py-6 text-center">
                <SearchX className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold text-slate-700">Member tidak ditemukan</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Coba kata kunci lain.</p>
              </li>
            ) : (
              hasil.map((member, index) => {
                const aktif = member.id === value
                return (
                  <li key={member.id} role="option" aria-selected={aktif} id={`member-option-${member.id}`}>
                    <button
                      type="button"
                      onClick={() => pilih(member.id)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition',
                        index === activeIndex ? 'bg-slate-100' : 'hover:bg-slate-50',
                      )}
                    >
                      <Avatar nama={member.nama} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-slate-900">{member.nama}</span>
                        <span className="block text-[10px] text-slate-400">
                          {member.id} · {member.noHp}
                        </span>
                      </span>
                      <MemberStatusBadge status={resolveMemberStatus(member)} />
                      {aktif && <Check className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          <div className="border-t border-slate-100 bg-slate-50/70 px-3.5 py-2 text-[10px] text-slate-400">
            {hasil.length} member ditemukan · gunakan ↑ ↓ lalu Enter untuk memilih
          </div>
        </div>
      )}
    </div>
  )
}
