/*
  Warnings:

  - A unique constraint covering the columns `[date,amount,paymentTypeId,description]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Payment_date_amount_paymentTypeId_key` ON `Payment`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_date_amount_paymentTypeId_description_key` ON `Payment`(`date`, `amount`, `paymentTypeId`, `description`);
