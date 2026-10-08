import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const sindico = await prisma.usuario.findUnique({ where: { email: 'sindico@nikobaracati.com.br' } });
  if (!sindico) {
    console.error('Sindico não encontrado');
    return;
  }
  const novaEtapa = await prisma.condominio.create({ 
    data: { 
      nome: 'Condomínio Niko Baracati - Etapa 3', 
      corIdentificacao: '#F97316' 
    } 
  });
  await prisma.usuario.update({ 
    where: { id: sindico.id }, 
    data: { condominios: { connect: { id: novaEtapa.id } } } 
  });
  console.log('Criada Etapa 3 Laranja e vinculada ao síndico!');
}

run().finally(() => prisma.$disconnect());
