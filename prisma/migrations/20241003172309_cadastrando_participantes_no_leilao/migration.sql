-- CreateTable
CREATE TABLE `participantesLeilao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idParticipante` INTEGER NULL,
    `idLeilao` INTEGER NULL,

    INDEX `idLeilao`(`idLeilao`),
    INDEX `idParticipante`(`idParticipante`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `participantesLeilao` ADD CONSTRAINT `participantesLeilao_ibfk_1` FOREIGN KEY (`idParticipante`) REFERENCES `participantes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participantesLeilao` ADD CONSTRAINT `participantesLeilao_ibfk_2` FOREIGN KEY (`idLeilao`) REFERENCES `auction`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;
