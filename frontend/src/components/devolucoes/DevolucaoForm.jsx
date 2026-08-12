import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { devolucaoSchema } from '../../validations/devolucaoSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function DevolucaoForm({ item, onSubmit, enviando }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(devolucaoSchema),
        defaultValues: { conferencia: 'OK', danos: '', observacoes: '' },
    })

    const conferencia = watch('conferencia')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-900">{item.equipamento.numeroPatrimonio}</p>
                <p className="text-slate-500">{item.equipamento.marca} {item.equipamento.modelo}</p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Conferência</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" value="OK" {...register('conferencia')} className="h-4 w-4 text-brand-600" />
                        Sem problemas
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" value="COM_PROBLEMA" {...register('conferencia')} className="h-4 w-4 text-brand-600" />
                        Com problema
                    </label>
                </div>
            </div>

            {conferencia === 'COM_PROBLEMA' && (
                <Input label="Descreva o dano" error={errors.danos?.message} {...register('danos')} />
            )}

            <Input label="Observações" error={errors.observacoes?.message} {...register('observacoes')} />

            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Registrando...' : 'Registrar devolução'}
            </Button>
        </form>
    )
}