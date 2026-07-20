// Mente Ativa - Calendário Interativo

const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let dataAtual = new Date();
let dataSelecionada = new Date();
let eventos = {};

var datasFixas = {
    '1-1':   { titulo: 'Confraternização Universal', descricao: 'Ano Novo' },
    '3-8':   { titulo: 'Dia Internacional da Mulher', descricao: 'Homenagem às mulheres' },
    '4-7':   { titulo: 'Dia Mundial da Saúde', descricao: 'Promoção da saúde e bem-estar' },
    '4-21':  { titulo: 'Tiradentes', descricao: 'Feriado Nacional' },
    '5-1':   { titulo: 'Dia do Trabalho', descricao: 'Dia Mundial do Trabalho' },
    '6-12':  { titulo: 'Dia dos Namorados', descricao: 'Data especial para os casais' },
    '9-7':   { titulo: 'Independência do Brasil', descricao: 'Independência do Brasil' },
    '10-1':  { titulo: 'Dia Internacional do Idoso', descricao: 'Valorização da pessoa idosa' },
    '10-12': { titulo: 'Nossa Senhora Aparecida', descricao: 'Padroeira do Brasil' },
    '10-31': { titulo: 'Halloween', descricao: 'Dia das Bruxas' },
    '11-2':  { titulo: 'Finados', descricao: 'Dia de Finados' },
    '11-15': { titulo: 'Proclamação da República', descricao: 'Proclamação da República do Brasil' },
    '11-20': { titulo: 'Consciência Negra', descricao: 'Dia da Consciência Negra' },
    '12-25': { titulo: 'Natal', descricao: 'Natal' },
    '12-31': { titulo: 'Réveillon', descricao: 'Véspera do Ano Novo' }
};

function calcularPascoa(ano) {
    var a = ano % 19;
    var b = Math.floor(ano / 100);
    var c = ano % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31);
    var dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
}

function gerarDatasComemorativas(ano) {
    var datas = {};
    for (var key in datasFixas) {
        var parts = key.split('-');
        datas[ano + '-' + parts[0] + '-' + parts[1]] = datasFixas[key];
    }
    var pascoa = calcularPascoa(ano);
    function addData(data, titulo, descricao) {
        var k = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
        datas[k] = { titulo: titulo, descricao: descricao };
    }
    function subDias(data, n) {
        var d = new Date(data);
        d.setDate(d.getDate() - n);
        return d;
    }
    function addDias(data, n) {
        var d = new Date(data);
        d.setDate(d.getDate() + n);
        return d;
    }
    addData(subDias(pascoa, 47), 'Carnaval', 'Terça-Feira de Carnaval');
    addData(subDias(pascoa, 46), 'Quarta-Feira de Cinzas', 'Início da Quaresma');
    addData(subDias(pascoa, 2), 'Sexta-Feira Santa', 'Paixão de Cristo');
    addData(addDias(pascoa, 60), 'Corpus Christi', 'Corpo e Sangue de Cristo');

    var diaMaes = new Date(ano, 4, 1);
    diaMaes.setDate(1 + ((0 - diaMaes.getDay() + 7) % 7) + 7);
    addData(diaMaes, 'Dia das Mães', 'Homenagem às mães');

    var diaPais = new Date(ano, 7, 1);
    diaPais.setDate(1 + ((0 - diaPais.getDay() + 7) % 7) + 7);
    addData(diaPais, 'Dia dos Pais', 'Homenagem aos pais');

    return datas;
}

function getDatasComemorativas() {
    var ano = dataAtual.getFullYear();
    if (!getDatasComemorativas._cache || getDatasComemorativas._cache.ano !== ano) {
        getDatasComemorativas._cache = { ano: ano, datas: gerarDatasComemorativas(ano) };
    }
    return getDatasComemorativas._cache.datas;
}

function getEventosDoDia(dataStr) {
    const eventosUsuario = eventos[dataStr] || [];
    var dt = getDatasComemorativas();
    return {
        usuario: eventosUsuario,
        comemorativo: dt[dataStr] || null
    };
}

function temEvento(dataStr) {
    var dt = getDatasComemorativas();
    return (eventos[dataStr] && eventos[dataStr].length > 0) || !!dt[dataStr];
}

function inicializarCalendario() {
    carregarEventos();
    renderizarCalendario();
    renderizarEventos();
}

