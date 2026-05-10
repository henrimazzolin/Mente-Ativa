document.addEventListener('DOMContentLoaded', function() {
    const shapes = [
        { name: 'Círculo', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#3B82F6" stroke="#1E40AF" stroke-width="3"/></svg>' },
        { name: 'Quadrado', svg: '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="4" fill="#10B981" stroke="#065F46" stroke-width="3"/></svg>' },
        { name: 'Triângulo', svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="#F59E0B" stroke="#92400E" stroke-width="3"/></svg>' },
        { name: 'Estrela', svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 63,38 98,38 70,60 80,95 50,75 20,95 30,60 2,38 37,38" fill="#8B5CF6" stroke="#5B21B6" stroke-width="3"/></svg>' },
        { name: 'Coração', svg: '<svg viewBox="0 0 100 100"><path d="M50,90 C20,65 5,50 5,35 C5,20 15,10 30,10 C40,10 48,18 50,25 C52,18 60,10 70,10 C85,10 95,20 95,35 C95,50 80,65 50,90Z" fill="#EF4444" stroke="#991B1B" stroke-width="3"/></svg>' },
        { name: 'Losango', svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#06B6D4" stroke="#0E7490" stroke-width="3"/></svg>' }
    ];

    let currentShape = null;
    let score = 0;
    let total = 0;
    let answered = false;

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
        currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        document.getElementById('mainShape').innerHTML = currentShape.svg;

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const others = shapes.filter(s => s.name !== currentShape.name);
        var shuffled = MenteAtiva.utils.shuffleArray(others);
        var options = MenteAtiva.utils.shuffleArray([currentShape].concat(shuffled.slice(0, 3)));

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt.svg;
            btn.dataset.shape = opt.name;
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

        if (selected === currentShape.name) {
            score++;
            document.getElementById('feedbackIcon').textContent = '✔️';
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(b => {
                if (b.dataset.shape === currentShape.name) {
                    b.classList.add('correct');
                }
            });
        } else {
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(b => {
                if (b.dataset.shape === currentShape.name) {
                    b.classList.add('correct');
                } else if (b.dataset.shape === selected) {
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
