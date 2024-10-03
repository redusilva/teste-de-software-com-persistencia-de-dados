/* eslint-disable no-undef */
const {
    criaLeilao,
    cadastraUsuarioNoLeilao,
} = require('../source/auction.js');

const { Leilao } = require('../model/auctionModel.js');
const { Participante } = require('../model/userModel.js');
const { criaUsuario } = require('../source/user.js');
const { criaLance, buscaLancePorId, buscaLancesPorLeilao, buscaLancesPorParticipante, buscaTodosLances } = require('../source/lance.js');

test('Não deve criar um lance sem um leilão', async () => {
    try {
        await criaLance(1, 1, 1000);
        throw new Error('Lance criado sem leilão');
    } catch (error) {
        expect(error.message).toEqual('Leilão não encontrado.');
    }
})

test('Deve criar um lance com o leilão aberto', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    await cadastraUsuarioNoLeilao(participanteLeilao.id, leilao.ID);
    const lance = await criaLance(participanteLeilao.id, leilao.ID, 1000);

    expect(lance).toEqual(expect.objectContaining({
        id: expect.any(Number),
        valor: 1000,
        idParticipante: participanteLeilao.id,
        idLeilao: leilao.ID
    }));
})

test('Não deve criar um lance com leilão inativo', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'));

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 1000);
        fail();
    } catch (error) {
        expect(error.message).toEqual('Leilão não aberto.');
    }
})

test('Não deve criar um lance com leilão finalizado', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'));

    objLeilao.abrirLeilao();
    objLeilao.finalizarLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 1000);
        fail();
    } catch (error) {
        expect(error.message).toEqual('Leilão não aberto.');
    }
})

test('Não deve criar um lance com leilão expirado', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'));

    objLeilao.abrirLeilao();
    objLeilao.expirarLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 1000);
        fail();
    } catch (error) {
        expect(error.message).toEqual('Leilão não aberto.');
    }
})

test('Não deve aceitar um lance sem o participante estar cadastrado no leilão', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'), 100)
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 1000);
        throw new Error('O teste deveria falhar!');
    } catch (error) {
        expect(error.message).toEqual('Participante não cadastrado no leilão!');
    }
})

test('Não deve criar um lance valor menor que o minimo exigido pelo leilão', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'), 1000);

    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 100);
        throw new Error('O teste deveria falhar!');
    } catch (error) {
        expect(error.message).toEqual('Lance inferior ao minimo.');
    }
})

test('Não deve criar um leilão sem um participante válido', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    try {
        await criaLance(12, leilao.ID, 1000);
    } catch (error) {
        expect(error.message).toEqual('Participante não encontrado.');
    }
})

test('Não deve aceitar um lance valor menor que o anterior', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'), 1000);

    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante1);

    await cadastraUsuarioNoLeilao(participanteLeilao.id, leilao.ID);
    await criaLance(participanteLeilao.id, leilao.ID, 10000);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    try {
        await criaLance(participanteLeilao2.id, leilao.ID, 1500);
        throw new Error('O teste deveria falhar!');
    } catch (error) {
        expect(error.message).toEqual('O valor do novo do lance deve ser maior que o anterior!');
    }
})

test('Não deve aceitar o mesmo participante fazer dois lances seguidos', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'), 1000);

    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    await cadastraUsuarioNoLeilao(participanteLeilao.id, leilao.ID);
    await criaLance(participanteLeilao.id, leilao.ID, 10000);

    try {
        await criaLance(participanteLeilao.id, leilao.ID, 100000);
        throw new Error('O teste deveria falhar!');
    } catch (error) {
        expect(error.message).toEqual('Um participante não pode realizar dois lances seguidos!');
    }
})

test('Deve buscar um lance pelo id', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao = await criaUsuario(participante);

    await cadastraUsuarioNoLeilao(participanteLeilao.id, leilao.ID);
    const lance = await criaLance(participanteLeilao.id, leilao.ID, 1000);

    const lanceBuscado = await buscaLancePorId(lance.id);

    expect(lance).toEqual(lanceBuscado);
})

