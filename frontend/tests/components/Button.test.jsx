import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../src/components/ui/Button'

describe('Button', () => {
    it('renderiza o texto do botão', () => {
        render(<Button>Salvar</Button>)
        expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    })

    it('chama onClick quando clicado', async () => {
        const aoClicar = vi.fn()
        render(<Button onClick={aoClicar}>Entrar</Button>)

        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        expect(aoClicar).toHaveBeenCalledTimes(1)
    })

    it('não chama onClick quando desabilitado', async () => {
        const aoClicar = vi.fn()
        render(
            <Button onClick={aoClicar} disabled>
                Entrar
            </Button>
        )

        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        expect(aoClicar).not.toHaveBeenCalled()
    })
})