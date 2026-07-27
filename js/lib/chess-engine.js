// ============================
// MECANISMO DE XADREZ COMPLETO
// ============================

const VAZIO = null;
const BRANCO = 'W';
const PRETO = 'B';

// Tipos de peças
const PEAO = 'p';
const CAVALO = 'n';
const BISPO = 'b';
const TORRE = 'r';
const RAINHA = 'q';
const REI = 'k';

class ChessEngine {
    constructor() {
        this.tabuleiro = this.inicializarTabuleiro();
        this.turno = BRANCO;
        this.historico = [];
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
        this.enPassantTarget = null;
        this.direitos_roque = { WK: true, WQ: true, BK: true, BQ: true };
        this.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
        this.repeticoes = new Map();
        this.registrarPosicaoAtual();
    }

    inicializarTabuleiro() {
        const tabuleiro = Array(8).fill(null).map(() => Array(8).fill(VAZIO));
        
        // Configurar peças brancas (linha 7)
        tabuleiro[7][0] = { tipo: TORRE, cor: BRANCO };
        tabuleiro[7][1] = { tipo: CAVALO, cor: BRANCO };
        tabuleiro[7][2] = { tipo: BISPO, cor: BRANCO };
        tabuleiro[7][3] = { tipo: RAINHA, cor: BRANCO };
        tabuleiro[7][4] = { tipo: REI, cor: BRANCO };
        tabuleiro[7][5] = { tipo: BISPO, cor: BRANCO };
        tabuleiro[7][6] = { tipo: CAVALO, cor: BRANCO };
        tabuleiro[7][7] = { tipo: TORRE, cor: BRANCO };
        
        // Peões brancos (linha 6)
        for (let i = 0; i < 8; i++) {
            tabuleiro[6][i] = { tipo: PEAO, cor: BRANCO };
        }
        
        // Configurar peças pretas (linha 0)
        tabuleiro[0][0] = { tipo: TORRE, cor: PRETO };
        tabuleiro[0][1] = { tipo: CAVALO, cor: PRETO };
        tabuleiro[0][2] = { tipo: BISPO, cor: PRETO };
        tabuleiro[0][3] = { tipo: RAINHA, cor: PRETO };
        tabuleiro[0][4] = { tipo: REI, cor: PRETO };
        tabuleiro[0][5] = { tipo: BISPO, cor: PRETO };
        tabuleiro[0][6] = { tipo: CAVALO, cor: PRETO };
        tabuleiro[0][7] = { tipo: TORRE, cor: PRETO };
        
        // Peões pretos (linha 1)
        for (let i = 0; i < 8; i++) {
            tabuleiro[1][i] = { tipo: PEAO, cor: PRETO };
        }
        
        return tabuleiro;
    }

    obterMovimentosValidos(linha, coluna) {
        const peca = this.tabuleiro[linha][coluna];
        if (!peca || peca.cor !== this.turno) return [];
        
        let movimentos = [];
        
        switch (peca.tipo) {
            case PEAO:
                movimentos = this.obterMovimentosPeao(linha, coluna);
                break;
            case CAVALO:
                movimentos = this.obterMovimentosCavalo(linha, coluna);
                break;
            case BISPO:
                movimentos = this.obterMovimentosBispo(linha, coluna);
                break;
            case TORRE:
                movimentos = this.obterMovimentosTorre(linha, coluna);
                break;
            case RAINHA:
                movimentos = this.obterMovimentosRainha(linha, coluna);
                break;
            case REI:
                movimentos = this.obterMovimentosRei(linha, coluna);
                break;
        }
        
        // Filtrar movimentos que deixariam o rei em xeque
        return movimentos.filter(mov => !this.deixaReiEmXeque(linha, coluna, mov));
    }

