document.addEventListener('DOMContentLoaded', function() {
        const words = [
            "Casa",
            "Árvore",
            "Porta",
            "Janela",
            "Cadeira",
            "Mesa",
            "Cama",
            "Sol",
            "Lua",
            "Água"
        ];

        let currentWords = [];
        let currentIndex = 0;
        let gameStarted = false;

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function initGame() {
            currentWords = shuffleArray(words).slice(0, 5);
            currentIndex = 0;
            gameStarted = false;
            
            document.getElementById('currentWord').textContent = '1/5';
            document.getElementById('wordText').textContent = 'Clique em Começar';
            document.getElementById('question').textContent = 'Prepare-se para lembrar!';
            
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('finishBtn').style.display = 'none';
        }

        function startGame() {
            gameStarted = true;
            currentIndex = 0;
            
            document.getElementById('wordText').textContent = currentWords[currentIndex];
            document.getElementById('question').textContent = 'Atenção! Esta é a palavra ' + (currentIndex + 1);
            
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('nextBtn').style.display = 'inline-block';
        }

        function nextWord() {
            currentIndex++;
            
            if (currentIndex >= currentWords.length) {
                showResult();
                return;
            }
            
            document.getElementById('currentWord').textContent = (currentIndex + 1) + '/5';
            document.getElementById('wordText').textContent = currentWords[currentIndex];
            document.getElementById('question').textContent = 'Atenção! Esta é a palavra ' + (currentIndex + 1);
            
            if (currentIndex === currentWords.length - 1) {
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('finishBtn').style.display = 'inline-block';
            }
        }

        function showResult() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackTitle = document.getElementById('feedbackTitle');
            const feedbackText = document.getElementById('feedbackText');
            
            feedbackIcon.className = 'feedback-icon success';
            feedbackIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            
            feedbackTitle.textContent = 'Muito Bem!';
            feedbackText.textContent = `Você viu ${currentWords.length} palavras! Tente lembrar delas.`;
            
            overlay.classList.add('show');
            feedback.classList.add('show');
        }

        function handleFeedback() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            overlay.classList.remove('show');
            feedback.classList.remove('show');
            initGame();
        }

        // Event listeners
        document.getElementById('startBtn').addEventListener('click', startGame);
        document.getElementById('nextBtn').addEventListener('click', nextWord);
        document.getElementById('finishBtn').addEventListener('click', showResult);
        document.getElementById('feedbackBtn').addEventListener('click', handleFeedback);
        document.getElementById('overlay').addEventListener('click', handleFeedback);

        initGame();
});