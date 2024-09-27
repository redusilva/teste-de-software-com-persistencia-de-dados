const { execSync } = require('child_process');
const prisma = require('./config/db');

const DATABASE_URL = process.env.DATABASE_URL;
const databaseName = DATABASE_URL.split('@localhost:3306/')[1];

beforeEach(async () => {
    execSync(`DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy`);
});

afterEach(async () => {
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${databaseName}\``);
});

