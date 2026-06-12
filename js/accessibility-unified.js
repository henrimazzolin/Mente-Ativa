(function() {
    'use strict';

    var STORAGE_KEYS = {
        darkMode: 'mente-ativa-modo-escuro',
        contrast: 'mente-ativa-contraste',
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

    function DarkModeManager() {
        this.isEscuro = false;
        this.fontPct = 120;
    }

    DarkModeManager.prototype.init = function() {
        this.isEscuro = localStorage.getItem(STORAGE_KEYS.darkMode) === 'true';
        if (this.isEscuro) this.aplicarModoEscuro();
        else this.sincronizarClasseDocumento();
        this.fontPct = parseInt(localStorage.getItem(FONT_STORAGE_KEY), 10) || 120;
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
                if (bg.indexOf(light) !== -1) {
                    document.body.style.backgroundImage = bg.split(light).join(BACKGROUND_MAP[light]);
                    break;
                }
            }
        }
        localStorage.setItem(STORAGE_KEYS.darkMode, 'true');
        this.sincronizarClasseDocumento();
    };

    DarkModeManager.prototype.aplicarModoClaro = function() {
        this.isEscuro = false;
        document.body.style.backgroundImage = '';
        localStorage.setItem(STORAGE_KEYS.darkMode, 'false');
        this.sincronizarClasseDocumento();
    };

    DarkModeManager.prototype.aplicarFontePct = function() {
        document.body.style.fontSize = Math.round(20 * this.fontPct / 100) + 'px';
        localStorage.setItem(FONT_STORAGE_KEY, String(this.fontPct));
        this._criarStyleFonte();
    };

    DarkModeManager.prototype._criarStyleFonte = function() {
        if (!document.getElementById('ma-font-style')) {
            var style = document.createElement('style');
            style.id = 'ma-font-style';
            style.textContent = 'body *:not(svg):not([class*="ma-"]):not([class*="bi"]):not(.material-icons):not([class*="icon"]):not(.titulo-com-tts) { font-size: inherit !important; }';
            document.head.appendChild(style);
        }
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
        var panelBtn = document.getElementById('panel-dark-mode-btn');
        if (panelBtn) panelBtn.classList.toggle('active', this.isEscuro);
    };

    DarkModeManager.prototype.criarBotoes = function() {
        var toggle = document.createElement('button');
        toggle.id = 'ma-toggle';
        toggle.className = 'ma-toggle-btn';
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

        var btnMinus = document.createElement('button');
        btnMinus.className = 'ma-btn-font-minus';
        btnMinus.setAttribute('aria-label', 'Diminuir tamanho da letra');
        btnMinus.textContent = '\u2212';
        btnMinus.addEventListener('click', this.diminuirFonte.bind(this));

        var fontLabel = document.createElement('span');
        fontLabel.className = 'ma-btn-font-label';
        fontLabel.innerHTML = 'Tamanho das letras <span id="ma-font-pct" class="ma-btn-font-pct">' + this.fontPct + '%</span>';

        var btnPlus = document.createElement('button');
        btnPlus.className = 'ma-btn-font-plus';
        btnPlus.setAttribute('aria-label', 'Aumentar tamanho da letra');
        btnPlus.textContent = '+';
        btnPlus.addEventListener('click', this.aumentarFonte.bind(this));

        fontGroup.appendChild(btnMinus);
        fontGroup.appendChild(fontLabel);
        fontGroup.appendChild(btnPlus);

        var btnDarkMode = document.createElement('button');
        btnDarkMode.id = 'btn-dark-mode-toggle';
        btnDarkMode.className = 'ma-btn ma-btn-darkmode';
        btnDarkMode.textContent = this.isEscuro ? 'Modo Claro' : 'Modo Escuro';
        btnDarkMode.setAttribute('aria-label', this.isEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro');
        btnDarkMode.addEventListener('click', this.toggleModoEscuro.bind(this));

        var btnAssistente = document.createElement('button');
        btnAssistente.className = 'ma-btn ma-btn-assistente';
        btnAssistente.textContent = 'Tirar D\u00FAvidas';
        btnAssistente.setAttribute('aria-label', 'Abrir assistente virtual');
        btnAssistente.addEventListener('click', function () {
            document.dispatchEvent(new CustomEvent('mente-ativa-abrir-assistente'));
        });

        var notifToggle = document.createElement('button');
        notifToggle.id = 'ma-btn-notificacao';
        notifToggle.className = 'ma-btn ma-btn-notificacao';
        var notifAtivo = localStorage.getItem(STORAGE_KEYS.notifications) === 'true';
        notifToggle.textContent = notifAtivo ? 'Lembretes: Ligado' : 'Lembretes: Desligado';
        notifToggle.setAttribute('aria-label', notifAtivo ? 'Desligar lembretes diários' : 'Ligar lembretes diários');
        notifToggle.addEventListener('click', function() {
            var ativo = localStorage.getItem(STORAGE_KEYS.notifications) === 'true';
            if (ativo) {
                localStorage.setItem(STORAGE_KEYS.notifications, 'false');
                notifToggle.textContent = 'Lembretes: Desligado';
                notifToggle.setAttribute('aria-label', 'Ligar lembretes diários');
            } else {
                if (!('Notification' in window)) return;
                if (Notification.permission === 'denied') {
                    exibirAlerta('Permissão de notificação negada. Ative nas configurações do navegador.', 'aviso');
                    return;
                }
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(function(permission) {
                        if (permission === 'granted') {
                            ativarNotif();
                        } else {
                            exibirAlerta('Permissão de notificação negada.', 'aviso');
                        }
                    });
                } else {
                    ativarNotif();
                }
            }
            function ativarNotif() {
                localStorage.setItem(STORAGE_KEYS.notifications, 'true');
                notifToggle.textContent = 'Lembretes: Ligado';
                notifToggle.setAttribute('aria-label', 'Desligar lembretes diários');
                agendarNotificacaoDiaria();
            }
        });

        var somToggle = document.createElement('button');
        somToggle.id = 'ma-btn-som';
        somToggle.className = 'ma-btn ma-btn-som';
        var somAtivo = localStorage.getItem('mente-ativa-som') !== 'false';
        somToggle.textContent = somAtivo ? 'Sons: Ligado' : 'Sons: Desligado';
        somToggle.setAttribute('aria-label', somAtivo ? 'Desligar sons dos jogos' : 'Ligar sons dos jogos');
        somToggle.addEventListener('click', function() {
            var ativo = localStorage.getItem('mente-ativa-som') !== 'false';
            if (ativo) {
                localStorage.setItem('mente-ativa-som', 'false');
                somToggle.textContent = 'Sons: Desligado';
                somToggle.setAttribute('aria-label', 'Ligar sons dos jogos');
            } else {
                localStorage.setItem('mente-ativa-som', 'true');
                somToggle.textContent = 'Sons: Ligado';
                somToggle.setAttribute('aria-label', 'Desligar sons dos jogos');
            }
            if (window.MenteAtiva && window.MenteAtiva.utils) {
                window.MenteAtiva.utils.somAtivo(!ativo);
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
            if (!this.ativa) return;
            velocidade = velocidade || 0.8;
            this.parar();
            var utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'pt-BR';
            utterance.rate = velocidade;
            this.sintetizador.speak(utterance);
        },
        parar: function() {
            if (this.ativa) this.sintetizador.cancel();
        }
    };

    var Contraste = {
        opcoes: ['normal', 'dark', 'high', 'yellow', 'blue'],
        atual: 'normal',
        init: function() {
            var salvo = localStorage.getItem(STORAGE_KEYS.contrast);
            if (salvo && this.opcoes.indexOf(salvo) !== -1) this.aplicar(salvo);
        },
        aplicar: function(tipo) {
            this.atual = tipo;
            document.body.setAttribute('data-contrast', tipo);
            for (var i = 0; i < this.opcoes.length; i++) {
                document.body.classList.remove('contrast-' + this.opcoes[i]);
            }
            if (tipo !== 'normal') document.body.classList.add('contrast-' + tipo);
            localStorage.setItem(STORAGE_KEYS.contrast, tipo);
        }
    };

    function agendarNotificacaoDiaria() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'denied') return;
        if (localStorage.getItem(STORAGE_KEYS.notifications) !== 'true') return;
        var agendadas = JSON.parse(localStorage.getItem('mente-ativa-notif-agendadas') || '[]');
        var hoje = new Date().toDateString();
        if (agendadas.indexOf(hoje) !== -1) return;
        agendadas.push(hoje);
        localStorage.setItem('mente-ativa-notif-agendadas', JSON.stringify(agendadas));
        try {
            var notif = new Notification('Mente Ativa', {
                body: 'Hora de exercitar a mente! Que tal um joguinho hoje?',
                icon: '/img/unnamed.jpg'
            });
            setTimeout(function() { notif.close(); }, 8000);
        } catch (e) {}
    }

    window.MenteAtiva = window.MenteAtiva || {};
    var dm = new DarkModeManager();
    window.MenteAtiva.darkMode = dm;
    window.Accessibility = {
        TTS: TTS,
        DarkMode: dm,
        Contraste: Contraste,
        STORAGE_KEYS: STORAGE_KEYS
    };

    function init() {
        TTS.init();
        dm.init();
        Contraste.init();
        dm.criarBotoes();
        if (localStorage.getItem(STORAGE_KEYS.notifications) === 'true') {
            agendarNotificacaoDiaria();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
