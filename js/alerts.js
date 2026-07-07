function exibirAlerta(mensagem, tipo) {
    var config = {
        sucesso: { cor: '#10B981', icone: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z', btn: 'btn-success' },
        erro: { cor: '#EF4444', icone: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z', btn: 'btn-danger' },
        info: { cor: '#3B82F6', icone: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z', btn: 'btn-primary' },
        aviso: { cor: '#F59E0B', icone: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z', btn: 'btn-warning' }
    };
    var c = config[tipo] || config.info;
    var id = 'ma-alerta-' + Date.now();

    var el = document.createElement('div');
    el.innerHTML = '<div id="' + id + '" class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content" style="border-radius:16px;padding:8px 0;">' +
        '<div class="modal-header border-0 pb-0">' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>' +
        '</div>' +
        '<div class="modal-body text-center pt-2 pb-3">' +
        '<svg width="52" height="52" viewBox="0 0 24 24" fill="' + c.cor + '" style="margin-bottom:10px;">' +
        '<path d="' + c.icone + '"/>' +
        '</svg>' +
        '<p class="ma-alerta-mensagem" style="font-size:17px;font-weight:500;margin:0;color:inherit;"></p>' +
        '</div>' +
        '<div class="modal-footer border-0 justify-content-center pt-0 pb-2">' +
        '<button type="button" class="btn ' + c.btn + ' px-4" data-bs-dismiss="modal" style="border-radius:10px;font-weight:600;">OK</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    document.body.appendChild(el.firstElementChild);

    var modalEl = document.getElementById(id);
    var msgEl = modalEl.querySelector('.ma-alerta-mensagem');
    if (msgEl) msgEl.textContent = String(mensagem || '');
    if (typeof bootstrap === 'undefined') {
        alert(mensagem);
        modalEl.remove();
        return;
    }
    var modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener('hidden.bs.modal', function () {
        modalEl.remove();
    });
}

function exibirConfirmacao(mensagem, descricao, callback) {
    if (typeof descricao === 'function') {
        callback = descricao;
        descricao = '';
    }
    var id = 'ma-confirm-' + Date.now();

    var el = document.createElement('div');
    el.innerHTML = '<div id="' + id + '" class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content" style="border-radius:16px;padding:8px 0;">' +
        '<div class="modal-header border-0 pb-0">' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>' +
        '</div>' +
        '<div class="modal-body text-center pt-2 pb-3">' +
        '<svg width="52" height="52" viewBox="0 0 24 24" fill="#F59E0B" style="margin-bottom:10px;">' +
        '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>' +
        '</svg>' +
        '<p class="ma-confirm-mensagem" style="font-size:17px;font-weight:500;margin:0;color:inherit;"></p>' +
        (descricao ? '<p class="ma-confirm-descricao" style="font-size:14px;color:#64748B;margin-top:8px;"></p>' : '') +
        '</div>' +
        '<div class="modal-footer border-0 justify-content-center pt-0 pb-2 gap-2">' +
        '<button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal" style="border-radius:10px;font-weight:600;">Cancelar</button>' +
        '<button type="button" class="btn btn-danger px-4 btn-ma-confirmar" style="border-radius:10px;font-weight:600;">Confirmar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    document.body.appendChild(el.firstElementChild);

    var modalEl = document.getElementById(id);
    var msgEl = modalEl.querySelector('.ma-confirm-mensagem');
    var descEl = modalEl.querySelector('.ma-confirm-descricao');
    if (msgEl) msgEl.textContent = String(mensagem || '');
    if (descEl) descEl.textContent = String(descricao || '');
    if (typeof bootstrap === 'undefined') {
        if (callback) callback(confirm('' + mensagem));
        modalEl.remove();
        return;
    }
    var modal = new bootstrap.Modal(modalEl);
    var confirmou = false;

    modalEl.querySelector('.btn-ma-confirmar').addEventListener('click', function () {
        confirmou = true;
        modal.hide();
        if (callback) callback(true);
    });

    modalEl.addEventListener('hidden.bs.modal', function () {
        modalEl.remove();
        if (!confirmou && callback) callback(false);
    });

    modal.show();
}
