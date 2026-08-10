import api from './api'

export const equipamentoService = {
    listar: async (filtros) => {
        const { data } = await api.get('/equipamentos', { params: filtros })
        return data.data
    },
    criar: async (payload) => {
        const { data } = await api.post('/equipamentos', payload)
        return data.data
    },
    atualizar: async (id, payload) => {
        const { data } = await api.put(`/equipamentos/${id}`, payload)
        return data.data
    },
    inativar: async (id) => {
        const { data } = await api.delete(`/equipamentos/${id}`)
        return data.data
    },
    reativar: async (id) => {
        const { data } = await api.patch(`/equipamentos/${id}/reativar`)
        return data.data
    },
}