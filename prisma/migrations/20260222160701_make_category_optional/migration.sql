-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_categoryId_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
