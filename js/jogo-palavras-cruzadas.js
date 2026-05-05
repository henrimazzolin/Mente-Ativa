document.addEventListener('DOMContentLoaded', function() {

const temas = [
    {
        tema: "Partes do Corpo",
        gridSize: 10,
        palavras: [
            { palavra: "BRACO", linha: 0, coluna: 1, direcao: "horizontal", dica: "Ligado ao ombro, usado para levantar e segurar coisas" },
            { palavra: "OLHO", linha: 2, coluna: 3, direcao: "vertical", dica: "Parte do corpo que usamos para enxergar" },
            { palavra: "MAO", linha: 4, coluna: 1, direcao: "horizontal", dica: "Extremidade do braço com dedos para pegar objetos" },
            { palavra: "PE", linha: 6, coluna: 5, direcao: "vertical", dica: "Parte do corpo que fica no final da perna" }
        ]
    },
    {
        tema: "Animais",
        gridSize: 10,
        palavras: [
            { palavra: "GATO", linha: 0, coluna: 2, direcao: "horizontal", dica: "Animal doméstico que mia e gosta de caçar ratos" },
            { palavra: "CACHORRO", linha: 2, coluna: 0, direcao: "horizontal", dica: "Animal fiel que late e protege a casa" },
            { palavra: "PEIXE", linha: 4, coluna: 4, direcao: "vertical", dica: "Animal que vive na água e respira por brânquias" },
            { palavra: "PATO", linha: 7, coluna: 1, direcao: "horizontal", dica: "Ave com bico largo que nada em lagoas" }
        ]
    },
    {
        tema: "Frutas",
        gridSize: 10,
        palavras: [
            { palavra: "BANANA", linha: 0, coluna: 0, direcao: "horizontal", dica: "Fruta amarela, alongada e fácil de descascar" },
            { palavra: "UVA", linha: 1, coluna: 3, direcao: "vertical", dica: "Fruta pequena que cresce em cachos" },
            { palavra: "MACA", linha: 3, coluna: 1, direcao: "horizontal", dica: "Fruta redonda com casca vermelha ou verde" },
            { palavra: "PERA", linha: 5, coluna: 4, direcao: "vertical", dica: "Fruta suculenta com formato mais largo embaixo" }
        ]
    },
    {
        tema: "Cores",
        gridSize: 10,
        palavras: [
            { palavra: "AZUL", linha: 0, coluna: 0, direcao: "horizontal", dica: "Cor do céu em dias claros" },
            { palavra: "VERDE", linha: 1, coluna: 2, direcao: "vertical", dica: "Cor das plantas e da natureza" },
            { palavra: "VERMELHO", linha: 3, coluna: 1, direcao: "horizontal", dica: "Cor forte associada ao sangue e ao amor" },
            { palavra: "AMARELO", linha: 5, coluna: 0, direcao: "horizontal", dica: "Cor do sol e de objetos bem brilhantes" }
        ]
    },
    {
        tema: "Profissoes",
        gridSize: 10,
        palavras: [
            { palavra: "MEDICO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Profissional que cuida da saúde das pessoas" },
            { palavra: "PROFESSOR", linha: 2, coluna: 1, direcao: "horizontal", dica: "Profissional que ensina em sala de aula" },
            { palavra: "ENGENHEIRO", linha: 4, coluna: 0, direcao: "horizontal", dica: "Profissional que projeta construções" },
            { palavra: "COZINHEIRO", linha: 6, coluna: 2, direcao: "vertical", dica: "Profissional que prepara alimentos" }
        ]
    },
    {
        tema: "Transportes",
        gridSize: 10,
        palavras: [
            { palavra: "CARRO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Veículo com quatro rodas usado nas ruas" },
            { palavra: "AVIAO", linha: 1, coluna: 3, direcao: "vertical", dica: "Meio de transporte que voa pelo céu" },
            { palavra: "TREM", linha: 3, coluna: 1, direcao: "horizontal", dica: "Transporte que anda sobre trilhos" },
            { palavra: "BICICLETA", linha: 5, coluna: 0, direcao: "horizontal", dica: "Veículo de duas rodas movido a pedal" }
        ]
    },
    {
        tema: "Alimentos",
        gridSize: 10,
        palavras: [
            { palavra: "ARROZ", linha: 0, coluna: 0, direcao: "horizontal", dica: "Grão branco muito consumido nas refeições" },
            { palavra: "FEIJAO", linha: 1, coluna: 3, direcao: "vertical", dica: "Alimento comum no Brasil, rico em nutrientes" },
            { palavra: "LEITE", linha: 3, coluna: 1, direcao: "horizontal", dica: "Bebida branca vinda da vaca" },
            { palavra: "PAO", linha: 5, coluna: 4, direcao: "vertical", dica: "Alimento feito de farinha e assado" }
        ]
    },
    {
        tema: "Esportes",
        gridSize: 10,
        palavras: [
            { palavra: "FUTEBOL", linha: 0, coluna: 0, direcao: "horizontal", dica: "Esporte jogado com os pés e uma bola" },
            { palavra: "NATACAO", linha: 2, coluna: 2, direcao: "vertical", dica: "Esporte praticado dentro da água" },
            { palavra: "TENIS", linha: 4, coluna: 0, direcao: "horizontal", dica: "Esporte jogado com raquete e bola" },
            { palavra: "VOLEI", linha: 6, coluna: 3, direcao: "vertical", dica: "Esporte em que se passa a bola por cima da rede" }
        ]
    },
    {
        tema: "Natureza",
        gridSize: 10,
        palavras: [
            { palavra: "ARVORE", linha: 0, coluna: 0, direcao: "horizontal", dica: "Planta grande com tronco, galhos e folhas" },
            { palavra: "RIO", linha: 1, coluna: 4, direcao: "vertical", dica: "Água corrente que atravessa a terra" },
            { palavra: "MONTANHA", linha: 3, coluna: 1, direcao: "horizontal", dica: "Grande elevação natural do terreno" },
            { palavra: "FLOR", linha: 5, coluna: 3, direcao: "vertical", dica: "Parte colorida e cheirosa das plantas" }
        ]
    },
    {
        tema: "Objetos",
        gridSize: 10,
        palavras: [
            { palavra: "CADEIRA", linha: 0, coluna: 0, direcao: "horizontal", dica: "Objeto usado para sentar" },
            { palavra: "MESA", linha: 1, coluna: 4, direcao: "vertical", dica: "Móvel onde colocamos objetos" },
            { palavra: "LAMPADA", linha: 3, coluna: 1, direcao: "horizontal", dica: "Objeto que ilumina ambientes" },
            { palavra: "LIVRO", linha: 5, coluna: 3, direcao: "vertical", dica: "Conjunto de páginas para leitura" }
        ]
    },
    {
        tema: "Clima",
        gridSize: 10,
        palavras: [
            { palavra: "CHUVA", linha: 0, coluna: 0, direcao: "horizontal", dica: "Água que cai das nuvens" },
            { palavra: "SOL", linha: 1, coluna: 3, direcao: "vertical", dica: "Estrela que ilumina e aquece a Terra" },
            { palavra: "VENTO", linha: 3, coluna: 1, direcao: "horizontal", dica: "Ar em movimento que sentimos na pele" },
            { palavra: "NEVE", linha: 5, coluna: 4, direcao: "vertical", dica: "Forma congelada da água que cai no frio" }
        ]
    },
    {
        tema: "Familia",
        gridSize: 10,
        palavras: [
            { palavra: "MAE", linha: 0, coluna: 0, direcao: "horizontal", dica: "Mulher que cuida e cria os filhos" },
            { palavra: "PAI", linha: 1, coluna: 2, direcao: "vertical", dica: "Homem que cuida e cria os filhos" },
            { palavra: "IRMAO", linha: 3, coluna: 0, direcao: "horizontal", dica: "Filho dos mesmos pais que você" },
            { palavra: "AVO", linha: 5, coluna: 3, direcao: "vertical", dica: "Pai ou mãe do seu pai ou da sua mãe" }
        ]
    },
    {
        tema: "Escola",
        gridSize: 10,
        palavras: [
            { palavra: "QUADRO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Superfície onde o professor escreve" },
            { palavra: "CADERNO", linha: 2, coluna: 1, direcao: "horizontal", dica: "Usado para fazer anotações das aulas" },
            { palavra: "LAPIS", linha: 4, coluna: 0, direcao: "vertical", dica: "Objeto usado para escrever ou desenhar" },
            { palavra: "GIZ", linha: 6, coluna: 3, direcao: "vertical", dica: "Material usado para escrever no quadro" }
        ]
    },
    {
        tema: "Cidades",
        gridSize: 10,
        palavras: [
            { palavra: "SAOPAULO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Maior cidade do Brasil em população" },
            { palavra: "RIO", linha: 2, coluna: 3, direcao: "vertical", dica: "Cidade famosa pelo Cristo Redentor" },
            { palavra: "BRASILIA", linha: 4, coluna: 0, direcao: "horizontal", dica: "Capital do Brasil" },
            { palavra: "SALVADOR", linha: 6, coluna: 2, direcao: "vertical", dica: "Cidade histórica da Bahia" }
        ]
    },
    {
        tema: "Musica",
        gridSize: 10,
        palavras: [
            { palavra: "VIOLAO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Instrumento de cordas tocado com as mãos" },
            { palavra: "PIANO", linha: 1, coluna: 4, direcao: "vertical", dica: "Instrumento tocado pressionando teclas" },
            { palavra: "BATUCA", linha: 3, coluna: 1, direcao: "horizontal", dica: "Ato de bater ritmo com as mãos ou instrumentos" },
            { palavra: "FLAUTA", linha: 5, coluna: 3, direcao: "vertical", dica: "Instrumento de sopro que produz som pelo ar" }
        ]
    },
    {
        tema: "Tecnologia",
        gridSize: 10,
        palavras: [
            { palavra: "COMPUTADOR", linha: 0, coluna: 0, direcao: "horizontal", dica: "Máquina usada para processar informações" },
            { palavra: "CELULAR", linha: 2, coluna: 2, direcao: "vertical", dica: "Dispositivo portátil para comunicação" },
            { palavra: "INTERNET", linha: 4, coluna: 0, direcao: "horizontal", dica: "Rede que conecta pessoas e informações" },
            { palavra: "TECLADO", linha: 6, coluna: 3, direcao: "vertical", dica: "Conjunto de teclas usado para digitar" }
        ]
    },
    {
        tema: "Paises",
        gridSize: 10,
        palavras: [
            { palavra: "BRASIL", linha: 0, coluna: 0, direcao: "horizontal", dica: "País da América do Sul onde se fala português" },
            { palavra: "JAPAO", linha: 1, coluna: 4, direcao: "vertical", dica: "País asiático conhecido pela tecnologia e cultura" },
            { palavra: "FRANCA", linha: 3, coluna: 1, direcao: "horizontal", dica: "País europeu famoso pela Torre Eiffel" },
            { palavra: "CHINA", linha: 5, coluna: 3, direcao: "vertical", dica: "País mais populoso do mundo" }
        ]
    },
    {
        tema: "Roupas",
        gridSize: 10,
        palavras: [
            { palavra: "CAMISA", linha: 0, coluna: 0, direcao: "horizontal", dica: "Roupa usada na parte de cima do corpo" },
            { palavra: "CALCA", linha: 1, coluna: 3, direcao: "vertical", dica: "Roupa que cobre as pernas" },
            { palavra: "SAPATO", linha: 3, coluna: 1, direcao: "horizontal", dica: "Calçado usado nos pés" },
            { palavra: "BONE", linha: 5, coluna: 4, direcao: "vertical", dica: "Acessório usado na cabeça para proteção do sol" }
        ]
    },
    {
        tema: "Bebidas",
        gridSize: 10,
        palavras: [
            { palavra: "AGUA", linha: 0, coluna: 0, direcao: "horizontal", dica: "Líquido essencial para a vida" },
            { palavra: "CAFE", linha: 1, coluna: 2, direcao: "vertical", dica: "Bebida escura feita do grão torrado" },
            { palavra: "SUCO", linha: 3, coluna: 0, direcao: "horizontal", dica: "Bebida feita a partir de frutas" },
            { palavra: "CHA", linha: 5, coluna: 3, direcao: "vertical", dica: "Bebida quente feita com ervas" }
        ]
    },
    {
        tema: "Sentimentos",
        gridSize: 10,
        palavras: [
            { palavra: "AMOR", linha: 0, coluna: 0, direcao: "horizontal", dica: "Sentimento de carinho forte por alguém" },
            { palavra: "ODIO", linha: 1, coluna: 3, direcao: "vertical", dica: "Sentimento intenso de raiva ou rejeição" },
            { palavra: "ALEGRIA", linha: 3, coluna: 0, direcao: "horizontal", dica: "Sensação de felicidade e bem-estar" },
            { palavra: "MEDO", linha: 5, coluna: 4, direcao: "vertical", dica: "Sensação de insegurança diante de perigo" }
        ]
    },
    {
        tema: "Instrumentos",
        gridSize: 10,
        palavras: [
            { palavra: "MARTELO", linha: 0, coluna: 0, direcao: "horizontal", dica: "Ferramenta usada para bater pregos" },
            { palavra: "SERROTE", linha: 2, coluna: 2, direcao: "vertical", dica: "Ferramenta usada para cortar madeira" },
            { palavra: "ALICATE", linha: 4, coluna: 0, direcao: "horizontal", dica: "Ferramenta usada para segurar ou cortar fios" },
            { palavra: "CHAVE", linha: 6, coluna: 3, direcao: "vertical", dica: "Objeto usado para abrir fechaduras" }
        ]
    }
];

    let currentTema = null;
    let currentWord = null;
    let currentHint = null;
    let lastTemaIndex = -1;

    function generateLayout(tema) {
        const size = tema.gridSize;
        const layout = Array.from({ length: size }, () => Array(size).fill('#'));

        tema.palavras.forEach(p => {
            const { palavra, linha, coluna, direcao } = p;
            for (let i = 0; i < palavra.length; i++) {
                if (direcao === 'horizontal') {
                    if (coluna + i < size) {
                        layout[linha][coluna + i] = palavra[i];
                    }
                } else {
                    if (linha + i < size) {
                        layout[linha + i][coluna] = palavra[i];
                    }
                }
            }
        });

        return layout;
    }

    function selectRandomTema() {
        let availableIndices = temas
            .map((_, index) => index)
            .filter(index => index !== lastTemaIndex);

        if (availableIndices.length === 0) {
            availableIndices = temas.map((_, index) => index);
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        currentTema = temas[randomIndex];
        lastTemaIndex = randomIndex;

        currentTema.layout = generateLayout(currentTema);

        currentTema.words = currentTema.palavras.map((p, i) => ({
            number: i + 1,
            word: p.palavra,
            direction: p.direcao === 'horizontal' ? 'h' : 'v',
            row: p.linha,
            col: p.coluna,
            hint: p.dica,
            reveladas: new Array(p.palavra.length).fill(false)
        }));

        document.getElementById('gameLevel').textContent = 'Tema: ' + currentTema.tema;
    }

    function initGame() {
        selectRandomTema();

        const gridEl = document.getElementById('grid');
        gridEl.innerHTML = '';
        gridEl.style.gridTemplateColumns = 'repeat(' + currentTema.gridSize + ', 1fr)';

        for (let row = 0; row < currentTema.gridSize; row++) {
            for (let col = 0; col < currentTema.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (currentTema.layout[row][col] === '#') {
                    cell.classList.add('blocked');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    
        input.addEventListener('beforeinput', function(e) {
            if (e.data && !/^[A-Za-z]$/.test(e.data)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (!/^[A-Za-z]$/.test(value)) {
                e.target.value = '';
                return;
            }
            e.target.value = value.toUpperCase();
            handleInput(e);
        });
                    
                    input.addEventListener('keydown', handleKeydown);
                    input.addEventListener('focus', handleFocus);
                    input.addEventListener('blur', handleBlur);
                    cell.appendChild(input);

                    const wordNum = getWordNumberAt(row, col);
                    if (wordNum) {
                        const numEl = document.createElement('span');
                        numEl.className = 'cell-number';
                        numEl.textContent = wordNum;
                        cell.appendChild(numEl);
                    }
                }
                gridEl.appendChild(cell);
            }
        }

        renderHints();
    }

    function getWordNumberAt(row, col) {
        for (const word of currentTema.words) {
            if (word.direction === 'h') {
                if (row === word.row && col === word.col) return word.number;
            } else {
                if (row === word.row && col === word.col) return word.number;
            }
        }
        return null;
    }

    function getWordAt(row, col) {
        for (const word of currentTema.words) {
            if (word.direction === 'h') {
                if (row === word.row && col >= word.col && col < word.col + word.word.length) {
                    return word;
                }
            } else {
                if (col === word.col && row >= word.row && row < word.row + word.word.length) {
                    return word;
                }
            }
        }
        return null;
    }

    function renderHints() {
        const hintsH = document.getElementById('hints-h');
        const hintsV = document.getElementById('hints-v');
        hintsH.innerHTML = '';
        hintsV.innerHTML = '';

        currentTema.words.filter(w => w.direction === 'h').forEach(word => {
            const hintEl = createHintElement(word);
            hintsH.appendChild(hintEl);
        });

        currentTema.words.filter(w => w.direction === 'v').forEach(word => {
            const hintEl = createHintElement(word);
            hintsV.appendChild(hintEl);
        });
    }

    function createHintElement(word) {
        const div = document.createElement('div');
        div.className = 'hint-item';
        div.dataset.word = word.number;

        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'flex';
        contentDiv.style.alignItems = 'center';
        contentDiv.style.gap = '10px';
        contentDiv.style.width = '100%';

        const textSpan = document.createElement('span');
        textSpan.innerHTML = '<span class="hint-number">' + word.number + '.</span> <span class="hint-text">' + word.hint + '</span>';

        const hintBtn = document.createElement('button');
        hintBtn.className = 'hint-btn';
        hintBtn.textContent = 'Dica';
        hintBtn.dataset.wordNumber = word.number;

        const allRevealed = word.reveladas && word.reveladas.every(r => r === true);
        if (allRevealed) {
            hintBtn.textContent = 'Completo';
            hintBtn.disabled = true;
            hintBtn.classList.add('hint-btn-disabled');
        }

        hintBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            revelarLetra(word);
        });

        contentDiv.appendChild(textSpan);
        contentDiv.appendChild(hintBtn);
        div.appendChild(contentDiv);

        div.addEventListener('click', function() { selectWord(word); });

        return div;
    }

    function selectWord(word) {
        currentWord = word;
        document.querySelectorAll('.hint-item').forEach(el => el.classList.remove('active'));
        const target = document.querySelector('.hint-item[data-word="' + word.number + '"]');
        if (target) target.classList.add('active');

        const firstCell = document.querySelector('input[data-row="' + word.row + '"][data-col="' + word.col + '"]');
        if (firstCell) {
            firstCell.focus();
        }
    }

    function handleFocus(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const word = getWordAt(row, col);

        if (word) {
            currentWord = word;
            currentHint = word.number;

            document.querySelectorAll('.hint-item').forEach(el => el.classList.remove('active'));
            const hintEl = document.querySelector('.hint-item[data-word="' + word.number + '"]');
            if (hintEl) {
                hintEl.classList.add('active');
            }

            highlightWordCells(word);
        }
    }

    function handleBlur() {
        document.querySelectorAll('.cell input').forEach(function(input) {
            input.classList.remove('active-row');
            input.classList.remove('active-col');
        });
    }

    function highlightWordCells(word) {
        document.querySelectorAll('.cell input').forEach(function(input) {
            input.classList.remove('active-row');
            input.classList.remove('active-col');
        });

        for (let i = 0; i < word.word.length; i++) {
            let input;
            if (word.direction === 'h') {
                input = document.querySelector('input[data-row="' + word.row + '"][data-col="' + (word.col + i) + '"]');
            } else {
                input = document.querySelector('input[data-row="' + (word.row + i) + '"][data-col="' + word.col + '"]');
            }
            if (input) {
                if (word.direction === 'h') {
                    input.classList.add('active-row');
                } else {
                    input.classList.add('active-col');
                }
            }
        }
    }

    function handleInput(e) {
        const value = e.target.value.toUpperCase();
        e.target.value = value;

        if (value) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            moveToNextCell(row, col);
            checkWord();
        }
    }

    function handleKeydown(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (e.key === 'Backspace') {
            if (!e.target.value) {
                moveToPrevCell(row, col);
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveCell(row, col + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveCell(row, col - 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveCell(row + 1, col);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveCell(row - 1, col);
        }
    }

    function moveToNextCell(row, col) {
        const word = getWordAt(row, col);
        if (!word) return;

        if (word.direction === 'h') {
            if (col < word.col + word.word.length - 1) {
                moveCell(row, col + 1);
            }
        } else {
            if (row < word.row + word.word.length - 1) {
                moveCell(row + 1, col);
            }
        }
    }

    function moveToPrevCell(row, col) {
        const word = getWordAt(row, col);
        if (!word) return;

        if (word.direction === 'h') {
            if (col > word.col) {
                moveCell(row, col - 1);
            }
        } else {
            if (row > word.row) {
                moveCell(row - 1, col);
            }
        }
    }

    function moveCell(row, col) {
        if (row >= 0 && row < currentTema.gridSize && col >= 0 && col < currentTema.gridSize) {
            const input = document.querySelector('input[data-row="' + row + '"][data-col="' + col + '"]');
            if (input && currentTema.layout[row][col] !== '#') {
                input.focus();
            }
        }
    }

    function checkWord() {
        if (!currentWord) return;

        let isCorrect = true;
        const inputs = [];

        for (let i = 0; i < currentWord.word.length; i++) {
            let input;
            if (currentWord.direction === 'h') {
                input = document.querySelector('input[data-row="' + currentWord.row + '"][data-col="' + (currentWord.col + i) + '"]');
            } else {
                input = document.querySelector('input[data-row="' + (currentWord.row + i) + '"][data-col="' + currentWord.col + '"]');
            }
            if (input) {
                inputs.push(input);
                if (input.value.toUpperCase() !== currentWord.word[i]) {
                    isCorrect = false;
                }
            }
        }

        if (isCorrect && inputs.every(function(input) { return input.value !== ''; })) {
            inputs.forEach(function(input) { input.classList.add('correct'); });
            const hintEl = document.querySelector('.hint-item[data-word="' + currentWord.number + '"]');
            if (hintEl) hintEl.classList.add('correct');
            checkAllWords();
        } else {
            inputs.forEach(function(input) { input.classList.remove('correct'); });
        }
    }

    function checkAllWords() {
        let allCorrect = true;

        for (const word of currentTema.words) {
            let correct = true;
            for (let i = 0; i < word.word.length; i++) {
                let input;
                if (word.direction === 'h') {
                    input = document.querySelector('input[data-row="' + word.row + '"][data-col="' + (word.col + i) + '"]');
                } else {
                    input = document.querySelector('input[data-row="' + (word.row + i) + '"][data-col="' + word.col + '"]');
                }
                if (!input || input.value.toUpperCase() !== word.word[i]) {
                    correct = false;
                    break;
                }
            }
            if (!correct) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            setTimeout(function() {
                document.getElementById('overlay').classList.add('show');
                document.getElementById('message').classList.add('show');
            }, 500);
        }
    }

    function resetGame() {
        closeMessage();
        document.querySelectorAll('.cell input').forEach(function(input) {
            input.value = '';
            input.classList.remove('correct');
            input.classList.remove('active-row');
            input.classList.remove('active-col');
            input.readOnly = false;
        });
        document.querySelectorAll('.hint-item').forEach(function(el) {
            el.classList.remove('correct');
            el.classList.remove('active');
        });
        document.querySelectorAll('.hint-btn').forEach(function(btn) {
            btn.disabled = false;
            btn.textContent = 'Dica';
            btn.classList.remove('hint-btn-disabled');
        });
        currentWord = null;
        currentHint = null;

        if (currentTema && currentTema.words) {
            currentTema.words.forEach(function(w) {
                w.reveladas = new Array(w.word.length).fill(false);
            });
        }
    }

    function closeMessage() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('message').classList.remove('show');
    }

    function revelarLetra(palavra) {
        if (!palavra || !palavra.reveladas) return;

        for (let i = 0; i < palavra.word.length; i++) {
            if (!palavra.reveladas[i]) {
                palavra.reveladas[i] = true;

                let input;
                if (palavra.direction === 'h') {
                    input = document.querySelector('input[data-row="' + palavra.row + '"][data-col="' + (palavra.col + i) + '"]');
                } else {
                    input = document.querySelector('input[data-row="' + (palavra.row + i) + '"][data-col="' + palavra.col + '"]');
                }
                if (input) {
                    input.value = palavra.word[i];
                    input.classList.add('correct');
                    input.readOnly = true;
                }

                const allRevealed = palavra.reveladas.every(r => r === true);
                if (allRevealed) {
                    const btn = document.querySelector('.hint-btn[data-word-number="' + palavra.number + '"]');
                    if (btn) {
                        btn.textContent = 'Completo';
                        btn.disabled = true;
                        btn.classList.add('hint-btn-disabled');
                    }
                    checkAllWords();
                }

                break;
            }
        }
    }

    document.getElementById('btn-reset').addEventListener('click', resetGame);
    document.getElementById('btn-back').addEventListener('click', function() {
        window.location.href = 'grupo-moderado.html';
    });
    document.getElementById('overlay').addEventListener('click', closeMessage);
    document.getElementById('btn-play-again').addEventListener('click', function() {
        resetGame();
        initGame();
    });

    initGame();
});
