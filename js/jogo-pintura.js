document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    const palette = document.getElementById('colorsPalette');
    const customColorInput = document.getElementById('customColor');
    const brushButton = document.getElementById('btn-brush');
    const eraserButton = document.getElementById('btn-eraser');
    const undoButton = document.getElementById('btn-undo');
    const redoButton = document.getElementById('btn-redo');
    const clearButton = document.getElementById('btn-clear');
    const saveButton = document.getElementById('btn-save');
    const toolPreview = document.getElementById('toolPreview');
    const toolStatus = document.getElementById('toolStatus');
    const drawingState = document.getElementById('drawingState');
    const canvasHint = document.getElementById('canvasHint');
    const favoriteColorsContainer = document.getElementById('favoriteColors');
    const saveFavoriteColorButton = document.getElementById('saveFavoriteColor');
    const FAVORITES_KEY = 'menteAtiva.pintura.coresFavoritas';

    let isDrawing = false;
    let currentColor = '#000000';
    let currentColorName = 'preto';
    let brushSize = 4;
    let brushSizeName = 'fino';
    let isErasing = false;
    let activePointerId = null;
    let currentStroke = null;
    let actions = [];
    let redoActions = [];
    let favoriteColors = loadFavoriteColors();

    const colors = [
        { value: '#000000', name: 'Preto' },
        { value: '#FFFFFF', name: 'Branco' },
        { value: '#2563EB', name: 'Azul' },
        { value: '#EF4444', name: 'Vermelho' },
        { value: '#10B981', name: 'Verde' },
        { value: '#F59E0B', name: 'Laranja' },
        { value: '#7C3AED', name: 'Roxo' },
        { value: '#EC4899', name: 'Rosa' },
        { value: '#64748B', name: 'Cinza' },
        { value: '#7C2D12', name: 'Marrom' }
    ];

    function isValidColor(value) {
        return typeof value === 'string' && /^#[0-9A-F]{6}$/.test(value);
    }

    function loadFavoriteColors() {
        try {
            var parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
            if (!Array.isArray(parsed)) return [];
            return parsed.map(function(cor) { return String(cor).toUpperCase(); }).filter(isValidColor).filter(function(cor, i, arr) { return arr.indexOf(cor) === i; }).slice(0, 8);
        } catch (error) {
            return [];
        }
    }

    function persistFavoriteColors() {
        try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteColors)); } catch (error) {}
    }

    function renderFavoriteColors() {
        favoriteColorsContainer.innerHTML = '';
        favoriteColorsContainer.classList.toggle('empty', favoriteColors.length === 0);
        if (!favoriteColors.length) {
            favoriteColorsContainer.textContent = 'Nenhuma cor favorita salva.';
            return;
        }
        favoriteColors.forEach(function(cor) {
            var item = document.createElement('span');
            item.className = 'favorite-color-item';
            var choose = document.createElement('button');
            choose.type = 'button';
            choose.className = 'favorite-color-btn';
            choose.style.backgroundColor = cor;
            choose.setAttribute('aria-label', 'Usar cor favorita ' + cor);
            choose.addEventListener('click', function() { selectColor(cor, 'favorita'); });
            var remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'favorite-remove-btn';
            remove.textContent = '×';
            remove.setAttribute('aria-label', 'Remover cor favorita ' + cor);
            remove.addEventListener('click', function() {
                favoriteColors = favoriteColors.filter(function(itemColor) { return itemColor !== cor; });
                persistFavoriteColors();
                renderFavoriteColors();
            });
            item.appendChild(choose);
            item.appendChild(remove);
            favoriteColorsContainer.appendChild(item);
        });
    }

    function saveFavoriteColor() {
        var normalized = currentColor.toUpperCase();
        if (!isValidColor(normalized)) return;
        if (favoriteColors.indexOf(normalized) !== -1) {
            updateInterface('Esta cor já está nas favoritas.');
            return;
        }
        if (favoriteColors.length >= 8) favoriteColors.shift();
        favoriteColors.push(normalized);
        persistFavoriteColors();
        renderFavoriteColors();
        updateInterface('Cor salva nas favoritas.');
    }

    function initializeCanvas() {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        paintBackground();
        renderColors();
        renderFavoriteColors();
        bindControls();
        updateInterface();
    }

    function paintBackground() {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function renderColors() {
        palette.innerHTML = '';

        colors.forEach(function(color) {
            const button = document.createElement('button');
            const isActive = color.value === currentColor && !isErasing;
            button.type = 'button';
            button.className = 'color-btn' + (isActive ? ' active' : '');
            button.style.backgroundColor = color.value;
            button.dataset.color = color.value;
            button.setAttribute('aria-label', 'Usar cor ' + color.name.toLowerCase());
            button.setAttribute('aria-pressed', String(isActive));
            button.title = color.name;
            button.addEventListener('click', function() {
                selectColor(color.value, color.name.toLowerCase());
            });
            palette.appendChild(button);
        });
    }

    function selectColor(color, name) {
        currentColor = color.toUpperCase();
        currentColorName = name || 'personalizada';
        isErasing = false;
        customColorInput.value = currentColor;
        renderColors();
        updateInterface();
    }

    function selectBrush() {
        isErasing = false;
        renderColors();
        updateInterface();
        canvas.focus({ preventScroll: true });
    }

    function selectEraser() {
        isErasing = true;
        renderColors();
        updateInterface();
        canvas.focus({ preventScroll: true });
    }

    function bindControls() {
        document.querySelectorAll('.brush-size-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                brushSize = parseInt(this.dataset.size, 10);
                brushSizeName = this.dataset.name;
                document.querySelectorAll('.brush-size-btn').forEach(function(item) {
                    const active = item === button;
                    item.classList.toggle('active', active);
                    item.setAttribute('aria-pressed', String(active));
                });
                updateInterface();
                canvas.focus({ preventScroll: true });
            });
        });

        customColorInput.addEventListener('input', function() {
            selectColor(this.value, 'personalizada');
        });
        saveFavoriteColorButton.addEventListener('click', saveFavoriteColor);
        brushButton.addEventListener('click', selectBrush);
        eraserButton.addEventListener('click', selectEraser);
        undoButton.addEventListener('click', undo);
        redoButton.addEventListener('click', redo);
        clearButton.addEventListener('click', clearCanvas);
        saveButton.addEventListener('click', saveCanvas);

        document.addEventListener('keydown', function(event) {
            const target = event.target;
            if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
            const modifier = event.ctrlKey || event.metaKey;
            if (!modifier) return;

            if (event.key.toLowerCase() === 'z' && event.shiftKey) {
                event.preventDefault();
                redo();
            } else if (event.key.toLowerCase() === 'z') {
                event.preventDefault();
                undo();
            } else if (event.key.toLowerCase() === 'y') {
                event.preventDefault();
                redo();
            }
        });
    }

    function updateInterface(message) {
        const hasDrawing = hasVisibleDrawing();
        brushButton.classList.toggle('active', !isErasing);
        brushButton.setAttribute('aria-pressed', String(!isErasing));
        eraserButton.classList.toggle('active', isErasing);
        eraserButton.setAttribute('aria-pressed', String(isErasing));

        undoButton.disabled = actions.length === 0;
        redoButton.disabled = redoActions.length === 0;
        clearButton.disabled = !hasDrawing;
        saveButton.disabled = !hasDrawing;
        canvasHint.classList.toggle('hidden', hasDrawing);
        drawingState.textContent = hasDrawing ? 'Desenho em andamento' : 'Tela em branco';

        const status = isErasing ?
            'Borracha · ' + brushSizeName :
            'Pincel ' + currentColorName + ' · ' + brushSizeName;
        toolStatus.textContent = message || status;
        toolPreview.style.width = Math.max(8, Math.min(22, brushSize)) + 'px';
        toolPreview.style.height = Math.max(8, Math.min(22, brushSize)) + 'px';
        toolPreview.style.backgroundColor = isErasing ? '#FFFFFF' : currentColor;
        toolPreview.classList.toggle('eraser', isErasing);
        canvas.classList.toggle('eraser-active', isErasing);
    }

    function hasVisibleDrawing() {
        let visible = false;
        actions.forEach(function(action) {
            if (action.type === 'clear') visible = false;
            if (action.type === 'stroke' && !action.erase) visible = true;
        });
        return visible;
    }

    function configureStroke(stroke) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.erase ? '#FFFFFF' : stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function drawStroke(stroke) {
        if (!stroke.points.length) return;
        ctx.save();
        configureStroke(stroke);
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        if (stroke.points.length === 1) {
            ctx.lineTo(stroke.points[0].x + 0.01, stroke.points[0].y + 0.01);
        } else {
            stroke.points.slice(1).forEach(function(point) {
                ctx.lineTo(point.x, point.y);
            });
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function redrawCanvas() {
        paintBackground();
        actions.forEach(function(action) {
            if (action.type === 'clear') paintBackground();
            if (action.type === 'stroke') drawStroke(action);
        });
    }

    function undo() {
        if (!actions.length || isDrawing) return;
        redoActions.push(actions.pop());
        redrawCanvas();
        updateInterface('Última ação desfeita');
    }

    function redo() {
        if (!redoActions.length || isDrawing) return;
        actions.push(redoActions.pop());
        redrawCanvas();
        updateInterface('Ação refeita');
    }

    function clearCanvas() {
        if (!hasVisibleDrawing()) return;
        exibirConfirmacao(
            'Limpar toda a pintura?',
            'Você poderá usar Desfazer logo depois, se mudar de ideia.',
            function() {
                actions.push({ type: 'clear' });
                redoActions = [];
                redrawCanvas();
                updateInterface('Tela limpa · use Desfazer para recuperar');
            }
        );
    }

    function saveCanvas() {
        if (!hasVisibleDrawing()) return;
        const now = new Date();
        const date = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
        const link = document.createElement('a');
        link.download = 'minha-pintura-' + date + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        if (typeof window.exibirAlerta === 'function') {
            window.exibirAlerta('Desenho baixado como imagem PNG.', 'sucesso');
        }
        updateInterface('Desenho baixado com sucesso');
    }

    function getPointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * scaleX)),
            y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * scaleY))
        };
    }

    canvas.addEventListener('pointerdown', function(event) {
        if (activePointerId !== null) return;
        event.preventDefault();
        isDrawing = true;
        activePointerId = event.pointerId;
        canvas.setPointerCapture(event.pointerId);
        currentStroke = {
            type: 'stroke',
            color: currentColor,
            size: brushSize,
            erase: isErasing,
            points: [getPointerPosition(event)]
        };
        drawStroke(currentStroke);
    });

    canvas.addEventListener('pointermove', function(event) {
        if (!isDrawing || event.pointerId !== activePointerId) return;
        event.preventDefault();
        const point = getPointerPosition(event);
        const lastPoint = currentStroke.points[currentStroke.points.length - 1];
        currentStroke.points.push(point);

        ctx.save();
        configureStroke(currentStroke);
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    });

    function finishDrawing(event) {
        if (!isDrawing || (event && event.pointerId !== activePointerId)) return;
        const pointerId = activePointerId;
        isDrawing = false;
        activePointerId = null;

        if (currentStroke && currentStroke.points.length) {
            actions.push(currentStroke);
            redoActions = [];
        }
        currentStroke = null;

        if (pointerId !== null && canvas.hasPointerCapture(pointerId)) {
            canvas.releasePointerCapture(pointerId);
        }
        updateInterface();
    }

    canvas.addEventListener('pointerup', finishDrawing);
    canvas.addEventListener('pointercancel', finishDrawing);
    canvas.addEventListener('lostpointercapture', function(event) {
        if (isDrawing && event.pointerId === activePointerId) finishDrawing(event);
    });

    initializeCanvas();
});
