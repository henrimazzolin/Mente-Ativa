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

function embaralharArray(arr) {
    const resultado = [...arr];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
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
        Array.from({ length: tamanho }, () => ({ letra: null, ocupada: false }))
    );
}

function podeColocarHorizontal(palavra, linha, coluna, grid, tamanho) {
    if (coluna + palavra.length > tamanho) return false;
    
    let temCruzamento = false;
    
    for (let i = 0; i < palavra.length; i++) {
        const celula = grid[linha][coluna + i];
        if (celula.letra !== null) {
            if (celula.letra !== palavra[i]) return false;
            temCruzamento = true;
        }
    }
    
    if (coluna > 0 && grid[linha][coluna - 1].ocupada) return false;
    if (coluna + palavra.length < tamanho && grid[linha][coluna + palavra.length].ocupada) return false;
    
    for (let i = 0; i < palavra.length; i++) {
        const c = coluna + i;
        const celulaAtual = grid[linha][c];
        
        if (celulaAtual.letra === null) {
            if (linha > 0 && grid[linha - 1][c].ocupada) return false;
            if (linha < tamanho - 1 && grid[linha + 1][c].ocupada) return false;
        }
    }
    
    return temCruzamento;
}

function podeColocarVertical(palavra, linha, coluna, grid, tamanho) {
    if (linha + palavra.length > tamanho) return false;
    
    let temCruzamento = false;
    
    for (let i = 0; i < palavra.length; i++) {
        const celula = grid[linha + i][coluna];
        if (celula.letra !== null) {
            if (celula.letra !== palavra[i]) return false;
            temCruzamento = true;
        }
    }
    
    if (linha > 0 && grid[linha - 1][coluna].ocupada) return false;
    if (linha + palavra.length < tamanho && grid[linha + palavra.length][coluna].ocupada) return false;
    
    for (let i = 0; i < palavra.length; i++) {
        const r = linha + i;
        const celulaAtual = grid[r][coluna];
        
        if (celulaAtual.letra === null) {
            if (coluna > 0 && grid[r][coluna - 1].ocupada) return false;
            if (coluna < tamanho - 1 && grid[r][coluna + 1].ocupada) return false;
        }
    }
    
    return temCruzamento;
}

function podeColocarPrimeira(palavra, linha, coluna, direcao, grid, tamanho) {
    if (direcao === 'h') {
        if (coluna + palavra.length > tamanho) return false;
    } else {
        if (linha + palavra.length > tamanho) return false;
    }
    return true;
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
        grid[r][c].ocupada = true;
    }
}

