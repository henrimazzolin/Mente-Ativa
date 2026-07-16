document.addEventListener('DOMContentLoaded', function() {
    var currentLevel = 'facil';
    var gridData = [];
    var placedWords = [];
    var remainingWords = [];
    var foundWords = [];
    var totalWords = 5;
    var gridSize = 8;
    var selectionStart = null;
    var isDragging = false;
    var lastTouchCell = null;

    var WORD_POOL = {
        natureza: ['SOL', 'MAR', 'RIO', 'VENTO', 'NUVEM', 'CAMPO', 'JARDIM', 'FLORESTA', 'MONTANHA', 'CACHOEIRA', 'PASSARO', 'ESTRELA', 'SEMENTE', 'CAMINHO', 'ARVORE'],
        saude: ['FOCO', 'MENTE', 'CORPO', 'SONO', 'VITAL', 'SAUDE', 'MEMORIA', 'ATENCAO', 'ENERGIA', 'RESPIRAR', 'POSITIVO', 'CEREBRO', 'RELAXAR', 'BEMESTAR'],
        alimento: ['AGUA', 'FIBRA', 'FRUTA', 'MILHO', 'ARROZ', 'CEREAL', 'VITAMINA', 'PROTEINA', 'NATURAL', 'VERDURA', 'LEGUME', 'SALADA', 'FEIJAO'],
        cultura: ['ARTE', 'LIVRO', 'RITMO', 'LENDA', 'DANCA', 'MUSICA', 'LEITURA', 'ESCRITA', 'HISTORIA', 'CINEMA', 'TEATRO', 'POESIA']
    };

    var THEME_NAMES = {
        natureza: 'Natureza',
        saude: 'Sa\u00fade',
        alimento: 'Alimenta\u00e7\u00e3o',
        cultura: 'Cultura'
    };

    function getConfig(level) {
        switch (level) {
            case 'facil': return { size: 8, wordCount: 5, diagonal: false, reverse: false, minLen: 3, maxLen: 5 };
            case 'medio': return { size: 10, wordCount: 8, diagonal: true, reverse: false, minLen: 4, maxLen: 7 };
            case 'dificil': return { size: 12, wordCount: 10, diagonal: true, reverse: true, minLen: 5, maxLen: 10 };
        }
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    function getAvailableDirections(allowDiagonal, allowReverse) {
        var dirs = [{dx: 0, dy: 1}, {dx: 1, dy: 0}];
        if (allowDiagonal) dirs.push({dx: 1, dy: 1}, {dx: 1, dy: -1});
        if (allowReverse) dirs.push({dx: 0, dy: -1}, {dx: -1, dy: 0});
        if (allowDiagonal && allowReverse) dirs.push({dx: -1, dy: 1}, {dx: -1, dy: -1});
        return dirs;
    }

    function canPlaceWord(grid, word, row, col, dx, dy, size) {
        for (var i = 0; i < word.length; i++) {
            var r = row + i * dx;
            var c = col + i * dy;
            if (r < 0 || r >= size || c < 0 || c >= size) return false;
            if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    function placeWord(grid, word, row, col, dx, dy) {
        for (var i = 0; i < word.length; i++) grid[row + i * dx][col + i * dy] = word[i];
    }

    function generateGrid(level) {
        var cfg = getConfig(level);
        var size = cfg.size;
        var grid = [];
        for (var i = 0; i < size; i++) {
            grid[i] = [];
            for (var j = 0; j < size; j++) grid[i][j] = '';
        }

        var themeKeys = Object.keys(WORD_POOL);
        var themeKey = themeKeys[rand(0, themeKeys.length - 1)];
        var pool = shuffleArray(WORD_POOL[themeKey].slice());

        var eligible = pool.filter(function(w) {
            return w.length >= cfg.minLen && w.length <= cfg.maxLen;
        });

        if (eligible.length < cfg.wordCount) {
            for (var k = 0; k < pool.length && eligible.length < cfg.wordCount; k++) {
                if (eligible.indexOf(pool[k]) === -1) eligible.push(pool[k]);
            }
        }

        var chosen = eligible.slice(0, Math.min(cfg.wordCount, eligible.length));
        chosen.sort(function(a, b) { return b.length - a.length; });

        var dirs = getAvailableDirections(cfg.diagonal, cfg.reverse);
        var placed = [];
        var remaining = [];

        for (var w = 0; w < chosen.length; w++) {
            var word = chosen[w];
            var dirsShuffled = shuffleArray(dirs.slice());
            var placedOk = false;

            for (var d = 0; d < dirsShuffled.length && !placedOk; d++) {
                var dir = dirsShuffled[d];
                var dr = dir.dx;
                var dc = dir.dy;

                var rowStart = (dr < 0) ? (word.length - 1) : 0;
                var rowEnd = (dr > 0) ? (size - word.length) : (dr < 0 ? size - word.length : size - 1);
                var colStart = (dc < 0) ? (word.length - 1) : 0;
                var colEnd = (dc > 0) ? (size - word.length) : (dc < 0 ? size - word.length : size - 1);

                var minR = Math.min(rowStart, rowEnd);
                var maxR = Math.max(rowStart, rowEnd);
                var minC = Math.min(colStart, colEnd);
                var maxC = Math.max(colStart, colEnd);

                var positions = [];
                for (var r = minR; r <= maxR; r++) {
                    for (var c = minC; c <= maxC; c++) positions.push({row: r, col: c});
                }
                shuffleArray(positions);

                for (var p = 0; p < positions.length && !placedOk; p++) {
                    var pos = positions[p];
                    if (canPlaceWord(grid, word, pos.row, pos.col, dr, dc, size)) {
                        placeWord(grid, word, pos.row, pos.col, dr, dc);
                        placed.push({word: word, row: pos.row, col: pos.col, dx: dr, dy: dc});
                        placedOk = true;
                    }
                }
            }

            if (placedOk) remaining.push(word);
        }

        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (grid[i][j] === '') grid[i][j] = letters[rand(0, letters.length - 1)];
            }
        }

        return { grid: grid, placed: placed, remaining: remaining, size: size, themeKey: themeKey };
    }

    function initGame() {
        var result = generateGrid(currentLevel);
        gridData = result.grid;
        placedWords = result.placed;
        remainingWords = result.remaining.slice();
        foundWords = [];
        totalWords = remainingWords.length;
        selectionStart = null;
        isDragging = false;

        document.getElementById('score').textContent = '0';
        document.getElementById('totalWords').textContent = totalWords;
        document.getElementById('themeDisplay').textContent = THEME_NAMES[result.themeKey] || result.themeKey;

        renderGrid();
        renderWordList();
    }

    function getCell(row, col) {
        return document.querySelector('.grid-cell[data-row="' + row + '"][data-col="' + col + '"]');
    }

    function getLineCells(startRow, startCol, endRow, endCol) {
        var dr = endRow - startRow;
        var dc = endCol - startCol;
        if (dr === 0 && dc === 0) return null;
        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

        var gdr = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
        var gdc = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
        var steps = Math.max(Math.abs(dr), Math.abs(dc));
        var cells = [];
        for (var i = 0; i <= steps; i++) {
            var r = startRow + i * gdr;
            var c = startCol + i * gdc;
            if (r < 0 || r >= gridData.length || c < 0 || c >= gridData[0].length) return null;
            cells.push({row: r, col: c});
        }
        return cells;
    }

    function extractWord(cells) {
        var word = '';
        for (var i = 0; i < cells.length; i++) word += gridData[cells[i].row][cells[i].col];
        return word;
    }

    function clearPreview() {
        document.querySelectorAll('.grid-cell.preview').forEach(function(el) {
            el.classList.remove('preview');
        });
    }

    function clearSelectionStart() {
        document.querySelectorAll('.grid-cell.start-selected').forEach(function(el) {
            el.classList.remove('start-selected');
        });
    }

    function cancelSelection() {
        clearSelectionStart();
        clearPreview();
        selectionStart = null;
        isDragging = false;
    }

    function validateSelection(startRow, startCol, endRow, endCol) {
        var cells = getLineCells(startRow, startCol, endRow, endCol);
        if (!cells) return;

        var word = extractWord(cells);
    var idx = remainingWords.indexOf(word);
    if (idx !== -1) {
        foundWords.push(word);
        remainingWords.splice(idx, 1);

        cells.forEach(function(c) {
                var el = getCell(c.row, c.col);
                if (el) el.classList.add('found');
            });

            document.querySelectorAll('.word-item').forEach(function(item) {
                if (item.dataset.word === word) item.classList.add('found');
            });

            document.getElementById('score').textContent = foundWords.length;

            if (remainingWords.length === 0) {
                setTimeout(function() { showCompletion(); }, 400);
            }
        }
    }

    function handlePointerDown(row, col) {
        var cell = getCell(row, col);
        if (!cell) return;

        if (selectionStart && !isDragging) {
            if (selectionStart.row === row && selectionStart.col === col) {
                cancelSelection();
                return;
            }
            var start = {row: selectionStart.row, col: selectionStart.col};
            cancelSelection();
            validateSelection(start.row, start.col, row, col);
            return;
        }

        cancelSelection();
        selectionStart = {row: row, col: col};
        isDragging = true;
        cell.classList.add('start-selected');
    }

    function handlePointerMove(row, col) {
        if (!isDragging || !selectionStart) return;

        var cell = getCell(row, col);
        if (!cell) {
            clearPreview();
            return;
        }

        clearPreview();
        var cells = getLineCells(selectionStart.row, selectionStart.col, row, col);
        if (cells) {
            for (var i = 1; i < cells.length; i++) {
                var el = getCell(cells[i].row, cells[i].col);
                if (el) el.classList.add('preview');
            }
        }
    }

    function handlePointerUp(row, col) {
        if (!isDragging || !selectionStart) return;
        isDragging = false;

        if (selectionStart.row === row && selectionStart.col === col) {
            return;
        }

        var start = {row: selectionStart.row, col: selectionStart.col};
        clearPreview();
        clearSelectionStart();
        selectionStart = null;
        validateSelection(start.row, start.col, row, col);
    }

    function renderGrid() {
        var container = document.getElementById('gridContainer');
        container.innerHTML = '';
        container.style.setProperty('--grid-size', String(gridData.length));
        container.style.gridTemplateColumns = 'repeat(' + gridData.length + ', minmax(0, 1fr))';
        container.style.maxWidth = (gridData.length * 52 + (gridData.length - 1) * 3 + 32) + 'px';

        for (var r = 0; r < gridData.length; r++) {
            for (var c = 0; c < gridData[r].length; c++) {
                var cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.textContent = gridData[r][c];

                (function(row, col) {
                    cell.addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        handlePointerDown(row, col);
                    });

                    cell.addEventListener('mouseenter', function() {
                        handlePointerMove(row, col);
                    });

                    cell.addEventListener('mouseup', function(e) {
                        e.preventDefault();
                        handlePointerUp(row, col);
                    });

                    cell.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        lastTouchCell = {row: row, col: col};
                        handlePointerDown(row, col);
                    }, {passive: false});
                })(r, c);

                container.appendChild(cell);
            }
        }
    }

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            cancelSelection();
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging || !selectionStart) return;
        if (e.touches.length === 0) return;
        e.preventDefault();

        var touch = e.touches[0];
        var el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.classList.contains('grid-cell')) {
            var row = parseInt(el.dataset.row);
            var col = parseInt(el.dataset.col);
            lastTouchCell = {row: row, col: col};
            handlePointerMove(row, col);
        } else {
            clearPreview();
        }
    }, {passive: false});

    document.addEventListener('touchend', function() {
        if (!isDragging || !selectionStart) return;
        isDragging = false;

        if (lastTouchCell) {
            var row = lastTouchCell.row;
            var col = lastTouchCell.col;
            if (selectionStart.row === row && selectionStart.col === col) {
                return;
            }
            var start = {row: selectionStart.row, col: selectionStart.col};
            clearPreview();
            clearSelectionStart();
            selectionStart = null;
            validateSelection(start.row, start.col, row, col);
        } else {
            cancelSelection();
        }
    });

    function renderWordList() {
        var list = document.getElementById('wordList');
        list.innerHTML = '';
        for (var i = 0; i < placedWords.length; i++) {
            var item = document.createElement('span');
            item.className = 'word-item';
            item.dataset.word = placedWords[i].word;
            if (foundWords.indexOf(placedWords[i].word) !== -1) item.classList.add('found');
            item.textContent = placedWords[i].word;
            list.appendChild(item);
        }
    }

    function showCompletion() {
        var icon = document.getElementById('feedbackIcon');
        var title = document.getElementById('feedbackTitle');
        var text = document.getElementById('feedbackText');
        var finalScore = document.getElementById('finalScore');

        finalScore.textContent = foundWords.length + '/' + totalWords;

        if (foundWords.length === totalWords) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            title.textContent = 'Perfeito!';
            text.textContent = 'Voc\u00ea encontrou todas as ' + totalWords + ' palavras!';
        } else if (foundWords.length >= totalWords * 0.6) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Muito bem!';
            text.textContent = 'Encontrou ' + foundWords.length + ' de ' + totalWords + ' palavras.';
        } else {
            icon.className = 'icon finished';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Rodada conclu\u00edda!';
            text.textContent = 'Encontrou ' + foundWords.length + ' de ' + totalWords + '. Tente novamente!';
        }

        document.getElementById('feedbackBtn').onclick = function() {
            closeFeedback();
            initGame();
        };
        document.getElementById('overlay').classList.add('show');
        document.getElementById('feedbackModal').classList.add('show');
    }

    function closeFeedback() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('feedbackModal').classList.remove('show');
    }

    function changeDifficulty(level) {
        currentLevel = level;
        document.querySelectorAll('.dif-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.dif === level);
        });
        cancelSelection();
        initGame();
    }

    document.querySelectorAll('.dif-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { changeDifficulty(this.dataset.dif); });
    });

    document.getElementById('btn-restart').addEventListener('click', function() {
        exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
            cancelSelection();
            initGame();
        });
    });

    initGame();
});
