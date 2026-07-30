document.addEventListener('DOMContentLoaded', function() {
        const PLACEHOLDER = 'img/placeholder.svg';

        function imgOnError(img) {
            if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = PLACEHOLDER;
            }
        }

        const imageSets = [
            { src: 'img/jogos/memoria/maca.png', nome: 'Maçã' },
            { src: 'img/jogos/memoria/banana.png', nome: 'Banana' },
            { src: 'img/jogos/memoria/laranja.png', nome: 'Laranja' },
            { src: 'img/jogos/memoria/flor.png', nome: 'Flor' },
            { src: 'img/jogos/memoria/cachorro.png', nome: 'Cachorro' },
            { src: 'img/jogos/memoria/gato.png', nome: 'Gato' },
            { src: 'img/jogos/memoria/passaro.png', nome: 'Pássaro' },
            { src: 'img/jogos/memoria/xicara.png', nome: 'Xícara' },
            { src: 'img/jogos/memoria/chave.png', nome: 'Chave' },
            { src: 'img/jogos/memoria/relogio.png', nome: 'Relógio' },
            { src: 'img/jogos/memoria/telefone.png', nome: 'Telefone' },
            { src: 'img/jogos/memoria/guarda-chuva.png', nome: 'Guarda-chuva' }
        ];

        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let attempts = 0;
        let isLocked = false;
        let currentDifficulty = 'facil';
        let gameVersion = 0;
        let winMessageTimer = null;
        var difficultyConfig = {
            facil: { pairs: 3, cols: 3 },
            medio: { pairs: 6, cols: 4 },
            dificil: { pairs: 10, cols: 5 }
        };

        function initGame(reuseRound) {
            gameVersion++;
            if (winMessageTimer !== null) {
                clearTimeout(winMessageTimer);
                winMessageTimer = null;
            }
            hideFeedback();
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';

            var config = difficultyConfig[currentDifficulty];
            var numPairs = config.pairs;
            var numCols = config.cols;

            if (!reuseRound || cards.length !== numPairs * 2) {
                var imagensSelecionadas = MenteAtiva.utils.shuffleArray(imageSets).slice(0, numPairs);
                var cardImages = imagensSelecionadas.concat(imagensSelecionadas);
                cards = MenteAtiva.utils.shuffleArray(cardImages);
            }

            flippedCards = [];
            matchedPairs = 0;
            attempts = 0;
            isLocked = false;

            document.getElementById('pairs').textContent = '0';
            document.getElementById('attempts').textContent = '0';

            board.style.gridTemplateColumns = 'repeat(' + numCols + ', 1fr)';

            cards.forEach(function(item, index) {
                var card = document.createElement('button');
                card.type = 'button';
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.image = item.src;
                card.setAttribute('aria-label', 'Carta ' + (index + 1) + ' fechada');
                var img = document.createElement('img');
                img.alt = item.nome;
                img.loading = 'lazy';
                img.draggable = false;
                img.onerror = function() { imgOnError(this); };
                img.src = item.src;
                card.innerHTML = '<div class="card-image"></div>';
                card.querySelector('.card-image').appendChild(img);
                bindCardInteraction(card);
                board.appendChild(card);
            });
        }

        function bindCardInteraction(card) {
            var gesture = null;
            var suppressClick = false;

            card.addEventListener('pointerdown', function(event) {
                gesture = { x: event.clientX, y: event.clientY, startedAt: Date.now(), moved: false };
                suppressClick = false;
            });
            card.addEventListener('pointermove', function(event) {
                if (!gesture) return;
                if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8) {
                    gesture.moved = true;
                }
            });
            card.addEventListener('pointerup', function() {
                if (!gesture) return;
                suppressClick = gesture.moved || Date.now() - gesture.startedAt > 550;
                gesture = null;
            });
            card.addEventListener('pointercancel', function() {
                suppressClick = true;
                gesture = null;
            });
            card.addEventListener('dragstart', function(event) {
                suppressClick = true;
                event.preventDefault();
            });
            card.addEventListener('contextmenu', function(event) { event.preventDefault(); });
            card.addEventListener('click', function(event) {
                if (suppressClick && event.detail !== 0) {
                    suppressClick = false;
                    event.preventDefault();
                    return;
                }
                suppressClick = false;
                flipCard(card);
            });
        }

        function flipCard(card) {
            if (isLocked) return;
            if (card.classList.contains('flipped')) return;
            if (card.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;

            card.classList.add('flipped');
            card.setAttribute('aria-label', 'Carta ' + (Number(card.dataset.index) + 1) + ': ' + card.querySelector('img').alt);
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                attempts++;
                document.getElementById('attempts').textContent = attempts;
                checkMatch();
            }
        }

        function checkMatch() {
            isLocked = true;
            const version = gameVersion;

            const [card1, card2] = flippedCards;
            const img1 = card1.dataset.image;
            const img2 = card2.dataset.image;

            if (img1 === img2) {
                setTimeout(() => {
                    if (version !== gameVersion) return;
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    card1.disabled = true;
                    card2.disabled = true;
                    matchedPairs++;
                    document.getElementById('pairs').textContent = matchedPairs;

                    flippedCards = [];
                    isLocked = false;

                    if (matchedPairs === difficultyConfig[currentDifficulty].pairs) {
                        winMessageTimer = setTimeout(() => {
                            winMessageTimer = null;
                            if (version !== gameVersion) return;
                            showWinMessage();
                        }, 500);
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    if (version !== gameVersion) return;
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    card1.setAttribute('aria-label', 'Carta ' + (Number(card1.dataset.index) + 1) + ' fechada');
                    card2.setAttribute('aria-label', 'Carta ' + (Number(card2.dataset.index) + 1) + ' fechada');
                    flippedCards = [];
                    isLocked = false;
                }, 1000);
            }
        }

        function showWinMessage() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackTitle = document.getElementById('feedbackTitle');
            const feedbackText = document.getElementById('feedbackText');
            const feedbackBtn = document.getElementById('feedbackBtn');

            feedbackIcon.className = 'feedback-icon success';
            feedbackIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';

            feedbackTitle.textContent = 'Parabéns!';
            feedbackText.textContent = `Você encontrou todos os pares em ${attempts} tentativas!`;

            feedbackBtn.textContent = 'Jogar novamente';
            feedbackBtn.onclick = () => {
                hideFeedback();
                initGame(false);
            };

            overlay.classList.add('show');
            feedback.classList.add('show');
        }

        function hideFeedback() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('feedback').classList.remove('show');
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
        document.getElementById('btn-restart').addEventListener('click', function() {
            var restart = function() { initGame(true); };
            if (attempts > 0 || flippedCards.length > 0 || matchedPairs > 0) {
                exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', restart);
            } else {
                restart();
            }
        });

        setupDificuldadeButtons();
        initGame(false);
    });
