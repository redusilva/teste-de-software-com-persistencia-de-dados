-- CreateTable
CREATE TABLE `auction` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeProduto` VARCHAR(255) NOT NULL,
    `inicio` DATETIME(3) NOT NULL,
    `fim` DATETIME(3) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;