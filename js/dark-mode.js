const BACKGROUND_MAP = {
    'neutralbkg.png': 'darkneutralbkg.png',
    'bluebkg.png': 'darkbluebkg.png',
    'greenbkg.png': 'darkgreenbkg.png',
};

const STORAGE_KEY = 'mente-ativa-modo-escuro';
const FONT_STEPS = [80, 90, 100, 110, 120, 130, 140];
const FONT_STORAGE_KEY = 'mente-ativa-fonte-pct';

class DarkModeManager {
    constructor() {
        this.isEscuro = false;
        this.backgroundAtual = '';
        this.botao = null;
        this.fontPct = 100;
    }

    possuiFundoMapeavel(backgroundImage) {
        if (!backgroundImage || backgroundImage === 'none') return false;
        return Object.keys(BACKGROUND_MAP).some((nome) => backgroundImage.includes(nome));
    }

    substituirParaEscuro(backgroundImage) {
        var s = backgroundImage;
        Object.keys(BACKGROUND_MAP).forEach(function (light) {
            var dark = BACKGROUND_MAP[light];
            s = s.split(light).join(dark);
        });
        return s;
    }

    sincronizarClasseDocumento() {
        document.documentElement.classList.toggle('modo-escuro', Boolean(this.isEscuro));
    }

    init() {
        this.isEscuro = localStorage.getItem(STORAGE_KEY) === 'true';

        if (this.isEscuro) {
            this.aplicarModoEscuro();
        } else {
            this.sincronizarClasseDocumento();
        }

        this.fontPct = parseInt(localStorage.getItem(FONT_STORAGE_KEY), 10) || 100;
        this.aplicarFontePct();

        this.criarBotoes();
        this.atualizarEstadoBotoes();
    }

    toggleModoEscuro() {
        if (this.isEscuro) {
            this.aplicarModoClaro();
        } else {
            this.aplicarModoEscuro();
        }
        this.atualizarTextoBotao();
    }

    aplicarModoEscuro() {
        this.isEscuro = true;

        var bg = window.getComputedStyle(document.body).backgroundImage;
        if (this.possuiFundoMapeavel(bg)) {
            var proximo = this.substituirParaEscuro(bg);
            if (proximo && proximo !== bg) {
                document.body.style.backgroundImage = proximo;
            }
        }

        localStorage.setItem(STORAGE_KEY, 'true');
        this.sincronizarClasseDocumento();
    }

    aplicarModoClaro() {
        this.isEscuro = false;
        document.body.style.backgroundImage = '';
        localStorage.setItem(STORAGE_KEY, 'false');
        this.sincronizarClasseDocumento();
    }

    atualizarTextoBotao() {
        var btn = document.getElementById('btn-dark-mode-toggle');
        if (btn) {
            if (this.isEscuro) {
                btn.textContent = 'Modo Claro';
                btn.setAttribute('aria-label', 'Mudar para modo claro');
            } else {
                btn.textContent = 'Modo Escuro';
                btn.setAttribute('aria-label', 'Mudar para modo escuro');
            }
        }
    }

    // --- Font size control ---

    aplicarFontePct() {
        var base = 20;
        document.body.style.fontSize = Math.round(base * this.fontPct / 100) + 'px';
        localStorage.setItem(FONT_STORAGE_KEY, String(this.fontPct));
        this.criarStyleFonte();
    }

    criarStyleFonte() {
        if (document.getElementById('ma-font-style')) return;
        var styleEl = document.createElement('style');
        styleEl.id = 'ma-font-style';
        styleEl.textContent = 'body * { font-size: inherit !important; }';
        document.head.appendChild(styleEl);
    }

    aumentarFonte() {
        var idx = FONT_STEPS.indexOf(this.fontPct);
        if (idx === -1) { this.fontPct = 100; idx = 2; }
        if (this.fontPct >= 140) return;
        this.fontPct = FONT_STEPS[Math.min(idx + 1, FONT_STEPS.length - 1)];
        this.aplicarFontePct();
        this.atualizarLabelFonte();
        this.atualizarEstadoBotoes();
    }

