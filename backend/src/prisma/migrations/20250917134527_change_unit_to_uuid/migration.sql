/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `products` table. All the data in the column will be lost.
  - The primary key for the `unit` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_unitId_fkey`;

-- DropIndex
DROP INDEX `products_categoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_unitId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `products` DROP COLUMN `category`,
    DROP COLUMN `unit`,
    MODIFY `unitId` VARCHAR(36) NULL,
    MODIFY `categoryId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `unit` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
