import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/equipamentos" element={<PlaceholderPage title="Equipamentos" />} />
          <Route path="/professores" element={<PlaceholderPage title="Professores" />} />
          <Route path="/emprestimos" element={<PlaceholderPage title="Empréstimos" />} />
          <Route path="/devolucoes" element={<PlaceholderPage title="Devoluções" />} />
          <Route path="/manutencoes" element={<PlaceholderPage title="Manutenção" />} />
          <Route path="/relatorios" element={<PlaceholderPage title="Relatórios" />} />
          <Route path="/usuarios" element={<PlaceholderPage title="Usuários" />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App