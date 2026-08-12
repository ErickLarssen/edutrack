import api from './api'

export const emprestimoService = {
    listar: async (filtros) => {
        const { data } = await api.get('/emprestimos', { params: filtros })
        return data.data
    },
    buscarPorId: async (id) => {
        const { data } = await api.get(`/emprestimos/${id}`)
        return data.data
    },
    criar: async (payload) => {
        const { data } = await api.post('/emprestimos', payload)
        return data.data
    },
    atualizar: async (id, payload) => {
        const { data } = await api.put(`/emprestimos/${id}`, payload)
        return data.data
    },
}