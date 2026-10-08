import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function gerarCpfFicticio(index: number) {
  const num = index.toString().padStart(9, '0');
  return `${num.substring(0,3)}.${num.substring(3,6)}.${num.substring(6,9)}-00`;
}

async function importar() {
  console.log('Iniciando importação de moradores...');

  const condominio = await prisma.condominio.findFirst({ where: { nome: 'Condomínio Niko Baracati' } });
  if (!condominio) {
    console.error('❌ Condomínio Niko Baracati não encontrado. Rode o seed_admin primeiro!');
    process.exit(1);
  }

  const filePath = path.join(__dirname, 'moradores.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');

  let importados = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const regex = /PARCELAMENTO\s+(.*?)\s+BL\s+([A-Z])\s+AP\s+(\d+)\s+N\s+BARACAT\s+2/i;
    const match = line.match(regex);

    if (match) {
      const nome = match[1].trim();
      const bloco = match[2].trim();
      const numero = match[3].trim();

      try {
        let unidade = await prisma.unidade.findFirst({
          where: {
            condominioId: condominio.id,
            bloco,
            numero
          }
        });

        if (!unidade) {
          unidade = await prisma.unidade.create({
            data: { condominioId: condominio.id, bloco, numero, status: 'OCUPADO' }
          });
        }

        const cpfFicticio = gerarCpfFicticio(i + 1);

        await prisma.morador.create({
          data: {
            condominioId: condominio.id,
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
    }
  }

  console.log(`\n🎉 Importação concluída! Total de moradores importados: ${importados}`);
  await prisma.$disconnect();
}

importar().catch(console.error);
