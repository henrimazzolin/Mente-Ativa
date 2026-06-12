document.addEventListener('DOMContentLoaded', function() {
    var sequences = [
        ['1️⃣', '2️⃣', '3️⃣'],
        ['🌱', '🌻', '🌸'],
        ['☀️', '🌧️', '🌈'],
        ['🥛', '🍞', '🧀'],
        ['👶', '🧑', '👴'],
        ['🐛', '🦋', '🌺'],
        ['🌑', '🌓', '🌕'],
        ['🍳', '🍽️', '🧹'],
        ['🔴', '🟡', '🟢'],
        ['🧦', '👖', '👕']
    ];

    var labels = ['PRIMEIRO', 'SEGUNDO', 'TERCEIRO'];
    var hints = ['👉 Clique no que vem PRIMEIRO', '👉 Agora clique no PRÓXIMO', '👉 Por último, clique no último'];

    var currentOriginal = [];
    var currentShuffled = [];
    var currentStep = 0;
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
        newRound();
    }

    function newRound() {
        var idx = Math.floor(Math.random() * sequences.length);
        currentOriginal = sequences[idx].slice();
        currentShuffled = MenteAtiva.utils.shuffleArray(currentOriginal.slice());
        currentStep = 0;
        answered = false;

        document.getElementById('nextBtn').classList.remove('show');
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';

        renderItems();
        updateStepIndicator();
    }

    function renderItems() {
        var container = document.getElementById('sequenceContainer');
        container.innerHTML = '';

        currentShuffled.forEach(function(item, index) {
            var div = document.createElement('div');
            div.className = 'seq-item';
            div.textContent = item;
            div.dataset.value = item;
            div.dataset.index = index;
            div.addEventListener('click', function() { clickItem(index); });
            container.appendChild(div);
        });
    }

    function updateStepIndicator() {
        var stepEl = document.getElementById('stepIndicator');
        var instrEl = document.getElementById('instructionText');
        if (currentStep < currentOriginal.length) {
            stepEl.textContent = hints[currentStep];
            instrEl.textContent = 'Clique na figura ' + labels[currentStep].toLowerCase();
        } else {
            stepEl.textContent = '';
            instrEl.textContent = 'Clique nos itens na ordem correta!';
        }
    }

    function clickItem(index) {
        if (answered) return;
        var items = document.querySelectorAll('.seq-item');
        var clickedItem = items[index];

        if (clickedItem.disabled) return;

        var expected = currentOriginal[currentStep];

        if (currentShuffled[index] === expected) {
            clickedItem.classList.add('placed');
            clickedItem.disabled = true;
            currentStep++;

            if (currentStep >= currentOriginal.length) {
                answered = true;
                total++;
                score++;
                MenteAtiva.utils.playCorrect();
                document.getElementById('feedbackIcon').textContent = '🎉';
                document.getElementById('feedbackText').textContent = 'Completou! Muito bem!';
                document.getElementById('scoreDisplay').textContent = score + ' acertos';
                document.getElementById('nextBtn').classList.add('show');
            } else {
                updateStepIndicator();
            }
        } else {
            answered = true;
            total++;
            clickedItem.classList.add('wrong');
            MenteAtiva.utils.playWrong();
            document.getElementById('feedbackIcon').textContent = '❌';
            document.getElementById('feedbackText').textContent = 'Tente novamente!';
            items.forEach(function(el) { el.disabled = true; });

            var correctIdx = currentShuffled.indexOf(expected);
            if (correctIdx !== -1 && items[correctIdx]) {
                items[correctIdx].classList.add('placed');
            }

            document.getElementById('nextBtn').classList.add('show');
        }
    }

    document.getElementById('nextBtn').addEventListener('click', function() {
        newRound();
    });

    startGame();
});
