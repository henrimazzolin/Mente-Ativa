document.addEventListener('DOMContentLoaded', function() {
    const items = ['☂️', '🎒', '👒', '🕶️', '🎸', '🎨', '📚', '🧩', '🎯', '🧸'];

    let currentItem = null;
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
        currentItem = items[Math.floor(Math.random() * items.length)];
        document.getElementById('mainImage').textContent = currentItem;

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const others = items.filter(i => i !== currentItem);
        var shuffled = MenteAtiva.utils.shuffleArray(others);
        var options = MenteAtiva.utils.shuffleArray([currentItem, shuffled[0]]);

        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.dataset.item = opt;
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

        if (selected === currentItem) {
            score++;
            document.getElementById('feedbackIcon').textContent = '✔️';
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(b => {
                if (b.dataset.item === currentItem) {
                    b.classList.add('correct');
                }
            });
        } else {
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(b => {
                if (b.dataset.item === currentItem) {
                    b.classList.add('correct');
                } else if (b.dataset.item === selected) {
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
