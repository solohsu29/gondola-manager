import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Projects
  const project1 = await prisma.project.create({
    data: {
      clientName: 'Acme Corp',
      siteName: 'Sky Tower',
      startDate: new Date('2025-01-01'),
      status: 'active',
      deliveryOrders: {
        create: [{
          number: 'DO-001',
          date: new Date('2025-01-01'),
          fileUrl: 'https://example.com/do-001.pdf',
        }],
      },
    },
    include: { deliveryOrders: true },
  });

  const project2 = await prisma.project.create({
    data: {
      clientName: 'Beta Ltd',
      siteName: 'Riverfront',
      startDate: new Date('2025-02-15'),
      status: 'completed',
      deliveryOrders: {
        create: [{
          number: 'DO-002',
          date: new Date('2025-02-15'),
          fileUrl: 'https://example.com/do-002.pdf',
        }],
      },
    },
    include: { deliveryOrders: true },
  });

  // Seed Gondolas
  const gondola1 = await prisma.gondola.create({
    data: {
      serialNumber: 'GND-1001',
      status: 'deployed',
      bay: 'A1',
      floor: '10',
      block: 'B',
      elevation: '100m',
      deployedAt: new Date('2025-01-10'),
      projectId: project1.id,
    },
  });
  const gondola2 = await prisma.gondola.create({
    data: {
      serialNumber: 'GND-1002',
      status: 'in-use',
      bay: 'A2',
      floor: '12',
      block: 'C',
      elevation: '120m',
      deployedAt: new Date('2025-02-20'),
      projectId: project2.id,
    },
  });

  // Seed Certificate Expiries
  await prisma.certificateExpiry.create({
    data: {
      documentId: 'DOC-001',
      gondolaId: gondola1.id,
      serialNumber: gondola1.serialNumber,
      documentType: 'Safety',
      expiryDate: new Date('2025-12-31'),
      daysRemaining: 220,
      status: 'valid',
    },
  });
  await prisma.certificateExpiry.create({
    data: {
      documentId: 'DOC-002',
      gondolaId: gondola2.id,
      serialNumber: gondola2.serialNumber,
      documentType: 'Inspection',
      expiryDate: new Date('2025-10-15'),
      daysRemaining: 143,
      status: 'expired',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
