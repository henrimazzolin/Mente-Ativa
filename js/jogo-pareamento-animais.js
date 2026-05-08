document.addEventListener('DOMContentLoaded', function() {
    const animals = ['🐶', '🐱', '🐰', '🐮', '🐷', '🐸', '🐔', '🐴'];

    let currentAnimal = null;
    let score = 0;
    let total = 0;
    let answered = false;

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startGame() {
        score = 0;
        total = 0;
        answered = false;
        document.getElementById('scoreDisplay').textContent = '0 acertos';
        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';
        showItem();
    }

    function showItem() {
        currentAnimal = animals[Math.floor(Math.random() * animals.length)];
        document.getElementById('mainAnimal').textContent = currentAnimal;

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const others = animals.filter(a => a !== currentAnimal);
        const shuffled = shuffleArray(others);
        const options = shuffleArray([currentAnimal, ...shuffled.slice(0, 3)]);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.dataset.animal = opt;
            btn.addEventListener('click', function() { checkAnswer(opt); });
            container.appendChild(btn);
        });

        answered = false;
        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';
    }

    function checkAnswer(selected) {
        if (answered) return;
        answered = true;
        total++;

        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);

        if (selected === currentAnimal) {
            score++;
            document.getElementById('feedbackIcon').textContent = currentAnimal;
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(b => {
                if (b.dataset.animal === currentAnimal) {
                    b.classList.add('correct');
                }
            });
        } else {
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(b => {
                if (b.dataset.animal === currentAnimal) {
                    b.classList.add('correct');
                } else if (b.dataset.animal === selected) {
                    b.classList.add('wrong');
                }
            });
        }

        document.getElementById('scoreDisplay').textContent = score + ' acertos';
        document.getElementById('nextBtn').classList.add('show');
    }

    function nextItem() {
        showItem();
    }

    document.getElementById('nextBtn').addEventListener('click', nextItem);

    startGame();
});
