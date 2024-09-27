const prisma = require('../config/db');

test('Cria um usuário no banco de dados', async () => {
    const novoUsuario = await prisma.participantes.create({
        data: {
            nome: 'Tarcyo',
            email: 'teste@teste.com'
        }
    })

    const participante = await prisma.participantes.findMany();

    console.log(JSON.stringify(participante, null, 2));
});

test('Busca todos os usuários', async () => {
    const result = await prisma.participantes.findMany();
    console.log(2, JSON.stringify(result, null, 2));
})