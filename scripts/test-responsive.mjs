import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const styles = readFileSync(resolve(ROOT, 'css/responsive.css'), 'utf8');
const calendarStyles = readFileSync(resolve(ROOT, 'css/calendario.css'), 'utf8');
const calendarScript = readFileSync(resolve(ROOT, 'js/calendario.js'), 'utf8');

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
assert.match(styles, /body\.calendar-page \.calendar\s*\{[\s\S]*width:\s*min\(100%, 920px\)[\s\S]*margin-inline:\s*auto/);
assert.match(styles, /body\.calendar-page \.events-list,[\s\S]*body\.calendar-page \.add-event-btn\s*\{[\s\S]*width:\s*min\(100%, 920px\)/);
assert.match(styles, /body\.calendar-page \.days\s*\{[\s\S]*grid-auto-rows:\s*clamp\(60px, 7vh, 68px\)/);
assert.match(styles, /@media \(min-width:\s*769px\) and \(max-height:\s*800px\)[\s\S]*grid-auto-rows:\s*clamp\(52px, 6\.5vh, 58px\)/);
assert.doesNotMatch(calendarStyles, /\.day\s*\{[^}]*aspect-ratio:\s*1/);
assert.match(calendarStyles, /\.calendar\s*\{[\s\S]*border:\s*3px solid rgba\(59, 130, 246, 0\.35\)/);
assert.match(calendarStyles, /\.day\.selected \.day-number\s*\{[\s\S]*background:\s*var\(--cor-secundaria\)/);
assert.match(calendarScript, /dayNumber\.className\s*=\s*'day-number'/);
assert.match(calendarScript, /while \(daysDiv\.childElementCount < 42\)/);

console.log('Matriz responsiva de 320 px a ultrawide validada.');
