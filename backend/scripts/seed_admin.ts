import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  // 1. Criar o Super Admin (Você)
  const emailSuper = 'admin@misturatec.com.br';
  const senhaSuper = 'mistura123';

  let superAdmin = await prisma.usuario.findUnique({ where: { email: emailSuper } });

  if (!superAdmin) {
    const senhaHash = await bcrypt.hash(senhaSuper, 10);
    superAdmin = await prisma.usuario.create({
      data: {
        nome: 'Mistura Tec (Super Admin)',
        email: emailSuper,
        senha: senhaHash,
        role: 'SUPER_ADMIN'
      }
    });
    console.log(`✅ Super Admin criado! Email: ${emailSuper}`);
  }

  // 2. Criar o primeiro cliente: Condomínio Niko Baracati
  let condominio = await prisma.condominio.findFirst({ where: { nome: 'Condomínio Niko Baracati' } });

  if (!condominio) {
    condominio = await prisma.condominio.create({
      data: {
        nome: 'Condomínio Niko Baracati',
        cnpj: '00.000.000/0001-00',
        asaasApiKey: process.env.ASAAS_API_KEY || ''
      }
    });
    console.log(`✅ Condomínio ${condominio.nome} criado!`);
  }

  // 3. Criar o Síndico do Niko Baracati
  const emailSindico = 'sindico@nikobaracati.com.br';
  let sindico = await prisma.usuario.findUnique({ where: { email: emailSindico } });

  if (!sindico) {
    const senhaHash = await bcrypt.hash('sindico123', 10);
    await prisma.usuario.create({
      data: {
        nome: 'Síndico Niko Baracati',
        email: emailSindico,
        senha: senhaHash,
        role: 'SINDICO',
        condominios: {
          connect: [{ id: condominio.id }]
        }
      }
    });
    console.log(`✅ Síndico criado! Email: ${emailSindico}`);
  }
}

seedAdmin().catch(console.error).finally(() => prisma.$disconnect());