function carregarEventos() {
    const eventosSalvos = localStorage.getItem('menteativa_eventos');
    if (!eventosSalvos) {
        eventos = {};
        return;
    }

    try {
        const dados = JSON.parse(eventosSalvos);
        eventos = {};
        for (const dataStr in dados) {
            if (!Array.isArray(dados[dataStr])) continue;
            eventos[dataStr] = dados[dataStr].map(ev => ({
                titulo: String(ev.titulo || '').slice(0, 80),
                hora: String(ev.hora || '').slice(0, 10),
                periodo: String(ev.periodo || '').slice(0, 120)
            })).filter(ev => ev.titulo);
        }
    } catch (e) {
        eventos = {};
        localStorage.removeItem('menteativa_eventos');
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
    weekdaysDiv.replaceChildren();
    nomesDias.forEach(dia => {
        const span = document.createElement('span');
        span.textContent = dia;
        weekdaysDiv.appendChild(span);
    });

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

        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = dia;
        dayDiv.appendChild(dayNumber);

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

    while (daysDiv.childElementCount < 42) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day empty';
        daysDiv.appendChild(dayDiv);
    }
}

function selecionarDia(dia) {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diaSeguro = Math.min(dia, diasNoMes);
    dataSelecionada = new Date(ano, mes, diaSeguro);
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

    eventsListDiv.replaceChildren();

    const heading = document.createElement('h3');
    heading.textContent = `${nomeDiaSemana}, ${dia} de ${mes}`;
    eventsListDiv.appendChild(heading);

    if (eventosDia.usuario.length === 0 && !eventosDia.comemorativo) {
        const empty = document.createElement('div');
        empty.className = 'no-events';
        const p = document.createElement('p');
        p.textContent = 'Nenhum evento neste dia';
        empty.appendChild(p);
        eventsListDiv.appendChild(empty);
        return;
    }

    if (eventosDia.comemorativo) {
        eventsListDiv.appendChild(criarItemEventoComemorativo(eventosDia.comemorativo));
    }

    eventosDia.usuario.forEach((evento, index) => {
        eventsListDiv.appendChild(criarItemEventoUsuario(evento, index));
    });
}

function criarIconeEvento(path) {
    const wrap = document.createElement('div');
    wrap.className = 'event-icon';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + path + '"/></svg>';
    return wrap;
}

function criarItemEventoComemorativo(ev) {
    const item = document.createElement('div');
    item.className = 'event-item comemorativo';
    item.appendChild(criarIconeEvento('M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'));

    const details = document.createElement('div');
    details.className = 'event-details';
    const title = document.createElement('div');
    title.className = 'event-title';
    title.textContent = ev.titulo;
    const time = document.createElement('div');
    time.className = 'event-time';
    time.textContent = ev.descricao;
    details.appendChild(title);
    details.appendChild(time);

    const badge = document.createElement('span');
    badge.className = 'comemorativo-badge';
    badge.textContent = 'Feriado';

    item.appendChild(details);
    item.appendChild(badge);
    return item;
}

function criarItemEventoUsuario(evento, index) {
    const item = document.createElement('div');
    item.className = 'event-item';
    item.appendChild(criarIconeEvento('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'));

    const details = document.createElement('div');
    details.className = 'event-details';
    const title = document.createElement('div');
    title.className = 'event-title';
    title.textContent = evento.titulo;
    const time = document.createElement('div');
    time.className = 'event-time';
    time.textContent = evento.hora + (evento.periodo ? ' - ' + evento.periodo : '');
    details.appendChild(title);
    details.appendChild(time);

    const btn = document.createElement('button');
    btn.className = 'delete-event-btn';
    btn.type = 'button';
    btn.dataset.index = String(index);
    btn.setAttribute('aria-label', 'Remover atividade ' + evento.titulo);
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    btn.appendChild(document.createTextNode('Remover'));
    btn.addEventListener('click', () => confirmarExclusao(index));

    item.appendChild(details);
    item.appendChild(btn);
    return item;
}

function mudarMes(delta) {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    dataAtual = new Date(ano, mes + delta, 1);
    const diaAtual = dataSelecionada.getDate();
    const diasNoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).getDate();
    const diaSeguro = Math.min(diaAtual, diasNoMes);
    dataSelecionada = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), diaSeguro);
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
    document.getElementById('deleteModalOverlay').dataset.index = index;
    document.getElementById('deleteModalOverlay').dataset.dataStr = dataStr;
    document.getElementById('deleteEventTitle').textContent = evento.titulo;
    document.getElementById('deleteEventTime').textContent = evento.hora;
}

function fecharModalExclusao() {
    document.getElementById('deleteModalOverlay').classList.remove('active');
    delete document.getElementById('deleteModalOverlay').dataset.index;
    delete document.getElementById('deleteModalOverlay').dataset.dataStr;
}

function removerEvento() {
    const overlay = document.getElementById('deleteModalOverlay');
    const index = parseInt(overlay.dataset.index);
    const dataStr = overlay.dataset.dataStr;

    if (isNaN(index) || !dataStr) return;

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
