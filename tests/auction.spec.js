const {
    criaLeilao,
    buscaTodosLeiloes,
    atualizaLeilao,
    buscaLeilaoPorId,
    buscaTotalLeiloes,
    buscaLeilaoPorNome,
    buscaLeilaoPorStatus,
} = require('../source/auction.js');

const { Leilao } = require('../model/auctionModel.js');

test('Testa se um leilão está sendo criado corretamente no banco de dados.', async () => {
    const agora = new Date();

    //Leilão Aberto:
    let inicioLeilao = new Date(agora.getTime() - 10 * 60 * 1000); // 10 minutos atrás
    let fimLeilao = new Date(agora.getTime() + 10 * 60 * 1000); // 10 minutos à frente

    const leilaoAberto = new Leilao('Produto Exemplo 1', inicioLeilao, fimLeilao);
    leilaoAberto.abrirLeilao();

    await criaLeilao(leilaoAberto);

    let leiloes = await buscaTodosLeiloes();

    expect(leiloes).toContainEqual(expect.objectContaining({
        ID: expect.any(Number),
        nomeProduto: 'Produto Exemplo 1',
        inicio: expect.any(Date),
        fim: expect.any(Date),
        status: 'ABERTO'
    }));


    //Leilão Inativo:
    inicioLeilao = new Date(agora.getTime() - 20 * 60 * 1000); // 10 minutos atrás
    fimLeilao = new Date(agora.getTime() - 10 * 60 * 1000); // 10 minutos à frente

    const leilaoInativo = new Leilao('Produto Exemplo 2', inicioLeilao, fimLeilao);
    leilaoInativo.expirarLeilao();

    await criaLeilao(leilaoInativo);

    leiloes = await buscaTodosLeiloes();

    expect(leiloes).toContainEqual(expect.objectContaining({
        ID: expect.any(Number),
        nomeProduto: 'Produto Exemplo 2',
        inicio: expect.any(Date),
        fim: expect.any(Date),
        status: 'EXPIRADO'
    }));


    //Leilão Inativo
    inicioLeilao = new Date(agora.getTime() + 20 * 60 * 1000); // 10 minutos atrás
    fimLeilao = new Date(agora.getTime() + 10 * 60 * 1000); // 10 minutos à frente

    const leilaoExpirado = new Leilao('Produto Exemplo 3', inicioLeilao, fimLeilao);

    await criaLeilao(leilaoExpirado);

    leiloes = await buscaTodosLeiloes();

    expect(leiloes).toContainEqual(expect.objectContaining({
        ID: expect.any(Number),
        nomeProduto: 'Produto Exemplo 3',
        inicio: expect.any(Date),
        fim: expect.any(Date),
        status: 'INATIVO'
    }));
});

test('Testa se um leilão é atualizado corretamente no banco de dados.', async () => {
    const agora = new Date();

    let inicioLeilao = new Date(agora.getTime() - 10 * 60 * 1000);
    let fimLeilao = new Date(agora.getTime() + 10 * 60 * 1000);

    const objLeilao = new Leilao('Produto Atualizado', inicioLeilao, fimLeilao);
    const leilaoAnterior = await criaLeilao(objLeilao);

    const objAtualizado = {
        ...leilaoAnterior,
        nomeProduto: 'Novo nome aqui',
    }

    const leilaoAtualizado = await atualizaLeilao(leilaoAnterior.ID, objAtualizado);
    const leilaoFinal = await buscaLeilaoPorId(leilaoAnterior.ID);
    expect(leilaoFinal).toEqual(objAtualizado);
});

