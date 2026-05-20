document.addEventListener('DOMContentLoaded', function() {
        const PLACEHOLDER = 'img/placeholder.svg';

        function getImgUrl(photoId) {
            return 'img/unsplash_' + photoId + '.jpg';
        }

        function imgOnError(img) {
            if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = PLACEHOLDER;
            }
        }

        function cdnUrl(photoId) {
            return 'https://images.unsplash.com/photo-' + photoId + '?w=200&h=200&fit=crop';
        }

        const imageSets = {
            frutas: [
                getImgUrl('1615485290382-441e4d049cb5'),
                cdnUrl('1594308147232-878815737889'),
                cdnUrl('1601493700631-2b16ec4b6d1e'),
                cdnUrl('1606787366850-dd62e0e6a4f3'),
                getImgUrl('1587049352846-4a222e784d38'),
                cdnUrl('1561136594-7f68413bb03f'),
                cdnUrl('1595436065982-95f4c4e0e939'),
                getImgUrl('1609505848912-b7c3b8b4beda')
            ],
            animais: [
                cdnUrl('1583337130417-3346a1be1dee'),
                getImgUrl('1514888286974-6c03e2ca1dba'),
                getImgUrl('1574158622682-e40e69881006'),
                getImgUrl('1543466835-00a7907e9de1'),
                getImgUrl('1587300003388-59208cc962cb'),
                getImgUrl('1533738363-b7f9aef128ce'),
                getImgUrl('1517849845537-4d257902454a'),
                getImgUrl('1583511655857-d19b40a7a54e')
            ],
            natureza: [
                getImgUrl('1506905925346-21bda4d32df4'),
                getImgUrl('1469474968028-56623f02e42e'),
                getImgUrl('1441974231531-c6227db76b6e'),
                cdnUrl('1507003211169-0a1dd3628f8d'),
                cdnUrl('1518173946687-a4c036bc1d9c'),
                cdnUrl('1470071459604-3b5ec3a551c4'),
                getImgUrl('1501854140801-50d01698950b'),
                getImgUrl('1433086966358-54859d0ed716')
            ],
            objetos: [
                getImgUrl('1526170375885-4d8ecf77b99f'),
                getImgUrl('1585386959984-a4155224a1ad'),
                getImgUrl('1505740420928-5e560c06d30e'),
                getImgUrl('1525966222134-fcfa99b8ae77'),
                cdnUrl('1573939338218-4f26bf5186e8'),
                getImgUrl('1542291026-7eec264c27ff'),
                cdnUrl('1606107557195-0e29a4b5b4ee'),
                getImgUrl('1583394838336-acd977736f90')
            ]
        };

        // Escolher uma categoria aleatória
        const categories = Object.keys(imageSets);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        let images = imageSets[randomCategory];

        images = MenteAtiva.utils.shuffleArray(images).slice(0, 8);

        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let attempts = 0;
        let isLocked = false;
        let currentDifficulty = 'facil';
        var difficultyConfig = {
            facil: { pairs: 3, cols: 3 },
            medio: { pairs: 6, cols: 4 },
            dificil: { pairs: 10, cols: 5 }
        };

        function initGame() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';

            var config = difficultyConfig[currentDifficulty];
            var numPairs = config.pairs;
            var numCols = config.cols;

            // Escolher imagem(ns) conforme a dificuldade
            var imagensSelecionadas;
            if (currentDifficulty === 'dificil') {
                // Pool de todas as categorias para ter variedade
                var todas = [];
                Object.keys(imageSets).forEach(function(c) {
                    todas = todas.concat(imageSets[c]);
                });
                imagensSelecionadas = MenteAtiva.utils.shuffleArray(todas).slice(0, numPairs);
            } else {
                var cat = categories[Math.floor(Math.random() * categories.length)];
                imagensSelecionadas = MenteAtiva.utils.shuffleArray(imageSets[cat]).slice(0, numPairs);
            }

            var cardImages = imagensSelecionadas.concat(imagensSelecionadas);
            cards = MenteAtiva.utils.shuffleArray(cardImages);

            flippedCards = [];
            matchedPairs = 0;
            attempts = 0;
            isLocked = false;

            document.getElementById('pairs').textContent = '0';
            document.getElementById('attempts').textContent = '0';

            board.style.gridTemplateColumns = 'repeat(' + numCols + ', 1fr)';

            cards.forEach(function(imgUrl, index) {
                var card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.image = imgUrl;
                var img = document.createElement('img');
                img.src = imgUrl;
                img.alt = 'Carta';
                img.loading = 'lazy';
                img.onerror = function() { imgOnError(this); };
                card.innerHTML = '<div class="card-image"></div>';
                card.querySelector('.card-image').appendChild(img);
                card.addEventListener('click', function() { flipCard(card); });
                board.appendChild(card);
            });
        }

        function flipCard(card) {
            if (isLocked) return;
            if (card.classList.contains('flipped')) return;
            if (card.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                attempts++;
                document.getElementById('attempts').textContent = attempts;
                checkMatch();
            }
        }

        function checkMatch() {
            isLocked = true;

            const [card1, card2] = flippedCards;
            const img1 = card1.dataset.image;
            const img2 = card2.dataset.image;

            if (img1 === img2) {
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    document.getElementById('pairs').textContent = matchedPairs;

                    flippedCards = [];
                    isLocked = false;

                    if (matchedPairs === difficultyConfig[currentDifficulty].pairs) {
                        setTimeout(() => {
                            showWinMessage();
                        }, 500);
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
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
            feedbackBtn.textContent = 'Jogar Novamente';
            feedbackBtn.onclick = () => {
                hideFeedback();
                initGame();
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
                    initGame();
                });
            });
        }

        // Event listeners
        document.getElementById('btn-restart').addEventListener('click', initGame);
        document.getElementById('btn-como-jogar').addEventListener('click', function() {
            document.getElementById('comoJogarModal').style.display = 'block';
            document.getElementById('overlay').classList.add('show');
        });
        document.getElementById('btn-back').addEventListener('click', function() { window.location.href = 'jogos-individuais.html'; });
        document.getElementById('feedbackBtn').addEventListener('click', hideFeedback);
        document.getElementById('overlay').addEventListener('click', hideFeedback);
        document.getElementById('btn-fechar-modal').addEventListener('click', function() {
            document.getElementById('comoJogarModal').style.display = 'none';
            document.getElementById('overlay').classList.remove('show');
        });

        setupDificuldadeButtons();
        initGame();
    });