document.addEventListener('DOMContentLoaded', function() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const canvasArea = document.getElementById('canvasArea');
    const piecesContainer = document.getElementById('piecesContainer');
    const piecesTray = document.getElementById('piecesTray');
    
    // Configuração das figuras (tudo baseado em 400x400)
    const figures = {
        square: {
            name: 'Quadrado',
            outline: 'M 100 100 L 300 100 L 300 300 L 100 300 Z',
            pieces: [
                { id: 'big1', type: 'big-triangle', color: '#3B82F6' },
                { id: 'big2', type: 'big-triangle', color: '#3B82F6' },
                { id: 'med', type: 'medium-triangle', color: '#10B981' },
                { id: 'small1', type: 'small-triangle', color: '#F59E0B' },
                { id: 'small2', type: 'small-triangle', color: '#F59E0B' },
                { id: 'square', type: 'square', color: '#8B5CF6' },
                { id: 'parallelogram', type: 'parallelogram', color: '#EC4899' }
            ],
            zones: [
                { id: 'big1', x: 100, y: 100, w: 200, h: 200 },
                { id: 'big2', x: 200, y: 200, w: 200, h: 200 },
                { id: 'med', x: 100, y: 200, w: 100, h: 100 },
                { id: 'small1', x: 100, y: 300, w: 75, h: 75 },
                { id: 'small2', x: 175, y: 300, w: 75, h: 75 },
                { id: 'square', x: 150, y: 250, w: 100, h: 100 },
                { id: 'parallelogram', x: 200, y: 325, w: 150, h: 75 }
            ]
        }
    };

    let currentFigure = 'square';
    let pieces = [];
    let placedPieces = {};
    let dragging = null;
    let dragPiece = null;
    let offsetX = 0;
    let offsetY = 0;
    let piecesPlaced = 0;

    function initGame() {
        piecesPlaced = 0;
        placedPieces = {};
        pieces = JSON.parse(JSON.stringify(figures[currentFigure].pieces));
        updateFigureOutline();
        clearCanvasPieces();
        renderPiecesTray();
        updateInfo();
        closeMessage();
    }

    function updateFigureOutline() {
        const svg = document.getElementById('figureOutline');
        svg.innerHTML = '';
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', figures[currentFigure].outline);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#1E293B');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-dasharray', '10,5');
        svg.appendChild(path);
    }

    function clearCanvasPieces() {
        piecesContainer.innerHTML = '';
    }

    function getPiecePath(type, size) {
        const s = size / 100;
        switch (type) {
            case 'big-triangle': return `M 0 ${100*s} L ${100*s} ${100*s} L 0 0 Z`;
            case 'medium-triangle': return `M 0 ${66.7*s} L ${66.7*s} ${66.7*s} L 0 0 Z`;
            case 'small-triangle': return `M 0 ${50*s} L ${50*s} ${50*s} L 0 0 Z`;
            case 'square': return `M 0 0 L ${50*s} 0 L ${50*s} ${50*s} L 0 ${50*s} Z`;
            case 'parallelogram': return `M ${16.7*s} ${50*s} L ${66.7*s} ${50*s} L ${50*s} 0 L 0 0 Z`;
        }
        return '';
    }

    function createPieceSVG(pieceData, size) {
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.style.overflow = 'visible';

        const pathData = getPiecePath(pieceData.type, size);
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', pieceData.color);
        path.setAttribute('fill-opacity', '0.7');
        path.setAttribute('stroke', pieceData.color);
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        return svg;
    }

    function renderPiecesTray() {
        piecesTray.innerHTML = '';
        pieces.forEach(piece => {
            if (placedPieces[piece.id]) {
                // Espaço vazio
                const placeholder = document.createElement('div');
                placeholder.style.width = '80px';
                placeholder.style.height = '80px';
                piecesTray.appendChild(placeholder);
                return;
            }

            const size = 80;
            const svg = createPieceSVG(piece, size);
            svg.classList.add('tray-piece');
            svg.dataset.pieceId = piece.id;
            svg.style.cursor = 'grab';

            svg.addEventListener('mousedown', (e) => startDragFromTray(e, piece.id));
            svg.addEventListener('touchstart', (e) => startDragFromTrayTouch(e, piece.id));

            piecesTray.appendChild(svg);
        });
    }

    function startDragFromTray(e, pieceId) {
        e.preventDefault();
        const pieceData = pieces.find(p => p.id === pieceId);
        if (!pieceData || placedPieces[pieceId]) return;

        const rect = canvasArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createPieceOnCanvas(pieceData, x, y);

        dragging = pieceId;
        dragPiece = document.querySelector(`.tangram-piece[data-piece-id="${pieceId}"]`);
        if (dragPiece) {
            offsetX = 30;
            offsetY = 30;
            dragPiece.classList.add('dragging');
        }

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    function startDragFromTrayTouch(e, pieceId) {
        e.preventDefault();
        const pieceData = pieces.find(p => p.id === pieceId);
        if (!pieceData || placedPieces[pieceId]) return;

        const touch = e.touches[0];
        const rect = canvasArea.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        createPieceOnCanvas(pieceData, x, y);

        dragging = pieceId;
        dragPiece = document.querySelector(`.tangram-piece[data-piece-id="${pieceId}"]`);
        if (dragPiece) {
            offsetX = 30;
            offsetY = 30;
            dragPiece.classList.add('dragging');
        }

        document.addEventListener('touchmove', onDragTouch);
        document.addEventListener('touchend', stopDragTouch);
    }

    function createPieceOnCanvas(pieceData, x, y) {
        const rect = canvasArea.getBoundingClientRect();
        const size = rect.width * 0.5;

        const svg = createPieceSVG(pieceData, size);
        svg.classList.add('tangram-piece');
        svg.dataset.pieceId = pieceData.id;
        svg.style.position = 'absolute';
        svg.style.left = (x - size/2) + 'px';
        svg.style.top = (y - size/2) + 'px';
        svg.style.cursor = 'grabbing';

        piecesContainer.appendChild(svg);
    }

    function onDrag(e) {
        if (!dragging || !dragPiece) return;
        const rect = canvasArea.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        dragPiece.style.left = x + 'px';
        dragPiece.style.top = y + 'px';
    }

    function onDragTouch(e) {
        if (!dragging || !dragPiece) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvasArea.getBoundingClientRect();
        const x = touch.clientX - rect.left - offsetX;
        const y = touch.clientY - rect.top - offsetY;
        dragPiece.style.left = x + 'px';
        dragPiece.style.top = y + 'px';
    }

    function stopDrag() {
        if (!dragging) return;
        checkPlacement(dragging);
        dragging = null;
        if (dragPiece) {
            dragPiece.classList.remove('dragging');
            dragPiece = null;
        }
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    }

    function stopDragTouch() {
        if (!dragging) return;
        checkPlacement(dragging);
        dragging = null;
        if (dragPiece) {
            dragPiece.classList.remove('dragging');
            dragPiece = null;
        }
        document.removeEventListener('touchmove', onDragTouch);
        document.removeEventListener('touchend', stopDragTouch);
    }

    function checkPlacement(pieceId) {
        const zone = figures[currentFigure].zones.find(z => z.id === pieceId);
        if (!zone) return;

        const pieceEl = document.querySelector(`.tangram-piece[data-piece-id="${pieceId}"]`);
        if (!pieceEl) return;

        const rect = canvasArea.getBoundingClientRect();
        
        // Centro da peça
        const pieceCenterX = parseFloat(pieceEl.style.left) + parseFloat(pieceEl.getAttribute('width')) / 2;
        const pieceCenterY = parseFloat(pieceEl.style.top) + parseFloat(pieceEl.getAttribute('height')) / 2;

        // Centro da zona (convertido para pixels)
        const zoneCenterX = zone.x * rect.width / 400;
        const zoneCenterY = zone.y * rect.height / 400;

        const distance = Math.sqrt(Math.pow(pieceCenterX - zoneCenterX, 2) + Math.pow(pieceCenterY - zoneCenterY, 2));

        if (distance < 60) {
            // Snap para zona correta
            const zoneW = zone.w * rect.width / 400;
            const zoneH = zone.h * rect.height / 400;
            pieceEl.style.left = (zoneCenterX - zoneW/2) + 'px';
            pieceEl.style.top = (zoneCenterY - zoneH/2) + 'px';
            placePiece(pieceId);
        } else {
            // Remove do canvas
            pieceEl.remove();
            renderPiecesTray();
        }
    }

    function placePiece(pieceId) {
        placedPieces[pieceId] = true;
        piecesPlaced++;

        const pieceEl = document.querySelector(`.tangram-piece[data-piece-id="${pieceId}"]`);
        if (pieceEl) {
            pieceEl.classList.add('placed');
            pieceEl.style.pointerEvents = 'none';
        }

        renderPiecesTray();
        updateInfo();

        if (piecesPlaced === 7) {
            setTimeout(showWinMessage, 500);
        }
    }

    function updateInfo() {
        document.getElementById('piecesPlaced').textContent = piecesPlaced + '/7';
    }

    function showWinMessage() {
        document.getElementById('overlay').classList.add('show');
        document.getElementById('message').classList.add('show');
    }

    function closeMessage() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('message').classList.remove('show');
    }

    function selectFigure(figure) {
        currentFigure = figure;
        document.querySelectorAll('.figure-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.figure === figure);
        });
        initGame();
    }

    // Event listeners
    document.querySelectorAll('.figure-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectFigure(this.dataset.figure);
        });
    });

    document.getElementById('btn-reset').addEventListener('click', initGame);
    document.getElementById('btn-new-figure').addEventListener('click', function() {
        const figuresList = Object.keys(figures);
        const currentIndex = figuresList.indexOf(currentFigure);
        const nextIndex = (currentIndex + 1) % figuresList.length;
        selectFigure(figuresList[nextIndex]);
    });
    document.getElementById('btn-play-again').addEventListener('click', initGame);
    document.getElementById('overlay').addEventListener('click', closeMessage);

    initGame();
});
