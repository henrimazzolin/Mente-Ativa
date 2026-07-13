# Mente Ativa

Plataforma web acessível para pessoas idosas, familiares e cuidadores. Reúne jogos cognitivos, calendário, exercícios físicos, informações de saúde e orientações de segurança digital.

## Tecnologias

- HTML5 semântico;
- CSS3 responsivo;
- JavaScript sem frameworks;
- JSON para manifesto da PWA;
- Express apenas para servir os arquivos localmente.

## Executar o projeto

Requer Node.js 18 ou superior.

```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

## Validar antes de entregar

```bash
npm run check
```

A validação verifica a sintaxe dos JavaScript, referências locais quebradas, IDs HTML duplicados, integridade dos CSS, cobertura responsiva e o comportamento principal do painel de acessibilidade.

## Estrutura

```text
Mente-Ativa/
├── css/               estilos separados por página e recursos globais
├── docs/              documentação do TCC e revisão técnica
├── img/               imagens, ilustrações e vídeo
├── js/
│   ├── components/    componentes compartilhados
│   ├── lib/           motores e utilitários dos jogos
│   └── pages/         comportamentos específicos de páginas
├── scripts/           validações de desenvolvimento
├── *.html             páginas e rotas públicas
├── manifest.json      configuração da PWA
├── service-worker.js  cache e funcionamento offline
└── server.js          servidor local de desenvolvimento
```

## Acessibilidade

O painel lateral inicia aberto na primeira visita. Depois, a preferência de aberto ou fechado é salva no navegador e respeitada nas demais páginas. O botão usa um ícone visual, mas mantém nome acessível para leitores de tela.

Consulte [`docs/revisao-tecnica.md`](docs/revisao-tecnica.md) para decisões, pontos analisados e próximos passos.
