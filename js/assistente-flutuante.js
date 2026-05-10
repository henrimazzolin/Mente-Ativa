document.addEventListener('DOMContentLoaded', function () {

    var assistenteHTML = `
        <div class="assistente-overlay" id="assistenteOverlay">
            <div class="assistente-sidebar">
                <div class="assistente-sidebar-header">
                    <h2>Tirar Dúvidas</h2>
                    <button class="assistente-sidebar-close" id="assistenteCloseBtn" aria-label="Fechar assistente" style="width:48px;height:48px;border:none;border-radius:12px;background:#EF4444;color:#fff;font-size:32px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;" onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">&times;</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant">
                        <div class="message-avatar" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:linear-gradient(135deg,#0B6477,#0AD1C8);">🤖</div>
                        <div class="message-content" style="max-width:80%;padding:12px 16px;border-radius:16px;line-height:1.5;background:#fff;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                            <p style="font-size:18px;word-wrap:break-word;margin:0;">Olá! Eu sou o assistente virtual do Mente Ativa. Posso ajudar você com dúvidas sobre o site, jogos, exercícios e muito mais. Digite sua pergunta abaixo!</p>
                        </div>
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="userInput" placeholder="Digite sua pergunta aqui..." autocomplete="off">
                    <button id="sendBtn" class="send-btn">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
                <div class="chat-actions">
                    <button id="clearBtn" class="action-btn">Limpar Chat</button>
                    <button id="speakLastBtn" class="action-btn">Ler Mensagem</button>
                </div>
                <div class="help-box">
                    <h3>Exemplos de perguntas:</h3>
                    <ul>
                        <li>Como funciona o jogo da memória?</li>
                        <li>Quais são os exercícios físicos disponíveis?</li>
                        <li>Como me proteger de golpes na internet?</li>
                        <li>Como usar o calendário?</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', assistenteHTML);

    var chatMessages = document.getElementById('chatMessages');
    var userInput = document.getElementById('userInput');
    var sendBtn = document.getElementById('sendBtn');
    var clearBtn = document.getElementById('clearBtn');
    var speakLastBtn = document.getElementById('speakLastBtn');
    var overlay = document.getElementById('assistenteOverlay');
    var closeBtn = document.getElementById('assistenteCloseBtn');

    var speechSynthesis = window.speechSynthesis;
    var lastAssistantMessage = '';
    var isSpeaking = false;

    function falar(texto) {
        if (!texto) return;
        if (speechSynthesis.speaking) speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = function () { isSpeaking = true; };
        utterance.onend = function () { isSpeaking = false; };
        utterance.onerror = function () { isSpeaking = false; };
        speechSynthesis.speak(utterance);
    }

    function pararFala() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        }
    }

    function addMessage(content, isUser) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (isUser ? 'user' : 'assistant');
        messageDiv.style.cssText = 'display:flex;gap:10px;margin-bottom:14px;animation:fadeIn 0.3s ease;';
        if (isUser) messageDiv.style.flexDirection = 'row-reverse';

        var avatar = document.createElement('div');
        avatar.style.cssText = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;' + (isUser ? 'background:#3B82F6;' : 'background:linear-gradient(135deg,#0B6477,#0AD1C8);');
        avatar.textContent = isUser ? '👤' : '🤖';

        var contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.style.cssText = 'max-width:80%;padding:12px 16px;border-radius:16px;line-height:1.5;' + (isUser ? 'background:#3B82F6;color:#fff;border-bottom-right-radius:4px;' : 'background:#fff;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.08);');

        var p = document.createElement('p');
        p.style.cssText = 'font-size:18px;word-wrap:break-word;margin:0;';
        if (isUser) p.style.color = '#fff';
        p.textContent = content;
        contentDiv.appendChild(p);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (!isUser) lastAssistantMessage = content;
    }

    function showTyping() {
        hideTyping();
        var typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typingIndicator';
        typingDiv.style.cssText = 'display:flex;gap:10px;margin-bottom:14px;';

        var avatar = document.createElement('div');
        avatar.style.cssText = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:linear-gradient(135deg,#0B6477,#0AD1C8);';
        avatar.textContent = '🤖';

        var contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'max-width:80%;padding:14px 18px;border-radius:16px;background:#fff;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.08);';

        var dots = document.createElement('div');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        contentDiv.appendChild(dots);

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(contentDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    async function sendQuestion() {
        var message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';
        sendBtn.disabled = true;
        userInput.disabled = true;
        showTyping();

        try {
            var apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:3000/chat'
                : '/api/chat';

            var response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            hideTyping();

            if (!response.ok) throw new Error('Erro HTTP: ' + response.status);

            var data = await response.json();

            if (data.reply) {
                addMessage(data.reply, false);
                falar(data.reply);
            } else {
                addMessage('Resposta invalida do servidor. Tente novamente.', false);
            }
        } catch (error) {
            hideTyping();
            console.error('Erro:', error);
            var errorMsg = 'Desculpe, nao consegui responder agora. ';
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
            var messages = chatMessages.querySelectorAll('.message.assistant');
            if (messages.length > 0) {
                var lastMsg = messages[messages.length - 1];
                var text = lastMsg.querySelector('p').textContent;
                lastAssistantMessage = text;
                falar(text);
            }
        }
    }

    function openAssistente() {
        overlay.classList.add('open');
        document.body.classList.add('assistente-aberto');
        setTimeout(function () { userInput.focus(); }, 400);
    }

    function closeAssistente() {
        overlay.classList.remove('open');
        document.body.classList.remove('assistente-aberto');
        pararFala();
    }

    closeBtn.addEventListener('click', closeAssistente);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeAssistente();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAssistente();
    });

    document.addEventListener('mente-ativa-abrir-assistente', function () {
        if (overlay.classList.contains('open')) {
            closeAssistente();
        } else {
            openAssistente();
        }
    });

    sendBtn.addEventListener('click', sendQuestion);
    userInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });
    clearBtn.addEventListener('click', clearChat);
    speakLastBtn.addEventListener('click', speakLastMessage);

    document.querySelectorAll('.help-box li').forEach(function (li) {
        li.addEventListener('click', function () {
            userInput.value = this.textContent;
            sendQuestion();
        });
    });
});
