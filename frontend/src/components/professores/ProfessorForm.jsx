import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { professorSchema } from '../../validations/professorSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function ProfessorForm({ professor, onSubmit, enviando }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(professorSchema),
        defaultValues: {
            nome: professor?.nome ?? '',
            disciplina: professor?.disciplina ?? '',
            contato: professor?.contato ?? '',
            periodo: professor?.periodo ?? '',
            observacoes: professor?.observacoes ?? '',
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Nome" error={errors.nome?.message} {...register('nome')} />
            <Input label="Disciplina" error={errors.disciplina?.message} {...register('disciplina')} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Contato" placeholder="Telefone ou email" error={errors.contato?.message} {...register('contato')} />
                <Input label="Período" placeholder="Manhã, Tarde..." error={errors.periodo?.message} {...register('periodo')} />
            </div>
            <Input label="Observações" error={errors.observacoes?.message} {...register('observacoes')} />
            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Salvando...' : 'Salvar'}
            </Button>
        </form>
    )
}