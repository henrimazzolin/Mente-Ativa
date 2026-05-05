document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    
    // Definição das figuras (coordenadas das áreas para preencher)
    const figures = {
        dog: {
            name: 'Cachorro',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                // Corpo
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.6, w*0.3, h*0.25, 0, 0, Math.PI*2);
                ctx.stroke();
                // Cabeça
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.3, w*0.15, 0, Math.PI*2);
                ctx.stroke();
                // Orelhas
                ctx.beginPath();
                ctx.arc(w*0.4, h*0.2, w*0.05, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w*0.6, h*0.2, w*0.05, 0, Math.PI*2);
                ctx.stroke();
                // Focinho
                ctx.beginPath();
                ctx.rect(w*0.45, h*0.35, w*0.1, h*0.08);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.45, w: 0.3, h: 0.3, filled: false },
                { id: 'head', x: 0.4, y: 0.2, w: 0.2, h: 0.2, filled: false },
                { id: 'ear1', x: 0.35, y: 0.15, w: 0.1, h: 0.1, filled: false },
                { id: 'ear2', x: 0.55, y: 0.15, w: 0.1, h: 0.1, filled: false }
            ]
        },
        cat: {
            name: 'Gato',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                // Corpo
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.6, w*0.25, h*0.25, 0, 0, Math.PI*2);
                ctx.stroke();
                // Cabeça
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.3, w*0.18, 0, Math.PI*2);
                ctx.stroke();
                // Orelhas
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
                // Focinho
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.35, w*0.08, h*0.05, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.4, w: 0.3, h: 0.35, filled: false },
                { id: 'head', x: 0.35, y: 0.15, w: 0.3, h: 0.3, filled: false },
                { id: 'ear1', x: 0.35, y: 0.1, w: 0.12, h: 0.2, filled: false },
                { id: 'ear2', x: 0.53, y: 0.1, w: 0.12, h: 0.2, filled: false }
            ]
        },
        bird: {
            name: 'Pássaro',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                // Corpo
                ctx.beginPath();
                ctx.ellipse(w*0.5, h*0.55, w*0.2, h*0.2, 0, 0, Math.PI*2);
                ctx.stroke();
                // Cabeça
                ctx.beginPath();
                ctx.arc(w*0.5, h*0.35, w*0.12, 0, Math.PI*2);
                ctx.stroke();
                // Asas
                ctx.beginPath();
                ctx.ellipse(w*0.3, h*0.5, w*0.15, h*0.08, -0.5, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(w*0.7, h*0.5, w*0.15, h*0.08, 0.5, 0, Math.PI*2);
                ctx.stroke();
                // Bico
                ctx.beginPath();
                ctx.moveTo(w*0.5, h*0.35);
                ctx.lineTo(w*0.55, h*0.32);
                ctx.lineTo(w*0.5, h*0.38);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.35, y: 0.4, w: 0.3, h: 0.3, filled: false },
                { id: 'head', x: 0.4, y: 0.25, w: 0.2, h: 0.2, filled: false },
                { id: 'wing1', x: 0.2, y: 0.35, w: 0.25, h: 0.2, filled: false },
                { id: 'wing2', x: 0.55, y: 0.35, w: 0.25, h: 0.2, filled: false }
            ]
        },
        house: {
            name: 'Casa',
            outline: function(ctx, w, h) {
                ctx.strokeStyle = '#1E293B';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                // Corpo da casa
                ctx.beginPath();
                ctx.rect(w*0.25, h*0.5, w*0.5, h*0.4);
                ctx.stroke();
                // Telhado
                ctx.beginPath();
                ctx.moveTo(w*0.2, h*0.5);
                ctx.lineTo(w*0.5, h*0.2);
                ctx.lineTo(w*0.8, h*0.5);
                ctx.closePath();
                ctx.stroke();
                // Porta
                ctx.beginPath();
                ctx.rect(w*0.4, h*0.65, w*0.2, h*0.25);
                ctx.stroke();
                // Janela
                ctx.beginPath();
                ctx.rect(w*0.3, h*0.6, w*0.15, h*0.15);
                ctx.stroke();
                ctx.setLineDash([]);
            },
            areas: [
                { id: 'body', x: 0.25, y: 0.5, w: 0.5, h: 0.4, filled: false },
                { id: 'roof', x: 0.2, y: 0.2, w: 0.6, h: 0.3, filled: false },
                { id: 'door', x: 0.4, y: 0.65, w: 0.2, h: 0.25, filled: false },
                { id: 'window', x: 0.3, y: 0.6, w: 0.15, h: 0.15, filled: false }
            ]
        }
    };

    let currentFigure = 'dog';
    let currentColor = '#3B82F6';
    let isDrawing = false;
    let areasFilled = 0;

    const colors = [
        '#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981',
        '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#1E293B'
    ];

    function initGame() {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Resetar áreas
        figures[currentFigure].areas.forEach(area => area.filled = false);
        areasFilled = 0;

        drawFigure();
        renderColors();
        updateInfo();
    }

    function drawFigure() {
        const w = canvas.width;
        const h = canvas.height;

        figures[currentFigure].outline(ctx, w, h);

        // Preencher áreas já concluídas
        figures[currentFigure].areas.forEach(area => {
            if (area.filled) {
                ctx.fillStyle = currentColor;
                ctx.fillRect(area.x * w, area.y * h, area.w * w, area.h * h);
            }
        });
    }

    function renderColors() {
        const palette = document.getElementById('colorsPalette');
        palette.innerHTML = '';

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (color === currentColor ? ' active' : '');
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
        renderColors();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
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
                areasFilled++;

                ctx.fillStyle = currentColor;
                ctx.fillRect(areaX, areaY, areaW, areaH);

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
            alert('Parabéns! Você preencheu o ' + figures[currentFigure].name + '!');
        }, 300);
    }

    // Event listeners para o canvas
    canvas.addEventListener('mousedown', function(e) {
        const pos = getMousePos(e);
        checkAreaClick(pos.x, pos.y);
    });

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const pos = getTouchPos(e);
        checkAreaClick(pos.x, pos.y);
    });

    // Seletor de figuras
    document.querySelectorAll('.figure-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentFigure = this.dataset.figure;
            document.querySelectorAll('.figure-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.figure === currentFigure);
            });
            initGame();
        });
    });

    // Botões de ferramentas
    document.getElementById('btn-clear').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar o desenho?')) {
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
