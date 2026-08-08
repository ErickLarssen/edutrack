require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const senhaHash = await bcrypt.hash(process.env.ADMIN_SENHA, 10);

    const admin = await prisma.usuario.upsert({
        where: { email: process.env.ADMIN_EMAIL },
        update: {},
        create: {
            nome: process.env.ADMIN_NOME,
            email: process.env.ADMIN_EMAIL,
            senhaHash,
            role: 'ADMIN',
        },
    });

    console.log('✅ Usuário admin garantido:', admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });