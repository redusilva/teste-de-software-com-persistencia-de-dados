const prisma = require('../config/db');
const { Participante } = require('../model/userModel');

async function criaUsuario(participante) {
    const usuario = await prisma.participantes.create({
        data: {
            nome: participante.nome,
            email: participante.email
        }
    });
    return usuario;
}

async function buscaTodosUsuarios() {
    const usuarios = await prisma.participantes.findMany();
    return usuarios;
}

async function buscaUsuarioPorEmail(email) {
    const usuario = await prisma.participantes.findFirst({
        where: {
            email: email,
        },
    });

    return usuario || null
}

async function buscaUsuarioPorId(id) {
    const usuario = await prisma.participantes.findFirst({
        where: {
            id: id,
        },
    });
    return usuario || null;
}


async function atualizaUsuarioPorEmail(email, novoUsuario) {
    const usuarioAtual = await prisma.participantes.findFirst({
        where: { email: email },
    });

    return prisma.participantes.update({
        where: { id: usuarioAtual.id },
        data: {
            nome: novoUsuario.nome,
            email: novoUsuario.email
        },
    });
}

module.exports = {
    criaUsuario,
    buscaTodosUsuarios,
    buscaUsuarioPorEmail,
    atualizaUsuarioPorEmail,
    buscaUsuarioPorId,
};

