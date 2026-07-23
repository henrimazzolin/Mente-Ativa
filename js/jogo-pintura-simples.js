document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var canvas = document.getElementById('simplePaintCanvas');
    var ctx = canvas.getContext('2d');
    var colors = [
        { value: '#2563EB', name: 'azul' },
        { value: '#EF4444', name: 'vermelha' },
        { value: '#16A34A', name: 'verde' },
        { value: '#F59E0B', name: 'laranja' },
        { value: '#7C3AED', name: 'roxa' },
        { value: '#111827', name: 'preta' }
    ];
    var color = colors[0].value;
    var drawing = false;
    var erasing = false;

    function fillWhite() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function point(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height
        };
    }

    function status(text) { document.getElementById('simplePaintStatus').textContent = text; }

    function setTool(erase) {
        erasing = erase;
        document.getElementById('simpleBrush').classList.toggle('active', !erase);
        document.getElementById('simpleBrush').setAttribute('aria-pressed', String(!erase));
        document.getElementById('simpleEraser').classList.toggle('active', erase);
        document.getElementById('simpleEraser').setAttribute('aria-pressed', String(erase));
        status(erase ? 'Borracha selecionada.' : 'Pincel selecionado.');
    }

    colors.forEach(function (item, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'simple-color' + (index === 0 ? ' active' : '');
        button.style.background = item.value;
        button.setAttribute('aria-label', 'Usar cor ' + item.name);
        button.setAttribute('aria-pressed', String(index === 0));
        button.addEventListener('click', function () {
            color = item.value;
            document.querySelectorAll('.simple-color').forEach(function (other) {
                other.classList.remove('active');
                other.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            setTool(false);
            status('Cor ' + item.name + ' selecionada.');
        });
        document.getElementById('simpleColors').appendChild(button);
    });

    canvas.addEventListener('pointerdown', function (event) {
        drawing = true;
        canvas.setPointerCapture(event.pointerId);
        var current = point(event);
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(current.x + 0.01, current.y + 0.01);
        ctx.strokeStyle = erasing ? '#fff' : color;
        ctx.lineWidth = erasing ? 42 : 18;
        ctx.lineCap = 'round';
        ctx.stroke();
    });
    canvas.addEventListener('pointermove', function (event) {
        if (!drawing) return;
        var current = point(event);
        ctx.strokeStyle = erasing ? '#fff' : color;
        ctx.lineWidth = erasing ? 42 : 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
    });
    function stopDrawing() {
        if (!drawing) return;
        drawing = false;
        ctx.closePath();
        status(erasing ? 'Área apagada.' : 'Muito bem! Continue pintando.');
    }
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);

    document.getElementById('simpleBrush').addEventListener('click', function () { setTool(false); });
    document.getElementById('simpleEraser').addEventListener('click', function () { setTool(true); });
    document.getElementById('simpleClear').addEventListener('click', function () {
        exibirConfirmacao('Limpar a pintura?', 'Todo o desenho será apagado.', function () {
            fillWhite();
            status('Tela limpa. Escolha uma cor para continuar.');
        });
    });
    fillWhite();
});
