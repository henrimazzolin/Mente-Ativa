import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const JS_ONLY = process.argv.includes('--js-only');
const IGNORED_DIRECTORIES = new Set(['.git', 'node_modules']);
const errors = [];

function walk(directory) {
    return readdirSync(directory).flatMap((name) => {
        if (IGNORED_DIRECTORIES.has(name)) return [];
        const fullPath = join(directory, name);
        return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
    });
}

const files = walk(ROOT);

for (const file of files.filter((item) => extname(item) === '.js' || extname(item) === '.mjs')) {
    try {
        execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (error) {
        errors.push(`JavaScript inválido em ${relative(ROOT, file)}\n${error.stderr?.toString() || error.message}`);
    }
}

function localTarget(reference, sourceFile) {
    const cleanReference = reference.split('#')[0].split('?')[0].trim();
    if (!cleanReference || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(cleanReference)) return null;

    let decoded;
    try {
        decoded = decodeURIComponent(cleanReference);
    } catch {
        decoded = cleanReference;
    }

    return decoded.startsWith('/')
        ? join(ROOT, decoded.slice(1))
        : resolve(sourceFile, '..', decoded);
}

if (!JS_ONLY) {
    for (const file of files.filter((item) => extname(item) === '.html')) {
        const html = readFileSync(file, 'utf8');
        const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);

        for (const reference of references) {
            const target = localTarget(reference, file);
            if (target && !existsSync(target)) {
                errors.push(`Referência quebrada em ${relative(ROOT, file)}: ${reference}`);
            }
        }

        const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        for (const id of new Set(duplicates)) {
            errors.push(`ID duplicado em ${relative(ROOT, file)}: ${id}`);
        }

        const stylesheets = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
            .map((match) => match[1]);
        if (stylesheets.at(-1) !== 'css/responsive.css') {
            errors.push(`A camada responsiva deve ser o último CSS em ${relative(ROOT, file)}`);
        }
    }

    for (const file of files.filter((item) => extname(item) === '.css')) {
        const css = readFileSync(file, 'utf8');
        const references = [...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((match) => match[1]);

        for (const reference of references) {
            const target = localTarget(reference, file);
            if (target && !existsSync(target)) {
                errors.push(`Recurso CSS ausente em ${relative(ROOT, file)}: ${reference}`);
            }
        }

        const cssWithoutCommentsAndStrings = css
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
        let braceDepth = 0;
        for (const character of cssWithoutCommentsAndStrings) {
            if (character === '{') braceDepth += 1;
            if (character === '}') braceDepth -= 1;
            if (braceDepth < 0) break;
        }
        if (braceDepth !== 0) {
            errors.push(`Blocos CSS desequilibrados em ${relative(ROOT, file)}`);
        }
    }

    const responsiveCss = readFileSync(join(ROOT, 'css', 'responsive.css'), 'utf8');
    for (const breakpoint of [1024, 900, 768, 600, 480, 360]) {
        if (!responsiveCss.includes(`max-width: ${breakpoint}px`)) {
            errors.push(`Breakpoint responsivo ausente: ${breakpoint}px`);
        }
    }

    const responsiveContracts = [
        ['margem lateral fluida', '--ma-page-gutter: clamp(16px, 4vw, 40px)'],
        ['limite geral do layout', '--ma-layout-max: 1200px'],
        ['limite dos conteúdos sem container', '--ma-content-max: 1000px'],
        ['largura centralizada do container', 'width: calc(100% - (2 * var(--ma-page-gutter)))']
    ];

    for (const [description, contract] of responsiveContracts) {
        if (!responsiveCss.includes(contract)) {
            errors.push(`Contrato responsivo ausente: ${description}`);
        }
    }

    if (/\.container,\s*\n\.main-content,[^{]*\{[^}]*max-width:\s*100%/m.test(responsiveCss)) {
        errors.push('A camada responsiva não deve anular os max-width específicos dos containers');
    }

    const serviceWorkerPath = join(ROOT, 'service-worker.js');
    const serviceWorker = readFileSync(serviceWorkerPath, 'utf8');
    const cachedAssets = [...serviceWorker.matchAll(/^\s*['"](\/[^'"]+)['"],?\s*$/gm)].map((match) => match[1]);

    for (const asset of cachedAssets) {
        const target = localTarget(asset, serviceWorkerPath);
        if (target && !existsSync(target) && asset !== '/') {
            errors.push(`Recurso ausente no cache da PWA: ${asset}`);
        }
    }
}

if (errors.length) {
    console.error(`Validação falhou com ${errors.length} erro(s):\n`);
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
}

console.log(JS_ONLY ? 'JavaScript válido.' : 'Projeto validado sem referências locais quebradas.');
