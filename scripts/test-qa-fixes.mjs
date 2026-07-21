import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

function testarConfirmacao() {
    const script = read('js/alerts.js');
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        runScripts: 'dangerously',
        url: 'https://mente-ativa.local/jogo-quebra-cabeca.html'
    });

    let chamadas = 0;
    dom.window.confirm = () => false;
    dom.window.eval(script);
    dom.window.exibirConfirmacao('Reiniciar?', () => chamadas++);
    assert.equal(chamadas, 0, 'Cancelar a confirmacao nativa nao pode executar a acao.');

    dom.window.confirm = () => true;
    dom.window.exibirConfirmacao('Reiniciar?', () => chamadas++);
    assert.equal(chamadas, 1, 'Confirmar deve executar a acao uma unica vez.');

    dom.window.bootstrap = {
        Modal: class {
            constructor(element) { this.element = element; }
            show() {}
            hide() {
                this.element.dispatchEvent(new dom.window.Event('hidden.bs.modal'));
            }
        }
    };

    dom.window.exibirConfirmacao('Reiniciar?', () => chamadas++);
    let modal = dom.window.document.querySelector('.modal');
    modal.dispatchEvent(new dom.window.Event('hidden.bs.modal'));
    assert.equal(chamadas, 1, 'Fechar no X, cancelar ou dispensar o modal nao pode executar a acao.');

    dom.window.exibirConfirmacao('Reiniciar?', () => chamadas++);
    modal = dom.window.document.querySelector('.modal');
    modal.querySelector('.btn-ma-confirmar').click();
    assert.equal(chamadas, 2, 'O botao Confirmar deve executar a acao uma unica vez.');
    dom.window.close();
}

function criarDamasEngine() {
    const context = vm.createContext({ console, Math });
    vm.runInContext(`${read('js/lib/damas-engine.js')}\nglobalThis.TestDamasEngine = DamasEngine;`, context);
    return new context.TestDamasEngine();
}

function tabuleiroVazio(engine) {
    engine.tabuleiro = Array.from({ length: 8 }, () => Array(8).fill(null));
    engine.turno = 'W';
    engine.capturaObrigatoria = null;
}

function testarDamas() {
    const engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[5][0] = { tipo: 'p', cor: 'W' };
    engine.tabuleiro[5][4] = { tipo: 'p', cor: 'W' };
    engine.tabuleiro[4][1] = { tipo: 'p', cor: 'B' };
    engine.tabuleiro[2][3] = { tipo: 'p', cor: 'B' };
    assert.equal(engine.obterMovimentosValidos(5, 4).length, 0, 'Uma captura disponivel deve bloquear jogadas simples.');

    let resultado = engine.fazerMovimento(5, 0, 3, 2, 4, 1);
    assert.equal(resultado.sucesso, true);
    assert.equal(resultado.continuaCaptura, true, 'A primeira captura deve manter a vez.');
    assert.equal(engine.turno, 'W');
    assert.deepEqual({ ...engine.capturaObrigatoria }, { l: 3, c: 2 });
    assert.equal(engine.obterMovimentosValidos(5, 4).length, 0, 'Outra peca deve ficar bloqueada durante a cadeia.');

    resultado = engine.fazerMovimento(3, 2, 1, 4, 2, 3);
    assert.equal(resultado.continuaCaptura, false);
    assert.equal(engine.turno, 'B', 'A vez deve mudar apenas ao terminar a cadeia.');
    assert.equal(engine.tabuleiro[4][1], null);
    assert.equal(engine.tabuleiro[2][3], null);

    tabuleiroVazio(engine);
    engine.tabuleiro[2][1] = { tipo: 'p', cor: 'W' };
    engine.tabuleiro[1][2] = { tipo: 'p', cor: 'B' };
    engine.tabuleiro[1][4] = { tipo: 'p', cor: 'B' };

    resultado = engine.fazerMovimento(2, 1, 0, 3, 1, 2);
    assert.equal(engine.tabuleiro[0][3].tipo, 'd', 'A promocao deve acontecer imediatamente.');
    assert.equal(resultado.continuaCaptura, true, 'A nova dama deve continuar capturando na mesma jogada.');
    resultado = engine.fazerMovimento(0, 3, 2, 5, 1, 4);
    assert.equal(resultado.continuaCaptura, false);
    assert.equal(engine.turno, 'B');

    tabuleiroVazio(engine);
    engine.tabuleiro[5][0] = { tipo: 'd', cor: 'W' };
    let movimentosDama = engine.obterMovimentosValidos(5, 0);
    assert.ok(movimentosDama.some((movimento) => movimento.linha === 0 && movimento.coluna === 5),
        'A dama deve percorrer toda a diagonal quando o caminho estiver livre.');

    engine.tabuleiro[3][2] = { tipo: 'p', cor: 'B' };
    movimentosDama = engine.obterMovimentosValidos(5, 0);
    for (const [linha, coluna] of [[2, 3], [1, 4], [0, 5]]) {
        const captura = movimentosDama.find((movimento) => movimento.linha === linha && movimento.coluna === coluna);
        assert.ok(captura, `A dama deve poder pousar em ${linha},${coluna} depois da captura.`);
        assert.deepEqual(
            { linha: captura.capturaLinha, coluna: captura.capturaColuna },
            { linha: 3, coluna: 2 }
        );
    }
}

