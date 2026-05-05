// ============================
// INTELIGÊNCIA ARTIFICIAL - MINIMAX
// ============================

class ChessAI {
    constructor(profundidade = 3) {
        this.profundidade = profundidade;
        this.pesos = {
            'p': 1,
            'n': 3,
            'b': 3,
            'r': 5,
            'q': 9,
            'k': 0
        };
        this.posicaoPesos = {
            'p': [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [50, 50, 50, 50, 50, 50, 50, 50],
                [10, 10, 20, 30, 30, 20, 10, 10],
                [5, 5, 10, 25, 25, 10, 5, 5],
                [0, 0, 0, 20, 20, 0, 0, 0],
                [5, -5, -10, 0, 0, -10, -5, 5],
                [5, 10, 10, -20, -20, 10, 10, 5],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };
        this.nodeCount = 0;
    }

    obterMelhorMovimento(engine) {
        this.nodeCount = 0;
        let melhorScore = -Infinity;
        let melhorMovimento = null;

        const movimentos = engine.obterMovimentosValidosGlobal(PRETO);

        if (movimentos.length === 0) return null;

        // Ordenar movimentos por heurística
        movimentos.sort((a, b) => {
            const scorea = this.avaliarMovimento(engine, a);
            const scoreb = this.avaliarMovimento(engine, b);
            return scoreb - scorea;
        });

        for (const mov of movimentos) {
            const novoEngine = engine.copiar();
            novoEngine.fazerMovimento(mov.origem.l, mov.origem.c, mov.destino.l, mov.destino.c);

            const score = this.minimax(novoEngine, this.profundidade - 1, -Infinity, Infinity, true);

            if (score > melhorScore) {
                melhorScore = score;
                melhorMovimento = mov;
            }
        }

        console.log(`IA analisou ${this.nodeCount} posições. Melhor score: ${melhorScore}`);
        return melhorMovimento;
    }

    minimax(engine, profundidade, alpha, beta, ehMaximizador) {
        this.nodeCount++;

        if (profundidade === 0 || engine.ehXequeMate() || engine.ehEmpate()) {
            return this.avaliar(engine);
        }

        const movimentos = engine.obterMovimentosValidosGlobal(ehMaximizador ? PRETO : BRANCO);

        if (movimentos.length === 0) {
            return engine.ehXequeMate() ? (ehMaximizador ? -10000 : 10000) : 0;
        }

        if (ehMaximizador) {
            let maxScore = -Infinity;
            for (const mov of movimentos) {
                const novoEngine = engine.copiar();
                novoEngine.fazerMovimento(mov.origem.l, mov.origem.c, mov.destino.l, mov.destino.c);
                const score = this.minimax(novoEngine, profundidade - 1, alpha, beta, false);
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const mov of movimentos) {
                const novoEngine = engine.copiar();
                novoEngine.fazerMovimento(mov.origem.l, mov.origem.c, mov.destino.l, mov.destino.c);
                const score = this.minimax(novoEngine, profundidade - 1, alpha, beta, true);
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
            return minScore;
        }
    }

    avaliar(engine) {
        // Verificar fim de jogo
        if (engine.ehXequeMate()) {
            return engine.turno === PRETO ? -10000 : 10000;
        }
        if (engine.ehEmpate()) {
            return 0;
        }

        let score = 0;

        // Avaliar material
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const peca = engine.tabuleiro[l][c];
                if (peca) {
                    const valor = this.pesos[peca.tipo] || 0;
                    const posicaoValor = this.obterPosicaoValor(peca.tipo, l, c, peca.cor);
                    
                    if (peca.cor === PRETO) {
                        score += valor + posicaoValor;
                    } else {
                        score -= valor + posicaoValor;
                    }
                }
            }
        }

        // Bônus/penalidade por xeque
        if (engine.emXeque(BRANCO)) {
            score += 5;
        }
        if (engine.emXeque(PRETO)) {
            score -= 5;
        }

        return score;
    }

    obterPosicaoValor(tipo, linha, coluna, cor) {
        if (tipo === PEAO && this.posicaoPesos['p']) {
            const peso = this.posicaoPesos['p'];
            const valor = cor === PRETO ? peso[linha][coluna] : peso[7 - linha][coluna];
            return valor / 100;
        }
        return 0;
    }

    avaliarMovimento(engine, movimento) {
        let score = 0;

        // Captura tem prioridade
        const alvo = engine.tabuleiro[movimento.destino.l][movimento.destino.c];
        if (alvo) {
            score += this.pesos[alvo.tipo] * 10;
        }

        // Desenvolver peças
        const peca = engine.tabuleiro[movimento.origem.l][movimento.origem.c];
        if (peca.tipo === CAVALO || peca.tipo === BISPO) {
            score += 1;
        }

        return score;
    }

    definirProfundidade(profundidade) {
        this.profundidade = Math.min(Math.max(profundidade, 1), 6);
    }
}