    obterMovimentosPeao(linha, coluna) {
        const movimentos = [];
        const cor = this.tabuleiro[linha][coluna].cor;
        const direcao = cor === BRANCO ? -1 : 1;
        const linhaInicial = cor === BRANCO ? 6 : 1;
        
        // Movimento à frente
        const novaLinha = linha + direcao;
        if (this.dentroDoTabuleiro(novaLinha, coluna) && !this.tabuleiro[novaLinha][coluna]) {
            movimentos.push({ linha: novaLinha, coluna: coluna });
            
            // Movimento duplo inicial
            if (linha === linhaInicial) {
                const linhaDoble = linha + 2 * direcao;
                if (!this.tabuleiro[linhaDoble][coluna]) {
                    movimentos.push({ linha: linhaDoble, coluna: coluna });
                }
            }
        }
        
        // Captura diagonal
        for (let dc = -1; dc <= 1; dc += 2) {
            const novaCol = coluna + dc;
            if (this.dentroDoTabuleiro(novaLinha, novaCol)) {
                const peca = this.tabuleiro[novaLinha][novaCol];
                if (peca && peca.cor !== cor && peca.tipo !== REI) {
                    movimentos.push({ linha: novaLinha, coluna: novaCol });
                } else if (this.enPassantTarget && this.enPassantTarget.coluna === novaCol && novaLinha === this.enPassantTarget.linha) {
                    const capturavel = this.tabuleiro[linha][novaCol];
                    if (capturavel && capturavel.tipo === PEAO && capturavel.cor !== cor) {
                        movimentos.push({ linha: novaLinha, coluna: novaCol, enPassant: true });
                    }
                }
            }
        }
        
        return movimentos;
    }

    obterMovimentosCavalo(linha, coluna) {
        const movimentos = [];
        const movsCavalo = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        for (const [dl, dc] of movsCavalo) {
            const novaLinha = linha + dl;
            const novaCol = coluna + dc;
            
            if (this.dentroDoTabuleiro(novaLinha, novaCol)) {
                const peca = this.tabuleiro[novaLinha][novaCol];
                if (!peca || (peca.cor !== this.tabuleiro[linha][coluna].cor && peca.tipo !== REI)) {
                    movimentos.push({ linha: novaLinha, coluna: novaCol });
                }
            }
        }
        
        return movimentos;
    }

    obterMovimentosBispo(linha, coluna) {
        return this.obterMovimentosDiagonal(linha, coluna);
    }

    obterMovimentosTorre(linha, coluna) {
        return this.obterMovimentosReto(linha, coluna);
    }

    obterMovimentosRainha(linha, coluna) {
        return [...this.obterMovimentosReto(linha, coluna), ...this.obterMovimentosDiagonal(linha, coluna)];
    }