function testarVitoriaDamas() {
    let engine = criarDamasEngine();
    assert.equal(engine.obterTodasJogadas('W').length, 7,
        'As brancas devem ter sete jogadas no tabuleiro inicial.');
    assert.equal(engine.obterTodasJogadas('B').length, 7,
        'Consultar as pretas fora do turno também deve encontrar suas sete jogadas.');
    assert.equal(engine.obterVencedor(), null, 'A partida não pode começar com um vencedor.');
    assert.equal(engine.ehVencedor('W'), false);
    assert.equal(engine.ehVencedor('B'), false);

    let jogada = engine.obterTodasJogadas('W')[0];
    engine.fazerMovimento(
        jogada.origem.l, jogada.origem.c,
        jogada.destino.l, jogada.destino.c
    );
    assert.equal(engine.turno, 'B');
    assert.equal(engine.obterVencedor(), null,
        'Uma jogada comum das brancas não pode encerrar a partida.');

    jogada = engine.obterTodasJogadas('B')[0];
    engine.fazerMovimento(
        jogada.origem.l, jogada.origem.c,
        jogada.destino.l, jogada.destino.c
    );
    assert.equal(engine.turno, 'W');
    assert.equal(engine.obterVencedor(), null,
        'Uma jogada comum das pretas não pode encerrar a partida.');

    engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[5][0] = { tipo: 'p', cor: 'W' };
    engine.tabuleiro[4][1] = { tipo: 'p', cor: 'B' };
    engine.tabuleiro[2][3] = { tipo: 'p', cor: 'B' };
    let resultado = engine.fazerMovimento(5, 0, 3, 2, 4, 1);
    assert.equal(resultado.continuaCaptura, true);
    assert.equal(engine.obterVencedor(), null,
        'Uma captura em cadeia não pode declarar vencedor antes de ser concluída.');

    engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[5][0] = { tipo: 'p', cor: 'W' };
    engine.turno = 'B';
    assert.equal(engine.obterVencedor(), 'W',
        'As brancas devem vencer quando as pretas ficam sem peças.');
    assert.equal(engine.ehVencedor('W'), true,
        'A API de compatibilidade deve reconhecer o vencedor correto.');

    engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[7][0] = { tipo: 'p', cor: 'B' };
    engine.tabuleiro[0][1] = { tipo: 'p', cor: 'W' };
    engine.turno = 'B';
    assert.equal(engine.contarPecas('B'), 1);
    assert.equal(engine.obterVencedor(), 'W',
        'A cor adversária deve vencer quando a cor do turno não possui jogadas.');

    engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[2][1] = { tipo: 'p', cor: 'B' };
    engine.turno = 'W';
    assert.equal(engine.obterVencedor(), 'B',
        'As pretas devem vencer quando as brancas ficam sem peças.');

    engine = criarDamasEngine();
    tabuleiroVazio(engine);
    engine.tabuleiro[5][0] = { tipo: 'p', cor: 'W' };
    engine.tabuleiro[2][1] = { tipo: 'p', cor: 'B' };
    assert.equal(engine.obterVencedor(), null,
        'Duas peças com jogadas disponíveis não devem produzir vencedor.');
    assert.equal(engine.ehEmpate(), true, 'A regra de empate existente deve ser preservada.');
}

