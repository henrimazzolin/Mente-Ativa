document.addEventListener('DOMContentLoaded', function() {
        const bancoCores = [
            { cor: '#E53935', nome: 'Vermelho', texto: '#FFFFFF' },
            { cor: '#1E88E5', nome: 'Azul', texto: '#FFFFFF' },
            { cor: '#43A047', nome: 'Verde', texto: '#FFFFFF' },
            { cor: '#FDD835', nome: 'Amarelo', texto: '#000000' },
            { cor: '#8E24AA', nome: 'Roxo', texto: '#FFFFFF' },
            { cor: '#FB8C00', nome: 'Laranja', texto: '#000000' },
            { cor: '#F06292', nome: 'Rosa', texto: '#FFFFFF' },
            { cor: '#00ACC1', nome: 'Azul Claro', texto: '#FFFFFF' },
            { cor: '#6D4C41', nome: 'Marrom', texto: '#FFFFFF' },
            { cor: '#546E7A', nome: 'Cinza', texto: '#FFFFFF' },
            { cor: '#00897B', nome: 'Verde Água', texto: '#FFFFFF' },
            { cor: '#5E35B1', nome: 'Índigo', texto: '#FFFFFF' },
            { cor: '#D81B60', nome: 'Rosa Escuro', texto: '#FFFFFF' },
            { cor: '#FFB300', nome: 'Âmbar', texto: '#000000' },
            { cor: '#7CB342', nome: 'Verde Limão', texto: '#000000' },
            { cor: '#039BE5', nome: 'Azul Céu', texto: '#FFFFFF' },
            { cor: '#FF7043', nome: 'Coral', texto: '#FFFFFF' },
            { cor: '#8D6E63', nome: 'Caramelo', texto: '#FFFFFF' },
            { cor: '#78909C', nome: 'Cinza Azulado', texto: '#FFFFFF' },
            { cor: '#A1887F', nome: 'Bege', texto: '#000000' }
        ];

        let questaoAtual = 0;
        let acertos = 0;
        let coresDaRodada = [];
        let jogoFinalizado = false;

        function embaralhar(array) {
            const novo = [...array];
            for (let i = novo.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [novo[i], novo[j]] = [novo[j], novo[i]];
            }
            return novo;
        }

        function iniciarJogo() {
            coresDaRodada = embaralhar(bancoCores).slice(0, 5);
            questaoAtual = 0;
            acertos = 0;
            jogoFinalizado = false;
            document.getElementById('acertos').textContent = '0';
            document.getElementById('questao').textContent = '1/5';
            document.getElementById('nextBtn').classList.remove('show');
            carregarQuestao();
        }

        function carregarQuestao() {
            const item = coresDaRodada[questaoAtual];
            const circle = document.getElementById('colorCircle');
            circle.style.backgroundColor = item.cor;
            
            const container = document.getElementById('optionsContainer');
            container.innerHTML = '';
            
            const outrasCores = bancoCores
                .filter(c => c.nome !== item.nome)
                .sort(() => Math.random() - 0.5)
                .slice(0, 1);
            
            const opcoes = embaralhar([item, ...outrasCores]);
            
            opcoes.forEach(opcao => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opcao.nome;
                btn.style.borderColor = opcao.cor;
                btn.style.color = opcao.cor;
                btn.style.backgroundColor = opcao.cor + '20';
                btn.addEventListener('click', function() { verificarResposta(opcao.nome, opcao.cor, this); });
                container.appendChild(btn);
            });
        }

        function verificarResposta(resposta, corResposta, botao) {
            const correta = coresDaRodada[questaoAtual].nome;
            const corretaCor = coresDaRodada[questaoAtual].cor;
            const botoes = document.querySelectorAll('.option-btn');
            
            botoes.forEach(b => b.disabled = true);
            
            if (resposta === correta) {
                botao.classList.add('correct');
                botao.style.backgroundColor = corretaCor;
                botao.style.color = coresDaRodada[questaoAtual].texto;
                acertos++;
                document.getElementById('acertos').textContent = acertos;
                mostrarFeedback(true);
            } else {
                botao.classList.add('wrong');
                botoes.forEach(b => {
                    if (b.textContent === correta) {
                        b.classList.add('correct');
                        b.style.backgroundColor = corretaCor;
                        b.style.color = coresDaRodada[questaoAtual].texto;
                    }
                });
                mostrarFeedback(false);
            }
            
            if (questaoAtual < 4) {
                document.getElementById('nextBtn').classList.add('show');
            } else {
                setTimeout(mostrarResultadoFinal, 1200);
            }
        }

        function proximaQuestao() {
            questaoAtual++;
            document.getElementById('questao').textContent = (questaoAtual + 1) + '/5';
            document.getElementById('nextBtn').classList.remove('show');
            carregarQuestao();
        }

        function mostrarFeedback(acertou) {
            const overlay = document.getElementById('feedbackOverlay');
            const icon = document.getElementById('feedbackIcon');
            const title = document.getElementById('feedbackTitle');
            const subtitle = document.getElementById('feedbackSubtitle');
            
            if (acertou) {
                icon.className = 'feedback-icon success';
                icon.textContent = '✅';
                title.textContent = 'Muito bem!';
                subtitle.textContent = 'Você acertou!';
            } else {
                icon.className = 'feedback-icon error';
                icon.textContent = '❌';
                title.textContent = 'Tente outra vez';
                subtitle.textContent = 'A cor era: ' + coresDaRodada[questaoAtual].nome;
            }
            
            overlay.classList.add('show');
        }

        function fecharFeedback() {
            document.getElementById('feedbackOverlay').classList.remove('show');
            
            if (questaoAtual === 4 && !jogoFinalizado) {
                mostrarResultadoFinal();
            }
        }

        function mostrarResultadoFinal() {
            jogoFinalizado = true;
            const overlay = document.getElementById('feedbackOverlay');
            const icon = document.getElementById('feedbackIcon');
            const title = document.getElementById('feedbackTitle');
            const subtitle = document.getElementById('feedbackSubtitle');
            const btn = document.getElementById('feedbackBtn');
            
            icon.className = 'feedback-icon success';
            icon.textContent = '🏆';
            
            if (acertos === 5) {
                title.textContent = 'Perfeito!';
                subtitle.textContent = 'Você acertou todas as 5 questões!';
            } else if (acertos >= 3) {
                title.textContent = 'Muito bem!';
                subtitle.textContent = 'Você acertou ' + acertos + ' de 5 questões!';
            } else {
                title.textContent = 'Parabéns!';
                subtitle.textContent = 'Você acertou ' + acertos + ' de 5 questões!';
            }
            
            btn.textContent = 'Jogar Novamente';
            btn.onclick = function() {
                overlay.classList.remove('show');
                iniciarJogo();
            };
            
            overlay.classList.add('show');
        }

        // Event listeners
        document.getElementById('btn-back').addEventListener('click', function() { location.href = 'grupo-simples.html'; });
        document.getElementById('nextBtn').addEventListener('click', proximaQuestao);
        document.getElementById('feedbackBtn').addEventListener('click', fecharFeedback);

        iniciarJogo();
});