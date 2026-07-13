import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const styles = readFileSync(resolve(ROOT, 'css/responsive.css'), 'utf8');

const ranges = [
    { label: 'celular muito pequeno', min: 320, max: 359, gutter: 10 },
    { label: 'celular pequeno', min: 360, max: 389, gutter: 12 },
    { label: 'celular padrão', min: 390, max: 429, gutter: 14 },
    { label: 'celular grande', min: 430, max: 575, gutter: 16 },
    { label: 'tablet pequeno', min: 576, max: 767, gutter: 20 },
    { label: 'tablet', min: 768, max: 991, gutter: 24 },
    { label: 'tablet grande', min: 992, max: 1199, gutter: 28 },
    { label: 'desktop', min: 1200, max: 1439, gutter: 32 },
    { label: 'desktop grande', min: 1440, max: 1919, gutter: 40 }
];

for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const query = `@media (min-width: ${range.min}px) and (max-width: ${range.max}px)`;
    assert.ok(styles.includes(query), `Faixa ausente: ${range.label}.`);

    const start = styles.indexOf(query);
    const nextStart = i + 1 < ranges.length
        ? styles.indexOf(`@media (min-width: ${ranges[i + 1].min}px) and (max-width: ${ranges[i + 1].max}px)`)
        : styles.indexOf('@media (min-width: 1920px)');
    const block = styles.slice(start, nextStart);
    assert.match(block, new RegExp(`--ma-page-gutter:\\s*${range.gutter}px`), `Margem incorreta em ${range.label}.`);

    if (i > 0) {
        assert.equal(ranges[i - 1].max + 1, range.min, `Existe lacuna entre ${ranges[i - 1].label} e ${range.label}.`);
    }
}

assert.ok(styles.includes('@media (min-width: 1920px)'), 'Faixa ultrawide ausente.');
assert.match(styles, /--ma-layout-max:\s*1440px/);
assert.match(styles, /--ma-content-max:\s*1200px/);
assert.match(styles, /--ma-card-gap:\s*24px/);
assert.match(styles, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);

console.log('Matriz responsiva de 320 px a ultrawide validada.');
