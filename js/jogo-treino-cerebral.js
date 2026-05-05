document.addEventListener('DOMContentLoaded', function() {
        let startTime = 0;
        let timeoutId = null;
        let canClick = false;
        let gameStarted = false;
        let attempts = 0;
        let bestTime = null;

        function showScreen(screenId) {
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function startGame() {
            attempts++;
            document.getElementById('attempts').textContent = attempts;
            
            gameStarted = true;
            canClick = false;
            
            showScreen('prepareScreen');
            
            const delay = Math.random() * 3000 + 2000;
            
            timeoutId = setTimeout(() => {
                if (gameStarted) {
                    showClickScreen();
                }
            }, delay);
        }

        function showClickScreen() {
            showScreen('clickScreen');
            canClick = true;
            startTime = Date.now();
        }

        function handleClick() {
            if (!gameStarted) return;

            if (!canClick) {
                clearTimeout(timeoutId);
                gameStarted = false;
                showTooEarly();
                return;
            }

            const reactionTime = Date.now() - startTime;
            canClick = false;
            gameStarted = false;

            showResult(reactionTime);
        }

        function showTooEarly() {
            const messageEl = document.getElementById('resultMessage');
            messageEl.innerHTML = 'Muito cedo!<br><span class="subtitle">Aguarde o botão verde aparecer</span>';
            messageEl.className = 'message prepare';
            
            document.getElementById('currentTime').textContent = '--';
            
            showScreen('resultScreen');
        }

        function showResult(time) {
            const messageEl = document.getElementById('resultMessage');
            
            if (bestTime === null || time < bestTime) {
                bestTime = time;
                document.getElementById('bestTime').textContent = bestTime + ' ms';
            }
            
            document.getElementById('currentTime').textContent = time + ' ms';
            document.getElementById('bestTimeResult').textContent = bestTime + ' ms';
            
            let rating = '';
            if (time < 200) {
                rating = 'Incrível!';
            } else if (time < 300) {
                rating = 'Muito rápido!';
            } else if (time < 400) {
                rating = 'Bom tempo!';
            } else if (time < 500) {
                rating = 'Pode melhorar!';
            } else {
                rating = 'Continue praticando!';
            }
            
            messageEl.innerHTML = `<span class="success">${rating}</span><span class="time">${time} ms</span>`;
            messageEl.className = 'message success';
            
            showScreen('resultScreen');
        }

        function goBack() {
            gameStarted = false;
            canClick = false;
            clearTimeout(timeoutId);
            showScreen('startScreen');
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                if (document.getElementById('clickScreen').classList.contains('active')) {
                    handleClick();
                } else if (document.getElementById('startScreen').classList.contains('active')) {
                    startGame();
                } else if (document.getElementById('resultScreen').classList.contains('active')) {
                    startGame();
                }
            }
        });

        // Event listeners
        document.getElementById('btn-start').addEventListener('click', startGame);
        document.getElementById('clickBtn').addEventListener('click', handleClick);
        document.getElementById('btn-retry').addEventListener('click', startGame);
        document.getElementById('btn-back-menu').addEventListener('click', goBack);
});