    diminuirFonte() {
        var idx = FONT_STEPS.indexOf(this.fontPct);
        if (idx === -1) { this.fontPct = 100; idx = 2; }
        if (this.fontPct <= 80) return;
        this.fontPct = FONT_STEPS[Math.max(idx - 1, 0)];
        this.aplicarFontePct();
        this.atualizarLabelFonte();
        this.atualizarEstadoBotoes();
    }

    atualizarLabelFonte() {
        var el = document.getElementById('ma-font-pct');
        if (el) el.textContent = this.fontPct + '%';
    }

    atualizarEstadoBotoes() {
        var btnMinus = document.querySelector('.ma-btn-font-minus');
        var btnPlus = document.querySelector('.ma-btn-font-plus');
        if (btnMinus) {
            if (this.fontPct <= 80) {
                btnMinus.classList.add('ma-btn-font-disabled');
                btnMinus.disabled = true;
            } else {
                btnMinus.classList.remove('ma-btn-font-disabled');
                btnMinus.disabled = false;
            }
        }
        if (btnPlus) {
            if (this.fontPct >= 140) {
                btnPlus.classList.add('ma-btn-font-disabled');
                btnPlus.disabled = true;
            } else {
                btnPlus.classList.remove('ma-btn-font-disabled');
                btnPlus.disabled = false;
            }
        }
    }

    // --- Panel toggle ---

    togglePanel() {
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
    }

    closePanel() {
        var container = document.getElementById('mente-ativa-controls');
        var backdrop = document.querySelector('.ma-backdrop');
        if (container) container.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
        var toggle = document.getElementById('ma-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir painel de acessibilidade');
        }
    }

    // --- Button creation ---

    criarBotoes() {
        // Toggle button
        var toggle = document.createElement('button');
        toggle.id = 'ma-toggle';
        toggle.className = 'ma-toggle-btn';
        toggle.setAttribute('aria-label', 'Abrir painel de acessibilidade');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Acessibilidade';
        toggle.addEventListener('click', this.togglePanel.bind(this));

        // Backdrop for outside-click detection
        var backdrop = document.createElement('div');
        backdrop.className = 'ma-backdrop';
        backdrop.addEventListener('click', this.closePanel.bind(this));

        // Panel container
        var container = document.createElement('div');
        container.id = 'mente-ativa-controls';
        container.className = 'mente-ativa-controls';

        // Font-size control: [ - ] [ label ] [ + ]
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

        // Dark mode button
        var btnDarkMode = document.createElement('button');
        btnDarkMode.id = 'btn-dark-mode-toggle';
        btnDarkMode.className = 'ma-btn ma-btn-darkmode';
        if (this.isEscuro) {
            btnDarkMode.textContent = 'Modo Claro';
            btnDarkMode.setAttribute('aria-label', 'Mudar para modo claro');
        } else {
            btnDarkMode.textContent = 'Modo Escuro';
            btnDarkMode.setAttribute('aria-label', 'Mudar para modo escuro');
        }
        btnDarkMode.addEventListener('click', this.toggleModoEscuro.bind(this));

        // Assistente button
        var btnAssistente = document.createElement('button');
        btnAssistente.className = 'ma-btn ma-btn-assistente';
        btnAssistente.textContent = 'Tirar D\u00FAvidas';
        btnAssistente.setAttribute('aria-label', 'Abrir assistente virtual');
        btnAssistente.addEventListener('click', function () {
            document.dispatchEvent(new CustomEvent('mente-ativa-abrir-assistente'));
        });

        container.appendChild(fontGroup);
        container.appendChild(btnDarkMode);
        container.appendChild(btnAssistente);

        document.body.appendChild(toggle);
        document.body.appendChild(backdrop);
        document.body.appendChild(container);
    }
}

function iniciarDarkMode() {
    window.MenteAtiva = window.MenteAtiva || {};
    window.MenteAtiva.darkMode = new DarkModeManager();
    window.MenteAtiva.darkMode.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarDarkMode);
} else {
    iniciarDarkMode();
}
