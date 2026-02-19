-- CreateEnum
CREATE TYPE "ProcessPriority" AS ENUM ('BAIXA', 'MÉDIA', 'ALTA', 'CRÍTICA');

-- AlterTable
ALTER TABLE "processes" ADD COLUMN     "priority" "ProcessPriority" NOT NULL DEFAULT 'MÉDIA';
