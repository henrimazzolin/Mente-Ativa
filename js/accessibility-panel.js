(function () {
    var panel = null;
    var overlay = null;

    function criarPainel() {
        if (panel) return;

        panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.id = 'accessibility-panel';
        panel.innerHTML = [
            '<button class="accessibility-close" id="accessibility-close" aria-label="Fechar painel">&times;</button>',
            '<h2>Acessibilidade</h2>',
            '<div class="accessibility-option">',
            '  <h3>Modo Escuro</h3>',
            '  <button class="dark-mode-toggle-btn" id="panel-dark-mode-btn" aria-label="Alternar modo escuro">',
            '    <span class="toggle-indicator">',
            '      <span class="toggle-on">ON</span>',
            '      <span class="toggle-off">OFF</span>',
            '    </span>',
            '  </button>',
            '</div>',
            '<div class="accessibility-option">',
            '  <h3>Tamanho da Fonte</h3>',
            '  <div class="font-buttons">',
            '    <button class="font-btn" data-size="100" aria-label="Fonte pequeno">A-</button>',
            '    <button class="font-btn active" data-size="120" aria-label="Fonte normal">A</button>',
            '    <button class="font-btn" data-size="130" aria-label="Fonte grande">A+</button>',
            '    <button class="font-btn" data-size="140" aria-label="Fonte extra grande">A++</button>',
            '  </div>',
            '</div>',
            '<div class="accessibility-option">',
            '  <h3>Contraste</h3>',
            '  <div class="contrast-buttons">',
            '    <button class="contrast-btn contrast-normal active" data-contrast="normal" style="background:#F8FAFC;" aria-label="Contraste normal" title="Normal"></button>',
            '    <button class="contrast-btn contrast-dark" data-contrast="dark" style="background:#1a1a2e;" aria-label="Contraste escuro" title="Escuro"></button>',
            '    <button class="contrast-btn contrast-high" data-contrast="high" style="background:#000;" aria-label="Contraste alto" title="Alto"></button>',
            '    <button class="contrast-btn contrast-yellow" data-contrast="yellow" style="background:#FFFF00;" aria-label="Contraste amarelo" title="Amarelo"></button>',
            '    <button class="contrast-btn contrast-blue" data-contrast="blue" style="background:#0000FF;" aria-label="Contraste azul" title="Azul"></button>',
            '  </div>',
            '</div>'
        ].join('');

        overlay = document.createElement('div');
        overlay.className = 'accessibility-overlay';
        overlay.id = 'accessibility-overlay';

        document.body.appendChild(panel);
        document.body.appendChild(overlay);

        var closeBtn = document.getElementById('accessibility-close');
        closeBtn.addEventListener('click', fecharPainel);
        overlay.addEventListener('click', fecharPainel);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('open')) {
                fecharPainel();
            }
        });

        var darkModeBtn = document.getElementById('panel-dark-mode-btn');
        darkModeBtn.addEventListener('click', alternarModoEscuro);

        document.querySelectorAll('.font-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.font-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                document.body.style.fontSize = btn.dataset.size + '%';
                localStorage.setItem('accessibility_fontSize', btn.dataset.size);
            });
        });

        document.querySelectorAll('.contrast-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.contrast-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                definirContraste(btn.dataset.contrast);
                localStorage.setItem('accessibility_contrast', btn.dataset.contrast);
            });
        });

        carregarPreferencias();
        atualizarUIModoEscuro();
    }

    function abrirPainel() {
        criarPainel();
        panel.classList.add('open');
        overlay.classList.add('show');
    }

    function fecharPainel() {
        if (panel) panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }

    function alternarModoEscuro() {
        if (window.MenteAtiva && window.MenteAtiva.darkMode) {
            window.MenteAtiva.darkMode.toggleModoEscuro();
        }
        atualizarUIModoEscuro();
    }

    function atualizarUIModoEscuro() {
        var btn = document.getElementById('panel-dark-mode-btn');
        if (btn) {
            var escuro = document.documentElement.classList.contains('modo-escuro');
            btn.classList.toggle('active', escuro);
        }
    }

    function definirContraste(contrast) {
        document.body.setAttribute('data-contrast', contrast);
        document.body.classList.remove('contrast-normal', 'contrast-dark', 'contrast-high', 'contrast-yellow', 'contrast-blue');
        if (contrast !== 'normal') {
            document.body.classList.add('contrast-' + contrast);
        }
    }

    function carregarPreferencias() {
        if (localStorage.getItem('mente-ativa-modo-escuro') === 'true') {
            var btn = document.getElementById('panel-dark-mode-btn');
            if (btn) btn.classList.add('active');
        }

        var fontSize = localStorage.getItem('accessibility_fontSize');
        if (fontSize) {
            document.body.style.fontSize = fontSize + '%';
            document.querySelectorAll('.font-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.size === fontSize);
            });
        }

        var contrast = localStorage.getItem('accessibility_contrast');
        if (contrast) {
            definirContraste(contrast);
            document.querySelectorAll('.contrast-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.contrast === contrast);
            });
        }
    }

    document.addEventListener('mente-ativa-abrir-acessibilidade', abrirPainel);
})();
