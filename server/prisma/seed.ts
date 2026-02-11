import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('Admin123!', 12);

    // Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@helios.com' },
        update: {},
        create: {
            email: 'admin@helios.com',
            passwordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Seed: Super Admin created', admin.email);

    // Create a sample client
    const client = await prisma.client.upsert({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }, // Fixed ID for sample
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            companyName: 'Acme Corp',
            primaryContactName: 'John Doe',
            primaryColor: '#0066FF',
        },
    });

    console.log('Seed: Sample Client created', client.companyName);

    // Create a client user
    const clientUser = await prisma.user.upsert({
        where: { email: 'client@acme.com' },
        update: {},
        create: {
            email: 'client@acme.com',
            passwordHash,
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'CLIENT',
            clientId: client.id,
        },
    });

    console.log('Seed: Client User created', clientUser.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
