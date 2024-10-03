
const prisma = require('../config/db');

async function criaLeilao(leilao) {
    const leilaoCriado = await prisma.auction.create({
        data: {
            nomeProduto: leilao.nomeProduto,
            inicio: leilao.inicio,
            fim: leilao.fim,
            status: (leilao.status || 'INATIVO'),
            lanceMinimo: leilao.lanceMinimo || 0
        }
    });

    return leilaoCriado

}

async function buscaTodosLeiloes() {
    const leiloes = await prisma.auction.findMany();
    return leiloes;
}

async function atualizaLeilao(id, novoLeilao) {

    if (novoLeilao.status != 'INATIVO') {
        throw new Error('O leilão deve estar inativo para ser atualizado');
    }

    try {
        const leilaoAtualizado = await prisma.auction.update({
            where: {
                ID: id,
            },
            data: {
                nomeProduto: novoLeilao.nomeProduto,
                inicio: novoLeilao.inicio,
                fim: novoLeilao.fim,
                status: novoLeilao.status
            },
        });
        return leilaoAtualizado;
    } catch (error) {
        throw new Error('Registro não encontrado');
    }
}

async function buscaLeilaoPorId(id) {
    const leilao = await prisma.auction.findUnique({
        where: {
            ID: id
        }
    });
    return leilao;
}

async function buscaTotalLeiloes() {
    const totalLeiloes = await prisma.auction.count();
    return totalLeiloes;
}

async function buscaLeilaoPorNome(nome) {
    const leilao = await prisma.auction.findMany({
        where: {
            nomeProduto: {
                contains: nome
            }
        }
    });
    return leilao;
}

async function buscaLeilaoPorStatus(status) {
    const leilao = await prisma.auction.findMany({
        where: {
            status: status
        }
    });
    return leilao;
}

async function cadastraUsuarioNoLeilao(idUsuario, idLeilao) {
    const participanteLeilao = await prisma.participantesLeilao.create({
        data: {
            idParticipante: idUsuario,
            idLeilao: idLeilao
        }
    });
    return participanteLeilao;
}

async function usuarioEstaCadastradoNoLeilao(idUsuario, idLeilao) {
    const participanteLeilao = await prisma.participantesLeilao.count({
        where: {
            idParticipante: idUsuario,
            idLeilao: idLeilao
        }
    });
    return participanteLeilao > 0 ? true : false;
}

module.exports = {
    criaLeilao,
    buscaTodosLeiloes,
    atualizaLeilao,
    buscaLeilaoPorId,
    buscaTotalLeiloes,
    buscaLeilaoPorNome,
    buscaLeilaoPorStatus,
    cadastraUsuarioNoLeilao,
    usuarioEstaCadastradoNoLeilao
};