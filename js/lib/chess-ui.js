// ============================
// INTERFACE DE XADREZ
// ============================

class ChessUI {
    constructor(containerId, engine, aiCallback) {
        this.container = document.getElementById(containerId);
        this.engine = engine;
        this.aiCallback = aiCallback;
        this.selectedSquare = null;
        this.validMoves = [];
        this.tamanhoQuadrado = 0;
        this.init();
    }

    init() {
        this.render();
        this.adicionarEventos();
    }

    render() {
        this.container.innerHTML = '';
        const tabuleiro = document.createElement('div');
        tabuleiro.id = 'chess-board';
        tabuleiro.style.cssText = `
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 0;
            background: #8B7355;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            margin: 20px auto;
            aspect-ratio: 1;
        `;

        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                const isLight = (l + c) % 2 === 0;
                const peca = this.engine.tabuleiro[l][c];
                
                square.id = `square-${l}-${c}`;
                square.style.cssText = `
                    background-color: ${isLight ? '#F0D9B5' : '#B58863'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5em;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s ease;
                    position: relative;
                `;

                if (peca) {
                    square.textContent = this.obterIconePeca(peca.tipo, peca.cor);
                    square.style.fontSize = '2.5em';
                }

                // Destacar quadrado selecionado
                if (this.selectedSquare && this.selectedSquare.l === l && this.selectedSquare.c === c) {
                    square.style.backgroundColor = '#BDD56D';
                    square.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3)';
                }

                // Destacar movimentos válidos
                if (this.validMoves.some(m => m.linha === l && m.coluna === c)) {
                    const indicator = document.createElement('div');
                    if (peca) {
                        indicator.style.cssText = `
                            width: 80%;
                            height: 80%;
                            border: 3px solid #F94449;
                            border-radius: 50%;
                            position: absolute;
                        `;
                    } else {
                        indicator.style.cssText = `
                            width: 30%;
                            height: 30%;
                            background: #BDD56D;
                            border-radius: 50%;
                            position: absolute;
                        `;
                    }
                    square.appendChild(indicator);
                }

                square.addEventListener('click', () => this.handleSquareClick(l, c));
                square.addEventListener('mouseover', () => {
                    if (this.engine.tabuleiro[l][c] && this.engine.tabuleiro[l][c].cor === this.engine.turno) {
                        square.style.opacity = '0.8';
                    }
                });
                square.addEventListener('mouseout', () => {
                    square.style.opacity = '1';
                });

                tabuleiro.appendChild(square);
            }
        }

        this.container.appendChild(tabuleiro);
        this.renderInfo();
    }

    renderInfo() {
        const info = document.createElement('div');
        info.style.cssText = `
            text-align: center;
            margin: 20px;
            font-family: 'Poppins', sans-serif;
        `;

        const turnoTexto = this.engine.turno === 'W' ? '⚪ Brancas' : '⚫ Pretas (IA)';
        let status = `Turno: ${turnoTexto}`;

        if (this.engine.emXeque()) {
            status += ' - ⚠️ REI EM XEQUE!';
        }

        if (this.engine.ehXequeMate()) {
            const vencedor = this.engine.turno === 'W' ? 'Pretas (IA)' : 'Brancas';
            status = `🏆 XEQUE-MATE! ${vencedor} venceram!`;
            info.style.color = '#10B981';
            info.style.fontSize = '18px';
            info.style.fontWeight = 'bold';
        } else if (this.engine.ehEmpate()) {
            status = '🤝 EMPATE!';
            info.style.color = '#F59E0B';
            info.style.fontSize = '18px';
            info.style.fontWeight = 'bold';
        }

        info.innerHTML = `
            <p style="font-size: 16px; margin-bottom: 10px;">${status}</p>
            <p style="color: #666; font-size: 14px;">Movimentos: ${this.engine.fullmoveNumber}</p>
        `;

        this.container.appendChild(info);
    }

    obterIconePeca(tipo, cor) {
        const pecas = {
            'k': { W: '♔', B: '♚' },
            'q': { W: '♕', B: '♛' },
            'r': { W: '♖', B: '♜' },
            'b': { W: '♗', B: '♝' },
            'n': { W: '♘', B: '♞' },
            'p': { W: '♙', B: '♟' }
        };
        return pecas[tipo][cor];
    }

    handleSquareClick(linha, coluna) {
        if (this.engine.turno === 'B') return; // IA está jogando

        if (this.selectedSquare) {
            if (this.selectedSquare.l === linha && this.selectedSquare.c === coluna) {
                // Deselecionar
                this.selectedSquare = null;
                this.validMoves = [];
                this.render();
                return;
            }

            // Tentar fazer movimento
            if (this.engine.fazerMovimento(this.selectedSquare.l, this.selectedSquare.c, linha, coluna)) {
                this.selectedSquare = null;
                this.validMoves = [];
                this.render();

                // Chamar IA após um pequeno delay
                setTimeout(() => {
                    if (this.engine.turno === 'B' && !this.engine.ehXequeMate() && !this.engine.ehEmpate()) {
                        this.aiCallback();
                    }
                }, 500);
                return;
            }
        }

        // Selecionar nova peça
        const peca = this.engine.tabuleiro[linha][coluna];
        if (peca && peca.cor === this.engine.turno) {
            this.selectedSquare = { l: linha, c: coluna };
            this.validMoves = this.engine.obterMovimentosValidos(linha, coluna);
            this.render();
        } else {
            this.selectedSquare = null;
            this.validMoves = [];
            this.render();
        }
    }

    adicionarEventos() {
        // Eventos já adicionados no render
    }

    reset() {
        this.engine.reiniciar();
        this.selectedSquare = null;
        this.validMoves = [];
        this.render();
    }

    ehFimDeJogo() {
        return this.engine.ehXequeMate() || this.engine.ehEmpate();
    }

    getStatus() {
        if (this.engine.ehXequeMate()) {
            return this.engine.turno === 'W' ? 'PRETAS_VENCERAM' : 'BRANCAS_VENCERAM';
        } else if (this.engine.ehEmpate()) {
            return 'EMPATE';
        }
        return 'EM_JOGO';
    }
}
