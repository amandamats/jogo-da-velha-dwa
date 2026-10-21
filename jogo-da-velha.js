// ==========================================================================
// PROJETO GUIADO — Jogo da Velha com Classes (Aula 11)
// Arquivo do ALUNO: complete os trechos marcados com TODO.
//
// Como trabalhar:
//  1. Faça os exercícios na ordem (1 a 7). Cada um tem passos (TODO 1.1, 1.2...).
//  2. Salve o arquivo e recarregue a página (F5) depois de cada exercício.
//  3. Confira o painel "Progresso" na página. No console (F12) você também
//     pode digitar verificarExercicios() para ver o resultado detalhado.
//
// JÁ ESTÁ PRONTO (não precisa alterar):
//  - a constante COMBINACOES_VENCEDORAS
//  - a classe Jogo, exceto o setter e o getter do Exercício 4
//  - os getters e os métodos privados de apoio de JogoDaVelha
//  - o método exibirNoConsole(), um EXEMPLO de prototype
//  - a classe InterfaceJogo, que liga o jogo à página
// ==========================================================================

// Combinações vencedoras (índices das casas):
//  0 | 1 | 2
//  3 | 4 | 5
//  6 | 7 | 8
const COMBINACOES_VENCEDORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6]             // diagonais
];


// ==========================================================================
// EXERCÍCIOS 1 e 2 — Classe Jogador
// ==========================================================================
class Jogador {
    #nome;
    #simbolo;
    #vitorias;
    constructor(nome = "Jogador", simbolo = "X") {
        this.#nome = nome;
        this.#simbolo = simbolo;
        this.#vitorias = 0;
    }

