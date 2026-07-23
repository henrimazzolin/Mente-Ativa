import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (file) => readFileSync(resolve(ROOT, file), 'utf8');

const paintHtml = read('jogo-pintura-simples.html');
const paintCss = read('css/jogo-pintura-simples.css');
const paintJs = read('js/jogo-pintura-simples.js');
const coordinationHtml = read('jogo-toque.html');
const coordinationCss = read('css/jogo-toque.css');
const coordinationJs = read('js/jogo-toque.js');
const musicHtml = read('jogo-musica.html');
const musicCss = read('css/jogo-musica.css');
const musicJs = read('js/jogo-musica.js');

// Pintura: a modernização visual deve preservar toda a mecânica existente.
for (const id of ['simpleColors', 'simpleBrush', 'simpleEraser', 'simpleClear', 'simplePaintCanvas', 'simplePaintStatus']) {
    assert.match(paintHtml, new RegExp(`id="${id}"`), `Controle de pintura ausente: ${id}.`);
}
assert.match(paintHtml, /simple-palette-panel/);
assert.match(paintHtml, /simple-tools-panel/);
assert.match(paintHtml, /simple-drawing-panel/);
assert.match(paintCss, /border-radius:\s*30px/);
assert.match(paintCss, /gap:\s*clamp\(18px, 3vw, 28px\)/);
assert.match(paintCss, /@media \(max-width: 600px\)/);
assert.match(paintJs, /canvas\.addEventListener\('pointerdown'/);
assert.match(paintJs, /exibirConfirmacao\('Limpar a pintura\?'/);

// Coordenação: oito trajetos únicos, sorteio sem repetição e progresso tolerante.
const pathIds = [...coordinationJs.matchAll(/\{ id: '([^']+)', name: '[^']+', d: '[^']+' \}/g)].map((match) => match[1]);
assert.equal(pathIds.length, 8, 'A coordenação deve oferecer oito trajetos.');
assert.equal(new Set(pathIds).size, 8, 'Os oito trajetos devem ser únicos.');
for (const id of ['horizontal', 'vertical', 'diagonal', 'curve', 'corner', 'wave', 'zigzag', 'composed']) {
    assert.ok(pathIds.includes(id), `Trajeto ausente: ${id}.`);
}
assert.doesNotMatch(coordinationHtml, /score-display|id="grid"|Acertos|Falta/);
assert.match(coordinationHtml, /id="traceBoard"/);
assert.match(coordinationHtml, /id="pathCounter">Caminho 1 de 8/);
assert.match(coordinationJs, /order = shuffle\(PATHS\)/);
assert.match(coordinationJs, /CHECKPOINT_COUNT = 48/);
assert.match(coordinationJs, /setPointerCapture/);
assert.match(coordinationJs, /checkpoints\[checkpointIndex\]/, 'A retomada deve usar o último checkpoint alcançado.');
assert.match(coordinationJs, /Tudo bem\. Aproxime o dedo da linha e continue\./);
assert.doesNotMatch(coordinationJs, /classList\.add\('wrong'\)|pontua|acertos|vidas|cron[oô]metro/i);
assert.match(coordinationCss, /touch-action:\s*none/);
assert.match(coordinationCss, /min-height:\s*54px/);

// Música: seis placeholders e simulação sem qualquer fonte ou API de áudio.
const trackIds = [...musicJs.matchAll(/\{ id: '(musica-\d+)', title: 'Música \d+', artist: 'Artista a definir', duration: '--:--', audioSrc: null \}/g)].map((match) => match[1]);
assert.equal(trackIds.length, 6, 'A playlist deve conter seis faixas de demonstração.');
assert.equal(new Set(trackIds).size, 6, 'As seis faixas devem possuir identificadores únicos.');
assert.match(musicHtml, /Demonstração visual/);
assert.match(musicHtml, /sem produzir som/);
assert.match(musicHtml, /role="progressbar"/);
assert.match(musicJs, /DEMO_DURATION = 30/);
assert.match(musicJs, /activeTrackId/);
assert.match(musicJs, /playing = isSameTrack \? !playing : true/);
assert.doesNotMatch(musicJs, /AudioContext|webkitAudioContext|createOscillator|createBufferSource|new Audio\s*\(/);
assert.doesNotMatch(musicHtml, /Acertos|Questão|optionsGrid|Que som você ouviu/);
assert.match(musicCss, /\.track-play[\s\S]*min-height:\s*58px/);
assert.match(musicCss, /@media \(max-width: 390px\)/);

const musicDom = new JSDOM(`<!doctype html><html><body>
    <section id="nowPlaying"><strong id="currentTrackTitle"></strong><small id="currentTrackArtist"></small></section>
    <span id="currentTime"></span>
    <div class="player-progress" aria-valuenow="0"><span id="playerProgressFill"></span></div>
    <p id="musicStatus"></p>
    <div id="playlist"></div>
</body></html>`, { runScripts: 'dangerously', url: 'https://mente-ativa.local/jogo-musica.html' });
musicDom.window.eval(musicJs);
musicDom.window.document.dispatchEvent(new musicDom.window.Event('DOMContentLoaded'));
const musicDocument = musicDom.window.document;
const playButtons = musicDocument.querySelectorAll('.track-play');
assert.equal(playButtons.length, 6, 'As seis faixas devem ser renderizadas no DOM.');
playButtons[0].click();
assert.ok(musicDocument.querySelectorAll('.track')[0].classList.contains('active'));
assert.equal(playButtons[0].getAttribute('aria-pressed'), 'true', 'O primeiro clique deve iniciar a prévia.');
playButtons[0].click();
assert.equal(playButtons[0].getAttribute('aria-pressed'), 'false', 'O segundo clique deve pausar a prévia.');
playButtons[1].click();
assert.ok(!musicDocument.querySelectorAll('.track')[0].classList.contains('active'));
assert.ok(musicDocument.querySelectorAll('.track')[1].classList.contains('active'), 'A nova faixa deve substituir a anterior.');
playButtons[1].click();
musicDom.window.close();

// Os arquivos alterados não devem reintroduzir mojibake conhecido.
for (const [name, contents] of Object.entries({ paintHtml, paintCss, paintJs, coordinationHtml, coordinationCss, coordinationJs, musicHtml, musicCss, musicJs })) {
    assert.doesNotMatch(contents, /Ã.|Â.|â€|ðŸ|ï¸/, `Texto com codificação corrompida em ${name}.`);
}

console.log('Jogos para idosos dependentes validados.');
