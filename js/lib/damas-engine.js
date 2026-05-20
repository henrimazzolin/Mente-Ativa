const VAZIO = null;
const BRANCO = 'W';
const PRETO = 'B';
const PEAO = 'p';
const DAMA = 'd';

class DamasEngine {
    constructor() {
        this.tabuleiro = this.inicializarTabuleiro();
        this.turno = BRANCO;
        this.historico = [];
        this.moveCount = 0;
    }

    inicializarTabuleiro() {
        const t = Array(8).fill(null).map(() => Array(8).fill(VAZIO));
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                if ((l + c) % 2 === 1) {
                    if (l < 3) t[l][c] = { tipo: PEAO, cor: PRETO };
                    else if (l > 4) t[l][c] = { tipo: PEAO, cor: BRANCO };
                }
            }
        }
        return t;
    }

    isDark(l, c) {
        return (l + c) % 2 === 1;
    }

    dentro(l, c) {
        return l >= 0 && l < 8 && c >= 0 && c < 8;
    }

    obterMovimentosValidos(l, c) {
        const peca = this.tabuleiro[l][c];
        if (!peca) return [];
        const capturas = this.obterCapturas(l, c, peca);
        if (capturas.length > 0) return capturas;
        const movimentos = [];
        const dirs = peca.tipo === DAMA ? [-1, 1] : (peca.cor === BRANCO ? [-1] : [1]);
        for (const dl of dirs) {
            for (const dc of [-1, 1]) {
                const nl = l + dl, nc = c + dc;
                if (this.dentro(nl, nc) && !this.tabuleiro[nl][nc] && this.isDark(nl, nc)) {
                    movimentos.push({ linha: nl, coluna: nc });
                }
            }
        }
        return movimentos;
    }

    obterCapturas(l, c, peca, visitadas = new Set()) {
        const capturas = [];
        const dirs = peca.tipo === DAMA ? [-1, 1] : (peca.cor === BRANCO ? [-1] : [1]);
        for (const dl of dirs) {
            for (const dc of [-1, 1]) {
                const ml = l + dl, mc = c + dc;
                const nl = l + 2 * dl, nc = c + 2 * dc;
                if (!this.dentro(nl, nc) || !this.isDark(nl, nc)) continue;
                const alvo = this.tabuleiro[ml][mc];
                const destino = this.tabuleiro[nl][nc];
                if (alvo && alvo.cor !== peca.cor && !destino) {
                    const chave = nl + ',' + nc;
                    if (!visitadas.has(chave)) {
                        visitadas.add(chave);
                        capturas.push({
                            linha: nl,
                            coluna: nc,
                            capturaLinha: ml,
                            capturaColuna: mc,
                            cadeia: true
                        });
                        visitadas.delete(chave);
                    }
                }
            }
        }
        return capturas;
    }

    obterCapturasDisponiveis(cor) {
        const todas = [];
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const p = this.tabuleiro[l][c];
                if (p && p.cor === cor) {
                    const caps = this.obterCapturas(l, c, p);
                    caps.forEach(cap => {
                        cap.origemL = l;
                        cap.origemC = c;
                    });
                    todas.push(...caps);
                }
            }
        }
        return todas;
    }

    obterTodasJogadas(cor) {
        const todas = [];
        const capturas = this.obterCapturasDisponiveis(cor);
        if (capturas.length > 0) {
            capturas.forEach(c => {
                todas.push({
                    origem: { l: c.origemL, c: c.origemC },
                    destino: { l: c.linha, c: c.coluna },
                    captura: { l: c.capturaLinha, c: c.capturaColuna }
                });
            });
            return todas;
        }
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const p = this.tabuleiro[l][c];
                if (p && p.cor === cor) {
                    const movs = this.obterMovimentosValidos(l, c);
                    movs.forEach(m => {
                        todas.push({
                            origem: { l, c },
                            destino: { l: m.linha, c: m.coluna },
                            captura: null
                        });
                    });
                }
            }
        }
        return todas;
    }

    fazerMovimento(origemL, origemC, destinoL, destinoC, capturaL, capturaC) {
        const peca = this.tabuleiro[origemL][origemC];
        if (!peca) return false;
        this.tabuleiro[destinoL][destinoC] = peca;
        this.tabuleiro[origemL][origemC] = VAZIO;
        if (capturaL !== undefined && capturaC !== undefined && this.tabuleiro[capturaL] && this.tabuleiro[capturaL][capturaC]) {
            this.tabuleiro[capturaL][capturaC] = VAZIO;
        }
        if (peca.tipo === PEAO && (destinoL === 0 || destinoL === 7)) {
            this.tabuleiro[destinoL][destinoC] = { tipo: DAMA, cor: peca.cor };
        }
        this.turno = this.turno === BRANCO ? PRETO : BRANCO;
        this.moveCount++;
        return true;
    }

    contarPecas(cor) {
        let count = 0;
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const p = this.tabuleiro[l][c];
                if (p && p.cor === cor) count++;
            }
        }
        return count;
    }

    ehVencedor(cor) {
        const oponente = cor === BRANCO ? PRETO : BRANCO;
        if (this.contarPecas(oponente) === 0) return true;
        const jogadas = this.obterTodasJogadas(oponente);
        return jogadas.length === 0;
    }

    ehEmpate() {
        if (this.moveCount > 200) return true;
        let total = 0;
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                if (this.tabuleiro[l][c]) total++;
            }
        }
        return total <= 2;
    }

    escolherJogadaIA(cor) {
        const jogadas = this.obterTodasJogadas(cor);
        if (jogadas.length === 0) return null;
        const VALUES = { p: 1, d: 3 };
        let best = -999;
        let bestMoves = [];
        for (const j of jogadas) {
            let score = 0;
            if (j.captura) {
                const alvo = this.tabuleiro[j.captura.l] && this.tabuleiro[j.captura.l][j.captura.c];
                if (alvo) score += VALUES[alvo.tipo] || 1;
            }
            const peca = this.tabuleiro[j.origem.l][j.origem.c];
            if (peca && peca.tipo === PEAO && (j.destino.l === 0 || j.destino.l === 7)) {
                score += 2;
            }
            if (j.destino.c >= 1 && j.destino.c <= 6 && j.destino.l >= 1 && j.destino.l <= 6) {
                score += 0.3;
            }
            if (score > best) {
                best = score;
                bestMoves = [j];
            } else if (Math.abs(score - best) < 0.01) {
                bestMoves.push(j);
            }
        }
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
}
