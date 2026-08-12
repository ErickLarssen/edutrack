import { useQuery } from '@tanstack/react-query'
import { relatorioService } from '../services/relatorioService'

export function useEquipamentosMaisUtilizados(limite = 5) {
    return useQuery({
        queryKey: ['relatorios', 'mais-utilizados', limite],
        queryFn: () => relatorioService.equipamentosMaisUtilizados(limite),
    })
}

export function useEquipamentosMaisDanificados(limite = 5) {
    return useQuery({
        queryKey: ['relatorios', 'mais-danificados', limite],
        queryFn: () => relatorioService.equipamentosMaisDanificados(limite),
    })
}

export function useTempoMedioEmprestimo() {
    return useQuery({
        queryKey: ['relatorios', 'tempo-medio'],
        queryFn: relatorioService.tempoMedioEmprestimo,
    })
}