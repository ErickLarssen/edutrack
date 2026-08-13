import { useRef } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function PageTransition() {
    const location = useLocation()
    const containerRef = useRef(null)

    useGSAP(
        () => {
            gsap.fromTo(containerRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
        },
        { dependencies: [location.pathname], scope: containerRef }
    )

    return (
        <div ref={containerRef}>
            <Outlet />
        </div>
    )
}