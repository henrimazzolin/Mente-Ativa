(function() {
    'use strict';

    var PRIVACY_NOTICE_KEY = 'mente-ativa-aviso-privacidade-v1';
    var ULTIMA_PAGINA_KEY = 'mente-ativa-ultima-pagina';
    var PERSISTENT_STORAGE_KEYS = {
        'mente-ativa-modo-escuro': true,
        'mente-ativa-fonte': true,
        'mente-ativa-fonte-pct': true,
        'mente-ativa-fonte-default-v2': true,
        'mente-ativa-notificacoes': true,
        'mente-ativa-painel-aberto': true,
        'mente-ativa-som': true,
        'mente-ativa-notif-agendadas': true,
        'menteativa_eventos': true,
        'mente-ativa-ultima-pagina': true
    };

    function limparDadosPersistentesNaoPermitidos() {
        try {
            for (var indice = localStorage.length - 1; indice >= 0; indice--) {
                var chave = localStorage.key(indice);
                if (chave && !PERSISTENT_STORAGE_KEYS[chave]) {
                    localStorage.removeItem(chave);
                }
            }
        } catch (e) {}
    }

    limparDadosPersistentesNaoPermitidos();
    window.addEventListener('pagehide', limparDadosPersistentesNaoPermitidos);

    function ehPaginaDeApp(caminho) {
        if (typeof caminho !== 'string' || !/\.html$/i.test(caminho)) return false;
        return !/\/?(?:index|privacidade|sobre)\.html$/i.test(caminho);
    }

    function salvarUltimaPagina() {
        try {
            if (!ehPaginaDeApp(window.location.pathname)) return;
            localStorage.setItem(ULTIMA_PAGINA_KEY, JSON.stringify({
                pagina: window.location.pathname
            }));
        } catch (e) {}
    }

    window.addEventListener('pagehide', salvarUltimaPagina);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) salvarUltimaPagina();
    });

    function lerUltimaPagina() {
        try {
            var dados = JSON.parse(localStorage.getItem(ULTIMA_PAGINA_KEY) || 'null');
            if (dados && ehPaginaDeApp(dados.pagina)) return dados.pagina;
        } catch (e) {}
        return null;
    }

    var continuarOferecido = false;

    function oferecerContinuar() {
        if (continuarOferecido) return;
        continuarOferecido = true;

        var pagina = lerUltimaPagina();
        if (!pagina) return;

        try {
            var navegacao = performance.getEntriesByType('navigation')[0];
            if (navegacao && navegacao.type !== 'navigate') return;
        } catch (e) {}

        var avisoExistente = document.querySelector('.aviso-privacidade');
        if (avisoExistente) avisoExistente.remove();
        document.body.classList.remove('aviso-privacidade-aberto');

        var aviso = document.createElement('aside');
        aviso.className = 'aviso-privacidade';
        aviso.setAttribute('aria-label', 'Continuar de onde parou');
        aviso.innerHTML = '<div class="aviso-privacidade-texto">' +
            '<strong>Continuar de onde parou?</strong>' +
            '<span>Quer voltar para a última atividade que você estava?</span>' +
            '</div>' +
            '<div class="aviso-privacidade-acoes">' +
            '<button type="button" class="aviso-continuar-sim">Continuar</button>' +
            '<button type="button" class="aviso-continuar-nao">Começar do início</button>' +
            '</div>';

        aviso.querySelector('.aviso-continuar-sim').addEventListener('click', function() {
            window.location.href = pagina;
        });
        aviso.querySelector('.aviso-continuar-nao').addEventListener('click', function() {
            try { localStorage.removeItem(ULTIMA_PAGINA_KEY); } catch (e) {}
            document.body.classList.remove('aviso-privacidade-aberto');
            aviso.remove();
        });

        document.body.appendChild(aviso);
        document.body.classList.add('aviso-privacidade-aberto');
    }

    function agendarOferecerContinuar() {
        if (!/\/?index\.html$/.test(window.location.pathname)) return;

        var intro = document.getElementById('intro-overlay');
        if (!intro || intro.style.display === 'none') {
            oferecerContinuar();
            return;
        }
        document.addEventListener('mente-ativa-intro-fechada', oferecerContinuar, { once: true });
        setTimeout(oferecerContinuar, 4500);
    }

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
            if (sessionStorage.getItem(PRIVACY_NOTICE_KEY) === 'entendido') return;
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
                sessionStorage.setItem(PRIVACY_NOTICE_KEY, 'entendido');
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
        agendarOferecerContinuar();
    }

    if ('serviceWorker' in navigator) {
        var tinhaControlador = Boolean(navigator.serviceWorker.controller);
        var recarregandoParaAtualizar = false;
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            if (!tinhaControlador || recarregandoParaAtualizar) return;
            recarregandoParaAtualizar = true;
            window.location.reload();
        });
        navigator.serviceWorker.register('service-worker.js', {
            updateViaCache: 'none'
        }).then(function(registration) {
            return registration.update();
        }).catch(function() {
            // O site continua funcional online mesmo quando o cache offline falha.
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarInterfaceGlobal);
    } else {
        iniciarInterfaceGlobal();
    }
})();
