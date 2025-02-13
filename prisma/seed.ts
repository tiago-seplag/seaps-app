import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.organization.createMany({
    data: [
      { name: "SEPLAG" },
      { name: "JUCEMAT" },
      { name: "SETASC " },
      { name: "PGE" },
      { name: "MT PREV" },
      { name: "SEDUC" },
      { name: "METAMAT" },
      { name: "SEDEC" },
      { name: "SEFAZ" },
      { name: "SECEL" },
      { name: "SEMA" },
      { name: "SES" },
      { name: "SINFRA" },
      { name: "CASA CIVIL" },
      { name: "POLITEC" },
      { name: "PMMT" },
      { name: "SESP" },
      { name: "CIOSP" },
      { name: "PM" },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