function encontrarPosicoes(palavraObj, palavrasColocadas, grid, tamanho) {
    const palavra = palavraObj.palavra;
    const posicoes = [];
    
    for (const colocada of palavrasColocadas) {
        const pColocada = colocada.word;
        
        for (let i = 0; i < palavra.length; i++) {
            const letra = palavra[i];
            
            for (let j = 0; j < pColocada.length; j++) {
                if (pColocada[j] === letra) {
                    if (colocada.direction === 'h') {
                        const linhaNova = colocada.row - i;
                        const colunaNova = colocada.col + j;
                        
                        if (linhaNova >= 0 && colunaNova >= 0) {
                            if (podeColocarVertical(palavra, linhaNova, colunaNova, grid, tamanho)) {
                                posicoes.push({ 
                                    word: palavra, 
                                    hint: palavraObj.dica,
                                    direction: 'v', 
                                    row: linhaNova, 
                                    col: colunaNova 
                                });
                            }
                        }
                    } else {
                        const linhaNova = colocada.row + j;
                        const colunaNova = colocada.col - i;
                        
                        if (linhaNova >= 0 && colunaNova >= 0) {
                            if (podeColocarHorizontal(palavra, linhaNova, colunaNova, grid, tamanho)) {
                                posicoes.push({ 
                                    word: palavra, 
                                    hint: palavraObj.dica,
                                    direction: 'h', 
                                    row: linhaNova, 
                                    col: colunaNova 
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    return posicoes;
}

function gerarPalavrasCruzadas(dificuldade) {
    const config = dificuldades[dificuldade];
    const qtdPalavras = Math.floor(Math.random() * (config.maxPalavras - config.minPalavras + 1)) + config.minPalavras;
    
    for (let tentativaGeral = 0; tentativaGeral < 100; tentativaGeral++) {
        const palavrasSelecionadas = selecionarPalavras(qtdPalavras + 10, config.minLetras, config.maxLetras);
        let palavrasParaUsar = embaralharArray(palavrasSelecionadas).slice(0, qtdPalavras);
        
        palavrasParaUsar.sort((a, b) => b.palavra.length - a.palavra.length);
        
        const grid = criarGridVazio(config.gridSize);
        const palavrasColocadas = [];
        
        const primeiraPalavra = palavrasParaUsar[0];
        let colocouPrimeira = false;
        
        const direcoesPrimeira = embaralharArray(['h', 'v']);
        
        for (const dir of direcoesPrimeira) {
            if (colocouPrimeira) break;
            
            let posicoesPossiveis = [];
            
            if (dir === 'h') {
                const maxCol = config.gridSize - primeiraPalavra.palavra.length;
                if (maxCol >= 0) {
                    for (let r = 0; r < config.gridSize; r++) {
                        for (let c = 0; c <= maxCol; c++) {
                            posicoesPossiveis.push({ row: r, col: c });
                        }
                    }
                }
            } else {
                const maxRow = config.gridSize - primeiraPalavra.palavra.length;
                if (maxRow >= 0) {
                    for (let c = 0; c < config.gridSize; c++) {
                        for (let r = 0; r <= maxRow; r++) {
                            posicoesPossiveis.push({ row: r, col: c });
                        }
                    }
                }
            }
            
            posicoesPossiveis = embaralharArray(posicoesPossiveis);
            
            for (const pos of posicoesPossiveis) {
                if (podeColocarPrimeira(primeiraPalavra.palavra, pos.row, pos.col, dir, grid, config.gridSize)) {
                    colocarPalavra(primeiraPalavra.palavra, pos.row, pos.col, dir, grid);
                    palavrasColocadas.push({
                        word: primeiraPalavra.palavra,
                        hint: primeiraPalavra.dica,
                        direction: dir,
                        row: pos.row,
                        col: pos.col,
                        number: 1,
                        reveladas: new Array(primeiraPalavra.palavra.length).fill(false),
                        hintUsed: false
                    });
                    colocouPrimeira = true;
                    break;
                }
            }
        }
        
        if (!colocouPrimeira) continue;
        
        const palavrasRestantes = palavrasParaUsar.slice(1);
        
        for (const palavraObj of palavrasRestantes) {
            let colocada = false;
            
            for (let t = 0; t < config.maxTentativas && !colocada; t++) {
                const posicoes = encontrarPosicoes(palavraObj, palavrasColocadas, grid, config.gridSize);
                
                if (posicoes.length > 0) {
                    const posicoesEmbaralhadas = embaralharArray(posicoes);
                    const escolhida = posicoesEmbaralhadas[0];
                    
                    colocarPalavra(escolhida.word, escolhida.row, escolhida.col, escolhida.direction, grid);
                    palavrasColocadas.push({
                        word: escolhida.word,
                        hint: escolhida.hint,
                        direction: escolhida.direction,
                        row: escolhida.row,
                        col: escolhida.col,
                        number: palavrasColocadas.length + 1,
                        reveladas: new Array(escolhida.word.length).fill(false),
                        hintUsed: false
                    });
                    colocada = true;
                } else {
                    break;
                }
            }
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
            
            return {
                gridSize: config.gridSize,
                layout: layout,
                words: palavrasColocadas,
                qtdPalavras: palavrasColocadas.length
            };
        }
    }
    
    return null;
}

function initGame() {
    let resultado = null;
    let tentativas = 0;
    
    while (!resultado && tentativas < 50) {
        resultado = gerarPalavrasCruzadas(currentDifficulty);
        tentativas++;
    }
    
    if (!resultado) {
        exibirAlerta('Não foi possível gerar um jogo. Tente novamente.', 'erro');
        return;
    }
    
    currentTema = resultado;
    
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
    
    const dificuldadeLabels = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
    document.getElementById('gameLevel').textContent = 
        'Nível: ' + dificuldadeLabels[currentDifficulty] + ' (' + currentTema.qtdPalavras + ' palavras)';
    
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
    contentDiv.className = 'hint-content';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'hint-copy';
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
    lastSelectedWord = word;
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
    const hWord = getWordAt(row, col, 'h');
    const vWord = getWordAt(row, col, 'v');
    
    let word = null;
    if (hWord && vWord) {
        word = lastSelectedWord && (lastSelectedWord.number === hWord.number || lastSelectedWord.number === vWord.number)
            ? lastSelectedWord
            : lastSelectedWord || hWord;
    } else {
        word = hWord || vWord;
    }
    
    if (word) {
        currentWord = word;
        lastSelectedWord = word;
        
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
        
        if (currentWord) {
            var pos = (currentWord.direction === 'h') ? col - currentWord.col : row - currentWord.row;
            if (pos >= 0 && pos < currentWord.word.length) {
                if (currentWord.word[pos] === value) {
                    e.target.classList.add('letter-ok');
                } else {
                    e.target.classList.remove('letter-ok');
                }
            }
        }
        
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
        var btn = document.querySelector('.hint-btn[data-word-number="' + currentWord.number + '"]');
        if (btn && !btn.disabled) {
            btn.textContent = 'Completo';
            btn.disabled = true;
            btn.classList.add('hint-btn-disabled');
        }
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
        var btn = document.querySelector('.hint-btn[data-word-number="' + palavra.number + '"]');
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
            
            var b = document.querySelector('.hint-btn[data-word-number="' + palavra.number + '"]');
            if (b) {
                b.textContent = 'Usado';
                b.disabled = true;
                b.classList.add('hint-btn-disabled');
            }
            checkAllWords();
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
    exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
        resetGame();
        initGame();
    });
});

document.getElementById('btn-back').addEventListener('click', function() {
    window.location.href = 'jogos-individuais.html';
});

document.getElementById('overlay').addEventListener('click', closeMessage);

document.getElementById('btn-play-again').addEventListener('click', function() {
    exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
        resetGame();
        initGame();
    });
});

setupDificuldadeButtons();
initGame();

});