test('Deve buscar todos os lances de um leilão', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao1 = await criaUsuario(participante1);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    const lance1 = await criaLance(participanteLeilao1.id, leilao.ID, 1000);
    const lance2 = await criaLance(participanteLeilao2.id, leilao.ID, 2000);
    const lance3 = await criaLance(participanteLeilao1.id, leilao.ID, 3000);
    const lance4 = await criaLance(participanteLeilao2.id, leilao.ID, 4000);

    const lancesLeilao = await buscaLancesPorLeilao(leilao.ID);
    expect(lancesLeilao).toEqual([lance1, lance2, lance3, lance4]);
})

test('Deve buscar todos os lances de um participante no leilão', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao1 = await criaUsuario(participante1);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    const lance1 = await criaLance(participanteLeilao1.id, leilao.ID, 1000);
    const lance2 = await criaLance(participanteLeilao2.id, leilao.ID, 2000);
    const lance3 = await criaLance(participanteLeilao1.id, leilao.ID, 3000);
    const lance4 = await criaLance(participanteLeilao2.id, leilao.ID, 4000);

    const lancesUsuario1 = await buscaLancesPorParticipante(participanteLeilao1.id);
    expect(lancesUsuario1).toEqual([lance1, lance3]);

    const lancesUsuario2 = await buscaLancesPorParticipante(participanteLeilao2.id);
    expect(lancesUsuario2).toEqual([lance2, lance4]);
})

test('Deve buscar todos os lances independente do leilão', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao1 = await criaUsuario(participante1);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    const lance1 = await criaLance(participanteLeilao1.id, leilao.ID, 1000);
    const lance2 = await criaLance(participanteLeilao2.id, leilao.ID, 2000);
    const lance3 = await criaLance(participanteLeilao1.id, leilao.ID, 3000);
    const lance4 = await criaLance(participanteLeilao2.id, leilao.ID, 4000);

    let objLeilao2 = new Leilao('Leilao 2', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao2.abrirLeilao();
    const leilao2 = await criaLeilao(objLeilao2);
    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao2.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao2.ID);

    const lance1Leilao2 = await criaLance(participanteLeilao1.id, leilao2.ID, 1000);
    const lance2Leilao2 = await criaLance(participanteLeilao2.id, leilao2.ID, 2000);
    const lance3Leilao2 = await criaLance(participanteLeilao1.id, leilao2.ID, 3000);
    const lance4Leilao2 = await criaLance(participanteLeilao2.id, leilao2.ID, 4000);

    const todosLances = await buscaTodosLances();
    expect(todosLances).toEqual([lance1, lance2, lance3, lance4, lance1Leilao2, lance2Leilao2, lance3Leilao2, lance4Leilao2]);
})

test('Deve buscar todos os lances de um leilão em ordem crescente', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao1 = await criaUsuario(participante1);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    const lance1 = await criaLance(participanteLeilao1.id, leilao.ID, 1000);
    const lance2 = await criaLance(participanteLeilao2.id, leilao.ID, 2000);
    const lance3 = await criaLance(participanteLeilao1.id, leilao.ID, 3000);
    const lance4 = await criaLance(participanteLeilao2.id, leilao.ID, 4000);

    const lancesLeilao = await buscaLancesPorLeilao(leilao.ID, 'valor', 'asc');
    expect(lancesLeilao).toEqual([lance1, lance2, lance3, lance4]);
})

test('Deve buscar todos os lances de um leilão em ordem decrescente', async () => {
    let objLeilao = new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01'))
    objLeilao.abrirLeilao();

    let leilao = await criaLeilao(objLeilao);

    const participante1 = new Participante('Tarcyo', 'tarcyomaia@gmail.com');
    const participanteLeilao1 = await criaUsuario(participante1);

    const participante2 = new Participante('Rodrigo', 'rodrigoeduardo@gmail.com');
    const participanteLeilao2 = await criaUsuario(participante2);

    await cadastraUsuarioNoLeilao(participanteLeilao1.id, leilao.ID);
    await cadastraUsuarioNoLeilao(participanteLeilao2.id, leilao.ID);

    const lance1 = await criaLance(participanteLeilao1.id, leilao.ID, 1000);
    const lance2 = await criaLance(participanteLeilao2.id, leilao.ID, 2000);
    const lance3 = await criaLance(participanteLeilao1.id, leilao.ID, 3000);
    const lance4 = await criaLance(participanteLeilao2.id, leilao.ID, 4000);

    const lancesLeilao = await buscaLancesPorLeilao(leilao.ID, 'valor', 'desc');
    expect(lancesLeilao).toEqual([lance4, lance3, lance2, lance1]);
})