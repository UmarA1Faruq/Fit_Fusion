import { useState, type FormEvent } from 'react'
import { Check, Package, Pencil, Plus, Sparkles, Users } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/Toast'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { FormField } from '../components/ui/FormField'
import { Input, Textarea } from '../components/ui/Inputs'
import { EmptyState } from '../components/ui/EmptyState'
import { delay, cn } from '../utils/cn'
import { formatRupiah, labelDurasi, labelDurasiPanjang } from '../utils/format'
import type { Paket, PaketInput } from '../types'

export function PackagesPage() {
  const { packages, members } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Paket | null>(null)

  function bukaModal(paket: Paket | null) {
    setEditing(paket)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket Membership"
        description="Atur pilihan paket, durasi, dan harga yang ditawarkan ke member."
        actions={
          <Button onClick={() => bukaModal(null)} iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>
            Tambah Paket
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <Badge variant="brand" dot>
          {packages.length} paket aktif
        </Badge>
        <span>Perubahan harga hanya berlaku untuk transaksi baru.</span>
      </div>

      {packages.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={<Package className="h-6 w-6" aria-hidden="true" />}
            title="Belum ada paket membership"
            description="Buat paket pertama agar kamu bisa mencatat transaksi member."
            action={
              <Button onClick={() => bukaModal(null)} iconLeft={<Plus className="h-4 w-4" />}>
                Tambah Paket
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((paket, index) => {
            const unggulan = paket.id === 'pkg-2'
            const totalMember = members.filter((member) => member.paketId === paket.id).length
            return (
              <div
                key={paket.id}
                className={cn(
                  'relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift',
                  unggulan ? 'border-brand-300 ring-1 ring-brand-200' : 'border-slate-200/80',
                )}
              >
                {unggulan && (
                  <>
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-50" />
                    <div className="absolute right-4 top-4">
                      <Badge variant="brand">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Terpopuler
                      </Badge>
                    </div>
                  </>
                )}

                <div className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-xl',
                      index % 3 === 0
                        ? 'bg-brand-50 text-brand-600'
                        : index % 3 === 1
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-sky-50 text-sky-600',
                    )}
                  >
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{paket.nama}</h2>
                    <p className="text-[11px] text-slate-500">{labelDurasiPanjang(paket.durasiHari)}</p>
                  </div>
                </div>

                <p className="relative mt-4 min-h-[40px] text-xs leading-relaxed text-slate-500">{paket.deskripsi}</p>

                <div className="relative mt-4 flex items-end gap-1">
                  <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900">
                    {formatRupiah(paket.harga)}
                  </p>
                  <span className="pb-0.5 text-xs font-medium text-slate-400">/{labelDurasi(paket.durasiHari)}</span>
                </div>

                <div className="relative my-5 h-px bg-slate-100" />

                <ul className="relative space-y-2.5">
                  {paket.fitur.map((fitur) => (
                    <li key={fitur} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {fitur}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span className="font-bold text-slate-700">{totalMember}</span> member
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => bukaModal(paket)}
                    iconLeft={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Ubah Paket
                  </Button>
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={() => bukaModal(null)}
            className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 p-6 text-center transition hover:border-brand-300 hover:bg-brand-50/30"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Plus className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-800">Tambah Paket Baru</span>
              <span className="mt-1 block max-w-[200px] text-xs leading-relaxed text-slate-500">
                Buat penawaran baru untuk menarik lebih banyak member.
              </span>
            </span>
          </button>
        </div>
      )}

      {modalOpen && (
        <PackageModal
          key={editing?.id ?? 'baru'}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

interface PackageModalProps {
  editing: Paket | null
  onClose: () => void
  onSaved: () => void
}

function PackageModal({ editing, onClose, onSaved }: PackageModalProps) {
  const { packages, addPackage, updatePackage } = useApp()
  const { toast } = useToast()

  const [nama, setNama] = useState(editing?.nama ?? '')
  const [durasi, setDurasi] = useState(editing ? String(editing.durasiHari) : '30')
  const [harga, setHarga] = useState(editing ? String(editing.harga) : '')
  const [deskripsi, setDeskripsi] = useState(editing?.deskripsi ?? '')
  const [fitur, setFitur] = useState(editing?.fitur.join('\n') ?? '')
  const [errors, setErrors] = useState<{ nama?: string; durasi?: string; harga?: string }>({})
  const [saving, setSaving] = useState(false)

  function validate() {
    const next: { nama?: string; durasi?: string; harga?: string } = {}
    const namaBersih = nama.trim()
    const durasiAngka = Number(durasi)
    const hargaAngka = Number(harga)

    if (!namaBersih) {
      next.nama = 'Nama paket wajib diisi.'
    } else if (
      packages.some(
        (paket) => paket.id !== editing?.id && paket.nama.toLowerCase() === namaBersih.toLowerCase(),
      )
    ) {
      next.nama = 'Nama paket sudah digunakan. Gunakan nama lain.'
    }

    if (!durasi.trim()) {
      next.durasi = 'Durasi wajib diisi.'
    } else if (!Number.isFinite(durasiAngka) || durasiAngka < 1 || !Number.isInteger(durasiAngka)) {
      next.durasi = 'Durasi harus berupa angka bulat minimal 1 hari.'
    }

    if (!harga.trim()) {
      next.harga = 'Harga wajib diisi.'
    } else if (!Number.isFinite(hargaAngka) || hargaAngka < 1) {
      next.harga = 'Harga harus lebih dari Rp0.'
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: 'Periksa data paket.',
        description: 'Beberapa kolom belum diisi dengan benar.',
        variant: 'error',
      })
      return
    }

    setSaving(true)
    await delay(550)

    const payload: PaketInput = {
      nama: nama.trim(),
      durasiHari: Number(durasi),
      harga: Number(harga),
      deskripsi: deskripsi.trim() || 'Paket membership FitFusion.',
      fitur: fitur
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    if (payload.fitur.length === 0) {
      payload.fitur = ['Akses penuh area gym', 'Loker & kamar mandi']
    }

    if (editing) {
      updatePackage(editing.id, payload)
      toast({
        title: 'Perubahan paket disimpan.',
        description: `Paket ${payload.nama} sudah diperbarui.`,
        variant: 'success',
      })
    } else {
      addPackage(payload)
      toast({
        title: 'Paket berhasil ditambahkan.',
        description: `Paket ${payload.nama} sekarang tersedia untuk transaksi baru.`,
        variant: 'success',
      })
    }

    setSaving(false)
    onSaved()
  }

  return (
    <Modal
      open
      onClose={() => {
        if (!saving) onClose()
      }}
      title={editing ? 'Ubah Paket' : 'Tambah Paket'}
      description={
        editing
          ? 'Perbarui detail paket. Harga baru hanya berlaku untuk transaksi berikutnya.'
          : 'Lengkapi detail paket membership baru.'
      }
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button type="submit" form="form-paket" loading={saving} iconLeft={<Check className="h-4 w-4" />}>
            {saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambah Paket'}
          </Button>
        </>
      }
    >
      <form id="form-paket" onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField id="paket-nama" label="Nama Paket" required error={errors.nama}>
          <Input
            id="paket-nama"
            autoFocus
            placeholder="Contoh: Bulanan"
            value={nama}
            invalid={Boolean(errors.nama)}
            onChange={(event) => {
              setNama(event.target.value)
              setErrors((prev) => ({ ...prev, nama: undefined }))
            }}
            aria-invalid={errors.nama ? true : undefined}
            aria-describedby={errors.nama ? 'paket-nama-error' : undefined}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="paket-durasi"
            label="Durasi (hari)"
            required
            error={errors.durasi}
            hint="Contoh: 30, 90, atau 365 hari."
          >
            <Input
              id="paket-durasi"
              type="number"
              min={1}
              inputMode="numeric"
              value={durasi}
              invalid={Boolean(errors.durasi)}
              onChange={(event) => {
                setDurasi(event.target.value)
                setErrors((prev) => ({ ...prev, durasi: undefined }))
              }}
              aria-invalid={errors.durasi ? true : undefined}
              aria-describedby={errors.durasi ? 'paket-durasi-error' : 'paket-durasi-hint'}
            />
          </FormField>

          <FormField
            id="paket-harga"
            label="Harga (Rp)"
            required
            error={errors.harga}
            hint={harga && Number(harga) > 0 ? formatRupiah(Number(harga)) : 'Masukkan nominal tanpa titik.'}
          >
            <Input
              id="paket-harga"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="250000"
              value={harga}
              invalid={Boolean(errors.harga)}
              onChange={(event) => {
                setHarga(event.target.value)
                setErrors((prev) => ({ ...prev, harga: undefined }))
              }}
              aria-invalid={errors.harga ? true : undefined}
              aria-describedby={errors.harga ? 'paket-harga-error' : 'paket-harga-hint'}
            />
          </FormField>
        </div>

        <FormField id="paket-deskripsi" label="Deskripsi" hint="Opsional, tampil pada kartu paket.">
          <Textarea
            id="paket-deskripsi"
            rows={2}
            placeholder="Jelaskan keunggulan paket ini…"
            value={deskripsi}
            onChange={(event) => setDeskripsi(event.target.value)}
          />
        </FormField>

        <FormField
          id="paket-fitur"
          label="Fasilitas"
          hint="Satu fasilitas per baris. Kosongkan untuk memakai fasilitas default."
        >
          <Textarea
            id="paket-fitur"
            rows={4}
            placeholder={'Akses penuh area gym\nLoker & kamar mandi\nKonsultasi program'}
            value={fitur}
            onChange={(event) => setFitur(event.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  )
}
