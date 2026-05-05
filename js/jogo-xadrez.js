document.addEventListener('DOMContentLoaded', function() {
        let playerColor = null;
        let robotColor = null;
        let gameEnded = false;
        let vez = "branco";
        let peca = [];
        let il = [];
        let movimenta = [];
        let possiveis = [];
        let cont_possiveis = 0;

        function inicia_jogo() {
            document.getElementById('intro-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'flex';
            document.getElementById('escolhecor-inicio').style.display = 'flex';
            document.getElementById('escolhecor-inicio').classList.remove('hidden');
        }

        function configura_tabuleiro() {
            vez = "branco";

            document.getElementById("t11").innerHTML = "&#9820;";
            document.getElementById("t12").innerHTML = "&#9822;";
            document.getElementById("t13").innerHTML = "&#9821;";
            document.getElementById("t14").innerHTML = "&#9819;";
            document.getElementById("t15").innerHTML = "&#9818;";
            document.getElementById("t16").innerHTML = "&#9821;";
            document.getElementById("t17").innerHTML = "&#9822;";
            document.getElementById("t18").innerHTML = "&#9820;";

            document.getElementById("t21").innerHTML = "&#9823;";
            document.getElementById("t22").innerHTML = "&#9823;";
            document.getElementById("t23").innerHTML = "&#9823;";
            document.getElementById("t24").innerHTML = "&#9823;";
            document.getElementById("t25").innerHTML = "&#9823;";
            document.getElementById("t26").innerHTML = "&#9823;";
            document.getElementById("t27").innerHTML = "&#9823;";
            document.getElementById("t28").innerHTML = "&#9823;";

            document.getElementById("t81").innerHTML = "&#9814;";
            document.getElementById("t82").innerHTML = "&#9816;";
            document.getElementById("t83").innerHTML = "&#9815;";
            document.getElementById("t84").innerHTML = "&#9813;";
            document.getElementById("t85").innerHTML = "&#9812;";
            document.getElementById("t86").innerHTML = "&#9815;";
            document.getElementById("t87").innerHTML = "&#9816;";
            document.getElementById("t88").innerHTML = "&#9814;";

            document.getElementById("t71").innerHTML = "&#9817;";
            document.getElementById("t72").innerHTML = "&#9817;";
            document.getElementById("t73").innerHTML = "&#9817;";
            document.getElementById("t74").innerHTML = "&#9817;";
            document.getElementById("t75").innerHTML = "&#9817;";
            document.getElementById("t76").innerHTML = "&#9817;";
            document.getElementById("t77").innerHTML = "&#9817;";
            document.getElementById("t78").innerHTML = "&#9817;";

            cria_array();
        }

        function cria_array() {
            var x, y;

            peca = new Array();

            for (x = 1; x <= 8; x++) {
                peca[x] = new Array();
                for (y = 1; y <= 8; y++) {
                    peca[x][y] = new Array();
                    peca[x][y]['peca'] = false;
                    peca[x][y]['cor'] = false;
                }
            }

            il = new Array();
            il['preto'] = new Array();
            il['branco'] = new Array();

            peca[1][1]['peca'] = "torre"; peca[1][1]['cor'] = "preto"; peca[1][1]['mov'] = 0; il['preto']['torre'] = "&#9820;";
            peca[1][2]['peca'] = "cavalo"; peca[1][2]['cor'] = "preto"; peca[1][2]['mov'] = 0; il['preto']['cavalo'] = "&#9822;";
            peca[1][3]['peca'] = "bispo"; peca[1][3]['cor'] = "preto"; peca[1][3]['mov'] = 0; il['preto']['bispo'] = "&#9821;";
            peca[1][4]['peca'] = "rainha"; peca[1][4]['cor'] = "preto"; peca[1][4]['mov'] = 0; il['preto']['rainha'] = "&#9819;";
            peca[1][5]['peca'] = "rei"; peca[1][5]['cor'] = "preto"; peca[1][5]['mov'] = 0; il['preto']['rei'] = "&#9818;";
            peca[1][6]['peca'] = "bispo"; peca[1][6]['cor'] = "preto"; peca[1][6]['mov'] = 0;
            peca[1][7]['peca'] = "cavalo"; peca[1][7]['cor'] = "preto"; peca[1][7]['mov'] = 0;
            peca[1][8]['peca'] = "torre"; peca[1][8]['cor'] = "preto"; peca[1][8]['mov'] = 0;

            peca[2][1]['peca'] = "peao"; peca[2][1]['cor'] = "preto"; peca[2][1]['mov'] = 0; il['preto']['peao'] = "&#9823;";
            peca[2][2]['peca'] = "peao"; peca[2][2]['cor'] = "preto"; peca[2][2]['mov'] = 0;
            peca[2][3]['peca'] = "peao"; peca[2][3]['cor'] = "preto"; peca[2][3]['mov'] = 0;
            peca[2][4]['peca'] = "peao"; peca[2][4]['cor'] = "preto"; peca[2][4]['mov'] = 0;
            peca[2][5]['peca'] = "peao"; peca[2][5]['cor'] = "preto"; peca[2][5]['mov'] = 0;
            peca[2][6]['peca'] = "peao"; peca[2][6]['cor'] = "preto"; peca[2][6]['mov'] = 0;
            peca[2][7]['peca'] = "peao"; peca[2][7]['cor'] = "preto"; peca[2][7]['mov'] = 0;
            peca[2][8]['peca'] = "peao"; peca[2][8]['cor'] = "preto"; peca[2][8]['mov'] = 0;

            peca[8][1]['peca'] = "torre"; peca[8][1]['cor'] = "branco"; peca[8][1]['mov'] = 0; il['branco']['torre'] = "&#9814;";
            peca[8][2]['peca'] = "cavalo"; peca[8][2]['cor'] = "branco"; peca[8][2]['mov'] = 0; il['branco']['cavalo'] = "&#9816;";
            peca[8][3]['peca'] = "bispo"; peca[8][3]['cor'] = "branco"; peca[8][3]['mov'] = 0; il['branco']['bispo'] = "&#9815;";
            peca[8][4]['peca'] = "rainha"; peca[8][4]['cor'] = "branco"; peca[8][4]['mov'] = 0; il['branco']['rainha'] = "&#9813;";
            peca[8][5]['peca'] = "rei"; peca[8][5]['cor'] = "branco"; peca[8][5]['mov'] = 0; il['branco']['rei'] = "&#9812;";
            peca[8][6]['peca'] = "bispo"; peca[8][6]['cor'] = "branco"; peca[8][6]['mov'] = 0;
            peca[8][7]['peca'] = "cavalo"; peca[8][7]['cor'] = "branco"; peca[8][7]['mov'] = 0;
            peca[8][8]['peca'] = "torre"; peca[8][8]['cor'] = "branco"; peca[8][8]['mov'] = 0;

            peca[7][1]['peca'] = "peao"; peca[7][1]['cor'] = "branco"; peca[7][1]['mov'] = 0; il['branco']['peao'] = "&#9817;";
            peca[7][2]['peca'] = "peao"; peca[7][2]['cor'] = "branco"; peca[7][2]['mov'] = 0;
            peca[7][3]['peca'] = "peao"; peca[7][3]['cor'] = "branco"; peca[7][3]['mov'] = 0;
            peca[7][4]['peca'] = "peao"; peca[7][4]['cor'] = "branco"; peca[7][4]['mov'] = 0;
            peca[7][5]['peca'] = "peao"; peca[7][5]['cor'] = "branco"; peca[7][5]['mov'] = 0;
            peca[7][6]['peca'] = "peao"; peca[7][6]['cor'] = "branco"; peca[7][6]['mov'] = 0;
            peca[7][7]['peca'] = "peao"; peca[7][7]['cor'] = "branco"; peca[7][7]['mov'] = 0;
            peca[7][8]['peca'] = "peao"; peca[7][8]['cor'] = "branco"; peca[7][8]['mov'] = 0;

            movimenta = new Array();
            movimenta['selecionada'] = new Array();
            movimenta['selecionada']['x'] = 0;
            movimenta['selecionada']['y'] = 0;
            movimenta['selecionada']['peca'] = "0";
            movimenta['selecionada']['cor'] = "0";

            movimenta['destino'] = new Array();
            movimenta['destino']['x'] = 0;
            movimenta['destino']['y'] = 0;
            movimenta['destino']['peca'] = "0";
            movimenta['destino']['cor'] = "0";

            possiveis = new Array();
        }

        function possiveis_movimentos() {
            var x, y;
            var c = 0;
            var i;
            x = movimenta['selecionada']['x'];
            y = movimenta['selecionada']['y'];

            document.getElementById('t' + x + y).style.backgroundColor = "#3C9";
            possiveis[c] = "t" + x + y;
            c++;

            if (peca[x][y]['peca'] == 'peao') {
                if (peca[x][y]['cor'] == "branco") {
                    if (!peca[x - 1][y]['peca']) {
                        possivel(x - 1, y);
                    }
                    if (y - 1 > 0 && peca[x - 1][y - 1]['peca']) {
                        possivel(x - 1, y - 1);
                    }
                    if (y + 1 < 9 && peca[x - 1][y + 1]['peca']) {
                        possivel(x - 1, y + 1);
                    }
                    if (x == 7) {
                        if (!peca[x - 2][y]['peca'] && !peca[x - 1][y]['peca']) {
                            possivel(x - 2, y);
                        }
                    }
                }

                if (peca[x][y]['cor'] == "preto") {
                    if (!peca[x + 1][y]['peca']) {
                        possivel(x + 1, y);
                    }
                    if (y - 1 > 0 && peca[x + 1][y - 1]['peca']) {
                        possivel(x + 1, y - 1);
                    }
                    if (y + 1 < 9 && peca[x + 1][y + 1]['peca']) {
                        possivel(x + 1, y + 1);
                    }
                    if (x == 2) {
                        if (!peca[x + 2][y]['peca'] && !peca[x + 1][y]['peca']) {
                            possivel(x + 2, y);
                        }
                    }
                }
            }

            if (peca[x][y]['peca'] == 'cavalo') {
                possivel(x - 1, y - 2);
                possivel(x + 1, y + 2);
                possivel(x + 1, y - 2);
                possivel(x - 1, y + 2);
                possivel(x - 2, y - 1);
                possivel(x + 2, y + 1);
                possivel(x + 2, y - 1);
                possivel(x - 2, y + 1);
            }

            if (peca[x][y]['peca'] == 'rei') {
                possivel(x - 1, y);
                possivel(x, y - 1);
                possivel(x - 1, y - 1);
                possivel(x + 1, y);
                possivel(x, y + 1);
                possivel(x + 1, y + 1);
                possivel(x - 1, y + 1);
                possivel(x + 1, y - 1);
            }

            if (peca[x][y]['peca'] == 'torre') {
                for (i = 1; possivel(x - i, y); i++);
                for (i = 1; possivel(x + i, y); i++);
                for (i = 1; possivel(x, y - i); i++);
                for (i = 1; possivel(x, y + i); i++);
            }

            if (peca[x][y]['peca'] == 'bispo') {
                for (i = 1; possivel(x - i, y - i); i++);
                for (i = 1; possivel(x + i, y + i); i++);
                for (i = 1; possivel(x - i, y + i); i++);
                for (i = 1; possivel(x + i, y - i); i++);
            }

            if (peca[x][y]['peca'] == 'rainha') {
                for (i = 1; possivel(x - i, y - i); i++);
                for (i = 1; possivel(x + i, y + i); i++);
                for (i = 1; possivel(x - i, y + i); i++);
                for (i = 1; possivel(x + i, y - i); i++);
                for (i = 1; possivel(x - i, y); i++);
                for (i = 1; possivel(x + i, y); i++);
                for (i = 1; possivel(x, y - i); i++);
                for (i = 1; possivel(x, y + i); i++);
            }

            function possivel(px, py) {
                if (px > 0 && px < 9 && py > 0 && py < 9 && peca[px][py]['cor'] != movimenta['selecionada']['cor']) {
                    document.getElementById('t' + (px) + (py)).style.backgroundColor = "#3C9";
                    possiveis[c] = "t" + (px) + (py);
                    c++;

                    if (!peca[px][py]['peca']) {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            return c;
        }

        function volta_fundo() {
            var cf;
            for (cf = 0; cf < possiveis.length; cf++) {
                if (possiveis[cf]) {
                    document.getElementById(possiveis[cf]).style.backgroundColor = "";
                }
            }
        }

        function verifica_possivel(x, y, c) {
            var pode = 0;
            var cp;
            var div = "t" + x + y;

            for (cp = 1; cp < c; cp++) {
                if (possiveis[cp] == div) {
                    pode++;
                }
                if (pode > 0) {
                    return 1;
                }
            }
        }

        function seleciona(x, y) {
            if ((movimenta['selecionada']['x'] == 0 || peca[x][y]['cor'] == movimenta['selecionada']['cor']) && peca[x][y]['cor'] == vez) {
                if (movimenta['selecionada']['x'] != 0) {
                    volta_fundo();
                }
                if (peca[x][y]['peca']) {
                    movimenta['selecionada']['x'] = x;
                    movimenta['selecionada']['y'] = y;
                    movimenta['selecionada']['peca'] = peca[x][y]['peca'];
                    movimenta['selecionada']['cor'] = peca[x][y]['cor'];

                    cont_possiveis = possiveis_movimentos();
                }
            } else if (verifica_possivel(x, y, cont_possiveis)) {
                if (peca[x][y]['peca'] == "rei") {
                    mostrarFimDeJogo(movimenta['selecionada']['cor']);
                    return;
                }

                if (peca[x][y]['cor'] != movimenta['selecionada']['cor']) {
                    movimenta['destino']['x'] = x;
                    movimenta['destino']['y'] = y;

                    if (peca[x][y]['peca']) {
                        movimenta['destino']['peca'] = peca[x][y]['peca'];
                        movimenta['destino']['cor'] = peca[x][y]['cor'];
                    }

                    document.getElementById("t" + movimenta['selecionada']['x'] + "" + movimenta['selecionada']['y']).innerHTML = "";
                    document.getElementById("t" + x + "" + y).innerHTML = il[movimenta['selecionada']['cor']][movimenta['selecionada']['peca']];
                    peca[x][y]['peca'] = movimenta['selecionada']['peca'];
                    peca[x][y]['cor'] = movimenta['selecionada']['cor'];

                    peca[movimenta['selecionada']['x']][movimenta['selecionada']['y']]['peca'] = false;
                    peca[movimenta['selecionada']['x']][movimenta['selecionada']['y']]['cor'] = false;

                    movimenta['selecionada']['x'] = 0;
                    movimenta['selecionada']['y'] = 0;
                    movimenta['selecionada']['peca'] = "0";
                    movimenta['selecionada']['cor'] = "0";
                }

                volta_fundo();

                if (vez == "branco") {
                    vez = "preto";
                } else {
                    vez = "branco";
                }

                if (playerColor) {
                    atualizarStatus();
                }
            }
        }

        function escolhecor_incio(cor) {
            document.getElementById('escolhecor-inicio').style.display = 'none';
            document.getElementById('fundo').style.display = 'none';
            document.getElementById('game-status').style.display = 'block';
            
            configura_tabuleiro();
            
            playerColor = cor;
            robotColor = (cor === 'branco') ? 'preto' : 'branco';
            
            vez = cor;
            
            atualizarStatus();
        }

        function atualizarStatus() {
            const statusDiv = document.getElementById('status-text');
            let html = '';
            
            if (vez === playerColor) {
                html = '<span class="status-you">🔵 SUA VEZ (VOCÊ)</span>';
            } else {
                html = '<span class="status-robo">🤖 VEZ DO ROBÔ</span>';
            }
            
            if (estaEmCheque(playerColor)) {
                html += ' <span style="color: #FF6B6B; font-weight: 800; font-size: 14px; margin-left: 10px;">⚠️ SEU REI ESTÁ EM CHEQUE!</span>';
            } else if (estaEmCheque(robotColor)) {
                html += ' <span style="color: #FF6B6B; font-weight: 800; font-size: 14px; margin-left: 10px;">⚠️ REI DO ROBÔ EM CHEQUE!</span>';
            }
            
            statusDiv.innerHTML = html;
        }

        function estaEmCheque(cor) {
            let reiX = -1, reiY = -1;
            for (let x = 1; x <= 8; x++) {
                for (let y = 1; y <= 8; y++) {
                    if (peca[x][y]['peca'] === 'rei' && peca[x][y]['cor'] === cor) {
                        reiX = x;
                        reiY = y;
                        break;
                    }
                }
                if (reiX !== -1) break;
            }

            if (reiX === -1) return false;

            const corInimiga = (cor === 'branco') ? 'preto' : 'branco';
            
            for (let x = 1; x <= 8; x++) {
                for (let y = 1; y <= 8; y++) {
                    if (peca[x][y]['peca'] && peca[x][y]['cor'] === corInimiga) {
                        const podeAtacar = verificaAtaque(x, y, reiX, reiY);
                        if (podeAtacar) return true;
                    }
                }
            }
            return false;
        }

        function verificaAtaque(px, py, tx, ty) {
            const tipo = peca[px][py]['peca'];
            
            if (tipo === 'peao') {
                if (peca[px][py]['cor'] === 'branco') {
                    if (px - 1 === tx && (py - 1 === ty || py + 1 === ty)) return true;
                } else {
                    if (px + 1 === tx && (py - 1 === ty || py + 1 === ty)) return true;
                }
            }
            else if (tipo === 'cavalo') {
                const movsCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
                for (const [dx, dy] of movsCavalo) {
                    if (px + dx === tx && py + dy === ty) return true;
                }
            }
            else if (tipo === 'rei') {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) continue;
                        if (px + dx === tx && py + dy === ty) return true;
                    }
                }
            }
            else if (tipo === 'torre' || tipo === 'rainha') {
                if (px === tx) {
                    const start = Math.min(py, ty) + 1;
                    const end = Math.max(py, ty);
                    let bloqueado = false;
                    for (let i = start; i < end; i++) {
                        if (peca[px][i]['peca']) { bloqueado = true; break; }
                    }
                    if (!bloqueado) return true;
                }
                if (py === ty) {
                    const start = Math.min(px, tx) + 1;
                    const end = Math.max(px, tx);
                    let bloqueado = false;
                    for (let i = start; i < end; i++) {
                        if (peca[i][py]['peca']) { bloqueado = true; break; }
                    }
                    if (!bloqueado) return true;
                }
            }
            
            if (tipo === 'bispo' || tipo === 'rainha') {
                if (Math.abs(px - tx) === Math.abs(py - ty) && Math.abs(px - tx) > 0) {
                    const dx = tx > px ? 1 : -1;
                    const dy = ty > py ? 1 : -1;
                    let x = px + dx, y = py + dy;
                    let bloqueado = false;
                    while (x !== tx || y !== ty) {
                        if (peca[x][y]['peca']) { bloqueado = true; break; }
                        x += dx;
                        y += dy;
                    }
                    if (!bloqueado) return true;
                }
            }
            
            return false;
        }

        function mostrarFimDeJogo(vencedorCor) {
            if (gameEnded) return;
            gameEnded = true;
            
            const modal = document.getElementById('game-over-modal');
            const emoji = document.getElementById('game-over-emoji');
            const title = document.getElementById('game-over-title');
            const message = document.getElementById('game-over-message');
            
            if (vencedorCor === playerColor) {
                emoji.textContent = '🏆';
                title.textContent = 'Você Ganhou!';
                title.className = 'game-over-title won';
                message.textContent = 'Parabéns! Você conseguiu uma vitória impressionante no xadrez!';
            } else {
                emoji.textContent = '😔';
                title.textContent = 'Você Perdeu!';
                title.className = 'game-over-title lost';
                message.textContent = 'O robô foi mais estratégico desta vez. Tente novamente!';
            }
            
            modal.classList.add('active');
            document.getElementById('fundo').style.display = 'block';
        }

        // Add event listeners
        document.getElementById('btn-start-game').addEventListener('click', inicia_jogo);
        document.getElementById('color-white').addEventListener('click', function() { escolhecor_incio('branco'); });
        document.getElementById('color-black').addEventListener('click', function() { escolhecor_incio('preto'); });
        document.getElementById('btn-reload').addEventListener('click', function() { location.reload(); });

        // Add click handlers for all board cells
        for (let row = 1; row <= 8; row++) {
            for (let col = 1; col <= 8; col++) {
                document.getElementById('t' + row + col).addEventListener('click', function() {
                    const id = this.id;
                    const row = parseInt(id.charAt(1));
                    const col = parseInt(id.charAt(2));
                    seleciona(row, col);
                });
            }
        }
});