const request = require('supertest');
const app = require('../../src/app');
const usuarioRepository = require('../../src/repositories/usuario.repository');
const bcrypt = require('bcryptjs');

jest.mock('../../src/repositories/usuario.repository');
jest.mock('bcryptjs');

describe('POST /api/v1/auth/login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retorna token quando as credenciais são válidas', async () => {
        usuarioRepository.buscarPorEmail.mockResolvedValue({
            id: 1,
            nome: 'Admin',
            email: 'admin@edutrack.com',
            senhaHash: 'hash-fake',
            role: 'ADMIN',
            ativo: true,
        });
        bcrypt.compare.mockResolvedValue(true);

        const resposta = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'admin@edutrack.com', senha: 'qualquercoisa' });

        expect(resposta.status).toBe(200);
        expect(resposta.body.success).toBe(true);
        expect(resposta.body.data.token).toBeDefined();
    });

    it('retorna 401 quando a senha está incorreta', async () => {
        usuarioRepository.buscarPorEmail.mockResolvedValue({ id: 1, senhaHash: 'hash-fake', ativo: true });
        bcrypt.compare.mockResolvedValue(false);

        const resposta = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'admin@edutrack.com', senha: 'errada' });

        expect(resposta.status).toBe(401);
        expect(resposta.body.error.message).toBe('Credenciais inválidas');
    });

    it('retorna 422 quando o email tem formato inválido', async () => {
        const resposta = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'nao-e-um-email', senha: '123' });

        expect(resposta.status).toBe(422);
    });
});