test('Busca todos os leilões', async () => {
    const leilao1 = await criaLeilao(new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao2 = await criaLeilao(new Leilao('Leilao 2', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao3 = await criaLeilao(new Leilao('Leilao 3', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao4 = await criaLeilao(new Leilao('Leilao 4', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao5 = await criaLeilao(new Leilao('Leilao 5', new Date('2024-01-01'), new Date('2024-12-01')));

    const leiloes = await buscaTodosLeiloes();

    expect(leiloes).toHaveLength(5);
    expect(leiloes).toContainEqual(leilao1);
    expect(leiloes).toContainEqual(leilao2);
    expect(leiloes).toContainEqual(leilao3);
    expect(leiloes).toContainEqual(leilao4);
    expect(leiloes).toContainEqual(leilao5);
})

test('Busca um leilão por ID', async () => {
    const leilao = await criaLeilao(new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilaoEncontrado = await buscaLeilaoPorId(leilao.ID);
    expect(leilaoEncontrado).toEqual(leilao);
})

test('Busca um leilão por ID não existente', async () => {
    const leilao1 = await criaLeilao(new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao2 = await criaLeilao(new Leilao('Leilao 2', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao3 = await criaLeilao(new Leilao('Leilao 3', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao4 = await criaLeilao(new Leilao('Leilao 4', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao5 = await criaLeilao(new Leilao('Leilao 5', new Date('2024-01-01'), new Date('2024-12-01')));

    const totalLeiloes = await buscaTotalLeiloes();
    const leilaoEncontrado = await buscaLeilaoPorId(totalLeiloes + 1);

    expect(leilaoEncontrado).toBeNull();
})

test('Busca leião por nomoe', async () => {
    const leilao1 = await criaLeilao(new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao2 = await criaLeilao(new Leilao('Leilao 2', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao3 = await criaLeilao(new Leilao('Leilao 3', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao4 = await criaLeilao(new Leilao('Leilao 4', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao5 = await criaLeilao(new Leilao('Leilao 5', new Date('2024-01-01'), new Date('2024-12-01')));

    const leiloesEncontrados = await buscaLeilaoPorNome('Leilao 4');

    expect(leiloesEncontrados).toContainEqual(leilao4);
})

test('Busca leião inexistente por nomoe', async () => {
    const leilao1 = await criaLeilao(new Leilao('Leilao 1', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao2 = await criaLeilao(new Leilao('Leilao 2', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao3 = await criaLeilao(new Leilao('Leilao 3', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao4 = await criaLeilao(new Leilao('Leilao 4', new Date('2024-01-01'), new Date('2024-12-01')));
    const leilao5 = await criaLeilao(new Leilao('Leilao 5', new Date('2024-01-01'), new Date('2024-12-01')));

    const leiloesEncontrados = await buscaLeilaoPorNome('Leilao Inexistente');

    expect(leiloesEncontrados).toEqual([]);
})

test('Lista leilões por estado', async () => {
    const criaLeilaoAberto = async (nome) => {
        let leilao = new Leilao(nome, new Date('2024-01-01'), new Date('2024-12-01'));
        leilao.abrirLeilao();
        return await criaLeilao(leilao);
    };

    const criaLeilaoInativo = async (nome) => {
        let leilao = new Leilao(nome, new Date('2024-01-01'), new Date('2024-12-01'));
        return await criaLeilao(leilao);
    };

    const criaLeilaoExpirado = async (nome) => {
        let leilao = new Leilao(nome, new Date('2024-01-01'), new Date('2024-12-01'));
        leilao.expirarLeilao();
        return await criaLeilao(leilao);
    };

    const criaLeilaoFinalizado = async (nome) => {
        let leilao = new Leilao(nome, new Date('2024-01-01'), new Date('2024-12-01'));
        leilao.finalizarLeilao();
        return await criaLeilao(leilao);
    };

    const leilao1Aberto = await criaLeilaoAberto('Leilao 1');
    const leilao2Aberto = await criaLeilaoAberto('Leilao 2');

    const leilao3Inativo = await criaLeilaoInativo('Leilao 3');
    const leilao4Inativo = await criaLeilaoInativo('Leilao 4');

    const leilaoExpirado1 = await criaLeilaoExpirado('Leilao Expirado 1');
    const leilaoExpirado2 = await criaLeilaoExpirado('Leilao Expirado 2');
    const leilaoExpirado3 = await criaLeilaoExpirado('Leilao Expirado 3');

    const leilaoFinalizado1 = await criaLeilaoFinalizado('Leilao Finalizado 1');
    const leilaoFinalizado2 = await criaLeilaoFinalizado('Leilao Finalizado 2');
    const leilaoFinalizado3 = await criaLeilaoFinalizado('Leilao Finalizado 3');

    const leiloesAbertos = await buscaLeilaoPorStatus('ABERTO');
    expect(leiloesAbertos).toContainEqual(leilao1Aberto);
    expect(leiloesAbertos).toContainEqual(leilao2Aberto);
    expect(leiloesAbertos).toHaveLength(2);

    const leiloesInativos = await buscaLeilaoPorStatus('INATIVO');
    expect(leiloesInativos).toContainEqual(leilao3Inativo);
    expect(leiloesInativos).toContainEqual(leilao4Inativo);
    expect(leiloesInativos).toHaveLength(2);

    const leiloesExpirados = await buscaLeilaoPorStatus('EXPIRADO');
    expect(leiloesExpirados).toContainEqual(leilaoExpirado1);
    expect(leiloesExpirados).toContainEqual(leilaoExpirado2);
    expect(leiloesExpirados).toContainEqual(leilaoExpirado3);
    expect(leiloesExpirados).toHaveLength(3);

    const leiloesFinalizados = await buscaLeilaoPorStatus('FINALIZADO');
    expect(leiloesFinalizados).toContainEqual(leilaoFinalizado1);
    expect(leiloesFinalizados).toContainEqual(leilaoFinalizado2);
    expect(leiloesFinalizados).toContainEqual(leilaoFinalizado3);
    expect(leiloesFinalizados).toHaveLength(3);
});
