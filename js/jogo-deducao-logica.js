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
                explanation: 'Pedro é o mais velho e tem 70 anos. Maria fica com 55 anos, e João com 30.'
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
                explanation: 'A banana é amarela e a uva é roxa. A maçã fica com a cor vermelha. Assim, a fruta laranja é a laranja.'
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
                explanation: 'Carlos já é o professor. Como Ana não é engenheira, ela é a médica. Lúcia fica com a profissão de engenheira.'
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
                explanation: 'O carro branco é Volkswagen e o azul é Fiat. A marca que sobra para o carro vermelho é Ford.'
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
                explanation: 'Sofia faz balé. Gabriel pratica futebol, pois não sabe nadar. Lucas pratica natação, que não usa bola.'
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
                explanation: 'Pedro mora no primeiro andar e Roberto no terceiro. Cláudia fica no quarto. O andar entre Pedro e Roberto é o segundo, onde mora Ana.'
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
                explanation: 'O café custa doze reais. O pão custa oito, pois é mais barato. O queijo fica com o maior preço, quinze reais.'
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
                explanation: 'A caneta é azul e o copo é verde. A chave não pode ser preta, então é vermelha. A cor preta sobra para o livro.'
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
                explanation: 'Davi é o mais alto. Beto é mais baixo que Cássia e não mede um metro e setenta. Por isso, Beto mede um metro e sessenta.'
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
                explanation: 'Tais vem antes de Sofia, que vem antes de Ricardo. Como Ricardo não é o último, Paulo fecha a fila. Tais fica em primeiro lugar.'
            },
            {
                id: 'm2', level: 'medio',
                scenario: 'Quatro profissionais — Alice, Bruno, Carla e Daniel — trabalham em cardiologia, dermatologia, neurologia e ortopedia.',
                clues: [
                    'Alice não trabalha em cardiologia nem ortopedia.',
                    'Bruno trabalha em neurologia.',
                    'Daniel trabalha em ortopedia.',
                    'Carla não trabalha em dermatologia.'
                ],
                question: 'Qual é a especialidade de Alice?',
                options: ['Cardiologia', 'Dermatologia', 'Neurologia', 'Ortopedia'],
                correctIndex: 1,
                explanation: 'Bruno já trabalha em neurologia e Daniel em ortopedia. Alice não pode ficar com cardiologia. Portanto, Alice trabalha em dermatologia.'
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
                explanation: 'O boneco ocupa a caixa quatro. A bola só pode ficar na caixa um, com o livro logo depois. A caneca fica na caixa três.'
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
                explanation: 'Beto ganhou três balas. Duda ganhou duas e Caio ganhou quatro. Como Ana ganhou mais que Beto e mais que Eva, Ana recebeu cinco balas.'
            },
            {
                id: 'm5', level: 'medio',
                scenario: 'Quatro casas em fila: Azul, Verde, Vermelha e Amarela.',
                clues: [
                    'Azul está à esquerda da Verde.',
                    'A casa Vermelha está logo à direita da Azul.',
                    'A casa Amarela está logo à direita da Vermelha.',
                    'Verde está na ponta direita.'
                ],
                question: 'Qual a posição da Amarela?',
                options: ['1ª (esquerda)', '2ª', '3ª', '4ª (direita)'],
                correctIndex: 2,
                explanation: 'A casa Verde fica na ponta direita. Antes dela aparecem, nesta ordem, as casas Azul, Vermelha e Amarela. A Amarela ocupa a terceira posição.'
            },
            {
                id: 'm6', level: 'medio',
                scenario: 'Cinco times — Águia, Brisa, Cedro, Dourado e Estrela — terminaram do primeiro ao quinto lugar.',
                clues: [
                    'Dourado ficou em primeiro lugar.',
                    'Brisa ficou em quinto lugar.',
                    'Águia ficou à frente de Cedro.',
                    'Estrela ficou logo depois de Águia.',
                    'Cedro não ficou em segundo lugar.'
                ],
                question: 'Qual time ficou em 3º?',
                options: ['Águia', 'Brisa', 'Cedro', 'Dourado', 'Estrela'],
                correctIndex: 4,
                explanation: 'Dourado abre a classificação e Brisa fica em último. Águia precisa vir logo antes de Estrela, deixando Cedro em quarto. Assim, Estrela fica em terceiro.'
            },
            {
                id: 'm7', level: 'medio',
                scenario: 'Quatro amigos — Júlia, Kauê, Lúcia e Marcos — pediram café, chá, suco e refrigerante.',
                clues: [
                    'Júlia não pediu café nem refrigerante.',
                    'Kauê pediu chá.',
                    'Lúcia pediu refrigerante.'
                ],
                question: 'O que Júlia pediu?',
                options: ['Café', 'Chá', 'Suco', 'Refrigerante'],
                correctIndex: 2,
                explanation: 'Kauê já pediu chá e Lúcia pediu refrigerante. Júlia também não pediu café. Portanto, Júlia pediu suco.'
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
                explanation: 'Biografia fica na primeira posição e Aventura na última. Entre eles, Drama vem antes de Romance, e Poesia vem depois. Romance ocupa o centro.'
            },
            {
                id: 'm9', level: 'medio',
                scenario: 'Três casais — Alice e André, Bianca e Bruno, Clara e Carlos — ocupam seis assentos lado a lado.',
                clues: [
                    'Cada pessoa está ao lado do seu par.',
                    'Clara sentou no primeiro assento e Carlos no segundo.',
                    'Alice sentou imediatamente à esquerda de André.',
                    'Bruno sentou no sexto assento.'
                ],
                question: 'Quem sentou no assento 3?',
                options: ['Alice', 'André', 'Bianca', 'Bruno', 'Clara', 'Carlos'],
                correctIndex: 0,
                explanation: 'Clara e Carlos ocupam os dois primeiros assentos. Bianca precisa ficar ao lado de Bruno no fim da fila. Sobram o terceiro e o quarto assentos para Alice e André, nessa ordem. Alice fica no terceiro.'
            },
            // ===== DIFÍCIL (5-6 elementos, pistas encadeadas) =====
            {
                id: 'd1', level: 'dificil',
                scenario: 'Em um concurso, seis candidatos — Alice, Bruno, Carla, Diego, Elisa e Fábio — ficaram em posições diferentes.',
                clues: [
                    'Fábio ficou em quinto lugar.',
                    'Elisa ficou logo depois de Fábio.',
                    'Bruno ficou logo antes de Fábio.',
                    'Diego ficou logo antes de Bruno.',
                    'Carla ficou entre Alice e Diego.',
                    'Alice ficou à frente de Carla.'
                ],
                question: 'Qual candidato ficou em 1º?',
                options: ['Alice', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio'],
                correctIndex: 0,
                explanation: 'Fábio e Elisa ocupam o quinto e o sexto lugares. Bruno fica em quarto e Diego em terceiro. Carla precisa ficar entre Alice e Diego. Assim, Alice fica em primeiro lugar.'
            },
            {
                id: 'd2', level: 'dificil',
                scenario: 'Em um edifício de 6 andares (1º ao 6º), seis famílias — Souza, Lima, Costa, Rocha, Dias e Nunes.',
                clues: [
                    'Nunes mora no 6º andar.',
                    'Souza mora logo abaixo de Nunes.',
                    'Lima mora dois andares abaixo de Souza.',
                    'Costa mora em um andar par abaixo de Lima.',
                    'Dias mora abaixo de Costa.',
                    'Rocha mora acima de Lima.'
                ],
                question: 'Em que andar mora Rocha?',
                options: ['2º', '3º', '4º', '5º'],
                correctIndex: 2,
                explanation: 'Nunes mora no sexto andar e Costa no segundo. Lima fica no terceiro e Souza no quinto. Restam o primeiro andar para Dias e o quarto para Rocha.'
            },
            {
                id: 'd3', level: 'dificil',
                scenario: 'Seis alunos — Alice, Bruno, Carla, Diego, Elisa e Fábio — estão em ordem da maior para a menor nota.',
                clues: [
                    'Carla teve a menor nota.',
                    'Elisa ficou logo antes de Carla.',
                    'Bruno ficou logo antes de Elisa.',
                    'Diego ficou logo antes de Bruno.',
                    'Alice ficou entre Fábio e Diego.',
                    'Fábio teve nota maior que Alice.'
                ],
                question: 'Qual aluno tem a 4ª maior nota?',
                options: ['Alice', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio'],
                correctIndex: 1,
                explanation: 'Carla fica em sexto, Elisa em quinto, Bruno em quarto e Diego em terceiro. Alice precisa ficar entre Fábio e Diego. Portanto, Bruno tem a quarta maior nota.'
            },
            {
                id: 'd4', level: 'dificil',
                scenario: 'Seis amigos — Alberto, Beatriz, Caio, Daniela, Eduardo e Fernanda — são do Rio de Janeiro, São Paulo, Belo Horizonte, Salvador, Fortaleza e Curitiba.',
                clues: [
                    'Alberto é do Rio.',
                    'Caio é de Curitiba.',
                    'Beatriz é de Salvador.',
                    'Eduardo não é de São Paulo nem de Belo Horizonte.',
                    'Daniela não é de São Paulo.',
                    'Fernanda não é de Fortaleza.'
                ],
                question: 'De que cidade é Daniela?',
                options: ['Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Salvador', 'Fortaleza', 'Curitiba'],
                correctIndex: 2,
                explanation: 'Rio de Janeiro, Curitiba e Salvador já estão ocupadas. Eduardo só pode ser de Fortaleza. Como Daniela não é de São Paulo, ela é de Belo Horizonte.'
            },
            {
                id: 'd5', level: 'dificil',
                scenario: 'Em um campeonato, cinco times — Aurora, Brisa, Cruzeiro, Dourado e Estrela — terminaram do primeiro ao quinto lugar.',
                clues: [
                    'Cruzeiro ficou em quinto lugar.',
                    'Brisa ficou logo antes de Cruzeiro.',
                    'Estrela ficou logo antes de Brisa.',
                    'Aurora ficou logo depois de Dourado.',
                    'Dourado ficou à frente de Estrela.'
                ],
                question: 'Qual time ficou em 4º?',
                options: ['Aurora', 'Brisa', 'Cruzeiro', 'Dourado', 'Estrela'],
                correctIndex: 1,
                explanation: 'Cruzeiro fica em quinto, Brisa em quarto e Estrela em terceiro. Sobram os dois primeiros lugares para Dourado e Aurora, nessa ordem. Brisa fica em quarto.'
            },
            {
                id: 'd6', level: 'dificil',
                scenario: 'Seis pessoas — Renato, Luiza, Paulo, Helena, Silvia e Marta — estão em uma fila.',
                clues: [
                    'Luiza está na segunda posição.',
                    'Paulo está logo depois de Luiza.',
                    'Marta está na última posição.',
                    'Silvia está logo antes de Marta.',
                    'Helena está entre Paulo e Silvia.',
                    'Renato está à frente de Luiza.'
                ],
                question: 'Quem está na 4ª posição?',
                options: ['Renato', 'Luiza', 'Paulo', 'Helena', 'Silvia', 'Marta'],
                correctIndex: 3,
                explanation: 'Luiza e Paulo ficam em segundo e terceiro. Marta está em sexto, com Silvia logo antes. Helena fica entre Paulo e Silvia, na quarta posição. Renato ocupa o primeiro lugar.'
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
            { id:'d7', level:'dificil', scenario:'Cinco oficinas — culinária, música, pintura, jardinagem e teatro — ocorrerão de segunda a sexta.', clues:['Culinária será na segunda.','Teatro será na sexta.','Jardinagem será na quinta.','Música acontecerá logo antes de pintura.'], question:'Em que dia será a pintura?', options:['Segunda','Terça','Quarta','Quinta','Sexta'], correctIndex:2, explanation:'Segunda, quinta e sexta já estão ocupadas. Sobram terça e quarta para música e pintura. Como música vem logo antes, pintura será na quarta.' },
            { id:'d8', level:'dificil', scenario:'Dora organizou cinco fotografias: praia, família, jardim, aniversário e viagem.', clues:['A foto da família é a primeira.','A foto do aniversário é a última.','A foto da praia vem logo antes da foto do jardim.','A foto da viagem fica depois da foto do jardim.'], question:'Qual foto está na terceira posição?', options:['Praia','Família','Jardim','Aniversário','Viagem'], correctIndex:2, explanation:'Família abre a sequência e aniversário fecha. Praia precisa vir logo antes de jardim, e viagem vem depois. Assim, jardim fica na terceira posição.' },
            { id:'d9', level:'dificil', scenario:'Cinco entregas serão feitas para Caio, Lia, Mauro, Nádia e Pedro, do primeiro ao quinto horário.', clues:['Caio recebe no primeiro horário.','Nádia recebe no segundo horário.','Lia recebe antes de Mauro.','Mauro recebe logo antes de Pedro.'], question:'Quem recebe no quinto horário?', options:['Caio','Lia','Mauro','Nádia','Pedro'], correctIndex:4, explanation:'Caio e Nádia ocupam os dois primeiros horários. Nos três restantes, Lia vem antes de Mauro, e Mauro logo antes de Pedro. Pedro recebe no quinto horário.' },
            { id:'d10', level:'dificil', scenario:'Cinco vasos — azul, branco, verde, vermelho e amarelo — ficam lado a lado em uma janela.', clues:['O vaso azul está na ponta esquerda.','O amarelo está na ponta direita.','O branco fica logo antes do verde.','O vermelho fica depois do verde.'], question:'Qual vaso está na segunda posição?', options:['Azul','Branco','Verde','Vermelho','Amarelo'], correctIndex:1, explanation:'Azul e amarelo ocupam as pontas. Entre eles, branco vem logo antes de verde, e vermelho vem depois. O vaso branco fica na segunda posição.' },
            { id:'d11', level:'dificil', scenario:'Caio planejou cinco atividades: mercado, banco, farmácia, padaria e praça.', clues:['O mercado será primeiro.','A praça será por último.','O banco será visitado logo antes da farmácia.','A padaria será visitada depois da farmácia e antes da praça.'], question:'Qual atividade será a terceira?', options:['Mercado','Banco','Farmácia','Padaria','Praça'], correctIndex:2, explanation:'Mercado e praça ficam nas pontas. Banco vem logo antes da farmácia, e padaria vem depois. A farmácia ocupa a terceira posição.' },
            { id:'d12', level:'dificil', scenario:'Alice, Bia, Davi, Eva e Fábio usaram ônibus, metrô, bicicleta, caminhada e carro para chegar ao encontro.', clues:['Bia foi de metrô.','Davi foi caminhando.','Fábio foi de carro.','Alice não foi de bicicleta e não foi de metrô.','Cada pessoa usou um transporte diferente.'], question:'Como Eva chegou?', options:['Ônibus','Metrô','Bicicleta','Caminhada','Carro'], correctIndex:2, explanation:'Metrô, caminhada e carro já foram usados. Alice não foi de bicicleta, então foi de ônibus. A bicicleta sobra para Eva.' },
            { id:'d13', level:'dificil', scenario:'Cinco caixas guardam documentos, fotografias, ferramentas, remédios e linhas de costura.', clues:['Documentos estão na caixa 1.','Linhas estão na caixa 5.','Fotografias ficam logo antes das ferramentas.','Remédios ficam depois das ferramentas e antes das linhas.'], question:'Em qual caixa estão as ferramentas?', options:['Caixa 1','Caixa 2','Caixa 3','Caixa 4','Caixa 5'], correctIndex:2, explanation:'Documentos e linhas ocupam as pontas. Fotografias vêm logo antes das ferramentas, e remédios vêm depois. As ferramentas ficam na caixa 3.' },
            { id:'d14', level:'dificil', scenario:'Cinco barracas vendem frutas, queijos, flores, artesanato e pães, em posições de 1 a 5.', clues:['Frutas ficam na barraca 1.','Pães ficam na barraca 5.','Flores ficam logo depois dos queijos.','Artesanato fica depois das flores e antes dos pães.'], question:'Qual produto está na barraca 2?', options:['Frutas','Queijos','Flores','Artesanato','Pães'], correctIndex:1, explanation:'Frutas e pães ocupam as pontas. Queijos vêm logo antes de flores, e artesanato vem depois. Os queijos ficam na barraca 2.' },
            { id:'d15', level:'dificil', scenario:'Cinco ritmos serão tocados: valsa, samba, forró, chorinho e bolero.', clues:['A valsa abre a apresentação.','O bolero encerra a apresentação.','O samba será tocado logo antes do forró.','O chorinho será tocado depois do forró e antes do bolero.'], question:'Qual ritmo será o terceiro?', options:['Valsa','Samba','Forró','Chorinho','Bolero'], correctIndex:2, explanation:'Valsa e bolero ficam nas pontas. Samba vem logo antes de forró, e chorinho vem depois. O forró será o terceiro ritmo.' }
        ]);

        PUZZLES = PUZZLES.map(function (puzzle) {
            var limite = puzzle.level === 'facil' ? 3 : (puzzle.level === 'medio' ? 4 : 6);
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

    function initGame(newRound) {
        if (newRound !== false || !levelPuzzles.length) {
            if (!initGame.filas) initGame.filas = {};
            var fila = initGame.filas[currentLevel] || [];
            while (fila.length < totalPuzzles) fila = fila.concat(shuffleArray(getPuzzlesForLevel(currentLevel).slice()));
            levelPuzzles = fila.splice(0, totalPuzzles);
            initGame.filas[currentLevel] = fila;
        }

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
        document.getElementById('puzzleContainer').setAttribute('aria-label', 'Desafio de nível ' + getDifficultyLabel(currentLevel));
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
            initGame(true);
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
        initGame(true);
    }

    document.querySelectorAll('.dif-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            changeDifficulty(this.dataset.dif);
        });
    });

    document.getElementById('btn-next').addEventListener('click', nextPuzzle);
    document.getElementById('btn-restart').addEventListener('click', function() {
        if (currentPuzzleIndex > 0 || answered) {
            exibirConfirmacao('Tem certeza?', 'Seu progresso atual será perdido.', function() { initGame(false); });
        } else initGame(false);
    });

    generatePuzzles();
    window.MenteAtivaDeduction = {
        getPuzzles: function() { return PUZZLES.map(function(puzzle) { return Object.assign({}, puzzle); }); }
    };
    initGame(true);
});
