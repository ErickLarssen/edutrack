import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarEmprestimoSchema, atualizarEmprestimoSchema } from '../../validations/emprestimoSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { EquipamentoMultiSelect } from './EquipamentoMultiSelect'
import { useProfessores } from '../../hooks/useProfessores'
import { useEmprestimo } from '../../hooks/useEmprestimo'

export function EmprestimoForm({ emprestimoId, onSubmit, enviando }) {
    const modoEdicao = !!emprestimoId
    const { data: emprestimo, isLoading: carregando } = useEmprestimo(emprestimoId)

    if (modoEdicao && carregando) {
        return <p className="text-sm text-slate-500">Carregando dados do empréstimo...</p>
    }

    return <EmprestimoFormCampos modoEdicao={modoEdicao} emprestimo={emprestimo} onSubmit={onSubmit} enviando={enviando} />
}

function horaDePrevisao(previsaoDevolucao) {
    return previsaoDevolucao ? new Date(previsaoDevolucao).toTimeString().slice(0, 5) : ''
}

function EmprestimoFormCampos({ modoEdicao, emprestimo, onSubmit, enviando }) {
    const { data: professoresData } = useProfessores()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(modoEdicao ? atualizarEmprestimoSchema : criarEmprestimoSchema),
        defaultValues: modoEdicao
            ? {
                sala: emprestimo.sala ?? '',
                turma: emprestimo.turma ?? '',
                alunoResponsavel: emprestimo.alunoResponsavel ?? '',
                previsaoDevolucao: horaDePrevisao(emprestimo.previsaoDevolucao),
                observacoes: emprestimo.observacoes ?? '',
            }
            : {
                professorId: '',
                equipamentoIds: [],
                data: new Date().toISOString().slice(0, 10),
                hora: new Date().toTimeString().slice(0, 5),
                sala: '',
                turma: '',
                alunoResponsavel: '',
                previsaoDevolucao: '',
                observacoes: '',
            },
    })

    const handleSubmitInterno = (valores) => {
        const dataBase = modoEdicao ? emprestimo.data : valores.data
        const payload = { ...valores }

        if (payload.previsaoDevolucao) {
            const dataFormatada = new Date(dataBase).toISOString().slice(0, 10)
            payload.previsaoDevolucao = `${dataFormatada}T${payload.previsaoDevolucao}:00`
        }

        onSubmit(payload)
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitInterno)} className="flex flex-col gap-4">
            {modoEdicao && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-900">Professor:</span> {emprestimo.professor.nome}</p>
                    <p className="mt-1">
                        <span className="font-medium text-slate-900">Equipamentos:</span>{' '}
                        {emprestimo.itens.map((item) => item.equipamento.numeroPatrimonio).join(', ')}
                    </p>
                </div>
            )}

            {!modoEdicao && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Professor</label>
                        <select
                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            {...register('professorId')}
                        >
                            <option value="">Selecione um professor</option>
                            {professoresData?.dados.map((professor) => (
                                <option key={professor.id} value={professor.id}>{professor.nome}</option>
                            ))}
                        </select>
                        {errors.professorId && <span className="text-sm text-red-600">{errors.professorId.message}</span>}
                    </div>

                    <EquipamentoMultiSelect control={control} error={errors.equipamentoIds?.message} />

                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Data" error={errors.data?.message} {...register('data')} />
                        <Input type="time" label="Hora" error={errors.hora?.message} {...register('hora')} />
                    </div>
                </>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input label="Sala" error={errors.sala?.message} {...register('sala')} />
                <Input label="Turma" error={errors.turma?.message} {...register('turma')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Aluno responsável" error={errors.alunoResponsavel?.message} {...register('alunoResponsavel')} />
                <Input
                    type="time"
                    label="Previsão de devolução (mesmo dia)"
                    error={errors.previsaoDevolucao?.message}
                    {...register('previsaoDevolucao')}
                />
            </div>
            <Input label="Observações" error={errors.observacoes?.message} {...register('observacoes')} />

            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Salvando...' : 'Salvar'}
            </Button>
        </form>
    )
}