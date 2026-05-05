document.addEventListener('DOMContentLoaded', function() {
        const bancoItens = [
            { emoji: '🐱', nome: 'Gato' },
            { emoji: '🐶', nome: 'Cachorro' },
            { emoji: '🍎', nome: 'Maçã' },
            { emoji: '🚗', nome: 'Carro' },
            { emoji: '🌸', nome: 'Flor' },
            { emoji: '☀️', nome: 'Sol' },
            { emoji: '🐦', nome: 'Pássaro' },
            { emoji: '🍌', nome: 'Banana' },
            { emoji: '🏀', nome: 'Bola' },
            { emoji: '📱', nome: 'Celular' },
            { emoji: '⌚', nome: 'Relógio' },
            { emoji: '🎸', nome: 'Guitarra' },
            { emoji: '🌳', nome: 'Árvore' },
            { emoji: '🐰', nome: 'Coelho' },
            { emoji: '🦊', nome: 'Raposa' },
            { emoji: '🍕', nome: 'Pizza' },
            { emoji: '🎂', nome: 'Bolo' },
            { emoji: '☕', nome: 'Café' },
            { emoji: '🎈', nome: 'Balão' },
            { emoji: '❤️', nome: 'Coração' }
        ];

        let paresAtuais = [];
        let selecionadoEsquerda = null;
        let acertos = 0;
        let matchedPairs = [];

        function embaralhar(array) {
            const novo = [...array];
            for (let i = novo.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [novo[i], novo[j]] = [novo[j], novo[i]];
            }
            return novo;
        }

        function iniciarJogo() {
            paresAtuais = embaralhar(bancoItens).slice(0, 3);
            acertos = 0;
            matchedPairs = [];
            selecionadoEsquerda = null;
            
            document.getElementById('acertos').textContent = '0';
            document.getElementById('falta').textContent = '3';
            
            renderizarColunas();
        }

        function renderizarColunas() {
            const leftColumn = document.getElementById('leftColumn');
            const rightColumn = document.getElementById('rightColumn');
            
            leftColumn.innerHTML = '<p class="column-title">Toque primeiro aqui</p>';
            rightColumn.innerHTML = '<p class="column-title">Depois toque aqui</p>';
            
            const paresEmbaralhados = embaralhar([...paresAtuais]);
            
            paresAtuais.forEach((par, index) => {
                const leftItem = document.createElement('div');
                leftItem.className = 'emoji-item';
                leftItem.textContent = par.emoji;
                leftItem.dataset.nome = par.nome;
                leftItem.dataset.index = index;
                leftItem.addEventListener('click', () => selecionarEsquerda(leftItem));
                leftColumn.appendChild(leftItem);
            });
            
            paresEmbaralhados.forEach((par, index) => {
                const rightItem = document.createElement('div');
                rightItem.className = 'emoji-item';
                rightItem.textContent = par.emoji;
                rightItem.dataset.nome = par.nome;
                rightItem.dataset.index = index;
                rightItem.addEventListener('click', () => selecionarDireita(rightItem));
                rightColumn.appendChild(rightItem);
            });
        }

        function selecionarEsquerda(item) {
            if (item.classList.contains('matched')) return;
            
            document.querySelectorAll('.emoji-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            selecionadoEsquerda = item;
        }

        function selecionarDireita(item) {
            if (!selecionadoEsquerda) {
                mostrarFeedback(false, 'Atenção!', 'Primeiro toque uma imagem da esquerda');
                return;
            }
            
            if (item.classList.contains('matched')) return;
            
            const nomeEsquerda = selecionadoEsquerda.dataset.nome;
            const nomeDireita = item.dataset.nome;
            
            if (nomeEsquerda === nomeDireita) {
                selecionadoEsquerda.classList.remove('selected');
                selecionadoEsquerda.classList.add('matched');
                item.classList.add('matched');
                
                acertos++;
                document.getElementById('acertos').textContent = acertos;
                document.getElementById('falta').textContent = 3 - acertos;
                
                selecionadoEsquerda = null;
                
                if (acertos === 3) {
                    setTimeout(() => {
                        mostrarFeedback(true, 'Muito bem!', 'Você completou todas as ligações!');
                    }, 300);
                }
            } else {
                item.classList.add('wrong');
                setTimeout(() => {
                    item.classList.remove('wrong');
                }, 500);
                
                mostrarFeedback(false, 'Tente novamente!', 'Essas imagens são diferentes');
            }
        }

        function mostrarFeedback(acertou, titulo, subtitulo) {
            const overlay = document.getElementById('feedbackOverlay');
            const icon = document.getElementById('feedbackIcon');
            const title = document.getElementById('feedbackTitle');
            const subtitle = document.getElementById('feedbackSubtitle');
            
            icon.className = 'feedback-icon ' + (acertou ? 'success' : 'error');
            icon.textContent = acertou ? '✅' : '❌';
            title.textContent = titulo;
            subtitle.textContent = subtitulo;
            
            overlay.classList.add('show');
        }

        function fecharFeedback() {
            document.getElementById('feedbackOverlay').classList.remove('show');
        }

        // Event listeners
        document.getElementById('btn-back').addEventListener('click', function() { location.href = 'grupo-simples.html'; });
        document.getElementById('btn-restart').addEventListener('click', iniciarJogo);
        document.getElementById('feedbackBtn').addEventListener('click', fecharFeedback);

        iniciarJogo();
});