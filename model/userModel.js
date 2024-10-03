class Participante {
    #nome;
    #email;

    constructor(nome, email) {
        this.#nome = nome;
        this.#email = email;
    }

    get nome() {
        return this.#nome;
    }

    get email() {
        return this.#email;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    set email(email) {
        this.#email = email;
    }
}

module.exports = {
    Participante
};