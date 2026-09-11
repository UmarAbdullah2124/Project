-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "accountManagerId" TEXT,
ADD COLUMN     "mrr" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
