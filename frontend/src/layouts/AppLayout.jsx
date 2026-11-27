import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PageTransition } from '../components/PageTransition'

export function AppLayout() {
    const [sidebarAberta, setSidebarAberta] = useState(false)

    return (
        <div className="relative min-h-dvh px-3 pb-3 pt-[4.75rem] md:pb-4 md:pl-24 md:pr-4 md:pt-20 print:p-0">
            {/* Camada 0: fundo */}
            <div aria-hidden="true" className="fundo-app print:hidden" />

            {/* Camada 1: painel (stage) */}
            <main className="vidro-painel min-h-[calc(100dvh-6.25rem)] rounded-[28px] p-4 md:min-h-[calc(100dvh-6rem)] md:rounded-[34px] md:p-6 print:min-h-0 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:shadow-none print:backdrop-blur-none">
                <PageTransition />
            </main>

            {/* Camada 2: topbar e rail flutuantes */}
            <Topbar onAbrirMenu={() => setSidebarAberta(true)} />
            <Sidebar aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
        </div>
    )
}
