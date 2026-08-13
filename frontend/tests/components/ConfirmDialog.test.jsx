import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog'

describe('ConfirmDialog', () => {
    it('não renderiza nada quando "aberto" é falso', () => {
        render(
            <ConfirmDialog aberto={false} onFechar={() => { }} onConfirmar={() => { }} titulo="Inativar" descricao="Tem certeza?" />
        )
        expect(screen.queryByText('Inativar')).not.toBeInTheDocument()
    })

    it('exibe título e descrição quando aberto', () => {
        render(
            <ConfirmDialog
                aberto
                onFechar={() => { }}
                onConfirmar={() => { }}
                titulo="Inativar equipamento"
                descricao="Tem certeza que deseja inativar PAT-001?"
            />
        )
        expect(screen.getByText('Inativar equipamento')).toBeInTheDocument()
        expect(screen.getByText('Tem certeza que deseja inativar PAT-001?')).toBeInTheDocument()
    })

    it('chama onConfirmar ao clicar em Confirmar', async () => {
        const onConfirmar = vi.fn()
        render(<ConfirmDialog aberto onFechar={() => { }} onConfirmar={onConfirmar} titulo="Inativar" descricao="Tem certeza?" />)

        await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

        expect(onConfirmar).toHaveBeenCalledTimes(1)
    })

    it('chama onFechar ao clicar em Cancelar', async () => {
        const onFechar = vi.fn()
        render(<ConfirmDialog aberto onFechar={onFechar} onConfirmar={() => { }} titulo="Inativar" descricao="Tem certeza?" />)

        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(onFechar).toHaveBeenCalledTimes(1)
    })
})