import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../../src/pages/LoginPage'
import { AuthProvider } from '../../src/contexts/AuthContext'
import { authService } from '../../src/services/authService'

vi.mock('../../src/services/authService')

function renderLoginPage() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('não exibe nenhuma mensagem de erro antes do envio', () => {
        renderLoginPage()
        expect(screen.queryByText('Credenciais inválidas')).not.toBeInTheDocument()
    })

    it('exibe a mensagem de erro vinda da API quando o login falha', async () => {
        authService.login.mockRejectedValue({
            response: { data: { error: { message: 'Credenciais inválidas' } } },
        })

        renderLoginPage()

        await userEvent.type(screen.getByLabelText('Email'), 'admin@edutrack.com')
        await userEvent.type(screen.getByLabelText('Senha'), 'senhaerrada')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument()
    })
})