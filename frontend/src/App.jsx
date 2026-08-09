import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function DashboardPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-700">Dashboard (em construção)</p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App