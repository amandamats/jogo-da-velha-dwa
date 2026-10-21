// ==========================================================================
// VERIFICAÇÃO AUTOMÁTICA DOS EXERCÍCIOS — NÃO ALTERE ESTE ARQUIVO
//
// Roda sozinho quando a página carrega e preenche o painel "Progresso".
// No console (F12), digite verificarExercicios() para ver os detalhes.
// ==========================================================================

function afirmar(condicao, mensagem) {
    if (!condicao) {
        throw new Error(mensagem);
    }
}

// Executa um trecho sem poluir o console com avisos esperados
function silenciar(acao) {
    const { log, warn } = console;
    console.log = () => {};
    console.warn = () => {};
    try {
        return acao();
    } finally {
        console.log = log;
        console.warn = warn;
    }
}

function jogarSequencia(partida, posicoes) {
    let resultado;
    for (const p of posicoes) {
        resultado = partida.fazerJogada(p);
    }
    return resultado;
}

const EXERCICIOS = [
    {
        id: "1",
        titulo: "Classe Jogador: construtor com default e atributos privados",
        testar() {
            const padrao = new Jogador();
            afirmar(padrao.nome === "Jogador", 'new Jogador() deveria ter nome "Jogador".');
            afirmar(padrao.simbolo === "X", 'new Jogador() deveria ter símbolo "X".');
            afirmar(padrao.vitorias === 0, "Um jogador novo deveria ter 0 vitórias.");
            const ana = new Jogador("Ana", "O");
            afirmar(ana.nome === "Ana" && ana.simbolo === "O", 'new Jogador("Ana", "O") deveria guardar nome e símbolo.');
            afirmar(Object.keys(ana).length === 0, "Os atributos devem ser privados (#nome), não públicos (this.nome).");
        }
    },
    {
        id: "2",
        titulo: "Encapsulamento: set nome com validação e registrarVitoria()",
        testar() {
            const setter = Object.getOwnPropertyDescriptor(Jogador.prototype, "nome")?.set;
            afirmar(typeof setter === "function", "Falta o setter: set nome(novoNome) { ... }");
            const j = new Jogador("Ana", "O");
            j.nome = "Bia";
            afirmar(j.nome === "Bia", 'Depois de j.nome = "Bia", o nome deveria ser "Bia".');
            silenciar(() => { j.nome = "   "; });
            afirmar(j.nome === "Bia", "Um nome vazio deveria ser rejeitado (o nome anterior fica).");
            afirmar(typeof j.registrarVitoria === "function", "Falta o método registrarVitoria().");
            afirmar(j.registrarVitoria() === 1 && j.registrarVitoria() === 2, "registrarVitoria() deveria somar 1 e retornar o total.");
            afirmar(Object.getOwnPropertyDescriptor(Jogador.prototype, "vitorias")?.set === undefined,
                "Não crie set vitorias: o placar só muda por registrarVitoria().");
            try { j.vitorias = 99; } catch (e) { /* sem setter: ignorado */ }
            afirmar(j.vitorias === 2, "Não deveria ser possível alterar vitorias diretamente.");
        }
    },
    {
        id: "3",
        titulo: "Prototype: Jogador.prototype.descricao()",
        testar() {
            afirmar(typeof Jogador.prototype.descricao === "function", "Falta Jogador.prototype.descricao = function () { ... }");
            afirmar(!Jogador.toString().includes("descricao"),
                "Neste exercício, descricao() deve ser criada via prototype, fora do corpo da classe.");
            const texto = new Jogador("Ana", "O").descricao();
            afirmar(texto === "Ana (O)", `descricao() deveria retornar "Ana (O)", mas retornou "${texto}".`);
        }
    },
    {
        id: "4",
        titulo: "Classe Jogo: set status com validação e get emAndamento",
        testar() {
            const g = new Jogo();
            afirmar(Object.getOwnPropertyDescriptor(Jogo.prototype, "status")?.set, "Falta o setter: set status(novoStatus) { ... }");
            afirmar(Object.getOwnPropertyDescriptor(Jogo.prototype, "emAndamento")?.get, "Falta o getter: get emAndamento() { ... }");
            afirmar(g.emAndamento === true, "Um jogo novo deveria estar em andamento (emAndamento === true).");
            silenciar(() => { g.status = "Pausado"; });
            afirmar(g.status === "Em andamento", 'O setter deveria rejeitar o status "Pausado".');
            g.status = "Finalizado";
            afirmar(g.status === "Finalizado", 'O setter deveria aceitar "Finalizado".');
            afirmar(g.emAndamento === false, "Com status Finalizado, emAndamento deveria ser false.");
            silenciar(() => g.reiniciar());
            afirmar(g.emAndamento === true, "Depois de reiniciar(), o jogo deveria voltar a estar em andamento.");
        }
    },
    {
        id: "5",
        titulo: "Herança: extends, super() e super.reiniciar()",
        testar() {
            afirmar(Object.getPrototypeOf(JogoDaVelha) === Jogo, "JogoDaVelha deve herdar de Jogo: class JogoDaVelha extends Jogo");
            const jv = new JogoDaVelha();
            afirmar(jv.nome === "Jogo da Velha", 'O construtor deveria chamar super("Jogo da Velha").');
            jv.status = "Finalizado";
            afirmar(jv.status === "Finalizado", "Conclua o Exercício 4 (set status) antes do 5.");
            silenciar(() => jv.reiniciar());
            afirmar(jv.status === "Em andamento", "reiniciar() de JogoDaVelha deveria chamar super.reiniciar().");
        }
    },
    {
        id: "6",
        titulo: "fazerJogada(posicao): validações, empate e alternância",
        testar() {
            const jv = new JogoDaVelha();
            const r = jv.fazerJogada(0);
            afirmar(r?.valida === true && r.fim === false, "Uma jogada válida deveria retornar { valida: true, fim: false, ... }.");
            afirmar(jv.tabuleiro[0] === "X", "A casa 0 deveria ficar com X.");
            afirmar(jv.jogadorAtual.simbolo === "O", "Depois da jogada de X, a vez deveria ser de O.");
            afirmar(typeof r.mensagem === "string", "O objeto retornado deveria ter uma mensagem.");
            afirmar(jv.fazerJogada(0)?.valida === false, "Jogar numa casa ocupada deveria retornar valida: false.");
            afirmar(jv.tabuleiro[0] === "X", "Uma jogada inválida não pode alterar o tabuleiro.");
            for (const invalida of [9, -1, 1.5]) {
                afirmar(jv.fazerJogada(invalida)?.valida === false, `fazerJogada(${invalida}) deveria ser inválida.`);
            }
            afirmar(jv.tabuleiro.length === 9, "Posições fora de 0 a 8 não podem ser gravadas no tabuleiro.");

            const empate = new JogoDaVelha();
            const fim = jogarSequencia(empate, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
            afirmar(fim?.fim === true && empate.empates === 1, "Com as 9 casas cheias e sem vencedor, deveria registrar 1 empate.");
            afirmar(empate.emAndamento === false, "Depois do empate, o status deveria ser Finalizado.");
            afirmar(empate.fazerJogada(0)?.valida === false, "Com a rodada encerrada, nenhuma jogada deveria ser aceita.");
        }
    },
    {
        id: "7",
        titulo: "#verificarVitoria(): método privado",
        testar() {
            const linha = new JogoDaVelha();
            jogarSequencia(linha, [0, 3, 1, 4, 2]);
            afirmar(String(linha.linhaVencedora) === "0,1,2", "X em 0, 1 e 2 deveria vencer pela linha [0, 1, 2].");
            afirmar(linha.jogadores[0].vitorias === 1, "O vencedor deveria ganhar 1 vitória.");
            afirmar(linha.emAndamento === false, "Depois da vitória, o status deveria ser Finalizado.");

            const coluna = new JogoDaVelha();
            jogarSequencia(coluna, [1, 0, 4, 2, 7]);
            afirmar(String(coluna.linhaVencedora) === "1,4,7", "X em 1, 4 e 7 deveria vencer pela coluna [1, 4, 7].");

            const diagonal = new JogoDaVelha();
            jogarSequencia(diagonal, [0, 2, 1, 4, 8, 6]);
            afirmar(String(diagonal.linhaVencedora) === "2,4,6", "O em 2, 4 e 6 deveria vencer pela diagonal [2, 4, 6].");
            afirmar(diagonal.jogadores[1].vitorias === 1, "A vitória de O deveria contar para o jogador O.");
        }
    },
    {
        id: "D1",
        titulo: "Desafio: JogoDaVelha.prototype.posicoesLivres()",
        opcional: true,
        testar() {
            afirmar(typeof JogoDaVelha.prototype.posicoesLivres === "function", "Falta JogoDaVelha.prototype.posicoesLivres.");
            const jv = new JogoDaVelha();
            afirmar(jv.posicoesLivres().length === 9, "Num tabuleiro vazio há 9 posições livres.");
            jv.fazerJogada(4);
            const livres = jv.posicoesLivres();
            afirmar(livres.length === 8 && !livres.includes(4), "Depois de jogar na casa 4, ela não deveria estar livre.");
        }
    }
];

function verificarExercicios() {
    const resultados = EXERCICIOS.map((ex) => {
        try {
            silenciar(() => ex.testar());
            return { exercicio: ex.id, titulo: ex.titulo, ok: true, opcional: ex.opcional, detalhe: "Concluído" };
        } catch (erro) {
            return { exercicio: ex.id, titulo: ex.titulo, ok: false, opcional: ex.opcional, detalhe: erro.message };
        }
    });

    mostrarProgresso(resultados);
    console.table(resultados.map(({ exercicio, ok, detalhe }) => ({
        exercício: exercicio,
        situação: ok ? "✅" : "⏳",
        detalhe
    })));
    return resultados;
}

function mostrarProgresso(resultados) {
    const lista = document.querySelector("#progresso");
    if (!lista) {
        return;
    }

    lista.innerHTML = "";
    for (const r of resultados) {
        const item = document.createElement("li");
        item.className = r.ok ? "ok" : "pendente";

        const titulo = document.createElement("strong");
        titulo.textContent = `${r.ok ? "✅" : "⏳"} ${r.exercicio}. ${r.titulo}`;
        item.append(titulo);

        if (!r.ok) {
            const detalhe = document.createElement("small");
            detalhe.textContent = r.detalhe;
            item.append(detalhe);
        }
        lista.append(item);
    }

    const obrigatorios = resultados.filter((r) => !r.opcional);
    const feitos = obrigatorios.filter((r) => r.ok).length;
    document.querySelector("#progresso-total").textContent = `${feitos} de ${obrigatorios.length}`;
}

verificarExercicios();
