import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../src/components/ui/Badge'

describe('Badge', () => {
    it('renderiza o texto passado como children', () => {
        render(<Badge>Disponível</Badge>)
        expect(screen.getByText('Disponível')).toBeInTheDocument()
    })

    it('aplica a cor correspondente à variante informada', () => {
        render(<Badge variant="danger">Com problema</Badge>)
        expect(screen.getByText('Com problema').className).toContain('bg-red-100')
    })

    it('usa a variante "neutral" como padrão quando nenhuma é informada', () => {
        render(<Badge>Padrão</Badge>)
        expect(screen.getByText('Padrão').className).toContain('bg-slate-100')
    })
})