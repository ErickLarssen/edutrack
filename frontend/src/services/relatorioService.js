import api from './api'

export const relatorioService = {
    equipamentosMaisUtilizados: async (limite) => {
        const { data } = await api.get('/relatorios/equipamentos-mais-utilizados', { params: { limite } })
        return data.data
    },
    equipamentosMaisDanificados: async (limite) => {
        const { data } = await api.get('/relatorios/equipamentos-mais-danificados', { params: { limite } })
        return data.data
    },
    tempoMedioEmprestimo: async () => {
        const { data } = await api.get('/relatorios/tempo-medio-emprestimo')
        return data.data
    },
}