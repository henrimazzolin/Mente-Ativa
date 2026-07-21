document.addEventListener('DOMContentLoaded', function() {
    var PUZZLES = [];
    var currentLevel = 'facil';
    var currentPuzzleIndex = 0;
    var levelPuzzles = [];
    var score = 0;
    var streak = 0;
    var answered = false;
    var totalPuzzles = 10;

    function generatePuzzles() {
        PUZZLES = [
            // ===== FÁCIL (2-3 elementos, pistas diretas) =====
            {
                id: 'f1', level: 'facil',
                scenario: 'Três amigos — João, Maria e Pedro — têm idades diferentes: 30, 55 e 70 anos.',
                clues: [
                    'Maria não é a mais nova.',
                    'João não tem 70 anos.',
                    'Pedro é mais velho que Maria.'
                ],
                question: 'Quem tem 55 anos?',
                options: ['João', 'Maria', 'Pedro'],
                correctIndex: 1,
                explanation: 'Pedro é mais velho que Maria → Pedro = 70. Maria não é a mais nova → Maria = 55. João = 30.'
            },
            {
                id: 'f2', level: 'facil',
                scenario: 'Quatro frutas estão em cores diferentes: maçã (vermelha), banana (amarela), laranja (laranja) e uva (roxa).',
                clues: [
                    'A banana é amarela.',
                    'A uva é roxa.',
                    'A maçã não é amarela.'
                ],
                question: 'Qual fruta é da cor laranja?',
                options: ['Maçã', 'Banana', 'Laranja', 'Uva'],
                correctIndex: 2,
                explanation: 'Banana = amarela, Uva = roxa. Maçã não amarela → maçã = vermelha. Resta laranja = laranja.'
            },
            {
                id: 'f3', level: 'facil',
                scenario: 'Ana, Carlos e Lúcia trabalham como médica, professor e engenheira, uma profissão cada.',
                clues: [
                    'Carlos é professor.',
                    'Ana não é engenheira.'
                ],
                question: 'Qual a profissão de Ana?',
                options: ['Médica', 'Professora', 'Engenheira'],
                correctIndex: 0,
                explanation: 'Carlos = professor. Ana não engenheira → Ana = médica. Lúcia = engenheira.'
            },
            {
                id: 'f4', level: 'facil',
                scenario: 'Cachorro (late), gato (mia), pássaro (canta) e peixe (silêncio).',
                clues: [
                    'O cachorro late.',
                    'O gato mia.',
                    'O pássaro canta.',
                    'Um deles não emite som.'
                ],
                question: 'Qual animal fica em silêncio?',
                options: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'],
                correctIndex: 3,
                explanation: 'Cachorro late, gato mia, pássaro canta. Peixe é o único sem som.'
            },
            {
                id: 'f5', level: 'facil',
                scenario: 'Três carros na garagem: azul, vermelho e branco. Marcas: Fiat, Ford e VW.',
                clues: [
                    'O carro branco é Volkswagen.',
                    'O carro azul é Fiat.'
                ],
                question: 'Qual a marca do carro vermelho?',
                options: ['Fiat', 'Ford', 'VW'],
                correctIndex: 1,
                explanation: 'Branco = VW, Azul = Fiat. Vermelho = Ford.'
            },
            {
                id: 'f6', level: 'facil',
                scenario: 'Três netos — Lucas, Sofia e Gabriel — praticam: natação, futebol e balé.',
                clues: [
                    'Sofia faz balé.',
                    'Gabriel não sabe nadar.',
                    'Lucas não gosta de esportes com bola.'
                ],
                question: 'Qual esporte Lucas pratica?',
                options: ['Natação', 'Futebol', 'Balé'],
                correctIndex: 0,
                explanation: 'Sofia = balé. Gabriel não sabe nadar → Gabriel = futebol. Lucas não gosta de bola → Lucas = natação.'
            },
            {
                id: 'f7', level: 'facil',
                scenario: 'Quatro pessoas em andares diferentes (1º ao 4º).',
                clues: [
                    'Roberto mora no 3º andar.',
                    'Pedro mora no 1º andar.',
                    'Cláudia mora acima de Roberto.',
                    'Ana mora entre Roberto e Pedro.'
                ],
                question: 'Em que andar mora Ana?',
                options: ['1º', '2º', '3º', '4º'],
                correctIndex: 1,
                explanation: 'Pedro = 1º, Roberto = 3º. Cláudia acima (4º). Ana entre 1º e 3º = 2º.'
            },
            {
                id: 'f8', level: 'facil',
                scenario: 'Na quitanda, três produtos: queijo, pão e café. Preços: R$ 8, R$ 12 e R$ 15.',
                clues: [
                    'O café custa R$ 12.',
                    'O pão custa menos que o café.',
                    'O queijo custa mais que o pão.'
                ],
                question: 'Quanto custa o queijo?',
                options: ['R$ 8', 'R$ 12', 'R$ 15'],
                correctIndex: 2,
                explanation: 'Café = R$ 12. Pão < R$ 12 → pão = R$ 8. Queijo > pão → queijo = R$ 15.'
            },
            {
                id: 'f9', level: 'facil',
                scenario: 'Dona Rosa, sua filha Helena e sua neta Bia têm 35, 60 e 85 anos, uma idade para cada pessoa.',
                clues: [
                    'Dona Rosa é a mais velha.',
                    'Bia é a mais nova.'
                ],
                question: 'Quantos anos tem Helena?',
                options: ['35', '60', '85'],
                correctIndex: 1,
                explanation: 'Dona Rosa tem 85 e Bia tem 35. Portanto, Helena tem 60 anos.'
            },
            {
                id: 'f10', level: 'facil',
                scenario: 'Quatro objetos numa mesa: livro, caneta, copo e chave. Cores: azul, verde, vermelho e preto.',
                clues: [
                    'A caneta é azul.',
                    'O copo é verde.',
                    'A chave não é preta.'
                ],
                question: 'Qual a cor do livro?',
                options: ['Azul', 'Verde', 'Vermelho', 'Preto'],
                correctIndex: 3,
                explanation: 'Caneta = azul, copo = verde. Chave não preta → chave = vermelha. Livro = preto.'
            },
            {
                id: 'f11', level: 'facil',
                scenario: 'Três irmãos — Beto, Cássia e Davi — têm alturas: 1,60m, 1,70m e 1,80m.',
                clues: [
                    'Davi é o mais alto.',
                    'Beto é mais baixo que Cássia.',
                    'Beto não tem 1,70m.'
                ],
                question: 'Qual a altura de Beto?',
                options: ['1,60m', '1,70m', '1,80m'],
                correctIndex: 0,
                explanation: 'Davi = 1,80. Beto < Cássia e Beto ≠ 1,70 → Beto = 1,60, Cássia = 1,70.'
            },
            // ===== MÉDIO (3-4 elementos, pistas combinadas) =====
            {
                id: 'm1', level: 'medio',
                scenario: 'Quatro amigos — Paulo, Ricardo, Sofia e Tais — estão em uma fila (1º ao 4º).',
                clues: [
                    'Sofia está na frente de Ricardo.',
                    'Paulo está atrás de Tais.',
                    'Tais está na frente de Sofia.',
                    'Ricardo não é o último.'
                ],
                question: 'Quem está em 1º lugar?',
                options: ['Paulo', 'Ricardo', 'Sofia', 'Tais'],
                correctIndex: 3,
                explanation: 'Tais → Sofia → Ricardo. Paulo atrás de Tais. Ricardo não último → Paulo último. Fila: Tais(1ª), Sofia(2ª), Ricardo(3ª), Paulo(4ª).'
            },
            {
                id: 'm2', level: 'medio',
                scenario: 'Quatro profissionais — A, B, C e D — têm especialidades: cardio, dermato, neuro e ortopedia.',
                clues: [
                    'A não é cardiologista nem ortopedista.',
                    'B é neurologista.',
                    'D é ortopedista.',
                    'O cardiologista não é C.'
                ],
                question: 'Qual a especialidade de A?',
                options: ['Cardio', 'Dermato', 'Neuro', 'Ortopedia'],
                correctIndex: 2,
                explanation: 'B = Neuro, D = Ortop. A não Cardio nem Ortop → A = Dermato ou Neuro. Neuro é B → A = Dermato. C = Cardio.'
            },
            {
                id: 'm3', level: 'medio',
                scenario: 'Quatro caixas (1 a 4) com objetos: bola, livro, caneca e boneco.',
                clues: [
                    'A bola está em caixa de número ímpar.',
                    'O livro está logo à direita da bola.',
                    'A caneca está entre dois objetos.',
                    'O boneco está na caixa 4.'
                ],
                question: 'Em que caixa está a caneca?',
                options: ['Caixa 1', 'Caixa 2', 'Caixa 3', 'Caixa 4'],
                correctIndex: 2,
                explanation: 'Boneco = 4. Bola em ímpar (1 ou 3). Livro à direita da bola: se bola=1, livro=2. Se bola=3, livro=4 (ocupado). Então bola=1, livro=2. Caneca entre dois objetos → caneca=3 (entre 2 e 4). Resposta: caixa 3.'
            },
            {
                id: 'm4', level: 'medio',
                scenario: 'Cinco crianças — Ana, Beto, Caio, Duda e Eva — ganharam 1, 2, 3, 4 e 5 balas.',
                clues: [
                    'Ana ganhou mais que Beto.',
                    'Caio ganhou o dobro de Duda.',
                    'Eva ganhou menos que Ana.',
                    'Beto ganhou 3 balas.',
                    'Duda não ganhou a menor quantidade.'
                ],
                question: 'Quantas balas Ana ganhou?',
                options: ['2', '3', '4', '5'],
                correctIndex: 3,
                explanation: 'Beto = 3. Caio = 2×Duda. Duda não 1 → Caio=4, Duda=2. Ana > Beto(3) e Eva < Ana → Ana=5, Eva=1.'
            },
            {
                id: 'm5', level: 'medio',
                scenario: 'Quatro casas em fila: Azul, Verde, Vermelha e Amarela.',
                clues: [
                    'Azul está à esquerda da Verde.',
                    'Vermelha está entre a Azul e a Amarela.',
                    'Verde está na ponta direita.'
                ],
                question: 'Qual a posição da Amarela?',
                options: ['1ª (esquerda)', '2ª', '3ª', '4ª (direita)'],
                correctIndex: 2,
                explanation: 'Verde = 4ª. Azul à esquerda de Verde. Vermelha entre Azul e Amarela. Sequência: Azul(1ª), Vermelha(2ª), Amarela(3ª), Verde(4ª).'
            },
            {
                id: 'm6', level: 'medio',
                scenario: 'Cinco times — A, B, C, D e E — em posições (1º ao 5º).',
                clues: [
                    'A > C (A na frente de C)',
                    'D > B',
                    'E está entre B e D.',
                    'C não é o último.',
                    'A > B'
                ],
                question: 'Qual time ficou em 3º?',
                options: ['A', 'B', 'C', 'D', 'E'],
                correctIndex: 4,
                explanation: 'Relações: D > E > B, A > B, A > C, C não último. Ordem: D, A, E, B, C. 3º = E.'
            },
            {
                id: 'm7', level: 'medio',
                scenario: 'Quatro amigos — J, K, L e M — pediram: café, chá, suco e refrigerante.',
                clues: [
                    'J não pediu café nem refrigerante.',
                    'K pediu chá.',
                    'L pediu refrigerante.'
                ],
                question: 'O que J pediu?',
                options: ['Café', 'Chá', 'Suco', 'Refrigerante'],
                correctIndex: 2,
                explanation: 'K = Chá, L = Refri. J não Café nem Refri → J = Suco. M = Café.'
            },
            {
                id: 'm8', level: 'medio',
                scenario: 'Cinco livros: Romance, Poesia, Drama, Aventura e Biografia, lado a lado.',
                clues: [
                    'Romance está entre Drama e Poesia.',
                    'Aventura está na ponta direita.',
                    'Biografia está na ponta esquerda.',
                    'Drama está à esquerda do Romance.'
                ],
                question: 'Qual livro está no centro (3ª)?',
                options: ['Romance', 'Poesia', 'Drama', 'Aventura', 'Biografia'],
                correctIndex: 0,
                explanation: 'Bio(1ª), Av(5ª). Drama < Romance. Romance entre Drama e Poesia. Sequência: Bio, Drama, Romance, Poesia, Av. Centro = Romance.'
            },
            {
                id: 'm9', level: 'medio',
                scenario: 'Três casais (Aa, Bb, Cc) em 6 assentos lado a lado.',
                clues: [
                    'Cada pessoa ao lado do seu par.',
                    'A sentou à esquerda de a.',
                    'B sentou na ponta direita (assento 6).',
                    'c sentou entre A e b.',
                    'C sentou no assento 1.'
                ],
                question: 'Quem sentou no assento 3?',
                options: ['A', 'a', 'B', 'b', 'C', 'c'],
                correctIndex: 5,
                explanation: 'C=1, B=6. A à esquerda de a → A-a juntos. c entre A e b. Sequência: C(1), A(2), c(3), b(4), a(5), B(6). Assento 3 = c.'
            },
            // ===== DIFÍCIL (4-5 elementos, mais pistas) =====
            {
                id: 'd1', level: 'dificil',
                scenario: 'Em um concurso, 6 candidatos — A1, A2, A3, A4, A5, A6 — ficaram em posições distintas (1ª a 6ª).',
                clues: [
                    'A2 ficou entre A6 e A3.',
                    'A1 ficou na frente de A4 e de A5.',
                    'A4 ficou na frente de A6.',
                    'A5 ficou atrás de A3.',
                    'A3 não ficou na frente de A1.',
                    'A6 ficou em 5º lugar.'
                ],
                question: 'Qual candidato ficou em 1º?',
                options: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
                correctIndex: 0,
                explanation: 'A6=5º. A4 > A6 → A4=3º ou 4º. A2 entre A6(5) e A3: A2=4º, A3=2º ou 3º. A1 > A4 e A5. A3 não > A1. A5 < A3. Ordem: A1(1º), A3(2º), A4(3º), A2(4º), A6(5º), A5(6º). 1º = A1.'
            },
            {
                id: 'd2', level: 'dificil',
                scenario: 'Em um edifício de 6 andares (1º ao 6º), seis famílias — Souza, Lima, Costa, Rocha, Dias e Nunes.',
                clues: [
                    'Nunes mora no 6º andar.',
                    'Costa mora em andar par abaixo do 4º.',
                    'Souza mora dois andares acima de Lima.',
                    'Rocha mora entre Dias e Nunes.',
                    'Dias não mora no último andar.',
                    'Lima não mora no 1º andar.'
                ],
                question: 'Em que andar mora Rocha?',
                options: ['2º', '3º', '4º', '5º'],
                correctIndex: 2,
                explanation: 'Nunes=6. Costa=2 (par<4). Souza=Lima+2. Lima não 1 → Lima=3, Souza=5 (Lima=4→Souza=6 ocupado). Rocha entre Dias e Nunes(6). Dias≠6. Andares: 1=Dias, 2=Costa, 3=Lima, 4=Rocha, 5=Souza, 6=Nunes. Rocha está entre Dias(1) e Nunes(6) → sim. Rocha=4º.'
            },
            {
                id: 'd3', level: 'dificil',
                scenario: 'Seis alunos — A, B, C, D, E e F — estão em ordem de nota (1ª maior a 6ª menor).',
                clues: [
                    'A nota de A é maior que C e que D.',
                    'A nota de B está entre E e F.',
                    'A nota de D é maior que E.',
                    'A nota de F é maior que A.',
                    'A nota de C é menor que D.',
                    'E não é o último (6º).'
                ],
                question: 'Qual aluno tem a 4ª maior nota?',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctIndex: 1,
                explanation: 'F > A > D > E, e F > A > C, e B entre E e F, C < D, E não último. Sequência: F(1ª), A(2ª), D(3ª), B(4ª), E(5ª), C(6ª). 4ª = B.'
            },
            {
                id: 'd4', level: 'dificil',
                scenario: 'Seis amigos — Alberto, Beatriz, Caio, Daniela, Eduardo e Fernanda — cada um de uma cidade: Rio, SP, BH, Salvador, Fortaleza e Curitiba.',
                clues: [
                    'Alberto é do Rio.',
                    'Caio é de Curitiba.',
                    'Beatriz é de Salvador.',
                    'Eduardo não é de SP nem de BH.',
                    'Daniela não é de SP.',
                    'Fernanda não é de Fortaleza.'
                ],
                question: 'De que cidade é Daniela?',
                options: ['Rio', 'SP', 'BH', 'Salvador', 'Fortaleza', 'Curitiba'],
                correctIndex: 1,
                explanation: 'Alberto=Rio, Caio=Curitiba, Beatriz=Salvador. Sobram: SP, BH, Fortaleza para Daniela, Eduardo, Fernanda. Eduardo≠SP≠BH → Eduardo=Fortaleza. Fernanda≠Fortaleza → Fernanda=SP ou BH. Daniela≠SP → Daniela=BH, Fernanda=SP. Resposta: BH.'
            },
            {
                id: 'd5', level: 'dificil',
                scenario: 'Em um campeonato, 5 times — Alpha, Beta, Gamma, Delta, Epsilon — (1º ao 5º).',
                clues: [
                    'Alpha > Gamma e Alpha > Epsilon.',
                    'Beta está entre Delta e Gamma.',
                    'Delta > Alpha.',
                    'Epsilon não é o último.',
                    'Gamma < Epsilon.'
                ],
                question: 'Qual time ficou em 4º?',
                options: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
                correctIndex: 1,
                explanation: 'Delta > Alpha, Alpha > Gamma, Alpha > Epsilon, Epsilon > Gamma. Beta entre Delta e Gamma. Epsilon não último. Ordem: Delta(1º), Alpha(2º), Epsilon(3º), Beta(4º), Gamma(5º). Verificando: Beta(4) entre Delta(1) e Gamma(5) sim, Epsilon(3) > Gamma(5) sim. 4º = Beta.'
            },
            {
                id: 'd6', level: 'dificil',
                scenario: 'Seis pessoas — P1, P2, P3, P4, P5, P6 — em uma fila (1º ao 6º).',
                clues: [
                    'P1 está entre P3 e P5.',
                    'P2 está na frente de P4.',
                    'P3 está atrás de P5.',
                    'P4 está entre P6 e P2.',
                    'P5 não está nas pontas.',
                    'P6 está na 2ª posição.'
                ],
                question: 'Quem está na 4ª posição?',
                options: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
                correctIndex: 4,
                explanation: 'P6=2ª. P2 > P4, P4 entre P6(2) e P2 → P4=3ª, P2=5ª ou 4ª. P3 < P5. P1 entre P3 e P5. P5 não pontas. Posições: 1ª=P3, 2ª=P6, 3ª=P4, 4ª=P5, 5ª=P2, 6ª=P1. P1 entre P3(1) e P5(4) sim. P4 entre P6(2) e P2(5) → 3 entre 2 e 5 sim. P5 não ponta=4ª ok. 4ª = P5.'
            }
        ];

        PUZZLES = PUZZLES.concat([
            { id:'f12', level:'facil', scenario:'Na hora do lanche, Célia separou chá, café e suco para três xícaras.', clues:['A xícara azul recebeu chá.','A xícara verde recebeu café.'], question:'O que ficou na xícara branca?', options:['Chá','Café','Suco'], correctIndex:2, explanation:'Azul já tem chá e verde já tem café. Na xícara branca ficou o suco.' },
            { id:'f13', level:'facil', scenario:'Paulo fará três tarefas: regar as plantas, telefonar para a irmã e passear com o cachorro.', clues:['Ele regará as plantas primeiro.','O passeio será por último.'], question:'Qual tarefa será feita no meio?', options:['Regar as plantas','Telefonar para a irmã','Passear com o cachorro'], correctIndex:1, explanation:'Regar é a primeira tarefa e passear é a última. Telefonar fica no meio.' },
            { id:'f14', level:'facil', scenario:'Na estante há um livro vermelho, um azul e um verde.', clues:['O livro azul está à esquerda.','O livro verde está à direita.'], question:'Qual livro está no centro?', options:['Vermelho','Azul','Verde'], correctIndex:0, explanation:'Azul ocupa a esquerda e verde ocupa a direita. O vermelho fica no centro.' },
            { id:'f15', level:'facil', scenario:'Lia comprou pão por R$ 8, frutas por R$ 12 e queijo por R$ 18.', clues:['As frutas custaram mais que o pão.','O queijo foi a compra mais cara.'], question:'Qual foi a compra mais barata?', options:['Pão','Frutas','Queijo'], correctIndex:0, explanation:'O pão custou R$ 8, o menor dos três valores.' },
            { id:'m10', level:'medio', scenario:'No almoço, Marta, Nilo, Olga e Rui escolheram arroz, sopa, peixe e salada, um prato para cada pessoa.', clues:['Marta escolheu sopa.','Nilo escolheu peixe.','Olga não escolheu arroz.'], question:'O que Olga escolheu?', options:['Arroz','Sopa','Peixe','Salada'], correctIndex:3, explanation:'Sopa é de Marta e peixe é de Nilo. Olga não escolheu arroz, então escolheu salada.' },
            { id:'m11', level:'medio', scenario:'Quatro consultas foram marcadas às 8h, 9h, 10h e 11h para Ana, Beto, Cida e Dario.', clues:['Ana será atendida às 8h.','Dario será atendido às 11h.','Beto será atendido antes de Cida.'], question:'Em qual horário Cida será atendida?', options:['8h','9h','10h','11h'], correctIndex:2, explanation:'Ana ocupa 8h e Dario 11h. Como Beto vem antes de Cida, Beto fica às 9h e Cida às 10h.' },
            { id:'m12', level:'medio', scenario:'Na horta há canteiros de alface, cenoura, tomate e couve numerados de 1 a 4.', clues:['A alface está no canteiro 1.','A couve está no canteiro 4.','A cenoura vem antes do tomate.'], question:'Em qual canteiro está o tomate?', options:['1','2','3','4'], correctIndex:2, explanation:'Alface ocupa 1 e couve ocupa 4. Sobram 2 e 3; como cenoura vem antes, tomate fica no 3.' },
            { id:'m13', level:'medio', scenario:'Quatro vizinhos levaram bolo, café, pão e frutas para uma reunião.', clues:['Irene levou café.','João levou pão.','Lúcia não levou bolo.'], question:'O que Lúcia levou?', options:['Bolo','Café','Pão','Frutas'], correctIndex:3, explanation:'Café e pão já foram escolhidos. Como Lúcia não levou bolo, ela levou frutas.' },
            { id:'m14', level:'medio', scenario:'Rosa guardou toalhas em quatro gavetas: banho, rosto, mesa e cozinha.', clues:['Banho está na gaveta 1.','Cozinha está na gaveta 4.','Mesa está logo depois de rosto.'], question:'Onde estão as toalhas de mesa?', options:['Gaveta 1','Gaveta 2','Gaveta 3','Gaveta 4'], correctIndex:2, explanation:'As gavetas 1 e 4 já estão ocupadas. Rosto fica na 2 e mesa, logo depois, na 3.' },
            { id:'m15', level:'medio', scenario:'Em uma caminhada, Léo, Mara, Nara e Otávio chegaram em horários diferentes.', clues:['Léo chegou primeiro.','Otávio chegou por último.','Mara chegou antes de Nara.'], question:'Quem chegou em terceiro?', options:['Léo','Mara','Nara','Otávio'], correctIndex:2, explanation:'Léo foi o primeiro e Otávio o último. Mara veio antes de Nara, portanto Nara chegou em terceiro.' },
            { id:'d7', level:'dificil', scenario:'Quatro oficinas — culinária, música, pintura e jardinagem — ocorrerão de segunda a quinta.', clues:['Culinária será na segunda.','Jardinagem será na quinta.','Música acontecerá antes de pintura.'], question:'Em que dia será a pintura?', options:['Segunda','Terça','Quarta','Quinta'], correctIndex:2, explanation:'Segunda e quinta já estão ocupadas. Música vem antes de pintura, então música será terça e pintura quarta.' },
            { id:'d8', level:'dificil', scenario:'Dora organizou quatro fotografias: praia, família, jardim e aniversário.', clues:['A foto da família é a primeira.','A do aniversário é a última.','A foto do jardim vem depois da praia.'], question:'Qual foto está na terceira posição?', options:['Praia','Família','Jardim','Aniversário'], correctIndex:2, explanation:'Família é primeira e aniversário é quarta. Praia vem antes de jardim, então jardim é a terceira.' },
            { id:'d9', level:'dificil', scenario:'Quatro entregas serão feitas para Lia, Mauro, Nádia e Pedro, do primeiro ao quarto horário.', clues:['Lia recebe antes de Mauro.','Nádia recebe no segundo horário.','Pedro recebe depois de Mauro.'], question:'Quem recebe no quarto horário?', options:['Lia','Mauro','Nádia','Pedro'], correctIndex:3, explanation:'Nádia é segunda. Para Lia vir antes de Mauro e Pedro depois de Mauro, a ordem possível é Lia, Nádia, Mauro e Pedro.' },
            { id:'d10', level:'dificil', scenario:'Quatro vasos — azul, branco, verde e amarelo — ficam em uma janela.', clues:['O azul está na ponta esquerda.','O amarelo está na ponta direita.','O branco fica imediatamente antes do verde.'], question:'Qual vaso está na segunda posição?', options:['Azul','Branco','Verde','Amarelo'], correctIndex:1, explanation:'Azul e amarelo ocupam as pontas. Como branco vem logo antes de verde, branco fica em segundo.' },
            { id:'d11', level:'dificil', scenario:'Caio planejou quatro atividades: mercado, banco, farmácia e praça.', clues:['O mercado será primeiro.','A praça será por último.','O banco será visitado antes da farmácia.'], question:'Qual atividade será a terceira?', options:['Mercado','Banco','Farmácia','Praça'], correctIndex:2, explanation:'Mercado é primeiro e praça é quarta. Banco vem antes da farmácia, então farmácia é terceira.' },
            { id:'d12', level:'dificil', scenario:'Quatro pessoas escolheram ônibus, metrô, bicicleta e caminhada para chegar ao encontro.', clues:['Bia foi de metrô.','Davi foi caminhando.','Eva não usou ônibus.'], question:'Como Eva chegou?', options:['Ônibus','Metrô','Bicicleta','Caminhada'], correctIndex:2, explanation:'Metrô e caminhada já foram usados. Como Eva não foi de ônibus, ela foi de bicicleta.' },
            { id:'d13', level:'dificil', scenario:'Quatro caixas guardam documentos, fotografias, ferramentas e linhas de costura.', clues:['Documentos estão na caixa 1.','Linhas estão na caixa 4.','Fotografias ficam antes das ferramentas.'], question:'Em qual caixa estão as ferramentas?', options:['Caixa 1','Caixa 2','Caixa 3','Caixa 4'], correctIndex:2, explanation:'Caixas 1 e 4 já estão ocupadas. Fotografias ficam na 2 e ferramentas na 3.' },
            { id:'d14', level:'dificil', scenario:'Na feira, quatro barracas vendem frutas, queijos, flores e pães, nessa rua numerada de 1 a 4.', clues:['Frutas ficam na barraca 1.','Pães ficam na barraca 4.','Flores ficam depois dos queijos.'], question:'Qual produto está na barraca 2?', options:['Frutas','Queijos','Flores','Pães'], correctIndex:1, explanation:'Frutas e pães ocupam as pontas. Como flores vêm depois dos queijos, queijos ficam na barraca 2.' },
            { id:'d15', level:'dificil', scenario:'Quatro músicas serão tocadas: valsa, samba, forró e bolero.', clues:['A valsa abre a apresentação.','O bolero encerra a apresentação.','O samba será tocado antes do forró.'], question:'Qual ritmo será o terceiro?', options:['Valsa','Samba','Forró','Bolero'], correctIndex:2, explanation:'Valsa é primeira e bolero é quarto. Samba vem antes de forró, então forró é o terceiro.' }
        ]);

        PUZZLES = PUZZLES.map(function (puzzle) {
            var limite = puzzle.level === 'facil' ? 3 : 4;
            var correta = puzzle.options[puzzle.correctIndex];
            var opcoes = [correta].concat(puzzle.options.filter(function (opcao, indice) { return indice !== puzzle.correctIndex; }).slice(0, limite - 1));
            opcoes = shuffleArray(opcoes);
            return {
                id: puzzle.id,
                nivel: puzzle.level,
                historia: puzzle.scenario,
                pistas: puzzle.clues,
                pergunta: puzzle.question,
                opcoes: opcoes,
                respostaCorreta: opcoes.indexOf(correta),
                explicacao: puzzle.explanation
            };
        });
    }

    function getPuzzlesForLevel(level) {
        return PUZZLES.filter(function(p) { return p.nivel === level; });
    }

    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    function getDifficultyLabel(level) {
        switch (level) {
            case 'facil': return 'Fácil';
            case 'medio': return 'Médio';
            case 'dificil': return 'Difícil';
        }
        return '';
    }

    function initGame() {
        if (!initGame.filas) initGame.filas = {};
        var fila = initGame.filas[currentLevel] || [];
        while (fila.length < totalPuzzles) fila = fila.concat(shuffleArray(getPuzzlesForLevel(currentLevel).slice()));
        levelPuzzles = fila.splice(0, totalPuzzles);
        initGame.filas[currentLevel] = fila;

        currentPuzzleIndex = 0;
        score = 0;
        streak = 0;
        answered = false;

        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        renderPuzzle();
    }

    function renderPuzzle() {
        if (currentPuzzleIndex >= levelPuzzles.length) {
            showCompletion();
            return;
        }

        answered = false;
        var puzzle = levelPuzzles[currentPuzzleIndex];
        document.getElementById('puzzleNum').textContent = (currentPuzzleIndex + 1) + '/' + levelPuzzles.length;
        document.getElementById('scenario').textContent = puzzle.historia;

        var cluesList = document.getElementById('cluesList');
        cluesList.innerHTML = '';
        puzzle.pistas.forEach(function(clue) {
            var li = document.createElement('li');
            var clueText = document.createElement('span');
            clueText.className = 'clue-text';
            clueText.textContent = clue;
            li.appendChild(clueText);
            cluesList.appendChild(li);
        });

        document.getElementById('question').textContent = puzzle.pergunta;

        var optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        puzzle.opcoes.forEach(function(opt, i) {
            var btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.index = i;

            var textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = opt;

            btn.appendChild(textSpan);
            btn.addEventListener('click', function() {
                handleAnswer(parseInt(this.dataset.index));
            });
            optionsContainer.appendChild(btn);
        });

        document.getElementById('explanation').className = 'puzzle-explanation';
        document.getElementById('explanation').innerHTML = '';

        var nextBtn = document.getElementById('btn-next');
        nextBtn.style.display = 'none';
    }

    function handleAnswer(selectedIndex) {
        if (answered) return;
        answered = true;

        var puzzle = levelPuzzles[currentPuzzleIndex];
        var options = document.querySelectorAll('.option-btn');
        var correct = selectedIndex === puzzle.respostaCorreta;

        options.forEach(function(btn, i) {
            btn.classList.add('disabled');
            if (i === puzzle.respostaCorreta) {
                btn.classList.add('correct');
            } else if (i === selectedIndex && !correct) {
                btn.classList.add('incorrect');
            }
        });

        var explanation = document.getElementById('explanation');
        if (correct) {
            score++;
            streak++;
            explanation.className = 'puzzle-explanation show correct';
            explanation.innerHTML = '<strong>Correto!</strong> ' + puzzle.explicacao;
        } else {
            streak = 0;
            explanation.className = 'puzzle-explanation show incorrect';
            explanation.innerHTML = '<strong>Resposta: ' + puzzle.opcoes[puzzle.respostaCorreta] + '</strong><br>' + puzzle.explicacao;
        }

        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        document.getElementById('btn-next').style.display = 'inline-flex';
    }

    function nextPuzzle() {
        currentPuzzleIndex++;
        renderPuzzle();
    }

    function showCompletion() {
        var icon = document.getElementById('feedbackIcon');
        var title = document.getElementById('feedbackTitle');
        var text = document.getElementById('feedbackText');

        if (score === levelPuzzles.length) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            title.textContent = 'Perfeito!';
            text.textContent = 'Você acertou todas as ' + levelPuzzles.length + ' questões!';
        } else if (score >= levelPuzzles.length * 0.7) {
            icon.className = 'icon success';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Muito bem!';
            text.textContent = 'Acertou ' + score + ' de ' + levelPuzzles.length + ' questões.';
        } else {
            icon.className = 'icon finished';
            icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>';
            title.textContent = 'Rodada concluída!';
            text.textContent = 'Acertou ' + score + ' de ' + levelPuzzles.length + '. Tente novamente!';
        }

        document.getElementById('feedbackBtn').onclick = function() {
            closeFeedback();
            initGame();
        };
        document.getElementById('overlay').classList.add('show');
        document.getElementById('feedbackModal').classList.add('show');
    }

    function closeFeedback() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('feedbackModal').classList.remove('show');
    }

    function changeDifficulty(level) {
        currentLevel = level;
        document.querySelectorAll('.dif-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.dif === level);
        });
        initGame();
    }

    document.querySelectorAll('.dif-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            changeDifficulty(this.dataset.dif);
        });
    });

    document.getElementById('btn-next').addEventListener('click', nextPuzzle);
    document.getElementById('btn-restart').addEventListener('click', function() {
        exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() {
            initGame();
        });
    });

    generatePuzzles();
    initGame();
});
