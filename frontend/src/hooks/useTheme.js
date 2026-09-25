import { useEffect, useState } from 'react'

const CHAVE = 'proadesk:tema'

function obterTemaInicial() {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'dark' || salvo === 'light') return salvo
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
    const [tema, setTema] = useState(obterTemaInicial)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', tema === 'dark')
        localStorage.setItem(CHAVE, tema)
    }, [tema])

    const alternar = () => setTema((atual) => (atual === 'dark' ? 'light' : 'dark'))

    return { tema, alternar }
}