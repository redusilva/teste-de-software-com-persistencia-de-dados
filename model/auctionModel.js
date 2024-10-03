class Leilao {
    #ID;
    #nomeProduto;
    #inicio;
    #fim;
    #status;
    #lanceMinimo;

    constructor(nomeProduto, inicio, fim, lanceMinimo = 0) {
        this.#nomeProduto = nomeProduto;
        this.#inicio = inicio;
        this.#fim = fim;
        this.#status = 'INATIVO';
        this.#lanceMinimo = lanceMinimo;
    }

    get ID() {
        return this.#ID;
    }

    get nomeProduto() {
        return this.#nomeProduto;
    }

    get inicio() {
        return this.#inicio;
    }

    get fim() {
        return this.#fim;
    }

    get status() {
        return this.#status;
    }

    get lanceMinimo() {
        return this.#lanceMinimo;
    }

    finalizarLeilao() {
        this.#status = 'FINALIZADO';
    }

    abrirLeilao() {
        this.#status = 'ABERTO';
    }

    expirarLeilao() {
        this.#status = 'EXPIRADO';
    }
}

module.exports = {
    Leilao
};