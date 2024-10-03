/*
  Warnings:

  - Added the required column `lanceMinimo` to the `auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auction` ADD COLUMN `lanceMinimo` FLOAT NOT NULL;

-- CreateTable
CREATE TABLE `lances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` FLOAT NOT NULL,
    `idParticipante` INTEGER NOT NULL,
    `idLeilao` INTEGER NOT NULL,

    INDEX `idLeilao`(`idLeilao`),
    INDEX `idParticipante`(`idParticipante`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lances` ADD CONSTRAINT `lances_ibfk_1` FOREIGN KEY (`idParticipante`) REFERENCES `participantes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `lances` ADD CONSTRAINT `lances_ibfk_2` FOREIGN KEY (`idLeilao`) REFERENCES `auction`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;
