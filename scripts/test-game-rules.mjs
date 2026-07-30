import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

for (const page of ['jogo-associacao.html','jogo-caca-palavras.html','jogo-deducao-logica.html','jogo-memoria.html','jogo-palavras-cruzadas.html','jogo-quebra-cabeca.html','jogo-sudoku.html']) {
    assert.match(read(page), />Jogar novamente<\/button>/, `${page}: nomenclatura de nova partida divergente.`);
}
const replayContracts = [
    ['js/jogo-associacao.js', /feedbackBtn[\s\S]{0,140}restartGame\(false\)/],
    ['js/jogo-caca-palavras.js', /feedbackBtn[\s\S]{0,180}initGame\(false\)/],
    ['js/jogo-deducao-logica.js', /feedbackBtn[\s\S]{0,180}initGame\(true\)/],
    ['js/jogo-memoria.js', /feedbackBtn\.onclick[\s\S]{0,160}initGame\(false\)/],
    ['js/jogo-palavras-cruzadas.js', /btn-play-again[\s\S]{0,160}initGame\(\)/],
    ['js/jogo-quebra-cabeca.js', /btn-play-again[\s\S]{0,160}initGame\(true\)/],
    ['js/jogo-sudoku.js', /btn-play-again[\s\S]{0,160}resetGame\(true\)/],
    ['js/jogo-objeto-funcao.js', /acertos === 3[\s\S]{0,180}iniciarJogo\(false\)/]
];
for (const [file, contract] of replayContracts) {
    const source = read(file);
    assert.match(source, contract, `${file}: Jogar novamente deve criar um desafio sem confirmação.`);
}

