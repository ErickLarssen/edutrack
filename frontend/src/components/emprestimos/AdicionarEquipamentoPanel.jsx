import { useState } from 'react'
import { useEquipamentos } from '../../hooks/useEquipamentos'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SearchInput } from '../ui/SearchInput'
import { Button } from '../ui/Button'

export function AdicionarEquipamentoPanel({ onConfirmar, onCancelar, enviando }) {
    const [selecionados, setSelecionados] = useState([])
    const [busca, setBusca] = useState('')
    const buscaComAtraso = useDebouncedValue(busca)
    const { data, isLoading } = useEquipamentos({ status: 'DISPONIVEL', limite: 50, busca: buscaComAtraso || undefined })

    const alternar = (id) => {
        setSelecionados((atual) => (atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]))
    }

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4">
            <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por patrimônio..." />
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                {isLoading && <p className="p-3 text-sm text-slate-500">Carregando...</p>}
                {data?.dados.length === 0 && <p className="p-3 text-sm text-slate-500">Nenhum equipamento disponível.</p>}
                {data?.dados.map((equipamento) => (
                    <label key={equipamento.id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 hover:bg-slate-50">
                        <input
                            type="checkbox"
                            checked={selecionados.includes(equipamento.id)}
                            onChange={() => alternar(equipamento.id)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="font-medium text-slate-900">{equipamento.numeroPatrimonio}</span>
                        <span className="text-slate-500">{equipamento.marca} {equipamento.modelo}</span>
                    </label>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={onCancelar}>Cancelar</Button>
                <Button size="sm" disabled={selecionados.length === 0 || enviando} onClick={() => onConfirmar(selecionados)}>
                    {enviando ? 'Adicionando...' : `Adicionar (${selecionados.length})`}
                </Button>
            </div>
        </div>
    )
}