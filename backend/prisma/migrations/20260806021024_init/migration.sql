-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'COORDENADOR', 'DIRETOR', 'ESTAGIARIO') NOT NULL DEFAULT 'ESTAGIARIO',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `disciplina` VARCHAR(191) NOT NULL,
    `contato` VARCHAR(191) NULL,
    `periodo` VARCHAR(191) NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_patrimonio` VARCHAR(191) NOT NULL,
    `numero_serie` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('TABLET', 'NOTEBOOK', 'CHROMEBOOK') NOT NULL,
    `foto_url` VARCHAR(191) NULL,
    `qr_code` VARCHAR(191) NULL,
    `status` ENUM('DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO', 'INATIVO') NOT NULL DEFAULT 'DISPONIVEL',
    `localizacao` VARCHAR(191) NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipamentos_numero_patrimonio_key`(`numero_patrimonio`),
    UNIQUE INDEX `equipamentos_numero_serie_key`(`numero_serie`),
    UNIQUE INDEX `equipamentos_qr_code_key`(`qr_code`),
    INDEX `equipamentos_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emprestimos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `professor_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `sala` VARCHAR(191) NULL,
    `turma` VARCHAR(191) NULL,
    `aluno_responsavel` VARCHAR(191) NULL,
    `previsao_devolucao` DATETIME(3) NULL,
    `observacoes` TEXT NULL,
    `status` ENUM('ATIVO', 'FINALIZADO') NOT NULL DEFAULT 'ATIVO',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `emprestimos_professor_id_idx`(`professor_id`),
    INDEX `emprestimos_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emprestimo_itens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emprestimo_id` INTEGER NOT NULL,
    `equipamento_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `emprestimo_itens_emprestimo_id_idx`(`emprestimo_id`),
    INDEX `emprestimo_itens_equipamento_id_idx`(`equipamento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devolucoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emprestimo_item_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `conferencia` ENUM('OK', 'COM_PROBLEMA') NOT NULL,
    `danos` TEXT NULL,
    `fotos` JSON NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `devolucoes_emprestimo_item_id_key`(`emprestimo_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manutencoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamento_id` INTEGER NOT NULL,
    `problema` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
    `status` ENUM('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA') NOT NULL DEFAULT 'ABERTA',
    `fotos` JSON NULL,
    `registrado_por` INTEGER NOT NULL,
    `data_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_solucao` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `manutencoes_equipamento_id_idx`(`equipamento_id`),
    INDEX `manutencoes_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emprestimos` ADD CONSTRAINT `emprestimos_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `professores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emprestimos` ADD CONSTRAINT `emprestimos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emprestimo_itens` ADD CONSTRAINT `emprestimo_itens_emprestimo_id_fkey` FOREIGN KEY (`emprestimo_id`) REFERENCES `emprestimos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emprestimo_itens` ADD CONSTRAINT `emprestimo_itens_equipamento_id_fkey` FOREIGN KEY (`equipamento_id`) REFERENCES `equipamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devolucoes` ADD CONSTRAINT `devolucoes_emprestimo_item_id_fkey` FOREIGN KEY (`emprestimo_item_id`) REFERENCES `emprestimo_itens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devolucoes` ADD CONSTRAINT `devolucoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_equipamento_id_fkey` FOREIGN KEY (`equipamento_id`) REFERENCES `equipamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_registrado_por_fkey` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
