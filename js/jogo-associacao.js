document.addEventListener('DOMContentLoaded', function() {
        const wordPairs = [
            { left: 'Sol', right: 'Calor' },
            { left: 'Noite', right: 'Lua' },
            { left: 'Água', right: 'Sede' },
            { left: 'Pão', right: 'Fome' },
            { left: 'Cama', right: 'Sono' },
            { left: 'Chuva', right: 'Guarda-chuva' },
            { left: 'Dor', right: 'Médico' },
            { left: 'Escola', right: 'Professora' },
            { left: 'Natal', right: 'Presente' },
            { left: 'Fogo', right: 'Queimado' },
            { left: 'Cão', right: 'Latido' },
            { left: 'Gato', right: 'Miado' },
            { left: 'Carro', right: 'Rodas' },
            { left: 'Avião', right: 'Asas' },
            { left: 'Banana', right: 'Casca' },
            { left: 'Laranja', right: 'Suco' },
            { left: 'Café', right: 'Xícara' },
            { left: 'Bola', right: 'Quicar' },
            { left: 'Martelo', right: 'Prego' },
            { left: 'Pincel', right: 'Tinta' },
            { left: 'Livro', right: 'Leitura' },
            { left: 'Violão', right: 'Corda' },
            { left: 'Bicicleta', right: 'Pedal' },
            { left: 'Relógio', right: 'Hora' },
            { left: 'Copo', right: 'Bebida' },
            { left: 'Sapato', right: 'Pé' },
            { left: 'Chave', right: 'Fechadura' },
            { left: 'Porta', right: 'Maçaneta' },
            { left: 'Janela', right: 'Vidro' },
            { left: 'Travesseiro', right: 'Cabeça' },
            { left: 'Chinelo', right: 'Sandália' },
            { left: 'Talher', right: 'Garfo' },
            { left: 'Prato', right: 'Comida' },
            { left: 'Cadeira', right: 'Sentar' },
            { left: 'Mesa', right: 'Jantar' },
            { left: 'Telefone', right: 'Ligação' },
            { left: 'Televisão', right: 'Programa' },
            { left: 'Óculos', right: 'Visão' },
            { left: 'Escova', right: 'Dentes' },
            { left: 'Sabonete', right: 'Banho' },
            { left: 'Toalha', right: 'Secar' },
            { left: 'Vela', right: 'Luz' },
            { left: 'Bússola', right: 'Norte' }
        ];

        function playCorrectSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } catch (e) {}
        }

        let currentPairs = [];
        let currentRightOrder = [];
        let selectedLeftCard = null;
        let selectedLeftWord = null;
        let matchedPairs = 0;
        let correctCount = 0;
        let isLocked = false;
        let currentDifficulty = 'facil';
        var difficultyConfig = {
            facil: { pairs: 3 },
            medio: { pairs: 6 },
            dificil: { pairs: 10 }
        };

        function initGame(reuseRound) {
            matchedPairs = 0;
            correctCount = 0;
            isLocked = false;
            selectedLeftCard = null;
            selectedLeftWord = null;
            
            var numPairs = difficultyConfig[currentDifficulty].pairs;
            document.getElementById('correct').textContent = '0';
            document.getElementById('pairs').textContent = '0/' + numPairs;
            
            const leftContainer = document.getElementById('leftWords');
            const rightContainer = document.getElementById('rightWords');
            
            leftContainer.innerHTML = '';
            rightContainer.innerHTML = '';
            
            if (!reuseRound || currentPairs.length !== numPairs) {
                currentPairs = MenteAtiva.utils.shuffleArray(wordPairs).slice(0, numPairs);
                currentRightOrder = MenteAtiva.utils.shuffleArray(currentPairs.slice());
            }
            
            currentPairs.forEach((pair, index) => {
                const card = document.createElement('div');
                card.className = 'word-card';
                card.textContent = pair.left;
                card.dataset.word = pair.left;
                card.dataset.pairIndex = index;
                card.addEventListener('click', () => selectLeftCard(card));
                leftContainer.appendChild(card);
            });
            
            currentRightOrder.forEach((pair, index) => {
                const card = document.createElement('div');
                card.className = 'word-card';
                card.textContent = pair.right;
                card.dataset.word = pair.right;
                card.dataset.pairIndex = currentPairs.findIndex(p => p.right === pair.right);
                card.addEventListener('click', () => selectRightCard(card));
                rightContainer.appendChild(card);
            });
        }

        function selectLeftCard(card) {
            if (isLocked) return;
            if (card.classList.contains('matched')) return;
            
            document.querySelectorAll('#leftWords .word-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLeftCard = card;
            selectedLeftWord = card.dataset.word;
        }

        function selectRightCard(card) {
            if (isLocked) return;
            if (card.classList.contains('matched')) return;
            if (!selectedLeftCard) return;
            
            isLocked = true;
            
            const leftPairIndex = parseInt(selectedLeftCard.dataset.pairIndex);
            const rightPairIndex = parseInt(card.dataset.pairIndex);
            
            if (leftPairIndex === rightPairIndex) {
                correctCount++;
                matchedPairs++;
                document.getElementById('correct').textContent = correctCount;
                document.getElementById('pairs').textContent = matchedPairs + '/' + difficultyConfig[currentDifficulty].pairs;
                
                selectedLeftCard.classList.remove('selected');
                selectedLeftCard.classList.add('matched');
                card.classList.add('matched');
                
                playCorrectSound();
                
                selectedLeftCard = null;
                selectedLeftWord = null;
                isLocked = false;
                
                if (matchedPairs === difficultyConfig[currentDifficulty].pairs) {
                    setTimeout(() => {
                        showWinMessage();
                    }, 500);
                }
            } else {
                card.classList.add('wrong');
                
                setTimeout(() => {
                    card.classList.remove('wrong');
                    if (selectedLeftCard) {
                        selectedLeftCard.classList.remove('selected');
                        selectedLeftCard = null;
                        selectedLeftWord = null;
                    }
                    isLocked = false;
                }, 800);
            }
        }

        function showWinMessage() {
            document.getElementById('overlay').classList.add('show');
            document.getElementById('feedback').classList.add('show');
        }

        function restartGame(reuseRound) {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('feedback').classList.remove('show');
            initGame(reuseRound);
        }

        function setupDificuldadeButtons() {
            var buttons = document.querySelectorAll('.dif-btn');
            buttons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    buttons.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    if (this.classList.contains('facil')) currentDifficulty = 'facil';
                    else if (this.classList.contains('medio')) currentDifficulty = 'medio';
                    else if (this.classList.contains('dificil')) currentDifficulty = 'dificil';
                    initGame(false);
                });
            });
        }

        // Event listeners
        document.getElementById('restartBtn').addEventListener('click', function() {
            if (matchedPairs > 0 || selectedLeftCard) {
                exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() { restartGame(true); });
            } else restartGame(true);
        });
        document.getElementById('feedbackBtn').addEventListener('click', function() { restartGame(false); });
        document.getElementById('overlay').addEventListener('click', function() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('feedback').classList.remove('show');
        });

        setupDificuldadeButtons();
        initGame(false);
});
