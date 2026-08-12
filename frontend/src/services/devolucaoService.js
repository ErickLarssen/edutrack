import api from './api'

export const devolucaoService = {
    registrar: async (emprestimoId, itemId, payload) => {
        const agora = new Date()
        const body = {
            ...payload,
            data: agora.toISOString().slice(0, 10),
            hora: agora.toTimeString().slice(0, 5),
        }
        const { data } = await api.post(`/emprestimos/${emprestimoId}/itens/${itemId}/devolucoes`, body)
        return data.data
    },
    listar: async (filtros) => {
        const { data } = await api.get('/devolucoes', { params: filtros })
        return data.data
    },
}