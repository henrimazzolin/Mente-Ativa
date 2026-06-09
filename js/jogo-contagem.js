document.addEventListener('DOMContentLoaded', function() {
    var emojis = ['🍎', '⭐', '🌸', '🐟', '🎈', '🍀', '🐤', '🍪', '📘', '🌻'];

    var currentEmoji = '';
    var currentCount = 0;
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
        showCount();
    }

    function showCount() {
        currentCount = Math.floor(Math.random() * 5) + 1;
        currentEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        answered = false;

        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';

        renderItems();
        renderOptions();
    }

    function renderItems() {
        var display = document.getElementById('countDisplay');
        display.innerHTML = '';
        display.style.animation = 'none';
        void display.offsetWidth;
        display.style.animation = '';

        for (var i = 0; i < currentCount; i++) {
            var span = document.createElement('span');
            span.className = 'count-item';
            span.textContent = currentEmoji;
            display.appendChild(span);
        }
    }

    function renderOptions() {
        var container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        var numbers = [1, 2, 3, 4, 5];
        var wrongNumbers = numbers.filter(function(n) { return n !== currentCount; });
        var shuffledWrong = MenteAtiva.utils.shuffleArray(wrongNumbers);
        var options = MenteAtiva.utils.shuffleArray([currentCount].concat(shuffledWrong.slice(0, 2)));

        var numberSymbols = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

        options.forEach(function(num) {
            var btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = numberSymbols[num - 1];
            btn.dataset.value = num;
            btn.addEventListener('click', function() { checkAnswer(num); });
            container.appendChild(btn);
        });
    }

    function checkAnswer(selected) {
        if (answered) return;
        answered = true;
        total++;

        var buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(function(b) { b.disabled = true; });

        if (selected === currentCount) {
            score++;
            MenteAtiva.utils.playCorrect();
            document.getElementById('feedbackIcon').textContent = '✔️';
            document.getElementById('feedbackText').textContent = 'Muito bem!';
            buttons.forEach(function(b) {
                if (parseInt(b.dataset.value) === currentCount) {
                    b.classList.add('correct');
                }
            });
        } else {
            MenteAtiva.utils.playWrong();
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            buttons.forEach(function(b) {
                if (parseInt(b.dataset.value) === currentCount) {
                    b.classList.add('correct');
                } else if (parseInt(b.dataset.value) === selected) {
                    b.classList.add('wrong');
                }
            });
        }

        document.getElementById('scoreDisplay').textContent = score + ' acertos';
        document.getElementById('nextBtn').classList.add('show');
    }

    document.getElementById('nextBtn').addEventListener('click', function() {
        showCount();
    });

    startGame();
});
