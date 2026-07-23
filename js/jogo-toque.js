document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var PATHS = [
        { id: 'horizontal', name: 'Linha horizontal', d: 'M90 180 L550 180' },
        { id: 'vertical', name: 'Linha vertical', d: 'M320 55 L320 305' },
        { id: 'diagonal', name: 'Linha diagonal', d: 'M105 295 L535 65' },
        { id: 'curve', name: 'Curva suave', d: 'M90 270 Q320 45 550 270' },
        { id: 'corner', name: 'Caminho em L', d: 'M105 70 L105 285 L545 285' },
        { id: 'wave', name: 'Caminho em onda', d: 'M70 180 C145 55 235 305 320 180 S495 55 570 180' },
        { id: 'zigzag', name: 'Caminho em zigue-zague', d: 'M70 280 L180 80 L300 280 L420 80 L570 280' },
        { id: 'composed', name: 'Caminho combinado', d: 'M80 90 C190 90 180 250 300 250 L420 250 Q560 250 560 100' }
    ];
    var TOTAL_PATHS = PATHS.length;
    var CHECKPOINT_COUNT = 48;
    var TOLERANCE = 48;
    var order = [];
    var stageIndex = 0;
    var checkpoints = [];
    var checkpointIndex = 0;
    var tracing = false;
    var completed = false;
    var activePointerId = null;
    var pathLength = 0;

    var board = document.getElementById('traceBoard');
    var corridor = document.getElementById('pathCorridor');
    var guide = document.getElementById('pathGuide');
    var progress = document.getElementById('pathProgress');
    var startPoint = document.getElementById('startPoint');
    var endPoint = document.getElementById('endPoint');
    var startLabel = document.getElementById('startLabel');
    var endLabel = document.getElementById('endLabel');
    var status = document.getElementById('coordinationStatus');
    var instruction = document.getElementById('instructionText');
    var nextButton = document.getElementById('nextPath');

    function shuffle(list) {
        var shuffled = list.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    function distance(a, b) {
        var x = a.x - b.x;
        var y = a.y - b.y;
        return Math.sqrt(x * x + y * y);
    }

    function boardPoint(event) {
        var svgPoint = board.createSVGPoint();
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;
        var matrix = board.getScreenCTM();
        if (matrix) return svgPoint.matrixTransform(matrix.inverse());
        var rect = board.getBoundingClientRect();
        return { x: (event.clientX - rect.left) * 640 / rect.width, y: (event.clientY - rect.top) * 360 / rect.height };
    }

    function setStatus(text, encouraging) {
        status.textContent = text;
        status.classList.toggle('encouragement', Boolean(encouraging));
    }

    function updateDots() {
        var dots = document.getElementById('stageDots');
        dots.innerHTML = '';
        for (var i = 0; i < TOTAL_PATHS; i++) {
            var dot = document.createElement('span');
            dot.className = 'stage-dot' + (i < stageIndex ? ' completed' : (i === stageIndex ? ' current' : ''));
            dots.appendChild(dot);
        }
    }

    function createCheckpoints() {
        checkpoints = [];
        pathLength = guide.getTotalLength();
        for (var i = 0; i <= CHECKPOINT_COUNT; i++) {
            checkpoints.push(guide.getPointAtLength(pathLength * i / CHECKPOINT_COUNT));
        }
    }

    function placePoint(circle, label, point) {
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        label.setAttribute('x', point.x);
        label.setAttribute('y', point.y);
    }

    function resetCurrentPath() {
        checkpointIndex = 0;
        tracing = false;
        completed = false;
        activePointerId = null;
        board.classList.remove('tracing');
        startPoint.classList.add('ready');
        endPoint.classList.remove('reached');
        progress.style.strokeDasharray = pathLength + ' ' + pathLength;
        progress.style.strokeDashoffset = String(pathLength);
        nextButton.hidden = true;
        instruction.textContent = 'Toque no ponto verde para começar.';
        setStatus('Pronto para começar.', false);
    }

    function loadStage() {
        var current = order[stageIndex];
        corridor.setAttribute('d', current.d);
        guide.setAttribute('d', current.d);
        progress.setAttribute('d', current.d);
        createCheckpoints();
        placePoint(startPoint, startLabel, checkpoints[0]);
        placePoint(endPoint, endLabel, checkpoints[checkpoints.length - 1]);
        document.getElementById('pathCounter').textContent = 'Caminho ' + (stageIndex + 1) + ' de ' + TOTAL_PATHS;
        document.getElementById('pathName').textContent = current.name;
        updateDots();
        resetCurrentPath();
    }

    function updateProgress() {
        var ratio = checkpointIndex / CHECKPOINT_COUNT;
        progress.style.strokeDashoffset = String(pathLength * (1 - ratio));
    }

    function finishStage() {
        completed = true;
        tracing = false;
        board.classList.remove('tracing');
        startPoint.classList.remove('ready');
        endPoint.classList.add('reached');
        progress.style.strokeDashoffset = '0';
        instruction.textContent = 'Caminho concluído!';
        setStatus(stageIndex === TOTAL_PATHS - 1 ? 'Excelente! Você chegou ao último ponto.' : 'Muito bem! Você chegou ao ponto azul.', true);
        nextButton.textContent = stageIndex === TOTAL_PATHS - 1 ? 'Ver celebração' : 'Próximo caminho';
        nextButton.hidden = false;
        nextButton.focus();
    }

    function advanceWithPoint(point) {
        if (completed) return;
        var best = -1;
        var lookAhead = Math.min(checkpointIndex + 6, CHECKPOINT_COUNT);
        for (var i = checkpointIndex; i <= lookAhead; i++) {
            if (distance(point, checkpoints[i]) <= TOLERANCE) best = i;
        }
        if (best >= checkpointIndex) {
            checkpointIndex = Math.max(checkpointIndex, best);
            updateProgress();
            instruction.textContent = 'Continue seguindo o caminho.';
            setStatus('Isso! Continue devagar até o ponto azul.', true);
            if (checkpointIndex >= CHECKPOINT_COUNT - 1 || distance(point, checkpoints[CHECKPOINT_COUNT]) <= TOLERANCE) finishStage();
        } else {
            instruction.textContent = 'Volte suavemente para o caminho.';
            setStatus('Tudo bem. Aproxime o dedo da linha e continue.', false);
        }
    }

    board.addEventListener('pointerdown', function (event) {
        var expectedPoint = checkpoints[checkpointIndex];
        if (completed || distance(boardPoint(event), expectedPoint) > TOLERANCE) {
            if (!completed) setStatus(checkpointIndex > 0 ? 'Toque perto da parte verde do caminho para continuar.' : 'Comece tocando no ponto verde.', false);
            return;
        }
        tracing = true;
        activePointerId = event.pointerId;
        board.setPointerCapture(event.pointerId);
        board.classList.add('tracing');
        startPoint.classList.remove('ready');
        instruction.textContent = 'Continue seguindo o caminho.';
        setStatus(checkpointIndex > 0 ? 'Ótimo, continue de onde parou.' : 'Muito bem, agora siga até o ponto azul.', true);
        event.preventDefault();
    });

    board.addEventListener('pointermove', function (event) {
        if (!tracing || event.pointerId !== activePointerId) return;
        advanceWithPoint(boardPoint(event));
        event.preventDefault();
    });

    function releasePointer(event) {
        if (!tracing || event.pointerId !== activePointerId || completed) return;
        tracing = false;
        activePointerId = null;
        board.classList.remove('tracing');
        instruction.textContent = checkpointIndex > 0 ? 'Toque perto da parte verde para continuar.' : 'Toque no ponto verde para começar.';
        setStatus('Você pode continuar quando quiser.', false);
    }
    board.addEventListener('pointerup', releasePointer);
    board.addEventListener('pointercancel', releasePointer);

    document.getElementById('restartPath').addEventListener('click', resetCurrentPath);
    nextButton.addEventListener('click', function () {
        if (stageIndex < TOTAL_PATHS - 1) {
            stageIndex++;
            loadStage();
        } else {
            var overlay = document.getElementById('celebrationOverlay');
            overlay.classList.add('show');
            overlay.setAttribute('aria-hidden', 'false');
            document.getElementById('playAgain').focus();
        }
    });

    document.getElementById('playAgain').addEventListener('click', function () {
        var overlay = document.getElementById('celebrationOverlay');
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        order = shuffle(PATHS);
        stageIndex = 0;
        loadStage();
    });

    order = shuffle(PATHS);
    loadStage();
});
