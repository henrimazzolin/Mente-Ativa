import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const appScript = readFileSync(resolve(ROOT, 'js/app.js'), 'utf8');
const privacyScript = readFileSync(resolve(ROOT, 'js/privacidade.js'), 'utf8');
const privacyPage = readFileSync(resolve(ROOT, 'privacidade.html'), 'utf8');

const appDom = new JSDOM('<!doctype html><html><body><main></main><footer><a class="sobre-footer" href="sobre.html">Sobre</a></footer></body></html>', {
    runScripts: 'dangerously',
    url: 'https://mente-ativa.local/menu.html'
});

appDom.window.localStorage.setItem('mente-ativa-modo-escuro', 'true');
appDom.window.localStorage.setItem('estado-jogo-damas', '{"turno":"B"}');
appDom.window.localStorage.setItem('intro_vista', 'true');
appDom.window.eval(appScript);
appDom.window.document.dispatchEvent(new appDom.window.Event('DOMContentLoaded'));

const appDocument = appDom.window.document;
const notice = appDocument.querySelector('.aviso-privacidade');
const footerLink = appDocument.querySelector('.privacidade-footer');

assert.ok(notice, 'O aviso informativo deve aparecer na primeira visita.');
assert.ok(footerLink, 'O rodapé deve receber o link de privacidade.');
assert.equal(footerLink.getAttribute('href'), 'privacidade.html');
assert.equal(appDocument.body.classList.contains('aviso-privacidade-aberto'), true);

notice.querySelector('button').click();
assert.equal(appDom.window.sessionStorage.getItem('mente-ativa-aviso-privacidade-v1'), 'entendido');
assert.equal(appDom.window.localStorage.getItem('mente-ativa-aviso-privacidade-v1'), null);
assert.equal(appDom.window.localStorage.getItem('mente-ativa-modo-escuro'), 'true',
    'Preferencias de acessibilidade devem permanecer salvas.');
assert.equal(appDom.window.localStorage.getItem('estado-jogo-damas'), null,
    'Estado de jogos antigo deve ser removido do armazenamento persistente.');
assert.equal(appDom.window.localStorage.getItem('intro_vista'), null,
    'Estado temporario da introducao nao deve permanecer no armazenamento persistente.');
assert.equal(appDocument.querySelector('.aviso-privacidade'), null, 'O aviso deve fechar após Entendi.');
assert.equal(appDocument.body.classList.contains('aviso-privacidade-aberto'), false);

appDom.window.close();

const privacyFooterDom = new JSDOM('<!doctype html><html><body><footer><a class="sobre-footer" href="sobre.html">Sobre</a></footer></body></html>', {
    runScripts: 'dangerously',
    url: 'https://mente-ativa.local/privacidade.html'
});

privacyFooterDom.window.eval(appScript);
privacyFooterDom.window.document.dispatchEvent(new privacyFooterDom.window.Event('DOMContentLoaded'));
assert.equal(privacyFooterDom.window.document.querySelector('.privacidade-footer'), null, 'A página de privacidade não deve criar um link para si própria no rodapé.');
assert.equal(privacyFooterDom.window.document.querySelector('.aviso-privacidade'), null, 'A página de privacidade não deve mostrar o aviso inicial.');
privacyFooterDom.window.close();

assert.match(privacyPage, /O Mente Ativa não exige cadastro/);
assert.match(privacyPage, /Serviços usados para mostrar o site/);
assert.match(privacyPage, /Pesquisa acadêmica/);
assert.match(privacyPage, /Política de Privacidade e Proteção de Dados/);
assert.match(privacyPage, /Termos de Uso/);
assert.match(privacyPage, /Lei nº 13\.709\/2018/);
assert.match(privacyPage, /não substituem acompanhamento médico/);
assert.match(privacyPage, /id="politica-privacidade"/);
assert.match(privacyPage, /id="termos-de-uso"/);
assert.match(privacyPage, /js\/privacidade\.js/);

const privacyDom = new JSDOM(`<!doctype html><html><body>
    <span id="privacyEventCount"></span>
    <span id="privacyPreferenceStatus"></span>
    <button id="clearCalendarData"></button>
    <button id="clearAllLocalData"></button>
    <p id="privacyActionStatus"></p>
</body></html>`, {
    runScripts: 'dangerously',
    url: 'https://mente-ativa.local/privacidade.html'
});

privacyDom.window.confirm = function() { return true; };
privacyDom.window.localStorage.setItem('menteativa_eventos', JSON.stringify({
    '2026-7-13': [{ titulo: 'Consulta', hora: '09:00', periodo: '' }]
}));
privacyDom.window.localStorage.setItem('mente-ativa-modo-escuro', 'true');
privacyDom.window.eval(privacyScript);
privacyDom.window.document.dispatchEvent(new privacyDom.window.Event('DOMContentLoaded'));

const privacyDocument = privacyDom.window.document;
assert.equal(privacyDocument.getElementById('privacyEventCount').textContent, '1 atividade salva');
assert.equal(privacyDocument.getElementById('privacyPreferenceStatus').textContent, '1 preferência salva');

privacyDocument.getElementById('clearCalendarData').click();
assert.equal(privacyDom.window.localStorage.getItem('menteativa_eventos'), null);
assert.equal(privacyDocument.getElementById('privacyEventCount').textContent, 'nenhuma atividade salva');

privacyDom.window.localStorage.setItem('mente-ativa-som', 'false');
privacyDocument.getElementById('clearAllLocalData').click();
assert.equal(privacyDom.window.localStorage.length, 0);
assert.match(privacyDocument.getElementById('privacyActionStatus').textContent, /redefinidos/);

privacyDom.window.close();
console.log('Fluxo informativo de privacidade validado.');
