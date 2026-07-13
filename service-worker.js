var CACHE_NAME = 'mente-ativa-v12';
var OFFLINE_URL = '/index.html';
var ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/menu.html',
    '/calendario.html',
    '/sobre.html',
    '/privacidade.html',
    '/seguranca.html',
    '/saude-informacoes.html',
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
    '/js/lib/damas-engine.js',
    '/js/accessibility-unified.js',
    '/js/app.js',
    '/js/components/logo.js',
    '/js/assistente-flutuante.js',
    '/js/alerts.js',
    '/js/calendario.js',
    '/js/intro.js',
    '/js/pages/seguranca.js',
    '/js/privacidade.js',
    '/css/main.css',
    '/css/responsive.css',
    '/css/dark-mode.css',
    '/css/assistente-flutuante.css',
    '/css/calendario.css',
    '/css/dificuldade.css',
    '/css/exercicios.css',
    '/css/exercicios-fisicos.css',
    '/css/index.css',
    '/css/intro.css',
    '/css/jogos-individuais.css',
    '/css/jogos-acompanhados.css',
    '/css/menu.css',
    '/css/saude.css',
    '/css/seguranca.css',
    '/css/sobre.css',
    '/css/privacidade.css',
    '/manifest.json',
    '/img/neutralbkg.png',
    '/img/bluebkg.png',
    '/img/greenbkg.png',
    '/img/darkneutralbkg.jpeg',
    '/img/darkbluebkg.png',
    '/img/darkgreenbkg.png',
    '/img/bluebrain.jpeg',
    '/img/greenbrain.jpeg',
    '/img/LogoAzulClaroNovo.png',
    '/img/LogoAzulEscuroNovo.png',
    '/img/LogoVerdeClaroNovo.png',
    '/img/LogoVerdeEscuroNovo.png',
    '/img/Logotexto.png',
    '/img/Logopreta.png',
    '/img/Logobranca.png',
    '/img/unnamed.jpg',
    '/img/placeholder.svg'
];

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return Promise.all(
                ASSETS_TO_CACHE.map(function(url) {
                    return cache.add(url).catch(function() {
                        return null;
                    });
                })
            );
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(name) {
                    if (name !== CACHE_NAME) return caches.delete(name);
                    return null;
                })
            );
        }).then(function() {
            return clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        event.respondWith(fetch(request).catch(function() {
            return caches.match('/img/placeholder.svg');
        }));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(function(response) {
                var copy = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, copy);
                });
                return response;
            }).catch(function() {
                return caches.match(request).then(function(match) {
                    return match || caches.match(OFFLINE_URL);
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(function(cached) {
            var networkFetch = fetch(request).then(function(response) {
                if (response && response.status === 200) {
                    var copy = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function() {
                return cached || caches.match('/img/placeholder.svg');
            });

            return cached || networkFetch;
        })
    );
});
