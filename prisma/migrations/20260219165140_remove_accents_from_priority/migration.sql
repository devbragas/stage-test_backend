/*
  Warnings:

  - The values [MÉDIA,CRÍTICA] on the enum `ProcessPriority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcessPriority_new" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');
ALTER TABLE "public"."processes" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "processes" ALTER COLUMN "priority" TYPE "ProcessPriority_new" USING ("priority"::text::"ProcessPriority_new");
ALTER TYPE "ProcessPriority" RENAME TO "ProcessPriority_old";
ALTER TYPE "ProcessPriority_new" RENAME TO "ProcessPriority";
DROP TYPE "public"."ProcessPriority_old";
ALTER TABLE "processes" ALTER COLUMN "priority" SET DEFAULT 'MEDIA';
COMMIT;

-- AlterTable
ALTER TABLE "processes" ALTER COLUMN "priority" SET DEFAULT 'MEDIA';
