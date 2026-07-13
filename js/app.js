(function() {
    'use strict';

    var PRIVACY_NOTICE_KEY = 'mente-ativa-aviso-privacidade-v1';

    function adicionarLinkDePrivacidade() {
        var footer = document.querySelector('footer');
        if (!footer || footer.querySelector('.privacidade-footer')) return;
        if (/privacidade\.html$/.test(window.location.pathname)) return;

        var links = document.createElement('nav');
        links.className = 'footer-links';
        links.setAttribute('aria-label', 'Informações do site');

        var sobre = footer.querySelector('.sobre-footer');
        if (sobre) links.appendChild(sobre);

        var privacidade = document.createElement('a');
        privacidade.href = 'privacidade.html';
        privacidade.className = 'sobre-footer privacidade-footer';
        privacidade.textContent = 'Privacidade e LGPD';
        links.appendChild(privacidade);
        footer.appendChild(links);
    }

    function criarAvisoDePrivacidade() {
        if (/privacidade\.html$/.test(window.location.pathname)) return;

        try {
            if (localStorage.getItem(PRIVACY_NOTICE_KEY) === 'entendido') return;
        } catch (e) {}

        var aviso = document.createElement('aside');
        aviso.className = 'aviso-privacidade';
        aviso.setAttribute('aria-label', 'Aviso de privacidade');
        aviso.innerHTML = '<div class="aviso-privacidade-texto">' +
            '<strong>Seus dados ficam com você</strong>' +
            '<span>O Mente Ativa salva preferências e atividades somente neste dispositivo.</span>' +
            '</div>' +
            '<div class="aviso-privacidade-acoes">' +
            '<a href="privacidade.html">Saiba mais</a>' +
            '<button type="button">Entendi</button>' +
            '</div>';

        aviso.querySelector('button').addEventListener('click', function() {
            try {
                localStorage.setItem(PRIVACY_NOTICE_KEY, 'entendido');
            } catch (e) {}
            document.body.classList.remove('aviso-privacidade-aberto');
            aviso.remove();
        });

        document.body.appendChild(aviso);
        document.body.classList.add('aviso-privacidade-aberto');
    }

    function iniciarInterfaceGlobal() {
        adicionarLinkDePrivacidade();
        criarAvisoDePrivacidade();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(function() {
            // O site continua funcional online mesmo quando o cache offline falha.
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarInterfaceGlobal);
    } else {
        iniciarInterfaceGlobal();
    }
})();
