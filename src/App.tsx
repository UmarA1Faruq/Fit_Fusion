import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppContext'
import { ToastProvider } from './components/ui/Toast'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { MembersPage } from './pages/MembersPage'
import { MemberFormPage } from './pages/MemberFormPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { TransactionFormPage } from './pages/TransactionFormPage'
import { PackagesPage } from './pages/PackagesPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function RequireAuth() {
  const { isAuthenticated } = useApp()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/member" element={<MembersPage />} />
          <Route path="/member/tambah" element={<MemberFormPage />} />
          <Route path="/member/:id" element={<MemberDetailPage />} />
          <Route path="/member/:id/ubah" element={<MemberFormPage />} />
          <Route path="/transaksi" element={<TransactionsPage />} />
          <Route path="/transaksi/tambah" element={<TransactionFormPage />} />
          <Route path="/paket" element={<PackagesPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
