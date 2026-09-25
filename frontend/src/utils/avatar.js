const PALETA = [
    { bg: 'bg-brand-100 dark:bg-brand-500/20', text: 'text-brand-700 dark:text-brand-300' },
    { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
    { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300' },
    { bg: 'bg-sky-100 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300' },
    { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300' },
    { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-300' },
]

export function iniciaisDe(nome = '') {
    return nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase()).join('')
}

export function corDoAvatar(chave = '') {
    let hash = 0
    for (let indice = 0; indice < chave.length; indice++) {
        hash = chave.charCodeAt(indice) + ((hash << 5) - hash)
    }
    return PALETA[Math.abs(hash) % PALETA.length]
}