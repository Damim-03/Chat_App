-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name_of_category` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Category_name_of_category_key`(`name_of_category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unit_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Unit_unit_name_key`(`unit_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
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

    UNIQUE INDEX `Product_barcode_key`(`barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchases` (
    `purchase_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_date` DATE NULL,
    `purchase_time` TIME NULL,
    `subtotal` DECIMAL(10, 2) NULL,
    `discount` DECIMAL(10, 2) NULL,
    `debt` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `customer_name` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,

    PRIMARY KEY (`purchase_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePayment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_id` INTEGER NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `change_amount` DOUBLE NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseItem` (
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
CREATE TABLE `Sales` (
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
CREATE TABLE `SaleItem` (
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
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `change_amount` DOUBLE NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `status` ENUM('Expired', 'Valid') NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `customer_id` VARCHAR(50) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `image_path` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientSales` (
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
CREATE TABLE `ClientSalesItem` (
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
CREATE TABLE `ClientDebt` (
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

-- CreateTable
CREATE TABLE `ClientPayment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `amount_paid` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATE NOT NULL,
    `payment_time` TIME NOT NULL,
    `status` ENUM('تم الدفع', 'لم يتم الدفع') NOT NULL DEFAULT 'لم يتم الدفع',

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `Purchases`(`purchase_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `Purchases`(`purchase_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `Sales`(`sale_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `Sales`(`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductStatus` ADD CONSTRAINT `ProductStatus_barcode_fkey` FOREIGN KEY (`barcode`) REFERENCES `Product`(`barcode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientSales` ADD CONSTRAINT `ClientSales_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Client`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientSalesItem` ADD CONSTRAINT `ClientSalesItem_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `ClientSales`(`sale_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientSalesItem` ADD CONSTRAINT `ClientSalesItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientDebt` ADD CONSTRAINT `ClientDebt_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Client`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientPayment` ADD CONSTRAINT `ClientPayment_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Client`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
