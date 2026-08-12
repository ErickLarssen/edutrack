import api from './api'

export const manutencaoService = {
    listar: async (filtros) => {
        const { data } = await api.get('/manutencoes', { params: filtros })
        return data.data
    },
    criar: async (payload) => {
        const { data } = await api.post('/manutencoes', payload)
        return data.data
    },
    atualizar: async (id, payload) => {
        const { data } = await api.put(`/manutencoes/${id}`, payload)
        return data.data
    },
    atualizarStatus: async (id, status) => {
        const { data } = await api.patch(`/manutencoes/${id}/status`, { status })
        return data.data
    },
}