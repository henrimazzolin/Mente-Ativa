import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

const pages = {
    'seguranca.html': {
        ids: [
            '4M5nwihkql4', 'Bot-4HY7sGs', 'iGksPRqsgrc', '8vYxH9PxYhk', 'wFlJlmIjL1s',
            'uA4-QUcf778', 'vtLgsMJboTI', '-0ip2FDP63I', 'rK4uAmgS8iM', 'QoLiGxwMiVw',
            'd-znEtdgQdw'
        ],
        topics: [
            'pix', 'compras-online', 'motoboy', 'whatsapp', 'phishing',
            'falsa-central', 'pix-errado', 'mensageiros', 'cartao-virtual', 'celular',
            'protecao'
        ]
    },
    'saude-informacoes.html': {
        ids: [
            '8vljvdwYKq8', '-by1LV8ioA8', 'gSh_ok62-6k', '7Pvgj_fQLBU', '_cPSjc8OZ_w',
            'FUmpIqzWrb8', 'Co-qzbO7uu8', '6hOCOqhHGIY', '_SRSXOH-m74', 'gV50Dp9ycHI'
        ],
        topics: [
            'alimentacao', 'hidratacao', 'quedas', 'medicamentos', 'sono',
            'vacinacao', 'saude-bucal', 'audicao', 'visao', 'convivencia'
        ]
    }
};

const allIds = [];

for (const [page, expected] of Object.entries(pages)) {
    const html = read(page);
    const document = new JSDOM(html).window.document;
    const carousel = document.querySelector('[data-video-carousel]');
    const slides = [...carousel.querySelectorAll('[data-video-slide]')];
    const ids = slides.map((slide) => slide.querySelector('[data-youtube-id]')?.dataset.youtubeId);
    const topics = slides.map((slide) => slide.dataset.videoTopic);

    assert.ok(carousel, `${page}: carrossel de videos ausente.`);
    assert.equal(slides.length, expected.ids.length, `${page}: numero de videos inesperado.`);
    assert.deepEqual(ids, expected.ids, `${page}: selecao de videos inesperada.`);
    assert.deepEqual(topics, expected.topics, `${page}: os temas devem ser diferentes.`);
    assert.equal(new Set(ids).size, expected.ids.length, `${page}: IDs de video repetidos.`);
    assert.equal(new Set(topics).size, expected.ids.length, `${page}: temas repetidos.`);
    assert.match(carousel.querySelector('[data-carousel-status]').textContent, new RegExp(`Vídeo 1 de ${expected.ids.length}`));
    assert.ok(slides[0].classList.contains('active'), `${page}: primeiro video deve iniciar ativo.`);

    slides.forEach((slide, index) => {
        const id = expected.ids[index];
        const link = slide.querySelector(`a[href="https://www.youtube.com/watch?v=${id}"]`);

        assert.ok(link, `${page}: link alternativo ausente para ${id}.`);
        assert.equal(link.target, '_blank', `${page}: link alternativo deve abrir em nova aba.`);
        assert.match(link.rel, /noopener/, `${page}: link alternativo sem protecao noopener.`);
        assert.ok(slide.querySelector('h2')?.textContent.trim(), `${page}: video ${index + 1} sem titulo.`);
        assert.ok(slide.querySelector('.media-summary p')?.textContent.trim(), `${page}: video ${index + 1} sem resumo simples.`);
        assert.ok(slide.querySelector('.eyebrow')?.textContent.trim(), `${page}: video ${index + 1} sem fonte.`);
        if (index > 0) assert.equal(slide.hidden, true, `${page}: apenas o primeiro video deve iniciar visivel.`);
    });

    assert.ok(!/autoplay/i.test(html), `${page}: os videos nao devem iniciar automaticamente.`);
    allIds.push(...ids);
}

assert.equal(new Set(allIds).size, 21, 'Os vinte e um videos das paginas informativas devem ser unicos.');

const carouselScript = read('js/info-carousel.js');
assert.match(carouselScript, /youtube-nocookie\.com\/embed\//);
assert.match(carouselScript, /iframe\.loading\s*=\s*'lazy'/);
assert.match(carouselScript, /iframe\.allowFullscreen\s*=\s*true/);
assert.match(carouselScript, /iframe\.remove\(\)/, 'O iframe anterior deve ser removido ao trocar de video.');
assert.ok(!/autoplay/i.test(carouselScript), 'O carrossel nao deve ativar reproducao automatica.');

console.log('Vinte e um videos simples e diversos de Seguranca e Saude validados.');
