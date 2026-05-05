document.addEventListener('DOMContentLoaded', function() {
        const images = [
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1519052537078-e6302da7c5b?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1514888286974-6d03bde4ba49?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1548245644-3c2cc7743fca?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1564349683136-afaaaa4e8bde?w=300&h=300&fit=crop'
        ];
        
        let currentImageUrl = images[Math.floor(Math.random() * images.length)];
        const gridSize = 3;
        const totalPieces = gridSize * gridSize;
        
        let pieces = [];
        let selectedPiece = null;
        let isProcessing = false;

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function initGame() {
            closeMessage();
            selectedPiece = null;
            isProcessing = false;

            currentImageUrl = images[Math.floor(Math.random() * images.length)];

            const previewImg = document.getElementById('previewImage');
            if (previewImg) {
                previewImg.src = currentImageUrl;
            }

            pieces = [];
            for (let i = 0; i < totalPieces; i++) {
                pieces.push(i);
            }

            do {
                pieces = shuffleArray(pieces);
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

            pieces.forEach((pieceIndex, positionIndex) => {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.dataset.position = positionIndex;
                piece.dataset.piece = pieceIndex;

                const row = Math.floor(pieceIndex / gridSize);
                const col = pieceIndex % gridSize;
                piece.style.backgroundImage = `url(${currentImageUrl})`;
                piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

                piece.addEventListener('click', () => handlePieceClick(positionIndex));

                container.appendChild(piece);
            });
        }

        function handlePieceClick(positionIndex) {
            if (isProcessing) return;

            const clickedPiece = document.querySelector(`.puzzle-piece[data-position="${positionIndex}"]`);

            if (selectedPiece === null) {
                selectedPiece = positionIndex;
                clickedPiece.classList.add('selected');
            } else if (selectedPiece === positionIndex) {
                clickedPiece.classList.remove('selected');
                selectedPiece = null;
            } else {
                isProcessing = true;
                
                const firstPiece = document.querySelector(`.puzzle-piece[data-position="${selectedPiece}"]`);
                firstPiece.classList.remove('selected');

                swapPieces(selectedPiece, positionIndex);

                setTimeout(() => {
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

        // Event listeners
        document.getElementById('btn-restart').addEventListener('click', initGame);
        document.getElementById('btn-back').addEventListener('click', function() { window.location.href = 'grupo-moderado.html'; });
        document.getElementById('btn-play-again').addEventListener('click', initGame);
        document.getElementById('overlay').addEventListener('click', closeMessage);

        initGame();
});