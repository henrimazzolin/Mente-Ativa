import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const script = readFileSync(resolve(ROOT, 'js/accessibility-unified.js'), 'utf8');
const styles = readFileSync(resolve(ROOT, 'css/dark-mode.css'), 'utf8');
const assistantScript = readFileSync(resolve(ROOT, 'js/assistente-flutuante.js'), 'utf8');
const assistantStyles = readFileSync(resolve(ROOT, 'css/assistente-flutuante.css'), 'utf8');

const dom = new JSDOM('<!doctype html><html><head></head><body><main class="container"></main></body></html>', {
    runScripts: 'dangerously',
    url: 'https://mente-ativa.local/menu.html'
});

dom.window.alert = function() {};
dom.window.eval(script);
dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

const { document, localStorage } = dom.window;
const panel = document.getElementById('mente-ativa-controls');
const title = document.getElementById('ma-panel-title');
const fontControl = document.querySelector('.ma-btn-font-size');
const reminder = document.getElementById('ma-btn-notificacao');
const accessibilityIcon = document.querySelector('[data-icon="accessibility"]');

assert.ok(panel, 'O painel deve ser criado.');
assert.ok(panel.classList.contains('open'), 'O painel deve iniciar aberto na primeira visita.');
assert.equal(panel.getAttribute('aria-hidden'), 'false');
assert.ok(title.classList.contains('ma-panel-title'), 'O título deve ficar isolado da escala global de fonte.');
assert.equal(fontControl.children.length, 3, 'O controle de fonte deve ter menos, rótulo e mais.');
assert.ok(fontControl.children[0].classList.contains('ma-btn-font-minus'));
assert.ok(fontControl.children[2].classList.contains('ma-btn-font-plus'));
assert.equal(panel.querySelector('.ma-btn-assistente'), null, 'Ajuda nao deve fazer parte do painel de acessibilidade.');
assert.ok(accessibilityIcon, 'O botao deve usar o novo simbolo de acessibilidade.');
assert.ok(reminder.classList.contains('ma-btn'), 'Lembretes deve usar a mesma base visual dos demais botões.');

const decreaseFont = fontControl.querySelector('.ma-btn-font-minus');
const increaseFont = fontControl.querySelector('.ma-btn-font-plus');
const fontPercentage = fontControl.querySelector('.ma-btn-font-pct');

for (let i = 0; i < 4; i++) decreaseFont.click();
assert.equal(fontPercentage.textContent, '80%');
for (let i = 0; i < 2; i++) increaseFont.click();
assert.equal(fontPercentage.textContent, '100%');
for (let i = 0; i < 2; i++) increaseFont.click();
assert.equal(fontPercentage.textContent, '120%');
for (let i = 0; i < 2; i++) increaseFont.click();
assert.equal(fontPercentage.textContent, '140%');

assert.match(styles, /--ma-panel-width:\s*360px/);
assert.match(styles, /--ma-control-height:\s*72px/);
assert.doesNotMatch(styles, /--ma-control-height:\s*56px/);
assert.match(styles, /grid-template-columns:\s*var\(--ma-control-height\) minmax\(0, 1fr\) var\(--ma-control-height\)/);
assert.match(styles, /#ma-btn-notificacao::before\s*\{\s*content:\s*none;/);

Object.defineProperty(document, 'hidden', { configurable: true, value: true });
document.dispatchEvent(new dom.window.Event('visibilitychange'));

assert.ok(!panel.classList.contains('open'), 'O painel deve fechar quando a aba deixa de ficar visível.');
assert.equal(panel.getAttribute('aria-hidden'), 'true');
assert.equal(localStorage.getItem('mente-ativa-painel-aberto'), 'false');

dom.window.close();

const assistantDom = new JSDOM('<!doctype html><html><head></head><body><main></main></body></html>', {
    runScripts: 'dangerously',
    url: 'https://mente-ativa.local/menu.html'
});

assistantDom.window.eval(assistantScript);
assistantDom.window.document.dispatchEvent(new assistantDom.window.Event('DOMContentLoaded'));

const assistantDocument = assistantDom.window.document;
const assistantTrigger = assistantDocument.getElementById('assistenteTrigger');
const assistantOverlay = assistantDocument.getElementById('assistenteOverlay');
const assistantClose = assistantDocument.getElementById('assistenteCloseBtn');

assert.ok(assistantTrigger, 'O acionador global de ajuda deve ser criado.');
assert.equal(assistantTrigger.textContent.trim().replace(/\s+/g, ' '), '? Ajuda');
assert.equal(assistantTrigger.getAttribute('aria-expanded'), 'false');
assert.equal(assistantTrigger.getAttribute('aria-controls'), 'assistenteOverlay');
assert.match(assistantStyles, /min-height:\s*56px/);

assistantTrigger.click();
assert.ok(assistantOverlay.classList.contains('open'), 'A ajuda deve abrir pelo acionador global.');
assert.equal(assistantTrigger.getAttribute('aria-expanded'), 'true');
assert.equal(assistantDocument.activeElement, assistantClose, 'O foco deve ir para o botao de fechar.');

assistantClose.click();
assert.ok(!assistantOverlay.classList.contains('open'), 'A ajuda deve fechar pelo botao interno.');
assert.equal(assistantTrigger.getAttribute('aria-expanded'), 'false');
assert.equal(assistantDocument.activeElement, assistantTrigger, 'O foco deve voltar ao acionador de ajuda.');

assistantTrigger.click();
assistantDocument.dispatchEvent(new assistantDom.window.KeyboardEvent('keydown', { key: 'Escape' }));
assert.ok(!assistantOverlay.classList.contains('open'), 'A tecla Esc deve fechar a ajuda.');
assert.equal(assistantTrigger.getAttribute('aria-expanded'), 'false');
assert.equal(assistantDocument.activeElement, assistantTrigger, 'A tecla Esc deve devolver o foco ao acionador.');

assistantDom.window.close();
console.log('Componente de acessibilidade validado.');
