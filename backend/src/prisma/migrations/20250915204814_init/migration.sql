/*
  Warnings:

  - You are about to drop the `clientdebt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientsales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientsalesitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchaseitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchasepayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saleitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clientdebt` DROP FOREIGN KEY `ClientDebt_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `clientsales` DROP FOREIGN KEY `ClientSales_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `clientsalesitem` DROP FOREIGN KEY `ClientSalesItem_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `clientsalesitem` DROP FOREIGN KEY `ClientSalesItem_sale_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_sale_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `productstatus` DROP FOREIGN KEY `ProductStatus_barcode_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchasepayment` DROP FOREIGN KEY `PurchasePayment_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `saleitem` DROP FOREIGN KEY `SaleItem_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `saleitem` DROP FOREIGN KEY `SaleItem_sale_id_fkey`;

-- DropTable
DROP TABLE `clientdebt`;

-- DropTable
DROP TABLE `clientsales`;

-- DropTable
DROP TABLE `clientsalesitem`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `productstatus`;

-- DropTable
DROP TABLE `purchaseitem`;

-- DropTable
DROP TABLE `purchasepayment`;

-- DropTable
DROP TABLE `saleitem`;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(36) NOT NULL,
    `barcode` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price1` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `price2` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `price3` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `unit` VARCHAR(50) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `production_date` DATE NULL,
    `expiration_date` DATE NULL,
    `image_path` VARCHAR(191) NULL,
    `category` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unitId` INTEGER NULL,
    `categoryId` INTEGER NULL,

    UNIQUE INDEX `products_barcode_key`(`barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_id` INTEGER NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `change_amount` DOUBLE NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_items` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_id` INTEGER NOT NULL,
    `product_id` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `product_name` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `price` DECIMAL(10, 2) NULL,
    `total_price` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_items` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `product_id` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `product_name` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `price` DECIMAL(10, 2) NULL,
    `total_price` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `change_amount` DOUBLE NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `status` ENUM('Expired', 'Valid') NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_sales` (
    `sale_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_date` DATE NULL,
    `sale_time` TIME NULL,
    `subtotal` DECIMAL(10, 2) NULL,
    `discount` DECIMAL(10, 2) NULL,
    `debt` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `customer_name` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,

    PRIMARY KEY (`sale_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_sales_item` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `product_id` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `product_name` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `price` DECIMAL(10, 2) NULL,
    `total_price` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_debts` (
    `debt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `debt_date` DATE NOT NULL,
    `status` ENUM('غير مدفوع', 'مدفوع جزئيًا', 'مدفوع') NOT NULL DEFAULT 'غير مدفوع',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`debt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payments` ADD CONSTRAINT `purchase_payments_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`purchase_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`purchase_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`sale_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_status` ADD CONSTRAINT `product_status_barcode_fkey` FOREIGN KEY (`barcode`) REFERENCES `products`(`barcode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_sales` ADD CONSTRAINT `client_sales_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `client`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_sales_item` ADD CONSTRAINT `client_sales_item_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `client_sales`(`sale_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_sales_item` ADD CONSTRAINT `client_sales_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_debts` ADD CONSTRAINT `client_debts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `client`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_name_of_category_key` TO `category_name_of_category_key`;

-- RenameIndex
ALTER TABLE `unit` RENAME INDEX `Unit_unit_name_key` TO `unit_unit_name_key`;
