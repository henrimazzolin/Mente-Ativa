document.addEventListener('DOMContentLoaded', function () {
    const puzzles = [
        {
            puzzle: [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            solution: [
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, 9]
            ]
        },
        {
            puzzle: [
                [0, 2, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 3],
                [0, 7, 4, 0, 8, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 2],
                [0, 8, 0, 0, 4, 0, 0, 1, 0],
                [6, 0, 0, 5, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 7, 8, 0],
                [5, 0, 0, 0, 0, 9, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 0]
            ],
            solution: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [2, 3, 4, 5, 6, 7, 8, 9, 1],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ]
        },
        {
            puzzle: [
                [9, 0, 0, 6, 0, 0, 3, 0, 1],
                [0, 2, 0, 0, 8, 7, 0, 5, 0],
                [6, 0, 4, 0, 0, 1, 0, 0, 7],
                [0, 7, 0, 5, 0, 0, 2, 0, 9],
                [2, 0, 9, 0, 7, 0, 5, 0, 3],
                [5, 0, 3, 0, 0, 9, 0, 7, 0],
                [7, 0, 0, 4, 0, 0, 1, 0, 8],
                [0, 9, 0, 7, 6, 0, 0, 3, 0],
                [4, 0, 2, 0, 0, 8, 0, 0, 5]
            ],
            solution: [
                [9, 8, 7, 6, 5, 4, 3, 2, 1],
                [3, 2, 1, 9, 8, 7, 6, 5, 4],
                [6, 5, 4, 3, 2, 1, 9, 8, 7],
                [8, 7, 6, 5, 4, 3, 2, 1, 9],
                [2, 1, 9, 8, 7, 6, 5, 4, 3],
                [5, 4, 3, 2, 1, 9, 8, 7, 6],
                [7, 6, 5, 4, 3, 2, 1, 9, 8],
                [1, 9, 8, 7, 6, 5, 4, 3, 2],
                [4, 3, 2, 1, 9, 8, 7, 6, 5]
            ]
        },
        {
            puzzle: [
                [2, 0, 0, 8, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 7, 0, 0, 0, 6],
                [0, 0, 9, 0, 0, 3, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 9, 0],
                [0, 3, 0, 0, 9, 0, 0, 0, 2],
                [0, 0, 7, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 5, 0, 0, 0, 3, 0],
                [8, 0, 0, 0, 2, 0, 0, 0, 5],
                [0, 0, 0, 0, 0, 6, 0, 0, 9]
            ],
            solution: [
                [2, 4, 6, 8, 1, 3, 5, 7, 9],
                [8, 1, 3, 5, 7, 9, 2, 4, 6],
                [5, 7, 9, 2, 4, 6, 8, 1, 3],
                [4, 6, 8, 1, 3, 5, 7, 9, 2],
                [1, 3, 5, 7, 9, 2, 4, 6, 8],
                [7, 9, 2, 4, 6, 8, 1, 3, 5],
                [6, 8, 1, 3, 5, 7, 9, 2, 4],
                [3, 5, 7, 9, 2, 4, 6, 8, 1],
                [9, 2, 4, 6, 8, 1, 3, 5, 7]
            ]
        },
        {
            puzzle: [
                [0, 6, 0, 0, 0, 0, 2, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 9, 0],
                [0, 0, 1, 0, 8, 0, 0, 0, 6],
                [0, 0, 0, 3, 0, 0, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 5],
                [0, 9, 0, 0, 0, 6, 0, 0, 0],
                [3, 0, 0, 0, 5, 0, 9, 0, 0],
                [0, 8, 0, 0, 0, 0, 0, 4, 0],
                [0, 0, 5, 0, 0, 0, 0, 0, 7]
            ],
            solution: [
                [3, 6, 9, 1, 4, 7, 2, 5, 8],
                [1, 4, 7, 2, 5, 8, 3, 6, 9],
                [2, 5, 8, 3, 6, 9, 1, 4, 7],
                [6, 9, 3, 4, 7, 1, 5, 8, 2],
                [4, 7, 1, 5, 8, 2, 6, 9, 3],
                [5, 8, 2, 6, 9, 3, 4, 7, 1],
                [9, 3, 6, 7, 1, 4, 8, 2, 5],
                [7, 1, 4, 8, 2, 5, 9, 3, 6],
                [8, 2, 5, 9, 3, 6, 7, 1, 4]
            ]
        },
        {
            puzzle: [
                [0, 0, 0, 6, 0, 0, 0, 0, 5],
                [6, 0, 0, 0, 9, 0, 0, 2, 0],
                [0, 9, 0, 0, 0, 2, 0, 0, 1],
                [8, 0, 0, 1, 0, 0, 0, 5, 0],
                [0, 3, 0, 0, 5, 0, 9, 0, 0],
                [0, 0, 7, 0, 0, 3, 0, 0, 4],
                [2, 0, 0, 0, 6, 0, 0, 1, 0],
                [0, 4, 0, 9, 0, 0, 3, 0, 0],
                [5, 0, 0, 0, 1, 0, 0, 0, 8]
            ],
            solution: [
                [4, 8, 2, 6, 3, 1, 7, 9, 5],
                [6, 3, 1, 7, 9, 5, 4, 8, 2],
                [7, 9, 5, 4, 8, 2, 6, 3, 1],
                [8, 2, 4, 1, 5, 7, 9, 6, 3],
                [1, 5, 7, 9, 6, 3, 8, 2, 4],
                [9, 6, 3, 8, 2, 4, 1, 5, 7],
                [2, 4, 8, 3, 7, 9, 5, 1, 6],
                [3, 7, 9, 5, 1, 6, 2, 4, 8],
                [5, 1, 6, 2, 4, 8, 3, 7, 9]
            ]
        }
    ];

    let currentPuzzle = null;
    let currentSolution = null;
    let selectedCell = null;
    let timerInterval = null;
    let seconds = 0;

    function initGame() {
        const gridEl = document.getElementById('grid');
        gridEl.innerHTML = '';

        const randomIndex = Math.floor(Math.random() * puzzles.length);
        currentPuzzle = puzzles[randomIndex].puzzle;
        currentSolution = puzzles[randomIndex].solution;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = row;
                input.dataset.col = col;

                if (currentPuzzle[row][col] !== 0) {
                    input.value = currentPuzzle[row][col];
                    input.readOnly = true;
                    cell.classList.add('fixed');
                }

                input.addEventListener('focus', handleFocus);
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);

                cell.appendChild(input);
                gridEl.appendChild(cell);
            }
        }

        startTimer();
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        seconds = 0;
        updateTimer();
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    }

    function updateTimer() {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${mins}:${secs}`;
    }

    function handleFocus(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight', 'same-number'));

        document.querySelectorAll('.cell').forEach(c => {
            const r = parseInt(c.dataset.row);
            const co = parseInt(c.dataset.col);
            if (r === row || co === col) {
                c.classList.add('highlight');
            }
            const input = c.querySelector('input');
            if (input && input.value && input.value === e.target.value && e.target.value !== '') {
                c.classList.add('same-number');
            }
        });

        selectedCell = e.target;
    }

    function handleInput(e) {
        const value = e.target.value;
        if (value && !/[1-9]/.test(value)) {
            e.target.value = '';
        }
        e.target.value = value.replace(/[^1-9]/g, '');

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        document.querySelectorAll('.cell').forEach(c => c.classList.remove('same-number'));
        if (e.target.value) {
            document.querySelectorAll('.cell').forEach(c => {
                const input = c.querySelector('input');
                if (input && input.value === e.target.value) {
                    c.classList.add('same-number');
                }
            });
        }
    }

    function handleKeydown(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (e.key >= '1' && e.key <= '9') {
            if (!e.target.readOnly) {
                e.target.value = e.key;
                handleInput(e);
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (!e.target.readOnly) {
                e.target.value = '';
                handleInput(e);
            }
        } else if (e.key === 'ArrowRight' && col < 8) {
            e.preventDefault();
            focusCell(row, col + 1);
        } else if (e.key === 'ArrowLeft' && col > 0) {
            e.preventDefault();
            focusCell(row, col - 1);
        } else if (e.key === 'ArrowDown' && row < 8) {
            e.preventDefault();
            focusCell(row + 1, col);
        } else if (e.key === 'ArrowUp' && row > 0) {
            e.preventDefault();
            focusCell(row - 1, col);
        }
    }

    function focusCell(row, col) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        if (input) input.focus();
    }

    function inputNumber(num) {
        if (selectedCell && !selectedCell.readOnly) {
            selectedCell.value = num;
            handleInput({ target: selectedCell });
        }
    }

    function checkSolution() {
        let allCorrect = true;
        let allFilled = true;

        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('correct', 'wrong');
        });

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const input = cell.querySelector('input');
                const value = parseInt(input.value);
                const expected = currentSolution[row][col];

                if (!input.value) {
                    allFilled = false;
                    allCorrect = false;
                } else if (value === expected) {
                    if (!input.readOnly) {
                        cell.classList.add('correct');
                    }
                } else {
                    cell.classList.add('wrong');
                    allCorrect = false;
                }
            }
        }

        if (!allFilled) {
            alert('Preencha todas as células antes de verificar.');
        } else if (allCorrect) {
            clearInterval(timerInterval);
            document.getElementById('overlay').classList.add('show');
            document.getElementById('message').classList.add('show');
        }
    }

    function showSolution() {
        if (confirm('Deseja ver a solução? O jogo será reiniciado.')) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    const input = cell.querySelector('input');
                    input.value = currentSolution[row][col];
                }
            }
            clearInterval(timerInterval);
        }
    }

    function resetGame() {
        closeMessage();
        document.getElementById('grid').innerHTML = '';
        initGame();
    }

    function closeMessage() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('message').classList.remove('show');
    }

    // Event listeners
    document.getElementById('btn-num-1').addEventListener('click', function () { inputNumber(1); });
    document.getElementById('btn-num-2').addEventListener('click', function () { inputNumber(2); });
    document.getElementById('btn-num-3').addEventListener('click', function () { inputNumber(3); });
    document.getElementById('btn-num-4').addEventListener('click', function () { inputNumber(4); });
    document.getElementById('btn-num-5').addEventListener('click', function () { inputNumber(5); });
    document.getElementById('btn-num-6').addEventListener('click', function () { inputNumber(6); });
    document.getElementById('btn-num-7').addEventListener('click', function () { inputNumber(7); });
    document.getElementById('btn-num-8').addEventListener('click', function () { inputNumber(8); });
    document.getElementById('btn-num-9').addEventListener('click', function () { inputNumber(9); });

    document.getElementById('btn-check').addEventListener('click', checkSolution);
    document.getElementById('btn-reset').addEventListener('click', resetGame);
    document.getElementById('btn-solution').addEventListener('click', showSolution);
    document.getElementById('btn-back').addEventListener('click', function () { window.location.href = 'grupo-moderado.html'; });

    document.getElementById('overlay').addEventListener('click', closeMessage);
    document.getElementById('btn-play-again').addEventListener('click', resetGame);

    initGame();
});