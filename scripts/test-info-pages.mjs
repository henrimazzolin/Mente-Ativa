import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

for (const page of ['sobre.html', 'privacidade.html']) {
    const html = read(page);
    const backPosition = html.indexOf('class="info-back-link"');
    const logoPosition = html.indexOf('class="logo info-brand-logo"');

    assert.match(html, /<header class="info-brand-header">/, `${page}: cabecalho transparente ausente.`);
    assert.ok(!html.includes('info-page-header'), `${page}: cabecalho antigo ainda presente.`);
    assert.ok(backPosition >= 0, `${page}: botao Voltar ao menu ausente.`);
    assert.ok(logoPosition > backPosition, `${page}: a logo deve aparecer abaixo do botao.`);
    assert.match(html, /data-logo-tipo="inicial"/, `${page}: variante inicial da logo ausente.`);
    assert.match(html, /js\/info-navigation\.js/, `${page}: navegacao de retorno compartilhada ausente.`);
}

const mainCss = read('css/main.css');
const headerRule = mainCss.slice(
    mainCss.indexOf('.info-brand-header {'),
    mainCss.indexOf('.info-back-link {')
);

assert.match(headerRule, /flex-direction:\s*column/);
assert.match(headerRule, /background:\s*transparent/);
assert.match(headerRule, /box-shadow:\s*none/);
assert.match(mainCss, /\.info-back-link[\s\S]*min-height:\s*48px/);
assert.match(mainCss, /\.info-back-link:focus-visible[\s\S]*outline:/);

for (const stylesheet of ['css/sobre.css', 'css/privacidade.css']) {
    const css = read(stylesheet);
    assert.match(css, /background-image:\s*url\(\.\.\/img\/neutralbkg\.png\)/);
    assert.match(css, /background-image:\s*url\(\.\.\/img\/darkneutralbkg\.jpeg\)/);
    assert.ok(!css.includes('darkneutralbkg.png'), `${stylesheet}: fundo escuro antigo ainda referenciado.`);
}

const logoScript = read('js/components/logo.js');
assert.match(logoScript, /claro:\s*'img\/Logopreta\.png'/);
assert.match(logoScript, /escuro:\s*'img\/Logobranca\.png'/);

const serviceWorker = read('service-worker.js');
assert.match(serviceWorker, /CACHE_NAME\s*=\s*'mente-ativa-v16'/);
assert.match(serviceWorker, /'\/js\/info-navigation\.js'/);
assert.match(serviceWorker, /'\/img\/darkneutralbkg\.jpeg'/);
assert.match(serviceWorker, /'\/img\/Logopreta\.png'/);
assert.match(serviceWorker, /'\/img\/Logobranca\.png'/);

console.log('Cabecalhos e temas de Sobre e Privacidade validados.');
