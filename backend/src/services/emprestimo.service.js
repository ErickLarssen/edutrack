const AppError = require('../utils/AppError');
const emprestimoRepository = require('../repositories/emprestimo.repository');
const equipamentoRepository = require('../repositories/equipamento.repository');
const professorRepository = require('../repositories/professor.repository');

const criar = async (dados, usuarioId) => {
    const { equipamentoIds, ...dadosEmprestimo } = dados;

    const idsUnicos = [...new Set(equipamentoIds)];
    if (idsUnicos.length !== equipamentoIds.length) {
        throw new AppError('A lista contém equipamentos duplicados', 422);
    }

    const professor = await professorRepository.buscarPorId(dadosEmprestimo.professorId);
    if (!professor || !professor.ativo) {
        throw new AppError('Professor não encontrado ou inativo', 404);
    }

    const equipamentos = await equipamentoRepository.buscarPorIds(idsUnicos);

    if (equipamentos.length !== idsUnicos.length) {
        throw new AppError('Um ou mais equipamentos informados não existem', 404);
    }

    const indisponiveis = equipamentos.filter((eq) => eq.status !== 'DISPONIVEL');
    if (indisponiveis.length > 0) {
        const lista = indisponiveis.map((eq) => `${eq.numeroPatrimonio} (${eq.status})`).join(', ');
        throw new AppError(`Equipamento(s) indisponível(is): ${lista}`, 409);
    }

    return emprestimoRepository.criarComItens({
        dadosEmprestimo: { ...dadosEmprestimo, usuarioId },
        equipamentoIds: idsUnicos,
    });
};

const listar = (filtros) => emprestimoRepository.listar(filtros);

const buscarPorId = async (id) => {
    const emprestimo = await emprestimoRepository.buscarPorId(id);
    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }
    return emprestimo;
};

const atualizar = async (id, dados) => {
    await buscarPorId(id);
    return emprestimoRepository.atualizar(id, dados);
};

const adicionarItens = async (emprestimoId, equipamentoIds) => {
    const idsUnicos = [...new Set(equipamentoIds)];
    if (idsUnicos.length !== equipamentoIds.length) {
        throw new AppError('A lista contém equipamentos duplicados', 422);
    }

    const emprestimo = await buscarPorId(emprestimoId);
    if (emprestimo.status !== 'ATIVO') {
        throw new AppError('Não é possível adicionar equipamentos a um empréstimo já finalizado', 409);
    }

    const idsJaNoEmprestimo = emprestimo.itens.map((item) => item.equipamentoId);
    const jaIncluidos = idsUnicos.filter((id) => idsJaNoEmprestimo.includes(id));
    if (jaIncluidos.length > 0) {
        throw new AppError('Um ou mais equipamentos já fazem parte deste empréstimo', 409);
    }

    const equipamentos = await equipamentoRepository.buscarPorIds(idsUnicos);
    if (equipamentos.length !== idsUnicos.length) {
        throw new AppError('Um ou mais equipamentos informados não existem', 404);
    }

    const indisponiveis = equipamentos.filter((eq) => eq.status !== 'DISPONIVEL');
    if (indisponiveis.length > 0) {
        const lista = indisponiveis.map((eq) => `${eq.numeroPatrimonio} (${eq.status})`).join(', ');
        throw new AppError(`Equipamento(s) indisponível(is): ${lista}`, 409);
    }

    return emprestimoRepository.adicionarItens(emprestimoId, idsUnicos);
};

module.exports = { criar, listar, buscarPorId, atualizar, adicionarItens };