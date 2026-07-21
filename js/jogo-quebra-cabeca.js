document.addEventListener('DOMContentLoaded', function() {
        const PLACEHOLDER = 'img/placeholder.svg';
        const images = [
            { src: 'img/jogos/quebra-cabeca/jardim-florido.png', nome: 'Jardim florido' },
            { src: 'img/jogos/quebra-cabeca/casa-de-campo.png', nome: 'Casa de campo' },
            { src: 'img/jogos/quebra-cabeca/praia-tranquila.png', nome: 'Praia tranquila' },
            { src: 'img/jogos/quebra-cabeca/praca-arborizada.png', nome: 'Praça arborizada' },
            { src: 'img/jogos/quebra-cabeca/mesa-de-cafe.png', nome: 'Mesa de café' },
            { src: 'img/jogos/quebra-cabeca/cesta-de-frutas.png', nome: 'Cesta de frutas' }
        ];

        function preloadImage(url) {
            return new Promise(function(resolve) {
                var image = new Image();
                image.onload = function() { resolve(url); };
                image.onerror = function() { resolve(PLACEHOLDER); };
                image.src = url;
            });
        }
        
        let currentImage = images[Math.floor(Math.random() * images.length)];
        let currentImageUrl = currentImage.src;
        
        let pieces = [];
        let selectedPiece = null;
        let isProcessing = false;
        let currentDifficulty = 'facil';
        var difficultyConfig = {
            facil: { size: 3 },
            medio: { size: 4 },
            dificil: { size: 5 }
        };
        let gridSize = 3;
        let totalPieces = 9;

        async function initGame() {
            closeMessage();
            selectedPiece = null;
            isProcessing = false;

            gridSize = difficultyConfig[currentDifficulty].size;
            totalPieces = gridSize * gridSize;

            currentImage = images[Math.floor(Math.random() * images.length)];
            currentImageUrl = await preloadImage(currentImage.src);

            const previewImg = document.getElementById('previewImage');
            if (previewImg) {
                previewImg.src = currentImageUrl;
                previewImg.alt = 'Imagem original: ' + currentImage.nome;
                previewImg.onerror = function() { this.src = PLACEHOLDER; };
            }

            pieces = [];
            for (let i = 0; i < totalPieces; i++) {
                pieces.push(i);
            }

            do {
                pieces = MenteAtiva.utils.shuffleArray(pieces);
            } while (isSolved());

            renderPuzzle();
        }

        function isSolved() {
            for (let i = 0; i < totalPieces; i++) {
                if (pieces[i] !== i) return false;
            }
            return true;
        }

        function renderPuzzle() {
            const container = document.getElementById('puzzleContainer');
            container.innerHTML = '';
            container.style.gridTemplateColumns = 'repeat(' + gridSize + ', 1fr)';
            container.style.gridTemplateRows = 'repeat(' + gridSize + ', 1fr)';

            pieces.forEach(function(pieceIndex, positionIndex) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.dataset.position = positionIndex;
                piece.dataset.piece = pieceIndex;
                piece.setAttribute('role', 'button');
                piece.setAttribute('tabindex', '0');
                piece.setAttribute('aria-label', 'Peça ' + (positionIndex + 1) + ' de ' + totalPieces);
                piece.setAttribute('aria-pressed', String(selectedPiece === positionIndex));

                const row = Math.floor(pieceIndex / gridSize);
                const col = pieceIndex % gridSize;
                piece.style.backgroundImage = 'url(' + currentImageUrl + ')';
                piece.style.backgroundSize = (gridSize * 100) + '%';
                var bgX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
                var bgY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;
                piece.style.backgroundPosition = bgX + '% ' + bgY + '%';

                piece.addEventListener('click', function() { handlePieceClick(positionIndex); });
                piece.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handlePieceClick(positionIndex);
                    }
                });

                container.appendChild(piece);
            });
        }

        function handlePieceClick(positionIndex) {
            if (isProcessing) return;

            const clickedPiece = document.querySelector('.puzzle-piece[data-position="' + positionIndex + '"]');

            if (selectedPiece === null) {
                selectedPiece = positionIndex;
                clickedPiece.classList.add('selected');
                clickedPiece.setAttribute('aria-pressed', 'true');
                document.getElementById('puzzleSelectionStatus').textContent = 'Primeira peça escolhida. Agora escolha a segunda peça.';
            } else if (selectedPiece === positionIndex) {
                clickedPiece.classList.remove('selected');
                selectedPiece = null;
                document.getElementById('puzzleSelectionStatus').textContent = 'Seleção cancelada. Escolha a primeira peça.';
            } else {
                isProcessing = true;
                
                const firstPiece = document.querySelector('.puzzle-piece[data-position="' + selectedPiece + '"]');
                firstPiece.classList.remove('selected');

                swapPieces(selectedPiece, positionIndex);

                setTimeout(function() {
                    selectedPiece = null;
                    isProcessing = false;
                    document.getElementById('puzzleSelectionStatus').textContent = 'Peças trocadas. Escolha a primeira peça.';

                    if (isSolved()) {
                        showWinMessage();
                    }
                }, 300);
            }
        }

        function swapPieces(pos1, pos2) {
            const temp = pieces[pos1];
            pieces[pos1] = pieces[pos2];
            pieces[pos2] = temp;

            renderPuzzle();
        }

        function showWinMessage() {
            document.getElementById('overlay').classList.add('show');
            document.getElementById('message').classList.add('show');
        }

        function closeMessage() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('message').classList.remove('show');
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
        document.getElementById('btn-restart').addEventListener('click', function() {
            exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
                initGame();
            });
        });
        document.getElementById('btn-back').addEventListener('click', function() { window.location.href = 'jogos-individuais.html'; });
        document.getElementById('btn-play-again').addEventListener('click', function() {
            exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
                initGame();
            });
        });
        document.getElementById('overlay').addEventListener('click', closeMessage);

        setupDificuldadeButtons();
        initGame();
});
