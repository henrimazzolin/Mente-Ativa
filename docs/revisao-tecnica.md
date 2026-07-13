# Revisão técnica — Mente Ativa

## Decisões aplicadas

### Painel de acessibilidade

Foi adotada uma **sidebar não modal**. Em telas grandes, o painel desloca a área útil para não cobrir o conteúdo. Em celulares e tablets, ele se torna um painel deslizante com fundo de apoio, pois não há largura suficiente para exibir painel e página lado a lado.

O painel:

- inicia aberto na primeira visita (`DEFAULT_PANEL_OPEN = true`);
- preserva a escolha do usuário no `localStorage` durante a navegação;
- usa botão de ícone com área clicável de 56 × 56 px;
- mantém `aria-label`, `aria-expanded`, `aria-controls` e dica visual;
- pode ser fechado pelo botão interno, por clique fora no celular ou pela tecla `Esc`;
- respeita a preferência de redução de movimento do sistema.

Um modal aberto por padrão foi descartado porque bloquearia a tarefa principal e obrigaria o usuário a realizar uma ação antes de conhecer a página.

### Espaçamento dos cards

Foi adotada uma escala simples e previsível:

- **24 px** entre cards no desktop;
- **20 px** em telas intermediárias;
- **16 px** no celular;
- cards principais do menu com altura mínima de 156 px no desktop e 104 px no celular;
- títulos dos cards de jogos elevados de 14 px para 16 px.

O espaçamento anterior de 16 px em todas as larguras deixava os conjuntos mais densos no desktop, enquanto 14 px no celular aproximava demais áreas clicáveis consecutivas. A nova escala melhora separação visual sem aumentar demais a rolagem.

## Código removido

- três implementações antigas ou duplicadas de acessibilidade;
- três arquivos de backup JavaScript;
- folha de estilo de um painel não utilizado;
- módulos de interface e IA de xadrez que não eram carregados pelo jogo atual;
- página de introdução duplicada — a introdução válida já faz parte de `index.html`;
- redirecionamento legado do assistente, sem ligação na navegação;
- entradas inválidas ou obsoletas do cache da PWA.

## Pontos preservados para decisão do TCC

Existem jogos implementados e armazenados no projeto que não aparecem nos dois menus de jogos. Eles não foram apagados porque contêm lógica funcional e podem ser material de trabalho ainda não publicado. Antes da versão final, escolha uma das opções:

1. adicionar os jogos aprovados aos menus; ou
2. remover as páginas, os estilos, os scripts e as entradas correspondentes do service worker.

Essa decisão deve ser baseada no escopo validado nos testes com usuários, e não apenas na existência do código.

## Recomendações para a próxima etapa

1. Testar com pessoas idosas reais, observando tamanho de fonte, contraste, tempo para localizar ações e erros de toque.
2. Evitar depender apenas de `hover`; toda ação deve funcionar e ficar evidente por toque e teclado.
3. Adicionar um controle de leitura em voz alta somente onde houver conteúdo textual relevante, evitando excesso de áudio.
4. Revisar o calendário para mensagens de confirmação claras e prevenção de exclusões acidentais.
5. Substituir textos médicos absolutos por linguagem informativa, fontes confiáveis e aviso de que o conteúdo não substitui avaliação profissional.
6. Definir quais jogos compõem oficialmente o TCC e alinhar menu, documentação, cache offline e roteiro de testes.
7. Executar `npm run check` antes de cada entrega.

## Segunda revisão responsiva

O painel de acessibilidade passou a usar dimensões estáveis no desktop: 360 px de largura, altura total da viewport e controles de 60 px. O título recebeu a classe própria `ma-panel-title`, impedindo que o aumento global de fonte altere seus 24 px.

O controle de fonte agora é uma grade simétrica formada por três colunas: 60 px para diminuir, uma coluna central flexível e 60 px para aumentar. O botão de lembretes deixou de ter tratamento visual exclusivo e utiliza exatamente a mesma base dos outros controles.

Ao ocultar a aba do navegador, o painel é fechado e esse estado é preservado. A camada `css/responsive.css`, carregada por último em todas as páginas, combina proteções fluidas com faixas explícitas para 320–359, 360–389, 390–429, 430–575, 576–767, 768–991, 992–1199, 1200–1439, 1440–1919 e 1920 px ou mais, além de telas horizontais com pouca altura. Ela protege grids, tabuleiros, calendários, modais, botões, imagens, vídeos e áreas de jogo contra sobreposição e overflow horizontal.

## Terceira revisão de layout

A regra global que substituía por `max-width: 100%` os limites particulares de containers, cards, tabuleiros e calendários foi removida. Assim, componentes compactos voltam a manter as larguras adequadas de cada página, sem serem esticados artificialmente.

O layout agora usa uma margem lateral fluida de 16 a 40 px, limite geral de 1200 px e limite de 1000 px para conteúdos que não possuem o wrapper `.container`. Em celulares, a margem permanece entre 10 e 14 px e soma-se ao preenchimento interno de cada tela. Containers, áreas de jogo e componentes principais são centralizados com `margin-inline: auto`.

O comando `npm run check` também executa um teste automatizado do painel, validando abertura inicial, estrutura simétrica, estilo compartilhado e fechamento quando a aba perde visibilidade.
