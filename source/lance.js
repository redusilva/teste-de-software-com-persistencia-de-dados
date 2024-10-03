const prisma = require('../config/db');
const { buscaLeilaoPorId, usuarioEstaCadastradoNoLeilao } = require('./auction');
const { buscaUsuarioPorId } = require('./user');

async function criaLance(idParticipante, idLeilao, valor) {
    const leilao = await buscaLeilaoPorId(idLeilao);

    if (!leilao) {
        throw new Error('Leilão não encontrado.');
    }

    if (leilao.status !== 'ABERTO') {
        throw new Error('Leilão não aberto.');
    }

    if (valor < leilao.lanceMinimo) {
        throw new Error('Lance inferior ao minimo.');
    }

    const participante = await buscaUsuarioPorId(idParticipante);

    if (!participante) {
        throw new Error('Participante não encontrado.');
    }

    const usuarioNoLeilao = await usuarioEstaCadastradoNoLeilao(idParticipante, idLeilao);
    if (!usuarioNoLeilao) {
        throw new Error('Participante não cadastrado no leilão!');
    }

    const lancesAnteriores = await prisma.lances.findMany({
        where: {
            idLeilao: idLeilao
        },
        orderBy: {
            id: 'asc'
        }
    });

    if (lancesAnteriores.length > 0) {
        const últimoLance = lancesAnteriores[lancesAnteriores.length - 1];
        if (participante.id === últimoLance.idParticipante) {
            throw new Error('Um participante não pode realizar dois lances seguidos!');
        }

        if (últimoLance.valor >= valor) {
            throw new Error('O valor do novo do lance deve ser maior que o anterior!');
        }
    }

    const novoLance = await prisma.lances.create({
        data: {
            valor,
            idParticipante,
            idLeilao
        }
    });
    return novoLance;
}

async function buscaLancePorId(id) {
    const lance = await prisma.lances.findUnique({
        where: {
            id
        }
    });
    return lance;
}

async function buscaLancesPorLeilao(idLeilao, orderBy = 'id', orderDir = 'asc') {
    const lances = await prisma.lances.findMany({
        where: {
            idLeilao
        },
        orderBy: {
            [orderBy]: orderDir
        }
    });
    return lances;
}

async function buscaLancesPorParticipante(idParticipante) {
    const lances = await prisma.lances.findMany({
        where: {
            idParticipante
        }
    });
    return lances;
}

async function buscaTodosLances() {
    const lances = await prisma.lances.findMany();
    return lances;
}

module.exports = {
    criaLance,
    buscaLancePorId,
    buscaLancesPorLeilao,
    buscaLancesPorParticipante,
    buscaTodosLances
}