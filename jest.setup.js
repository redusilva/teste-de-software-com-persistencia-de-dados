const prisma = require('./config/db');

const DATABASE_URL = process.env.DATABASE_URL;
const databaseName = DATABASE_URL.split('@localhost:3306/')[1];

const cleanDatabase = async () => {
    await prisma.$transaction([
        prisma.participantes.deleteMany(),
        prisma.auction.deleteMany(),
    ]);
}

const resetAutoIncrement = async () => {
    const tables = ['participantes', 'auction'];

    for (const table of tables) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} AUTO_INCREMENT = 1;`);
    }
}

beforeEach(async () => {
    await cleanDatabase();
    await resetAutoIncrement();
});

afterAll(async () => {
    await cleanDatabase();
});
