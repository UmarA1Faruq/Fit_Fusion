import { createContext, useContext, useState, type ReactNode } from 'react'
import { createSeedData } from '../data/mockData'
import type {
  Member,
  MemberInput,
  Paket,
  PaketInput,
  Pengaturan,
  Transaksi,
  TransaksiInput,
} from '../types'
import { addDays, daysUntil } from '../utils/date'
import { hitungPeriodeBaru } from '../utils/member'

interface AppState {
  members: Member[]
  transactions: Transaksi[]
  packages: Paket[]
  pengaturan: Pengaturan
  isAuthenticated: boolean
}

interface AppContextValue extends AppState {
  login: (email: string, password: string) => void
  logout: () => void
  addMember: (input: MemberInput) => Member
  updateMember: (id: string, input: MemberInput) => Member | null
  deleteMember: (id: string) => Member | null
  addTransaction: (input: TransaksiInput) => { transaksi: Transaksi; member: Member } | null
  addPackage: (input: PaketInput) => Paket
  updatePackage: (id: string, input: PaketInput) => void
  updatePengaturan: (partial: Partial<Pengaturan>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function buatId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function nomorBerikutnya(values: string[]): number {
  return (
    values.reduce((maks, value) => {
      const cocok = /(\d+)$/.exec(value)
      return cocok ? Math.max(maks, Number(cocok[1])) : maks
    }, 0) + 1
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    ...createSeedData(),
    isAuthenticated: false,
  }))

  function login(_email: string, _password: string) {
    setState((prev) => ({ ...prev, isAuthenticated: true }))
  }

  function logout() {
    setState((prev) => ({ ...prev, isAuthenticated: false }))
  }

  function addMember(input: MemberInput): Member {
    const paket = state.packages.find((item) => item.id === input.paketId) ?? state.packages[0]
    const id = `MBR-${String(nomorBerikutnya(state.members.map((item) => item.id))).padStart(3, '0')}`
    const tanggalBerakhir = addDays(input.tanggalMulai, paket.durasiHari)
    const member: Member = {
      ...input,
      id,
      paketId: paket.id,
      tanggalBerakhir,
      status: daysUntil(tanggalBerakhir) < 0 ? 'Kedaluwarsa' : 'Aktif',
    }
    setState((prev) => ({ ...prev, members: [member, ...prev.members] }))
    return member
  }

  function updateMember(id: string, input: MemberInput): Member | null {
    const current = state.members.find((item) => item.id === id)
    const paket = state.packages.find((item) => item.id === input.paketId)
    if (!current || !paket) return null

    const tanggalBerakhir = addDays(input.tanggalMulai, paket.durasiHari)
    const status =
      current.status === 'Nonaktif'
        ? 'Nonaktif'
        : daysUntil(tanggalBerakhir) < 0
          ? 'Kedaluwarsa'
          : 'Aktif'

    const updated: Member = {
      ...current,
      ...input,
      paketId: paket.id,
      tanggalBerakhir,
      status,
    }
    setState((prev) => ({
      ...prev,
      members: prev.members.map((item) => (item.id === id ? updated : item)),
    }))
    return updated
  }

  function deleteMember(id: string): Member | null {
    const target = state.members.find((item) => item.id === id)
    if (!target) return null
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((item) => item.id !== id),
      transactions: prev.transactions.filter((item) => item.memberId !== id),
    }))
    return target
  }

  function addTransaction(input: TransaksiInput): { transaksi: Transaksi; member: Member } | null {
    const member = state.members.find((item) => item.id === input.memberId)
    const paket = state.packages.find((item) => item.id === input.paketId)
    if (!member || !paket) return null

    const periode = hitungPeriodeBaru(member, paket, input.tanggal)
    const tahun = input.tanggal.slice(0, 4)
    const urutan = nomorBerikutnya(state.transactions.map((item) => item.invoice))
    const transaksi: Transaksi = {
      id: buatId('trx'),
      invoice: `INV-${tahun}-${String(urutan).padStart(4, '0')}`,
      memberId: member.id,
      paketId: paket.id,
      tanggal: input.tanggal,
      jumlah: paket.harga,
      metode: input.metode,
      status: 'Lunas',
      catatan: input.catatan.trim() || `Perpanjangan paket ${paket.nama}.`,
    }

    const memberBaru: Member = {
      ...member,
      paketId: paket.id,
      tanggalMulai: periode.mulai,
      tanggalBerakhir: periode.berakhir,
      status: 'Aktif',
    }

    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaksi],
      members: prev.members.map((item) => (item.id === member.id ? memberBaru : item)),
    }))

    return { transaksi, member: memberBaru }
  }

  function addPackage(input: PaketInput): Paket {
    const id = `pkg-${nomorBerikutnya(state.packages.map((item) => item.id))}`
    const paket: Paket = { ...input, id }
    setState((prev) => ({ ...prev, packages: [...prev.packages, paket] }))
    return paket
  }

  function updatePackage(id: string, input: PaketInput) {
    setState((prev) => ({
      ...prev,
      packages: prev.packages.map((item) => (item.id === id ? { ...item, ...input } : item)),
    }))
  }

  function updatePengaturan(partial: Partial<Pengaturan>) {
    setState((prev) => ({
      ...prev,
      pengaturan: { ...prev.pengaturan, ...partial },
    }))
  }

  const value: AppContextValue = {
    ...state,
    login,
    logout,
    addMember,
    updateMember,
    deleteMember,
    addTransaction,
    addPackage,
    updatePackage,
    updatePengaturan,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp harus dipakai di dalam AppProvider.')
  }
  return context
}
