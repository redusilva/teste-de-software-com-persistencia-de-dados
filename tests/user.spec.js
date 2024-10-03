const { criaUsuario, buscaTodosUsuarios, buscaUsuarioPorEmail, atualizaUsuarioPorEmail } = require('../source/user.js');
const { Participante } = require('../model/userModel.js');

//Criação de usuário:
test('Testa de um usuário está sendo criado corretamente no banco de dados.', async () => {
    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');

    await criaUsuario(participante);

    const participantes = await buscaTodosUsuarios();



    expect(participantes).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Tarcyo',
        email: 'tarcyomaia@gmail.com'
    }));
});

test('Testa se um usuário é atualizado corretamente pelo e-mail.', async () => {
    const participanteOriginal = new Participante('Tarcyo Maia', 'tarcyomaia@gmail.com');
    const participante = await criaUsuario(participanteOriginal);

    const usuarioEncontrado = await buscaUsuarioPorEmail('tarcyomaia@gmail.com');
    expect(usuarioEncontrado).toEqual(participante);

    const novoNome = 'Tarcyo';
    const novoEmail = 'tarcyomaia@gmail.com';
    const novoParticipante = new Participante(novoNome, novoEmail);
    const participanteAtualizado = await atualizaUsuarioPorEmail('tarcyomaia@gmail.com', novoParticipante);

    expect(participanteAtualizado).toEqual(expect.objectContaining({
        nome: novoNome,
        email: novoEmail
    }))
});

test('Testa se um usuário pode ser buscado pelo e-mail.', async () => {
    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');

    await criaUsuario(participante);

    const usuarioEncontrado = await buscaUsuarioPorEmail('tarcyomaia@gmail.com');

    expect(usuarioEncontrado).toEqual(expect.objectContaining({
        nome: 'Tarcyo',
        email: 'tarcyomaia@gmail.com'
    }));

    const usuarioInexistente = await buscaUsuarioPorEmail('inexistente@gmail.com');
    expect(usuarioInexistente).toBeNull();

})


//Listagem de usuarios
test('Testa se os usuários estão sendo listados corretamente.', async () => {
    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participante3 = new Participante('Pamela', 'pamela@gmail.com');
    const participante4 = new Participante('Alex', 'alex@gmail.com');
    const participante5 = new Participante('Abigail', 'abigail@gmail.com');

    await criaUsuario(participante1);
    await criaUsuario(participante2);
    await criaUsuario(participante3);
    await criaUsuario(participante4);
    await criaUsuario(participante5);

    const result = await buscaTodosUsuarios();

    expect(result).toHaveLength(5);

    expect(result).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Tarcyo',
        email: 'tarcyomaia@gmail.com'
    }));

    expect(result).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Rodrigo',
        email: 'rodrigoeduardo@gmail.com'
    }));

    expect(result).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Pamela',
        email: 'pamela@gmail.com'
    }));

    expect(result).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Alex',
        email: 'alex@gmail.com'
    }));

    expect(result).toContainEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: 'Abigail',
        email: 'abigail@gmail.com'
    }));
});


