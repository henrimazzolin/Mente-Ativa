var CACHE_NAME = 'mente-ativa-v26';
var OFFLINE_URL = '/index.html';
var GAME_LOGIC_PATTERN = /^\/js\/(?:jogo-[^/]+|lib\/(?:damas-engine|chess-engine))\.js$/i;
var FRESH_ASSET_PATTERN = /\.(?:css|js)$/i;
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
    '/jogo-pintura-simples.html',
    '/jogo-quebra-cabeca.html',
    '/jogo-reconhecimento.html',
    '/jogo-repeticao.html',
    '/jogo-sequencia-simples.html',
    '/jogo-sudoku.html',
    '/jogo-toque.html',
    '/jogo-xadrez.html',
    '/js/lib/utils.js',
    '/js/accessibility-unified.js',
    '/js/info-navigation.js',
    '/js/info-carousel.js',
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
    '/css/jogo-pintura-simples.css',
    '/css/jogo-quebra-cabeca.css',
    '/css/jogo-reconhecimento.css',
    '/css/jogo-repeticao.css',
    '/css/jogo-sequencia-simples.css',
    '/css/jogo-sudoku.css',
    '/css/jogo-toque.css',
    '/css/jogo-xadrez.css',
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
    '/img/placeholder.svg',
    '/img/unsplash_1433086966358-54859d0ed716.jpg',
    '/img/unsplash_1441974231531-c6227db76b6e.jpg',
    '/img/unsplash_1465146344425-f00d5f5c8f07.jpg',
    '/img/unsplash_1469474968028-56623f02e42e.jpg',
    '/img/unsplash_1470071459604-3b5ec3a7fe05.jpg',
    '/img/unsplash_1495360010541-f48722b34f7d.jpg',
    '/img/unsplash_1501785888041-af3ef285b470.jpg',
    '/img/unsplash_1501854140801-50d01698950b.jpg',
    '/img/unsplash_1505740420928-5e560c06d30e.jpg',
    '/img/unsplash_1506744038136-46273834b3fb.jpg',
    '/img/unsplash_1506905925346-21bda4d32df4.jpg',
    '/img/unsplash_1513475382585-d06e58bcb0e0.jpg',
    '/img/unsplash_1514888286974-6c03e2ca1dba.jpg',
    '/img/unsplash_1517849845537-4d257902454a.jpg',
    '/img/unsplash_1518717758536-85ae29035b6d.jpg',
    '/img/unsplash_1519681393784-d120267933ba.jpg',
    '/img/unsplash_1525966222134-fcfa99b8ae77.jpg',
    '/img/unsplash_1526170375885-4d8ecf77b99f.jpg',
    '/img/unsplash_1526336024174-e58f5cdd8e13.jpg',
    '/img/unsplash_1533738363-b7f9aef128ce.jpg',
    '/img/unsplash_1542291026-7eec264c27ff.jpg',
    '/img/unsplash_1543466835-00a7907e9de1.jpg',
    '/img/unsplash_1543852786-1cf6624b9987.jpg',
    '/img/unsplash_1552053831-71594a27632d.jpg',
    '/img/unsplash_1574158622682-e40e69881006.jpg',
    '/img/unsplash_1583394838336-acd977736f90.jpg',
    '/img/unsplash_1583511655857-d19b40a7a54e.jpg',
    '/img/unsplash_1585386959984-a4155224a1ad.jpg',
    '/img/unsplash_1587049352846-4a222e784d38.jpg',
    '/img/unsplash_1587300003388-59208cc962cb.jpg',
    '/img/unsplash_1609505848912-b7c3b8b4beda.jpg',
    '/img/unsplash_1615485290382-441e4d049cb5.jpg',
    '/img/cards/pintura-simples.png',
    '/img/cards/coordenacao.png',
    '/img/cards/musica-simples.png',
    '/img/jogos/memoria/maca.png',
    '/img/jogos/memoria/banana.png',
    '/img/jogos/memoria/laranja.png',
    '/img/jogos/memoria/flor.png',
    '/img/jogos/memoria/cachorro.png',
    '/img/jogos/memoria/gato.png',
    '/img/jogos/memoria/passaro.png',
    '/img/jogos/memoria/xicara.png',
    '/img/jogos/memoria/chave.png',
    '/img/jogos/memoria/relogio.png',
    '/img/jogos/memoria/telefone.png',
    '/img/jogos/memoria/guarda-chuva.png',
    '/img/jogos/quebra-cabeca/jardim-florido.png',
    '/img/jogos/quebra-cabeca/casa-de-campo.png',
    '/img/jogos/quebra-cabeca/praia-tranquila.png',
    '/img/jogos/quebra-cabeca/praca-arborizada.png',
    '/img/jogos/quebra-cabeca/mesa-de-cafe.png',
    '/img/jogos/quebra-cabeca/cesta-de-frutas.png'
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

    if (GAME_LOGIC_PATTERN.test(url.pathname)) {
        event.respondWith(fetch(request, { cache: 'no-store' }));
        return;
    }

    if (FRESH_ASSET_PATTERN.test(url.pathname)) {
        event.respondWith(
            fetch(request).then(function(response) {
                if (response && response.status === 200) {
                    var copy = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function() {
                return caches.match(request);
            })
        );
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
