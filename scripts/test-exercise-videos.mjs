import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');
const html = read('exercicios-fisicos.html');
const css = read('css/exercicios-fisicos.css');
const serviceWorker = read('service-worker.js');

const categories = ['sentados', 'alongamento', 'equilibrio', 'fortalecimento', 'caminhada'];
const expectedIds = [
    'fq3usJz2uEw', 'Hxi_y9l9O6s', 'lUP3-sjF6Yw',
    '4f0LLMG7IJY', 'OwCTukZyEmA', 'DiRH5h8uFPs',
    'nNu2-e5_PiY', 'Zu0B2trfXTg', 'IqenhLvQxJk',
    'Cc5Z1Fun5nc', 'JrVyCGblQbg', 'aJxXzRaKnUw',
    'c0RFwnSCph8', '9pFKeA4Yc4w', 'hAHRmLdyd4w'
];

const iframeTags = html.match(/<iframe\b[^>]*><\/iframe>/g) || [];
assert.equal(iframeTags.length, 15, 'A biblioteca deve conter exatamente quinze iframes.');

const embeddedIds = iframeTags.map((tag) => {
    const match = tag.match(/youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})\?rel=0/);
    assert.ok(match, 'Todo vídeo deve usar youtube-nocookie.com e rel=0.');
    assert.match(tag, /title="Vídeo: [^"]+"/, 'Todo iframe deve ter título acessível.');
    assert.match(tag, /loading="lazy"/, 'Todo iframe deve usar carregamento tardio.');
    assert.match(tag, /referrerpolicy="strict-origin-when-cross-origin"/);
    assert.match(tag, /allowfullscreen/);
    assert.doesNotMatch(tag, /autoplay/i, 'Nenhum vídeo deve iniciar automaticamente.');
    return match[1];
});

assert.equal(new Set(embeddedIds).size, 15, 'Os IDs incorporados devem ser únicos.');
assert.deepEqual([...embeddedIds].sort(), [...expectedIds].sort(), 'A curadoria de vídeos foi alterada.');

const youtubeLinks = [...html.matchAll(/href="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})"/g)]
    .map((match) => match[1]);
assert.equal(youtubeLinks.length, 15, 'Cada vídeo deve possuir um link alternativo para o YouTube.');
assert.deepEqual([...youtubeLinks].sort(), [...expectedIds].sort());

for (let index = 0; index < categories.length; index += 1) {
    const id = categories[index];
    const start = html.indexOf(`id="${id}"`);
    const end = index + 1 < categories.length
        ? html.indexOf(`id="${categories[index + 1]}"`)
        : html.indexOf('class="exercise-channel-credit"');
    assert.ok(start >= 0 && end > start, `Categoria ${id} ausente ou fora de ordem.`);
    const categoryMarkup = html.slice(start, end);
    assert.equal((categoryMarkup.match(/<iframe\b/g) || []).length, 3,
        `Categoria ${id} deve possuir três vídeos.`);
    assert.match(html, new RegExp(`href="#${id}"`), `Atalho para ${id} ausente.`);
}

assert.match(html, /Prepare-se antes de começar/);
assert.match(html, /Pare imediatamente/);
assert.match(html, /dor, tontura, falta de ar ou palpitação/);
assert.match(html, /UCvphc_K3Cd0YFTygQsvKUEQ\/videos/);
assert.doesNotMatch(html, /Caminhada Leve|Exercícios com Cadeira/,
    'Os cartões informativos antigos não devem permanecer na biblioteca.');

assert.match(css, /\.exercise-video-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.exercise-video-grid\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/);
assert.match(css, /\.exercise-video-frame\s*\{[\s\S]*aspect-ratio:\s*16\s*\/\s*9/);
assert.match(css, /html\.modo-escuro \.exercise-category/);
assert.match(css, /scroll-behavior:\s*auto/);
assert.match(serviceWorker, /CACHE_NAME\s*=\s*'mente-ativa-v27'/);

console.log('Biblioteca de vídeos de exercícios validada.');
