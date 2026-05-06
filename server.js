import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.OPENROUTER_API_KEY) {
    console.warn('AVISO: OPENROUTER_API_KEY nao configurada no .env');
}

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ reply: 'Por favor, digite uma mensagem.' });
        }

        console.log('Mensagem recebida:', message.substring(0, 50) + '...');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente virtual de um site voltado para idosos. Seu objetivo é ajudar o usuário a entender e utilizar o site de forma simples, clara, acolhedora e respeitosa, fazendo com que ele se sinta confortável, seguro e capaz de usar tudo sozinho.\n\nO site possui um calendário para organização de compromissos e tarefas, uma aba com dicas de saúde e alimentação, uma aba com exercícios simples acompanhados de vídeos explicativos e uma aba com jogos educativos e de entretenimento.\n\nVocê deve sempre explicar tudo com linguagem simples, evitando termos difíceis ou técnicos, e dar respostas curtas, mas completas. Sempre que possível, explique passo a passo e use exemplos do dia a dia para facilitar o entendimento.\n\nAo falar sobre o calendário, ajude o usuário a entender como organizar suas tarefas e compromissos de forma prática.\n\nAo falar sobre saúde e alimentação, dê apenas orientações gerais e seguras, sem substituir um médico ou profissional da área.\n\nAo falar sobre exercícios, explique de forma simples e segura, sempre reforçando que o usuário deve respeitar os limites do próprio corpo e evitar esforço excessivo."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || !data.choices || !data.choices[0]) {
            console.error("Erro da API OpenRouter:", data || response.status);
            return res.status(500).json({ reply: "Erro ao processar sua mensagem. Tente novamente." });
        }

        const reply = data.choices[0].message.content;
        console.log('Resposta enviada com sucesso');

        res.json({ reply });

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        res.status(500).json({ reply: 'Erro interno. Verifique sua conexao e tente novamente.' });
    }
});

app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso!`);
        console.error('Tente: feche o terminal anterior ou mude a PORT no .env');
        process.exit(1);
    } else {
        console.error('Erro no servidor:', err);
    }
});
