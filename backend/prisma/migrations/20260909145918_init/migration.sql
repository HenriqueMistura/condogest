-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bloco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OCUPADO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "moradores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unidadeId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "asaasId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "moradores_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "receitas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moradorId" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "valorAtualizado" REAL,
    "dataVencimento" DATETIME NOT NULL,
    "dataPagamento" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "tipo" TEXT NOT NULL,
    "linkFatura" TEXT,
    "transacaoIdApi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "receitas_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "moradores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "despesas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "dataVencimento" DATETIME NOT NULL,
    "dataPagamento" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "fornecedor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_bloco_numero_key" ON "unidades"("bloco", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "moradores_cpf_key" ON "moradores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "moradores_asaasId_key" ON "moradores"("asaasId");

-- CreateIndex
CREATE UNIQUE INDEX "receitas_transacaoIdApi_key" ON "receitas"("transacaoIdApi");

-- CreateIndex
CREATE INDEX "receitas_status_idx" ON "receitas"("status");

-- CreateIndex
CREATE INDEX "receitas_dataVencimento_idx" ON "receitas"("dataVencimento");
