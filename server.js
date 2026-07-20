import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        const isGameLogic = /[\\/]js[\\/](?:jogo-[^\\/]+|lib[\\/](?:damas-engine|chess-engine))\.js$/i.test(path);
        if (isGameLogic) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
        } else if (path.endsWith('service-worker.js')) {
            res.setHeader('Cache-Control', 'no-cache, max-age=0');
        }
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (path.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
    }
}));

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} ja esta em uso.`);
        process.exit(1);
    }

    console.error('Erro no servidor:', err);
});
