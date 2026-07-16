(function () {
    'use strict';

    function origemInterna() {
        if (!document.referrer) return false;
        try {
            return new URL(document.referrer).origin === window.location.origin;
        } catch (e) {
            return false;
        }
    }

    function voltarParaOrigem(event) {
        if (event) event.preventDefault();
        if (origemInterna() && window.history.length > 1) {
            window.history.back();
            return;
        }
        window.location.href = 'menu.html';
    }

    function init() {
        var link = document.querySelector('.info-back-link');
        if (!link) return;
        link.setAttribute('href', 'menu.html');
        link.setAttribute('aria-label', 'Voltar para a página anterior');
        link.setAttribute('title', 'Voltar');
        link.addEventListener('click', voltarParaOrigem);
    }

    window.MenteAtivaInfoNavigation = {
        origemInterna: origemInterna,
        voltarParaOrigem: voltarParaOrigem
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
