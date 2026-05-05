document.addEventListener('DOMContentLoaded', function() {
        const sequences = [
            {
                sequence: [1, 2, 3],
                next: 4,
                options: [4, 5, 6, 7]
            },
            {
                sequence: [2, 4, 6],
                next: 8,
                options: [7, 8, 9, 10]
            },
            {
                sequence: [5, 10, 15],
                next: 20,
                options: [18, 20, 22, 25]
            },
            {
                sequence: [10, 20, 30],
                next: 40,
                options: [35, 40, 45, 50]
            },
            {
                sequence: [1, 2, 4],
                next: 8,
                options: [6, 8, 10, 12]
            },
            {
                sequence: [3, 6, 9],
                next: 12,
                options: [10, 12, 14, 15]
            },
            {
                sequence: [10, 9, 8],
                next: 7,
                options: [5, 6, 7, 8]
            },
            {
                sequence: [5, 4, 3],
                next: 2,
                options: [1, 2, 3, 4]
            }
        ];

        let currentSequences = [];
        let currentIndex = 0;
        let correctCount = 0;
        let isComplete = false;

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function initGame() {
            currentSequences = shuffleArray(sequences).slice(0, 5);
            currentIndex = 0;
            correctCount = 0;
            isComplete = false;
            
            document.getElementById('correct').textContent = '0';
            document.getElementById('question').textContent = '1/5';
            
            loadQuestion();
        }

        function loadQuestion() {
            const seq = currentSequences[currentIndex];
            
            const sequenceItems = document.getElementById('sequenceItems');
            sequenceItems.innerHTML = '';
            
            seq.sequence.forEach((num, idx) => {
                const item = document.createElement('span');
                item.className = 'seq-item';
                item.textContent = num;
                sequenceItems.appendChild(item);
                
                if (idx < seq.sequence.length - 1) {
                    const dot = document.createElement('span');
                    dot.className = 'seq-dot';
                    dot.textContent = '→';
                    sequenceItems.appendChild(dot);
                }
            });
            
            const dot = document.createElement('span');
            dot.className = 'seq-dot';
            dot.textContent = '→';
            sequenceItems.appendChild(dot);
            
            const blank = document.createElement('span');
            blank.className = 'seq-item blank';
            blank.textContent = '?';
            sequenceItems.appendChild(blank);
            
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            
            const shuffledOptions = shuffleArray([...seq.options]);
            
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.addEventListener('click', () => checkAnswer(option, btn, seq.next));
                optionsGrid.appendChild(btn);
            });
            
            document.getElementById('nextBtn').style.display = 'none';
        }

        function checkAnswer(answer, btn, correct) {
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(b => b.disabled = true);
            
            if (answer === correct) {
                btn.classList.add('correct');
                correctCount++;
                document.getElementById('correct').textContent = correctCount;
                showFeedback(true, 'Muito bem!', 'Você acertou!');
            } else {
                btn.classList.add('wrong');
                buttons.forEach(b => {
                    if (parseInt(b.textContent) === correct) {
                        b.classList.add('correct');
                    }
                });
                showFeedback(false, 'Quase lá!', 'O número correto era ' + correct);
            }
            
            document.getElementById('nextBtn').style.display = 'block';
            
            if (currentIndex === currentSequences.length - 1) {
                isComplete = true;
                document.getElementById('nextBtn').textContent = 'Ver Resultado';
                document.getElementById('nextBtn').onclick = showResult;
            }
        }

        function nextQuestion() {
            if (isComplete) {
                showResult();
                return;
            }
            
            currentIndex++;
            document.getElementById('question').textContent = (currentIndex + 1) + '/5';
            loadQuestion();
        }

        function showResult() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackTitle = document.getElementById('feedbackTitle');
            const feedbackText = document.getElementById('feedbackText');
            const feedbackBtn = document.getElementById('feedbackBtn');
            
            feedbackIcon.className = 'feedback-icon success';
            feedbackIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            
            feedbackTitle.textContent = 'Parabéns!';
            feedbackText.textContent = `Você acertou ${correctCount} de ${currentSequences.length} sequências!`;
            
            feedbackBtn.textContent = 'Jogar Novamente';
            feedbackBtn.onclick = () => {
                overlay.classList.remove('show');
                feedback.classList.remove('show');
                document.getElementById('nextBtn').textContent = 'Próxima';
                document.getElementById('nextBtn').onclick = nextQuestion;
                initGame();
            };
            
            overlay.classList.add('show');
            feedback.classList.add('show');
        }

        function handleFeedback() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            overlay.classList.remove('show');
            feedback.classList.remove('show');
        }

        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextQuestion);
        document.getElementById('feedbackBtn').addEventListener('click', handleFeedback);
        document.getElementById('overlay').addEventListener('click', handleFeedback);

        initGame();
});