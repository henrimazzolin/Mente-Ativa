document.addEventListener('DOMContentLoaded', function() {
        const instruments = [
            {
                name: "Violão",
                icon: '<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',
                correct: "Violão",
                options: ["Violão", "Bateria", "Violino", "Teclado"]
            },
            {
                name: "Piano",
                icon: '<svg viewBox="0 0 24 24"><path d="M21 3H3v18h18V3zm-4 8h-4v8h-2v-8H7v8H5v-8h2V7h4v4h2V7h4v4h2V7h-2v4zm-2 6h-2v-2h2v2z"/></svg>',
                correct: "Piano",
                options: ["Guitarra", "Piano", "Saxofone", "Flauta"]
            },
            {
                name: "Bateria",
                icon: '<svg viewBox="0 0 24 24"><path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.84V19c0 1.1.9 2 2 2h6.3c.98 0 1.81-.67 1.96-1.61l1.46-7c.11-.54.07-1.09-.12-1.59l.33-.51z"/></svg>',
                correct: "Bateria",
                options: ["Bateria", "Tambor", "Violão", "Harpa"]
            },
            {
                name: "Flauta",
                icon: '<svg viewBox="0 0 24 24"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>',
                correct: "Flauta",
                options: ["Oboé", "Clarinete", "Flauta", "Trompete"]
            },
            {
                name: "Trompete",
                icon: '<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6 4.5 6 8v8c0 3.5 3 6 6 6s6-2.5 6-6V8c0-3.5-3-6-6-6zm0 2c2.5 0 4 1.5 4 4v6c0 2.5-1.5 4-4 4s-4-1.5-4-4V8c0-2.5 1.5-4 4-4z"/></svg>',
                correct: "Trompete",
                options: ["Trompete", "Trombone", "Corneta", "Tubular"]
            }
        ];

        let currentInstruments = [];
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
            currentInstruments = shuffleArray(instruments);
            currentIndex = 0;
            correctCount = 0;
            isComplete = false;
            
            document.getElementById('correct').textContent = '0';
            document.getElementById('question').textContent = '1/5';
            
            loadQuestion();
        }

        function loadQuestion() {
            const inst = currentInstruments[currentIndex];
            
            document.getElementById('instrumentIcon').innerHTML = inst.icon;
            
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            
            const shuffledOptions = shuffleArray([...inst.options]);
            
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.addEventListener('click', () => checkAnswer(option, btn, inst.correct));
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
                    if (b.textContent === correct) {
                        b.classList.add('correct');
                    }
                });
                showFeedback(false, 'Quase lá!', 'A resposta correta era ' + correct);
            }
            
            document.getElementById('nextBtn').style.display = 'block';
            
            if (currentIndex === currentInstruments.length - 1) {
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
            feedbackText.textContent = `Você acertou ${correctCount} de ${currentInstruments.length} perguntas!`;
            
            feedbackBtn.textContent = 'Jogar Novamente';
            feedbackBtn.onclick = () => {
                overlay.classList.remove('show');
                feedback.classList.remove('show');
                document.getElementById('nextBtn').textContent = 'Próximo';
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