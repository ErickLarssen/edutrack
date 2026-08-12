import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { EquipamentosPage } from './pages/EquipamentosPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { ProfessoresPage } from './pages/ProfessoresPage'
import { EmprestimosPage } from './pages/EmprestimosPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/equipamentos" element={<EquipamentosPage />} />
          <Route path="/professores" element={<ProfessoresPage />} />
          <Route path="/emprestimos" element={<EmprestimosPage />} />
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