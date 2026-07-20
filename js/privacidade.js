(function() {
    'use strict';

    var EVENTS_KEY = 'menteativa_eventos';
    var PREFERENCE_KEYS = [
        'mente-ativa-modo-escuro',
        'mente-ativa-fonte',
        'mente-ativa-fonte-pct',
        'mente-ativa-fonte-default-v2',
        'mente-ativa-notificacoes',
        'mente-ativa-painel-aberto',
        'mente-ativa-som',
        'mente-ativa-notif-agendadas'
    ];

    function contarEventos() {
        try {
            var dados = JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}');
            var total = 0;
            Object.keys(dados).forEach(function(data) {
                if (Array.isArray(dados[data])) total += dados[data].length;
            });
            return total;
        } catch (e) {
            return 0;
        }
    }

    function contarPreferencias() {
        var total = 0;
        PREFERENCE_KEYS.forEach(function(key) {
            try {
                if (localStorage.getItem(key) !== null) total++;
            } catch (e) {}
        });
        return total;
    }

    function atualizarResumo() {
        var eventCount = document.getElementById('privacyEventCount');
        var preferenceStatus = document.getElementById('privacyPreferenceStatus');
        if (!eventCount || !preferenceStatus) return;

        var eventos = contarEventos();
        var preferencias = contarPreferencias();
        eventCount.textContent = eventos === 0 ? 'nenhuma atividade salva' :
            eventos + (eventos === 1 ? ' atividade salva' : ' atividades salvas');
        preferenceStatus.textContent = preferencias === 0 ? 'nenhuma preferência salva' :
            preferencias + (preferencias === 1 ? ' preferência salva' : ' preferências salvas');
    }

    function mostrarStatus(mensagem) {
        var status = document.getElementById('privacyActionStatus');
        if (status) status.textContent = mensagem;
    }

    function iniciar() {
        var clearCalendar = document.getElementById('clearCalendarData');
        var clearAll = document.getElementById('clearAllLocalData');
        if (!clearCalendar || !clearAll) return;

        atualizarResumo();

        clearCalendar.addEventListener('click', function() {
            if (!window.confirm('Deseja apagar todas as atividades salvas no calendário deste dispositivo?')) return;
            try { localStorage.removeItem(EVENTS_KEY); } catch (e) {}
            atualizarResumo();
            mostrarStatus('As atividades do calendário foram apagadas.');
        });

        clearAll.addEventListener('click', function() {
            if (!window.confirm('Deseja redefinir todas as preferências e atividades salvas neste dispositivo?')) return;
            try { localStorage.clear(); } catch (e) {}
            atualizarResumo();
            mostrarStatus('Os dados e as preferências locais foram redefinidos.');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
