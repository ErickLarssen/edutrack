import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function useRevealOnData(dependencia) {
    const containerRef = useRef(null)

    useGSAP(
        () => {
            const alvos = containerRef.current?.children
            if (!alvos || alvos.length === 0) return
            gsap.from(alvos, { opacity: 0, y: 10, duration: 0.35, stagger: 0.06, ease: 'power2.out' })
        },
        { dependencies: [dependencia], scope: containerRef }
    )

    return containerRef
}