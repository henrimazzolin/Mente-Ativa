document.addEventListener('DOMContentLoaded', function() {
        // ============================================
        // PERGUNTAS DO JOGO - EDITE AQUI SE QUISER
        // ============================================
        const questions = [
            {
                // Pergunta 1
                question: "Qual é a cor do céu?",
                icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/></svg>',
                correct: "Azul",
                options: ["Azul", "Verde", "Vermelho", "Amarelo"]
            },
            {
                // Pergunta 2
                question: "Quantos dias tem uma semana?",
                icon: '<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>',
                correct: "7 dias",
                options: ["5 dias", "6 dias", "7 dias", "8 dias"]
            },
            {
                // Pergunta 3
                question: "Qual fruta é amarela?",
                icon: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/></svg>',
                correct: "Banana",
                options: ["Maçã", "Banana", "Uva", "Morango"]
            },
            {
                // Pergunta 4
                question: "Qual animal faz Au Au?",
                icon: '<svg viewBox="0 0 24 24"><path d="M4.5 9.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"/><path d="M9 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/><path d="M15 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/><path d="M19.5 9.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"/><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.24-.04-.48-.06-.72-.06h-1.13c-.72 0-1.4.21-2.05.55-.56.3-1 .74-1.27 1.28l-.46.86c-.67.33-1.28.72-1.79 1.2l-.89.82c-.55.54-1 .97-1.35 1.55l-.35.59c-.53.89-.94 1.6-1.12 2.02z"/></svg>',
                correct: "Cachorro",
                options: ["Gato", "Cachorro", "Pássaro", "Peixe"]
            },
            {
                // Pergunta 5
                question: "O que usamos para dormir?",
                icon: '<svg viewBox="0 0 24 24"><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-1.65 0-3 1.35-3 3H5c-1.65 0-3 1.35-3 3v6c0 1.65 1.35 3 3 3h1v1h2v-1h4v1h2v-1h1c1.65 0 3-1.35 3-3v-2.22c.77.47 1.61.93 2.53 1.33v1.89h-2z"/><path d="M7 12l2 2 2-2 2 2 2-2"/></svg>',
                correct: "Cama",
                options: ["Cama", "Sofá", "Mesa", "Cadeira"]
            }
        ];

        let currentQuestions = [];
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
            currentQuestions = shuffleArray(questions);
            currentIndex = 0;
            correctCount = 0;
            isComplete = false;
            
            document.getElementById('correct').textContent = '0';
            document.getElementById('question').textContent = '1/5';
            
            loadQuestion();
        }

        function loadQuestion() {
            const q = currentQuestions[currentIndex];
            
            document.getElementById('questionText').textContent = q.question;
            
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            
            const shuffledOptions = shuffleArray([...q.options]);
            
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option;
                btn.addEventListener('click', () => checkAnswer(option, btn, q.correct));
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
            
            if (currentIndex === currentQuestions.length - 1) {
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
            document.getElementById('question').textContent = `${currentIndex + 1}/5`;
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
            feedbackText.textContent = `Você acertou ${correctCount} de ${currentQuestions.length} perguntas!`;
            
            feedbackBtn.textContent = 'Jogar Novamente';
            feedbackBtn.onclick = () => {
                overlay.classList.remove('show');
                feedback.classList.remove('show');
                document.getElementById('nextBtn').textContent = 'Próxima Pergunta';
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