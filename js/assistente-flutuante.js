var FAQ = [
    {
        pergunta: 'O que é o Mente Ativa?',
        resposta: 'O <strong>Mente Ativa</strong> é um site feito especialmente para idosos que querem exercitar a mente e o corpo. Aqui você encontra <strong>jogos educativos</strong> (memória, palavras cruzadas, quebra-cabeça e muito mais), <strong>exercícios físicos</strong> com vídeos explicativos, <strong>dicas de saúde e alimentação</strong>, <strong>dicas de segurança digital</strong> e um <strong>calendário</strong> para organizar sua rotina. Tudo em um ambiente simples, acolhedor e fácil de usar.'
    },
    {
        pergunta: 'Como jogar o Jogo da Memória?',
        resposta: 'O <strong>Jogo da Memória</strong> funciona assim: você vê várias cartas viradas para baixo. Clique em uma carta para virá-la e veja a figura. Depois clique em outra carta. Se as duas figuras forem iguais, você forma um <strong>par</strong> e elas permanecem viradas. Se forem diferentes, elas viram de volta. O objetivo é encontrar <strong>todos os pares</strong> com o menor número de tentativas possível. Quanto menos tentativas, melhor sua pontuação!'
    },
    {
        pergunta: 'Como usar o Calendário?',
        resposta: 'No <strong>Calendário</strong> você pode organizar seus compromissos e tarefas do dia a dia. Clique em uma data para adicionar um lembrete. Você pode colocar o <strong>título</strong>, a <strong>descrição</strong> e o <strong>horário</strong> do compromisso. Os lembretes ficam salvos e você pode visualizar todos os dias do mês. É uma ótima forma de não esquecer consultas, aniversários e afazeres importantes!'
    },
    {
        pergunta: 'Quais exercícios físicos estão disponíveis?',
        resposta: 'Temos <strong>exercícios simples e seguros</strong> para idosos, como: alongamento de braços, elevação de pernas, rotação de ombros, exercícios de respiração, equilíbrio e mobilidade. Cada exercício tem um <strong>vídeo explicativo</strong> mostrando como fazer corretamente. Lembre-se: respeite os limites do seu corpo e não force além do necessário. Consulte um médico antes de começar qualquer atividade física.'
    },
    {
        pergunta: 'Como me proteger de golpes na internet?',
        resposta: 'Para se proteger de golpes: <br><br>1) <strong>Nunca compartilhe suas senhas</strong> com ninguém. Nenhum banco ou empresa pede senhas por telefone ou mensagem.<br><br>2) <strong>Não clique em links suspeitos</strong> recebidos por mensagem ou e-mail.<br><br>3) <strong>Desconfie de prêmios</strong> ou ofertas boas demais para ser verdade.<br><br>4) <strong>Não atenda ligações</strong> pedindo dados bancários ou informações pessoais.<br><br>5) <strong>Sempre verifique</strong> antes de fazer qualquer pagamento.'
    },
    {
        pergunta: 'O site tem dicas de alimentação saudável?',
        resposta: 'Sim! Na seção <strong>"Saúde e Bem-estar"</strong> você encontra dicas de alimentação saudável com sugestões de alimentos bons para a <strong>memória</strong> (como peixes, castanhas e frutas vermelhas), dicas de <strong>hidratação</strong>, <strong>receitas simples</strong> e orientações gerais para manter uma vida equilibrada. São informações úteis para o dia a dia, sempre explicadas de forma clara e prática.'
    },
    {
        pergunta: 'Como funciona o jogo de palavras cruzadas?',
        resposta: 'No <strong>jogo de palavras cruzadas</strong>, você recebe dicas (perguntas) e precisa preencher as palavras nos espaços em branco. Clique em uma palavra para selecioná-la e digite a resposta. As letras vão se encaixando. Você pode usar as <strong>dicas</strong> para descobrir cada palavra. É um ótimo exercício para manter o raciocínio e o vocabulário ativos!'
    },
    {
        pergunta: 'Como voltar para o menu principal?',
        resposta: 'Em todas as páginas do site, você encontra uma <strong>seta de voltar</strong> (←) no canto superior esquerdo. Clique nela para voltar à página anterior. Se quiser ir direto para o menu principal, continue clicando na seta até chegar lá. Você também pode acessar o menu principal pelo <strong>botão de acessibilidade</strong> no canto superior direito da tela.'
    },
    {
        pergunta: 'O que significa "Usar sozinho" e "Usar com ajuda"?',
        resposta: 'Na página inicial, você pode escolher entre duas opções: <br><br><strong>"Usar sozinho"</strong> — para navegar pelo site por conta própria, no seu ritmo.<br><br><strong>"Usar com ajuda"</strong> — ideal se você prefere que um familiar, cuidador ou amigo acompanhe e auxilie durante o uso do site.<br><br>As duas opções dão acesso ao mesmo conteúdo, mudando apenas a experiência de navegação.'
    },
    {
        pergunta: 'Como jogar o Jogo da Associação?',
        resposta: 'No <strong>Jogo da Associação</strong>, você precisa ligar figuras que combinam entre si. Por exemplo, ligar uma imagem de "sol" com "praia" ou "chave" com "porta". Clique em um item e depois no outro para fazer a ligação. O jogo ajuda a exercitar o <strong>raciocínio lógico</strong> e a <strong>memória</strong> de forma divertida.'
    }
];

