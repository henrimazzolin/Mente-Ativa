// Mente Ativa - Calendário Interativo

const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let dataAtual = new Date();
let dataSelecionada = new Date();
let eventos = {};

const datasComemorativas = {
    '2026-1-1':  { titulo: 'Confraternização Universal', descricao: 'Ano Novo' },
    '2026-2-17': { titulo: 'Carnaval', descricao: 'Terça-Feira de Carnaval' },
    '2026-2-18': { titulo: 'Quarta-Feira de Cinzas', descricao: 'Início da Quaresma' },
    '2026-3-8':  { titulo: 'Dia Internacional da Mulher', descricao: 'Homenagem às mulheres' },
    '2026-4-3':  { titulo: 'Sexta-Feira Santa', descricao: 'Paixão de Cristo' },
    '2026-4-7':  { titulo: 'Dia Mundial da Saúde', descricao: 'Promoção da saúde e bem-estar' },
    '2026-4-21': { titulo: 'Tiradentes', descricao: 'Feriado Nacional' },
    '2026-5-1':  { titulo: 'Dia do Trabalho', descricao: 'Dia Mundial do Trabalho' },
    '2026-5-10': { titulo: 'Dia das Mães', descricao: 'Homenagem às mães' },
    '2026-6-4':  { titulo: 'Corpus Christi', descricao: 'Corpo e Sangue de Cristo' },
    '2026-6-12': { titulo: 'Dia dos Namorados', descricao: 'Data especial para os casais' },
    '2026-8-9':  { titulo: 'Dia dos Pais', descricao: 'Homenagem aos pais' },
    '2026-9-7':  { titulo: 'Independência do Brasil', descricao: 'Independência do Brasil' },
    '2026-10-1': { titulo: 'Dia Internacional do Idoso', descricao: 'Valorização da pessoa idosa' },
    '2026-10-12':{ titulo: 'Nossa Senhora Aparecida', descricao: 'Padroeira do Brasil' },
    '2026-10-31':{ titulo: 'Halloween', descricao: 'Dia das Bruxas' },
    '2026-11-2': { titulo: 'Finados', descricao: 'Dia de Finados' },
    '2026-11-15':{ titulo: 'Proclamação da República', descricao: 'Proclamação da República do Brasil' },
    '2026-11-20':{ titulo: 'Consciência Negra', descricao: 'Dia da Consciência Negra' },
    '2026-12-25':{ titulo: 'Natal', descricao: 'Natal' },
    '2026-12-31':{ titulo: 'Réveillon', descricao: 'Véspera do Ano Novo' }
};

function getEventosDoDia(dataStr) {
    const eventosUsuario = eventos[dataStr] || [];
    return {
        usuario: eventosUsuario,
        comemorativo: datasComemorativas[dataStr] || null
    };
}

function temEvento(dataStr) {
    return (eventos[dataStr] && eventos[dataStr].length > 0) || !!datasComemorativas[dataStr];
}

function inicializarCalendario() {
    carregarEventos();
    renderizarCalendario();
    renderizarEventos();
}

function carregarEventos() {
    const eventosSalvos = localStorage.getItem('menteativa_eventos');
    if (eventosSalvos) {
        eventos = JSON.parse(eventosSalvos);
        for (const dataStr in eventos) {
            eventos[dataStr] = eventos[dataStr].map(ev => {
                const { tipo, ...rest } = ev;
                return rest;
            });
        }
    } else {
        eventos = {};
    }
}

function renderizarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    document.querySelector('.calendar-header h2').textContent = `${nomesMeses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();

    const weekdaysDiv = document.querySelector('.weekdays');
    weekdaysDiv.innerHTML = nomesDias.map(dia => `<span>${dia}</span>`).join('');

    const daysDiv = document.querySelector('.days');
    daysDiv.innerHTML = '';

    for (let i = 0; i < primeiroDia; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day empty';
        daysDiv.appendChild(dayDiv);
    }

    const dataSelecionadaStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const hojeStr = `${hoje.getFullYear()}-${hoje.getMonth() + 1}-${hoje.getDate()}`;

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = dia;

        const dataStr = `${ano}-${mes + 1}-${dia}`;

        if (temEvento(dataStr)) {
            dayDiv.classList.add('has-event');
        }

        if (dataStr === hojeStr) {
            dayDiv.classList.add('today');
        }

        if (dataStr === dataSelecionadaStr) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', () => {
            if (!dayDiv.classList.contains('empty')) {
                selecionarDia(dia);
            }
        });

        daysDiv.appendChild(dayDiv);
    }
}

function selecionarDia(dia) {
    dataSelecionada = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dia);
    renderizarCalendario();
    renderizarEventos();
}

function renderizarEventos() {
    const eventsListDiv = document.querySelector('.events-list');
    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const eventosDia = getEventosDoDia(dataStr);

    const diaSemana = dataSelecionada.getDay();
    const nomeDiaSemana = nomesDias[diaSemana];
    const dia = dataSelecionada.getDate();
    const mes = nomesMeses[dataSelecionada.getMonth()];

    if (eventosDia.usuario.length === 0 && !eventosDia.comemorativo) {
        eventsListDiv.innerHTML = `
            <h3>${nomeDiaSemana}, ${dia} de ${mes}</h3>
            <div class="no-events">
                <p>Nenhum evento neste dia</p>
            </div>
        `;
    } else {
        let html = `<h3>${nomeDiaSemana}, ${dia} de ${mes}</h3>`;

        if (eventosDia.comemorativo) {
            const ev = eventosDia.comemorativo;
            html += `
                <div class="event-item comemorativo">
                    <div class="event-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                        </svg>
                    </div>
                    <div class="event-details">
                        <div class="event-title">${ev.titulo}</div>
                        <div class="event-time">${ev.descricao}</div>
                    </div>
                    <span class="comemorativo-badge">Feriado</span>
                </div>
            `;
        }

        eventosDia.usuario.forEach((evento, index) => {
            html += `
                <div class="event-item">
                    <div class="event-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <div class="event-details">
                        <div class="event-title">${evento.titulo}</div>
                        <div class="event-time">${evento.hora}${evento.periodo ? ' - ' + evento.periodo : ''}</div>
                    </div>
                    <button class="delete-event-btn" data-index="${index}" aria-label="Remover atividade ${evento.titulo}">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Remover
                    </button>
                </div>
            `;
        });

        eventsListDiv.innerHTML = html;

        eventsListDiv.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                confirmarExclusao(index);
            });
        });
    }
}

function mudarMes(delta) {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    dataAtual = new Date(ano, mes + delta, 1);
    dataSelecionada = new Date(dataAtual);
    renderizarCalendario();
    renderizarEventos();
}

function abrirModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTime').value = '09:00';
    document.getElementById('eventPeriod').value = '';
    document.getElementById('eventTitle').focus();
}

function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function salvarEvento() {
    const titulo = document.getElementById('eventTitle').value.trim();
    const hora = document.getElementById('eventTime').value;
    const periodo = document.getElementById('eventPeriod').value.trim();

    if (!titulo) {
        exibirAlerta('Por favor, digite o nome da atividade', 'aviso');
        return;
    }

    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;

    if (!eventos[dataStr]) {
        eventos[dataStr] = [];
    }

    eventos[dataStr].push({
        titulo: titulo,
        hora: hora,
        periodo: periodo || ''
    });

    localStorage.setItem('menteativa_eventos', JSON.stringify(eventos));

    fecharModal();
    renderizarCalendario();
    renderizarEventos();

    exibirAlerta('Atividade adicionada com sucesso', 'sucesso');
}

function confirmarExclusao(index) {
    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const evento = eventos[dataStr][index];

    document.getElementById('deleteModalOverlay').classList.add('active');
    document.getElementById('deleteEventTitle').textContent = evento.titulo;
    document.getElementById('deleteEventTime').textContent = evento.hora;

    window.eventoParaExcluir = { index: index, dataStr: dataStr };
}

function fecharModalExclusao() {
    document.getElementById('deleteModalOverlay').classList.remove('active');
    window.eventoParaExcluir = null;
}

function removerEvento() {
    if (!window.eventoParaExcluir) return;

    const { index, dataStr } = window.eventoParaExcluir;

    eventos[dataStr].splice(index, 1);

    if (eventos[dataStr].length === 0) {
        delete eventos[dataStr];
    }

    localStorage.setItem('menteativa_eventos', JSON.stringify(eventos));

    fecharModalExclusao();
    renderizarCalendario();
    renderizarEventos();

    exibirAlerta('Atividade removida com sucesso', 'sucesso');
}

document.addEventListener('DOMContentLoaded', () => {
    const btnMesAnterior = document.getElementById('btn-mes-anterior');
    const btnProximoMes = document.getElementById('btn-proximo-mes');
    const btnAdicionarEvento = document.getElementById('btn-adicionar-evento');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnCancelarEvento = document.getElementById('btn-cancelar-evento');
    const btnSalvarEvento = document.getElementById('btn-salvar-evento');
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    const btnCancelarExclusao = document.getElementById('btn-cancelar-exclusao');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

    if (btnMesAnterior) btnMesAnterior.addEventListener('click', () => mudarMes(-1));
    if (btnProximoMes) btnProximoMes.addEventListener('click', () => mudarMes(1));
    if (btnAdicionarEvento) btnAdicionarEvento.addEventListener('click', abrirModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) fecharModal();
    });
    if (btnCancelarEvento) btnCancelarEvento.addEventListener('click', fecharModal);
    if (btnSalvarEvento) btnSalvarEvento.addEventListener('click', salvarEvento);
    if (deleteModalOverlay) deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) fecharModalExclusao();
    });
    if (btnCancelarExclusao) btnCancelarExclusao.addEventListener('click', fecharModalExclusao);
    if (btnConfirmarExclusao) btnConfirmarExclusao.addEventListener('click', removerEvento);

    inicializarCalendario();
});
