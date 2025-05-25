import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.certificateExpiry.updateMany({
    where: { status: 'expiring' },
    data: { status: 'expired' },
  });
  console.log(`Updated ${updated.count} certificate(s) from 'expiring' to 'expired'.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
