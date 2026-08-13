import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PageTransition } from '../components/PageTransition'

export function AppLayout() {
    const [sidebarAberta, setSidebarAberta] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

            <div className="md:pl-64">
                <Topbar onAbrirMenu={() => setSidebarAberta(true)} />
                <main className="p-6">
                    <PageTransition />
                </main>
            </div>
        </div>
    )
}