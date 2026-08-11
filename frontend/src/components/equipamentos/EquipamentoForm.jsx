import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { equipamentoSchema } from '../../validations/equipamentoSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { TIPO_EQUIPAMENTO } from '../../utils/statusEquipamento'

export function EquipamentoForm({ equipamento, onSubmit, enviando }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(equipamentoSchema),
        defaultValues: {
            numeroPatrimonio: equipamento?.numeroPatrimonio ?? '',
            numeroSerie: equipamento?.numeroSerie ?? '',
            marca: equipamento?.marca ?? '',
            modelo: equipamento?.modelo ?? '',
            tipo: equipamento?.tipo ?? 'TABLET',
            localizacao: equipamento?.localizacao ?? '',
            observacoes: equipamento?.observacoes ?? '',
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Número de patrimônio" error={errors.numeroPatrimonio?.message} {...register('numeroPatrimonio')} />
                <Input label="Número de série" error={errors.numeroSerie?.message} {...register('numeroSerie')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Marca" error={errors.marca?.message} {...register('marca')} />
                <Input label="Modelo" error={errors.modelo?.message} {...register('modelo')} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Tipo</label>
                <select
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    {...register('tipo')}
                >
                    {Object.entries(TIPO_EQUIPAMENTO).map(([valor, label]) => (
                        <option key={valor} value={valor}>{label}</option>
                    ))}
                </select>
                {errors.tipo && <span className="text-sm text-red-600">{errors.tipo.message}</span>}
            </div>
            <Input label="Localização" error={errors.localizacao?.message} {...register('localizacao')} />
            <Input label="Observações" error={errors.observacoes?.message} {...register('observacoes')} />
            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Salvando...' : 'Salvar'}
            </Button>
        </form>
    )
}