export function limparPayload(objeto) {
    return Object.fromEntries(
        Object.entries(objeto).filter(([, valor]) => valor !== '' && valor !== undefined && valor !== null)
    )
}