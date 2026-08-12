import api from './api'

export const usuarioService = {
    listar: async (filtros) => {
        const { data } = await api.get('/usuarios', { params: filtros })
        return data.data
    },
    criar: async (payload) => {
        const { data } = await api.post('/usuarios', payload)
        return data.data
    },
    atualizar: async (id, payload) => {
        const { data } = await api.put(`/usuarios/${id}`, payload)
        return data.data
    },
    inativar: async (id) => {
        const { data } = await api.delete(`/usuarios/${id}`)
        return data.data
    },
    reativar: async (id) => {
        const { data } = await api.patch(`/usuarios/${id}/reativar`)
        return data.data
    },
}