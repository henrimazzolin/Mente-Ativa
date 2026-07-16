document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');

    let isDrawing = false;
    let currentColor = '#000000';
    let brushSize = 3;
    let isErasing = false;
    let activePointerId = null;

    const colors = [
        '#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981',
        '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#1E293B'
    ];

    function init() {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        renderColors();
        setupBrushSizes();
        setupToolButtons();
    }

    function renderColors() {
        const palette = document.getElementById('colorsPalette');
        palette.innerHTML = '';

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (color === currentColor && !isErasing ? ' active' : '');
            btn.style.background = color;
            btn.dataset.color = color;
            btn.addEventListener('click', function() {
                selectColor(color);
            });
            palette.appendChild(btn);
        });
    }

    function selectColor(color) {
        currentColor = color;
        isErasing = false;
        ctx.strokeStyle = color;
        renderColors();
        updateToolButtons();
    }

    function setupBrushSizes() {
        document.querySelectorAll('.brush-size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                brushSize = parseInt(this.dataset.size);
                ctx.lineWidth = brushSize;

                document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    function setupToolButtons() {
        document.getElementById('btn-eraser').addEventListener('click', toggleEraser);
        document.getElementById('btn-clear').addEventListener('click', clearCanvas);
        document.getElementById('btn-save').addEventListener('click', saveCanvas);
    }

    function toggleEraser() {
        isErasing = !isErasing;
        if (isErasing) {
            ctx.strokeStyle = '#FFFFFF';
        } else {
            ctx.strokeStyle = currentColor;
        }
        updateToolButtons();
        renderColors();
    }

    function updateToolButtons() {
        const eraserBtn = document.getElementById('btn-eraser');
        eraserBtn.setAttribute('aria-pressed', String(isErasing));
        if (isErasing) {
            eraserBtn.classList.add('active');
        } else {
            eraserBtn.classList.remove('active');
        }
    }

    function clearCanvas() {
        exibirConfirmacao('Tem certeza que deseja limpar todo o desenho?', function (ok) {
            if (ok) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });
    }

    function saveCanvas() {
        const link = document.createElement('a');
        link.download = 'meu-desenho.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * scaleX)),
            y: Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * scaleY))
        };
    }

    canvas.addEventListener('pointerdown', function(e) {
        if (activePointerId !== null) return;
        e.preventDefault();
        isDrawing = true;
        activePointerId = e.pointerId;
        canvas.setPointerCapture(e.pointerId);
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 0.01, pos.y + 0.01);
        ctx.stroke();
    });

    canvas.addEventListener('pointermove', function(e) {
        if (!isDrawing || e.pointerId !== activePointerId) return;
        e.preventDefault();
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    function finishDrawing(e) {
        if (!isDrawing || (e && e.pointerId !== activePointerId)) return;
        isDrawing = false;
        ctx.closePath();
        if (e && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
        activePointerId = null;
    }

    canvas.addEventListener('pointerup', finishDrawing);
    canvas.addEventListener('pointercancel', finishDrawing);
    canvas.addEventListener('lostpointercapture', function() {
        isDrawing = false;
        activePointerId = null;
        ctx.closePath();
    });

    init();
});
