import { useState, useEffect } from 'react'

export function useDebouncedValue(valor, atraso = 300) {
  const [valorComAtraso, setValorComAtraso] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => setValorComAtraso(valor), atraso)
    return () => clearTimeout(timer)
  }, [valor, atraso])

  return valorComAtraso
}