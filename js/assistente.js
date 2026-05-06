document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const speakLastBtn = document.getElementById('speakLastBtn');

    let speechSynthesis = window.speechSynthesis;
    let lastAssistantMessage = '';
    let isSpeaking = false;

    function falar(texto) {
        if (!texto) return;
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = function() { isSpeaking = true; };
        utterance.onend = function() { isSpeaking = false; };
        utterance.onerror = function() { isSpeaking = false; };
        speechSynthesis.speak(utterance);
    }

    function pararFala() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        }
    }

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        const avatar = isUser ? '👤' : '🤖';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (!isUser) {
            lastAssistantMessage = content;
        }
    }

    function showTyping() {
        hideTyping();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function sendQuestion() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';
        sendBtn.disabled = true;
        userInput.disabled = true;
        showTyping();

    try {
            // Detecta automaticamente se está em localhost ou em produção
            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/chat' 
                : '/api/chat';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            hideTyping();

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.reply) {
                addMessage(data.reply, false);
                falar(data.reply);
            } else {
                addMessage('Resposta invalida do servidor. Tente novamente.', false);
            }

        } catch (error) {
            hideTyping();
            console.error('Erro:', error);
            let errorMsg = 'Desculpe, nao consegui responder agora. ';
            if (error.message.includes('Failed to fetch')) {
                errorMsg += 'Verifique se o servidor esta rodando (npm start).';
            } else {
                errorMsg += 'Tente novamente em alguns instantes.';
            }
            addMessage(errorMsg, false);
        }

        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }

    function clearChat() {
        pararFala();
        chatMessages.innerHTML = '';
        addMessage('Ola! Eu sou o assistente virtual do Mente Ativa. Posso ajudar voce com duvidas sobre o site, jogos, exercicios e muito mais. Digite sua pergunta abaixo!', false);
        lastAssistantMessage = '';
    }

    function speakLastMessage() {
        if (lastAssistantMessage) {
            falar(lastAssistantMessage);
        } else {
            const messages = chatMessages.querySelectorAll('.message.assistant');
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                const text = lastMsg.querySelector('p').textContent;
                lastAssistantMessage = text;
                falar(text);
            }
        }
    }

    sendBtn.addEventListener('click', sendQuestion);
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });
    clearBtn.addEventListener('click', clearChat);
    speakLastBtn.addEventListener('click', speakLastMessage);

    document.querySelectorAll('.help-box li').forEach(function(li) {
        li.addEventListener('click', function() {
            userInput.value = this.textContent;
            sendQuestion();
        });
    });

    userInput.focus();
});
