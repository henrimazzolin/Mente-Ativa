document.addEventListener('DOMContentLoaded', function () {
    let engine = new ChessEngine();
    let playerColor = null;
    let robotColor = null;
    let gameEnded = false;
    let isProcessing = false;
    let selectedSquare = null;
    let validMoves = [];
    let moveHistory = [];
    let moveCount = 0;

    const ICONS = {
        'k': { 'W': '\u2654', 'B': '\u265A' },
        'q': { 'W': '\u2655', 'B': '\u265B' },
        'r': { 'W': '\u2656', 'B': '\u265C' },
        'b': { 'W': '\u2657', 'B': '\u265D' },
        'n': { 'W': '\u2658', 'B': '\u265E' },
        'p': { 'W': '\u2659', 'B': '\u265F' }
    };
    const NAMES = { 'k': 'Rei', 'q': 'Rainha', 'r': 'Torre', 'b': 'Bispo', 'n': 'Cavalo', 'p': 'Peao' };
    const VALUES = { 'q': 9, 'r': 5, 'b': 3, 'n': 3, 'p': 1, 'k': 0 };

    function getIcon(tipo, cor) {
        return (ICONS[tipo] && ICONS[tipo][cor]) || '';
    }

    function htmlToEngine(hRow, hCol) {
        if (playerColor === 'W') {
            return { row: hRow - 1, col: hCol - 1 };
        }
        return { row: 8 - hRow, col: 8 - hCol };
    }

    function engineToHtml(eRow, eCol) {
        if (playerColor === 'W') {
            return { row: eRow + 1, col: eCol + 1 };
        }
        return { row: 8 - eRow, col: 8 - eCol };
    }

    function sqName(eRow, eCol) {
        return String.fromCharCode(97 + eCol) + (8 - eRow);
    }

    function renderNotation() {
        const files = playerColor === 'W'
            ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        const ranks = playerColor === 'W'
            ? ['8', '7', '6', '5', '4', '3', '2', '1']
            : ['1', '2', '3', '4', '5', '6', '7', '8'];

        var topEl = document.getElementById('notation-top');
        var bottomEl = document.getElementById('notation-bottom');
        var leftEl = document.getElementById('notation-left');
        var rightEl = document.getElementById('notation-right');

        if (topEl) topEl.innerHTML = files.map(function (f) { return '<span>' + f + '</span>'; }).join('');
        if (bottomEl) bottomEl.innerHTML = files.map(function (f) { return '<span>' + f + '</span>'; }).join('');
        if (leftEl) leftEl.innerHTML = ranks.map(function (r) { return '<span>' + r + '</span>'; }).join('');
        if (rightEl) rightEl.innerHTML = ranks.map(function (r) { return '<span>' + r + '</span>'; }).join('');
    }

    function renderBoard() {
        for (let eRow = 0; eRow < 8; eRow++) {
            for (let eCol = 0; eCol < 8; eCol++) {
                const h = engineToHtml(eRow, eCol);
                const cell = document.getElementById('t' + h.row + h.col);
                if (!cell) continue;
                const piece = engine.tabuleiro[eRow][eCol];
                cell.innerHTML = piece ? getIcon(piece.tipo, piece.cor) : '';
                cell.className = (eRow + eCol) % 2 === 0 ? 'light' : 'dark';
                if (piece) {
                    const cn = piece.cor === 'W' ? 'branco' : 'preto';
                    cell.classList.add(cn);
                    cell.setAttribute('aria-label', NAMES[piece.tipo] + ' ' + cn + ', ' + sqName(eRow, eCol));
                } else {
                    cell.setAttribute('aria-label', 'Vazio, ' + sqName(eRow, eCol));
                }
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '0');
            }
        }
        if (selectedSquare) {
            const h = engineToHtml(selectedSquare.row, selectedSquare.col);
            const c = document.getElementById('t' + h.row + h.col);
            if (c) c.classList.add('selected');
        }
        for (const mv of validMoves) {
            const h = engineToHtml(mv.linha, mv.coluna);
            const c = document.getElementById('t' + h.row + h.col);
            if (c) {
                c.classList.add('possible-move');
                if (engine.tabuleiro[mv.linha][mv.coluna]) {
                    c.classList.add('possible-capture');
                }
            }
        }
        for (const cor of ['W', 'B']) {
            if (engine.emXeque(cor)) {
                const rp = engine.reiPosicoes[cor];
                if (rp) {
                    const h = engineToHtml(rp.linha, rp.coluna);
                    const c = document.getElementById('t' + h.row + h.col);
                    if (c) c.classList.add('in-check');
                }
            }
        }
    }

    function animateMove(fromRow, fromCol, toRow, toCol, callback) {
        var fromCell = document.getElementById('t' + fromRow + fromCol);
        var toCell = document.getElementById('t' + toRow + toCol);
        var pieceHTML = fromCell ? fromCell.innerHTML : '';
        if (!pieceHTML || !fromCell || !toCell) { if (callback) callback(); return; }
        var fontSize = window.getComputedStyle(fromCell).fontSize;
        var fromRect = fromCell.getBoundingClientRect();
        var toRect = toCell.getBoundingClientRect();
        fromCell.innerHTML = '';
        var floater = document.createElement('div');
        floater.innerHTML = pieceHTML;
        floater.style.cssText = [
            'position: fixed;',
            'z-index: 1000;',
            'font-size: ' + fontSize + ';',
            'width: ' + fromRect.width + 'px;',
            'height: ' + fromRect.height + 'px;',
            'display: flex;',
            'align-items: center;',
            'justify-content: center;',
            'pointer-events: none;',
            'left: ' + fromRect.left + 'px;',
            'top: ' + fromRect.top + 'px;',
            'transition: left 400ms ease, top 400ms ease;'
        ].join(' ');
        document.body.appendChild(floater);
        floater.offsetHeight;
        floater.style.left = toRect.left + 'px';
        floater.style.top = toRect.top + 'px';
        floater.addEventListener('transitionend', function () {
            floater.remove();
            if (callback) callback();
        }, { once: true });
        setTimeout(function () {
            if (floater.parentNode) {
                floater.remove();
                if (callback) callback();
            }
        }, 1000);
    }

    function getAllMoves(cor) {
        const moves = [];
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                if (engine.tabuleiro[l][c] && engine.tabuleiro[l][c].cor === cor) {
                    const ms = engine.obterMovimentosValidos(l, c);
                    for (const mv of ms) {
                        moves.push({ origem: { l, c }, destino: { l: mv.linha, c: mv.coluna } });
                    }
                }
            }
        }
        return moves;
    }

    function addHistory(who, pieceType, fromSq, toSq) {
        moveCount++;
        var nome = NAMES[pieceType] || 'Peca';
        var from = fromSq.toUpperCase();
        var to = toSq.toUpperCase();
        moveHistory.push({ num: moveCount, who: who, nome: nome, from: from, to: to });
        renderHistory();
    }

    function renderHistory() {
        var el = document.getElementById('move-history');
        if (!el) return;
        if (moveHistory.length === 0) {
            el.innerHTML = '<div class="history-empty">Nenhuma jogada ainda</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < moveHistory.length; i++) {
            var m = moveHistory[i];
            var cls = m.who === 'you' ? 'you' : 'robo';
            var label = m.who === 'you' ? 'Voce' : 'Robo';
            html += '<div class="history-item">' +
                '<span class="history-num">' + m.num + '.</span>' +
                '<span class="history-player ' + cls + '">(' + label + ')</span>' +
                '<span class="history-piece">' + m.nome + '</span>' +
                '<span class="history-from">' + m.from + '</span>' +
                '<span class="history-arrow">\u2192</span>' +
                '<span class="history-to">' + m.to + '</span>' +
            '</div>';
        }
        el.innerHTML = html;
        el.scrollTop = el.scrollHeight;
    }

    function handleCellClick(hRow, hCol) {
        if (gameEnded || isProcessing) return;
        if (engine.turno !== playerColor) return;
        const e = htmlToEngine(hRow, hCol);
        const clicked = engine.tabuleiro[e.row][e.col];
        if (selectedSquare) {
            if (clicked && clicked.cor === playerColor) {
                selectedSquare = { row: e.row, col: e.col };
                validMoves = engine.obterMovimentosValidos(e.row, e.col);
                renderBoard();
                return;
            }
            if (engine.fazerMovimento(selectedSquare.row, selectedSquare.col, e.row, e.col)) {
                var pieceType = engine.tabuleiro[e.row][e.col].tipo;
                var fromSq = sqName(selectedSquare.row, selectedSquare.col);
                var toSq = sqName(e.row, e.col);
                var hFrom = engineToHtml(selectedSquare.row, selectedSquare.col);
                var hTo = engineToHtml(e.row, e.col);
                selectedSquare = null;
                validMoves = [];
                isProcessing = true;
                animateMove(hFrom.row, hFrom.col, hTo.row, hTo.col, function () {
                    renderBoard();
                    updateStatus();
                    addHistory('you', pieceType, fromSq, toSq);
                    if (!checkGameEnd()) {
                        var d = 800 + Math.random() * 400;
                        showThinking();
                        setTimeout(robotTurn, d);
                    } else {
                        isProcessing = false;
                    }
                });
                return;
            }
        }
        if (clicked && clicked.cor === playerColor) {
            selectedSquare = { row: e.row, col: e.col };
            validMoves = engine.obterMovimentosValidos(e.row, e.col);
            renderBoard();
        }
    }

    function showThinking() {
        var st = document.getElementById('status-text');
        if (st) st.innerHTML = '<span class="status-robo thinking">\uD83E\uDD16 ROB\u00D4 PENSANDO<span class="dots"><span>.</span><span>.</span><span>.</span></span></span>';
    }

    function robotTurn() {
        if (gameEnded) { isProcessing = false; return; }
        if (engine.turno !== robotColor) { isProcessing = false; return; }
        var allMoves = getAllMoves(robotColor);
        if (allMoves.length === 0) {
            isProcessing = false;
            checkGameEnd();
            return;
        }
        var chosen = null;
        var captures = allMoves.filter(function (m) {
            var t = engine.tabuleiro[m.destino.l][m.destino.c];
            return t && t.cor !== robotColor;
        });
        if (captures.length > 0) {
            captures.sort(function (a, b) {
                var va = VALUES[engine.tabuleiro[a.destino.l][a.destino.c] ? engine.tabuleiro[a.destino.l][a.destino.c].tipo : ''] || 0;
                var vb = VALUES[engine.tabuleiro[b.destino.l][b.destino.c] ? engine.tabuleiro[b.destino.l][b.destino.c].tipo : ''] || 0;
                return vb - va;
            });
            chosen = captures[0];
        } else {
            chosen = allMoves[Math.floor(Math.random() * allMoves.length)];
        }
        if (!chosen) { isProcessing = false; checkGameEnd(); return; }
        var fromSq = sqName(chosen.origem.l, chosen.origem.c);
        var toSq = sqName(chosen.destino.l, chosen.destino.c);
        engine.fazerMovimento(chosen.origem.l, chosen.origem.c, chosen.destino.l, chosen.destino.c);
        var pieceType = engine.tabuleiro[chosen.destino.l][chosen.destino.c].tipo;
        var hFrom = engineToHtml(chosen.origem.l, chosen.origem.c);
        var hTo = engineToHtml(chosen.destino.l, chosen.destino.c);
        animateMove(hFrom.row, hFrom.col, hTo.row, hTo.col, function () {
            renderBoard();
            updateStatus();
            addHistory('robo', pieceType, fromSq, toSq);
            isProcessing = false;
            checkGameEnd();
        });
    }

    function checkGameEnd() {
        if (gameEnded) return true;
        if (engine.ehXequeMate()) {
            var winner = engine.turno === 'W' ? 'B' : 'W';
            showGameOver(winner);
            return true;
        }
        var motivoEmpate = engine.obterMotivoEmpate();
        if (motivoEmpate) {
            showDraw(motivoEmpate);
            return true;
        }
        var motivoReivindicavel = engine.obterMotivoEmpateReivindicavel();
        if (motivoReivindicavel && engine.turno === robotColor) {
            showDraw(motivoReivindicavel);
            return true;
        }
        updateClaimButton();
        return false;
    }

    function showGameOver(winner) {
        if (gameEnded) return;
        gameEnded = true;
        document.getElementById('game-over-emoji').textContent = winner === playerColor ? '\uD83C\uDFC6' : '\uD83D\uDE14';
        var title = document.getElementById('game-over-title');
        if (winner === playerColor) {
            title.textContent = 'Voce Ganhou!';
            title.className = 'game-over-title won';
            document.getElementById('game-over-message').textContent = 'Parabens! Sua estrategia foi melhor!';
        } else {
            title.textContent = 'Voce Perdeu!';
            title.className = 'game-over-title lost';
            document.getElementById('game-over-message').textContent = 'O robo venceu desta vez. Tente novamente!';
        }
        document.getElementById('game-over-modal').classList.add('active');
        var st = document.getElementById('status-text');
        if (st) st.innerHTML = '<span class="status-end">' + title.textContent + '</span>';
    }

    function showDraw(motivo) {
        if (gameEnded) return;
        gameEnded = true;
        document.getElementById('game-over-emoji').textContent = '\uD83E\uDD1D';
        var title = document.getElementById('game-over-title');
        title.textContent = 'Empate!';
        title.className = 'game-over-title';
        title.style.color = '#F59E0B';
        var mensagens = {
            'afogamento': 'Empate por afogamento: o jogador da vez não tem lance legal e não está em xeque.',
            'material-insuficiente': 'Empate por material insuficiente para dar xeque-mate.',
            'cinquenta-lances': 'Empate pela regra dos 50 lances sem movimento de peão ou captura.',
            'repeticao-tripla': 'Empate porque a mesma posição apareceu três vezes.',
            'setenta-cinco-lances': 'Empate automático após 75 lances sem movimento de peão ou captura.',
            'repeticao-quíntupla': 'Empate automático porque a mesma posição apareceu cinco vezes.'
        };
        document.getElementById('game-over-message').textContent = mensagens[motivo] || 'O jogo terminou empatado. Ninguém venceu.';
        document.getElementById('game-over-modal').classList.add('active');
        var st = document.getElementById('status-text');
        if (st) st.innerHTML = '<span style="color:#F59E0B;font-weight:800;">\uD83E\uDD1D EMPATE!</span>';
    }

    function updateStatus() {
        var st = document.getElementById('status-text');
        if (!st) return;
        var html = '';
        if (engine.turno === playerColor) {
            html = '<span class="status-you">\uD83D\uDD35 SUA VEZ (VOCE)</span>';
        } else {
            html = '<span class="status-robo">\uD83E\uDD16 VEZ DO ROBO</span>';
        }
        if (engine.emXeque(playerColor)) {
            html += ' <span class="check-warn">\u26A0\uFE0F SEU REI ESTA EM XEQUE!</span>';
        } else if (engine.emXeque(robotColor)) {
            html += ' <span class="check-warn">\u26A0\uFE0F REI DO ROBO EM XEQUE!</span>';
        }
        st.innerHTML = html;
        updateClaimButton();
    }

    function updateClaimButton() {
        var btn = document.getElementById('btn-claim-draw');
        if (!btn) return;
        const disponivel = !gameEnded && !isProcessing && engine.turno === playerColor && Boolean(engine.obterMotivoEmpateReivindicavel());
        btn.hidden = !disponivel;
    }

    function escolheCor(cor) {
        playerColor = cor;
        robotColor = cor === 'W' ? 'B' : 'W';
        engine = new ChessEngine();
        gameEnded = false;
        isProcessing = false;
        selectedSquare = null;
        validMoves = [];
        moveHistory = [];
        moveCount = 0;
        document.getElementById('escolhecor-inicio').classList.remove('visible');
        document.getElementById('escolhecor-inicio').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('game-status').style.display = 'block';
        renderNotation();
        renderBoard();
        updateStatus();
        renderHistory();
        if (engine.turno !== playerColor) {
            isProcessing = true;
            var d = 800 + Math.random() * 400;
            showThinking();
            setTimeout(robotTurn, d);
        }
    }

    function reiniciarFluxoDoJogo() {
        engine = new ChessEngine();
        playerColor = null;
        robotColor = null;
        gameEnded = false;
        isProcessing = false;
        selectedSquare = null;
        validMoves = [];
        moveHistory = [];
        moveCount = 0;
        document.getElementById('game-over-modal').classList.remove('active');
        var title = document.getElementById('game-over-title');
        title.style.color = '';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-status').style.display = 'none';
        var escolha = document.getElementById('escolhecor-inicio');
        escolha.classList.add('visible');
        escolha.style.display = 'flex';
        document.getElementById('status-text').textContent = '';
        updateClaimButton();
        renderHistory();
    }

    // Event listeners
    document.getElementById('color-white').addEventListener('click', function () { escolheCor('W'); });
    document.getElementById('color-black').addEventListener('click', function () { escolheCor('B'); });
    document.getElementById('btn-reload').addEventListener('click', function () {
        reiniciarFluxoDoJogo();
    });
    document.getElementById('btn-claim-draw').addEventListener('click', function () {
        if (gameEnded || engine.turno !== playerColor) return;
        var motivo = engine.obterMotivoEmpateReivindicavel();
        if (motivo) showDraw(motivo);
    });

    for (var r = 1; r <= 8; r++) {
        for (var c = 1; c <= 8; c++) {
            (function (row, col) {
                var cell = document.getElementById('t' + row + col);
                if (cell) {
                    cell.addEventListener('click', function () { handleCellClick(row, col); });
                    cell.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCellClick(row, col);
                        }
                    });
                }
            })(r, c);
        }
    }
});
