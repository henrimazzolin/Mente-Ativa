document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');

    const figures = {
        dog: {
            name: 'Cachorro',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.6, w*0.3, h*0.25, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.3, w*0.15, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.4, h*0.2, w*0.05, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.6, h*0.2, w*0.05, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.rect(w*0.45, h*0.35, w*0.1, h*0.08);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.45, w: 0.3, h: 0.3, filled: false, fillColor: null },
                { id: 'head', x: 0.4, y: 0.2, w: 0.2, h: 0.2, filled: false, fillColor: null },
                { id: 'ear1', x: 0.35, y: 0.15, w: 0.1, h: 0.1, filled: false, fillColor: null },
                { id: 'ear2', x: 0.55, y: 0.15, w: 0.1, h: 0.1, filled: false, fillColor: null }
            ]
        },
        cat: {
            name: 'Gato',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.6, w*0.25, h*0.25, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.3, w*0.18, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w*0.4, h*0.3);
                ctx.lineTo(w*0.38, h*0.15);
                ctx.lineTo(w*0.45, h*0.3);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w*0.6, h*0.3);
                ctx.lineTo(w*0.62, h*0.15);
                ctx.lineTo(w*0.55, h*0.3);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.35, w*0.08, h*0.05, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.4, w: 0.3, h: 0.35, filled: false, fillColor: null },
                { id: 'head', x: 0.35, y: 0.15, w: 0.3, h: 0.3, filled: false, fillColor: null },
                { id: 'ear1', x: 0.35, y: 0.1, w: 0.12, h: 0.2, filled: false, fillColor: null },
                { id: 'ear2', x: 0.53, y: 0.1, w: 0.12, h: 0.2, filled: false, fillColor: null }
            ]
        },
        bird: {
            name: 'Pássaro',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.55, w*0.2, h*0.2, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.35, w*0.12, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(w*0.3, h*0.5, w*0.15, h*0.08, -0.5, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(w*0.7, h*0.5, w*0.15, h*0.08, 0.5, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w*0.5, h*0.35);
                ctx.lineTo(w*0.55, h*0.32);
                ctx.lineTo(w*0.5, h*0.38);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.4, w: 0.3, h: 0.3, filled: false, fillColor: null },
                { id: 'head', x: 0.4, y: 0.25, w: 0.2, h: 0.2, filled: false, fillColor: null },
                { id: 'wing1', x: 0.2, y: 0.35, w: 0.25, h: 0.2, filled: false, fillColor: null },
                { id: 'wing2', x: 0.55, y: 0.35, w: 0.25, h: 0.2, filled: false, fillColor: null }
            ]
        },
        house: {
            name: 'Casa',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.rect(w*0.25, h*0.5, w*0.5, h*0.4);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w*0.2, h*0.5);
                ctx.lineTo(w*0.5, h*0.2);
                ctx.lineTo(w*0.8, h*0.5);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.rect(w*0.4, h*0.65, w*0.2, h*0.25);
                ctx.stroke();
                ctx.beginPath();
                ctx.rect(w*0.3, h*0.6, w*0.15, h*0.15);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.25, y: 0.5, w: 0.5, h: 0.4, filled: false, fillColor: null },
                { id: 'roof', x: 0.2, y: 0.2, w: 0.6, h: 0.3, filled: false, fillColor: null },
                { id: 'door', x: 0.4, y: 0.65, w: 0.2, h: 0.25, filled: false, fillColor: null },
                { id: 'window', x: 0.3, y: 0.6, w: 0.15, h: 0.15, filled: false, fillColor: null }
            ]
        }
    };

    let currentFigure = 'dog';
    let currentColor = '#3B82F6';
    let areasFilled = 0;

    const colors = [
        '#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981',
        '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#1E293B'
    ];

    function initGame() {
        figures[currentFigure].areas.forEach(area => {
            area.filled = false;
            area.fillColor = null;
        });
        areasFilled = 0;
        redrawCanvas();
        renderColors();
        updateInfo();
    }

    function redrawCanvas() {
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);

        figures[currentFigure].areas.forEach(area => {
            if (area.filled && area.fillColor) {
                ctx.fillStyle = area.fillColor;
                ctx.fillRect(area.x * w, area.y * h, area.w * w, area.h * h);
            }
        });

        figures[currentFigure].outline(ctx, w, h);
    }

    function renderColors() {
        const palette = document.getElementById('colorsPalette');
        palette.innerHTML = '';

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (color === currentColor ? ' active' : '');
            btn.style.background = color;
            btn.dataset.color = color;
            if (color === '#FFFFFF') {
                btn.style.border = '3px solid #CBD5E1';
            }
            btn.addEventListener('click', function() {
                selectColor(color);
            });
            palette.appendChild(btn);
        });
    }

    function selectColor(color) {
        currentColor = color;
        renderColors();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: (touch.clientX - rect.left) * (canvas.width / rect.width),
            y: (touch.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function checkAreaClick(x, y) {
        const w = canvas.width;
        const h = canvas.height;

        for (let area of figures[currentFigure].areas) {
            if (area.filled) continue;

            const areaX = area.x * w;
            const areaY = area.y * h;
            const areaW = area.w * w;
            const areaH = area.h * h;

            if (x >= areaX && x <= areaX + areaW && y >= areaY && y <= areaY + areaH) {
                area.filled = true;
                area.fillColor = currentColor;
                areasFilled++;

                redrawCanvas();
                updateInfo();

                if (areasFilled === figures[currentFigure].areas.length) {
                    setTimeout(showWinMessage, 500);
                }
                return;
            }
        }
    }

    function updateInfo() {
        document.getElementById('areasFilled').textContent = areasFilled + '/' + figures[currentFigure].areas.length;
    }

    function showWinMessage() {
        setTimeout(() => {
            if (typeof exibirAlerta === 'function') {
                exibirAlerta('Parabéns! Você preencheu o ' + figures[currentFigure].name + '!', 'sucesso');
            }
        }, 300);
    }

    canvas.addEventListener('mousedown', function(e) {
        const pos = getMousePos(e);
        checkAreaClick(pos.x, pos.y);
    });

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const pos = getTouchPos(e);
        checkAreaClick(pos.x, pos.y);
    });

    document.querySelectorAll('.figure-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentFigure = this.dataset.figure;
            document.querySelectorAll('.figure-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.figure === currentFigure);
            });
            initGame();
        });
    });

    document.getElementById('btn-clear').addEventListener('click', function() {
        if (typeof exibirConfirmacao === 'function') {
            exibirConfirmacao('Tem certeza que deseja limpar o desenho?', function(ok) {
                if (ok) initGame();
            });
        } else {
            initGame();
        }
    });

    document.getElementById('btn-save').addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'meu-desenho.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    initGame();
});
