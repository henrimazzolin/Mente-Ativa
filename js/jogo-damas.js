document.addEventListener('DOMContentLoaded', function () {
    let engine = new DamasEngine();
    let playerColor = null;
    let robotColor = null;
    let gameEnded = false;
    let isProcessing = false;
    let selectedSquare = null;
    let validMoves = [];

    const NAMES = { 'p': 'Peao', 'd': 'Dama' };

    function getIcon(tipo, cor) {
        if (tipo === 'd') return cor === 'W' ? '\u26AA' : '\uD83D\uDD34';
        return cor === 'W' ? '\u26AA' : '\u26AB';
    }

    function renderBoard() {
        document.querySelectorAll('.must-capture').forEach(function(el) { el.classList.remove('must-capture'); });
        for (let l = 0; l < 8; l++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.getElementById('t' + l + c);
                if (!cell) continue;
                cell.style.visibility = '';
                const piece = engine.tabuleiro[l][c];
                cell.innerHTML = piece ? getIcon(piece.tipo, piece.cor) : '';
                cell.className = (l + c) % 2 === 0 ? 'light' : 'dark';
                if (piece) {
                    const cn = piece.cor === 'W' ? 'branco' : 'preto';
                    cell.classList.add(cn);
                    if (piece.tipo === 'd') cell.classList.add('king');
                    cell.setAttribute('aria-label', NAMES[piece.tipo] + ' ' + cn + ', ' + sqName(l, c));
                } else {
                    cell.setAttribute('aria-label', 'Vazio, ' + sqName(l, c));
                }
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '0');
            }
        }
        if (selectedSquare) {
            const c = document.getElementById('t' + selectedSquare.l + selectedSquare.c);
            if (c) c.classList.add('selected');
        }
        for (const mv of validMoves) {
            const c = document.getElementById('t' + mv.linha + mv.coluna);
            if (c) {
                c.classList.add('possible-move');
                if (engine.tabuleiro[mv.linha][mv.coluna]) {
                    c.classList.add('possible-capture');
                }
            }
        }
        if (!gameEnded && !selectedSquare && engine.turno === playerColor && !isProcessing) {
            var caps = engine.obterCapturasDisponiveis(playerColor);
            if (caps.length > 0) {
                var pecasCapture = {};
                caps.forEach(function(cap) {
                    pecasCapture['t' + cap.origemL + cap.origemC] = true;
                });
                Object.keys(pecasCapture).forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) el.classList.add('must-capture');
                });
            }
        }
    }

    function sqName(l, c) {
        return String.fromCharCode(97 + c) + (8 - l);
    }


    function highlightCapturablePieces(capturas) {
        document.querySelectorAll('.must-capture').forEach(function(el) { el.classList.remove('must-capture'); });
        var pecasCapture = {};
        capturas.forEach(function(cap) {
            var chave = 't' + cap.origemL + cap.origemC;
            pecasCapture[chave] = true;
        });
        Object.keys(pecasCapture).forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.classList.add('must-capture');
        });
    }

    function handleCellClick(l, c) {
        if (gameEnded || isProcessing) return;
        if (engine.turno !== playerColor) return;
        const clicked = engine.tabuleiro[l][c];
        if (selectedSquare) {
            if (clicked && clicked.cor === playerColor) {
                selectedSquare = { l: l, c: c };
                validMoves = engine.obterMovimentosValidos(l, c);
                renderBoard();
                return;
            }
            const jogada = validMoves.find(function (m) { return m.linha === l && m.coluna === c; });
            if (jogada) {
                var srcL = selectedSquare.l, srcC = selectedSquare.c;
                var srcCell = document.getElementById('t' + srcL + srcC);
                var pieceHTML = srcCell ? srcCell.innerHTML : '';
                engine.fazerMovimento(srcL, srcC, l, c, jogada.capturaLinha, jogada.capturaColuna);
                selectedSquare = null;
                validMoves = [];
                isProcessing = true;
                animateMove(srcL, srcC, l, c, pieceHTML, function () {
                    renderBoard();
                    updateStatus();
                    if (!checkGameEnd()) {
                        var d = 600 + Math.random() * 300;
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
            selectedSquare = { l: l, c: c };
            const capturas = engine.obterCapturasDisponiveis(playerColor);
            if (capturas.length > 0) {
                validMoves = capturas.filter(function (cap) { return cap.origemL === l && cap.origemC === c; });
                validMoves.forEach(function (m) { delete m.origemL; delete m.origemC; });
                if (validMoves.length === 0) {
                    selectedSquare = null;
                    renderBoard();
                    return;
                }
            } else {
                validMoves = engine.obterMovimentosValidos(l, c);
            }
            renderBoard();
            highlightCapturablePieces(capturas);
        }
    }

    function animateMove(srcL, srcC, destL, destC, pieceHTML, callback) {
        var srcCell = document.getElementById('t' + srcL + srcC);
        var destCell = document.getElementById('t' + destL + destC);
        if (!srcCell || !destCell) {
            if (callback) setTimeout(callback, 200);
            return;
        }
        var srcRect = srcCell.getBoundingClientRect();
        var destRect = destCell.getBoundingClientRect();
        var floater = document.createElement('div');
        floater.id = 'peca-flutuante';
        floater.innerHTML = '<span class="floater-content">' + pieceHTML + '</span>';
        var srcClasses = srcCell.className;
        if (srcClasses) floater.className = srcClasses;
        floater.style.left = srcRect.left + 'px';
        floater.style.top = srcRect.top + 'px';
        floater.style.width = srcRect.width + 'px';
        floater.style.height = srcRect.height + 'px';
        document.body.appendChild(floater);
        srcCell.style.visibility = 'hidden';
        requestAnimationFrame(function () {
            floater.style.left = destRect.left + 'px';
            floater.style.top = destRect.top + 'px';
        });
        var tid = setTimeout(function () {
            if (floater.parentNode) floater.parentNode.removeChild(floater);
            if (callback) callback();
        }, 400);
    }

    function showThinking() {
        var st = document.getElementById('status-text');
        if (st) st.innerHTML = '<span class="status-robo thinking">\uD83E\uDD16 ROB\u00D4 PENSANDO<span class="dots"><span>.</span><span>.</span><span>.</span></span></span>';
    }

    function robotTurn() {
        if (gameEnded) { isProcessing = false; return; }
        if (engine.turno !== robotColor) { isProcessing = false; return; }
        var chosen = engine.escolherJogadaIA(robotColor);
        if (!chosen) { isProcessing = false; checkGameEnd(); return; }
        var rSrcL = chosen.origem.l, rSrcC = chosen.origem.c;
        var rDestL = chosen.destino.l, rDestC = chosen.destino.c;
        var rSrcCell = document.getElementById('t' + rSrcL + rSrcC);
        var rPieceHTML = rSrcCell ? rSrcCell.innerHTML : '';
        engine.fazerMovimento(rSrcL, rSrcC, rDestL, rDestC,
            chosen.captura ? chosen.captura.l : undefined,
            chosen.captura ? chosen.captura.c : undefined);
            animateMove(rSrcL, rSrcC, rDestL, rDestC, rPieceHTML, function () {
                isProcessing = false;
                renderBoard();
                updateStatus();
                checkGameEnd();
            });
    }

    function checkGameEnd() {
        if (gameEnded) return true;
        if (engine.ehVencedor(robotColor)) {
            var winner = engine.turno === 'W' ? 'B' : 'W';
            showGameOver(winner);
            return true;
        }
        if (engine.ehVencedor(playerColor)) {
            var altWinner = playerColor === 'W' ? 'B' : 'W';
            showGameOver(altWinner);
            return true;
        }
        if (engine.ehEmpate()) {
            showDraw();
            return true;
        }
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

    function showDraw() {
        if (gameEnded) return;
        gameEnded = true;
        document.getElementById('game-over-emoji').textContent = '\uD83E\uDD1D';
        var title = document.getElementById('game-over-title');
        title.textContent = 'Empate!';
        title.className = 'game-over-title';
        title.style.color = '#F59E0B';
        document.getElementById('game-over-message').textContent = 'O jogo terminou empatado. Ninguem venceu!';
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
        st.innerHTML = html;
    }

    function iniciaJogo() {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('escolhecor-inicio').classList.add('visible');
        document.getElementById('escolhecor-inicio').style.display = 'flex';
    }

    function escolheCor(cor) {
        playerColor = cor;
        robotColor = cor === 'W' ? 'B' : 'W';
        engine = new DamasEngine();
        gameEnded = false;
        isProcessing = false;
        selectedSquare = null;
        validMoves = [];
        document.getElementById('escolhecor-inicio').classList.remove('visible');
        document.getElementById('escolhecor-inicio').style.display = 'none';
        document.getElementById('game-status').style.display = 'block';
        renderBoard();
        updateStatus();
        if (engine.turno !== playerColor) {
            isProcessing = true;
            var d = 600 + Math.random() * 300;
            showThinking();
            setTimeout(robotTurn, d);
        }
    }

    document.getElementById('btn-start-game').addEventListener('click', iniciaJogo);
    document.getElementById('color-white').addEventListener('click', function () { escolheCor('W'); });
    document.getElementById('color-black').addEventListener('click', function () { escolheCor('B'); });
    document.getElementById('btn-reload').addEventListener('click', function () { location.reload(); });

    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
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
