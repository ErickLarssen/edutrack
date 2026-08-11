import api from './api'

export const professorService = {
    listar: async (filtros) => {
        const { data } = await api.get('/professores', { params: filtros })
        return data.data
    },
    criar: async (payload) => {
        const { data } = await api.post('/professores', payload)
        return data.data
    },
    atualizar: async (id, payload) => {
        const { data } = await api.put(`/professores/${id}`, payload)
        return data.data
    },
    inativar: async (id) => {
        const { data } = await api.delete(`/professores/${id}`)
        return data.data
    },
    reativar: async (id) => {
        const { data } = await api.patch(`/professores/${id}/reativar`)
        return data.data
    },
}