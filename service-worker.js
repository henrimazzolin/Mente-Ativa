var CACHE_NAME = 'mente-ativa-v3';
var ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/menu.html',
    '/intro.html',
    '/calendario.html',
    '/sobre.html',
    '/seguranca.html',
    '/saude-informacoes.html',
    '/assistente.html',
    '/exercicios.html',
    '/exercicios-fisicos.html',
    '/jogos-individuais.html',
    '/jogos-acompanhados.html',
    '/jogo-associacao.html',
    '/jogo-associacao-imagens.html',
    '/jogo-caca-palavras.html',
    '/jogo-completar-figura.html',
    '/jogo-contagem.html',
    '/jogo-cores.html',
    '/jogo-damas.html',
    '/jogo-deducao-logica.html',
    '/jogo-escolha.html',
    '/jogo-frases.html',
    '/jogo-memoria.html',
    '/jogo-musica.html',
    '/jogo-objeto-funcao.html',
    '/jogo-ordenacao.html',
    '/jogo-palavras-cruzadas.html',
    '/jogo-pareamento-animais.html',
    '/jogo-pareamento-cores.html',
    '/jogo-pareamento-formas.html',
    '/jogo-pareamento-simples.html',
    '/jogo-pintura.html',
    '/jogo-quebra-cabeca.html',
    '/jogo-reconhecimento.html',
    '/jogo-repeticao.html',
    '/jogo-sequencia-simples.html',
    '/jogo-sudoku.html',
    '/jogo-toque.html',
    '/jogo-xadrez.html',
    '/js/lib/utils.js',
    '/js/lib/chess-engine.js',
    '/js/lib/chess-ui.js',
    '/js/lib/chess-ai.js',
    '/js/lib/damas-engine.js',
    '/js/accessibility-unified.js',
    '/js/components/logo.js',
    '/js/components/accessibility.js',
    '/js/assistente-flutuante.js',
    '/js/alerts.js',
    '/js/calendario.js',
    '/js/intro.js',
    '/js/dark-mode.js',
    '/js/accessibility-panel.js',
    '/js/pages/seguranca.js',
    '/js/jogo-ordenacao.js',
    '/js/jogo-completar-figura.js',
    '/js/jogo-contagem.js',
    '/js/jogo-associacao.js',
    '/js/jogo-associacao-imagens.js',
    '/js/jogo-caca-palavras.js',
    '/js/jogo-cores.js',
    '/js/jogo-damas.js',
    '/js/jogo-deducao-logica.js',
    '/js/jogo-escolha.js',
    '/js/jogo-frases.js',
    '/js/jogo-memoria.js',
    '/js/jogo-musica.js',
    '/js/jogo-objeto-funcao.js',
    '/js/jogo-palavras-cruzadas.js',
    '/js/jogo-pareamento-animais.js',
    '/js/jogo-pareamento-cores.js',
    '/js/jogo-pareamento-formas.js',
    '/js/jogo-pareamento-simples.js',
    '/js/jogo-pintura.js',
    '/js/jogo-quebra-cabeca.js',
    '/js/jogo-reconhecimento.js',
    '/js/jogo-repeticao.js',
    '/js/jogo-sequencia-simples.js',
    '/js/jogo-sudoku.js',
    '/js/jogo-toque.js',
    '/js/jogo-xadrez.js',
    '/css/main.css',
    '/css/dark-mode.css',
    '/css/assistente-flutuante.css',
    '/css/accessibility-panel.css',
    '/css/calendario.css',
    '/css/dificuldade.css',
    '/css/exercicios.css',
    '/css/exercicios-fisicos.css',
    '/css/index.css',
    '/css/intro.css',
    '/css/jogos-individuais.css',
    '/css/jogos-acompanhados.css',
    '/css/jogo-associacao.css',
    '/css/jogo-associacao-imagens.css',
    '/css/jogo-caca-palavras.css',
    '/css/jogo-completar-figura.css',
    '/css/jogo-contagem.css',
    '/css/jogo-cores.css',
    '/css/jogo-damas.css',
    '/css/jogo-deducao-logica.css',
    '/css/jogo-escolha.css',
    '/css/jogo-frases.css',
    '/css/jogo-memoria.css',
    '/css/jogo-musica.css',
    '/css/jogo-objeto-funcao.css',
    '/css/jogo-ordenacao.css',
    '/css/jogo-palavras-cruzadas.css',
    '/css/jogo-pareamento-animais.css',
    '/css/jogo-pareamento-cores.css',
    '/css/jogo-pareamento-formas.css',
    '/css/jogo-pareamento-simples.css',
    '/css/jogo-pintura.css',
    '/css/jogo-quebra-cabeca.css',
    '/css/jogo-reconhecimento.css',
    '/css/jogo-repeticao.css',
    '/css/jogo-sequencia-simples.css',
    '/css/jogo-sudoku.css',
    '/css/jogo-toque.css',
    '/css/jogo-xadrez.css',
    '/css/menu.css',
    '/css/saude.css',
    '/css/seguranca.css',
    '/css/sobre.css',
    '/manifest.json',
    '/img/neutralbkg.png',
    '/img/bluebkg.png',
    '/img/greenbkg.png',
    '/img/darkneutralbkg.png',
    '/img/darkbluebkg.png',
    '/img/darkgreenbkg.png',
    '/img/bluebrain.jpeg',
    '/img/greenbrain.jpeg',
    '/img/Logo.png',
    '/img/LogoAzulClaroNovo.png',
    '/img/LogoAzulEscuroNovo.png',
    '/img/LogoVerdeClaroNovo.png',
    '/img/LogoVerdeEscuroNovo.png',
    '/img/Logotexto.png',
    '/img/unnamed.jpg',
    '/img/placeholder.svg',
    '/img/test.jpg',
    '/img/cards/caca-palavras.png',
    '/img/cards/damas.png',
    '/img/cards/deducao-logica.png',
    '/img/cards/imagens-iguais.png',
    '/img/cards/jogo-memoria.png',
    '/img/cards/palavras-cruzadas.png',
    '/img/cards/pareamento-animais.png',
    '/img/cards/pareamento-cores.png',
    '/img/cards/pareamento-formas.png',
    '/img/cards/pintura.png',
    '/img/cards/quebra-cabeca.png',
    '/img/cards/sudoku.png',
    '/img/cards/visual-simples.png',
    '/img/cards/xadrez.png'
];

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(name) {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            );
        }).then(function() {
            return clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(response) {
            return caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
