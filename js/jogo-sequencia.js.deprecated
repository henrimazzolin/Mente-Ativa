document.addEventListener('DOMContentLoaded', function() {
        const sequences = [
            {
                sequence: [1, 2, 3],
                answer: 4,
                options: [4, 5, 6],
                hint: "Sequência de 1 em 1"
            },
            {
                sequence: [2, 4, 6],
                answer: 8,
                options: [7, 8, 9],
                hint: "Sequência de 2 em 2"
            },
            {
                sequence: [5, 10, 15],
                answer: 20,
                options: [18, 20, 25],
                hint: "Sequência de 5 em 5"
            },
            {
                sequence: [10, 20, 30],
                answer: 40,
                options: [35, 40, 45],
                hint: "Sequência de 10 em 10"
            },
            {
                sequence: [3, 6, 9],
                answer: 12,
                options: [10, 11, 12],
                hint: "Sequência de 3 em 3"
            },
            {
                sequence: [1, 1, 2, 2],
                answer: 3,
                options: [2, 3, 4],
                hint: "Pares iguais"
            },
            {
                sequence: [5, 6, 8, 9],
                answer: 11,
                options: [10, 11, 12],
                hint: "Pula um, depois dois"
            },
            {
                sequence: [2, 3, 5, 8],
                answer: 13,
                options: [11, 12, 13],
                hint: "Some os dois anteriores"
            },
            {
                sequence: [1, 4, 9, 16],
                answer: 25,
                options: [20, 25, 30],
                hint: "Números ao quadrado"
            },
            {
                sequence: [10, 9, 8, 7],
                answer: 6,
                options: [5, 6, 4],
                hint: "Sequência decrescente"
            }
        ];

        let currentSequence = null;
        let currentSequenceIndex = -1;
        let score = 0;
        let round = 1;
        let lastSequenceIndex = -1;
        let canAnswer = true;

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function selectRandomSequence() {
            let available = sequences.filter((_, index) => index !== lastSequenceIndex);
            if (available.length === 0) {
                available = sequences;
            }
            const randomIndex = Math.floor(Math.random() * available.length);
            currentSequenceIndex = sequences.indexOf(available[randomIndex]);
            currentSequence = sequences[currentSequenceIndex];
            lastSequenceIndex = currentSequenceIndex;
        }

        function renderSequence() {
            const seqEl = document.getElementById('sequence');
            seqEl.innerHTML = '';

            currentSequence.sequence.forEach(num => {
                const item = document.createElement('div');
                item.className = 'seq-item';
                item.textContent = num;
                seqEl.appendChild(item);
            });

            const questionMark = document.createElement('div');
            questionMark.className = 'seq-item question';
            questionMark.textContent = '?';
            seqEl.appendChild(questionMark);

            const optionsEl = document.getElementById('options');
            optionsEl.innerHTML = '';

            const shuffledOptions = shuffleArray(currentSequence.options);

            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.addEventListener('click', () => checkAnswer(option, btn));
                optionsEl.appendChild(btn);
            });

            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = 'feedback-message';
            document.getElementById('nextBtn').style.display = 'none';
            canAnswer = true;
        }

        function checkAnswer(selected, btn) {
            if (!canAnswer) return;
            canAnswer = false;

            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(b => b.disabled = true);

            const feedbackEl = document.getElementById('feedback');

            if (selected === currentSequence.answer) {
                btn.classList.add('correct');
                score++;
                document.getElementById('score').textContent = score;
                feedbackEl.textContent = 'Muito bem! Acertou!';
                feedbackEl.className = 'feedback-message success';
            } else {
                btn.classList.add('wrong');
                buttons.forEach(b => {
                    if (parseInt(b.textContent) === currentSequence.answer) {
                        b.classList.add('correct');
                    }
                });
                feedbackEl.textContent = 'Quase! A resposta era ' + currentSequence.answer;
                feedbackEl.className = 'feedback-message error';
            }

            document.getElementById('nextBtn').style.display = 'inline-block';
        }

        function nextSequence() {
            round++;
            document.getElementById('round').textContent = round;
            selectRandomSequence();
            renderSequence();
        }

        function resetGame() {
            score = 0;
            round = 1;
            lastSequenceIndex = -1;
            document.getElementById('score').textContent = '0';
            document.getElementById('round').textContent = '1';
            selectRandomSequence();
            renderSequence();
        }

        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextSequence);
        document.getElementById('btn-reset').addEventListener('click', resetGame);

        selectRandomSequence();
        renderSequence();
});