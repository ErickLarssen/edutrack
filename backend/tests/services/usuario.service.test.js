jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hash-fake') }));

const usuarioService = require('../../src/services/usuario.service');
const usuarioRepository = require('../../src/repositories/usuario.repository');

jest.mock('../../src/repositories/usuario.repository');

describe('usuario.service — proteções de autossabotagem', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('impede o usuário de desativar a própria conta', async () => {
        await expect(usuarioService.inativar(1, { id: 1, role: 'ADMIN' })).rejects.toThrow(
            'Você não pode desativar sua própria conta'
        );
        expect(usuarioRepository.inativar).not.toHaveBeenCalled();
    });

    it('impede desativar o último administrador ativo', async () => {
        usuarioRepository.buscarPorId.mockResolvedValue({ id: 2, role: 'ADMIN' });
        usuarioRepository.contarAdminsAtivos.mockResolvedValue(1);

        await expect(usuarioService.inativar(2, { id: 1, role: 'ADMIN' })).rejects.toThrow(
            'Não é possível desativar o último administrador ativo'
        );
    });

    it('permite desativar outro admin quando existe mais de um ativo', async () => {
        usuarioRepository.buscarPorId.mockResolvedValue({ id: 2, role: 'ADMIN' });
        usuarioRepository.contarAdminsAtivos.mockResolvedValue(2);
        usuarioRepository.inativar.mockResolvedValue({ id: 2, ativo: false });

        const resultado = await usuarioService.inativar(2, { id: 1, role: 'ADMIN' });

        expect(usuarioRepository.inativar).toHaveBeenCalledWith(2);
        expect(resultado.ativo).toBe(false);
    });

    it('impede o admin de remover o próprio papel de administrador', async () => {
        usuarioRepository.buscarPorId.mockResolvedValue({ id: 1, role: 'ADMIN', email: 'admin@edutrack.com' });

        await expect(
            usuarioService.atualizar(1, { role: 'ESTAGIARIO' }, { id: 1, role: 'ADMIN' })
        ).rejects.toThrow('Você não pode remover seu próprio papel de administrador');
    });
});