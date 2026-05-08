document.addEventListener('DOMContentLoaded', function() {
    const colors = [
        { name: 'Vermelho', value: '#E53935' },
        { name: 'Azul', value: '#1E88E5' },
        { name: 'Verde', value: '#43A047' },
        { name: 'Amarelo', value: '#FDD835' },
        { name: 'Roxo', value: '#8E24AA' },
        { name: 'Laranja', value: '#FB8C00' },
        { name: 'Rosa', value: '#F06292' },
        { name: 'Marrom', value: '#6D4C41' }
    ];

    let currentColor = null;
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
        currentColor = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('mainColor').style.backgroundColor = currentColor.value;

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const others = colors.filter(c => c.name !== currentColor.name);
        const shuffled = shuffleArray(others);
        const options = shuffleArray([currentColor, ...shuffled.slice(0, 3)]);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.style.backgroundColor = opt.value;
            btn.dataset.color = opt.name;
            btn.addEventListener('click', function() { checkAnswer(opt.name); });
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

        if (selected === currentColor.name) {
            score++;
            document.getElementById('feedbackIcon').textContent = '✔️';
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(b => {
                if (b.dataset.color === currentColor.name) {
                    b.classList.add('correct');
                }
            });
        } else {
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(b => {
                if (b.dataset.color === currentColor.name) {
                    b.classList.add('correct');
                } else if (b.dataset.color === selected) {
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
