document.addEventListener('DOMContentLoaded', function() {
        const bancoItens = [
            { emoji: '🐱', correta: 'Gato', errada: 'Bola' },
            { emoji: '🐶', correta: 'Cachorro', errada: 'Sapato' },
            { emoji: '🐰', correta: 'Coelho', errada: 'Mesa' },
            { emoji: '🐦', correta: 'Pássaro', errada: 'Cama' },
            { emoji: '🐝', correta: 'Abelha', errada: 'Porta' },
            { emoji: '🐹', correta: 'Hamster', errada: 'Janela' },
            { emoji: '🦊', correta: 'Raposa', errada: 'Fogo' },
            { emoji: '🐸', correta: 'Sapo', errada: 'Cofre' },
            { emoji: '🐷', correta: 'Porco', errada: 'Chapéu' },
            { emoji: '🐻', correta: 'Urso', errada: 'Armário' },
            { emoji: '🍎', correta: 'Maçã', errada: 'Carro' },
            { emoji: '🍌', correta: 'Banana', errada: 'Televisão' },
            { emoji: '🍊', correta: 'Laranja', errada: 'Cachorro' },
            { emoji: '🍋', correta: 'Limão', errada: 'Relógio' },
            { emoji: '🍓', correta: 'Morango', errada: 'Gato' },
            { emoji: '🍇', correta: 'Uva', errada: 'Bicicleta' },
            { emoji: '🍉', correta: 'Melancia', errada: 'Cadeira' },
            { emoji: '🍑', correta: 'Pêssego', errada: 'Borracha' },
            { emoji: '🍒', correta: 'Cereja', errada: 'Lâmpada' },
            { emoji: '🥝', correta: 'Kiwi', errada: 'Espelho' },
            { emoji: '🌸', correta: 'Flor', errada: 'Forno' },
            { emoji: '🌺', correta: 'Flor', errada: 'Travesseiro' },
            { emoji: '🌻', correta: 'Girassol', errada: 'Panela' },
            { emoji: '🌳', correta: 'Árvore', errada: 'Xícara' },
            { emoji: '🌴', correta: 'Palmeira', errada: 'Uva' },
            { emoji: '☀️', correta: 'Sol', errada: 'Abóbora' },
            { emoji: '🌙', correta: 'Lua', errada: 'Sapato' },
            { emoji: '⭐', correta: 'Estrela', errada: 'Cofre' },
            { emoji: '🌈', correta: 'Arco-íris', errada: 'Mala' },
            { emoji: '🌊', correta: 'Onda', errada: 'Camisa' },
            { emoji: '🏔️', correta: 'Montanha', errada: 'Biscoito' },
            { emoji: '🏖️', correta: 'Praia', errada: 'Fone' },
            { emoji: '🚗', correta: 'Carro', errada: 'Pássaro' },
            { emoji: '🚲', correta: 'Bicicleta', errada: 'Maçã' },
            { emoji: '✈️', correta: 'Avião', errada: 'Cenoura' },
            { emoji: '🚀', correta: 'Foguete', errada: 'Telefone' },
            { emoji: '⛵', correta: 'Barco', errada: 'Abacaxi' },
            { emoji: '🚢', correta: 'Navio', errada: 'Chuveiro' },
            { emoji: '🕶️', correta: 'Óculos', errada: 'Sandália' },
            { emoji: '⌚', correta: 'Relógio', errada: 'Caminhão' },
            { emoji: '🎧', correta: 'Fone', errada: 'Calculadora' },
            { emoji: '📱', correta: 'Celular', errada: 'Bola' },
            { emoji: '💻', correta: 'Computador', errada: 'Morango' },
            { emoji: '📷', correta: 'Câmera', errada: 'Vela' },
            { emoji: '🎩', correta: 'Chapéu', errada: 'Cachorro' },
            { emoji: '👟', correta: 'Tênis', errada: 'Lápis' },
            { emoji: '👜', correta: 'Bolsa', errada: 'Pneu' },
            { emoji: '💼', correta: 'Maleta', errada: 'Televisão' },
            { emoji: '🛏️', correta: 'Cama', errada: 'Girafa' },
            { emoji: '🪑', correta: 'Cadeira', errada: 'Café' },
            { emoji: '🍕', correta: 'Pizza', errada: 'Maçã' },
            { emoji: '🍔', correta: 'Hambúrguer', errada: 'Relógio' },
            { emoji: '🍦', correta: 'Sorvete', errada: 'Chapéu' },
            { emoji: '🎂', correta: 'Bolo', errada: 'Fone' },
            { emoji: '🍪', correta: 'Biscoito', errada: 'Janela' },
            { emoji: '☕', correta: 'Café', errada: 'Borracha' },
            { emoji: '🫖', correta: 'Chá', errada: 'Carro' },
            { emoji: '🥛', correta: 'Leite', errada: 'Sapato' },
            { emoji: '🍷', correta: 'Vinho', errada: 'Lâmpada' },
            { emoji: '🎸', correta: 'Guitarra', errada: 'Mesa' },
            { emoji: '🎹', correta: 'Teclado', errada: 'Porta' },
            { emoji: '🎨', correta: 'Tinta', errada: 'Cama' },
            { emoji: '📚', correta: 'Livro', errada: 'Cofre' },
            { emoji: '✏️', correta: 'Lápis', errada: 'Armário' },
            { emoji: '🔑', correta: 'Chave', errada: 'Bola' },
            { emoji: '🔔', correta: 'Sino', errada: 'Travesseiro' },
            { emoji: '💡', correta: 'Lâmpada', errada: 'Pássaro' },
            { emoji: '🕯️', correta: 'Vela', errada: 'Cachorro' },
            { emoji: '❤️', correta: 'Coração', errada: 'Xícara' },
            { emoji: '🎁', correta: 'Presente', errada: 'Gato' },
            { emoji: '🎈', correta: 'Balão', errada: 'Panela' },
            { emoji: '⚽', correta: 'Bola', errada: 'Forno' },
            { emoji: '🏀', correta: 'Bola', errada: 'Borracha' },
            { emoji: '🎯', correta: 'Alvo', errada: 'Abóbora' },
            { emoji: '🧲', correta: 'Imã', errada: 'Televisão' },
            { emoji: '🦁', correta: 'Leão', errada: 'Maçã' },
            { emoji: '🐘', correta: 'Elefante', errada: 'Bicicleta' },
            { emoji: '🦒', correta: 'Girafa', errada: 'Cofre' },
            { emoji: '🐬', correta: 'Golfinho', errada: 'Espelho' },
            { emoji: '🦋', correta: 'Borboleta', errada: 'Relógio' },
            { emoji: '🐢', correta: 'Tartaruga', errada: 'Chapéu' },
            { emoji: '🐔', correta: 'Galinha', errada: 'Cama' },
            { emoji: '🐴', correta: 'Cavalo', errada: 'Porta' },
            { emoji: '🦆', correta: 'Pato', errada: 'Janela' }
        ];

        let questaoAtual = 0;
        let acertos = 0;
        let itensDaRodada = [];
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
            itensDaRodada = embaralhar(bancoItens).slice(0, 5);
            questaoAtual = 0;
            acertos = 0;
            jogoFinalizado = false;
            document.getElementById('acertos').textContent = '0';
            document.getElementById('questao').textContent = '1/5';
            document.getElementById('nextBtn').classList.remove('show');
            carregarQuestao();
        }

        function carregarQuestao() {
            const item = itensDaRodada[questaoAtual];
            document.getElementById('mainEmoji').textContent = item.emoji;
            
            const container = document.getElementById('optionsContainer');
            container.innerHTML = '';
            
            const opcoes = embaralhar([item.correta, item.errada]);
            
            opcoes.forEach(opcao => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opcao;
                btn.addEventListener('click', function() { verificarResposta(opcao, this); });
                container.appendChild(btn);
            });
        }

        function verificarResposta(resposta, botao) {
            const correta = itensDaRodada[questaoAtual].correta;
            const botoes = document.querySelectorAll('.option-btn');
            
            botoes.forEach(b => b.disabled = true);
            
            if (resposta === correta) {
                botao.classList.add('correct');
                acertos++;
                document.getElementById('acertos').textContent = acertos;
                mostrarFeedback(true);
            } else {
                botao.classList.add('wrong');
                botoes.forEach(b => {
                    if (b.textContent === correta) {
                        b.classList.add('correct');
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
                subtitle.textContent = 'A resposta era: ' + itensDaRodada[questaoAtual].correta;
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