(function() {
    'use strict';

    var STORAGE_KEYS = {
        darkMode: 'mente-ativa-modo-escuro',
        fontSize: 'mente-ativa-fonte',
        notifications: 'mente-ativa-notificacoes'
    };

    var FONT_STEPS = [80, 90, 100, 110, 120, 130, 140];
    var FONT_STORAGE_KEY = 'mente-ativa-fonte-pct';
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
        this.fontPct = 120;
    }

    DarkModeManager.prototype.init = function() {
        this.isEscuro = storageGet(STORAGE_KEYS.darkMode, 'false') === 'true';
        if (this.isEscuro) this.aplicarModoEscuro();
        else this.sincronizarClasseDocumento();
        this.fontPct = parseInt(storageGet(FONT_STORAGE_KEY, '120'), 10) || 120;
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
        document.body.style.fontSize = Math.round(20 * this.fontPct / 100) + 'px';
        storageSet(FONT_STORAGE_KEY, String(this.fontPct));
        this._criarStyleFonte();
    };

    DarkModeManager.prototype._criarStyleFonte = function() {
        if (document.getElementById('ma-font-style')) return;
        var style = document.createElement('style');
        style.id = 'ma-font-style';
        style.textContent = 'body *:not(svg):not([class*="ma-"]):not([class*="bi"]):not(.material-icons):not([class*="icon"]):not(.titulo-com-tts) { font-size: inherit !important; }';
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
        var isOpen = container.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('visible', isOpen);
        var toggle = document.getElementById('ma-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fechar painel de acessibilidade' : 'Abrir painel de acessibilidade');
        }
    };

    DarkModeManager.prototype.closePanel = function() {
        var container = document.getElementById('mente-ativa-controls');
        var backdrop = document.querySelector('.ma-backdrop');
        if (container) container.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
        var toggle = document.getElementById('ma-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir painel de acessibilidade');
        }
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
        toggle.textContent = 'Acessibilidade';
        toggle.addEventListener('click', this.togglePanel.bind(this));

        var backdrop = document.createElement('div');
        backdrop.className = 'ma-backdrop';
        backdrop.addEventListener('click', this.closePanel.bind(this));

        var container = document.createElement('div');
        container.id = 'mente-ativa-controls';
        container.className = 'mente-ativa-controls';

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

        var btnAssistente = document.createElement('button');
        btnAssistente.className = 'ma-btn ma-btn-assistente';
        btnAssistente.type = 'button';
        btnAssistente.textContent = 'Tirar Duvidas';
        btnAssistente.setAttribute('aria-label', 'Abrir assistente virtual');
        btnAssistente.addEventListener('click', function() {
            document.dispatchEvent(new CustomEvent('mente-ativa-abrir-assistente'));
        });

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

        container.appendChild(fontGroup);
        container.appendChild(btnDarkMode);
        container.appendChild(btnAssistente);
        container.appendChild(somToggle);
        container.appendChild(notifToggle);

        document.body.appendChild(toggle);
        document.body.appendChild(backdrop);
        document.body.appendChild(container);

        this._atualizarEstadoBotoes();
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

    function init() {
        TTS.init();
        dm.init();
        dm.criarBotoes();
        melhorarSemanticaDaPagina();
        if (storageGet(STORAGE_KEYS.notifications, 'false') === 'true') {
            agendarNotificacaoDiaria();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
