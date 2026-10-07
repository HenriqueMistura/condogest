import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const email = 'admin@condogest.com.br';
  const senhaPlana = 'admin123'; // Você deve mudar essa senha depois!

  const existe = await prisma.usuario.findUnique({ where: { email } });

  if (!existe) {
    const senhaHash = await bcrypt.hash(senhaPlana, 10);
    await prisma.usuario.create({
      data: {
        nome: 'Síndico Admin',
        email,
        senha: senhaHash,
        role: 'ADMIN'
      }
    });
    console.log(`✅ Usuário administrador criado com sucesso! Email: ${email} | Senha: ${senhaPlana}`);
  } else {
    console.log('⚠️ Usuário administrador já existe.');
  }
}

seedAdmin().catch(console.error).finally(() => prisma.$disconnect());
