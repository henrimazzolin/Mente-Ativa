/**
 * Mente Ativa - Logo Component
 *用法:
 *   <div class="logo" data-logo-tipo="simples">
 *       <div class="logo-icon">
 *           <img src="img/LogoVerde.png" alt="Logo Mente Ativa" />
 *       </div>
 *   </div>
 * 
 * Automatic detection based on page:
 *   - grupo-simples, com-ajuda → Verde
 *   - grupo-moderado, menu → Azul
 *   - Others → Principal
 */

(function() {
    'use strict';

    const LogoConfig = {
        tipos: {
            inicial: {
                claro: 'img/Logopreta.png',
                escuro: 'img/Logobranca.png',
                alt: 'Logo Mente Ativa'
            },
            simples: {
                claro: 'img/LogoVerdeClaroNovo.png',
                escuro: 'img/LogoVerdeEscuroNovo.png',
                alt: 'Logo Mente Ativa - Jogos acompanhados'
            },
            moderado: {
                claro: 'img/LogoAzulClaroNovo.png',
                escuro: 'img/LogoAzulEscuroNovo.png',
                alt: 'Logo Mente Ativa - Nível Moderado'
            },
            principal: {
                claro: 'img/LogoEscura.png',
                escuro: 'img/Logo.png',
                alt: 'Logo Mente Ativa'
            }
        },
        autoDetectPaths: {
            simples: ['simples', 'com-ajuda'],
            moderado: ['moderado', 'menu', 'seguranca']
        }
    };

    function isModoEscuro() {
        return document.documentElement.classList.contains('modo-escuro');
    }

    function getSrc(config) {
        return isModoEscuro() ? config.escuro : config.claro;
    }

    function detectarTipo() {
        const path = window.location.pathname.toLowerCase();

        for (const [tipo, keywords] of Object.entries(LogoConfig.autoDetectPaths)) {
            for (const keyword of keywords) {
                if (path.includes(keyword)) {
                    return tipo;
                }
            }
        }
        return 'principal';
    }

    function aplicarLogo() {
        const logos = document.querySelectorAll('[data-logo-tipo]');

        if (logos.length === 0) return;

        // Se há data-logo-tipo explícito, usa esse
        logos.forEach(logoContainer => {
            let tipo = logoContainer.dataset.logoTipo;

            if (!tipo) {
                // Detecta automaticamente baseado na página
                tipo = detectarTipo();
            }

            const config = LogoConfig.tipos[tipo] || LogoConfig.tipos.principal;
            const img = logoContainer.querySelector('img') || logoContainer;

            if (img.tagName === 'IMG') {
                img.src = getSrc(config);
                img.alt = config.alt;
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
    }

    // Aplica ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarLogo);
    } else {
        aplicarLogo();
    }

    // Observa mudanças de tema (modo-escuro) e reaplica
    if (document.documentElement) {
        var observer = new MutationObserver(function() {
            aplicarLogo();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    // Expõe globalmente
    window.LogoComponent = {
        setTipo: function(container, tipo) {
            const config = LogoConfig.tipos[tipo];
            if (!config) return;

            const img = container.querySelector('img') || container;
            if (img.tagName === 'IMG') {
                img.src = getSrc(config);
                img.alt = config.alt;
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        },
        getTipo: detectarTipo,
        config: LogoConfig.tipos
    };

})();
