import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
                        content: "Responda de forma breve, simples e acolhedora, adequada para idosos."
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
