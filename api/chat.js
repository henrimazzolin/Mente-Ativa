export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Método não permitido' });
    }

    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ reply: 'Por favor, digite uma mensagem de texto.' });
        }

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
                        content: "Responda de forma clara, breve e acolhedora, utilizando palavras simples e fáceis de entender. Priorize uma comunicação respeitosa, paciente e acessível, pensando no público idoso e evitando termos complicados ou técnicos."
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
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        return res.status(500).json({ reply: 'Erro interno. Verifique sua conexão e tente novamente.' });
    }
}
