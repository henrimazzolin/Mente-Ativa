var CACHE_NAME = 'mente-ativa-v1';
var ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/menu.html',
    '/jogos-individuais.html',
    '/css/main.css',
    '/css/dark-mode.css',
    '/css/assistente-flutuante.css',
    '/js/dark-mode.js',
    '/js/components/accessibility.js',
    '/js/components/logo.js',
    '/js/assistente-flutuante.js',
    '/js/alerts.js',
    '/js/lib/utils.js',
    '/img/neutralbkg.png',
    '/img/bluebkg.png',
    '/img/darkneutralbkg.png',
    '/img/darkbluebkg.png',
    '/img/Logo.png',
    '/img/LogoAzulClaroNovo.png',
    '/img/LogoAzulEscuroNovo.png',
    '/img/unnamed.jpg'
];

self.addEventListener('install', function(event) {
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
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
