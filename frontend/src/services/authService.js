import api from './api'

export const authService = {
    login: async (email, senha) => {
        const { data } = await api.post('/auth/login', { email, senha })
        return data.data
    },
    me: async () => {
        const { data } = await api.get('/auth/me')
        return data.data
    },
}