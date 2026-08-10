import api from './api'

export const dashboardService = {
    obterResumo: async () => {
        const { data } = await api.get('/dashboard')
        return data.data
    },
}