    get nome() { return this.#nome; }
    get simbolo() { return this.#simbolo; }
    get vitorias() { return this.#vitorias; }

    set nome(novoNome) {
        String(novoNome).trim() === ""? console.warn("nome não pode ser vazio.") : this.#nome = String(novoNome).trim();
    }

    registrarVitoria() {
        this.#vitorias++;
        return this.#vitorias;
    }

}

Jogador.prototype.descricao = function() {
    return `${this.nome} (${this.simbolo})`;
};


// ==========================================================================
// EXERCÍCIO 3 — Prototipagem
// Veja o exemplo pronto JogoDaVelha.prototype.exibirNoConsole, mais abaixo.
// ==========================================================================

// TODO 3.1: adicione à classe Jogador, via prototype, o método descricao(),
//           que retorna o nome e o símbolo no formato "Ana (X)".
//           Atenção: métodos adicionados por prototype ficam FORA da classe
//           e não enxergam os #atributos. Use os getters: this.nome e this.simbolo.



// ==========================================================================
// EXERCÍCIO 4 — Classe base Jogo: setter com validação e getter calculado
// ==========================================================================
class Jogo {
    #status;

    constructor(nome = "Jogo Genérico") {
        this.nome = nome;               // atributo público
        this.#status = "Em andamento";  // atributo privado
    }

    get status() {
        return this.#status;
    }

    set status(novoStatus){
        const statusValidos = ["Em andamento", "Finalizado"];
        if (statusValidos.includes(novoStatus)){
            this.#status = novoStatus;
        }
        else{
            console.warn("status inválido. aceitos: Em andamento ou Finalizado.")
        }
    }

    get emAndamento() {
        if (this.#status === "Em andamento"){
            return true;
        }
        else{
            return false;
        }
    }

    // TODO 4.2: crie o getter emAndamento, que retorna true quando
    //           #status for "Em andamento" e false caso contrário.
    //           É um getter "calculado": não existe atributo #emAndamento.

    reiniciar() {
        this.#status = "Em andamento";
        console.log(`${this.nome} reiniciado.`);
    }
}


// ==========================================================================
// EXERCÍCIOS 5, 6 e 7 — Classe JogoDaVelha
// ==========================================================================

// TODO 5.1: faça JogoDaVelha herdar de Jogo usando extends.
//           Faça o 5.1 e o 5.2 juntos: com extends e sem super(), o código quebra.
class JogoDaVelha extends Jogo {
    #tabuleiro;
    #jogadores;
    #indiceAtual;     // 0 = primeiro jogador do array, 1 = segundo
    #quemComeca;
    #jogadas;
    #empates;
    #linhaVencedora;

    constructor(
        jogadorX = new Jogador("Jogador 1", "X"),
        jogadorO = new Jogador("Jogador 2", "O"),
        quemComeca = 0
    ) {
        // TODO 5.2: chame o construtor da classe pai com super(...),
        //           passando o nome "Jogo da Velha".
        //           Ele precisa ser a PRIMEIRA linha do construtor.
        super("Jogo da Velha");
        this.#jogadores = [jogadorX, jogadorO];
        this.#quemComeca = quemComeca;
        this.#empates = 0;
        this.#limparTabuleiro();
    }

    // ---------- Getters (prontos) ----------

    get jogadorAtual() {
        return this.#jogadores[this.#indiceAtual];
    }

    // Retornam CÓPIAS dos arrays: quem está fora da classe não altera o original.
    get jogadores() {
        return [...this.#jogadores];
    }

    get tabuleiro() {
        return [...this.#tabuleiro];
    }

    get empates() {
        return this.#empates;
    }

    get linhaVencedora() {
        return this.#linhaVencedora;
    }

    // ---------- EXERCÍCIO 6: método com parâmetro e return ----------
    // Recebe a posição clicada (0 a 8) e RETORNA um objeto
    // { valida, fim, mensagem } que a interface usa para atualizar a tela.
    fazerJogada(posicao) {
        if (this.emAndamento === false){
            return { valida: false, mensagem: "a rodada terminou. clique em Nova rodada." };
        }
        if (posicao < 0 || posicao > 8 || !Number.isInteger(posicao) || this.#tabuleiro[posicao] !== ""){
            return { valida: false, mensagem: "posição inválida ou já ocupada!" }
        }

        // ---- PRONTO: registra a jogada ----
        const jogador = this.jogadorAtual;
        this.#tabuleiro[posicao] = jogador.simbolo;
        this.#jogadas++;

        // ---- PRONTO: verifica vitória (só funciona depois do Exercício 7) ----
        const linha = this.#verificarVitoria();
        if (linha !== null) {
            this.#linhaVencedora = linha;
            jogador.registrarVitoria();
            this.status = "Finalizado"; // usa o setter herdado de Jogo
            return { valida: true, fim: true, mensagem: `🎉 ${jogador.descricao()} venceu!` };
        }

        if (this.#jogadas === 9) {
            this.#empates++;
            this.status = "Finalizado";
            return { valida: true, fim: true, mensagem: "🤝 deu velha! empate."}
        };

        const jogadorAtual = this.#alternarJogador();
        return { valida: true, fim: false, mensagem: `Vez de ${this.jogadorAtual.descricao()}` }; 

        // TODO 6.4: a rodada continua — chame this.#alternarJogador() e retorne
        //           { valida: true, fim: false, mensagem: `Vez de ${this.jogadorAtual.descricao()}` }
        //           SUBSTITUA a linha abaixo pelo seu código.
    }

    // Sobrescreve o reiniciar() de Jogo.
    reiniciar() {
        super.reiniciar();
        // TODO 5.3: chame o reiniciar() da classe pai: super.reiniciar()
        //           É ele que devolve o status para "Em andamento".
        this.#quemComeca = 1 - this.#quemComeca; // alterna quem começa a cada rodada
        this.#limparTabuleiro();
    }

    // ---------- Métodos privados de apoio (prontos) ----------

    #limparTabuleiro() {
        this.#tabuleiro = Array(9).fill("");
        this.#jogadas = 0;
        this.#linhaVencedora = null;
        this.#indiceAtual = this.#quemComeca;
    }

    #alternarJogador() {
        this.#indiceAtual = 1 - this.#indiceAtual; // 0 vira 1, 1 vira 0
    }

    // ---------- EXERCÍCIO 7: método privado ----------
    // Retorna a combinação vencedora (ex.: [0, 1, 2]) ou null se ninguém venceu.
    #verificarVitoria() {
        const t = this.#tabuleiro;

        // TODO 7.1: percorra COMBINACOES_VENCEDORAS com for...of,
        //           desestruturando cada combinação: for (const [a, b, c] of ...)
        // TODO 7.2: se t[a] não for "" e t[a] === t[b] e t[a] === t[c],
        //           retorne [a, b, c].
        // TODO 7.3: depois do laço, retorne null (ninguém venceu).
        //           SUBSTITUA a linha abaixo pelo seu código.

        return null;
    }
}


// ==========================================================================
// EXEMPLO PRONTO de prototype (modelo para o Exercício 3)
// ==========================================================================
JogoDaVelha.prototype.exibirNoConsole = function () {
    const t = this.tabuleiro.map((valor) => valor || " ");
    console.log(`
 ${t[0]} | ${t[1]} | ${t[2]}
---+---+---
 ${t[3]} | ${t[4]} | ${t[5]}
---+---+---
 ${t[6]} | ${t[7]} | ${t[8]}
Status: ${this.status} | Vez de: ${rotulo(this.jogadorAtual)}`);
};


// ==========================================================================
// PRONTO — Interface: liga o objeto do jogo à página. Não precisa alterar.
// ==========================================================================

// Usa descricao() quando ela existir (Exercício 3); senão monta o texto.
function rotulo(jogador) {
    if (typeof jogador?.descricao === "function") {
        return jogador.descricao();
    }
    return `${jogador?.nome ?? "?"} (${jogador?.simbolo ?? "?"})`;
}

class InterfaceJogo {
    #jogo;
    #celulas;
    #elStatus;

    constructor(jogo) {
        this.#jogo = jogo;
        this.#celulas = document.querySelectorAll(".celula");
        this.#elStatus = document.querySelector("#status");
        this.#registrarEventos();
        this.atualizar();
    }

    get jogo() {
        return this.#jogo;
    }

    set jogo(novoJogo) {
        this.#jogo = novoJogo;
        this.atualizar();
    }

    atualizar(mensagem) {
        const jogo = this.#jogo;
        const tabuleiro = jogo.tabuleiro;
        const linhaVencedora = jogo.linhaVencedora ?? [];
        const liberado = jogo.emAndamento === true;

        this.#celulas.forEach((celula, indice) => {
            const valor = tabuleiro[indice];
            celula.textContent = valor;
            celula.classList.toggle("x", valor === "X");
            celula.classList.toggle("o", valor === "O");
            celula.classList.toggle("vencedora", linhaVencedora.includes(indice));
            celula.disabled = valor !== "" || !liberado;
        });

        let texto = mensagem ?? `Vez de ${rotulo(jogo.jogadorAtual)}`;
        if (jogo.emAndamento === undefined) {
            texto = "🔒 Tabuleiro bloqueado: conclua os Exercícios 4 e 5.";
        }
        this.#elStatus.textContent = texto;
        this.#elStatus.classList.toggle("fim", !liberado);

        const [jogadorX, jogadorO] = jogo.jogadores;
        document.querySelector("#placar-nome-x").textContent = rotulo(jogadorX);
        document.querySelector("#placar-x").textContent = jogadorX.vitorias ?? 0;
        document.querySelector("#placar-nome-o").textContent = rotulo(jogadorO);
        document.querySelector("#placar-o").textContent = jogadorO.vitorias ?? 0;
        document.querySelector("#placar-empates").textContent = jogo.empates;

        // posicoesLivres() é o Desafio 1 (prototype)
        document.querySelector("#casas-livres").textContent =
            typeof jogo.posicoesLivres === "function" ? jogo.posicoesLivres().length : "—";
    }

