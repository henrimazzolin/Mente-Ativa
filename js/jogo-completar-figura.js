document.addEventListener('DOMContentLoaded', function() {
    var groups = [
        { items: ['🍎', '🍌', '🍇', '🍊'] },
        { items: ['🐶', '🐱', '🐰', '🐟'] },
        { items: ['🟥', '🟦', '🟩', '🟨'] },
        { items: ['✏️', '📚', '📏', '✂️'] },
        { items: ['☕', '🥤', '🍵', '🧃'] },
        { items: ['🎵', '🎶', '🎤', '🥁'] },
        { items: ['🧢', '🧣', '🧤', '👟'] },
        { items: ['🚗', '✈️', '🚢', '🚲'] },
        { items: ['🍕', '🍔', '🌭', '🍪'] },
        { items: ['🔵', '🔴', '🟠', '🟣'] }
    ];
    var missingIndex = 3;

    var currentGroup = null;
    var score = 0;
    var total = 0;
    var answered = false;

    function startGame() {
        score = 0;
        total = 0;
        answered = false;
        document.getElementById('scoreDisplay').textContent = '0 acertos';
        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';
        showGroup();
    }

    function showGroup() {
        var idx = Math.floor(Math.random() * groups.length);
        currentGroup = groups[idx];
        missingIndex = Math.floor(Math.random() * currentGroup.items.length);
        answered = false;

        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';

        renderGroup();
        renderOptions();
    }

    function renderGroup() {
        var display = document.getElementById('groupDisplay');
        display.innerHTML = '';

        currentGroup.items.forEach(function(item, i) {
            var div = document.createElement('div');
            div.className = 'group-item';
            if (i === missingIndex) {
                div.textContent = '❓';
                div.classList.add('missing');
            } else {
                div.textContent = item;
            }
            display.appendChild(div);
        });
    }

    function renderOptions() {
        var container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        var correct = currentGroup.items[missingIndex];
        var pool = [];
        groups.forEach(function(g) {
            g.items.forEach(function(item) {
                if (pool.indexOf(item) === -1 && item !== correct) {
                    pool.push(item);
                }
            });
        });

        var shuffledPool = MenteAtiva.utils.shuffleArray(pool);
        var distractors = shuffledPool.slice(0, 3);
        var options = MenteAtiva.utils.shuffleArray([correct].concat(distractors));

        options.forEach(function(opt) {
            var btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.dataset.item = opt;
            btn.addEventListener('click', function() { checkAnswer(opt); });
            container.appendChild(btn);
        });
    }

    function checkAnswer(selected) {
        if (answered) return;
        answered = true;
        total++;

        var correct = currentGroup.items[missingIndex];
        var buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(function(b) { b.disabled = true; });

        if (selected === correct) {
            score++;
            MenteAtiva.utils.playCorrect();
            document.getElementById('feedbackIcon').textContent = '✔️';
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(function(b) {
                if (b.dataset.item === correct) {
                    b.classList.add('correct');
                }
            });
        } else {
            MenteAtiva.utils.playWrong();
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(function(b) {
                if (b.dataset.item === correct) {
                    b.classList.add('correct');
                } else if (b.dataset.item === selected) {
                    b.classList.add('wrong');
                }
            });
        }

        document.getElementById('scoreDisplay').textContent = score + ' acertos';
        document.getElementById('nextBtn').classList.add('show');
    }

    document.getElementById('nextBtn').addEventListener('click', function() {
        showGroup();
    });

    startGame();
});