document.addEventListener('DOMContentLoaded', function () {

    var faqHTML = '';
    for (var i = 0; i < FAQ.length; i++) {
        faqHTML += '<li class="faq-item" data-index="' + i + '">' +
            '<span class="faq-icon">?</span>' +
            '<span class="faq-text">' + FAQ[i].pergunta + '</span>' +
            '<span class="faq-arrow">›</span>' +
            '</li>';
    }

    var assistenteHTML = `
        <div class="assistente-overlay" id="assistenteOverlay">
            <div class="assistente-sidebar">
                <div class="assistente-sidebar-header">
                    <h2>Tirar Dúvidas</h2>
                    <button class="assistente-sidebar-close" id="assistenteCloseBtn" aria-label="Fechar assistente">&times;</button>
                </div>
                <div class="faq-header">
                    <p>Clique em uma pergunta para ver a resposta</p>
                </div>
                <div class="faq-list">
                    <ul>` + faqHTML + `</ul>
                </div>
            </div>
        </div>
        <div class="faq-modal-overlay" id="faqModalOverlay">
            <div class="faq-modal">
                <button class="faq-modal-close" id="faqModalClose" aria-label="Fechar">&times;</button>
                <div class="faq-modal-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>
                <h3 class="faq-modal-title" id="faqModalTitle"></h3>
                <div class="faq-modal-body" id="faqModalBody"></div>
                <button class="faq-modal-btn" id="faqModalBtn">Entendi</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', assistenteHTML);

    var overlay = document.getElementById('assistenteOverlay');
    var closeBtn = document.getElementById('assistenteCloseBtn');
    var modalOverlay = document.getElementById('faqModalOverlay');
    var modalClose = document.getElementById('faqModalClose');
    var modalTitle = document.getElementById('faqModalTitle');
    var modalBody = document.getElementById('faqModalBody');
    var modalBtn = document.getElementById('faqModalBtn');

    function openAssistente() {
        overlay.classList.add('open');
        document.body.classList.add('assistente-aberto');
    }

    function closeAssistente() {
        overlay.classList.remove('open');
        document.body.classList.remove('assistente-aberto');
    }

    function openModal(index) {
        var item = FAQ[index];
        if (!item) return;
        modalTitle.textContent = item.pergunta;
        modalBody.innerHTML = item.resposta;
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeAssistente);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeAssistente();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('open')) {
                closeModal();
            } else {
                closeAssistente();
            }
        }
    });

    document.addEventListener('mente-ativa-abrir-assistente', function () {
        if (overlay.classList.contains('open')) {
            closeAssistente();
        } else {
            openAssistente();
        }
    });

    modalClose.addEventListener('click', closeModal);
    modalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });

    var faqItems = document.querySelectorAll('.faq-item');
    for (var j = 0; j < faqItems.length; j++) {
        faqItems[j].addEventListener('click', function () {
            var index = parseInt(this.getAttribute('data-index'), 10);
            openModal(index);
        });
    }

});
