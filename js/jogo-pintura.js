document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');

    let isDrawing = false;
    let currentColor = '#000000';
    let brushSize = 3;
    let isErasing = false;

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
        if (isErasing) {
            eraserBtn.classList.add('active');
        } else {
            eraserBtn.classList.remove('active');
        }
    }

    function clearCanvas() {
        if (confirm('Tem certeza que deseja limpar todo o desenho?')) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function saveCanvas() {
        const link = document.createElement('a');
        link.download = 'meu-desenho.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
        ctx.closePath();
    });

    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
        ctx.closePath();
    });

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const pos = getMousePos(touch);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const pos = getMousePos(touch);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    canvas.addEventListener('touchend', function() {
        isDrawing = false;
        ctx.closePath();
    });

    init();
});
