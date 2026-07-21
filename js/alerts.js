(function () {
    'use strict';

    var alertConfig = {
        sucesso: { cor: '#047857', icone: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z', btn: 'btn-success' },
        erro: { cor: '#B91C1C', icone: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z', btn: 'btn-danger' },
        info: { cor: '#1D4ED8', icone: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z', btn: 'btn-primary' },
        aviso: { cor: '#B45309', icone: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z', btn: 'btn-warning' }
    };

    function criarModalBase(id, role, titulo, descricao, config, confirmacao) {
        var tituloId = id + '-titulo';
        var descricaoId = id + '-descricao';
        var el = document.createElement('div');
        el.innerHTML = '<div id="' + id + '" class="modal fade ma-system-modal" tabindex="-1" role="' + role + '" aria-modal="true" aria-labelledby="' + tituloId + '"' +
            (descricao ? ' aria-describedby="' + descricaoId + '"' : '') + ' data-bs-backdrop="static">' +
            '<div class="modal-dialog modal-dialog-centered" role="document">' +
            '<div class="modal-content ma-modal-surface">' +
            '<div class="modal-header border-0"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
            '<div class="modal-body text-center">' +
            '<svg class="ma-modal-icon" viewBox="0 0 24 24" fill="' + config.cor + '" aria-hidden="true"><path d="' + config.icone + '"/></svg>' +
            '<h2 id="' + tituloId + '" class="ma-modal-title"></h2>' +
            (descricao ? '<p id="' + descricaoId + '" class="ma-modal-description"></p>' : '') +
            '</div><div class="modal-footer border-0">' +
            (confirmacao
                ? '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button type="button" class="btn btn-danger btn-ma-confirmar">Confirmar</button>'
                : '<button type="button" class="btn ' + config.btn + '" data-bs-dismiss="modal">OK</button>') +
            '</div></div></div></div>';
        return el.firstElementChild;
    }

    function prepararModal(modalEl, focoInicial) {
        var focoAnterior = document.activeElement;
        document.body.appendChild(modalEl);
        var modal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: true, focus: true });
        modalEl.addEventListener('shown.bs.modal', function () {
            if (focoInicial) focoInicial.focus();
        }, { once: true });
        modalEl.addEventListener('hidden.bs.modal', function () {
            modalEl.remove();
            if (focoAnterior && document.contains(focoAnterior) && typeof focoAnterior.focus === 'function') focoAnterior.focus();
        }, { once: true });
        return modal;
    }

    window.exibirAlerta = function (mensagem, tipo) {
        var config = alertConfig[tipo] || alertConfig.info;
        var id = 'ma-alerta-' + Date.now();
        if (typeof bootstrap === 'undefined') {
            window.alert(String(mensagem || ''));
            return;
        }
        var modalEl = criarModalBase(id, 'alertdialog', String(mensagem || ''), '', config, false);
        modalEl.querySelector('.ma-modal-title').textContent = String(mensagem || '');
        var ok = modalEl.querySelector('.modal-footer .btn');
        prepararModal(modalEl, ok).show();
    };

    window.exibirConfirmacao = function (mensagem, descricao, callback) {
        if (typeof descricao === 'function') {
            callback = descricao;
            descricao = '';
        }
        var titulo = String(mensagem || 'Confirmar ação');
        var detalhe = String(descricao || '');
        if (typeof bootstrap === 'undefined') {
            if (window.confirm(titulo + (detalhe ? '\n\n' + detalhe : '')) && callback) callback(true);
            return;
        }
        var id = 'ma-confirm-' + Date.now();
        var config = alertConfig.aviso;
        var modalEl = criarModalBase(id, 'dialog', titulo, detalhe, config, true);
        modalEl.querySelector('.ma-modal-title').textContent = titulo;
        var descEl = modalEl.querySelector('.ma-modal-description');
        if (descEl) descEl.textContent = detalhe;
        var confirmar = modalEl.querySelector('.btn-ma-confirmar');
        var modal = prepararModal(modalEl, confirmar);
        confirmar.addEventListener('click', function () {
            modal.hide();
            if (callback) callback(true);
        }, { once: true });
        modal.show();
    };
})();
