-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_gondolaId_fkey";

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_gondolaId_fkey" FOREIGN KEY ("gondolaId") REFERENCES "Gondola"("id") ON DELETE CASCADE ON UPDATE CASCADE;
