import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

function criarChess() {
    const context = vm.createContext({ console, Math, Map });
    vm.runInContext(`${read('js/lib/chess-engine.js')}\nglobalThis.TestChess = ChessEngine;`, context);
    return new context.TestChess();
}

function tabuleiroVazio(engine) {
    engine.tabuleiro = Array.from({ length: 8 }, () => Array(8).fill(null));
    engine.turno = 'W';
    engine.direitos_roque = { WK: false, WQ: false, BK: false, BQ: false };
    engine.enPassantTarget = null;
    engine.halfmoveClock = 0;
    engine.reiPosicoes = { W: { linha: 7, coluna: 4 }, B: { linha: 0, coluna: 4 } };
    engine.tabuleiro[7][4] = { tipo: 'k', cor: 'W' };
    engine.tabuleiro[0][4] = { tipo: 'k', cor: 'B' };
    engine.repeticoes = new Map([[engine.chavePosicao(), 1]]);
}

const chess = criarChess();
tabuleiroVazio(chess);
assert.equal(chess.obterMotivoEmpate(), 'material-insuficiente');
chess.tabuleiro[6][2] = { tipo: 'b', cor: 'W' };
assert.equal(chess.obterMotivoEmpate(), 'material-insuficiente');
chess.tabuleiro[1][5] = { tipo: 'b', cor: 'B' };
assert.equal(chess.obterMotivoEmpate(), 'material-insuficiente', 'Bispos na mesma cor devem empatar.');
chess.tabuleiro[1][5] = { tipo: 'n', cor: 'B' };
assert.notEqual(chess.obterMotivoEmpate(), 'material-insuficiente', 'Dois cavalos adversarios nao sao material insuficiente automatico.');
chess.tabuleiro[1][5] = { tipo: 'r', cor: 'B' };
chess.halfmoveClock = 100;
assert.equal(chess.obterMotivoEmpate(), 'cinquenta-lances');
chess.halfmoveClock = 0;
chess.repeticoes.set(chess.chavePosicao(), 3);
assert.equal(chess.obterMotivoEmpate(), 'repeticao-tripla');
assert.equal(chess.copiar().repeticoes.get(chess.chavePosicao()), 3);

const logic = read('js/jogo-deducao-logica.js');
for (const nivel of ['facil', 'medio', 'dificil']) {
    const ids = [...logic.matchAll(new RegExp(`id:'([fmd]\\d+)', level:'${nivel}'`, 'g'))].map((m) => m[1]);
    const antigos = [...logic.matchAll(new RegExp(`id: '([fmd]\\d+)', level: '${nivel}'`, 'g'))].map((m) => m[1]);
    assert.equal(new Set(ids.concat(antigos)).size, 15, `Devem existir 15 perguntas no nivel ${nivel}.`);
}
assert.match(logic, /nivel:\s*puzzle\.level/);
assert.match(logic, /historia:\s*puzzle\.scenario/);
assert.match(logic, /respostaCorreta:/);

const caca = read('js/jogo-caca-palavras.js');
assert.match(caca, /reversedWord/);
for (const tema of ['natureza','saude','alimento','cultura','animais','casa','viagens','musica']) assert.match(caca, new RegExp(`${tema}: \\[`));
assert.match(caca, /key !== lastThemeKey/);

const pintura = read('js/jogo-pintura.js');
assert.match(pintura, /slice\(0, 8\)/);
assert.match(pintura, /\^#\[0-9A-F\]\{6\}\$/);

for (const asset of [
    'img/jogos/memoria/maca.png', 'img/jogos/memoria/guarda-chuva.png',
    'img/jogos/quebra-cabeca/jardim-florido.png', 'img/jogos/quebra-cabeca/cesta-de-frutas.png',
    'jogo-pintura-simples.html', 'js/info-carousel.js'
]) assert.ok(existsSync(resolve(ROOT, asset)), `Arquivo ausente: ${asset}`);

for (const page of ['saude-informacoes.html', 'seguranca.html']) {
    const html = read(page);
    assert.equal((html.match(/data-video-slide/g) || []).length, 3);
    assert.match(html, /data-carousel-prev/);
    assert.match(html, /data-carousel-next/);
}

const placeholders = read('js/accessibility-unified.js');
assert.equal((placeholders.match(/'jogo-[^']+\.html':/g) || []).length, 9);
assert.match(read('exercicios.html'), /aria-label="Opções de saúde e bem-estar"/);
assert.doesNotMatch(read('exercicios.html'), /O que você procura\?|Duas formas simples de cuidar de você/);

console.log('Melhorias do backlog validadas.');
