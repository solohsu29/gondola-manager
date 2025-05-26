-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "content" BYTEA;