    #executar(acao) {
        try {
            acao();
        } catch (erro) {
            this.#elStatus.textContent = `❌ Erro: ${erro.message}`;
            console.error(erro);
        }
    }

    #registrarEventos() {
        this.#celulas.forEach((celula) => {
            celula.addEventListener("click", () => this.#executar(() => {
                const posicao = Number(celula.dataset.index);
                const resultado = this.#jogo.fazerJogada(posicao);
                this.atualizar(resultado?.mensagem);
            }));
        });

        document.querySelector("#btn-nova-rodada").addEventListener("click", () => this.#executar(() => {
            this.#jogo.reiniciar();
            this.atualizar();
        }));

        document.querySelector("#form-jogadores").addEventListener("submit", (evento) => {
            evento.preventDefault();
            this.#executar(() => {
                const nomeX = document.querySelector("#nome-x").value.trim() || "Jogador 1";
                const nomeO = document.querySelector("#nome-o").value.trim() || "Jogador 2";
                const quemComeca = Number(document.querySelector("#quem-comeca").value);
                this.jogo = new JogoDaVelha(new Jogador(nomeX, "X"), new Jogador(nomeO, "O"), quemComeca);
            });
        });
    }
}


// ==========================================================================
// PRONTO — Instanciação: o programa começa aqui
// ==========================================================================
let jogo;
let tela;

try {
    jogo = new JogoDaVelha();
    tela = new InterfaceJogo(jogo);
} catch (erro) {
    document.querySelector("#status").textContent = `❌ Erro ao iniciar o jogo: ${erro.message}`;
    console.error(erro);
}
