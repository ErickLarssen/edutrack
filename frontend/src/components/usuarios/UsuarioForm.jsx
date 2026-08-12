import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../../validations/usuarioSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ROLES, ROLE_LABELS } from '../../utils/role'
import { useAuth } from '../../contexts/AuthContext'

export function UsuarioForm({ usuario, onSubmit, enviando }) {
    const modoEdicao = !!usuario
    const { usuario: usuarioLogado } = useAuth()
    const editandoProprioAdmin = modoEdicao && usuario.id === usuarioLogado.id && usuario.role === 'ADMIN'

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(modoEdicao ? atualizarUsuarioSchema : criarUsuarioSchema),
        defaultValues: modoEdicao
            ? { nome: usuario.nome ?? '', email: usuario.email ?? '', senha: '', role: usuario.role }
            : { nome: '', email: '', senha: '', role: 'ESTAGIARIO' },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Nome" error={errors.nome?.message} {...register('nome')} />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Input
                label={modoEdicao ? 'Nova senha (deixe em branco para manter)' : 'Senha'}
                type="password"
                error={errors.senha?.message}
                {...register('senha')}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Papel</label>
                <select
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                    disabled={editandoProprioAdmin}
                    {...register('role')}
                >
                    {ROLES.map((role) => (
                        <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                    ))}
                </select>
                {editandoProprioAdmin && (
                    <span className="text-xs text-slate-500">Você não pode alterar seu próprio papel de administrador.</span>
                )}
                {errors.role && <span className="text-sm text-red-600">{errors.role.message}</span>}
            </div>

            <Button type="submit" disabled={enviando} className="mt-2">
                {enviando ? 'Salvando...' : 'Salvar'}
            </Button>
        </form>
    )
}