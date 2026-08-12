export const STATUS_MANUTENCAO = {
    ABERTA: { label: 'Aberta', variant: 'warning' },
    EM_ANDAMENTO: { label: 'Em andamento', variant: 'info' },
    CONCLUIDA: { label: 'Concluída', variant: 'success' },
}

export const PRIORIDADE_MANUTENCAO = {
    BAIXA: { label: 'Baixa', variant: 'neutral' },
    MEDIA: { label: 'Média', variant: 'warning' },
    ALTA: { label: 'Alta', variant: 'danger' },
}

export const TRANSICOES_VALIDAS = {
    ABERTA: ['EM_ANDAMENTO', 'CONCLUIDA'],
    EM_ANDAMENTO: ['CONCLUIDA'],
    CONCLUIDA: [],
}