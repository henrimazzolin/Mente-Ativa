document.addEventListener('DOMContentLoaded', function() {

const bancoPalavras = [
    { palavra: "BRACO", dica: "Ligado ao ombro, usado para levantar coisas" },
    { palavra: "OLHO", dica: "Parte do corpo que usamos para enxergar" },
    { palavra: "MAO", dica: "Extremidade do braço com dedos para pegar objetos" },
    { palavra: "PE", dica: "Parte do corpo que fica no final da perna" },
    { palavra: "GATO", dica: "Animal doméstico que mia" },
    { palavra: "CACHORRO", dica: "Animal fiel que late" },
    { palavra: "PEIXE", dica: "Animal que vive na água" },
    { palavra: "PATO", dica: "Ave que nada em lagoas" },
    { palavra: "BANANA", dica: "Fruta amarela e alongada" },
    { palavra: "UVA", dica: "Fruta pequena em cachos" },
    { palavra: "MACA", dica: "Fruta redonda vermelha ou verde" },
    { palavra: "PERA", dica: "Fruta suculenta com formato largo embaixo" },
    { palavra: "AZUL", dica: "Cor do céu em dias claros" },
    { palavra: "VERDE", dica: "Cor das plantas" },
    { palavra: "VERMELHO", dica: "Cor do sangue" },
    { palavra: "AMARELO", dica: "Cor do sol" },
    { palavra: "MEDICO", dica: "Cuida da saúde das pessoas" },
    { palavra: "PROFESSOR", dica: "Ensina em sala de aula" },
    { palavra: "ENGENHEIRO", dica: "Profissional que projeta construções" },
    { palavra: "COZINHEIRO", dica: "Prepara alimentos" },
    { palavra: "CARRO", dica: "Veículo com quatro rodas" },
    { palavra: "AVIAO", dica: "Meio de transporte que voa" },
    { palavra: "TREM", dica: "Transporte sobre trilhos" },
    { palavra: "BICICLETA", dica: "Veículo de duas rodas movido a pedal" },
    { palavra: "ARROZ", dica: "Grão branco muito consumido" },
    { palavra: "FEIJAO", dica: "Alimento rico em nutrientes" },
    { palavra: "LEITE", dica: "Bebida branca vinda da vaca" },
    { palavra: "PAO", dica: "Alimento assado de farinha" },
    { palavra: "FUTEBOL", dica: "Esporte jogado com os pés" },
    { palavra: "NATACAO", dica: "Esporte praticado na água" },
    { palavra: "TENIS", dica: "Esporte com raquete e bola" },
    { palavra: "VOLEI", dica: "Esporte com bola por cima da rede" },
    { palavra: "ARVORE", dica: "Planta grande com tronco e folhas" },
    { palavra: "RIO", dica: "Água corrente que atravessa a terra" },
    { palavra: "MONTANHA", dica: "Grande elevação natural" },
    { palavra: "FLOR", dica: "Parte colorida e cheirosa das plantas" },
    { palavra: "CADEIRA", dica: "Objeto usado para sentar" },
    { palavra: "MESA", dica: "Móvel para colocar objetos" },
    { palavra: "LAMPADA", dica: "Objeto que ilumina ambientes" },
    { palavra: "LIVRO", dica: "Conjunto de páginas para leitura" },
    { palavra: "CHUVA", dica: "Água que cai das nuvens" },
    { palavra: "SOL", dica: "Estrela que ilumina a Terra" },
    { palavra: "VENTO", dica: "Ar em movimento" },
    { palavra: "NEVE", dica: "Água congelada que cai no frio" },
    { palavra: "MAE", dica: "Mulher que cria os filhos" },
    { palavra: "PAI", dica: "Homem que cria os filhos" },
    { palavra: "IRMAO", dica: "Filho dos mesmos pais" },
    { palavra: "AVO", dica: "Pai ou mãe dos seus pais" },
    { palavra: "QUADRO", dica: "Superfície para o professor escrever" },
    { palavra: "CADERNO", dica: "Para anotações das aulas" },
    { palavra: "LAPIS", dica: "Objeto para escrever ou desenhar" },
    { palavra: "GIZ", dica: "Material para escrever no quadro" },
    { palavra: "SAOPAULO", dica: "Maior cidade do Brasil" },
    { palavra: "BRASILIA", dica: "Capital do Brasil" },
    { palavra: "SALVADOR", dica: "Cidade histórica da Bahia" },
    { palavra: "VIOLAO", dica: "Instrumento de cordas" },
    { palavra: "PIANO", dica: "Instrumento com teclas" },
    { palavra: "BATUCA", dica: "Bater ritmo com as mãos" },
    { palavra: "FLAUTA", dica: "Instrumento de sopro" },
    { palavra: "COMPUTADOR", dica: "Máquina para processar informações" },
    { palavra: "CELULAR", dica: "Dispositivo portátil para comunicação" },
    { palavra: "INTERNET", dica: "Rede que conecta pessoas" },
    { palavra: "TECLADO", dica: "Conjunto de teclas para digitar" },
    { palavra: "BRASIL", dica: "País da América do Sul" },
    { palavra: "JAPAO", dica: "País asiático de tecnologia" },
    { palavra: "FRANCA", dica: "País da Torre Eiffel" },
    { palavra: "CHINA", dica: "País mais populoso do mundo" },
    { palavra: "CAMISA", dica: "Roupa para a parte de cima" },
    { palavra: "CALCA", dica: "Roupa que cobre as pernas" },
    { palavra: "SAPATO", dica: "Calçado para os pés" },
    { palavra: "BONE", dica: "Acessório para a cabeça" },
    { palavra: "AGUA", dica: "Líquido essencial para vida" },
    { palavra: "CAFE", dica: "Bebida escura do grão torrado" },
    { palavra: "SUCO", dica: "Bebida feita de frutas" },
    { palavra: "CHA", dica: "Bebida quente de ervas" },
    { palavra: "AMOR", dica: "Sentimento de carinho forte" },
    { palavra: "ODIO", dica: "Sentimento intenso de raiva" },
    { palavra: "ALEGRIA", dica: "Sensação de felicidade" },
    { palavra: "MEDO", dica: "Sensação de insegurança" },
    { palavra: "MARTELO", dica: "Ferramenta para bater pregos" },
    { palavra: "SERROTE", dica: "Ferramenta para cortar madeira" },
    { palavra: "ALICATE", dica: "Ferramenta para segurar fios" },
    { palavra: "CHAVE", dica: "Objeto para abrir fechaduras" }
];

const dificuldades = {
    facil: {
        gridSize: 6,
        minPalavras: 3,
        maxPalavras: 4,
        minLetras: 2,
        maxLetras: 6,
        maxTentativas: 200
    },
    medio: {
        gridSize: 8,
        minPalavras: 4,
        maxPalavras: 6,
        minLetras: 3,
        maxLetras: 8,
        maxTentativas: 300
    },
    dificil: {
        gridSize: 10,
        minPalavras: 6,
        maxPalavras: 8,
        minLetras: 3,
        maxLetras: 10,
        maxTentativas: 500
    }
};

let currentDifficulty = 'facil';
let currentTema = null;
let currentWord = null;
let currentHint = null;
let lastSelectedWord = null;
let gameCompleted = false;

function embaralharArray(arr, random) {
    random = random || Math.random;
    const resultado = [...arr];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

function selecionarPalavras(qtd, minLetras, maxLetras) {
    let candidatas = bancoPalavras.filter(p => 
        p.palavra.length >= minLetras && p.palavra.length <= maxLetras
    );
    candidatas = embaralharArray(candidatas);
    return candidatas.slice(0, qtd);
}

function criarGridVazio(tamanho) {
    return Array.from({ length: tamanho }, () => 
        Array.from({ length: tamanho }, () => ({ letra: null, direcoes: new Set() }))
    );
}

function dentroDoGrid(linha, coluna, tamanho) {
    return linha >= 0 && linha < tamanho && coluna >= 0 && coluna < tamanho;
}

function podeColocar(palavra, linha, coluna, direcao, grid, tamanho, exigirCruzamento) {
    const dr = direcao === 'v' ? 1 : 0;
    const dc = direcao === 'h' ? 1 : 0;
    const fimLinha = linha + dr * (palavra.length - 1);
    const fimColuna = coluna + dc * (palavra.length - 1);
    if (!dentroDoGrid(linha, coluna, tamanho) || !dentroDoGrid(fimLinha, fimColuna, tamanho)) return false;

    const antesLinha = linha - dr;
    const antesColuna = coluna - dc;
    const depoisLinha = fimLinha + dr;
    const depoisColuna = fimColuna + dc;
    if (dentroDoGrid(antesLinha, antesColuna, tamanho) && grid[antesLinha][antesColuna].letra !== null) return false;
    if (dentroDoGrid(depoisLinha, depoisColuna, tamanho) && grid[depoisLinha][depoisColuna].letra !== null) return false;

    let cruzamentos = 0;
    for (let i = 0; i < palavra.length; i++) {
        const r = linha + dr * i;
        const c = coluna + dc * i;
        const celula = grid[r][c];
        if (celula.letra !== null) {
            if (celula.letra !== palavra[i] || celula.direcoes.has(direcao)) return false;
            cruzamentos++;
            continue;
        }

        const vizinhos = direcao === 'h' ? [[r - 1, c], [r + 1, c]] : [[r, c - 1], [r, c + 1]];
        for (const [vr, vc] of vizinhos) {
            if (dentroDoGrid(vr, vc, tamanho) && grid[vr][vc].letra !== null) return false;
        }
    }
    return !exigirCruzamento || cruzamentos > 0;
}

function colocarPalavra(palavra, linha, coluna, direcao, grid) {
    for (let i = 0; i < palavra.length; i++) {
        let r, c;
        if (direcao === 'h') {
            r = linha;
            c = coluna + i;
        } else {
            r = linha + i;
            c = coluna;
        }
        grid[r][c].letra = palavra[i];
        grid[r][c].direcoes.add(direcao);
    }
}

function encontrarPosicoes(palavraObj, grid, tamanho) {
    const palavra = palavraObj.palavra;
    const posicoes = [];
    const chaves = new Set();

    for (let r = 0; r < tamanho; r++) {
        for (let c = 0; c < tamanho; c++) {
            if (grid[r][c].letra === null) continue;
            for (let i = 0; i < palavra.length; i++) {
                if (palavra[i] !== grid[r][c].letra) continue;
                for (const direcao of ['h', 'v']) {
                    const linhaNova = r - (direcao === 'v' ? i : 0);
                    const colunaNova = c - (direcao === 'h' ? i : 0);
                    const chave = direcao + ':' + linhaNova + ':' + colunaNova;
                    if (!chaves.has(chave) && podeColocar(palavra, linhaNova, colunaNova, direcao, grid, tamanho, true)) {
                        chaves.add(chave);
                        posicoes.push({ word: palavra, hint: palavraObj.dica, direction: direcao, row: linhaNova, col: colunaNova });
                    }
                }
            }
        }
    }
    return posicoes;
}

function numerarPalavras(palavras) {
    const inicios = Array.from(new Set(palavras.map(function(p) { return p.row + ':' + p.col; })))
        .map(function(chave) {
            const partes = chave.split(':').map(Number);
            return { chave: chave, row: partes[0], col: partes[1] };
        })
        .sort(function(a, b) { return a.row - b.row || a.col - b.col; });
    const numeros = new Map(inicios.map(function(inicio, indice) { return [inicio.chave, indice + 1]; }));
    palavras.forEach(function(palavra) {
        palavra.number = numeros.get(palavra.row + ':' + palavra.col);
        palavra.key = palavra.number + '-' + palavra.direction;
    });
    palavras.sort(function(a, b) { return a.number - b.number || (a.direction === 'h' ? -1 : 1); });
}

function validarTema(tema) {
    if (!tema || !tema.layout || !tema.words || tema.words.length === 0) return false;
    const ocupacao = new Map();
    for (let indice = 0; indice < tema.words.length; indice++) {
        const palavra = tema.words[indice];
        const antesR = palavra.row - (palavra.direction === 'v' ? 1 : 0);
        const antesC = palavra.col - (palavra.direction === 'h' ? 1 : 0);
        const depoisR = palavra.row + (palavra.direction === 'v' ? palavra.word.length : 0);
        const depoisC = palavra.col + (palavra.direction === 'h' ? palavra.word.length : 0);
        if (dentroDoGrid(antesR, antesC, tema.gridSize) && tema.layout[antesR][antesC] !== '#') return false;
        if (dentroDoGrid(depoisR, depoisC, tema.gridSize) && tema.layout[depoisR][depoisC] !== '#') return false;
        for (let i = 0; i < palavra.word.length; i++) {
            const r = palavra.row + (palavra.direction === 'v' ? i : 0);
            const c = palavra.col + (palavra.direction === 'h' ? i : 0);
            if (!dentroDoGrid(r, c, tema.gridSize) || tema.layout[r][c] !== palavra.word[i]) return false;
            const chave = r + ':' + c;
            const usos = ocupacao.get(chave) || [];
            if (usos.some(function(uso) { return uso.direction === palavra.direction; })) return false;
            usos.push({ indice: indice, direction: palavra.direction });
            ocupacao.set(chave, usos);
        }
    }
    for (const [chave, usos] of ocupacao) {
        if (usos.length > 2) return false;
        if (usos.length === 1) {
            const partes = chave.split(':').map(Number);
            const palavra = tema.words[usos[0].indice];
            const vizinhos = palavra.direction === 'h' ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];
            for (const vizinho of vizinhos) {
                const r = partes[0] + vizinho[0], c = partes[1] + vizinho[1];
                if (dentroDoGrid(r, c, tema.gridSize) && tema.layout[r][c] !== '#') return false;
            }
        }
    }
    const visitadas = new Set([0]);
    let alterou = true;
    while (alterou) {
        alterou = false;
        for (const usos of ocupacao.values()) {
            if (usos.length === 2 && (visitadas.has(usos[0].indice) || visitadas.has(usos[1].indice))) {
                if (!visitadas.has(usos[0].indice) || !visitadas.has(usos[1].indice)) alterou = true;
                visitadas.add(usos[0].indice);
                visitadas.add(usos[1].indice);
            }
        }
    }
    if (visitadas.size !== tema.words.length) return false;
    return true;
}

function gerarPalavrasCruzadas(dificuldade, random) {
    random = random || Math.random;
    const config = dificuldades[dificuldade];
    for (let tentativaGeral = 0; tentativaGeral < 300; tentativaGeral++) {
        const qtdPalavras = Math.floor(random() * (config.maxPalavras - config.minPalavras + 1)) + config.minPalavras;
        let palavrasParaUsar = bancoPalavras.filter(function(p) {
            return p.palavra.length >= config.minLetras && p.palavra.length <= config.maxLetras;
        });
        palavrasParaUsar = embaralharArray(palavrasParaUsar, random)
            .sort(function(a, b) { return b.palavra.length - a.palavra.length || random() - 0.5; });
        const grid = criarGridVazio(config.gridSize);
        const palavrasColocadas = [];
        const primeiraPalavra = palavrasParaUsar[0];
        const dir = random() < 0.5 ? 'h' : 'v';
        const linha = dir === 'h' ? Math.floor(config.gridSize / 2) : Math.floor((config.gridSize - primeiraPalavra.palavra.length) / 2);
        const coluna = dir === 'h' ? Math.floor((config.gridSize - primeiraPalavra.palavra.length) / 2) : Math.floor(config.gridSize / 2);
        colocarPalavra(primeiraPalavra.palavra, linha, coluna, dir, grid);
        palavrasColocadas.push({ word: primeiraPalavra.palavra, hint: primeiraPalavra.dica, direction: dir, row: linha, col: coluna });

        let restantes = palavrasParaUsar.slice(1);
        while (palavrasColocadas.length < qtdPalavras && restantes.length > 0) {
            const opcoes = [];
            restantes.forEach(function(palavraObj, indice) {
                const posicoes = encontrarPosicoes(palavraObj, grid, config.gridSize);
                if (posicoes.length) opcoes.push({ indice: indice, palavra: palavraObj, posicoes: posicoes });
            });
            if (!opcoes.length) break;
            const opcao = embaralharArray(opcoes, random).sort(function(a, b) { return a.posicoes.length - b.posicoes.length; })[0];
            const escolhida = embaralharArray(opcao.posicoes, random)[0];
            colocarPalavra(escolhida.word, escolhida.row, escolhida.col, escolhida.direction, grid);
            palavrasColocadas.push({ word: escolhida.word, hint: escolhida.hint, direction: escolhida.direction, row: escolhida.row, col: escolhida.col });
            restantes.splice(opcao.indice, 1);
        }

        if (palavrasColocadas.length >= config.minPalavras) {
            const layout = Array.from({ length: config.gridSize }, () => 
                Array.from({ length: config.gridSize }, () => '#')
            );
            
            for (let r = 0; r < config.gridSize; r++) {
                for (let c = 0; c < config.gridSize; c++) {
                    if (grid[r][c].letra !== null) {
                        layout[r][c] = grid[r][c].letra;
                    }
                }
            }
            
            palavrasColocadas.forEach(function(palavra) {
                palavra.reveladas = new Array(palavra.word.length).fill(false);
                palavra.hintUsed = false;
            });
            numerarPalavras(palavrasColocadas);
            const tema = {
                gridSize: config.gridSize,
                layout: layout,
                words: palavrasColocadas,
                qtdPalavras: palavrasColocadas.length
            };
            if (validarTema(tema)) return tema;
        }
    }
    return null;
}

function criarRandomDeterministico(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function initGame() {
    let resultado = gerarPalavrasCruzadas(currentDifficulty);
    for (let seed = 1; !resultado && seed <= 50; seed++) {
        resultado = gerarPalavrasCruzadas(currentDifficulty, criarRandomDeterministico(seed));
    }
    
    if (!resultado) {
        exibirAlerta('Não foi possível gerar um jogo. Tente novamente.', 'erro');
        return;
    }
    
    currentTema = resultado;
    currentWord = null;
    lastSelectedWord = null;
    gameCompleted = false;
    
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
                input.addEventListener('click', handleCellClick);
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
        if (word.row === row && word.col === col) {
            return word.number;
        }
    }
    return null;
}

function getWordAt(row, col, dirFilter) {
    for (const word of currentTema.words) {
        if (dirFilter && word.direction !== dirFilter) continue;
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

function getWordsAt(row, col) {
    return currentTema.words.filter(function(word) {
        if (word.direction === 'h') return row === word.row && col >= word.col && col < word.col + word.word.length;
        return col === word.col && row >= word.row && row < word.row + word.word.length;
    });
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
    div.dataset.wordKey = word.key;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'hint-content';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'hint-copy';
    textSpan.innerHTML = '<span class="hint-number">' + word.number + '.</span> <span class="hint-text">' + word.hint + '</span>';
    
    const hintBtn = document.createElement('button');
    hintBtn.className = 'hint-btn';
    hintBtn.textContent = 'Dica';
    hintBtn.dataset.wordKey = word.key;
    
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
    lastSelectedWord = word;
    document.querySelectorAll('.hint-item').forEach(el => el.classList.remove('active'));
    const target = document.querySelector('.hint-item[data-word-key="' + word.key + '"]');
    if (target) target.classList.add('active');
    
    const firstCell = document.querySelector('input[data-row="' + word.row + '"][data-col="' + word.col + '"]');
    if (firstCell) {
        firstCell.focus();
    }
}

function handleFocus(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const hWord = getWordAt(row, col, 'h');
    const vWord = getWordAt(row, col, 'v');
    
    let word = null;
    if (hWord && vWord) {
        word = currentWord && (currentWord === hWord || currentWord === vWord)
            ? currentWord
            : (lastSelectedWord && (lastSelectedWord === hWord || lastSelectedWord === vWord) ? lastSelectedWord : hWord);
    } else {
        word = hWord || vWord;
    }
    
    if (word) {
        currentWord = word;
        lastSelectedWord = word;
        
        document.querySelectorAll('.hint-item').forEach(el => el.classList.remove('active'));
        const hintEl = document.querySelector('.hint-item[data-word-key="' + word.key + '"]');
        if (hintEl) {
            hintEl.classList.add('active');
        }
        
        highlightWordCells(word);
    }
}

function handleCellClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const words = getWordsAt(row, col);
    if (words.length < 2) return;
    const next = currentWord === words[0] ? words[1] : words[0];
    currentWord = next;
    lastSelectedWord = next;
    document.querySelectorAll('.hint-item').forEach(function(el) { el.classList.remove('active'); });
    const hintEl = document.querySelector('.hint-item[data-word-key="' + next.key + '"]');
    if (hintEl) hintEl.classList.add('active');
    highlightWordCells(next);
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
        
        const editedWord = currentWord;
        if (editedWord) {
            var pos = (editedWord.direction === 'h') ? col - editedWord.col : row - editedWord.row;
            if (pos >= 0 && pos < editedWord.word.length) {
                if (currentTema.layout[row][col] === value) {
                    e.target.classList.add('letter-ok');
                } else {
                    e.target.classList.remove('letter-ok');
                }
            }
        }
        
        checkWord();
        moveToNextCell(row, col);
    } else {
        e.target.classList.remove('letter-ok');
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
    const word = currentWord || (lastSelectedWord || getWordAt(row, col));
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
    const word = currentWord || (lastSelectedWord || getWordAt(row, col));
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

function getWordInputs(word) {
    return Array.from({ length: word.word.length }, function(_, i) {
        const row = word.row + (word.direction === 'v' ? i : 0);
        const col = word.col + (word.direction === 'h' ? i : 0);
        return document.querySelector('input[data-row="' + row + '"][data-col="' + col + '"]');
    });
}

function isWordCorrect(word) {
    const inputs = getWordInputs(word);
    return inputs.every(function(input, i) { return input && input.value.toUpperCase() === word.word[i]; });
}

function checkWord() {
    const completed = currentTema.words.filter(isWordCorrect);
    document.querySelectorAll('.cell input').forEach(function(input) { input.classList.remove('correct'); });
    completed.forEach(function(word) {
        getWordInputs(word).forEach(function(input) { if (input) input.classList.add('correct'); });
    });

    currentTema.words.forEach(function(word) {
        const complete = completed.indexOf(word) !== -1;
        const hintEl = document.querySelector('.hint-item[data-word-key="' + word.key + '"]');
        if (hintEl) hintEl.classList.toggle('correct', complete);
        const btn = document.querySelector('.hint-btn[data-word-key="' + word.key + '"]');
        if (!btn) return;
        if (complete) {
            btn.textContent = 'Completo';
            btn.disabled = true;
            btn.classList.add('hint-btn-disabled');
        } else if (word.hintUsed) {
            btn.textContent = 'Usado';
            btn.disabled = true;
            btn.classList.add('hint-btn-disabled');
        } else {
            btn.textContent = 'Dica';
            btn.disabled = false;
            btn.classList.remove('hint-btn-disabled');
        }
    });
    checkAllWords(completed.length === currentTema.words.length);
}

function checkAllWords(allCorrect) {
    if (allCorrect && !gameCompleted) {
        gameCompleted = true;
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
        input.classList.remove('letter-ok');
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
    lastSelectedWord = null;
    gameCompleted = false;
    
    if (currentTema && currentTema.words) {
        currentTema.words.forEach(function(w) {
            w.reveladas = new Array(w.word.length).fill(false);
            w.hintUsed = false;
        });
    }
}

function closeMessage() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('message').classList.remove('show');
}

function revelarLetra(palavra) {
    if (!palavra) return;
    if (palavra.hintUsed) return;
    
    var todasCertas = true;
    for (var i = 0; i < palavra.word.length; i++) {
        var input;
        if (palavra.direction === 'h') {
            input = document.querySelector('input[data-row="' + palavra.row + '"][data-col="' + (palavra.col + i) + '"]');
        } else {
            input = document.querySelector('input[data-row="' + (palavra.row + i) + '"][data-col="' + palavra.col + '"]');
        }
        if (input) {
            if (input.value.toUpperCase() !== palavra.word[i]) {
                todasCertas = false;
            }
        } else {
            todasCertas = false;
        }
    }
    
    if (todasCertas) {
        var btn = document.querySelector('.hint-btn[data-word-key="' + palavra.key + '"]');
        if (btn) {
            btn.textContent = 'Completo';
            btn.disabled = true;
            btn.classList.add('hint-btn-disabled');
        }
        return;
    }
    
    for (var j = 0; j < palavra.word.length; j++) {
        if (palavra.reveladas[j]) continue;
        
        var inp;
        if (palavra.direction === 'h') {
            inp = document.querySelector('input[data-row="' + palavra.row + '"][data-col="' + (palavra.col + j) + '"]');
        } else {
            inp = document.querySelector('input[data-row="' + (palavra.row + j) + '"][data-col="' + palavra.col + '"]');
        }
        if (!inp) continue;
        
        if (inp.value.toUpperCase() !== palavra.word[j]) {
            palavra.hintUsed = true;
            palavra.reveladas[j] = true;
            inp.value = palavra.word[j];
            inp.classList.add('correct');
            inp.classList.remove('letter-ok');
            inp.readOnly = true;
            
            var b = document.querySelector('.hint-btn[data-word-key="' + palavra.key + '"]');
            if (b) {
                b.textContent = 'Usado';
                b.disabled = true;
                b.classList.add('hint-btn-disabled');
            }
            checkWord();
            return;
        }
    }
}

function setupDificuldadeButtons() {
    const buttons = document.querySelectorAll('.dif-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.classList.contains('facil')) {
                currentDifficulty = 'facil';
            } else if (this.classList.contains('medio')) {
                currentDifficulty = 'medio';
            } else if (this.classList.contains('dificil')) {
                currentDifficulty = 'dificil';
            }
            
            resetGame();
            initGame();
        });
    });
}

document.getElementById('btn-reset').addEventListener('click', function() {
    const hasProgress = Array.from(document.querySelectorAll('.cell input')).some(function(input) { return input.value !== ''; });
    if (hasProgress) exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', resetGame);
    else resetGame();
});

document.getElementById('btn-play-again').addEventListener('click', function() {
    closeMessage();
    initGame();
});

window.MenteAtivaCrossword = {
    gerar: gerarPalavrasCruzadas,
    validar: validarTema,
    criarRandom: criarRandomDeterministico,
    dificuldades: dificuldades,
    getCurrent: function() { return currentTema; }
};

setupDificuldadeButtons();
initGame();

});
