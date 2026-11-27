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

    // Impressão sempre em tema claro (senão texto claro sai invisível no papel)
    useEffect(() => {
        const aoImprimir = () => document.documentElement.classList.remove('dark')
        const depoisDeImprimir = () => document.documentElement.classList.toggle('dark', tema === 'dark')
        window.addEventListener('beforeprint', aoImprimir)
        window.addEventListener('afterprint', depoisDeImprimir)
        return () => {
            window.removeEventListener('beforeprint', aoImprimir)
            window.removeEventListener('afterprint', depoisDeImprimir)
        }
    }, [tema])

    const alternar = () => setTema((atual) => (atual === 'dark' ? 'light' : 'dark'))

    return { tema, alternar }
}