    obterMovimentosRei(linha, coluna) {
        const movimentos = [];
        
        for (let dl = -1; dl <= 1; dl++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dl === 0 && dc === 0) continue;
                
                const novaLinha = linha + dl;
                const novaCol = coluna + dc;
                
                if (this.dentroDoTabuleiro(novaLinha, novaCol)) {
                    const peca = this.tabuleiro[novaLinha][novaCol];
                    if (!peca || (peca.cor !== this.tabuleiro[linha][coluna].cor && peca.tipo !== REI)) {
                        movimentos.push({ linha: novaLinha, coluna: novaCol });
                    }
                }
            }
        }
        
        // Roque
        const cor = this.tabuleiro[linha][coluna].cor;
        const chaveRei = cor === BRANCO ? 'WK' : 'BK';
        const chaveRainha = cor === BRANCO ? 'WQ' : 'BQ';
        
        const linhaInicial = cor === BRANCO ? 7 : 0;
        const adversario = cor === BRANCO ? PRETO : BRANCO;
        if (linha === linhaInicial && coluna === 4 && this.direitos_roque[chaveRei] && !this.casaAtacadaPor(linha, 4, adversario)) {
            // Roque do lado do rei
            if (this.tabuleiro[linha][7] && this.tabuleiro[linha][7].tipo === TORRE && this.tabuleiro[linha][7].cor === cor) {
                if (!this.tabuleiro[linha][5] && !this.tabuleiro[linha][6] &&
                    !this.casaAtacadaPor(linha, 5, adversario) && !this.casaAtacadaPor(linha, 6, adversario)) {
                    movimentos.push({ linha, coluna: 6, roque: true, tipo: 'rei' });
                }
            }
        }
        
        if (linha === linhaInicial && coluna === 4 && this.direitos_roque[chaveRainha] && !this.casaAtacadaPor(linha, 4, adversario)) {
            // Roque do lado da rainha
            if (this.tabuleiro[linha][0] && this.tabuleiro[linha][0].tipo === TORRE && this.tabuleiro[linha][0].cor === cor) {
                if (!this.tabuleiro[linha][1] && !this.tabuleiro[linha][2] && !this.tabuleiro[linha][3] &&
                    !this.casaAtacadaPor(linha, 3, adversario) && !this.casaAtacadaPor(linha, 2, adversario)) {
                    movimentos.push({ linha, coluna: 2, roque: true, tipo: 'rainha' });
                }
            }
        }
        
        return movimentos;
    }

    obterMovimentosReto(linha, coluna) {
        const movimentos = [];
        const direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        for (const [dl, dc] of direcoes) {
            this.adicionarMovimentosAteBloquear(movimentos, linha, coluna, dl, dc);
        }
        
        return movimentos;
    }

    obterMovimentosDiagonal(linha, coluna) {
        const movimentos = [];
        const direcoes = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        for (const [dl, dc] of direcoes) {
            this.adicionarMovimentosAteBloquear(movimentos, linha, coluna, dl, dc);
        }
        
        return movimentos;
    }

    adicionarMovimentosAteBloquear(movimentos, linha, coluna, dl, dc) {
        let novaLinha = linha + dl;
        let novaCol = coluna + dc;
        const corPeca = this.tabuleiro[linha][coluna].cor;
        
        while (this.dentroDoTabuleiro(novaLinha, novaCol)) {
            const peca = this.tabuleiro[novaLinha][novaCol];
            
            if (!peca) {
                movimentos.push({ linha: novaLinha, coluna: novaCol });
            } else if (peca.cor !== corPeca && peca.tipo !== REI) {
                movimentos.push({ linha: novaLinha, coluna: novaCol });
                break;
            } else {
                break;
            }
            
            novaLinha += dl;
            novaCol += dc;
        }
    }

    dentroDoTabuleiro(linha, coluna) {
        return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
    }

    fazerMovimento(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino) {
        const peca = this.tabuleiro[linhaOrigem][colunaOrigem];
        if (!peca || peca.cor !== this.turno) return false;
        
        const movimentos = this.obterMovimentosValidos(linhaOrigem, colunaOrigem);
        const movimentoValido = movimentos.find(m => m.linha === linhaDestino && m.coluna === colunaDestino);
        
        if (!movimentoValido) return false;
        
        const pecaCapturada = this.tabuleiro[linhaDestino][colunaDestino];
        const houveCaptura = Boolean(pecaCapturada) || Boolean(movimentoValido.enPassant);

        // Salvar histórico
        this.historico.push({
            linhaOrigem, colunaOrigem, linhaDestino, colunaDestino,
            pecaCapturada: pecaCapturada,
            movimentoEspecial: movimentoValido,
            estadoAnterior: {
                tabuleiro: this.tabuleiro.map(linha => linha.map(p => p ? {...p} : null)),
                turno: this.turno,
                halfmoveClock: this.halfmoveClock,
                fullmoveNumber: this.fullmoveNumber,
                enPassantTarget: this.enPassantTarget ? {...this.enPassantTarget} : null,
                direitos_roque: {...this.direitos_roque},
                reiPosicoes: { W: {...this.reiPosicoes.W}, B: {...this.reiPosicoes.B} },
                repeticoes: new Map(this.repeticoes)
            }
        });
        
        // Executar movimento
        this.tabuleiro[linhaDestino][colunaDestino] = peca;
        this.tabuleiro[linhaOrigem][colunaOrigem] = VAZIO;
        
        // Atualizar posição do rei
        if (peca.tipo === REI) {
            this.reiPosicoes[peca.cor] = { linha: linhaDestino, coluna: colunaDestino };
        }
        
        // Auto-promover peão para rainha
        if (peca.tipo === PEAO && (linhaDestino === 0 || linhaDestino === 7)) {
            this.tabuleiro[linhaDestino][colunaDestino] = { tipo: RAINHA, cor: peca.cor };
        }

        // Lidar com movimentos especiais
        if (movimentoValido.enPassant) {
            this.tabuleiro[linhaOrigem][colunaDestino] = VAZIO;
        }
        
        if (movimentoValido.roque) {
            if (movimentoValido.tipo === 'rei') {
                // Mover torre
                const torre = this.tabuleiro[linhaDestino][7];
                this.tabuleiro[linhaDestino][5] = torre;
                this.tabuleiro[linhaDestino][7] = VAZIO;
            } else {
                // Mover torre
                const torre = this.tabuleiro[linhaDestino][0];
                this.tabuleiro[linhaDestino][3] = torre;
                this.tabuleiro[linhaDestino][0] = VAZIO;
            }
        }
        
        // Atualizar direitos de roque
        if (peca.tipo === REI || peca.tipo === TORRE) {
            const chave = peca.cor === BRANCO ? 'W' : 'B';
            if (peca.tipo === REI) {
                this.direitos_roque[chave + 'K'] = false;
                this.direitos_roque[chave + 'Q'] = false;
            } else if (colunaOrigem === 0) {
                this.direitos_roque[chave + 'Q'] = false;
            } else if (colunaOrigem === 7) {
                this.direitos_roque[chave + 'K'] = false;
            }
        }
        
        if (pecaCapturada && pecaCapturada.tipo === TORRE) {
            const chaveCapturada = pecaCapturada.cor === BRANCO ? 'W' : 'B';
            const linhaInicialCapturada = pecaCapturada.cor === BRANCO ? 7 : 0;
            if (linhaDestino === linhaInicialCapturada && colunaDestino === 0) this.direitos_roque[chaveCapturada + 'Q'] = false;
            if (linhaDestino === linhaInicialCapturada && colunaDestino === 7) this.direitos_roque[chaveCapturada + 'K'] = false;
        }

        // Atualizar en passant
        if (peca.tipo === PEAO && Math.abs(linhaDestino - linhaOrigem) === 2) {
            this.enPassantTarget = {
                linha: (linhaOrigem + linhaDestino) / 2,
                coluna: colunaDestino
            };
        } else {
            this.enPassantTarget = null;
        }
        
        // Atualizar halfmove clock
        if (peca.tipo === PEAO || houveCaptura) {
            this.halfmoveClock = 0;
        } else {
            this.halfmoveClock++;
        }
        
        // Alternar turno
        this.turno = this.turno === BRANCO ? PRETO : BRANCO;
        if (this.turno === BRANCO) this.fullmoveNumber++;
        this.registrarPosicaoAtual();
        
        return true;
    }

    desfazerMovimento() {
        if (this.historico.length === 0) return false;
        
        const ultimo = this.historico.pop();
        if (ultimo.estadoAnterior) {
            this.tabuleiro = ultimo.estadoAnterior.tabuleiro.map(linha => linha.map(p => p ? {...p} : null));
            this.turno = ultimo.estadoAnterior.turno;
            this.halfmoveClock = ultimo.estadoAnterior.halfmoveClock;
            this.fullmoveNumber = ultimo.estadoAnterior.fullmoveNumber;
            this.enPassantTarget = ultimo.estadoAnterior.enPassantTarget ? {...ultimo.estadoAnterior.enPassantTarget} : null;
            this.direitos_roque = {...ultimo.estadoAnterior.direitos_roque};
            this.reiPosicoes = { W: {...ultimo.estadoAnterior.reiPosicoes.W}, B: {...ultimo.estadoAnterior.reiPosicoes.B} };
            this.repeticoes = new Map(ultimo.estadoAnterior.repeticoes);
        }
        return true;
    }

    obterMovimentosValidosGlobal(cor) {
        const movimentos = [];
        const turnoOriginal = this.turno;
        this.turno = cor;
        try {
            for (let l = 0; l < 8; l++) {
                for (let c = 0; c < 8; c++) {
                    if (this.tabuleiro[l][c] && this.tabuleiro[l][c].cor === cor) {
                        const movsValidos = this.obterMovimentosValidos(l, c);
                        for (const mov of movsValidos) {
                            movimentos.push({ origem: { l, c }, destino: { l: mov.linha, c: mov.coluna }, movimento: mov });
                        }
                    }
                }
            }
        } finally {
            this.turno = turnoOriginal;
        }
        return movimentos;
    }

    emXeque(cor = this.turno) {
        const rei = this.reiPosicoes[cor];
        return this.estaEmXeque(rei.linha, rei.coluna, cor);
    }

    estaEmXeque(linha, coluna, cor) {
        const corAdversaria = cor === BRANCO ? PRETO : BRANCO;
        return this.casaAtacadaPor(linha, coluna, corAdversaria);
    }

    casaAtacadaPor(linha, coluna, corAtacante) {
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const peca = this.tabuleiro[l][c];
                if (!peca || peca.cor !== corAtacante) continue;
                const dl = linha - l;
                const dc = coluna - c;
                if (peca.tipo === PEAO) {
                    const direcao = corAtacante === BRANCO ? -1 : 1;
                    if (dl === direcao && Math.abs(dc) === 1) return true;
                } else if (peca.tipo === CAVALO) {
                    if ((Math.abs(dl) === 2 && Math.abs(dc) === 1) || (Math.abs(dl) === 1 && Math.abs(dc) === 2)) return true;
                } else if (peca.tipo === REI) {
                    if (Math.max(Math.abs(dl), Math.abs(dc)) === 1) return true;
                } else {
                    const diagonal = Math.abs(dl) === Math.abs(dc) && dl !== 0;
                    const reto = (dl === 0) !== (dc === 0);
                    if ((diagonal && (peca.tipo === BISPO || peca.tipo === RAINHA)) ||
                        (reto && (peca.tipo === TORRE || peca.tipo === RAINHA))) {
                        const passoL = Math.sign(dl);
                        const passoC = Math.sign(dc);
                        let atualL = l + passoL;
                        let atualC = c + passoC;
                        let livre = true;
                        while (atualL !== linha || atualC !== coluna) {
                            if (this.tabuleiro[atualL][atualC]) { livre = false; break; }
                            atualL += passoL;
                            atualC += passoC;
                        }
                        if (livre) return true;
                    }
                }
            }
        }
        return false;
    }

    obterMovimentosPecaSemValidar(linha, coluna) {
        const peca = this.tabuleiro[linha][coluna];
        if (!peca) return [];
        
        switch (peca.tipo) {
            case PEAO: return this.obterMovimentosPeao(linha, coluna);
            case CAVALO: return this.obterMovimentosCavalo(linha, coluna);
            case BISPO: return this.obterMovimentosBispo(linha, coluna);
            case TORRE: return this.obterMovimentosTorre(linha, coluna);
            case RAINHA: return this.obterMovimentosRainha(linha, coluna);
            case REI: {
                const movimentos = [];
                for (let dl = -1; dl <= 1; dl++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dl === 0 && dc === 0) continue;
                        const nl = linha + dl, nc = coluna + dc;
                        if (this.dentroDoTabuleiro(nl, nc)) {
                            const p = this.tabuleiro[nl][nc];
                            if (!p || p.cor !== peca.cor) {
                                movimentos.push({ linha: nl, coluna: nc });
                            }
                        }
                    }
                }
                return movimentos;
            }
            default: return [];
        }
    }

    deixaReiEmXeque(linhaOrigem, colunaOrigem, movimento) {
        const peca = this.tabuleiro[linhaOrigem][colunaOrigem];
        const linhaDestino = movimento.linha;
        const colunaDestino = movimento.coluna;
        const pecaCapturada = this.tabuleiro[linhaDestino][colunaDestino];
        const pecaEnPassant = movimento.enPassant ? this.tabuleiro[linhaOrigem][colunaDestino] : null;
        
        this.tabuleiro[linhaDestino][colunaDestino] = peca;
        this.tabuleiro[linhaOrigem][colunaOrigem] = VAZIO;
        if (movimento.enPassant) this.tabuleiro[linhaOrigem][colunaDestino] = VAZIO;
        
        let reiPosicao = { ...this.reiPosicoes[peca.cor] };
        if (peca.tipo === REI) {
            reiPosicao = { linha: linhaDestino, coluna: colunaDestino };
        }
        
        const emXeque = this.estaEmXeque(reiPosicao.linha, reiPosicao.coluna, peca.cor);
        
        this.tabuleiro[linhaOrigem][colunaOrigem] = peca;
        this.tabuleiro[linhaDestino][colunaDestino] = pecaCapturada;
        if (movimento.enPassant) this.tabuleiro[linhaOrigem][colunaDestino] = pecaEnPassant;
        
        return emXeque;
    }

    ehXequeMate() {
        const movimentos = this.obterMovimentosValidosGlobal(this.turno);
        return this.emXeque() && movimentos.length === 0;
    }

    obterMotivoEmpate() {
        const movimentos = this.obterMovimentosValidosGlobal(this.turno);
        if (!this.emXeque() && movimentos.length === 0) return 'afogamento';
        if (this.temMaterialInsuficiente()) return 'material-insuficiente';
        if (this.halfmoveClock >= 150) return 'setenta-cinco-lances';
        if ((this.repeticoes.get(this.chavePosicao()) || 0) >= 5) return 'repeticao-quíntupla';
        return null;
    }

    obterMotivoEmpateReivindicavel() {
        if (this.halfmoveClock >= 100) return 'cinquenta-lances';
        if ((this.repeticoes.get(this.chavePosicao()) || 0) >= 3) return 'repeticao-tripla';
        return null;
    }

    ehEmpate() {
        return this.obterMotivoEmpate() !== null;
    }

    temMaterialInsuficiente() {
        const pecas = [];
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const p = this.tabuleiro[l][c];
                if (p && p.tipo !== REI) pecas.push({ tipo: p.tipo, linha: l, coluna: c });
            }
        }
        if (pecas.length === 0) return true;
        if (pecas.length === 1 && (pecas[0].tipo === BISPO || pecas[0].tipo === CAVALO)) return true;
        if (pecas.every(p => p.tipo === BISPO)) {
            const corCasa = (pecas[0].linha + pecas[0].coluna) % 2;
            return pecas.every(p => (p.linha + p.coluna) % 2 === corCasa);
        }
        return false;
    }

    chavePosicao() {
        const partes = this.obterFEN().split(' ').slice(0, 4);
        if (!this.enPassantDisponivelParaTurno()) partes[3] = '-';
        return partes.join(' ');
    }

    enPassantDisponivelParaTurno() {
        if (!this.enPassantTarget) return false;
        const direcao = this.turno === BRANCO ? -1 : 1;
        const linhaOrigem = this.enPassantTarget.linha - direcao;
        for (const deslocamento of [-1, 1]) {
            const colunaOrigem = this.enPassantTarget.coluna + deslocamento;
            if (!this.dentroDoTabuleiro(linhaOrigem, colunaOrigem)) continue;
            const peao = this.tabuleiro[linhaOrigem][colunaOrigem];
            const capturavel = this.tabuleiro[linhaOrigem][this.enPassantTarget.coluna];
            const movimento = { linha: this.enPassantTarget.linha, coluna: this.enPassantTarget.coluna, enPassant: true };
            if (peao && peao.tipo === PEAO && peao.cor === this.turno &&
                capturavel && capturavel.tipo === PEAO && capturavel.cor !== this.turno &&
                !this.deixaReiEmXeque(linhaOrigem, colunaOrigem, movimento)) return true;
        }
        return false;
    }

    registrarPosicaoAtual() {
        const chave = this.chavePosicao();
        this.repeticoes.set(chave, (this.repeticoes.get(chave) || 0) + 1);
    }

    obterFEN() {
        let fen = '';
        
        // Tabuleiro
        for (let l = 0; l < 8; l++) {
            let vazio = 0;
            for (let c = 0; c < 8; c++) {
                const peca = this.tabuleiro[l][c];
                if (!peca) {
                    vazio++;
                } else {
                    if (vazio > 0) {
                        fen += vazio;
                        vazio = 0;
                    }
                    const tipo = peca.tipo.toUpperCase();
                    fen += peca.cor === BRANCO ? tipo : tipo.toLowerCase();
                }
            }
            if (vazio > 0) fen += vazio;
            if (l < 7) fen += '/';
        }
        
        fen += ' ' + (this.turno === BRANCO ? 'w' : 'b');
        
        let roque = '';
        if (this.direitos_roque.WK) roque += 'K';
        if (this.direitos_roque.WQ) roque += 'Q';
        if (this.direitos_roque.BK) roque += 'k';
        if (this.direitos_roque.BQ) roque += 'q';
        fen += ' ' + (roque || '-');
        
        fen += ' ' + (this.enPassantTarget ? String.fromCharCode(97 + this.enPassantTarget.coluna) + (8 - this.enPassantTarget.linha) : '-');
        fen += ' ' + this.halfmoveClock;
        fen += ' ' + this.fullmoveNumber;
        
        return fen;
    }

    copiar() {
        const novoJogo = new ChessEngine();
        novoJogo.tabuleiro = this.tabuleiro.map(linha => linha.map(p => p ? {...p} : null));
        novoJogo.turno = this.turno;
        novoJogo.historico = [...this.historico];
        novoJogo.halfmoveClock = this.halfmoveClock;
        novoJogo.fullmoveNumber = this.fullmoveNumber;
        novoJogo.enPassantTarget = this.enPassantTarget ? {...this.enPassantTarget} : null;
        novoJogo.direitos_roque = {...this.direitos_roque};
        novoJogo.reiPosicoes = {
            W: {...this.reiPosicoes.W},
            B: {...this.reiPosicoes.B}
        };
        novoJogo.repeticoes = new Map(this.repeticoes);
        return novoJogo;
    }

    reiniciar() {
        this.tabuleiro = this.inicializarTabuleiro();
        this.turno = BRANCO;
        this.historico = [];
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
        this.enPassantTarget = null;
        this.direitos_roque = { WK: true, WQ: true, BK: true, BQ: true };
        this.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
        this.repeticoes = new Map();
        this.registrarPosicaoAtual();
    }
}
