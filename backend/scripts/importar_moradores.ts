import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Função auxiliar para gerar um CPF fictício sequencial
function gerarCpfFicticio(index: number) {
  const num = index.toString().padStart(9, '0');
  return `${num.substring(0,3)}.${num.substring(3,6)}.${num.substring(6,9)}-00`;
}

async function importar() {
  console.log('Iniciando importação de moradores...');

  const filePath = path.join(__dirname, 'moradores.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');

  let importados = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Regex para pegar NOME, BLOCO e APARTAMENTO
    // Ex: PARCELAMENTO LUSINETE DA SILVA COSTA HENNIS BL A AP 11 N BARACAT 2
    const regex = /PARCELAMENTO\s+(.*?)\s+BL\s+([A-Z])\s+AP\s+(\d+)\s+N\s+BARACAT\s+2/i;
    const match = line.match(regex);

    if (match) {
      const nome = match[1].trim();
      const bloco = match[2].trim();
      const numero = match[3].trim();

      try {
        // 1. Cria a unidade (se não existir)
        let unidade = await prisma.unidade.findUnique({
          where: {
            bloco_numero: {
              bloco,
              numero
            }
          }
        });

        if (!unidade) {
          unidade = await prisma.unidade.create({
            data: { bloco, numero, status: 'OCUPADO' }
          });
        }

        // 2. Cria o morador (gera um CPF falso sequencial para não quebrar a regra de @unique)
        // O síndico poderá atualizar isso depois no sistema.
        const cpfFicticio = gerarCpfFicticio(i + 1);

        await prisma.morador.create({
          data: {
            nome,
            cpf: cpfFicticio,
            unidadeId: unidade.id,
            ativo: true
          }
        });

        importados++;
        console.log(`✅ Importado: ${nome} -> Bloco ${bloco} Ap ${numero}`);
      } catch (err: any) {
        console.error(`❌ Erro ao importar a linha: ${line} ->`, err.message);
      }
    } else {
      console.warn(`⚠️ Linha não reconhecida (ignorada): ${line}`);
    }
  }

  console.log(`\n🎉 Importação concluída! Total de moradores importados: ${importados}`);
  await prisma.$disconnect();
}

importar().catch(console.error);
