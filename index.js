const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.participantes.findMany();
    console.log(JSON.stringify(result, null, 2));
}

main()