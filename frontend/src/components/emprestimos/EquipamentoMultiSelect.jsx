import { Controller } from 'react-hook-form'
import { useEquipamentos } from '../../hooks/useEquipamentos'

export function EquipamentoMultiSelect({ control, error }) {
    const { data, isLoading } = useEquipamentos({ status: 'DISPONIVEL', limite: 100 })

    return (
        <Controller
            control={control}
            name="equipamentoIds"
            render={({ field }) => {
                const selecionados = field.value || []

                const alternar = (id) => {
                    if (selecionados.includes(id)) {
                        field.onChange(selecionados.filter((item) => item !== id))
                    } else {
                        field.onChange([...selecionados, id])
                    }
                }

                return (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Equipamentos disponíveis</label>
                        <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-300">
                            {isLoading && <p className="p-3 text-sm text-slate-500">Carregando...</p>}
                            {data?.dados.length === 0 && (
                                <p className="p-3 text-sm text-slate-500">Nenhum equipamento disponível no momento.</p>
                            )}
                            {data?.dados.map((equipamento) => (
                                <label
                                    key={equipamento.id}
                                    className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 hover:bg-slate-50"
                                >
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
                        {error && <span className="text-sm text-red-600">{error}</span>}
                    </div>
                )
            }}
        />
    )
}