function testarImagensLocais() {
    const fontes = ['js/jogo-memoria.js', 'js/jogo-quebra-cabeca.js'];
    const serviceWorker = read('service-worker.js');
    for (const fonte of fontes) {
        const codigo = read(fonte);
        assert.ok(!codigo.includes('images.unsplash.com'), `${fonte}: ainda usa imagens remotas.`);
        const imagensLiterais = [...codigo.matchAll(/img\/(?:unsplash_[A-Za-z0-9_.-]+|jogos\/[A-Za-z0-9_\/-]+\.png)/g)].map((m) => m[0]);
        const imagensGeradas = [...codigo.matchAll(/localImage\('([^']+)'\)/g)]
            .map((m) => `img/unsplash_${m[1]}.jpg`);
        const imagens = imagensLiterais.concat(imagensGeradas);
        assert.ok(imagens.length > 0, `${fonte}: nenhuma imagem local encontrada.`);
        for (const imagem of new Set(imagens)) {
            assert.ok(existsSync(resolve(ROOT, imagem)), `${fonte}: imagem inexistente: ${imagem}`);
            assert.ok(serviceWorker.includes(`/${imagem}`), `${imagem} deve estar no cache offline.`);
        }
    }
}

function testarPoliticaDeCacheDosJogos() {
    const serviceWorker = read('service-worker.js');
    const arquivos = [
        'jogo-caca-palavras', 'jogo-damas', 'jogo-deducao-logica', 'jogo-memoria',
        'jogo-palavras-cruzadas', 'jogo-pintura', 'jogo-quebra-cabeca', 'jogo-sudoku', 'jogo-xadrez'
    ];
    for (const arquivo of arquivos) {
        assert.ok(serviceWorker.includes(`'/css/${arquivo}.css'`), `${arquivo}: CSS ausente do pre-cache.`);
        assert.ok(!serviceWorker.includes(`'/js/${arquivo}.js'`),
            `${arquivo}: a logica do jogo nao pode permanecer no pre-cache.`);
    }
    assert.ok(!serviceWorker.includes("'/js/lib/damas-engine.js'"));
    assert.ok(!serviceWorker.includes("'/js/lib/chess-engine.js'"));
    assert.match(serviceWorker, /GAME_LOGIC_PATTERN/);
    assert.match(serviceWorker, /FRESH_ASSET_PATTERN/);
    assert.match(serviceWorker, /fetch\(request,\s*\{\s*cache:\s*'no-store'\s*\}\)/);
}

function testarAusenciaDePersistenciaNosJogos() {
    const jogos = readdirSync(resolve(ROOT, 'js'))
        .filter((arquivo) => /^jogo-.*\.js$/.test(arquivo));
    const fontes = new Set([
        ...jogos,
        ...['lib/damas-engine.js', 'lib/chess-engine.js']
    ]);
    for (const arquivo of fontes) {
        const codigo = read(`js/${arquivo}`);
        if (arquivo === 'jogo-pintura.js') {
            assert.match(codigo, /menteAtiva\.pintura\.coresFavoritas/);
            assert.doesNotMatch(codigo, /\bsessionStorage\b|\bindexedDB\b|\bcaches\./);
        } else {
            assert.doesNotMatch(codigo, /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\bcaches\./,
                `${arquivo}: jogos nao podem persistir partidas, jogadas ou logica.`);
        }
    }
    assert.doesNotMatch(read('js/intro.js'), /\blocalStorage\b/,
        'A introducao deve durar apenas a sessao atual.');
    assert.match(read('server.js'), /isGameLogic[\s\S]*Cache-Control', 'no-store, max-age=0'/,
        'O servidor deve impedir cache HTTP da logica dos jogos.');
}

function testarContratosResponsivos() {
    const responsive = read('css/responsive.css');
    const sudoku = read('css/jogo-sudoku.css');
    const xadrez = read('css/jogo-xadrez.css');
    const cruzadas = read('css/jogo-palavras-cruzadas.css');
    const memoria = read('css/jogo-memoria.css');
    const deducao = read('css/jogo-deducao-logica.css');
    const caca = read('css/jogo-caca-palavras.css');
    const cacaScript = read('js/jogo-caca-palavras.js');
    const pintura = read('css/jogo-pintura.css');

    assert.match(responsive, /grid-template-columns:\s*48px minmax\(0, 1fr\) 48px/);
    assert.match(responsive, /\.back-btn[\s\S]*width:\s*48px[\s\S]*height:\s*48px/);
    assert.match(responsive, /\.back-btn:hover,[\s\S]*\.back-btn:focus-visible[\s\S]*transform:\s*none\s*!important/,
        'O botao Voltar nao deve se deslocar para tras ao receber foco ou hover.');
    assert.match(responsive, /\.modal-footer \.btn[\s\S]*flex:\s*1 1 140px/);
    assert.match(responsive, /body \.instrucao-destaque[\s\S]*height:\s*160px/);
    assert.match(responsive, /body \.dificuldade-selector[\s\S]*height:\s*116px/);
    assert.match(responsive, /@media \(max-width:\s*600px\)[\s\S]*body \.instrucao-destaque[\s\S]*height:\s*200px/);
    assert.match(responsive, /body \.dificuldade-selector[\s\S]*grid-template-columns:\s*minmax\(130px, auto\) repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(responsive, /\[id\^="ma-confirm-"\] \.modal-footer[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(sudoku, /aspect-ratio:\s*1(?:\s*\/\s*1)?/);
    assert.match(sudoku, /width:\s*min\(100%,\s*450px\)/);
    assert.match(xadrez, /\.history-item\s*\{[\s\S]*display:\s*grid/);
    assert.match(cruzadas, /\.hint-btn[\s\S]*white-space:\s*nowrap/);
    assert.match(memoria, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(deducao, /grid-template-columns:\s*1\.5em minmax\(0, 1fr\)/);
    assert.match(caca, /\.word-grid[\s\S]*width:\s*100%/);
    assert.match(caca, /\.word-item\.found[\s\S]*text-decoration-color:\s*#000/);
    assert.match(caca, /\.grid-cell\.found\.preview/);
    const inicioSelecao = cacaScript.indexOf('function handlePointerDown');
    const fimSelecao = cacaScript.indexOf('function renderGrid');
    const fluxoSelecao = cacaScript.slice(inicioSelecao, fimSelecao);
    assert.ok(inicioSelecao >= 0 && fimSelecao > inicioSelecao, 'Fluxo de selecao do Caca-Palavras ausente.');
    assert.ok(!fluxoSelecao.includes("classList.contains('found')"),
        'Celulas ja encontradas nao podem bloquear uma nova palavra diagonal ou cruzada.');
    assert.match(cacaScript, /Math\.abs\(dr\)\s*!==\s*Math\.abs\(dc\)/,
        'A selecao diagonal deve aceitar deslocamentos com linha e coluna de mesmo tamanho.');
    assert.match(pintura, /aspect-ratio:\s*4\s*\/\s*3/);
    assert.ok(!/\#paintCanvas\s*\{[^}]*min-height:/s.test(pintura), 'O canvas mobile nao deve deformar a proporcao 4:3.');
}

function testarContrasteSudokuEscuro() {
    const darkCss = read('css/dark-mode.css');
    const inicioSudoku = darkCss.indexOf('/* Sudoku dark mode:');
    const fimSudoku = darkCss.indexOf('/* Palavras Cruzadas', inicioSudoku);
    const darkMode = darkCss.slice(inicioSudoku, fimSudoku);
    const paresDeContraste = [
        ['#C7D9EE', '#202A38', 'numeros preenchidos'],
        ['#EDF2F7', '#2B394C', 'pistas fixas'],
        ['#DCEBFA', '#34516C', 'numeros iguais'],
        ['#F8FAFC', '#3B5C78', 'celula selecionada'],
        ['#C0E4D5', '#24443B', 'respostas corretas'],
        ['#F3C4CC', '#4B2E36', 'respostas incorretas'],
        ['#C4E7DD', '#294944', 'solucao exibida']
    ];

    const luminancia = (hex) => {
        const canais = hex.match(/[0-9a-f]{2}/gi).map((canal) => {
            const valor = Number.parseInt(canal, 16) / 255;
            return valor <= 0.04045 ? valor / 12.92 : ((valor + 0.055) / 1.055) ** 2.4;
        });
        return (0.2126 * canais[0]) + (0.7152 * canais[1]) + (0.0722 * canais[2]);
    };

    const contraste = (primeira, segunda) => {
        const clara = Math.max(luminancia(primeira), luminancia(segunda));
        const escura = Math.min(luminancia(primeira), luminancia(segunda));
        return (clara + 0.05) / (escura + 0.05);
    };

    assert.ok(darkMode.length > 0, 'O Sudoku deve ter uma paleta propria para o modo escuro.');
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell:focus-within/);
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell\.highlight/);
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell\.same-number/);
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell\.correct/);
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell\.wrong/);
    assert.match(darkMode, /html\.modo-escuro \.sudoku-grid \.cell\.solution/);
    assert.doesNotMatch(darkMode, /background:\s*#(?:DBEAFE|E2E8F0|DCFCE7|FEE2E2|F1F5F9|FEF9C3|D1FAE5)/i,
        'O modo escuro nao pode reutilizar os fundos claros do tabuleiro.');

    for (const [texto, fundo, estado] of paresDeContraste) {
        assert.ok(darkMode.includes(texto) && darkMode.includes(fundo),
            `As cores de ${estado} devem fazer parte da paleta escura.`);
        assert.ok(contraste(texto, fundo) >= 4.5,
            `O contraste de ${estado} deve atender ao minimo de 4.5:1.`);
        assert.ok(luminancia(fundo) < 0.12,
            `O fundo de ${estado} deve permanecer suave no modo escuro.`);
    }
}

function testarPintura() {
    const html = read('jogo-pintura.html');
    const script = read('js/jogo-pintura.js');
    assert.ok(!html.includes('dificuldade-selector'), 'Pintura nao deve exibir dificuldade.');
    assert.match(html, /id="btn-eraser"[^>]*aria-pressed="false"/);
    assert.match(html, /id="btn-brush"[^>]*aria-pressed="true"/);
    assert.match(html, /id="paintCanvas" width="1000" height="750"/);
    assert.match(html, /id="customColor" type="color"/);
    assert.match(html, /id="btn-undo"[^>]*disabled/);
    assert.match(html, /id="btn-redo"[^>]*disabled/);
    assert.match(html, /class="paint-actions"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(script, /pointerdown/);
    assert.match(script, /pointermove/);
    assert.match(script, /setPointerCapture/);
    assert.match(script, /canvas\.width\s*\/\s*rect\.width/);
    assert.match(script, /canvas\.height\s*\/\s*rect\.height/);
    assert.match(script, /Math\.max\(0, Math\.min\(canvas\.width/);
    assert.match(script, /activePointerId/);
    assert.match(script, /setAttribute\('aria-pressed'/);
    assert.match(script, /function undo\(\)/);
    assert.match(script, /function redo\(\)/);
    assert.match(script, /redoActions/);
    assert.match(script, /event\.ctrlKey \|\| event\.metaKey/);
    assert.match(script, /menteAtiva\.pintura\.coresFavoritas/);
    assert.doesNotMatch(script, /\bsessionStorage\b|\bindexedDB\b/,
        'Somente as cores favoritas podem persistir; o historico deve ficar em memoria.');

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'https://mente-ativa.local/jogo-pintura.html'
    });
    const context = {
        save() {},
        restore() {},
        fillRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        closePath() {}
    };
    dom.window.HTMLCanvasElement.prototype.getContext = function() { return context; };
    const canvas = dom.window.document.getElementById('paintCanvas');
    canvas.getBoundingClientRect = function() {
        return { left: 0, top: 0, width: 500, height: 375 };
    };
    canvas.setPointerCapture = function() {};
    canvas.hasPointerCapture = function() { return false; };
    canvas.releasePointerCapture = function() {};
    dom.window.exibirConfirmacao = function(_mensagem, _descricao, callback) { callback(true); };
    dom.window.exibirAlerta = function() {};
    dom.window.eval(script);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    assert.equal(dom.window.document.querySelectorAll('.color-btn').length, 10);
    assert.equal(dom.window.document.getElementById('btn-undo').disabled, true);
    assert.equal(dom.window.document.getElementById('btn-save').disabled, true);

    function pointerEvent(type, x, y) {
        const event = new dom.window.Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(event, {
            pointerId: { value: 1 },
            clientX: { value: x },
            clientY: { value: y }
        });
        return event;
    }

    canvas.dispatchEvent(pointerEvent('pointerdown', 50, 50));
    canvas.dispatchEvent(pointerEvent('pointermove', 120, 100));
    canvas.dispatchEvent(pointerEvent('pointerup', 120, 100));
    assert.equal(dom.window.document.getElementById('btn-undo').disabled, false,
        'Um traco deve habilitar Desfazer.');
    assert.equal(dom.window.document.getElementById('btn-save').disabled, false,
        'Um traco deve habilitar o download.');

    dom.window.document.getElementById('btn-undo').click();
    assert.equal(dom.window.document.getElementById('btn-redo').disabled, false);
    assert.equal(dom.window.document.getElementById('btn-save').disabled, true);
    dom.window.document.getElementById('btn-redo').click();
    assert.equal(dom.window.document.getElementById('btn-save').disabled, false);

    dom.window.document.getElementById('btn-clear').click();
    assert.equal(dom.window.document.getElementById('btn-save').disabled, true);
    dom.window.document.getElementById('btn-undo').click();
    assert.equal(dom.window.document.getElementById('btn-save').disabled, false,
        'Desfazer apos limpar deve recuperar o desenho.');
    dom.window.close();
}

function testarCacaPalavrasComIntersecao() {
    const dom = new JSDOM(`<!doctype html><html><body>
        <button class="dif-btn active" data-dif="facil"></button>
        <button class="dif-btn" data-dif="medio"></button>
        <button class="dif-btn" data-dif="dificil"></button>
        <span id="score"></span><span id="totalWords"></span><span id="themeDisplay"></span>
        <div id="gridContainer"></div><div id="wordList"></div>
        <button id="btn-restart"></button>
        <div id="overlay"></div><div id="feedbackModal"></div>
        <div id="feedbackIcon"></div><div id="feedbackTitle"></div>
        <div id="feedbackText"></div><div id="finalScore"></div><button id="feedbackBtn"></button>
    </body></html>`, {
        runScripts: 'dangerously',
        url: 'https://mente-ativa.local/jogo-caca-palavras.html'
    });

    let seed = 123456789;
    dom.window.Math.random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    };
    dom.window.exibirConfirmacao = () => {};
    dom.window.eval(read('js/jogo-caca-palavras.js'));
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    const medio = dom.window.document.querySelector('[data-dif="medio"]');
    let diagonal = null;

    for (let tentativa = 0; tentativa < 40 && !diagonal; tentativa++) {
        medio.click();
        const celulas = [...dom.window.document.querySelectorAll('.grid-cell')];
        const tamanho = Math.sqrt(celulas.length);
        const matriz = Array.from({ length: tamanho }, (_, linha) =>
            Array.from({ length: tamanho }, (_, coluna) =>
                dom.window.document.querySelector(`[data-row="${linha}"][data-col="${coluna}"]`).textContent
            )
        );
        const palavras = [...dom.window.document.querySelectorAll('.word-item')].map((item) => item.dataset.word);

        for (const palavra of palavras) {
            for (let linha = 0; linha < tamanho && !diagonal; linha++) {
                for (let coluna = 0; coluna < tamanho && !diagonal; coluna++) {
                    for (const [dl, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                        const caminho = [];
                        let corresponde = true;
                        for (let indice = 0; indice < palavra.length; indice++) {
                            const l = linha + indice * dl;
                            const c = coluna + indice * dc;
                            if (l < 0 || l >= tamanho || c < 0 || c >= tamanho || matriz[l][c] !== palavra[indice]) {
                                corresponde = false;
                                break;
                            }
                            caminho.push({ linha: l, coluna: c });
                        }
                        if (corresponde) diagonal = { palavra, caminho };
                    }
                }
            }
        }
    }

    assert.ok(diagonal, 'O teste deve encontrar uma palavra diagonal gerada.');
    const elementos = diagonal.caminho.map(({ linha, coluna }) =>
        dom.window.document.querySelector(`[data-row="${linha}"][data-col="${coluna}"]`)
    );
    elementos[Math.floor(elementos.length / 2)].classList.add('found');
    elementos[elementos.length - 1].classList.add('found');

    elementos[0].dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true }));
    for (let indice = 1; indice < elementos.length; indice++) {
        elementos[indice].dispatchEvent(new dom.window.MouseEvent('mouseenter', { bubbles: false }));
    }
    elementos[elementos.length - 1].dispatchEvent(new dom.window.MouseEvent('mouseup', { bubbles: true }));

    const item = dom.window.document.querySelector(`.word-item[data-word="${diagonal.palavra}"]`);
    assert.ok(item.classList.contains('found'),
        'Uma diagonal deve ser aceita mesmo atravessando e terminando em celulas ja encontradas.');
    dom.window.close();
}

function testarFluxosEPadronizacao() {
    const memoriaHtml = read('jogo-memoria.html');
    const quebraCabecaHtml = read('jogo-quebra-cabeca.html');
    const pinturaCss = read('css/jogo-pintura.css');
    const cacaCss = read('css/jogo-caca-palavras.css');
    const calendarioCss = read('css/calendario.css');
    const accessibilityJs = read('js/accessibility-unified.js');
    const damasJs = read('js/jogo-damas.js');
    const xadrezJs = read('js/jogo-xadrez.js');

    assert.ok(!memoriaHtml.includes('btn-como-jogar'), 'Memoria nao deve duplicar o botao Como jogar.');
    assert.ok(!memoriaHtml.includes('comoJogarModal'), 'Memoria nao deve duplicar o modal Como jogar.');
    assert.equal((quebraCabecaHtml.match(/Como jogar:/g) || []).length, 0,
        'Quebra-cabeca nao deve manter instrucoes textuais antigas.');
    assert.ok(!quebraCabecaHtml.includes('class="instructions"'),
        'Quebra-cabeca nao deve manter o bloco de instrucoes duplicado.');
    assert.match(accessibilityJs, /Veja no vídeo abaixo como jogar\./,
        'O componente moderno de video deve apresentar uma unica orientacao curta.');
    assert.match(accessibilityJs, /how-to-video-overlay/,
        'O componente moderno deve abrir o video em modal.');
    assert.match(pinturaCss, /\.paint-editor[\s\S]*grid-template-columns:\s*minmax\(300px, 350px\) minmax\(0, 1fr\)/);
    assert.match(pinturaCss, /\.paint-actions[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/);
    assert.match(pinturaCss, /\.canvas-hint\.hidden[\s\S]*visibility:\s*hidden/);
    assert.match(cacaCss, /@keyframes selectionTrail/);
    assert.match(calendarioCss, /\.modal-overlay \.modal[\s\S]*overflow-y:\s*visible/);

    for (const [nome, codigo] of [['Damas', damasJs], ['Xadrez', xadrezJs]]) {
        assert.match(codigo, /function reiniciarFluxoDoJogo\(\)/, `${nome}: fluxo de reinicio dedicado ausente.`);
        assert.match(codigo, /btn-reload[\s\S]*reiniciarFluxoDoJogo\(\)/, `${nome}: Jogar novamente deve reutilizar o fluxo limpo.`);
    }
    assert.match(damasJs, /floater\.animate\(/, 'Damas deve animar o deslocamento da peca inimiga.');
    assert.match(damasJs, /var winner = engine\.obterVencedor\(\)/,
        'Damas deve obter o vencedor diretamente do motor.');
    assert.doesNotMatch(damasJs, /engine\.ehVencedor\(robotColor\)|engine\.ehVencedor\(playerColor\)/,
        'A tela não deve voltar a consultar as duas cores separadamente.');
}

function testarNavegacaoInformativa() {
    const script = read('js/info-navigation.js');
    assert.match(script, /document\.referrer/);
    assert.match(script, /window\.history\.back\(\)/);
    assert.match(script, /window\.location\.href\s*=\s*'menu\.html'/);
    for (const pagina of ['sobre.html', 'privacidade.html']) {
        assert.match(read(pagina), /href="menu\.html" class="info-back-link"/);
        assert.match(read(pagina), /js\/info-navigation\.js/);
    }
}

function testarPadronizacaoDoHeaderDoMenu() {
    const html = read('menu.html');
    const responsive = read('css/responsive.css');
    assert.match(html, /<div class="header">/);
    assert.doesNotMatch(html, /menu-header-centralizado|id="menuHeader"/);
    assert.doesNotMatch(responsive, /menu-header-centralizado|#menuHeader/);
    assert.match(responsive, /body:has\(\.header \.back-btn\) \.container > \.header\s*\{[\s\S]*grid-template-columns:\s*48px minmax\(0, 1fr\) 48px[\s\S]*padding:\s*12px 14px/);
}

testarConfirmacao();
testarDamas();
testarVitoriaDamas();
testarImagensLocais();
testarPoliticaDeCacheDosJogos();
testarAusenciaDePersistenciaNosJogos();
testarContratosResponsivos();
testarContrasteSudokuEscuro();
testarPintura();
testarCacaPalavrasComIntersecao();
testarFluxosEPadronizacao();
testarNavegacaoInformativa();
testarPadronizacaoDoHeaderDoMenu();

console.log('Correcoes do QA validadas.');
