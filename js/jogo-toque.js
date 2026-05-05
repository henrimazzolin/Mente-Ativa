document.addEventListener('DOMContentLoaded', function() {
        const TOTAL_CELULAS = 9;
        const TOTAL_RODADAS = 5;

        let acertos = 0;
        let rodadaAtual = 0;
        let posicaoVerde = -1;

        function criarGrid() {
            const grid = document.getElementById('grid');
            grid.innerHTML = '';
            
            for (let i = 0; i < TOTAL_CELULAS; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.index = i;
                cell.addEventListener('click', function() { clicarCelula(i, this); });
                grid.appendChild(cell);
            }
        }

        function posicionarVerde() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(c => c.classList.remove('green', 'correct', 'wrong'));
            
            posicaoVerde = Math.floor(Math.random() * TOTAL_CELULAS);
            cells[posicaoVerde].classList.add('green');
        }

        function clicarCelula(index, cell) {
            if (roundAtual >= TOTAL_RODADAS) return;
            
            if (index === posicaoVerde) {
                cell.classList.add('correct');
                acertos++;
                rodadaAtual++;
                
                document.getElementById('acertos').textContent = acertos;
                document.getElementById('falta').textContent = TOTAL_RODADAS - rodadaAtual;
                
                if (rodadaAtual >= TOTAL_RODADAS) {
                    setTimeout(mostrarResultado, 500);
                } else {
                    setTimeout(posicionarVerde, 400);
                }
            } else {
                cell.classList.add('wrong');
                setTimeout(() => {
                    cell.classList.remove('wrong');
                }, 400);
                
                mostrarFeedback(false, 'Tente novamente!', 'Clique no quadrado verde');
            }
        }

        var roundAtual = 0;

        function iniciarJogo() {
            acertos = 0;
            roundAtual = 0;
            rodadaAtual = 0;
            
            document.getElementById('acertos').textContent = '0';
            document.getElementById('falta').textContent = '5';
            
            criarGrid();
            posicionarVerde();
        }

        function mostrarFeedback(acertou, titulo, subtitulo) {
            const overlay = document.getElementById('feedbackOverlay');
            const icon = document.getElementById('feedbackIcon');
            const title = document.getElementById('feedbackTitle');
            const subtitle = document.getElementById('feedbackSubtitle');
            
            icon.className = 'feedback-icon ' + (acertou ? 'success' : 'error');
            icon.textContent = acertou ? '✅' : '❌';
            title.textContent = titulo;
            subtitle.textContent = subtitulo;
            
            overlay.classList.add('show');
            
            if (acertou) {
                setTimeout(fecharFeedback, 1000);
            }
        }

        function fecharFeedback() {
            document.getElementById('feedbackOverlay').classList.remove('show');
        }

        function mostrarResultado() {
            const overlay = document.getElementById('feedbackOverlay');
            const icon = document.getElementById('feedbackIcon');
            const title = document.getElementById('feedbackTitle');
            const subtitle = document.getElementById('feedbackSubtitle');
            const btn = document.getElementById('feedbackBtn');
            
            icon.className = 'feedback-icon success';
            icon.textContent = '🏆';
            
            if (acertos === TOTAL_RODADAS) {
                title.textContent = 'Perfeito!';
                subtitle.textContent = 'Você acertou todos os 5 quadrados!';
            } else {
                title.textContent = 'Parabéns!';
                subtitle.textContent = 'Você acertou ' + acertos + ' de ' + TOTAL_RODADAS + ' quadrados!';
            }
            
            btn.textContent = 'Jogar Novamente';
            btn.onclick = function() {
                fecharFeedback();
                iniciarJogo();
            };
            
            overlay.classList.add('show');
        }

        // Event listeners
        document.getElementById('btn-back').addEventListener('click', function() {
            location.href = 'grupo-simples.html';
        });
        document.getElementById('btn-restart').addEventListener('click', iniciarJogo);
        document.getElementById('feedbackBtn').addEventListener('click', fecharFeedback);

        iniciarJogo();
});