/*
  Warnings:

  - You are about to drop the `clientpayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clientpayment` DROP FOREIGN KEY `ClientPayment_customer_id_fkey`;

-- DropTable
DROP TABLE `clientpayment`;

-- CreateTable
CREATE TABLE `client_payments` (
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
ALTER TABLE `client_payments` ADD CONSTRAINT `client_payments_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `client`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
