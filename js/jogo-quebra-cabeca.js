document.addEventListener('DOMContentLoaded', function() {
        const PLACEHOLDER = 'img/placeholder.svg';
        const images = [
            'img/unsplash_1587300003388-59208cc962cb.jpg',
            'img/unsplash_1506744038136-46273834b3fb.jpg',
            'img/unsplash_1519681393784-d120267933ba.jpg',
            'img/unsplash_1501785888041-af3ef285b470.jpg',
            'img/unsplash_1470071459604-3b5ec3a7fe05.jpg',
            'img/unsplash_1465146344425-f00d5f5c8f07.jpg',
            'img/unsplash_1501854140801-50d01698950b.jpg',
            'img/unsplash_1441974231531-c6227db76b6e.jpg',
            'img/unsplash_1518717758536-85ae29035b6d.jpg',
            'img/unsplash_1526336024174-e58f5cdd8e13.jpg',
            'img/unsplash_1543852786-1cf6624b9987.jpg',
            'img/unsplash_1552053831-71594a27632d.jpg',
            'img/unsplash_1533738363-b7f9aef128ce.jpg',
            'img/unsplash_1495360010541-f48722b34f7d.jpg',
            'img/unsplash_1517849845537-4d257902454a.jpg',
            'img/unsplash_1513475382585-d06e58bcb0e0.jpg',
            'img/unsplash_1514888286974-6c03e2ca1dba.jpg',
            'img/unsplash_1469474968028-56623f02e42e.jpg',
            'img/unsplash_1433086966358-54859d0ed716.jpg'
        ];

        const easyImages = [
            'img/unsplash_1543852786-1cf6624b9987.jpg',
            'img/unsplash_1552053831-71594a27632d.jpg',
            'img/unsplash_1495360010541-f48722b34f7d.jpg',
            'img/unsplash_1517849845537-4d257902454a.jpg',
            'img/unsplash_1533738363-b7f9aef128ce.jpg',
            'img/unsplash_1514888286974-6c03e2ca1dba.jpg'
        ];

        function preloadImage(url) {
            return new Promise(function(resolve) {
                var image = new Image();
                image.onload = function() { resolve(url); };
                image.onerror = function() { resolve(PLACEHOLDER); };
                image.src = url;
            });
        }
        
        let currentImageUrl = images[Math.floor(Math.random() * images.length)];
        
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

            var pool = currentDifficulty === 'facil' ? easyImages : images;
            currentImageUrl = await preloadImage(pool[Math.floor(Math.random() * pool.length)]);

            const previewImg = document.getElementById('previewImage');
            if (previewImg) {
                previewImg.src = currentImageUrl;
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

                const row = Math.floor(pieceIndex / gridSize);
                const col = pieceIndex % gridSize;
                piece.style.backgroundImage = 'url(' + currentImageUrl + ')';
                piece.style.backgroundSize = (gridSize * 100) + '%';
                var bgX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
                var bgY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;
                piece.style.backgroundPosition = bgX + '% ' + bgY + '%';

                piece.addEventListener('click', function() { handlePieceClick(positionIndex); });

                container.appendChild(piece);
            });
        }

        function handlePieceClick(positionIndex) {
            if (isProcessing) return;

            const clickedPiece = document.querySelector('.puzzle-piece[data-position="' + positionIndex + '"]');

            if (selectedPiece === null) {
                selectedPiece = positionIndex;
                clickedPiece.classList.add('selected');
            } else if (selectedPiece === positionIndex) {
                clickedPiece.classList.remove('selected');
                selectedPiece = null;
            } else {
                isProcessing = true;
                
                const firstPiece = document.querySelector('.puzzle-piece[data-position="' + selectedPiece + '"]');
                firstPiece.classList.remove('selected');

                swapPieces(selectedPiece, positionIndex);

                setTimeout(function() {
                    selectedPiece = null;
                    isProcessing = false;

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
