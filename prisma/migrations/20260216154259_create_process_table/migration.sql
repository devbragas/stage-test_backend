-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('MANUAL', 'SISTEMICO');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "processes" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "descricao" TEXT,
    "areaId" UUID NOT NULL,
    "parentId" UUID,
    "tipo" "ProcessType" NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'ACTIVE',
    "responsaveis" TEXT[],
    "ferramentas" TEXT[],
    "documentacoes" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "processes_areaId_idx" ON "processes"("areaId");

-- CreateIndex
CREATE INDEX "processes_parentId_idx" ON "processes"("parentId");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
