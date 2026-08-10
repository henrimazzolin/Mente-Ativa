(function() {
    'use strict';

    var STORAGE_KEYS = {
        darkMode: 'mente-ativa-modo-escuro',
        fontSize: 'mente-ativa-fonte',
        notifications: 'mente-ativa-notificacoes',
        panelOpen: 'mente-ativa-painel-aberto'
    };

    // O painel inicia fechado; o usuario abre quando precisar.
    var DEFAULT_PANEL_OPEN = false;

    var FONT_STEPS = [80, 90, 100, 110, 120, 130, 140];
    var FONT_STORAGE_KEY = 'mente-ativa-fonte-pct';
    var FONT_DEFAULT_KEY = 'mente-ativa-fonte-default-v2';
    var DEFAULT_FONT_PCT = 100;
    var BACKGROUND_MAP = {
        'neutralbkg.png': 'darkneutralbkg.png',
        'bluebkg.png': 'darkbluebkg.png',
        'greenbkg.png': 'darkgreenbkg.png'
    };

    function storageGet(key, fallback) {
        try {
            var value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    function storageSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }

    function showMessage(message, type) {
        if (typeof window.exibirAlerta === 'function') {
            window.exibirAlerta(message, type || 'info');
        } else {
            window.alert(message);
        }
    }

    function DarkModeManager() {
        this.isEscuro = false;
        this.fontPct = DEFAULT_FONT_PCT;
    }

    DarkModeManager.prototype.init = function() {
        this.isEscuro = storageGet(STORAGE_KEYS.darkMode, 'false') === 'true';
        if (this.isEscuro) this.aplicarModoEscuro();
        else this.sincronizarClasseDocumento();
        if (storageGet(FONT_DEFAULT_KEY, null) !== 'done') {
            var savedFont = storageGet(FONT_STORAGE_KEY, null);
            if (savedFont === null || savedFont === '120' || savedFont === '140') {
                storageSet(FONT_STORAGE_KEY, String(DEFAULT_FONT_PCT));
            }
            storageSet(FONT_DEFAULT_KEY, 'done');
        }
        this.fontPct = parseInt(storageGet(FONT_STORAGE_KEY, String(DEFAULT_FONT_PCT)), 10) || DEFAULT_FONT_PCT;
        this.aplicarFontePct();
    };

    DarkModeManager.prototype.sincronizarClasseDocumento = function() {
        document.documentElement.classList.toggle('modo-escuro', this.isEscuro);
    };

    DarkModeManager.prototype.toggleModoEscuro = function() {
        if (this.isEscuro) this.aplicarModoClaro();
        else this.aplicarModoEscuro();
        this._atualizarUI();
    };

    DarkModeManager.prototype.aplicarModoEscuro = function() {
        this.isEscuro = true;
        var bg = window.getComputedStyle(document.body).backgroundImage;
        if (bg && bg !== 'none') {
            for (var light in BACKGROUND_MAP) {
                if (Object.prototype.hasOwnProperty.call(BACKGROUND_MAP, light) && bg.indexOf(light) !== -1) {
                    document.body.style.backgroundImage = bg.split(light).join(BACKGROUND_MAP[light]);
                    break;
                }
            }
        }
        storageSet(STORAGE_KEYS.darkMode, 'true');
        this.sincronizarClasseDocumento();
    };

    DarkModeManager.prototype.aplicarModoClaro = function() {
        this.isEscuro = false;
        document.body.style.backgroundImage = '';
        storageSet(STORAGE_KEYS.darkMode, 'false');
        this.sincronizarClasseDocumento();
    };

    DarkModeManager.prototype.aplicarFontePct = function() {
        document.documentElement.style.setProperty('--ma-font-scale', String(this.fontPct / 100));
        document.body.style.fontSize = '20px';
        storageSet(FONT_STORAGE_KEY, String(this.fontPct));
        this._criarStyleFonte();
    };

    DarkModeManager.prototype._criarStyleFonte = function() {
        if (document.getElementById('ma-font-style')) return;
        var style = document.createElement('style');
        style.id = 'ma-font-style';
        style.textContent =
            'body :where(p, li, label, button, a, input, select, textarea):where(:not([class*="ma-"]):not([class*="bi"]):not(.material-icons):not(.grid-cell):not(.num-btn):not(.cell input):not([class*="emoji"]):not([class*="image"]):not([class*="animal"]):not(.count-item)) { font-size: calc(20px * var(--ma-font-scale, 1)) !important; }' +
            'body :where(h1):where(:not([class*="ma-"])) { font-size: calc(36px * var(--ma-font-scale, 1)) !important; }' +
            'body :where(h2):where(:not([class*="ma-"])) { font-size: calc(28px * var(--ma-font-scale, 1)) !important; }' +
            'body :where(h3, h4):where(:not([class*="ma-"])) { font-size: calc(22px * var(--ma-font-scale, 1)) !important; }';
        document.head.appendChild(style);
    };

    DarkModeManager.prototype.aumentarFonte = function() {
        var idx = FONT_STEPS.indexOf(this.fontPct);
        if (idx === -1) { this.fontPct = 100; idx = 2; }
        if (this.fontPct >= 140) return;
        this.fontPct = FONT_STEPS[Math.min(idx + 1, FONT_STEPS.length - 1)];
        this.aplicarFontePct();
        this._atualizarLabelFonte();
        this._atualizarEstadoBotoes();
    };

    DarkModeManager.prototype.diminuirFonte = function() {
        var idx = FONT_STEPS.indexOf(this.fontPct);
        if (idx === -1) { this.fontPct = 100; idx = 2; }
        if (this.fontPct <= 80) return;
        this.fontPct = FONT_STEPS[Math.max(idx - 1, 0)];
        this.aplicarFontePct();
        this._atualizarLabelFonte();
        this._atualizarEstadoBotoes();
    };

    DarkModeManager.prototype._atualizarLabelFonte = function() {
        var el = document.getElementById('ma-font-pct');
        if (el) el.textContent = this.fontPct + '%';
    };

    DarkModeManager.prototype._atualizarEstadoBotoes = function() {
        var btnMinus = document.querySelector('.ma-btn-font-minus');
        var btnPlus = document.querySelector('.ma-btn-font-plus');
        if (btnMinus) {
            btnMinus.disabled = this.fontPct <= 80;
            btnMinus.classList.toggle('ma-btn-font-disabled', this.fontPct <= 80);
        }
        if (btnPlus) {
            btnPlus.disabled = this.fontPct >= 140;
            btnPlus.classList.toggle('ma-btn-font-disabled', this.fontPct >= 140);
        }
    };

    DarkModeManager.prototype.togglePanel = function() {
        var container = document.getElementById('mente-ativa-controls');
        var backdrop = document.querySelector('.ma-backdrop');
        if (!container) return;
        this.setPanelOpen(!container.classList.contains('open'), true);
    };

    DarkModeManager.prototype.setPanelOpen = function(isOpen, remember) {
        var container = document.getElementById('mente-ativa-controls');
        var backdrop = document.querySelector('.ma-backdrop');
        if (!container) return;

        container.classList.toggle('open', isOpen);
        container.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('ma-accessibility-open', isOpen);
        if (backdrop) backdrop.classList.toggle('visible', isOpen);

        var toggle = document.getElementById('ma-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fechar painel de acessibilidade' : 'Abrir painel de acessibilidade');
            toggle.setAttribute('title', isOpen ? 'Fechar acessibilidade' : 'Abrir acessibilidade');
        }

        if (remember) storageSet(STORAGE_KEYS.panelOpen, String(isOpen));
    };

    DarkModeManager.prototype.closePanel = function() {
        this.setPanelOpen(false, true);
    };

    DarkModeManager.prototype._atualizarUI = function() {
        var btn = document.getElementById('btn-dark-mode-toggle');
        if (btn) {
            btn.textContent = this.isEscuro ? 'Modo Claro' : 'Modo Escuro';
            btn.setAttribute('aria-label', this.isEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro');
        }
    };

    DarkModeManager.prototype.criarBotoes = function() {
        if (document.getElementById('ma-toggle') || document.getElementById('mente-ativa-controls')) {
            this._atualizarEstadoBotoes();
            return;
        }

        var toggle = document.createElement('button');
        toggle.id = 'ma-toggle';
        toggle.className = 'ma-toggle-btn';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Abrir painel de acessibilidade');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'mente-ativa-controls');
        toggle.setAttribute('title', 'Abrir acessibilidade');
        toggle.innerHTML = '<svg viewBox="0 0 64 64" data-icon="accessibility" aria-hidden="true" focusable="false">' +
            '<circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" stroke-width="5"></circle>' +
            '<circle cx="32" cy="19" r="5" fill="currentColor" stroke="none"></circle>' +
            '<path d="M19 23.5c1-2 3-2.7 5-1.8 5.7 2.5 10.3 2.5 16 0 2-.9 4-.2 5 1.8 1 2.1.1 4.4-2 5.3l-5.3 2.3v10.2l5.1 9.1c1.2 2.1.4 4.8-1.7 6-2.1 1.1-4.7.4-5.9-1.7L32 49l-3.2 5.7c-1.2 2.1-3.8 2.8-5.9 1.7-2.1-1.2-2.9-3.9-1.7-6l5.1-9.1V31.1L21 28.8c-2.1-.9-3-3.2-2-5.3z" fill="currentColor" stroke="none"></path>' +
            '</svg>' +
            '<span class="ma-tooltip" aria-hidden="true">Acessibilidade</span>';
        toggle.addEventListener('click', this.togglePanel.bind(this));

        var backdrop = document.createElement('div');
        backdrop.className = 'ma-backdrop';
        backdrop.addEventListener('click', this.closePanel.bind(this));

        var container = document.createElement('aside');
        container.id = 'mente-ativa-controls';
        container.className = 'mente-ativa-controls';
        container.setAttribute('aria-label', 'Painel de acessibilidade');
        container.setAttribute('aria-hidden', 'true');

        var panelHeader = document.createElement('div');
        panelHeader.className = 'ma-panel-header';

        var panelTitle = document.createElement('h2');
        panelTitle.id = 'ma-panel-title';
        panelTitle.className = 'ma-panel-title';
        panelTitle.textContent = 'Acessibilidade';

        var closeButton = document.createElement('button');
        closeButton.className = 'ma-panel-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Fechar painel de acessibilidade');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', this.closePanel.bind(this));

        panelHeader.appendChild(panelTitle);
        panelHeader.appendChild(closeButton);

        var panelDescription = document.createElement('p');
        panelDescription.className = 'ma-panel-description';
        panelDescription.textContent = 'Ajuste o site para ficar mais confortável para você.';

        var fontGroup = document.createElement('div');
        fontGroup.className = 'ma-btn ma-btn-font-size';
        fontGroup.setAttribute('role', 'group');
        fontGroup.setAttribute('aria-label', 'Tamanho das letras');

        var btnMinus = document.createElement('button');
        btnMinus.className = 'ma-btn-font-minus';
        btnMinus.type = 'button';
        btnMinus.setAttribute('aria-label', 'Diminuir tamanho da letra');
        btnMinus.textContent = '-';
        btnMinus.addEventListener('click', this.diminuirFonte.bind(this));

        var fontLabel = document.createElement('span');
        fontLabel.className = 'ma-btn-font-label';
        fontLabel.appendChild(document.createTextNode('Tamanho das letras'));
        var pctLabel = document.createElement('span');
        pctLabel.id = 'ma-font-pct';
        pctLabel.className = 'ma-btn-font-pct';
        pctLabel.textContent = this.fontPct + '%';
        fontLabel.appendChild(pctLabel);

        var btnPlus = document.createElement('button');
        btnPlus.className = 'ma-btn-font-plus';
        btnPlus.type = 'button';
        btnPlus.setAttribute('aria-label', 'Aumentar tamanho da letra');
        btnPlus.textContent = '+';
        btnPlus.addEventListener('click', this.aumentarFonte.bind(this));

        fontGroup.appendChild(btnMinus);
        fontGroup.appendChild(fontLabel);
        fontGroup.appendChild(btnPlus);

        var btnDarkMode = document.createElement('button');
        btnDarkMode.id = 'btn-dark-mode-toggle';
        btnDarkMode.className = 'ma-btn ma-btn-darkmode';
        btnDarkMode.type = 'button';
        btnDarkMode.textContent = this.isEscuro ? 'Modo Claro' : 'Modo Escuro';
        btnDarkMode.setAttribute('aria-label', this.isEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro');
        btnDarkMode.addEventListener('click', this.toggleModoEscuro.bind(this));

        var somToggle = document.createElement('button');
        somToggle.id = 'ma-btn-som';
        somToggle.className = 'ma-btn ma-btn-som';
        somToggle.type = 'button';
        var somAtivo = storageGet('mente-ativa-som', 'true') !== 'false';
        somToggle.textContent = somAtivo ? 'Sons: Ligado' : 'Sons: Desligado';
        somToggle.setAttribute('aria-label', somAtivo ? 'Desligar sons dos jogos' : 'Ligar sons dos jogos');
        somToggle.addEventListener('click', function() {
            var ativo = storageGet('mente-ativa-som', 'true') !== 'false';
            storageSet('mente-ativa-som', ativo ? 'false' : 'true');
            somToggle.textContent = ativo ? 'Sons: Desligado' : 'Sons: Ligado';
            somToggle.setAttribute('aria-label', ativo ? 'Ligar sons dos jogos' : 'Desligar sons dos jogos');
            if (window.MenteAtiva && window.MenteAtiva.utils) {
                window.MenteAtiva.utils.somAtivo(!ativo);
            }
        });

        var notifToggle = document.createElement('button');
        notifToggle.id = 'ma-btn-notificacao';
        notifToggle.className = 'ma-btn ma-btn-notificacao';
        notifToggle.type = 'button';
        var notifAtivo = storageGet(STORAGE_KEYS.notifications, 'false') === 'true';
        notifToggle.textContent = notifAtivo ? 'Lembretes: Ligado' : 'Lembretes: Desligado';
        notifToggle.setAttribute('aria-label', notifAtivo ? 'Desligar lembretes diarios' : 'Ligar lembretes diarios');
        notifToggle.addEventListener('click', function() {
            var ativo = storageGet(STORAGE_KEYS.notifications, 'false') === 'true';
            if (ativo) {
                storageSet(STORAGE_KEYS.notifications, 'false');
                notifToggle.textContent = 'Lembretes: Desligado';
                notifToggle.setAttribute('aria-label', 'Ligar lembretes diarios');
                return;
            }
            if (!('Notification' in window)) {
                showMessage('Este navegador nao oferece lembretes.', 'aviso');
                return;
            }
            if (Notification.permission === 'denied') {
                showMessage('Permissao de notificacao negada. Ative nas configuracoes do navegador.', 'aviso');
                return;
            }
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') ativarNotif();
                    else showMessage('Permissao de notificacao negada.', 'aviso');
                });
            } else {
                ativarNotif();
            }

            function ativarNotif() {
                storageSet(STORAGE_KEYS.notifications, 'true');
                notifToggle.textContent = 'Lembretes: Ligado';
                notifToggle.setAttribute('aria-label', 'Desligar lembretes diarios');
                agendarNotificacaoDiaria();
            }
        });

        container.appendChild(panelHeader);
        container.appendChild(panelDescription);
        container.appendChild(fontGroup);
        container.appendChild(btnDarkMode);
        container.appendChild(somToggle);
        container.appendChild(notifToggle);

        document.body.appendChild(toggle);
        document.body.appendChild(backdrop);
        document.body.appendChild(container);

        this._atualizarEstadoBotoes();
        var savedPanelState = storageGet(STORAGE_KEYS.panelOpen, null);
        var shouldOpen = savedPanelState === null ? DEFAULT_PANEL_OPEN : savedPanelState === 'true';
        this.setPanelOpen(document.body.classList.contains('ma-intro-active') ? false : shouldOpen, false);
    };

    var TTS = {
        ativa: false,
        sintetizador: null,
        init: function() {
            if ('speechSynthesis' in window) {
                this.sintetizador = window.speechSynthesis;
                this.ativa = true;
            }
        },
        falar: function(texto, velocidade) {
            if (!this.ativa || !texto) return;
            velocidade = velocidade || 0.8;
            this.parar();
            var utterance = new SpeechSynthesisUtterance(String(texto));
            utterance.lang = 'pt-BR';
            utterance.rate = velocidade;
            this.sintetizador.speak(utterance);
        },
        parar: function() {
            if (this.ativa) this.sintetizador.cancel();
        }
    };

    function agendarNotificacaoDiaria() {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        if (storageGet(STORAGE_KEYS.notifications, 'false') !== 'true') return;

        var agendadas;
        try {
            agendadas = JSON.parse(storageGet('mente-ativa-notif-agendadas', '[]')) || [];
        } catch (e) {
            agendadas = [];
        }

        var hoje = new Date().toDateString();
        if (agendadas.indexOf(hoje) !== -1) return;
        agendadas.push(hoje);
        storageSet('mente-ativa-notif-agendadas', JSON.stringify(agendadas.slice(-30)));

        try {
            var notif = new Notification('Mente Ativa', {
                body: 'Hora de exercitar a mente! Que tal um jogo hoje?',
                icon: '/img/unnamed.jpg'
            });
            setTimeout(function() { notif.close(); }, 8000);
        } catch (e) {}
    }

    function melhorarSemanticaDaPagina() {
        var backButtons = document.querySelectorAll('.back-btn');
        for (var i = 0; i < backButtons.length; i++) {
            if (!backButtons[i].getAttribute('aria-label')) {
                backButtons[i].setAttribute('aria-label', 'Voltar para a pagina anterior');
            }
            backButtons[i].setAttribute('title', 'Voltar');
        }

        var mainContainer = document.querySelector('.container');
        if (mainContainer && !mainContainer.getAttribute('role')) {
            mainContainer.setAttribute('role', 'main');
        }

        var iconOnlyButtons = document.querySelectorAll('button');
        for (var j = 0; j < iconOnlyButtons.length; j++) {
            var btn = iconOnlyButtons[j];
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Botao de acao');
            }
        }
    }

    window.MenteAtiva = window.MenteAtiva || {};
    var dm = new DarkModeManager();
    window.MenteAtiva.darkMode = dm;
    window.Accessibility = {
        TTS: TTS,
        DarkMode: dm,
        STORAGE_KEYS: STORAGE_KEYS
    };

    // Vídeos "Como jogar" publicados no YouTube, identificados pela chave do jogo.
    var VIDEOS_COMO_JOGAR = {
        'palavras-cruzadas': 'IqbbnBzUTWo',
        'sudoku': 'Aq8wkdQKgko',
        'memoria': 'jwPICxYR_ZM',
        'quebra-cabeca': 'leCPwP14LRw',
        'xadrez': 'utbJnQd6WP0',
        'damas': 'M5flwDooaqo',
        'deducao-logica': 'zzRtnT8uoPI',
        'pintura': 'UdR2e9PFr18',
        'caca-palavras': 'gbJiJEPa5Pc'
    };

    function adicionarVideoComoJogar() {
        var pagina = (window.location.pathname.split('/').pop() || '').toLowerCase();
        var jogos = {
            'jogo-palavras-cruzadas.html': 'palavras-cruzadas',
            'jogo-sudoku.html': 'sudoku',
            'jogo-memoria.html': 'memoria',
            'jogo-quebra-cabeca.html': 'quebra-cabeca',
            'jogo-xadrez.html': 'xadrez',
            'jogo-damas.html': 'damas',
            'jogo-deducao-logica.html': 'deducao-logica',
            'jogo-pintura.html': 'pintura',
            'jogo-caca-palavras.html': 'caca-palavras'
        };
        if (!jogos[pagina] || document.querySelector('.how-to-video-card')) return;

        document.querySelectorAll('.instrucao-destaque, .paint-intro').forEach(function(instruction) {
            instruction.remove();
        });

        var chave = jogos[pagina];
        var titulo = document.querySelector('.page-title');
        if (!titulo) return;

        var tituloPrincipal = titulo.querySelector('h1');
        if (!tituloPrincipal) return;

        var linkComoJogar = document.createElement('a');
        linkComoJogar.className = 'how-to-video-link';
        linkComoJogar.href = '#como-jogar';
        linkComoJogar.textContent = 'Como jogar';

        titulo.appendChild(linkComoJogar);

        var card = document.createElement('section');
        card.className = 'how-to-video-card';
        card.id = 'como-jogar';
        card.dataset.videoKey = chave;
        card.innerHTML = '<p>Vídeo: como jogar</p>' +
            '<button type="button" class="how-to-video-trigger" aria-label="Abrir vídeo de como jogar" aria-haspopup="dialog">' +
                '<span class="how-to-play-icon" aria-hidden="true"></span>' +
            '</button>';

        var rodape = document.querySelector('footer');
        if (rodape) {
            rodape.insertAdjacentElement('beforebegin', card);
        } else {
            document.body.appendChild(card);
        }

        var overlay = document.createElement('div');
        overlay.className = 'how-to-video-overlay';
        overlay.hidden = true;
        overlay.innerHTML = '<div class="how-to-video-modal" role="dialog" aria-modal="true" aria-labelledby="how-to-video-title-' + chave + '">' +
            '<div class="how-to-video-modal-header">' +
                '<h2 id="how-to-video-title-' + chave + '">Como jogar</h2>' +
                '<button type="button" class="how-to-video-close" aria-label="Fechar vídeo">&times;</button>' +
            '</div>' +
            '<div class="how-to-video-content"></div>' +
        '</div>';
        document.body.appendChild(overlay);

        var trigger = card.querySelector('.how-to-video-trigger');
        var closeButton = overlay.querySelector('.how-to-video-close');
        var content = overlay.querySelector('.how-to-video-content');
        var videoId = VIDEOS_COMO_JOGAR[chave];
        var configuredVideos = window.MENTE_ATIVA_VIDEOS_COMO_JOGAR || {};
        var videoSource = configuredVideos[chave] || card.dataset.videoSrc || '';

        if (videoId) {
            var embedUrl = 'https://www.youtube-nocookie.com/embed/' + videoId + '?rel=0';
            var iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.dataset.src = embedUrl;
            iframe.title = 'Vídeo: como jogar ' + (tituloPrincipal.textContent || '').trim();
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.setAttribute('frameborder', '0');
            content.appendChild(iframe);

            var linkExterno = document.createElement('a');
            linkExterno.className = 'how-to-video-external';
            linkExterno.href = 'https://www.youtube.com/watch?v=' + videoId;
            linkExterno.target = '_blank';
            linkExterno.rel = 'noopener';
            linkExterno.textContent = 'Assistir no YouTube';
            content.appendChild(linkExterno);
        } else if (videoSource) {
            var video = document.createElement('video');
            video.controls = true;
            video.preload = 'metadata';
            video.src = videoSource;
            video.setAttribute('playsinline', '');
            content.appendChild(video);
        } else {
            content.innerHTML = '<div class="how-to-video-coming-soon" role="status">' +
                '<span class="how-to-play-icon" aria-hidden="true"></span>' +
                '<strong>Vídeo em breve</strong>' +
            '</div>';
        }

        function fecharVideo() {
            var video = content.querySelector('video');
            if (video) video.pause();
            var iframe = content.querySelector('iframe[data-src]');
            if (iframe) iframe.src = 'about:blank';
            overlay.hidden = true;
            document.body.classList.remove('ma-video-modal-open');
            trigger.focus();
        }

        function abrirVideo() {
            overlay.hidden = false;
            document.body.classList.add('ma-video-modal-open');
            closeButton.focus();
            var iframe = content.querySelector('iframe[data-src]');
            if (iframe) iframe.src = iframe.dataset.src;
            var video = content.querySelector('video');
            if (video) video.play().catch(function() {});
        }

        trigger.addEventListener('click', abrirVideo);
        closeButton.addEventListener('click', fecharVideo);
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) fecharVideo();
        });
        overlay.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') fecharVideo();
            if (event.key === 'Tab') {
                var focusables = overlay.querySelectorAll('button, a[href], video[controls]');
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    function init() {
        TTS.init();
        dm.init();
        dm.criarBotoes();
        melhorarSemanticaDaPagina();
        adicionarVideoComoJogar();
        if (storageGet(STORAGE_KEYS.notifications, 'false') === 'true') {
            agendarNotificacaoDiaria();
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') dm.closePanel();
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) dm.closePanel();
        });

        document.addEventListener('mente-ativa-abrir-assistente', function() {
            dm.setPanelOpen(false, false);
        });

        document.addEventListener('mente-ativa-intro-fechada', function() {
            var savedPanelState = storageGet(STORAGE_KEYS.panelOpen, null);
            var shouldOpen = savedPanelState === null ? DEFAULT_PANEL_OPEN : savedPanelState === 'true';
            dm.setPanelOpen(shouldOpen, false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
