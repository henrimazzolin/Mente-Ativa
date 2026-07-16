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
        this.capturaObrigatoria = null;
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
        if (!peca || peca.cor !== this.turno) return [];
        if (this.capturaObrigatoria &&
            (this.capturaObrigatoria.l !== l || this.capturaObrigatoria.c !== c)) return [];
        const capturas = this.obterCapturas(l, c, peca);
        if (capturas.length > 0) return capturas;
        if (this.capturaObrigatoria) return [];
        if (this.obterCapturasDisponiveis(this.turno).length > 0) return [];
        const movimentos = [];
        if (peca.tipo === DAMA) {
            for (const dl of [-1, 1]) {
                for (const dc of [-1, 1]) {
                    let nl = l + dl;
                    let nc = c + dc;
                    while (this.dentro(nl, nc) && !this.tabuleiro[nl][nc]) {
                        movimentos.push({ linha: nl, coluna: nc });
                        nl += dl;
                        nc += dc;
                    }
                }
            }
            return movimentos;
        }
        const dirs = peca.cor === BRANCO ? [-1] : [1];
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
        if (peca.tipo === DAMA) {
            for (const dl of [-1, 1]) {
                for (const dc of [-1, 1]) {
                    let alvoL = l + dl;
                    let alvoC = c + dc;
                    while (this.dentro(alvoL, alvoC) && !this.tabuleiro[alvoL][alvoC]) {
                        alvoL += dl;
                        alvoC += dc;
                    }
                    if (!this.dentro(alvoL, alvoC)) continue;
                    const alvo = this.tabuleiro[alvoL][alvoC];
                    if (!alvo || alvo.cor === peca.cor) continue;

                    let destinoL = alvoL + dl;
                    let destinoC = alvoC + dc;
                    while (this.dentro(destinoL, destinoC) && !this.tabuleiro[destinoL][destinoC]) {
                        capturas.push({
                            linha: destinoL,
                            coluna: destinoC,
                            capturaLinha: alvoL,
                            capturaColuna: alvoC,
                            cadeia: true
                        });
                        destinoL += dl;
                        destinoC += dc;
                    }
                }
            }
            return capturas;
        }
        const dirs = [-1, 1];
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
        if (this.capturaObrigatoria && this.turno === cor) {
            const origem = this.capturaObrigatoria;
            const peca = this.tabuleiro[origem.l][origem.c];
            if (!peca || peca.cor !== cor) return todas;
            this.obterCapturas(origem.l, origem.c, peca).forEach(cap => {
                cap.origemL = origem.l;
                cap.origemC = origem.c;
                todas.push(cap);
            });
            return todas;
        }
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
        if (!peca || peca.cor !== this.turno) return { sucesso: false, continuaCaptura: false };
        if (this.capturaObrigatoria &&
            (this.capturaObrigatoria.l !== origemL || this.capturaObrigatoria.c !== origemC)) {
            return { sucesso: false, continuaCaptura: true };
        }
        const movimentoValido = this.obterMovimentosValidos(origemL, origemC).find(movimento =>
            movimento.linha === destinoL && movimento.coluna === destinoC
        );
        if (!movimentoValido) return { sucesso: false, continuaCaptura: Boolean(this.capturaObrigatoria) };
        capturaL = movimentoValido.capturaLinha;
        capturaC = movimentoValido.capturaColuna;
        this.tabuleiro[destinoL][destinoC] = peca;
        this.tabuleiro[origemL][origemC] = VAZIO;
        const capturou = capturaL !== undefined && capturaC !== undefined &&
            this.tabuleiro[capturaL] && this.tabuleiro[capturaL][capturaC];
        if (capturou) {
            this.tabuleiro[capturaL][capturaC] = VAZIO;
        }
        if (peca.tipo === PEAO && (destinoL === 0 || destinoL === 7)) {
            this.tabuleiro[destinoL][destinoC] = { tipo: DAMA, cor: peca.cor };
        }

        if (capturou) {
            const pecaNoDestino = this.tabuleiro[destinoL][destinoC];
            const continuacoes = this.obterCapturas(destinoL, destinoC, pecaNoDestino);
            if (continuacoes.length > 0) {
                this.capturaObrigatoria = { l: destinoL, c: destinoC };
                this.moveCount++;
                return { sucesso: true, continuaCaptura: true, capturas: continuacoes };
            }
        }

        this.capturaObrigatoria = null;
        this.turno = this.turno === BRANCO ? PRETO : BRANCO;
        this.moveCount++;
        return { sucesso: true, continuaCaptura: false };
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
