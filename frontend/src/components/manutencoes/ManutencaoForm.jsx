import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarManutencaoSchema, atualizarManutencaoSchema } from '../../validations/manutencaoSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useEquipamentos } from '../../hooks/useEquipamentos'

export function ManutencaoForm({ manutencao, onSubmit, enviando }) {
    const modoEdicao = !!manutencao
    const { data: equipamentosData } = useEquipamentos({ status: 'DISPONIVEL', limite: 100 })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(modoEdicao ? atualizarManutencaoSchema : criarManutencaoSchema),
        defaultValues: modoEdicao
            ? {
                problema: manutencao.problema ?? '',
                descricao: manutencao.descricao ?? '',
                prioridade: manutencao.prioridade,
            }
            : {
                equipamentoId: '',
                problema: '',
                descricao: '',
                prioridade: 'MEDIA',
            },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {modoEdicao ? (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <span className="font-medium text-slate-900">Equipamento:</span> {manutencao.equipamento.numeroPatrimonio}
                </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Equipamento</label>
                    <select
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        {...register('equipamentoId')}
                    >
                        <option value="">Selecione um equipamento disponível</option>
                        {equipamentosData?.dados.map((equipamento) => (
                            <option key={equipamento.id} value={equipamento.id}>
                                {equipamento.numeroPatrimonio} — {equipamento.marca} {equipamento.modelo}
                            </option>
                        ))}
                    </select>
                    {errors.equipamentoId && <span className="text-sm text-red-600">{errors.equipamentoId.message}</span>}
                </div>
            )}

            <Input label="Problema" error={errors.problema?.message} {...register('problema')} />
            <Input label="Descrição" error={errors.descricao?.message} {...register('descricao')} />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Prioridade</label>
                <select
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    {...register('prioridade')}
                >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                </select>
            </div>

            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Salvando...' : 'Salvar'}
            </Button>
        </form>
    )
}