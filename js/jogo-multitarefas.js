document.addEventListener('DOMContentLoaded', function() {
        const GAME_DURATION = 30;
        const SEQUENCE_LENGTH = 3;
        
        let gameState = 'idle';
        let timeLeft = GAME_DURATION;
        let timerInterval = null;
        let attentionTimeout = null;
        
        let currentSequence = [];
        let userSequence = [];
        let sequenceAttempts = 0;
        let sequenceCorrect = 0;
        
        let attentionScore = 0;
        let attentionClicks = 0;
        
        let canInputSequence = false;

        function generateSequence() {
            const numbers = [1, 2, 3];
            currentSequence = [];
            for (let i = 0; i < SEQUENCE_LENGTH; i++) {
                currentSequence.push(numbers[Math.floor(Math.random() * numbers.length)]);
            }
        }

        function showSequence() {
            const display = document.getElementById('sequenceDisplay');
            display.innerHTML = '';
            
            generateSequence();
            
            currentSequence.forEach((num) => {
                const el = document.createElement('div');
                el.className = 'sequence-number';
                el.textContent = num;
                display.appendChild(el);
            });

            setTimeout(() => {
                hideSequence();
            }, 2000);
        }

        function hideSequence() {
            const display = document.getElementById('sequenceDisplay');
            const numbers = display.querySelectorAll('.sequence-number');
            numbers.forEach(num => num.classList.add('hidden'));
            canInputSequence = true;
        }

        function inputSequence(num) {
            if (gameState !== 'playing' || !canInputSequence) return;

            userSequence.push(num);
            
            const userDisplay = document.getElementById('userSequence');
            const el = document.createElement('div');
            el.className = 'user-number';
            el.textContent = num;
            userDisplay.appendChild(el);

            if (userSequence.length === SEQUENCE_LENGTH) {
                checkSequence();
            }
        }

        function checkSequence() {
            canInputSequence = false;
            sequenceAttempts++;
            
            const isCorrect = userSequence.every((num, index) => num === currentSequence[index]);
            const buttons = document.querySelectorAll('.seq-btn');
            
            if (isCorrect) {
                sequenceCorrect++;
                buttons.forEach(btn => btn.classList.add('correct'));
            } else {
                buttons.forEach(btn => btn.classList.add('wrong'));
            }

            setTimeout(() => {
                buttons.forEach(btn => {
                    btn.classList.remove('correct', 'wrong');
                });
                
                document.getElementById('userSequence').innerHTML = '';
                userSequence = [];
                
                showSequence();
            }, 1000);
        }

        function showAttentionButton() {
            if (gameState !== 'playing') return;
            
            const btn = document.getElementById('attentionBtn');
            btn.classList.add('show');
            btn.classList.remove('correct');
            
            attentionTimeout = setTimeout(() => {
                hideAttentionButton();
            }, 1500);
        }

        function hideAttentionButton() {
            const btn = document.getElementById('attentionBtn');
            btn.classList.remove('show');
            
            if (gameState === 'playing') {
                const nextDelay = Math.random() * 2000 + 1000;
                attentionTimeout = setTimeout(showAttentionButton, nextDelay);
            }
        }

        function clickAttention() {
            if (gameState !== 'playing') return;
            
            attentionClicks++;
            attentionScore++;
            
            const btn = document.getElementById('attentionBtn');
            btn.classList.add('correct');
            document.getElementById('attentionScore').textContent = attentionScore;
            
            clearTimeout(attentionTimeout);
            setTimeout(hideAttentionButton, 300);
        }

        function startGame() {
            gameState = 'playing';
            timeLeft = GAME_DURATION;
            sequenceAttempts = 0;
            sequenceCorrect = 0;
            attentionScore = 0;
            attentionClicks = 0;
            userSequence = [];
            canInputSequence = false;
            
            document.getElementById('timer').textContent = 'Tempo: ' + timeLeft + 's';
            document.getElementById('attentionScore').textContent = '0';
            document.getElementById('userSequence').innerHTML = '';
            document.getElementById('sequenceDisplay').innerHTML = '';
            document.getElementById('startBtn').textContent = 'Jogando...';
            document.getElementById('startBtn').disabled = true;

            showSequence();
            setTimeout(showAttentionButton, 1500);

            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = 'Tempo: ' + timeLeft + 's';
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function endGame() {
            gameState = 'ended';
            
            clearInterval(timerInterval);
            clearTimeout(attentionTimeout);
            
            document.getElementById('attentionBtn').classList.remove('show');
            document.getElementById('startBtn').textContent = 'Iniciar Jogo';
            document.getElementById('startBtn').disabled = false;

            const totalScore = (sequenceCorrect * 10) + (attentionScore * 5);
            
            document.getElementById('finalSequence').textContent = sequenceCorrect;
            document.getElementById('finalAttention').textContent = attentionScore;
            document.getElementById('finalScore').textContent = totalScore;

            document.getElementById('overlay').classList.add('show');
            document.getElementById('message').classList.add('show');
        }

        function resetGame() {
            closeMessage();
            
            gameState = 'idle';
            timeLeft = GAME_DURATION;
            
            clearInterval(timerInterval);
            clearTimeout(attentionTimeout);
            
            sequenceAttempts = 0;
            sequenceCorrect = 0;
            attentionScore = 0;
            attentionClicks = 0;
            userSequence = [];
            canInputSequence = false;

            document.getElementById('timer').textContent = 'Tempo: ' + GAME_DURATION + 's';
            document.getElementById('attentionScore').textContent = '0';
            document.getElementById('userSequence').innerHTML = '';
            document.getElementById('sequenceDisplay').innerHTML = '';
            document.getElementById('attentionBtn').classList.remove('show', 'correct');
            document.getElementById('startBtn').textContent = 'Iniciar Jogo';
            document.getElementById('startBtn').disabled = false;
        }

        function closeMessage() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('message').classList.remove('show');
        }

        // Event listeners
        document.getElementById('btn-seq-1').addEventListener('click', function() { inputSequence(1); });
        document.getElementById('btn-seq-2').addEventListener('click', function() { inputSequence(2); });
        document.getElementById('btn-seq-3').addEventListener('click', function() { inputSequence(3); });
        
        document.getElementById('attentionBtn').addEventListener('click', clickAttention);
        document.getElementById('startBtn').addEventListener('click', startGame);
        document.getElementById('btn-reset').addEventListener('click', resetGame);
        document.getElementById('btn-play-again').addEventListener('click', resetGame);
        document.getElementById('overlay').addEventListener('click', closeMessage);
});