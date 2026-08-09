const relatorioRepository = require('../repositories/relatorio.repository');

const equipamentosMaisUtilizados = (limite) => relatorioRepository.equipamentosMaisUtilizados(limite);
const equipamentosMaisDanificados = (limite) => relatorioRepository.equipamentosMaisDanificados(limite);
const tempoMedioEmprestimo = () => relatorioRepository.tempoMedioEmprestimoDias();

module.exports = { equipamentosMaisUtilizados, equipamentosMaisDanificados, tempoMedioEmprestimo };