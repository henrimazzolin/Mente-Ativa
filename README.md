# Mente Ativa

Plataforma web acessível voltada a pessoas idosas, familiares e cuidadores. Reúne jogos cognitivos, atividades acompanhadas, calendário, exercícios físicos, informações de saúde e orientações de segurança digital.

O projeto possui 18 jogos publicados nos catálogos e outras nove atividades funcionais ainda fora dos menus. A página de Frases permanece em manutenção.

## Tecnologias

- HTML5 semântico;
- CSS3 responsivo;
- JavaScript sem frameworks no navegador;
- Bootstrap 5;
- PWA com manifesto e service worker;
- Express para servir os arquivos durante o desenvolvimento;
- testes de interface e regras com Node.js e JSDOM.

## Executar o projeto

É necessário ter Node.js 18 ou superior instalado.

```bash
npm install
npm start
```

Depois, acesse [http://localhost:3000](http://localhost:3000). A porta pode ser alterada pela variável de ambiente `PORT`.

## Validação

Antes de entregar uma alteração, execute:

```bash
npm run check
```

Esse comando verifica:

- sintaxe dos arquivos JavaScript;
- referências locais e IDs HTML;
- integridade e responsividade dos estilos;
- painel de acessibilidade e preferências do usuário;
- páginas informativas e vídeos externos;
- regras e interações dos jogos;
- jogos individuais e atividades acompanhadas.

Também existem comandos específicos, como `npm run check:js`, `npm run test:accessibility`, `npm run test:responsive`, `npm run test:privacy`, `npm run test:info-videos`, `npm run test:exercise-videos`, `npm run test:qa` e `npm run test:dependent-games`.

## Estrutura

```text
Mente-Ativa/
├── audios/            arquivos locais usados apenas na produção dos vídeos
├── css/               estilos globais e estilos separados por página
├── docs/              roteiros e documentação de produção dos vídeos
├── img/               imagens, ilustrações, ícones e fundos
├── js/
│   ├── components/    componentes compartilhados
│   ├── lib/           motores e utilitários dos jogos
│   └── pages/         comportamentos específicos de páginas
├── scripts/           validadores e testes automatizados
├── *.html             páginas públicas da aplicação
├── manifest.json      configuração da PWA
├── service-worker.js  cache e funcionamento offline
└── server.js          servidor local de desenvolvimento
```

## Áudios e vídeos

A pasta `audios/` é usada somente para guardar arquivos durante a produção. Ela está no `.gitignore`, portanto seu conteúdo não deve ser enviado ao repositório.

Os vídeos finais devem ser publicados no YouTube e incorporados por endereço externo. Isso evita armazenar arquivos pesados no Git e no cache da PWA. Os arquivos locais de áudio não devem ser adicionados ao `service-worker.js` nem referenciados pelas páginas públicas.

Os roteiros de narração e as orientações de produção estão em [`docs/roteiro-videos-como-jogar.md`](docs/roteiro-videos-como-jogar.md).

## Acessibilidade

O Mente Ativa oferece recursos compartilhados para:

- ampliar e reduzir o tamanho dos textos;
- alternar entre os temas claro e escuro;
- ativar ou desativar sons dos jogos;
- configurar lembretes quando o navegador permitir;
- usar controles por toque, mouse ou teclado nas atividades compatíveis;
- apresentar foco visível, nomes acessíveis e mensagens de estado.

O painel lateral abre automaticamente na primeira visita. Depois, a preferência de aberto ou fechado é salva no navegador e respeitada nas demais páginas.

## PWA e conteúdo externo

As páginas e os recursos essenciais são preparados para funcionamento offline. Conteúdos hospedados fora do projeto, como vídeos do YouTube, exigem conexão com a internet e não fazem parte do pacote offline.

Ao alterar arquivos que fazem parte do cache, atualize a versão definida em `CACHE_NAME` no `service-worker.js`.

## Documentação

- [`docs/roteiro-videos-como-jogar.md`](docs/roteiro-videos-como-jogar.md): roteiros de narração, instruções de tela, referências e orientações de gravação.