const responsive = read('css/responsive.css');
assert.match(responsive, /--ma-difficulty-width:\s*780px/);
assert.match(responsive, /--ma-difficulty-height:\s*116px/);
assert.match(responsive, /body\.modo-individual\s*\{\s*--ma-back-hover:\s*#2563EB/);
assert.match(responsive, /body\.modo-dependente\s*\{\s*--ma-back-hover:\s*#059669/);
assert.match(responsive, /body\.modo-neutro\s*\{\s*--ma-back-hover:\s*#FFFFFF/);
assert.match(read('menu.html'), /<body class="modo-individual">/,
    'O retorno do menu principal deve reutilizar o hover azul dos jogos individuais.');

function criarEngine() {
    const context = vm.createContext({ console, Math, Map });
    vm.runInContext(`${read('js/lib/chess-engine.js')}\nglobalThis.TestChess = ChessEngine;`, context);
    return new context.TestChess();
}

function limpar(engine, turno = 'W') {
    engine.tabuleiro = Array.from({ length: 8 }, () => Array(8).fill(null));
    engine.turno = turno;
    engine.historico = [];
    engine.halfmoveClock = 0;
    engine.enPassantTarget = null;
    engine.direitos_roque = { WK: false, WQ: false, BK: false, BQ: false };
    engine.repeticoes = new Map();
}

{
    const e = criarEngine();
    limpar(e);
    e.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    e.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
    e.tabuleiro[6][3] = { tipo: 'p', cor: 'B' };
    assert.equal(e.casaAtacadaPor(7, 4, 'B'), true, 'Peão deve atacar somente na diagonal.');
    assert.equal(e.casaAtacadaPor(7, 3, 'B'), false, 'Avanço do peão não é ataque.');
    e.tabuleiro[5][4] = { tipo: 'k', cor: 'B' };
    e.tabuleiro[0][4] = null;
    e.reiPosicoes.B = { linha: 5, coluna: 4 };
    assert.equal(e.obterMovimentosValidos(7, 4).some((m) => m.linha === 6 && m.coluna === 4), false, 'Reis não podem ficar em contato.');
    e.tabuleiro[5][4] = null;
    e.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    e.reiPosicoes.B = { linha: 0, coluna: 4 };

    e.tabuleiro[0][7] = null;
    e.direitos_roque.WK = true;
    assert.equal(e.obterMovimentosValidos(7, 4).some((m) => m.roque), false, 'Roque exige a torre original.');
    e.tabuleiro[7][7] = { tipo: 'r', cor: 'W' };
    e.tabuleiro[5][5] = { tipo: 'r', cor: 'B' };
    assert.equal(e.obterMovimentosValidos(7, 4).some((m) => m.roque), false, 'Rei não cruza casa atacada no roque.');
}

{
    const e = criarEngine();
    limpar(e, 'W');
    e.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    e.tabuleiro[3][4] = { tipo: 'p', cor: 'W' };
    e.tabuleiro[3][3] = { tipo: 'p', cor: 'B' };
    e.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
    e.enPassantTarget = { linha: 2, coluna: 3 };
    assert.match(e.chavePosicao(), / d6$/i, 'A chave inclui en passant quando a captura é legal.');
    e.tabuleiro[3][4] = null;
    assert.match(e.chavePosicao(), / -$/, 'A chave ignora en passant indisponível.');
}

{
    const e = criarEngine();
    limpar(e);
    e.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[0][0] = { tipo: 'k', cor: 'B' };
    e.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 0 } };
    e.tabuleiro[0][4] = { tipo: 'r', cor: 'B' };
    e.tabuleiro[3][4] = { tipo: 'p', cor: 'W' };
    e.tabuleiro[3][3] = { tipo: 'p', cor: 'B' };
    e.enPassantTarget = { linha: 2, coluna: 3 };
    assert.equal(e.obterMovimentosValidos(3, 4).some((m) => m.enPassant), false, 'En passant não pode expor o próprio rei.');
}

{
    const e = criarEngine();
    limpar(e, 'B');
    e.tabuleiro[0][0] = { tipo: 'k', cor: 'B' };
    e.tabuleiro[1][1] = { tipo: 'q', cor: 'W' };
    e.tabuleiro[2][2] = { tipo: 'k', cor: 'W' };
    e.reiPosicoes = { W: { linha: 2, coluna: 2 }, B: { linha: 0, coluna: 0 } };
    e.halfmoveClock = 150;
    assert.equal(e.ehXequeMate(), true, 'Xeque-mate continua válido mesmo no limite de 75 lances.');
    const ui = read('js/jogo-xadrez.js');
    assert.ok(ui.indexOf('engine.ehXequeMate()') < ui.indexOf('engine.obterMotivoEmpate()'), 'Xeque-mate deve ter prioridade sobre empate automático.');
}

{
    const e = criarEngine();
    limpar(e, 'B');
    e.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    e.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
    e.tabuleiro[7][0] = { tipo: 'r', cor: 'W' };
    e.tabuleiro[1][0] = { tipo: 'q', cor: 'B' };
    e.direitos_roque.WQ = true;
    assert.equal(e.fazerMovimento(1, 0, 7, 0), true);
    assert.equal(e.direitos_roque.WQ, false, 'Capturar a torre inicial remove o direito de roque.');
}

{
    const e = criarEngine();
    limpar(e, 'B');
    e.tabuleiro[0][0] = { tipo: 'k', cor: 'B' };
    e.tabuleiro[2][2] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[1][2] = { tipo: 'q', cor: 'W' };
    e.reiPosicoes = { W: { linha: 2, coluna: 2 }, B: { linha: 0, coluna: 0 } };
    assert.equal(e.emXeque('B'), false);
    assert.equal(e.obterMotivoEmpate(), 'afogamento');
    limpar(e, 'B');
    e.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    e.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    e.tabuleiro[7][0] = { tipo: 'r', cor: 'W' };
    e.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
    e.halfmoveClock = 100;
    assert.equal(e.obterMotivoEmpateReivindicavel(), 'cinquenta-lances');
    e.halfmoveClock = 150;
    assert.equal(e.obterMotivoEmpate(), 'setenta-cinco-lances');
    e.halfmoveClock = 0;
    e.repeticoes.set(e.chavePosicao(), 3);
    assert.equal(e.obterMotivoEmpateReivindicavel(), 'repeticao-tripla');
    e.repeticoes.set(e.chavePosicao(), 5);
    assert.equal(e.obterMotivoEmpate(), 'repeticao-quíntupla');
}

function prepararJanela(pagina) {
    const dom = new JSDOM(read(pagina), { runScripts: 'outside-only', url: 'http://localhost/' + pagina });
    const { window } = dom;
    window.MenteAtiva = { utils: { shuffleArray: (arr) => arr.slice().sort(() => Math.random() - 0.5) } };
    window.exibirAlerta = () => {};
    window.exibirConfirmacao = (_a, _b, callback) => callback();
    return window;
}

{
    const window = prepararJanela('jogo-palavras-cruzadas.html');
    window.eval(read('js/jogo-palavras-cruzadas.js'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    const api = window.MenteAtivaCrossword;
    assert.ok(api, 'API de validação das palavras cruzadas deve estar disponível.');
    for (const dificuldade of ['facil', 'medio', 'dificil']) {
        for (let seed = 1; seed <= 200; seed++) {
            const tema = api.gerar(dificuldade, api.criarRandom(seed));
            assert.ok(tema, `Grade não gerada em ${dificuldade}, semente ${seed}.`);
            assert.ok(api.validar(tema), `Grade inválida em ${dificuldade}, semente ${seed}.`);
            const numeros = [...new Set(tema.words.map((w) => `${w.row}:${w.col}`))];
            assert.equal(new Set(tema.words.map((w) => w.key)).size, tema.words.length);
            assert.equal(Math.max(...tema.words.map((w) => w.number)), numeros.length);
        }
    }
    const atual = api.getCurrent();
    const ocupacoes = new Map();
    for (const word of atual.words) {
        for (let i = 0; i < word.word.length; i++) {
            const row = word.row + (word.direction === 'v' ? i : 0);
            const col = word.col + (word.direction === 'h' ? i : 0);
            const key = `${row}:${col}`;
            ocupacoes.set(key, (ocupacoes.get(key) || []).concat(word));
        }
    }
    const cruzamento = [...ocupacoes].find(([, words]) => words.length === 2);
    assert.ok(cruzamento, 'Toda grade deve permitir interação em um cruzamento.');
    const [rowCruzado, colCruzado] = cruzamento[0].split(':').map(Number);
    const inputCruzado = window.document.querySelector(`input[data-row="${rowCruzado}"][data-col="${colCruzado}"]`);
    inputCruzado.focus();
    const classeInicial = inputCruzado.classList.contains('active-row') ? 'active-row' : 'active-col';
    inputCruzado.click();
    assert.equal(inputCruzado.classList.contains(classeInicial), false, 'Clique em cruzamento deve alternar a direção.');

    const word = atual.words.find((item) => item.word.length > 2);
    window.document.querySelector(`.hint-item[data-word-key="${word.key}"]`).click();
    const first = window.document.querySelector(`input[data-row="${word.row}"][data-col="${word.col}"]`);
    first.focus();
    first.value = word.word[0];
    first.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.notEqual(window.document.activeElement, first, 'Digitação deve avançar o foco.');
    const next = window.document.activeElement;
    next.value = '';
    next.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    assert.equal(window.document.activeElement, first, 'Backspace em célula vazia deve voltar o foco.');

    const hint = window.document.querySelector('.hint-btn:not(:disabled)');
    const preenchidasAntes = [...window.document.querySelectorAll('.cell input')].filter((input) => input.value).length;
    hint.click();
    const preenchidasDepois = [...window.document.querySelectorAll('.cell input')].filter((input) => input.value).length;
    assert.equal(preenchidasDepois, preenchidasAntes + 1, 'Cada dica revela somente uma letra.');
    assert.equal(hint.disabled, true, 'Cada palavra permite uma única dica.');
    window.document.getElementById('btn-reset').click();
    assert.equal(api.getCurrent(), atual, 'Reiniciar deve preservar a mesma grade.');
    assert.ok([...window.document.querySelectorAll('.cell input')].every((input) => input.value === ''), 'Reiniciar deve limpar as respostas.');
    window.document.getElementById('btn-play-again').click();
    assert.notEqual(api.getCurrent(), atual, 'Jogar novamente deve criar uma nova grade.');
    window.close();
}

{
    const window = prepararJanela('jogo-memoria.html');
    window.eval(read('js/jogo-memoria.js'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    const card = window.document.querySelector('.card');
    const pointer = (type, x, y) => {
        const event = new window.Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(event, { clientX: { value: x }, clientY: { value: y } });
        card.dispatchEvent(event);
    };
    pointer('pointerdown', 0, 0);
    pointer('pointermove', 20, 0);
    pointer('pointerup', 20, 0);
    card.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    assert.equal(card.classList.contains('flipped'), false, 'Arrastar não pode virar a carta.');
    const shortCard = window.document.querySelectorAll('.card')[2];
    shortCard.dispatchEvent(new window.MouseEvent('click', { bubbles: true, detail: 1 }));
    assert.equal(shortCard.classList.contains('flipped'), true, 'Clique curto deve virar a carta.');
    const originalNow = window.Date.now;
    let agora = 1000;
    window.Date.now = () => agora;
    pointer('pointerdown', 0, 0);
    agora = 1600;
    pointer('pointerup', 0, 0);
    card.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    assert.equal(card.classList.contains('flipped'), false, 'Pressão prolongada não pode virar a carta.');
    window.Date.now = originalNow;
    const drag = new window.Event('dragstart', { bubbles: true, cancelable: true });
    card.dispatchEvent(drag);
    assert.equal(drag.defaultPrevented, true, 'Arraste nativo deve ser bloqueado.');
    const keyboardCard = window.document.querySelectorAll('.card')[1];
    keyboardCard.dispatchEvent(new window.MouseEvent('click', { bubbles: true, detail: 0 }));
    assert.equal(keyboardCard.classList.contains('flipped'), true, 'Teclado deve continuar virando a carta.');
    window.close();
}

{
    const window = prepararJanela('jogo-memoria.html');
    window.eval(read('js/jogo-memoria.js'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const pairs = new Map();

    window.document.querySelectorAll('.card').forEach((card) => {
        const pair = pairs.get(card.dataset.image) || [];
        pair.push(card);
        pairs.set(card.dataset.image, pair);
    });

    const groupedCards = [...pairs.values()];
    for (const pair of groupedCards.slice(0, -1)) {
        pair[0].click();
        pair[1].click();
        await delay(425);
    }

    const finalPair = groupedCards.at(-1);
    finalPair[0].click();
    finalPair[1].click();
    await delay(425);
    window.document.getElementById('btn-restart').click();
    await delay(600);

    assert.equal(window.document.getElementById('overlay').classList.contains('show'), false,
        'Reiniciar durante a conclusÃ£o nÃ£o pode reabrir o overlay de uma rodada antiga.');
    assert.equal(window.document.getElementById('feedback').classList.contains('show'), false,
        'Reiniciar durante a conclusÃ£o nÃ£o pode manter o feedback de uma rodada antiga.');
    assert.equal(window.document.getElementById('attempts').textContent, '0',
        'A nova rodada deve permanecer ativa apÃ³s cancelar o feedback antigo.');
    window.close();
}

{
    const window = prepararJanela('jogo-deducao-logica.html');
    window.eval(read('js/jogo-deducao-logica.js'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    const puzzles = window.MenteAtivaDeduction.getPuzzles();
    assert.equal(puzzles.length, 45);
    assert.equal(new Set(puzzles.map((p) => p.id)).size, 45);
    const esperadas = {
        f1:'Maria',f2:'Laranja',f3:'Médica',f4:'Peixe',f5:'Ford',f6:'Natação',f7:'2º',f8:'R$ 15',f9:'60',f10:'Preto',f11:'1,60m',f12:'Suco',f13:'Telefonar para a irmã',f14:'Vermelho',f15:'Pão',
        m1:'Tais',m2:'Dermatologia',m3:'Caixa 3',m4:'5',m5:'3ª',m6:'Estrela',m7:'Suco',m8:'Romance',m9:'Alice',m10:'Salada',m11:'10h',m12:'3',m13:'Frutas',m14:'Gaveta 3',m15:'Nara',
        d1:'Alice',d2:'4º',d3:'Bruno',d4:'Belo Horizonte',d5:'Brisa',d6:'Helena',d7:'Quarta',d8:'Jardim',d9:'Pedro',d10:'Branco',d11:'Farmácia',d12:'Bicicleta',d13:'Caixa 3',d14:'Queijos',d15:'Forró'
    };
    for (const puzzle of puzzles) assert.equal(puzzle.opcoes[puzzle.respostaCorreta], esperadas[puzzle.id], `Resposta incorreta em ${puzzle.id}.`);
    assert.ok(puzzles.every((p) => !/[→=≠<>×]/.test(p.explicacao)), 'Explicações devem usar frases simples, sem símbolos matemáticos.');
    const faceis = puzzles.filter((p) => p.nivel === 'facil');
    const medios = puzzles.filter((p) => p.nivel === 'medio');
    const dificeis = puzzles.filter((p) => p.nivel === 'dificil');
    assert.ok(faceis.every((p) => p.opcoes.length === 3), 'Fácil deve manter três alternativas diretas.');
    assert.ok(medios.every((p) => p.opcoes.length === 4), 'Médio deve usar quatro alternativas.');
    assert.ok(dificeis.every((p) => p.opcoes.length >= 4 && p.pistas.length >= 4), 'Difícil deve combinar mais pistas e alternativas.');
    assert.ok(dificeis.some((p) => p.opcoes.length === 6), 'Difícil deve incluir desafios com seis possibilidades.');
    window.close();
}

const deductionHtml = read('jogo-deducao-logica.html');
const deductionCss = read('css/jogo-deducao-logica.css');
assert.match(deductionHtml, /<section class="puzzle-scenario" aria-labelledby="scenarioLabel">/);
assert.match(deductionHtml, /<h2 class="scenario-label" id="scenarioLabel">Cenário<\/h2>/);
assert.match(deductionCss, /\.scenario-label\s*\{[\s\S]*margin:\s*0 auto 14px;[\s\S]*text-align:\s*center;/);

const pinturaCss = read('css/jogo-pintura.css');
assert.match(pinturaCss, /@media \(min-width: 981px\)[\s\S]*\.canvas-container\s*\{\s*padding:\s*0;\s*\}/);
assert.match(pinturaCss, /@media \(min-width: 981px\)[\s\S]*#paintCanvas\s*\{[\s\S]*width:\s*100%;[\s\S]*border:\s*0;/);

console.log('Regras e interações dos jogos validadas.');
