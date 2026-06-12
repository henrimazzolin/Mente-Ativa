document.addEventListener('DOMContentLoaded', function() {
    var PUZZLES = [];
    var currentLevel = 'facil';
    var currentPuzzleIndex = 0;
    var levelPuzzles = [];
    var score = 0;
    var streak = 0;
    var answered = false;
    var totalPuzzles = 10;

    function generatePuzzles() {
        PUZZLES = [
            // ===== FÁCIL (2-3 elementos, pistas diretas) =====
            {
                id: 'f1', level: 'facil',
                scenario: 'Três amigos — João, Maria e Pedro — têm idades diferentes: 30, 55 e 70 anos.',
                clues: [
                    'Maria não é a mais nova.',
                    'João não tem 70 anos.',
                    'Pedro é mais velho que Maria.'
                ],
                question: 'Quem tem 55 anos?',
                options: ['João', 'Maria', 'Pedro'],
                correctIndex: 0,
                explanation: 'Pedro é mais velho que Maria → Pedro = 70. Maria não é a mais nova → Maria = 55. João = 30.'
            },
            {
                id: 'f2', level: 'facil',
                scenario: 'Quatro frutas estão em cores diferentes: maçã (vermelha), banana (amarela), laranja (laranja) e uva (roxa).',
                clues: [
                    'A banana é amarela.',
                    'A uva é roxa.',
                    'A maçã não é amarela.'
                ],
                question: 'Qual fruta é da cor laranja?',
                options: ['Maçã', 'Banana', 'Laranja', 'Uva'],
                correctIndex: 2,
                explanation: 'Banana = amarela, Uva = roxa. Maçã não amarela → maçã = vermelha. Resta laranja = laranja.'
            },
            {
                id: 'f3', level: 'facil',
                scenario: 'Ana, Carlos e Lúcia trabalham como médica, professor e engenheira, uma profissão cada.',
                clues: [
                    'Carlos é professor.',
                    'Ana não é engenheira.'
                ],
                question: 'Qual a profissão de Ana?',
                options: ['Médica', 'Professora', 'Engenheira'],
                correctIndex: 0,
                explanation: 'Carlos = professor. Ana não engenheira → Ana = médica. Lúcia = engenheira.'
            },
            {
                id: 'f4', level: 'facil',
                scenario: 'Cachorro (late), gato (mia), pássaro (canta) e peixe (silêncio).',
                clues: [
                    'O cachorro late.',
                    'O gato mia.',
                    'O pássaro canta.',
                    'Um deles não emite som.'
                ],
                question: 'Qual animal fica em silêncio?',
                options: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'],
                correctIndex: 3,
                explanation: 'Cachorro late, gato mia, pássaro canta. Peixe é o único sem som.'
            },
            {
                id: 'f5', level: 'facil',
                scenario: 'Três carros na garagem: azul, vermelho e branco. Marcas: Fiat, Ford e VW.',
                clues: [
                    'O carro branco é Volkswagen.',
                    'O carro azul é Fiat.'
                ],
                question: 'Qual a marca do carro vermelho?',
                options: ['Fiat', 'Ford', 'VW'],
                correctIndex: 1,
                explanation: 'Branco = VW, Azul = Fiat. Vermelho = Ford.'
            },
            {
                id: 'f6', level: 'facil',
                scenario: 'Três netos — Lucas, Sofia e Gabriel — praticam: natação, futebol e balé.',
                clues: [
                    'Sofia faz balé.',
                    'Gabriel não sabe nadar.',
                    'Lucas não gosta de esportes com bola.'
                ],
                question: 'Qual esporte Lucas pratica?',
                options: ['Natação', 'Futebol', 'Balé'],
                correctIndex: 0,
                explanation: 'Sofia = balé. Gabriel não sabe nadar → Gabriel = futebol. Lucas não gosta de bola → Lucas = natação.'
            },
            {
                id: 'f7', level: 'facil',
                scenario: 'Quatro pessoas em andares diferentes (1º ao 4º).',
                clues: [
                    'Roberto mora no 3º andar.',
                    'Pedro mora no 1º andar.',
                    'Cláudia mora acima de Roberto.',
                    'Ana mora entre Roberto e Pedro.'
                ],
                question: 'Em que andar mora Ana?',
                options: ['1º', '2º', '3º', '4º'],
                correctIndex: 1,
                explanation: 'Pedro = 1º, Roberto = 3º. Cláudia acima (4º). Ana entre 1º e 3º = 2º.'
            },
            {
                id: 'f8', level: 'facil',
                scenario: 'Na quitanda, três produtos: queijo, pão e café. Preços: R$ 8, R$ 12 e R$ 15.',
                clues: [
                    'O café custa R$ 12.',
                    'O pão custa menos que o café.',
                    'O queijo custa mais que o pão.'
                ],
                question: 'Quanto custa o queijo?',
                options: ['R$ 8', 'R$ 12', 'R$ 15'],
                correctIndex: 2,
                explanation: 'Café = R$ 12. Pão < R$ 12 → pão = R$ 8. Queijo > pão → queijo = R$ 15.'
            },
            {
                id: 'f9', level: 'facil',
                scenario: 'Avó, mãe e filha têm 35, 60 e 85 anos (uma cada).',
                clues: [
                    'A avó é a mais velha.',
                    'A filha é mais nova que a mãe.',
                    'A mãe não tem 60 anos.'
                ],
                question: 'Quantos anos tem a mãe?',
                options: ['35', '60', '85'],
                correctIndex: 0,
                explanation: 'Avó = 85. Filha < mãe. Mãe não 60 → mãe = 35. Filha = 60.'
            },
            {
                id: 'f10', level: 'facil',
                scenario: 'Quatro objetos numa mesa: livro, caneta, copo e chave. Cores: azul, verde, vermelho e preto.',
                clues: [
                    'A caneta é azul.',
                    'O copo é verde.',
                    'A chave não é preta.'
                ],
                question: 'Qual a cor do livro?',
                options: ['Azul', 'Verde', 'Vermelho', 'Preto'],
                correctIndex: 3,
                explanation: 'Caneta = azul, copo = verde. Chave não preta → chave = vermelha. Livro = preto.'
            },
            {
                id: 'f11', level: 'facil',
                scenario: 'Três irmãos — Beto, Cássia e Davi — têm alturas: 1,60m, 1,70m e 1,80m.',
                clues: [
                    'Davi é o mais alto.',
                    'Beto é mais baixo que Cássia.',
                    'Beto não tem 1,70m.'
                ],
                question: 'Qual a altura de Beto?',
                options: ['1,60m', '1,70m', '1,80m'],
                correctIndex: 0,
                explanation: 'Davi = 1,80. Beto < Cássia e Beto ≠ 1,70 → Beto = 1,60, Cássia = 1,70.'
            },
            // ===== MÉDIO (3-4 elementos, pistas combinadas) =====
            {
                id: 'm1', level: 'medio',
                scenario: 'Quatro amigos — Paulo, Ricardo, Sofia e Tais — estão em uma fila (1º ao 4º).',
                clues: [
                    'Sofia está na frente de Ricardo.',
                    'Paulo está atrás de Tais.',
                    'Tais está na frente de Sofia.',
                    'Ricardo não é o último.'
                ],
                question: 'Quem está em 1º lugar?',
                options: ['Paulo', 'Ricardo', 'Sofia', 'Tais'],
                correctIndex: 3,
                explanation: 'Tais → Sofia → Ricardo. Paulo atrás de Tais. Ricardo não último → Paulo último. Fila: Tais(1ª), Sofia(2ª), Ricardo(3ª), Paulo(4ª).'
            },
            {
                id: 'm2', level: 'medio',
                scenario: 'Quatro profissionais — A, B, C e D — têm especialidades: cardio, dermato, neuro e ortopedia.',
                clues: [
                    'A não é cardiologista nem ortopedista.',
                    'B é neurologista.',
                    'D é ortopedista.',
                    'O cardiologista não é C.'
                ],
                question: 'Qual a especialidade de A?',
                options: ['Cardio', 'Dermato', 'Neuro', 'Ortopedia'],
                correctIndex: 1,
                explanation: 'B = Neuro, D = Ortop. A não Cardio nem Ortop → A = Dermato ou Neuro. Neuro é B → A = Dermato. C = Cardio.'
            },
            {
                id: 'm3', level: 'medio',
                scenario: 'Quatro caixas (1 a 4) com objetos: bola, livro, caneca e boneco.',
                clues: [
                    'A bola está em caixa de número ímpar.',
                    'O livro está logo à direita da bola.',
                    'A caneca está entre dois objetos.',
                    'O boneco está na caixa 4.'
                ],
                question: 'Em que caixa está a caneca?',
                options: ['Caixa 1', 'Caixa 2', 'Caixa 3', 'Caixa 4'],
                correctIndex: 1,
                explanation: 'Boneco = 4. Bola em ímpar (1 ou 3). Livro à direita da bola: se bola=1, livro=2. Se bola=3, livro=4 (ocupado). Então bola=1, livro=2. Caneca entre dois objetos → caneca=3 (entre 2 e 4). Resposta: caixa 3.'
            },
            {
                id: 'm4', level: 'medio',
                scenario: 'Cinco crianças — Ana, Beto, Caio, Duda e Eva — ganharam 1, 2, 3, 4 e 5 balas.',
                clues: [
                    'Ana ganhou mais que Beto.',
                    'Caio ganhou o dobro de Duda.',
                    'Eva ganhou menos que Ana.',
                    'Beto ganhou 3 balas.',
                    'Duda não ganhou a menor quantidade.'
                ],
                question: 'Quantas balas Ana ganhou?',
                options: ['2', '3', '4', '5'],
                correctIndex: 3,
                explanation: 'Beto = 3. Caio = 2×Duda. Duda não 1 → Caio=4, Duda=2. Ana > Beto(3) e Eva < Ana → Ana=5, Eva=1.'
            },
            {
                id: 'm5', level: 'medio',
                scenario: 'Quatro casas em fila: Azul, Verde, Vermelha e Amarela.',
                clues: [
                    'Azul está à esquerda da Verde.',
                    'Vermelha está entre a Azul e a Amarela.',
                    'Verde está na ponta direita.'
                ],
                question: 'Qual a posição da Amarela?',
                options: ['1ª (esquerda)', '2ª', '3ª', '4ª (direita)'],
                correctIndex: 2,
                explanation: 'Verde = 4ª. Azul à esquerda de Verde. Vermelha entre Azul e Amarela. Sequência: Azul(1ª), Vermelha(2ª), Amarela(3ª), Verde(4ª).'
            },
            {
                id: 'm6', level: 'medio',
                scenario: 'Cinco times — A, B, C, D e E — em posições (1º ao 5º).',
                clues: [
                    'A > C (A na frente de C)',
                    'D > B',
                    'E está entre B e D.',
                    'C não é o último.',
                    'A > B'
                ],
                question: 'Qual time ficou em 3º?',
                options: ['A', 'B', 'C', 'D', 'E'],
                correctIndex: 4,
                explanation: 'Relações: D > E > B, A > B, A > C, C não último. Ordem: D, A, E, B, C. 3º = E.'
            },
            {
                id: 'm7', level: 'medio',
                scenario: 'Quatro amigos — J, K, L e M — pediram: café, chá, suco e refrigerante.',
                clues: [
                    'J não pediu café nem refrigerante.',
                    'K pediu chá.',
                    'L pediu refrigerante.'
                ],
                question: 'O que J pediu?',
                options: ['Café', 'Chá', 'Suco', 'Refrigerante'],
                correctIndex: 2,
                explanation: 'K = Chá, L = Refri. J não Café nem Refri → J = Suco. M = Café.'
            },
            {
                id: 'm8', level: 'medio',
                scenario: 'Cinco livros: Romance, Poesia, Drama, Aventura e Biografia, lado a lado.',
                clues: [
                    'Romance está entre Drama e Poesia.',
                    'Aventura está na ponta direita.',
                    'Biografia está na ponta esquerda.',
                    'Drama está à esquerda do Romance.'
                ],
                question: 'Qual livro está no centro (3ª)?',
                options: ['Romance', 'Poesia', 'Drama', 'Aventura', 'Biografia'],
                correctIndex: 0,
                explanation: 'Bio(1ª), Av(5ª). Drama < Romance. Romance entre Drama e Poesia. Sequência: Bio, Drama, Romance, Poesia, Av. Centro = Romance.'
            },
            {
                id: 'm9', level: 'medio',
                scenario: 'Três casais (Aa, Bb, Cc) em 6 assentos lado a lado.',
                clues: [
                    'Cada pessoa ao lado do seu par.',
                    'A sentou à esquerda de a.',
                    'B sentou na ponta direita (assento 6).',
                    'c sentou entre A e b.',
                    'C sentou no assento 1.'
                ],
                question: 'Quem sentou no assento 3?',
                options: ['A', 'a', 'B', 'b', 'C', 'c'],
                correctIndex: 5,
                explanation: 'C=1, B=6. A à esquerda de a → A-a juntos. c entre A e b. Sequência: C(1), A(2), c(3), b(4), a(5), B(6). Assento 3 = c.'
            },
            // ===== DIFÍCIL (4-5 elementos, mais pistas) =====
            {
                id: 'd1', level: 'dificil',
                scenario: 'Em um concurso, 6 candidatos — A1, A2, A3, A4, A5, A6 — ficaram em posições distintas (1ª a 6ª).',
                clues: [
                    'A2 ficou entre A6 e A3.',
                    'A1 ficou na frente de A4 e de A5.',
                    'A4 ficou na frente de A6.',
                    'A5 ficou atrás de A3.',
                    'A3 não ficou na frente de A1.',
                    'A6 ficou em 5º lugar.'
                ],
                question: 'Qual candidato ficou em 1º?',
                options: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
                correctIndex: 0,
                explanation: 'A6=5º. A4 > A6 → A4=3º ou 4º. A2 entre A6(5) e A3: A2=4º, A3=2º ou 3º. A1 > A4 e A5. A3 não > A1. A5 < A3. Ordem: A1(1º), A3(2º), A4(3º), A2(4º), A6(5º), A5(6º). 1º = A1.'
            },
            {
                id: 'd2', level: 'dificil',
                scenario: 'Em um edifício de 6 andares (1º ao 6º), seis famílias — Souza, Lima, Costa, Rocha, Dias e Nunes.',
                clues: [
                    'Nunes mora no 6º andar.',
                    'Costa mora em andar par abaixo do 4º.',
                    'Souza mora dois andares acima de Lima.',
                    'Rocha mora entre Dias e Nunes.',
                    'Dias não mora no último andar.',
                    'Lima não mora no 1º andar.'
                ],
                question: 'Em que andar mora Rocha?',
                options: ['2º', '3º', '4º', '5º'],
                correctIndex: 2,
                explanation: 'Nunes=6. Costa=2 (par<4). Souza=Lima+2. Lima não 1 → Lima=3, Souza=5 (Lima=4→Souza=6 ocupado). Rocha entre Dias e Nunes(6). Dias≠6. Andares: 1=Dias, 2=Costa, 3=Lima, 4=Rocha, 5=Souza, 6=Nunes. Rocha está entre Dias(1) e Nunes(6) → sim. Rocha=4º.'
            },
            {
                id: 'd3', level: 'dificil',
                scenario: 'Seis alunos — A, B, C, D, E e F — estão em ordem de nota (1ª maior a 6ª menor).',
                clues: [
                    'A nota de A é maior que C e que D.',
                    'A nota de B está entre E e F.',
                    'A nota de D é maior que E.',
                    'A nota de F é maior que A.',
                    'A nota de C é menor que D.',
                    'E não é o último (6º).'
                ],
                question: 'Qual aluno tem a 4ª maior nota?',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctIndex: 1,
                explanation: 'F > A > D > E, e F > A > C, e B entre E e F, C < D, E não último. Sequência: F(1ª), A(2ª), D(3ª), B(4ª), E(5ª), C(6ª). 4ª = B.'
            },
            {
                id: 'd4', level: 'dificil',
                scenario: 'Seis amigos — Alberto, Beatriz, Caio, Daniela, Eduardo e Fernanda — cada um de uma cidade: Rio, SP, BH, Salvador, Fortaleza e Curitiba.',
                clues: [
                    'Alberto é do Rio.',
                    'Caio é de Curitiba.',
                    'Beatriz é de Salvador.',
                    'Eduardo não é de SP nem de BH.',
                    'Daniela não é de SP.',
                    'Fernanda não é de Fortaleza.'
                ],
                question: 'De que cidade é Daniela?',
                options: ['Rio', 'SP', 'BH', 'Salvador', 'Fortaleza', 'Curitiba'],
                correctIndex: 1,
                explanation: 'Alberto=Rio, Caio=Curitiba, Beatriz=Salvador. Sobram: SP, BH, Fortaleza para Daniela, Eduardo, Fernanda. Eduardo≠SP≠BH → Eduardo=Fortaleza. Fernanda≠Fortaleza → Fernanda=SP ou BH. Daniela≠SP → Daniela=BH, Fernanda=SP. Resposta: BH.'
            },
            {
                id: 'd5', level: 'dificil',
                scenario: 'Em um campeonato, 5 times — Alpha, Beta, Gamma, Delta, Epsilon — (1º ao 5º).',
                clues: [
                    'Alpha > Gamma e Alpha > Epsilon.',
                    'Beta está entre Delta e Gamma.',
                    'Delta > Alpha.',
                    'Epsilon não é o último.',
                    'Gamma < Epsilon.'
                ],
                question: 'Qual time ficou em 4º?',
                options: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
                correctIndex: 1,
                explanation: 'Delta > Alpha, Alpha > Gamma, Alpha > Epsilon, Epsilon > Gamma. Beta entre Delta e Gamma. Epsilon não último. Ordem: Delta(1º), Alpha(2º), Epsilon(3º), Beta(4º), Gamma(5º). Verificando: Beta(4) entre Delta(1) e Gamma(5) sim, Epsilon(3) > Gamma(5) sim. 4º = Beta.'
            },
            {
                id: 'd6', level: 'dificil',
                scenario: 'Seis pessoas — P1, P2, P3, P4, P5, P6 — em uma fila (1º ao 6º).',
                clues: [
                    'P1 está entre P3 e P5.',
                    'P2 está na frente de P4.',
                    'P3 está atrás de P5.',
                    'P4 está entre P6 e P2.',
                    'P5 não está nas pontas.',
                    'P6 está na 2ª posição.'
                ],
                question: 'Quem está na 4ª posição?',
                options: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
                correctIndex: 4,
                explanation: 'P6=2ª. P2 > P4, P4 entre P6(2) e P2 → P4=3ª, P2=5ª ou 4ª. P3 < P5. P1 entre P3 e P5. P5 não pontas. Posições: 1ª=P3, 2ª=P6, 3ª=P4, 4ª=P5, 5ª=P2, 6ª=P1. P1 entre P3(1) e P5(4) sim. P4 entre P6(2) e P2(5) → 3 entre 2 e 5 sim. P5 não ponta=4ª ok. 4ª = P5.'
            }
        ];
    }

    function getPuzzlesForLevel(level) {
        return PUZZLES.filter(function(p) { return p.level === level; });
    }

    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    function getDifficultyLabel(level) {
        switch (level) {
            case 'facil': return 'Fácil';
            case 'medio': return 'Médio';
            case 'dificil': return 'Difícil';
        }
        return '';
    }

    function initGame() {
        var available = getPuzzlesForLevel(currentLevel);
        available = shuffleArray(available);

        levelPuzzles = [];
        for (var i = 0; i < totalPuzzles && i < available.length; i++) {
            levelPuzzles.push(available[i]);
        }

        while (levelPuzzles.length < totalPuzzles) {
            var pool = shuffleArray(getPuzzlesForLevel(currentLevel));
            levelPuzzles.push(JSON.parse(JSON.stringify(pool[0])));
            levelPuzzles[levelPuzzles.length - 1].id += '_e' + levelPuzzles.length;
        }

        currentPuzzleIndex = 0;
        score = 0;
        streak = 0;
        answered = false;

        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        renderPuzzle();
    }

    function renderPuzzle() {
        if (currentPuzzleIndex >= levelPuzzles.length) {
            showCompletion();
            return;
        }

        answered = false;
        var puzzle = levelPuzzles[currentPuzzleIndex];
        var letters = ['A', 'B', 'C', 'D', 'E', 'F'];

        document.getElementById('puzzleNum').textContent = (currentPuzzleIndex + 1) + '/' + levelPuzzles.length;
        document.getElementById('scenario').textContent = puzzle.scenario;

        var cluesList = document.getElementById('cluesList');
        cluesList.innerHTML = '';
        puzzle.clues.forEach(function(clue) {
            var li = document.createElement('li');
            li.textContent = clue;
            cluesList.appendChild(li);
        });

        document.getElementById('question').textContent = puzzle.question;

        var optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        puzzle.options.forEach(function(opt, i) {
            var btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.index = i;

            var letterSpan = document.createElement('span');
            letterSpan.className = 'option-letter';
            letterSpan.textContent = letters[i] || (i + 1);

            var textSpan = document.createElement('span');
            textSpan.textContent = opt;

            btn.appendChild(letterSpan);
            btn.appendChild(textSpan);
            btn.addEventListener('click', function() {
                handleAnswer(parseInt(this.dataset.index));
            });
            optionsContainer.appendChild(btn);
        });

        document.getElementById('explanation').className = 'puzzle-explanation';
        document.getElementById('explanation').innerHTML = '';

        var nextBtn = document.getElementById('btn-next');
        nextBtn.style.display = 'none';
    }

    function handleAnswer(selectedIndex) {
        if (answered) return;
        answered = true;

        var puzzle = levelPuzzles[currentPuzzleIndex];
        var options = document.querySelectorAll('.option-btn');
        var correct = selectedIndex === puzzle.correctIndex;

        options.forEach(function(btn, i) {
            btn.classList.add('disabled');
            if (i === puzzle.correctIndex) {
                btn.classList.add('correct');
            } else if (i === selectedIndex && !correct) {
                btn.classList.add('incorrect');
            }
        });

        var explanation = document.getElementById('explanation');
        if (correct) {
            score++;
            streak++;
            explanation.className = 'puzzle-explanation show correct';
            explanation.innerHTML = '<strong>Correto!</strong> ' + puzzle.explanation;
        } else {
            streak = 0;
            explanation.className = 'puzzle-explanation show incorrect';
            explanation.innerHTML = '<strong>Resposta: ' + puzzle.options[puzzle.correctIndex] + '</strong><br>' + puzzle.explanation;
        }

        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        document.getElementById('btn-next').style.display = 'inline-flex';
    }

    function nextPuzzle() {
        currentPuzzleIndex++;
        renderPuzzle();
    }

    function showCompletion() {
        var icon = document.getElementById('feedbackIcon');
        var title = document.getElementById('feedbackTitle');
        var text = document.getElementById('feedbackText');

        if (score === levelPuzzles.length) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            title.textContent = 'Perfeito!';
            text.textContent = 'Você acertou todas as ' + levelPuzzles.length + ' questões!';
        } else if (score >= levelPuzzles.length * 0.7) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Muito bem!';
            text.textContent = 'Acertou ' + score + ' de ' + levelPuzzles.length + ' questões.';
        } else {
            icon.className = 'icon finished';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Rodada concluída!';
            text.textContent = 'Acertou ' + score + ' de ' + levelPuzzles.length + '. Tente novamente!';
        }

        document.getElementById('feedbackBtn').onclick = function() {
            closeFeedback();
            initGame();
        };
        document.getElementById('overlay').classList.add('show');
        document.getElementById('feedbackModal').classList.add('show');
    }

    function closeFeedback() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('feedbackModal').classList.remove('show');
    }

    function changeDifficulty(level) {
        currentLevel = level;
        document.querySelectorAll('.dif-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.dif === level);
        });
        initGame();
    }

    document.querySelectorAll('.dif-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            changeDifficulty(this.dataset.dif);
        });
    });

    document.getElementById('btn-next').addEventListener('click', nextPuzzle);
    document.getElementById('btn-restart').addEventListener('click', function() {
        exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
            initGame();
        });
    });

    generatePuzzles();
    initGame();
});
