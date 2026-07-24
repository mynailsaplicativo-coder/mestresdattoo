const translations = {
    pt: {
        nav: {
            manifesto: "Manifesto",
            history: "História",
            era: "Era de Ouro",
            highlights: "Destaques 2025",
            ranking: "Top Artistas",
            interviews: "Entrevistas",
            events: "Eventos",
            quiz: "Quiz",
            shop: "Ferramentas"
        },
        hero: {
            line1: "O Corpo é o Templo.",
            line2: "A Tinta é a Alma.",
            line3: "A Arte é Eterna.",
            text: "Mestres da Tattoo não é sobre tendências. É sobre legado. <br> Respeitamos a história, a técnica e sagramos a pele.",
            signature: "Bem-vindo ao templo.",
            manifesto: {
                p1: "A tatuagem não nasce da pressa.<br>Ela nasce do tempo, da mão firme e da história que atravessa a pele.",
                p2: "Antes de ser moda, foi rito.<br>Antes de ser mercado, foi linguagem.<br>Cada linha carrega quem veio antes — mestres, marginais, marinheiros, aprendizes.",
                p3: "Aqui a tatuagem é compromisso.<br>Com a técnica, com a ética, com o desenho bem feito.<br>Com a pele de quem confia e com a memória de quem ensinou.",
                p4: "Honramos o passado para não trair o presente.<br>E seguimos marcando o futuro, uma pele de cada vez.",
                signature: "A tatuagem não pede permissão.<br>Ela permanece."
            }
        },
        headers: {
            history: "História e Cultura",
            era: "A Era de Ouro",
            eraDesc: "Homenagem aos pioneiros que construíram as fundações da tatuagem moderna.",
            highlights: "Destaques",
            ranking: "Top Artistas pelo Mundo",
            interviews: "Entrevistas & Documentários",
            events: "Calendário de Eventos",
            eventsDesc: "Fique por dentro das principais convenções do Brasil e do mundo.",
            brazil: "BRASIL 🇧🇷",
            international: "Lendas da Era de Ouro",
            internationalLabel: "INTERNACIONAL 🌍",
            quiz: "Descubra Seu Estilo",
            quizDesc: "Responda a 5 perguntas visuais e encontre o artista perfeito para você.",
            tools: "Ferramentas MESTRES",
            magazine: "Mestres Magazine",
            magazineIssue: "Edição #1",
            magazineHeadline: "O Renascimento da Arte na Pele",
            partners: "Parceiros Oficiais"
        },
        buttons: {
            readMore: "Ler Artigo",
            viewMatter: "Ver Matéria",
            viewWork: "Ver Obra",
            viewList: "Ver Lista Completa",
            viewProfile: "Ver Perfil",
            startQuiz: "Iniciar Quiz",
            close: "Fechar",
            knowMore: "Conhecer",
            readDigital: "Ler Digital"
        },
        table: {
            month: "Mês",
            event: "Evento",
            location: "Local"
        },
        months: {
            JAN: "JAN", FEV: "FEV", MAR: "MAR", ABR: "ABR", MAI: "MAI", JUN: "JUN",
            JUL: "JUL", AGO: "AGO", SET: "SET", OUT: "OUT", NOV: "NOV", DEZ: "DEZ"
        },
        footer: {
            manifesto: "Manifesto",
            ranking: "Ranking",
            magazine: "Magazine",
            contact: "Contato",
            copy: "&copy; 2026 MESTRES DA TATTOO. Todos os direitos reservados. <br> Autoridade Underground."
        },
        quiz: {
            questions: [
                {
                    question: "O que mais chama sua atenção em uma arte?",
                    choices: [
                        { text: "Traços fortes e cores vibrantes", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Sombras suaves e fidelidade à realidade", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Linhas finas, delicadeza e precisão", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Significado ancestral e formas geométricas", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "Qual o tamanho da sua coragem (e da tatuagem)?",
                    choices: [
                        { text: "Fechamento de braço/costas", style: "Realismo" },
                        { text: "Média, talvez no antebraço", style: "Old School" },
                        { text: "Pequena e discreta", style: "Fine Line" },
                        { text: "Adaptável ao corpo", style: "Tribal" }
                    ]
                },
                {
                    question: "Cores ou Preto e Cinza?",
                    choices: [
                        { text: "Colorido e Sólido", style: "Old School" },
                        { text: "Preto e Cinza (Sombra)", style: "Realismo" },
                        { text: "Apenas Preto (Linha)", style: "Fine Line" },
                        { text: "Preto Sólido (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "O que a tattoo representa para você?",
                    choices: [
                        { text: "História e Tradição (Marinha/Vintage)", style: "Old School" },
                        { text: "Retrato ou Homenagem Eterna", style: "Realismo" },
                        { text: "Estética e Minimalismo", style: "Fine Line" },
                        { text: "Conexão Espiritual/Guerreira", style: "Tribal" }
                    ]
                },
                {
                    question: "Para te indicarmos um mestre, onde você está?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "Sul (RS/SC/PR)", value: "SUL" },
                        { text: "Nordeste (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Centro-Oeste (DF/GO...)", value: "CENTRO" },
                        { text: "Outro / Internacional", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Seu Estilo Predominante é:",
            resultDesc: "Calculando recomendação...",
            recommendationTitle: "Mestres Recomendados na sua Região:"
        },
        ranking: {
            artistLink: "Link do Artista",
            viewProfile: "Ver Perfil"
        },
        articles: {
            'mondial_era': {
                title: 'Mondial de la Tatouage: o fim de uma era, o início da eternidade',
                description: 'O Mondial se despede não como quem termina, mas como quem se torna lenda.',
                category: 'História',
                author: 'Redação Mestres',
                date: '2026',
                headerImage: 'assets/highlight-mondial-event-v3.jpg',
                content: `<div class="article-intro">
                    <p>Há eventos que não acontecem apenas no calendário — eles acontecem na história. O Mondial de la Tatouage, realizado em Paris, é um deles. Em sua última edição neste ano, o Mondial se despede não como quem termina, mas como quem se torna lenda.</p>
                </div>
                <div class="video-container" style="margin: 2rem 0;">
                    <video controls style="width: 100%; border-radius: 4px;">
                        <source src="assets/videos/mondial-video.mp4" type="video/mp4">
                        Seu navegador não suporta vídeo.
                    </video>
                    <p style="font-size: 0.9em; color: #888; text-align: center; margin-top: 5px;">Mondial: O último suspiro de uma lenda.</p>
                </div>
                <div class="article-section">
                    <h2>A Missão de Tin-Tin</h2>
                    <p>Criado no final dos anos 1990 por Tin-Tin, um dos grandes nomes da tatuagem mundial, o Mondial nasceu com uma missão clara e quase artesanal: dar dignidade, palco e respeito à tatuagem como arte. Em uma época em que a tatuagem ainda era vista com desconfiança, o evento levantou bandeiras antigas — técnica, disciplina, tradição, linhagem — e as colocou sob as luzes de Paris.</p>
                </div>
                <div class="article-section">
                    <h2>Ponto de Encontro</h2>
                    <p>Ao longo de décadas, o Mondial se tornou mais do que uma convenção. Virou ponto de encontro de mestres e aprendizes, de estilos que atravessam oceanos, de máquinas que cantam como antigamente. Japonês tradicional, old school, realismo, tribal, blackwork — todos coexistindo com respeito, silêncio quando preciso, e orgulho do ofício.</p>
                </div>
                <div class="article-section">
                    <h2>O Legado Continua</h2>
                    <p>O Mondial termina, mas o que ele construiu continua gravado onde a arte mais importa: na pele, na memória e no coração da tatuagem mundial. Algumas histórias não acabam. Elas apenas param de ser contadas em voz alta — e passam a ser sussurradas pelas máquinas.</p>
                </div>`
            },
            'mondial': {
                title: 'Brasil no pódio do Mondial du Tatouage: tradição que atravessa oceanos',
                description: 'Artistas brasileiros conquistam destaque em Paris.',
                category: 'Orgulho Nacional',
                author: 'Redação Mestres',
                date: 'FEV 2026',
                headerImage: 'assets/highlight-mondial-group-v3.jpg',
                content: `<div class="article-intro">
                    <p>Na última edição do Mondial du Tatouage, realizada em Paris, artistas brasileiros conquistaram o segundo lugar em uma das competições mais importantes da tatuagem mundial. Um feito que não nasce do acaso, mas de anos de disciplina, respeito à tradição e ousadia criativa.</p>
                </div>
                <div class="article-section">
                    <h2>Entre Máquinas e História</h2>
                    <p>Fernando Tampa, Cris Nieiro e Jean Mogno levaram para o palco europeu uma tatuagem que fala alto mesmo em silêncio: técnica apurada, composição precisa e uma narrativa visual que honra o passado enquanto aponta para o futuro.</p>
                </div>
                <div class="article-section">
                    <h2>Ritual Contemporâneo</h2>
                    <p>O Mondial sempre foi mais que uma convenção — é um ritual contemporâneo da tatuagem mundial. Estar entre os melhores ali é reafirmar que o Brasil não apenas acompanha a cena internacional, mas ajuda a moldá-la. Entre máquinas, tinta e história, o recado foi dado: a tatuagem brasileira segue viva, relevante e impossível de ignorar.</p>
                </div>`
            },
            'polynesia': {
                title: 'O Significado Sagrado da Tatuagem Polinésia',
                description: 'Uma viagem profunda às raízes tribais e o significado de cada símbolo.',
                category: 'Origins',
                author: 'Mestre Ka’eo',
                date: '27 JAN 2026',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>"Na Polinésia, não existe tatuagem sem Mana. Cada linha, cada curva e cada espaço vazio conta a história de quem você foi, quem você é e quem você deseja se tornar."</p></div>
                <div class="article-section">
                    <h2>A Origem Sagrada</h2>
                    <p>Cerca de 2000 anos atrás, o povo Lapita começou sua grande migração pelo Pacífico. Com eles, levaram não apenas suprimentos, mas uma arte sagrada. A palavra "Tatau", que significa "bater" ou "marcar", refere-se ao som rítmico das ferramentas tradicionais batendo na pele.</p>
                    <p>Ao contrário da tatuagem moderna, que foca na estética, a Tatau era um rito de passagem. Um homem sem tatuagens era considerado "nu" e sem status social. As marcas indicavam clã, habilidade em batalha e proteção espiritual.</p>
                </div>
                <div class="article-section">
                    <h2>Símbolos e Significados</h2>
                    <p><strong>Enata:</strong> Representa figuras humanas e deuses. Usado para contar histórias de casamento, família e guerreiros derrotados.</p>
                    <p><strong>Dentes de Tubarão:</strong> Símbolo de proteção, orientação e força. Os tubarões eram vistos como deuses do mar.</p>
                    <p><strong>Pontas de Lança:</strong> Coragem e luta. Um guerreiro tatuado com pontas de lança carregava a promessa de defender seu povo até a morte.</p>
                </div>
                <div class="article-section">
                    <h2>O Renascimento Moderno</h2>
                    <p>Após quase ser extinta pelos missionários europeus no século 19, a arte Polinésia vive um renascimento global. Hoje, tatuadores como Sulu'ape na Samoa e Keone Nunes no Havaí lutam para manter a pureza das ferramentas e dos rituais, garantindo que o Mana nunca se perca.</p>
                </div>`
            },
            'brasil': {
                title: 'História da Tatuagem no Brasil',
                description: 'Tudo começou no Porto de Santos com Lucky Tattoo.',
                category: 'História Nacional',
                author: 'Luiz "Cais" Pereira',
                date: '15 FEV 2026',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>O Brasil, com sua mistura cultural explosiva, é terreno fértil para a arte na pele. Mas tudo começou oficialmente em um pequeno estúdio no Porto de Santos, onde o cheiro de maresia se misturava ao zumbido de uma máquina elétrica.</p></div>
                <div class="article-section">
                    <h2>Lucky Tattoo: O Pioneiro (1959)</h2>
                    <p>Knud Harald Lykke Gregersen, o "Lucky", foi o primeiro tatuador profissional a se estabelecer no Brasil. Dinamarquês de nascimento, ex-marinheiro e desenhista, ele trouxe a máquina elétrica e a mística do "Old School" europeu para o cais santista.</p>
                    <p>Seus clientes eram prostitutas, marinheiros e malandros. A tatuagem no Brasil nasceu marginal, perigosa e irresistível. Lucky não vendia apenas desenhos; vendia coragem.</p>
                </div>
                <div class="article-section">
                    <h2>A Explosão nos Anos 80 e 90</h2>
                    <p>Foi preciso esperar décadas para que a tatuagem saísse das sombras. Nos anos 80, o Caio Tattoo no Rio e o Marco Leão em São Paulo começaram a profissionalizar o setor. A chegada de materiais importados e a troca de informações com o exterior permitiram que o Brasil desenvolvesse um estilo próprio.</p>
                </div>
                <div class="article-section">
                    <h2>O Brasil no Topo do Mundo</h2>
                    <p>Hoje, o Brasil é uma potência mundial. Nomes como Ralf Nonnweiler, Chico Morbene e Karlla Mendes são reverenciados globalmente. Das favelas aos bairros nobres, a tatuagem se tornou a expressão máxima da identidade brasileira: colorida, diversa e tecnicamente impecável.</p>
                </div>`
            },
            'origins': {
                title: 'A Origem da Tatuagem: Marcas Milenares',
                description: 'Ötzi e as marcas terapêuticas de 5300 anos atrás.',
                category: 'História Profunda',
                author: 'Dra. Elena "Ink" Bianchi',
                date: '02 ABR 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>Antes da escrita, antes das pirâmides, havia a marca na pele. A necessidade humana de se modificar é tão antiga quanto a própria consciência.</p></div>
                <div class="article-section">
                    <h2>Ötzi: O Homem do Gelo</h2>
                    <p>Em 1991, alpinistas encontraram um corpo preservado no gelo dos Alpes. Ötzi viveu há 5.300 anos e carregava 61 tatuagens. O mais fascinante? Elas estavam localizadas em pontos de acupuntura, sugerindo que a tatuagem nasceu como uma forma primitiva de medicina para tratar artrite e dor.</p>
                </div>
                <div class="article-section">
                    <h2>Egito e as Sacerdotisas</h2>
                    <p>Múmias egípcias de mulheres, como a de Amunet, revelam tatuagens geométricas no abdômen e coxas. Acredita-se que serviam como proteção durante a gravidez e o parto, invocando a deusa Bes. A tinta era fuligem, a agulha era bronze, mas o propósito era divino.</p>
                </div>`
            },
            'modern': {
                title: 'Da Pele às Galerias: A Nova Era',
                description: 'A tatuagem como Belas Artes no Louvre.',
                category: 'Revolução Visual',
                author: 'Curadora Anna "Canvas"',
                date: '22 MAI 2026',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>O que antes era símbolo de rebeldia, hoje ocupa o Louvre. A pele se tornou o canvas definitivo da arte contemporânea.</p></div>
                <div class="article-section">
                    <h2>A Queda do Preconceito</h2>
                    <p>Até os anos 90, tatuagem era "coisa de cadeia" ou "de marinheiro". Hoje, advogados, médicos e celebridades exibem braços fechados. O que mudou? A qualidade. Com o Realismo, o Pontilhismo e o Aquarela, a técnica superou o estigma.</p>
                </div>
                <div class="article-section">
                    <h2>Artistas ou Tatuadores?</h2>
                    <p>A linha se apagou. Tatuadores modernos estudam teoria das cores, composição e anatomia com o rigor de mestres renascentistas. Uma sessão com um mestre hoje pode custar mais que uma pintura a óleo. E diferentemente da tela, a tatuagem respira, envelhece e morre com seu portador. É a arte mais efêmera e, por isso, a mais preciosa.</p>
                </div>`
            },
            'sailor': {
                title: 'Sailor Jerry: O Pai do Old School',
                description: 'O pai do Old School americano. Seus flashs definiram uma era.',
                category: 'Lenda Viva',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>"Eu não tenho nem um centímetro de pele virgem que não tenha sido marcada por uma agulha." - Norman 'Sailor Jerry' Collins.</p></div>
                <div class="article-section">
                    <h2>Honolulu, Segunda Guerra Mundial</h2>
                    <p>Imagine o Havaí nos anos 40. Milhares de marinheiros em licença, sabendo que poderiam não voltar do Pacífico. Eles queriam lembrar de casa, de amores e de coragem. Sailor Jerry lhes deu isso.</p>
                </div>
                <div class="article-section">
                    <h2>Inovação Técnica</h2>
                    <p>Jerry não foi apenas um desenhista; ele foi um cientista. Ele expandiu a paleta de cores (criando o roxo pioneiro), modernizou as máquinas de tatuagem para menos trauma na pele e foi o primeiro a introduzir esterilização hospitalar. Seu estilo — linhas pretas grossas, sombreamento simples e cores sólidas — foi feito para resistir ao tempo e ao sol.</p>
                </div>
                <div class="article-section">
                    <h2>O Legado</h2>
                    <p>Hoje, as andorinhas (voltar para casa), os navios (a jornada), as águias (Honra) e os corações "MOM" são a base da tatuagem tradicional americana. Ed Hardy, seu aprendiz, levou esse legado para o mundo da moda e da arte, mas a alma do estilo permanece nas ruas de Honolulu.</p></div>`
            },
            'whangod': {
                title: 'Whang-od: A Última Mambabatok',
                description: 'A última Mambabatok de Kalinga. Guardiã da tradição.',
                category: 'Ancestralidade',
                author: 'Apo Whang-od',
                date: 'LENDA VIVA',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>Nas montanhas remotas de Kalinga, nas Filipinas, uma mulher centenária segura um espinho de pomelo e um bastão de bambu. O som é hipnótico: "Tok, tok, tok". É Whang-od, tatuando a história de seu povo.</p></div>
                <div class="article-section">
                    <h2>A Guardiã do Batik</h2>
                    <p>Tradicionalmente, apenas guerreiros que matavam inimigos em batalha podiam receber as tatuagens de Kalinga. Mulheres as recebiam por beleza. Whang-od viu os guerreiros desaparecerem, mas recusou-se a deixar a arte morrer. Ela começou a tatuar turistas que peregrinavam até sua aldeia, Buscalan.</p>
                </div>
                <div class="article-section">
                    <h2>Quebrando Tabus</h2>
                    <p>A tradição dizia que a arte só podia ser passada para parentes de sangue. Sem filhos, Whang-od treinou suas sobrinhas-netas, Grace e Elyang, garantindo que o "bater" do bambu continue ecoando pelas montanhas. Ela não é apenas uma tatuadora; ela é um monumento vivo da resistência cultural indígena.</p></div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III: A Alma do Japão',
                description: 'Mestre supremo do Irezumi japonês. Uma lenda viva.',
                category: 'Mestre do Irezumi',
                author: 'Yoshihito Nakano',
                date: 'LENDA VIVA',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>Yoshihito Nakano, o Horiyoshi III, não é apenas um tatuador. Ele é um guardião de mitos, lendas e demônios japoneses.</p></div>
                <div class="article-section">
                    <h2>O Caminho do Tebori</h2>
                    <p>Embora use máquinas para linhas, Horiyoshi insiste no "Tebori" (tatuagem manual com vara de bambu) para o sombreamento e cores. Ele acredita que a máquina insere a tinta, mas o Tebori insere a alma. O processo é mais doloroso e demorado, mas cria uma textura e densidade de cor que nenhuma máquina consegue replicar.</p>
                </div>
                <div class="article-section">
                    <h2>Bodysuits e Narrativas</h2>
                    <p>O Irezumi tradicional cobre o corpo inteiro como um traje. Horiyoshi desenha dragões, carpas, samurais e a Fênix não como desenhos isolados, mas como uma narrativa única que flui com os músculos do cliente. Ser tatuado por ele é entrar para a história da arte japonesa.</p></div>`
            },
            'filip': {
                title: 'Filip Leu: O Dragão Psicodélico',
                description: 'Pioneiro do estilo biomecânico e grandes composições.',
                category: 'Inovação Suíça',
                author: 'The Leu Family',
                date: 'LENDA VIVA',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>Nascido na lendária Família Leu, nômades artísticos, Filip cresceu vendo o mundo como arte. Ele revolucionou a tatuagem ocidental ao fundir o fluxo japonês com temas biomecânicos e psicodélicos.</p></div>
                <div class="article-section">
                    <h2>O Fluxo Perfeito</h2>
                    <p>A maior contribuição de Filip é a forma como ele trabalha com a anatomia. Ele não coloca um desenho "no" braço; ele faz o desenho "ser" o braço. Seus dragões e crânios distorcidos encaixam-se perfeitamente nas curvas do corpo, criando uma ilusão de movimento orgânico.</p>
                </div>
                <div class="article-section">
                    <h2>Influência Global</h2>
                    <p>De seu estúdio na Suíça, ele influenciou praticamente todos os tatuadores modernos de grande escala. Seu estilo ensinou ao mundo que a tatuagem grande não precisa ser rígida; ela pode ser fluida, suave e aterrorizante ao mesmo tempo.</p></div>`
            },
            'lyle': {
                title: 'Lyle Tuttle: O Embaixador da Tattoo',
                description: 'Levou a arte das ruas para a capa da Rolling Stone.',
                category: 'Ícone Pop',
                author: 'Redação',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>Lyle Tuttle foi o homem que tirou a tatuagem dos becos escuros e a colocou sob os holofotes de Hollywood.</p></div>
                <div class="article-section">
                    <h2>A Revolução de São Francisco</h2>
                    <p>Em seu estúdio lendário em São Francisco, durante o Verão do Amor, Lyle tatuou Janis Joplin, Cher, Henry Fonda e os Allman Brothers. Quando Janis apareceu na capa da Rolling Stone exibindo sua tattoo (feita por Lyle), o estigma começou a ruir. Mulheres começaram a procurar tatuagens não como rebeldia, mas como adorno e libertação.</p>
                </div>
                <div class="article-section">
                    <h2>O Historiador</h2>
                    <p>Lyle viajou para todos os continentes, colecionando máquinas, ferramentas tribais e histórias. Ele entendeu antes de todos que a tatuagem era uma linguagem humana universal. Seu museu pessoal é a base de muito do que sabemos hoje sobre a história da nossa arte.</p></div>`
            },
            'edhardy': {
                title: 'Ed Hardy: O Padrinho da Tatuagem Moderna',
                description: 'Uniu o Oriente e o Ocidente. Elevou a tattoo a Belas Artes.',
                category: 'Padrinho da Moderna',
                author: 'Redação',
                date: 'LENDA VIVA',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Antes de virar marca de roupas, Ed Hardy foi o tatuador mais técnico e visionário de sua geração. Ele foi o elo perdido entre o Old School americano e a tradição japonesa.</p></div>
                <div class="article-section">
                    <h2>O Primeiro Acadêmico</h2>
                    <p>Hardy era formado em gravura e arte clássica. Ele recusou uma bolsa em Yale para tatuar. Foi o primeiro ocidental convidado a estudar no Japão com um mestre tradicional. Ele trouxe de volta não apenas desenhos, mas a mentalidade de tratar a tatuagem como uma forma de arte séria e complexa.</p>
                </div>
                <div class="article-section">
                    <h2>Tattoo City</h2>
                    <p>Em seu estúdio em São Francisco, ele introduziu o conceito de "Custom Tattoo" — tatuagens desenhadas exclusivamente para o cliente, aposentando os desenhos prontos da parede. Ele mudou a indústria de "escolha um desenho" para "crie uma arte".</p></div>`
            },
            'anavelho': {
                title: 'Ana Velho: A Mestra das Linhas',
                description: 'A Primeira Mulher Tatuadora no Brasil e sua história.',
                category: 'Pioneira Brasileira',
                author: 'Redação Mestres',
                date: '1980',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro">
                    <p>No começo da tatuagem moderna no Brasil, quando o mundo ainda olhava para a arte na pele com desconfiança e fascínio, surgiu uma mulher que rompia limites e bordava a sua própria história. <strong>Ana Velho</strong> — nome que pulsa forte nas veias do corpo da tatuagem brasileira — foi a primeira mulher a profissionalizar-se como tatuadora no Brasil e a dirigir um estúdio de tatuagem no padrão que hoje reconhecemos.</p>
                </div>
                <div class="article-section">
                    <h2>Tropical Tattoo: O Marco Zero</h2>
                    <p>Nascida no ritmo frenético do Rio de Janeiro, Ana não apenas se inseriu num universo dominado por homens, mas ergueu as bases do que viria a ser a tatuagem como profissão estruturada em terras brasileiras. Foi ela quem, em <strong>março de 1980</strong>, fundou e dirigiu uma das primeiras lojas de tatuagem modernas do país, a <strong>Tropical Tattoo</strong>, localizada na famosa galeria da rua Visconde de Pirajá, em Ipanema — um ponto simbólico que atraiu artistas, jovens e navegantes do corpo tatuado.</p>
                </div>
                <div class="article-section">
                    <h2>Coragem e Técnica</h2>
                    <p>Naquela época, a tatuagem ainda se debatia entre a marginalidade e a curiosidade cultural. O estigma social perseguia quem ousava marcar a pele e, especialmente, quem optava por tatuar outras pessoas. Ainda assim, Ana Velho trançou coragem e delicadeza, tatuando com técnica e sensibilidade em um Brasil que começava a redescobrir o corpo como lugar de expressão e pertencimento.</p>
                </div>
                <div class="article-section">
                    <h2>Pioneirismo Feminino</h2>
                    <p>O pioneirismo de Ana não foi apenas técnico — foi simbólico. Ela abriu portas para mulheres que, depois dela, ingressaram nesse ofício com alma e vigor. A presença feminina na tattoo, antes quase inexistente na cena profissional, começou a ganhar formas e vozes. Sua trajetória inspirou eventos como a <strong>TattooGirls</strong>, convenção dedicada especialmente às tatuadoras brasileiras — onde seu nome e legado continuaram a ecoar.</p>
                </div>
                <div class="article-section">
                    <h2>🪩 O Legado Gravado na Pele do Tempo</h2>
                    <p>Ana Velho não foi apenas a primeira — ela foi uma ponte entre gerações. Uma artesã do corpo que ensinou ao Brasil que tatuagem é arte que respira e que a pele é tela viva.</p>
                    <p>Hoje, quando olhamos para as novas gerações de tatuadoras brasileiras — fortes, ousadas, criativas — vemos o traço inicial que Ana cravou na história como quem escreve com sangue e beleza. Seu legado pulsa na prática da tatuagem profissional, na ascensão feminina no ofício e na cultura que agora celebra com orgulho essa forma de expressão ancestral e moderna ao mesmo tempo.</p>
                </div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler: O Poeta do Realismo na Pele',
                description: 'Ralf Nonnweiler transcende a simples aplicação de tinta: ele captura alma em preto e cinza.',
                category: 'Mestre do Realismo',
                author: 'Redação Mestres',
                date: 'HOJE',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro">
                    <p>No universo da tatuagem — onde cada linha é um sopro de vida íntima — poucos artistas conseguem fundir técnica e emoção com a intensidade de um retrato vivo. <strong>Ralf Nonnweiler</strong> é um desses raros nomes que transcende a simples aplicação de tinta: ele captura alma em preto e cinza, traduzindo memórias e mitos em tatuagens que muitas vezes parecem mais fotografias do que arte no corpo humano.</p>
                </div>
                <div class="article-section">
                    <h2>🌑 O Homem por Trás da Agulha</h2>
                    <p>Nascido e radicado na Alemanha, Ralf construiu sua reputação no terreno árduo e exigente do realismo em preto e cinza — um estilo que, na mão dele, não é apenas técnica, mas poesia visual. Sua arte se estende por retratos humanos e de animais, cenas inspiradas no cinema, na televisão e no imaginário horrífico, sempre com um nível de profundidade que beira o hipnotizante. Ele comanda o <strong>NoArts! Tattoo Studio</strong>, um espaço onde a tatuagem deixa de ser decoração corporal e se torna narrativa viva.</p>
                </div>
                <div class="article-section">
                    <h2>🔍 A Arte que Confunde Olhos e Coração</h2>
                    <p>O que torna Ralf tão especial não é apenas a precisão técnica — que já seria suficiente para colocá-lo em outro patamar —, mas sua capacidade de evocar emoção e profundidade a partir de sombras e tons de cinza. Seus retratos têm aquela qualidade estranha e bela de fazer quem os vê se perguntar: “Será que é uma foto… ou uma tatuagem?” Essa magia estética é o que distingue um tatuador exemplar de um verdadeiro mestre.</p>
                </div>
                <div class="article-section">
                    <h2>🧪 Influência e Legado</h2>
                    <p>Além de seu trabalho na pele de clientes, Ralf também colaborou com marcas do setor, como a fabricante de tintas <strong>Panthera Ink</strong>, assinando produtos que refletem seu entendimento delicado e técnico das nuances tonais — ferramentas pensadas para artistas que buscam alcançar níveis elevados de realismo. Isso o coloca não apenas como artista, mas como um mentor indireto de tatuadores que usam suas séries de tintas.</p>
                </div>
                <div class="article-section">
                    <h2>🌍 O Mundo na Pele</h2>
                    <p>No cenário global da tatuagem, Ralf é frequentemente citado como referência entre praticantes e entusiastas do realismo. Sua presença online — especialmente no Instagram, onde ele compartilha trabalhos e processos criativos — alimenta um ciclo de aprendizado e admiração que se estende de novatos curiosos a veteranos em busca de evolução. Mais que um artista, ele representa uma ponte entre a arte clássica e a tatuagem contemporânea.</p>
                </div>`
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: O Colecionador de Peles',
                description: 'O médico que salvou a arte do Irezumi da extinção.',
                category: 'História',
                author: 'Redação',
                date: '27 JAN 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>No Japão do começo do século XX, tatuagem era proibida e malvista. Foi aí que surgiu Dr. Fukushi Masaichi, um médico patologista que enxergou nas tatuagens dos trabalhadores e criminosos um patrimônio cultural digno de ser preservado.</p></div>
                <div class="article-section">
                    <h2>Uma Coleção Única</h2>
                    <p>Fukushi frequentava casas de banho públicas e a prisão para encontrar obras-primas do Irezumi. Ele pagava aos donos das tatuagens para que, após a morte, ele pudesse preservar suas peles. Ele catalogou mais de 2.000 fotos e preservou dezenas de peles reais, mantendo vivas as obras de mestres antigos que, sem ele, teriam desaparecido no pó.</p>
                </div>
                <div class="article-section">
                    <h2>Ciência e Arte</h2>
                    <p>Seu trabalho ajudou a entender como o pigmento se comporta na derme a longo prazo. Hoje, sua coleção na Universidade de Tóquio é um local de peregrinação (restrita) para estudiosos da tatuagem mundial.</p></div>`
            },
            'burchett': {
                title: 'George Burchett: O Rei dos Tatuadores',
                description: 'Do front de guerra aos palácios reais.',
                category: 'Realeza Britânica',
                author: 'Arquivo',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>George Burchett foi o primeiro "Celebrity Tattoo Artist" do mundo, muito antes do termo existir. Ele tatuou reis, marajás e lordes ingleses, mas nunca deixou de atender os marinheiros em Waterloo Road.</p></div>
                <div class="article-section">
                    <h2>Um Cavalheiro com uma Máquina</h2>
                    <p>Burchett lutou para legitimar a tatuagem como profissão respeitável. Ele mantinha seu estúdio limpo como um consultório médico e vestia-se como um doutor. Sua habilidade em cobrir cicatrizes de guerra e melhorar tatuagens antigas o tornou famoso em toda a Europa.</p>
                </div>
                <div class="article-section">
                    <h2>O Diário de um Mestre</h2>
                    <p>Suas memórias, "Memoirs of a Tattooist", são um documento vital da era vitoriana e eduardiana, mostrando como a tatuagem cruzava classes sociais em um império onde o sol nunca se punha.</p></div>`
            },
            'jessie': {
                title: 'Jessie Knight: A Dama da Agulha',
                description: 'A primeira mulher a tatuar profissionalmente no Reino Unido.',
                category: 'Pioneira',
                author: 'Redação',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>Jessie Knight era um furacão. Nascida em uma família de artistas de circo e atiradores, ela não tinha medo de nada. Quando pegou na máquina de tatuar, ela dominou a arte com a mesma precisão que usava para atirar.</p></div>
                <div class="article-section">
                    <h2>Ousadia e Estilo</h2>
                    <p>Seu estilo era único: ela desenhava à mão livre (freehand) direto na pele, sem estêncil, um feito de coragem absurda. Seus desenhos eram fluidos, femininos e fortes. Ela ganhou o segundo lugar no campeonato "Champion Tattoo Artist of All England" em 1955, chocando os juízes conservadores.</p>
                </div>
                <div class="article-section">
                    <h2>Legado</h2>
                    <p>Depois de se aposentar, seu trabalho foi redescoberto décadas depois. Hoje, Jessie é o ícone máximo para mulheres na indústria, provando que talento não tem gênero e que a arte verdadeira sempre encontra seu lugar.</p></div>`
            },
            // NOVOS ARTISTAS INTERNACIONAIS
            paulbooth: { name: "Paul Booth", years: "1968 - Presente", description: "Blackwork, dark art e identidade. O mestre do horror surrealista." },
            bobtyrrell: { name: "Bob Tyrrell", years: "1962 - Presente", description: "Realismo preto e cinza que virou escola mundial." },
            jackrudy: { name: "Jack Rudy", years: "1954 - Presente", description: "Pai do Black & Grey Single Needle e estilo Chicano." },
            freddynegrete: { name: "Freddy Negrete", years: "1956 - Presente", description: "Fundador do realismo Chicano e lenda das prisões." },
            leozulueta: { name: "Leo Zulueta", years: "1952 - Presente", description: "O pai do Neo-tribal moderno e resgate ancestral." },
            guyaitchison: { name: "Guy Aitchison", years: "1968 - Presente", description: "Bio-orgânico e teoria da tatuagem avançada." },
            henk: { name: "Henk Schiffmacher", years: "1952 - Presente", description: "Hanky Panky. História viva e curadoria mundial." },
            amijames: { name: "Ami James", years: "1972 - Presente", description: "Popularização global da tattoo e estúdio icônico." },
            nikko: { name: "Nikko Hurtado", years: "1981 - Presente", description: "O rei do realismo colorido contemporâneo." },
            katvond: { name: "Kat Von D", years: "1982 - Presente", description: "Impacto cultural, retratos e uma nova geração." },
            horiyasu: { name: "Horiyasu", years: "1953 - Presente", description: "Tradição japonesa (Tebori) preservada fora do Japão." },
            micktattoo: { name: "Mick Tattoo", years: "Lenda Viva", description: "Técnica fina, consistência e referência internacional." },

            // NOVOS ARTISTAS BRASILEIROS
            inacio: { name: "Inácio da Glória", years: "Pioneiro", description: "Fundador de linguagem e ética profissional no Brasil." },
            mauricio: { name: "Maurício Teodoro", years: "1966 - Presente", description: "Pilar técnico e referência do Oriental no Brasil." },
            estopa: { name: "Estopa", years: "1950 - 2020", description: "Rua, atitude e influência direta na cena biker." },
            alemao: { name: "Alemão", years: "Tradição", description: "Tradição, consistência e respeito absoluto na cena." },
            beicinho: { name: "Beicinho", years: "Ícone", description: "Ícone cultural da tattoo brasileira e velha guarda." },
            betosata: { name: "Beto Sata", years: "Pioneiro", description: "Personalidade, história e estrada. O Rock n Roll da tattoo." },
            bruxo: { name: "Bruxo", years: "Mítico", description: "Estilo autoral e presença mítica no underground." },
            russo: { name: "Russo", years: "Formador", description: "Cena, convenção e formação de novos artistas." },
            tyrone: { name: "Tyrone", years: "Internacional", description: "Peso internacional e identidade forte no Black & Grey." },
            tyes: { name: "Tyes", years: "Técnica", description: "Consolidação técnica e influência direta." },
            caio: { name: "Caio", years: "Velha Guarda", description: "Parte fundamental da transição para o tattoo moderno." },
            'steve': {
                title: 'Steve Butcher e Yomico Moreno: Gigantes em Cena',
                description: 'O encontro histórico dos mestres do realismo na Tattoo Week SP 2025.',
                category: 'Encontro de Gigantes',
                author: 'Redação Mestres',
                date: 'NOV 2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro">
                    <p>Na 13ª edição da Tattoo Week São Paulo — realizada de 14 a 16 de novembro de 2025 no Expo Center Norte — a arte na pele ganhou um tom ainda mais internacional e visceral graças à presença de <strong>Steve Butcher</strong> e <strong>Yomico Moreno</strong>, dois dos artistas mais reverenciados do tatuador contemporâneo.</p>
                </div>
                <div class="article-section">
                    <h2>🔥 Steve Butcher: Hiper-Realismo</h2>
                    <p>Steve Butcher, vindo diretamente dos Estados Unidos, é conhecido mundialmente por seu trabalho em realismo 3D e retratos hiper-detalhados — peças que mais parecem esculturas vivas sobre a pele. Sua presença em São Paulo foi um dos momentos mais aguardados, atraindo fãs que queriam absorver conhecimento que atravessa fronteiras.</p>
                </div>
                <div class="article-section">
                    <h2>🖤 Yomico Moreno: Alma Latina</h2>
                    <p>Do outro lado do espectro técnico, Yomico Moreno trouxe ao público de São Paulo seu talento fenomenal em realismo preto e cinza. Natural da Venezuela e radicado na Espanha, Yomico transborda emoção em cada detalhe, fazendo da tatuagem um registro de lembranças, intensidade e narrativa visual.</p>
                </div>
                <div class="article-section">
                    <h2>🌍 Troca Cultural</h2>
                    <p>A presença de Steve Butcher e Yomico Moreno transformou a Tattoo Week 2025 num verdadeiro intercâmbio artístico: workshops, demonstrações e a convivência entre escolas distintas. Não foi apenas mais uma convenção: foi um ritual de convivência entre mestres da agulha.</p>
                </div>
                <div class="article-section">
                    <h2>✨ O Significado dos Gigantes</h2>
                    <p>A participação de artistas desse calibre ecoou na cena brasileira como um convite para pensar a tatuagem como arte global, contínua e viva. Foi um momento em que a pele deixou de ser só superfície — e virou história, encontro e inspiração internacional.</p>
                </div>`
            },
            'cris': {
                title: 'Cris Nieiro: Vitórias que Mudam Carreiras',
                description: 'Venceu AllStars e TattooWeek no mesmo fim de semana. Um feito histórico.',
                category: 'Campeão',
                author: 'Redação Mestres',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro">
                    <p>Existem vitórias que celebram um trabalho. E existem vitórias que mudam uma carreira. O último fim de semana foi desse segundo tipo para <strong>Cris Nieiro</strong>, que conquistou a AllStars Tattoo Convention e a TattooWeek — duas das competições mais respeitadas do cenário atual.</p>
                </div>
                <div class="article-section">
                    <h2>Um Feito Histórico</h2>
                    <p>Vencer uma já é difícil. Vencer as duas no mesmo fim de semana é raro. Vencer com a segurança e a qualidade que ele apresentou… isso é histórico. Na AllStars, as peças de Cris chamaram atenção pela força técnica e pela direção artística.</p>
                </div>
                <div class="article-section">
                    <h2>Colaboração e Domínio</h2>
                    <p>Na TattooWeek, ele venceu em colaboração com seu amigo <strong>@catolico_tattoo</strong>, superando artistas internacionais de altíssimo nível como Posco Losco, Kindamo e Web. Superar artistas dessa prateleira deixa claro: isso não é coincidência. É domínio. É consistência.</p>
                </div>
                <div class="article-section">
                    <h2>Evolução e Horizonte</h2>
                    <p>Filho de tatuador, Cris carrega a tatuagem como sobrenome, mas o que faz hoje é evolução e assinatura. Seu realismo cria atmosfera e profundidade emocional quase cinematográfica. O limite dele não está nas competições — está no horizonte. O Brasil não é promessa, é potência. E Cris Nieiro é prova disso.</p>
                </div>`
            },
            'neto': {
                title: 'Neto Coutinho: O Mestre Que Fez a Pele Falar Mais Alto',
                description: 'O artista coroado com o mais cobiçado título da convenção: Melhor do Evento.',
                category: 'Campeão',
                author: 'Redação Mestres',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro">
                    <p>Quando a Tattoo Week São Paulo abriu suas portas entre os dias 14 e 16 de novembro de 2025 no Expo Center Norte, o mundo da tatuagem respirou criação, suor e precisão. Entre mais de 3.500 expositores, 584 estandes e artistas de todos os cantos do planeta, um nome ressoou com brilho próprio: <strong>Neto Coutinho</strong> — de São Bernardo do Campo (ABC Paulista) — o artista coroado com o mais cobiçado título da convenção: <strong>Best of Show</strong> (Melhor do Evento).</p>
                </div>
                <div class="article-section">
                    <h2>Best of Show</h2>
                    <p>Esse prêmio é o ápice da competição, coroando o trabalho que mais impressionou jurados e público no conjunto da obra durante todo o festival. E não foi um detalhe menor: a peça vencedora foi criada ali mesmo, no calor do evento e sob os olhos de milhares de aficionados — um verdadeiro ato de coragem artística.</p>
                </div>
                <div class="article-section">
                    <h2>🎨 A Arte Que Ecoa</h2>
                    <p>A Tattoo Week, em sua 13ª edição, consolidou-se novamente como a celebração mais importante do tatuador contemporâneo, reunindo talentos e latitudes diversas. Neto, com sua técnica apurada e sensibilidade única, não apenas levou o título — ele imprimiu ali uma mensagem poderosa: a tatuagem é linguagem viva, pulsante, e pode ser tanto um espelho quanto uma janela para o mundo interior de quem a cria e de quem a recebe.</p>
                </div>
                <div class="article-section">
                    <h2>🪩 O Significado da Vitória</h2>
                    <p>Esse prêmio não é apenas um troféu: É a consagração de um caminho de dedicação, de noites em claro desenhando, de mãos firmes e olhos atentos — é receber o reconhecimento de uma comunidade inteira que respira pele, cor e estilo. Para Neto Coutinho, conquistar o título de Melhor do Evento é um selo de excelência no cenário nacional e internacional da tatuagem contemporânea.</p>
                </div>
                <div class="article-section">
                    <h2>🌍 Festival, Cultura e Movimento</h2>
                    <p>Mais do que um concurso, a Tattoo Week 2025 foi um ritual de expressão humana: debates, artistas lendários como Steve Butcher e Yomico Moreno, música e encontros que atravessaram fronteiras culturais. E, no meio disso tudo, um brasileiro — Neto Coutinho — levou sua interpretação do mundo para a pele e ganhou o coração de quem entende a tatuagem como arte maior.</p>
                </div>`
            },
            'milano': {
                title: 'BRASIL NO TOPO EM MILÃO 🇧🇷🏆',
                description: 'Quando a arte atravessa fronteiras, ela carrega nomes, histórias e legado.',
                category: 'Internacional',
                author: 'Redação Mestres',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro">
                    <p>O último fim de semana entrou para a história da tatuagem brasileira. Em um dos maiores palcos da tatuagem mundial, a <strong>Milano Tattoo Convention</strong>, três artistas brasileiros mostraram que o Brasil não vai à Europa para aprender — vai para disputar, vencer e marcar época.</p>
                </div>
                <div class="article-section">
                    <h2>Best of Show: A Collab Histórica</h2>
                    <p>A collab entre <strong>Tampa Tattoo, Jean Mognon e Cris Nieiro</strong> foi daquelas que silenciam o salão. Técnica apurada, leitura estética madura e execução de altíssimo nível renderam o prêmio máximo: 🏆 <strong>Best of Show</strong>. Entre dezenas de trabalhos de artistas do mundo inteiro, a obra dos brasileiros se destacou pela força, coesão e identidade.</p>
                </div>
                <div class="article-section">
                    <h2>Cris Nieiro: Três Dias, Três Prêmios</h2>
                    <p>Mas o feito não parou aí. Cris Nieiro viveu um fim de semana histórico:</p>
                    <ul style="list-style: none; padding-left: 0; margin: 1rem 0;">
                        <li>🏆 <strong>3º lugar Small Color</strong> – sexta-feira</li>
                        <li>🏆 <strong>1º lugar Medium Color</strong> – sábado</li>
                        <li>🏆 <strong>3º Best of Show</strong> – domingo (com a collab)</li>
                    </ul>
                    <p>Três dias. Três prêmios. Um feito raro, que exige não só talento, mas preparo mental, constância e respeito absoluto pela arte.</p>
                </div>
                <div class="article-section">
                    <h2>Referência e Técnica</h2>
                    <p><strong>Tampa Tattoo</strong> mostrou por que é referência: visão artística, leitura precisa da composição e a experiência de quem sabe jogar no campeonato mais alto. Sua presença na collab foi equilíbrio, força e assinatura clara de um artista maduro.</p>
                    <p><strong>Jean Mognon</strong> trouxe o peso técnico, a segurança de execução e a sensibilidade estética que transformam um bom trabalho em um trabalho memorável. Quando o traço é seguro, a cor responde — e Milão respondeu.</p>
                </div>
                <div class="article-section">
                    <h2>O Brasil é Potência</h2>
                    <p>Mais do que prêmios, esse resultado carrega uma mensagem: 👉 <strong>o Brasil é potência na tatuagem mundial.</strong> Não por acaso. Mas por anos de estrada, erro, acerto, estudo e respeito ao ofício.</p>
                </div>`
            },
            'flamingo': {
                title: 'Flamingo Artistic: O Tatuador Que Conduziu o Sonho à Vida',
                description: 'Levou a BMW X1 no Planet Tattoo 2025 - O maior prêmio do evento.',
                category: 'Grande Vencedor',
                author: 'Redação Mestres',
                date: 'OUT 2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro">
                    <p>No final de outubro de 2025, o Parque Olímpico da Barra da Tijuca, no Rio de Janeiro, foi mais do que um palco — foi um altar de arte, suor e história: a segunda edição do <strong>Planet Tattoo</strong> reuniu mais de 900 artistas nacionais e internacionais, espalhados por mais de 450 estandes, transformando o evento no maior encontro da tatuagem no Brasil.</p>
                </div>
                <div class="article-section">
                    <h2>Uma Celebração da Arte</h2>
                    <p>Entre sessões de tatuagem ao vivo, ritmos de DJs, skate, gastronomia e batalhas de estilo, algo maior floresceu: uma celebração da arte na pele como linguagem viva do corpo humano — um festival onde a tradição e a ousadia se tocaram em cada traço.</p>
                </div>
                <div class="article-section">
                    <h2>🏁 O Sonho Sobre Rodas</h2>
                    <p>Mas foi ali que <strong>Flamingo Artistic</strong>, tatuador de São Paulo, carimbou seu nome na história do evento e saiu pilotando um sonho sobre rodas. No sistema de premiação do Planet Tattoo, os vencedores das categorias principais e primeiros colocados tinham a chance de entrar no sorteio de uma <strong>BMW X1</strong> — um símbolo de reconhecimento pela excelência artística no meio.</p>
                </div>
                <div class="article-section">
                    <h2>Vitória e Nobreza</h2>
                    <p>E foi Flamingo quem, entre tantos talentos reunidos naquele fim de semana, foi o sortudo vencedor do veículo, levando para casa — além da máquina — o peso simbólico de um feito raro, uma marca de que a arte na pele pode transcender os limites do próprio estigma e se equiparar à sofisticação e estilo de uma das marcas mais admiradas do mundo.</p>
                    <p>“A BMW é uma marca globalmente associada à qualidade, sofisticação e alto desempenho”, ressaltou um dos organizadores do Planet Tattoo ao explicar a escolha do carro como prêmio — e, de certa forma, aplaudiu a arte como algo que merece ser tratado com igual nobreza.</p>
                </div>
                <div class="article-section">
                    <h2>🚀 Além do Prêmio</h2>
                    <p>Levar para casa uma BMW X1 em um festival de tatuagem não é apenas pilotar um carro — é dirigir o respeito, guiar a tradição e a inovação e mostrar que a arte que bordamos na pele tem um valor que ecoa por além dos contornos do corpo. Flamingo, com essa conquista no Planet Tattoo 2025, não apenas acelerou pelas ruas — ele acelerou a narrativa da tatuagem no Brasil, lembrando que o ofício é tanto técnica quanto poesia, tanto suor quanto sonho.</p>
                </div>`
            },
            'juliomonster': {
                title: 'Júlio Monster: A Arte Além da Pele',
                description: 'Conheça o artista e a tela que navega o Golden Click.',
                category: 'Destaque 2026',
                author: 'Golden Click',
                date: 'FEV 2026',
                headerImage: 'assets/highlight-julio-portrait.jpg',
                content: `
                    <div class="article-intro">
                        <p>Há artistas que seguem tendências. E há os que atravessam décadas sem nunca perder o rumo. <strong>Júlio Monster Tattoo</strong> é desses.</p>
                    </div>
                    <div class="article-section">
                        <h2>A Trajetória</h2>
                        <p>Famoso no Rio de Janeiro na décadas de 90, quando tatuagem ainda era rito, não moda, Júlio já era nome sussurrado entre os iniciados. Enquanto muitos aprendiam a segurar a máquina, ele já pensava como pintor. E sempre foi.</p>
                        <p>Tatuador, ilustrador, artista plástico — antes dos rótulos, artista. Seu traço nasce do oriental tradicional, mas não fica preso ao passado: ele se expande, se moderniza, respira. É disciplina japonesa com inquietação contemporânea.</p>
                    </div>
                    <div class="article-section">
                        <h2>Golden Click</h2>
                        <p>A tela que Júlio apresenta no <strong>Golden Click</strong>, concurso online de pintura que premia o vencedor com R$ 20 mil, é prova disso.</p>
                        <img src="assets/highlight-julio-painting.jpg" alt="Obra de Júlio Monster" style="width:100%; border:1px solid #333; margin: 1rem 0;">
                        <p>Uma criatura colossal emerge do mar revolto. Entre ondas, lua e abismos, a cena mistura força ancestral e imaginação moderna. O movimento da água carrega o olhar; o céu pesa; o corpo da criatura corta o oceano como um mito recém-desperto.</p>
                        <p>Não é só pintura — é narrativa. Daquelas que não se explicam, se sentem.</p>
                    </div>
                    <div class="article-section">
                        <h2>Legado</h2>
                        <p>Essa obra não nasceu para agradar algoritmo. Ela nasceu para honrar o ofício. Júlio representa uma geração que aprendeu errando, observando, respeitando quem veio antes. Uma geração que pintava à mão, estudava gravura, olhava livros, paredes, templos. E talvez por isso sua arte tenha essa densidade: ela vem de longe.</p>
                        <p>Agora, décadas depois, ele volta ao centro da cena — não por nostalgia, mas por mérito. O Golden Click é só o palco. O espetáculo é a trajetória.</p>
                        <p>Apoiar Júlio Monster Tattoo é apoiar a história viva da arte no Brasil. É lembrar que o novo só existe porque alguém manteve o fogo aceso lá atrás.</p> 
                        <br>
                        <p><em>Que venham os votos. Que venham os ventos. O monstro sabe nadar.</em></p>
                    </div>
                `
            },
            'coleman': {
                title: 'Cap Coleman: O Padrinho da Tatuagem Americana',
                description: 'Transformou a tatuagem de prática marginal em ofício reconhecível.',
                category: 'Lenda Americana',
                author: 'Arquivo Histórico',
                date: '1884–1973',
                headerImage: 'assets/legend-coleman.jpg',
                content: `<div class="article-intro"><p>August “Cap” Coleman nasceu em uma América que ainda não compreendia a tatuagem como profissão. Ele foi um dos grandes responsáveis por transformar a tatuagem de prática marginal em ofício reconhecível.</p></div><div class="article-section"><h2>O Padrinho</h2><p>Coleman começou tatuando marinheiros e viajantes. Percebeu a necessidade de padronizar imagens, criando seus famosos flashes: águias, âncoras, corações, caveiras. Seu estúdio em Norfolk tornou-se referência.</p></div><div class="article-section"><h2>Legado</h2><p>Cap Coleman não criou apenas imagens — criou um alfabeto visual. Seu trabalho está na raiz da tatuagem americana e continua vivo em cada estúdio tradicional do mundo.</p></div>`
            },
            'dietzel': {
                title: 'Amund Dietzel: O Mestre Silencioso',
                description: 'Uma das carreiras mais longas e prolíficas da história da tatuagem.',
                category: 'Lenda Americana',
                author: 'Arquivo Histórico',
                date: '1891–1974',
                headerImage: 'assets/legend-dietzel.jpg',
                content: `<div class="article-intro"><p>Nascido na Noruega e radicado nos Estados Unidos, Amund Dietzel construiu uma das carreiras mais longas e prolíficas da história da tatuagem. De 1913 até 1967, tatuou milhares de pessoas em Milwaukee.</p></div><div class="article-section"><h2>Padrões Técnicos</h2><p>Dietzel ajudou a fixar padrões técnicos e visuais. Seus desenhos simples, diretos e duráveis definiram o que a tatuagem precisava ser para sobreviver no tempo.</p></div><div class="article-section"><h2>Legado</h2><p>Dietzel representa a base sólida da tattoo americana — sem espetáculo, mas com permanência.</p></div>`
            },
            'broadbent': {
                title: 'Betty Broadbent: A Tattooed Venus',
                description: 'A mulher que levou a tatuagem ao mundo e quebrou tabus.',
                category: 'Pioneira',
                author: 'Arquivo Histórico',
                date: '1909–1983',
                headerImage: 'assets/legend-broadbent.jpg',
                content: `<div class="article-intro"><p>Conhecida como a “Tattooed Venus”, Betty Broadbent foi uma figura essencial na popularização da tatuagem no século XX. Mais do que um corpo tatuado, Betty era uma voz ativa em defesa da tatuagem.</p></div><div class="article-section"><h2>Pioneirismo</h2><p>Ela viajou pelo mundo e foi a primeira mulher a entrar para o Tattoo Hall of Fame. Também atuou como tatuadora, algo raro para mulheres em sua época.</p></div><div class="article-section"><h2>Legado</h2><p>Betty abriu caminhos. Sua presença ajudou a retirar a tatuagem das sombras e apresentá-la ao grande público.</p></div>`
            },
            'streckenbach': {
                title: 'Horst Streckenbach: Tattoo Samy',
                description: 'O engenheiro da tatuagem que inovou com máquinas rotativas.',
                category: 'Inovador',
                author: 'Arquivo Histórico',
                date: '1925–2001',
                headerImage: 'assets/legend-streckenbach.jpg',
                content: `<div class="article-intro"><p>Na Alemanha do pós-guerra, Horst Streckenbach — conhecido como Tattoo Samy — foi mais do que um artista: foi um inovador técnico. Ele desenvolveu máquinas rotativas e evoluiu o equipamento.</p></div><div class="article-section"><h2>Memória</h2><p>Tattoo Samy também foi um dos primeiros historiadores da tatuagem europeia, registrando práticas e técnicas quando poucos se preocupavam com memória.</p></div><div class="article-section"><h2>Legado</h2><p>Sua contribuição técnica permitiu que a tatuagem avançasse em precisão, conforto e durabilidade.</p></div>`
            },
            'raven': {
                title: 'Cliff Raven: Ponte Oriente-Ocidente',
                description: 'Um dos primeiros a incorporar a estética japonesa com profundidade.',
                category: 'Mestre',
                author: 'Arquivo Histórico',
                date: '1932–2001',
                headerImage: 'assets/legend-raven.jpg',
                content: `<div class="article-intro"><p>Cliff Raven foi um dos primeiros artistas ocidentais a incorporar de forma respeitosa e profunda a estética japonesa em seu trabalho. Com formação em belas-artes, ele trouxe composição e fluidez.</p></div><div class="article-section"><h2>O Caminho</h2><p>Atuando em Chicago e depois na Califórnia, Raven ajudou a preparar o terreno para a aceitação do estilo japonês no Ocidente.</p></div><div class="article-section"><h2>Legado</h2><p>Ele mostrou que tradição pode viajar sem perder a alma.</p></div>`
            },
            'gresham': {
                title: 'Jacci Gresham: Resistência',
                description: 'A primeira tatuadora negra dos Estados Unidos a abrir estúdio.',
                category: 'Pioneira',
                author: 'Arquivo Histórico',
                date: '1951–Presente',
                headerImage: 'assets/legend-gresham.jpg',
                content: `<div class="article-intro"><p>Jacci Gresham é reconhecida como a primeira tatuadora negra dos Estados Unidos. Em 1976, abriu seu próprio estúdio em New Orleans, enfrentando preconceitos de gênero e raça.</p></div><div class="article-section"><h2>Luta</h2><p>Sua trajetória é marcada pela resistência, profissionalismo e luta por espaço em um meio extremamente fechado.</p></div><div class="article-section"><h2>Legado</h2><p>Jacci não apenas tatuou — ela abriu portas.</p></div>`
            },
            'haake': {
                title: 'Mary Jane Haake: Profissionalismo',
                description: 'Uniu tatuagem artística, cosmética e médica com ética.',
                category: 'Pioneira',
                author: 'Arquivo Histórico',
                date: '1951–Presente',
                headerImage: 'assets/legend-haake.jpg',
                content: `<div class="article-intro"><p>Mary Jane Haake foi uma das pioneiras na integração entre tatuagem artística, cosmética e médica. Atuando desde os anos 1980, ela ajudou a elevar os padrões técnicos e éticos.</p></div><div class="article-section"><h2>Evolução</h2><p>Seu trabalho contribuiu para que a tatuagem fosse reconhecida como um campo profissional sério e multidisciplinar.</p></div><div class="article-section"><h2>Legado</h2><p>Haake ajudou a construir o futuro responsável da tatuagem.</p></div>`
            },
            'mahoney': {
                title: 'Mark Mahoney: A Caligrafia de Hollywood',
                description: 'Influenciado pelo grafite e lettering, redefiniu a elegância.',
                category: 'Fine Line',
                author: 'Arquivo Histórico',
                date: '1957–Presente',
                headerImage: 'assets/legend-mahoney.jpg',
                content: `<div class="article-intro"><p>Mark Mahoney iniciou sua carreira em Los Angeles nos anos 1970. Influenciado por grafite e lettering clássico, desenvolveu um traço fino e preciso, o Black and Grey single needle.</p></div><div class="article-section"><h2>Shamrock Social Club</h2><p>Fundador do lendário estúdio em Hollywood, Mahoney inseriu a tatuagem em novos círculos culturais, tatuando estrelas sem perder a alma da rua.</p></div><div class="article-section"><h2>Legado</h2><p>Mahoney consolidou o fine line como linguagem respeitável e expandiu o alcance cultural da tatuagem.</p></div>`
            },
            'barba': {
                title: 'Kari Barba: A Força do Tradicional',
                description: 'Defensora rigorosa do American Traditional contemporâneo.',
                category: 'Tradicional',
                author: 'Arquivo Histórico',
                date: '1966–Presente',
                headerImage: 'assets/legend-barba.jpg',
                content: `<div class="article-intro"><p>Kari Barba fundou o Outer Limits Tattoo, transformando-o em um dos estúdios mais respeitados do mundo. Barba posicionou-se como defensora rigorosa do tradicional americano.</p></div><div class="article-section"><h2>Formação</h2><p>Seu estúdio tornou-se espaço de formação para inúmeros artistas, mantendo viva a estética clássica em meio à modernização.</p></div><div class="article-section"><h2>Legado</h2><p>Kari Barba é uma das principais guardiãs do American Traditional contemporâneo.</p></div>`
            },
            'shimada': {
                title: 'Junko Shimada: Delicadeza e Força',
                description: 'Uniu delicadeza gráfica, precisão técnica e identidade.',
                category: 'Contemporâneo',
                author: 'Arquivo Histórico',
                date: '1967–Presente',
                headerImage: 'assets/legend-shimada.jpg',
                content: `<div class="article-intro"><p>Junko Shimada iniciou sua trajetória em um cenário predominantemente masculino. Seu trabalho une delicadeza gráfica, precisão técnica e forte identidade autoral.</p></div><div class="article-section"><h2>Reconhecimento</h2><p>Junko conquistou reconhecimento internacional mantendo fidelidade à sua linguagem pessoal, abrindo caminho para outras mulheres.</p></div><div class="article-section"><h2>Legado</h2><p>Junko ampliou a diversidade estética e de gênero dentro da tatuagem mundial.</p></div>`
            },
            'atkinson': {
                title: 'Luke Atkinson: A Nova Escola',
                description: 'Concilia técnica avançada e respeito à tradição na Europa.',
                category: 'Contemporâneo',
                author: 'Arquivo Histórico',
                date: '1978–Presente',
                headerImage: 'assets/legend-atkinson.jpg',
                content: `<div class="article-intro"><p>Luke Atkinson representa a geração contemporânea de tatuadores europeus que conciliam técnica avançada, pesquisa estética e respeito à tradição.</p></div><div class="article-section"><h2>Continuidade</h2><p>Atkinson é exemplo de continuidade: alguém que compreende o passado da tatuagem e o traduz para a linguagem atual.</p></div><div class="article-section"><h2>Legado</h2><p>Luke Atkinson simboliza a permanência da tradição em constante evolução.</p></div>`
            }
        }
    },
    en: {
        nav: { manifesto: "Manifesto", history: "History", era: "Golden Era", highlights: "Highlights 2025", ranking: "Top Artists", interviews: "Interviews", events: "Events", quiz: "Quiz", shop: "Tools" },
        hero: {
            line1: "The Body is the Temple.",
            line2: "Ink is the Soul.",
            line3: "Art is Eternal.",
            text: "Masters of Tattoo is not about trends. It's about legacy. <br> We respect history, technique, and consecrate the skin.",
            signature: "Welcome to the temple.",
            manifesto: {
                p1: "Tattooing is not born of haste.<br>It is born of time, of a steady hand, and of the history that traverses the skin.",
                p2: "Before it was fashion, it was rite.<br>Before it was a market, it was language.<br>Every line carries those who came before — masters, outcasts, sailors, apprentices.",
                p3: "Here, tattooing is commitment.<br>To technique, to ethics, to a well-made design.<br>To the skin of those who trust and to the memory of those who taught.",
                p4: "We honor the past so as not to betray the present.<br>And we continue marking the future, one skin at a time.",
                signature: "Tattooing asks for no permission.<br>It remains."
            }
        },
        headers: { history: "History & Culture", era: "The Golden Era", eraDesc: "Homage to the pioneers who built the foundations of modern tattooing.", highlights: "Highlights", ranking: "Top Artists Worldwide", interviews: "Interviews & Documentaries", events: "Events Calendar", eventsDesc: "Stay updated with the main conventions in Brazil and the world.", brazil: "BRAZIL 🇧🇷", international: "Legends of the Golden Era", internationalLabel: "INTERNATIONAL 🌍", quiz: "Discover Your Style", quizDesc: "Answer 5 visual questions and find the perfect artist for you.", tools: "MASTERS Tools", magazine: "Masters Magazine", partners: "Official Partners" },
        buttons: { readMore: "Read Article", viewMatter: "View Story", viewWork: "View Work", viewList: "View Full List", viewProfile: "View Profile", startQuiz: "Start Quiz", close: "Close", knowMore: "Learn More", readDigital: "Read Digital" },
        table: { month: "Month", event: "Event", location: "Location" },
        months: {
            JAN: "JAN", FEV: "FEB", MAR: "MAR", ABR: "APR", MAI: "MAY", JUN: "JUN",
            JUL: "JUL", AGO: "AUG", SET: "SEP", OUT: "OCT", NOV: "NOV", DEZ: "DEC"
        },
        footer: { manifesto: "Manifesto", ranking: "Ranking", magazine: "Magazine", contact: "Contact", copy: "&copy; 2026 MASTERS OF TATTOO. All rights reserved. <br> Underground Authority." },
        quiz: {
            questions: [
                {
                    question: "What attracts you visually?",
                    choices: [
                        { text: "Bold lines and solid colors", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Soft shading and realism", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Fine, delicate lines", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Geometric patterns and tribal", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "What is the size of your courage?",
                    choices: [
                        { text: "Full sleeve / Backpiece", style: "Realismo" },
                        { text: "Medium, maybe forearm", style: "Old School" },
                        { text: "Small and discrete", style: "Fine Line" },
                        { text: "Adaptable to the body", style: "Tribal" }
                    ]
                },
                {
                    question: "Color or Black & Grey?",
                    choices: [
                        { text: "Colorful and Solid", style: "Old School" },
                        { text: "Black & Grey (Shading)", style: "Realismo" },
                        { text: "Black Only (Line)", style: "Fine Line" },
                        { text: "Solid Black (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "What does the tattoo represent to you?",
                    choices: [
                        { text: "History and Tradition", style: "Old School" },
                        { text: "Portrait or Tribute", style: "Realismo" },
                        { text: "Aesthetics and Minimalism", style: "Fine Line" },
                        { text: "Spiritual Connection", style: "Tribal" }
                    ]
                },
                {
                    question: "To recommend a master, where are you?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "South (RS/SC/PR)", value: "SUL" },
                        { text: "Northeast (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Midwest (DF/GO...)", value: "CENTRO" },
                        { text: "Other / International", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Your Predominant Style is:",
            resultDesc: "Calculating recommendation...",
            recommendationTitle: "Recommended Masters in your Region:"
        },
        ranking: { artistLink: "Artist Link", viewProfile: "View Profile" },
        articles: {
            'mondial_era': {
                title: 'Mondial de la Tatouage: The End of an Era, The Beginning of Eternity',
                description: 'Mondial says goodbye not as something ending, but as becoming a legend.',
                category: 'History',
                author: 'Mestres Editorial',
                date: '2026',
                headerImage: 'assets/highlight-mondial-event-v3.jpg',
                content: `<div class="article-intro">
                    <p>There are events that don't just happen on the calendar - they happen in history. Mondial de la Tatouage, held in Paris, is one of them. In its final edition this year, Mondial says goodbye not as something ending, but as becoming a legend.</p>
                </div>
                <div class="video-container" style="margin: 2rem 0;">
                    <video controls style="width: 100%; border-radius: 4px;">
                        <source src="assets/videos/mondial-video.mp4" type="video/mp4">
                        Your browser does not support video.
                    </video>
                    <p style="font-size: 0.9em; color: #888; text-align: center; margin-top: 5px;">Mondial: The last breath of a legend.</p>
                </div>
                <div class="article-section">
                    <h2>Tin-Tin's Mission</h2>
                    <p>Created in the late 1990s by Tin-Tin, one of the great names in world tattooing, Mondial was born with a clear mission: to give dignity, stage, and respect to tattoo as art. At a time when tattooing was still viewed with suspicion, the event raised ancient flags - technique, discipline, tradition, lineage - and placed them under the lights of Paris.</p>
                </div>
                <div class="article-section">
                    <h2>Meeting Point</h2>
                    <p>Over decades, Mondial became more than a convention. It became a meeting point for masters and apprentices, styles crossing oceans, machines singing like in the old days. Traditional Japanese, old school, realism, tribal, blackwork - all coexisting with respect and pride of the craft.</p>
                </div>
                <div class="article-section">
                    <h2>The Legacy Continues</h2>
                    <p>Mondial ends, but what it built remains engraved where art matters most: on the skin, in memory, and in the heart of world tattooing. Some stories don't end. They just stop being told aloud - and start being whispered by machines.</p>
                </div>`
            },
            'mondial': {
                title: 'Brazil on the Podium at Mondial du Tatouage',
                description: 'Brazilian artists achieve prominence in Paris.',
                category: 'National Pride',
                author: 'Mestres Editorial',
                date: 'FEB 2026',
                headerImage: 'assets/highlight-mondial-group-v3.jpg',
                content: `<div class="article-intro">
                    <p>In the latest edition of Mondial du Tatouage in Paris, Brazilian artists conquered second place in one of the world's most important tattoo competitions. A feat born of discipline, respect for tradition, and creative boldness.</p>
                </div>
                <div class="article-section">
                    <h2>Machines and History</h2>
                    <p>Fernando Tampa, Cris Nieiro, and Jean Mogno brought to the European stage a tattoo that speaks loudly even in silence: refined technique, precise composition, and a visual narrative honoring the past while pointing to the future.</p>
                </div>
                <div class="article-section">
                    <h2>Contemporary Ritual</h2>
                    <p>The Mondial is a contemporary ritual of world tattooing. To be among the best there is to reaffirm that Brazil helps shape the international scene. The message was delivered: Brazilian tattooing remains alive, relevant, and impossible to ignore.</p>
                </div>`
            },
            'polynesia': {
                title: 'The Sacred Meaning of Polynesian Tattoo',
                description: 'A deep journey into tribal roots and the meaning of each symbol.',
                category: 'Origins',
                author: 'Master Ka’eo',
                date: 'JAN 27 2026',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>"In Polynesia, there is no tattoo without Mana. Every line, every curve, and every empty space tells the story of who you were, who you are, and who you wish to become."</p></div>
                <div class="article-section">
                    <h2>The Sacred Origin</h2>
                    <p>About 2000 years ago, the Lapita people began their great migration across the Pacific. With them, they carried not just supplies, but a sacred art. The word "Tatau", meaning "to tap" or "mark", refers to the rhythmic sound of traditional tools tapping on skin.</p>
                    <p>Unlike modern tattooing which focuses on aesthetics, Tatau was a rite of passage. A man without tattoos was considered "naked" and without social status. The marks indicated clan, battle prowess, and spiritual protection.</p>
                </div>
                <div class="article-section">
                    <h2>Symbols and Meanings</h2>
                    <p><strong>Enata:</strong> Represents human figures and gods. Used to tell stories of marriage, family, and defeated warriors.</p>
                    <p><strong>Shark Teeth:</strong> Symbol of protection, guidance, and strength. Sharks were viewed as gods of the sea.</p>
                    <p><strong>Spearheads:</strong> Courage and fight. A warrior tattooed with spearheads carried the promise to defend his people until death.</p>
                </div>
                <div class="article-section">
                    <h2>The Modern Renaissance</h2>
                    <p>After nearly being extinguished by European missionaries in the 19th century, Polynesian art is experiencing a global renaissance. Today, tattooists like Sulu'ape in Samoa and Keone Nunes in Hawaii fight to maintain the purity of tools and rituals, ensuring Mana is never lost.</p>
                </div>`
            },
            'brasil': {
                title: 'History of Tattooing in Brazil',
                description: 'It all started at the Port of Santos with Lucky Tattoo.',
                category: 'National History',
                author: 'Luiz "Cais" Pereira',
                date: 'FEB 15 2026',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>Brazil, with its explosive cultural mix, is fertile ground for skin art. But it all officially started in a small studio at the Port of Santos, where the smell of sea salt mixed with the buzz of an electric machine.</p></div>
                <div class="article-section">
                    <h2>Lucky Tattoo: The Pioneer (1959)</h2>
                    <p>Knud Harald Lykke Gregersen, "Lucky", was the first professional tattooist to settle in Brazil. Danish by birth, former sailor and draftsman, he brought the electric machine and the mystique of European "Old School" to the Santos docks.</p>
                    <p>His clients were prostitutes, sailors, and rogues. Tattooing in Brazil was born marginal, dangerous, and irresistible. Lucky didn't just sell drawings; he sold courage.</p>
                </div>
                <div class="article-section">
                    <h2>The Explosion in the 80s and 90s</h2>
                    <p>It took decades for tattooing to emerge from the shadows. In the 80s, Caio Tattoo in Rio and Marco Leão in São Paulo began to professionalize the sector. The arrival of imported materials and information exchange with the exterior allowed Brazil to develop its own style.</p>
                </div>
                <div class="article-section">
                    <h2>Brazil on Top of the World</h2>
                    <p>Today, Brazil is a world power. Names like Ralf Nonnweiler, Chico Morbene, and Karlla Mendes are revered globally. From favelas to noble neighborhoods, tattooing has become the ultimate expression of Brazilian identity: colorful, diverse, and technically impeccable.</p>
                </div>`
            },
            'origins': {
                title: 'The Origin of Tattoo: Ancient Marks',
                description: 'Ötzi and the therapeutic marks from 5300 years ago.',
                category: 'Deep History',
                author: 'Dr. Elena "Ink" Bianchi',
                date: 'APR 02 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>Before writing, before pyramids, there was the mark on skin. The human need to modify oneself is as old as consciousness itself.</p></div>
                <div class="article-section">
                    <h2>Ötzi: The Iceman</h2>
                    <p>In 1991, climbers found a body preserved in the Alpine ice. Ötzi lived 5,300 years ago and carried 61 tattoos. The most fascinating part? They were located on acupuncture points, suggesting tattooing was born as a primitive form of medicine to treat arthritis and pain.</p>
                </div>
                <div class="article-section">
                    <h2>Egypt and the Priestesses</h2>
                    <p>Egyptian mummies of women, like Amunet, reveal geometric tattoos on the abdomen and thighs. It is believed they served as protection during pregnancy and childbirth, invoking the goddess Bes. The ink was soot, the needle was bronze, but the purpose was divine.</p>
                </div>`
            },
            'modern': {
                title: 'From Skin to Galleries: The New Era',
                description: 'Tattooing as Fine Art in the Louvre.',
                category: 'Visual Revolution',
                author: 'Curator Anna "Canvas"',
                date: 'MAY 22 2026',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>What was once a symbol of rebellion now occupies the Louvre. Skin has become the ultimate canvas of contemporary art.</p></div>
                <div class="article-section">
                    <h2>The Fall of Prejudice</h2>
                    <p>Until the 90s, tattoos were "jail stuff" or "sailor stuff". Today, lawyers, doctors, and celebrities show off full sleeves. What changed? Quality. With Realism, Pointillism, and Watercolor, technique overcame stigma.</p>
                </div>
                <div class="article-section">
                    <h2>Artists or Tattooists?</h2>
                    <p>The line has blurred. Modern tattooists study color theory, composition, and anatomy with the rigor of Renaissance masters. A session with a master today can cost more than an oil painting. And unlike canvas, a tattoo breathes, ages, and dies with its bearer. It is the most ephemeral art, and therefore, the most precious.</p>
                </div>`
            },
            'sailor': {
                title: 'Sailor Jerry: Father of Old School',
                description: 'The father of American Old School. His flash defined an era.',
                category: 'Living Legend',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>"I haven't got a single inch of virgin skin left that hasn't been marked by a needle." - Norman 'Sailor Jerry' Collins.</p></div>
                <div class="article-section">
                    <h2>Honolulu, World War II</h2>
                    <p>Imagine Hawaii in the 40s. Thousands of sailors on shore leave, knowing they might not return from the Pacific. They wanted to remember home, loves, and courage. Sailor Jerry gave them that.</p>
                </div>
                <div class="article-section">
                    <h2>Technical Innovation</h2>
                    <p>Jerry wasn't just a draftsman; he was a scientist. He expanded the color palette (creating pioneer purple), modernized tattoo machines for less skin trauma, and was the first to introduce hospital sterilization. His style — bold black lines, simple shading, and solid colors — was made to withstand time and sun.</p>
                </div>
                <div class="article-section">
                    <h2>The Legacy</h2>
                    <p>Today, swallows (return home), ships (the journey), eagles (Honor), and "MOM" hearts are the foundation of traditional American tattooing. Ed Hardy, his apprentice, took this legacy to the fashion and art world, but the soul of the style remains on the streets of Honolulu.</p></div>`
            },
            'whangod': {
                title: 'Whang-od: The Last Mambabatok',
                description: 'The last Mambabatok of Kalinga. Guardian of tradition.',
                category: 'Ancestry',
                author: 'Apo Whang-od',
                date: 'LIVING LEGEND',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>In the remote mountains of Kalinga, Philippines, a centenarian woman holds a pomelo thorn and a bamboo stick. The sound is hypnotic: "Tok, tok, tok". It is Whang-od, tattooing her people's history.</p></div>
                <div class="article-section">
                    <h2>The Guardian of Batik</h2>
                    <p>Traditionally, only warriors who killed enemies in battle could receive Kalinga tattoos. Women received them for beauty. Whang-od saw warriors disappear but refused to let the art die. She began tattooing tourists pilgrimaging to her village, Buscalan.</p>
                </div>
                <div class="article-section">
                    <h2>Breaking Taboos</h2>
                    <p>Tradition said the art could only be passed to blood relatives. Childless, Whang-od trained her grandnieces, Grace and Elyang, ensuring the "tap" of bamboo continues echoing through mountains. She is not just a tattooist; she is a living monument of indigenous cultural resistance.</p></div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III: Soul of Japan',
                description: 'Supreme Master of Japanese Irezumi. A living legend.',
                category: 'Irezumi Master',
                author: 'Yoshihito Nakano',
                date: 'LIVING LEGEND',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>Yoshihito Nakano, Horiyoshi III, is not just a tattooist. He is a guardian of Japanese myths, legends, and demons.</p></div>
                <div class="article-section">
                    <h2>The Way of Tebori</h2>
                    <p>Although he uses machines for lines, Horiyoshi insists on "Tebori" (hand tattooing with bamboo rod) for shading and colors. He believes the machine inserts ink, but Tebori inserts soul. The process is more painful and slower, but creates a texture and color density no machine can replicate.</p>
                </div>
                <div class="article-section">
                    <h2>Bodysuits and Narratives</h2>
                    <p>Traditional Irezumi covers the whole body like a suit. Horiyoshi draws dragons, koi, samurai, and Phoenixes not as isolated drawings, but as a single narrative flowing with the client's muscles. Being tattooed by him is entering Japanese art history.</p></div>`
            },
            'filip': {
                title: 'Filip Leu: The Psychedelic Dragon',
                description: 'Pioneer of biomechanical style and grand compositions.',
                category: 'Swiss Innovation',
                author: 'The Leu Family',
                date: 'LIVING LEGEND',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>Born into the legendary Leu Family, artistic nomads, Filip grew up seeing the world as art. He revolutionized Western tattooing by fusing Japanese flow with biomechanical and psychedelic themes.</p></div>
                <div class="article-section">
                    <h2>The Perfect Flow</h2>
                    <p>Filip's greatest contribution is how he works with anatomy. He doesn't put a drawing "on" the arm; he makes the drawing "be" the arm. His dragons and distorted skulls fit perfectly into body curves, creating an illusion of organic movement.</p>
                </div>
                <div class="article-section">
                    <h2>Global Influence</h2>
                    <p>From his studio in Switzerland, he influenced virtually every modern large-scale tattooist. His style taught the world that large tattoos don't need to be rigid; they can be fluid, soft, and terrifying all at once.</p></div>`
            },
            'lyle': {
                title: 'Lyle Tuttle: The Tattoo Ambassador',
                description: 'Took art from streets to the cover of Rolling Stone.',
                category: 'Pop Icon',
                author: 'Redação',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>Lyle Tuttle was the man who took tattooing out of dark alleys and put it under Hollywood spotlights.</p></div>
                <div class="article-section">
                    <h2>The San Francisco Revolution</h2>
                    <p>In his legendary San Francisco studio during the Summer of Love, Lyle tattooed Janis Joplin, Cher, Henry Fonda, and the Allman Brothers. When Janis appeared on the Rolling Stone cover showing off her tattoo (done by Lyle), the stigma began to crumble. Women started seeking tattoos not as rebellion, but as adornment and liberation.</p>
                </div>
                <div class="article-section">
                    <h2>The Historian</h2>
                    <p>Lyle traveled to every continent, collecting machines, tribal tools, and stories. He understood before anyone that tattooing was a universal human language. His personal museum is the foundation of much of what we know today about our art's history.</p></div>`
            },
            'edhardy': {
                title: 'Ed Hardy: The Godfather of Modern Tattoo',
                description: 'United East and West. Elevated tattoo to Fine Art.',
                category: 'Godfather of Modern',
                author: 'Redação',
                date: 'LIVING LEGEND',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Before becoming a clothing brand, Ed Hardy was the most technical and visionary tattooist of his generation. He was the missing link between American Old School and Japanese tradition.</p></div>
                <div class="article-section">
                    <h2>The First Academic</h2>
                    <p>Hardy held a degree in printmaking and classical art. He turned down a Yale scholarship to tattoo. He was the first Westerner invited to study in Japan with a traditional master. He brought back not just drawings, but the mindset of treating tattooing as a serious and complex art form.</p>
                </div>
                <div class="article-section">
                    <h2>Tattoo City</h2>
                    <p>In his San Francisco studio, he introduced the concept of "Custom Tattoo" — tattoos designed exclusively for the client, retiring ready-made flash from walls. He changed the industry from "pick a drawing" to "create art".</p></div>`
            },
            'anavelho': {
                title: 'Ana Velho: Brazilian Pioneer',
                description: 'The female force that opened paths in Brazil.',
                category: 'History',
                author: 'Archive',
                date: '1980s',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro"><p>When Ana Velho picked up a machine for the first time, tattooing in Brazil was synonymous with marginality. Female tattooist? Non-existent.</p></div>
                <div class="article-section">
                    <h2>Breaking Barriers</h2>
                    <p>Coming from Fine Arts, Ana brought a sensibility and technique that "rough" studios of the time lacked. She was the first woman to tattoo professionally in Brazil, facing double prejudice: for being a tattooist and for being a woman in an environment dominated by men and bikers.</p>
                </div>
                <div class="article-section">
                    <h2>Legacy</h2>
                    <p>Ana didn't just tattoo; she educated. She participated in the first conventions, fought for hygiene and professionalism. If today Brazil has thousands of incredible female artists, all owe some gratitude to Ana Velho's courage.</p></div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler: The Master of Realism',
                description: 'Elevated black and grey realism level worldwide.',
                category: 'Highlight',
                author: 'Editorial',
                date: 'TODAY',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro"><p>Ralf Nonnweiler doesn't tattoo; he sculpts with light and shadow. His portraits are often mistaken for photographs but possess a soul the camera misses.</p></div>
                <div class="article-section">
                    <h2>Impeccable Technique</h2>
                    <p>Ralf's specialty is smoothness. He masters tone transition (gradients) like no one else, creating skin textures, eye shine, and realistic hair without leaving harsh marks. He proved black and grey can have as much depth and emotion as classic oil painting.</p>
                </div>`
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: The Skin Collector',
                description: 'The doctor who saved Irezumi art from extinction.',
                category: 'History',
                author: 'Editorial',
                date: 'JAN 27 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>In early 20th century Japan, tattooing was forbidden. Then came Dr. Fukushi Masaichi, a pathologist who saw in workers' and criminals' tattoos a cultural heritage worthy of preservation.</p></div>
                <div class="article-section">
                    <h2>A Unique Collection</h2>
                    <p>Fukushi frequented public bathhouses and prisons to find Irezumi masterpieces. He paid tattoo owners so that, after death, he could preserve their skins. He cataloged over 2,000 photos and preserved dozens of real skins, keeping alive works of ancient masters that would have vanished into dust without him.</p>
                </div>
                <div class="article-section">
                    <h2>Science and Art</h2>
                    <p>His work helped understand how pigment behaves in the dermis long-term. Today, his collection at the University of Tokyo is a pilgrimage site (restricted) for scholars of world tattooing.</p></div>`
            },
            'burchett': {
                title: 'George Burchett: The King of Tattooists',
                description: 'From war front to royal palaces.',
                category: 'British Royalty',
                author: 'Archive',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>George Burchett was the world's first "Celebrity Tattoo Artist", long before the term existed. He tattooed kings, maharajas, and English lords, but never stopped serving sailors on Waterloo Road.</p></div>
                <div class="article-section">
                    <h2>A Gentleman with a Machine</h2>
                    <p>Burchett fought to legitimar tattooing as a respectable profession. He kept his studio clean like a medical office and dressed like a doctor. His skill in covering war scars and improving old tattoos made him famous across Europe.</p>
                </div>
                <div class="article-section">
                    <h2>A Master's Diary</h2>
                    <p>His memoirs, "Memoirs of a Tattooist", are a vital document of the Victorian and Edwardian era, showing how tattooing crossed social classes in an empire on which the sun never set.</p></div>`
            },
            'jessie': {
                title: 'Jessie Knight: The Lady of the Needle',
                description: 'The first woman to tattoo professionally in the UK.',
                category: 'Pioneer',
                author: 'Editorial',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>Jessie Knight was a hurricane. Born into a family of circus artists and sharpshooters, she feared nothing. When she picked up a tattoo machine, she mastered the art with the same precision she used to shoot.</p></div>
                <div class="article-section">
                    <h2>Boldness and Style</h2>
                    <p>Her style was unique: she drew freehand directly on skin, without stencils, a feat of absurd courage. Her drawings were fluid, feminine, and strong. She won second place in the "Champion Tattoo Artist of All England" in 1955, shocking conservative judges.</p>
                </div>
                <div class="article-section">
                    <h2>Legacy</h2>
                    <p>After retiring, her work was rediscovered decades later. Today, Jessie is the ultimate icon for women in the industry, proving talent has no gender and true art always finds its place.</p></div>`
            },
            'steve': {
                title: 'Steve Butcher & Yomico: Titans in Brazil',
                description: 'Historic meeting of realism masters.',
                category: 'Event',
                author: 'Editorial',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro"><p>Tattoo Week 2025 witnessed a historic moment: the joint arrival of Steve Butcher (New Zealand) and Yomico Moreno (Venezuela/NYC), two of the planet's biggest names in color realism.</p></div>
                <div class="article-section">
                    <h2>The NBA Technique</h2>
                    <p>Steve Butcher is famous for tattooing portraits of NBA players with such fidelity they look like stickers on skin. Seeing his technique live, how he saturates color without damaging skin, was a masterclass for all Brazilian artists present.</p>
                </div>
                <div class="article-section">
                    <h2>Yomico and Hyper-Reality</h2>
                    <p>Yomico brought his biomechanical surrealism and emotive portraits. The exchange of experiences between them and Brazilian masters showed art has no borders. It was a weekend where Portuguese, English, and Spanish united in the universal language of ink.</p></div>`
            },
            'cris': {
                title: 'Cris Niero: The Consecration',
                description: 'Won Tattoo Week and All Stars Miami in the same weekend.',
                category: 'Champion',
                author: 'Editorial',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro"><p>The impossible happened. Cris Niero didn't just win. She dominated two continents in 48 hours.</p></div>
                <div class="article-section">
                    <h2>Double Win</h2>
                    <p>With insane logistical strategy and overflowing talent, Cris presented a healed work at Tattoo Week SP on Friday and flew to Miami to compete in All Stars on Sunday. Result: Gold in both.</p>
                </div>
                <div class="article-section">
                    <h2>Technical Sovereignty</h2>
                    <p>Her work in Black and Grey Realism reached a maturity level that impressed international judges. Cris proved the Brazilian artist owes nothing to anyone in terms of infrastructure, technique, and artistic vision.</p></div>`
            },
            'neto': {
                title: 'Neto Coutinho: The Masterpiece',
                description: 'The Best of Show that stopped the event.',
                category: 'Champion',
                author: 'Editorial',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro"><p>When Neto Coutinho took the main stage, silence fell. The piece he presented for the "Best of Show" category wasn't just a tattoo; it was a Renaissance painting on skin.</p></div>
                <div class="article-section">
                    <h2>50 Hours of Needle</h2>
                    <p>It was three straight days of work. A full backpiece, with complex composition, depth of field, and a sober, elegant color palette. The jury was unanimous.</p>
                </div>
                <div class="article-section">
                    <h2>The Trophy</h2>
                    <p>Winning Best of Show at the world's biggest convention is the peak of any tattooist's career. Neto placed his name in the pantheon of Tattoo Week immortals, inspiring a new generation to focus on large projects and extreme dedication.</p></div>`
            },
            'milano': {
                title: 'Brazilian Invasion in Milan',
                description: 'Brazil dominated Italy\'s most traditional convention.',
                category: 'International',
                author: 'Europe News',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>They say soccer is the national sport, but in Milan, Brazil proved its true sport is Tattooing.</p></div>
                <div class="article-section">
                    <h2>Triple Crown</h2>
                    <p>The Brazilian delegation returned home with heavy suitcases. Prizes in Realism, Neotraditional, and of course, the coveted "Best of Show". The Milano Tattoo Convention, known for its rigorous and traditionalist jury, surrendered to Tupiniquim creativity and technique.</p>
                </div>
                <div class="article-section">
                    <h2>Global Respect</h2>
                    <p>This result consolidates a trend: Brazil is today the world's largest exporter of tattoo talent. Studios in Europe and the US vie for our artists. Milan was just the coronation of this phenomenon.</p></div>`
            },
            'flamingo': {
                title: 'Flamingo Artistic: The Whip King',
                description: 'The technique that won a brand new car.',
                category: 'Highlight',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro"><p>Whipshading is a difficult technique. Doing it in a competition for a luxury car is for the few. Flamingo Artistic not only did it, he taught a class.</p></div>
                <div class="article-section">
                    <h2>Precision and Texture</h2>
                    <p>His work mixed sacred geometry with drag pointillism (whip). The visual effect is a velvety texture that seems to float on skin. Judges highlighted dot consistency and application cleanliness.</p>
                </div>
                <div class="article-section">
                    <h2>The Prize</h2>
                    <p>Leaving a tattoo event driving a brand new BMW is any artist's dream. Flamingo showed that investing in technical study and cutting-edge tools brings real, tangible results.</p></div>`
            }
        }
    },
    de: {
        nav: { manifesto: "Manifest", history: "Geschichte", era: "Goldene Ära", highlights: "Highlights 2025", ranking: "Top Künstler", interviews: "Interviews", events: "Veranstaltungen", quiz: "Quiz", shop: "Werkzeuge" },
        hero: { line1: "Der Körper ist der Tempel.", line2: "Tinte ist die Seele.", line3: "Kunst ist Ewig.", text: "Masters of Tattoo handelt nicht von Trends. Es geht um das Erbe. <br> Wir respektieren Geschichte, Technik und weihen die Haut.", signature: "Willkommen im Tempel." },
        headers: { history: "Geschichte & Kultur", era: "Die Goldene Ära", eraDesc: "Hommage an die Pioniere, die das Fundament legten.", highlights: "Highlights", ranking: "Top Künstler Weltweit", interviews: "Interviews & Dokumentationen", events: "Veranstaltungskalender", eventsDesc: "Bleiben Sie auf dem Laufenden.", brazil: "BRASILIEN 🇧🇷", international: "INTERNATIONAL 🌍", quiz: "Entdecke Deinen Stil", quizDesc: "Beantworte 5 Fragen und finde den perfekten Künstler.", tools: "MEISTER Werkzeuge", magazine: "Meister Magazin", partners: "Offizielle Partner" },
        buttons: { readMore: "Artikel Lesen", viewMatter: "Story Ansehen", viewWork: "Werk Ansehen", viewList: "Liste Ansehen", viewProfile: "Profil Ansehen", startQuiz: "Quiz Starten", close: "Schließen", knowMore: "Mehr Erfahren", readDigital: "Digital Lesen" },
        table: { month: "Monat", event: "Veranstaltung", location: "Ort" },
        footer: { manifesto: "Manifest", ranking: "Ranking", magazine: "Magazin", contact: "Kontakt", copy: "&copy; 2026 MASTERS OF TATTOO. Alle Rechte vorbehalten." },
        quiz: {
            questions: [
                {
                    question: "Was spricht dich visuell an?",
                    choices: [
                        { text: "Dicke Linien und feste Farben", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Weiche Schattierungen und Realismus", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Feine, zarte Linien", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Geometrische Muster und Tribal", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "Wie groß ist dein Mut?",
                    choices: [
                        { text: "Voller Ärmel / Rücken", style: "Realismo" },
                        { text: "Mittel, vielleicht Unterarm", style: "Old School" },
                        { text: "Klein und diskret", style: "Fine Line" },
                        { text: "Anpassbar an den Körper", style: "Tribal" }
                    ]
                },
                {
                    question: "Farbe oder Schwarz & Grau?",
                    choices: [
                        { text: "Bunt und solide", style: "Old School" },
                        { text: "Schwarz & Grau (Schattierung)", style: "Realismo" },
                        { text: "Nur Schwarz (Linie)", style: "Fine Line" },
                        { text: "Solides Schwarz (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "Was bedeutet das Tattoo für dich?",
                    choices: [
                        { text: "Geschichte und Tradition", style: "Old School" },
                        { text: "Portrait oder Tribut", style: "Realismo" },
                        { text: "Ästhetik und Minimalismus", style: "Fine Line" },
                        { text: "Spirituelle Verbindung", style: "Tribal" }
                    ]
                },
                {
                    question: "Um einen Meister zu empfehlen, wo bist du?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "Süden (RS/SC/PR)", value: "SUL" },
                        { text: "Nordosten (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Mittelwesten (DF/GO...)", value: "CENTRO" },
                        { text: "Andere / International", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Dein vorherrschender Stil ist:",
            resultDesc: "Berechne Empfehlung...",
            recommendationTitle: "Empfohlene Meister in deiner Region:"
        },
        ranking: { artistLink: "Künstler Link", viewProfile: "Profil Ansehen" },
        articles: {
            'polynesia': {
                title: 'Die heilige Bedeutung des polynesischen Tattoos',
                description: 'Eine tiefe Reise zu den Stammeswurzeln und der Bedeutung jedes Symbols.',
                category: 'Ursprünge',
                author: 'Meister Ka’eo',
                date: '27. JAN 2026',
                headerImage: 'assets/history-tribal.png',
                content: '<div class="article-intro"><p>"In Polynesien gibt es kein Tattoo ohne Mana. Jede Linie erzählt die Geschichte dessen, wer du warst, wer du bist und wer du werden möchtest."</p></div><div class="article-section"><h2>Der heilige Ursprung</h2><p>Vor etwa 2000 Jahren begann das Lapita-Volk seine große Wanderung. Sie brachten eine heilige Kunst mit. "Tatau" bedeutet schlagen oder markieren.</p><p>Im Gegensatz zum modernen Tattoo, das sich auf Ästhetik konzentriert, war das Tatau ein Übergangsritus. Ein Mann ohne Tattoos galt als "nackt" und ohne sozialen Status.</p></div><div class="article-section"><h2>Symbole und Bedeutungen</h2><p><strong>Enata:</strong> Menschliche Figuren und Götter. Geschichten von Ehe und Familie.</p><p><strong>Haifischzähne:</strong> Schutz, Führung und Stärke.</p><p><strong>Speerspitzen:</strong> Mut und Kampf. Das Versprechen des Kriegers.</p></div><div class="article-section"><h2>Die moderne Wiedergeburt</h2><p>Fast von Missionaren ausgelöscht, erlebt die polynesische Kunst eine globale Renaissance. Tätowierer wie Sulu\'ape kämpfen für die Reinheit der Werkzeuge.</p></div>'
            },
            'brasil': {
                title: 'Geschichte des Tattoos in Brasilien',
                description: 'Alles begann im Hafen von Santos mit Lucky Tattoo.',
                category: 'Nationale Geschichte',
                author: 'Luiz "Cais" Pereira',
                date: '15. FEB 2026',
                headerImage: 'assets/brazil-history.png',
                content: '<div class="article-intro"><p>Brasilien ist fruchtbarer Boden für Körperkunst. Alles begann im Hafen von Santos.</p></div><div class="article-section"><h2>Lucky Tattoo: Der Pionier (1959)</h2><p>Knud "Lucky" Gregersen war der erste professionelle Tätowierer Brasiliens. Er brachte elektrische Maschinen und die Old-School-Mystik in die Tropen.</p><p>Seine Kunden waren Seeleute und Außenseiter. Lucky verkaufte keine Zeichnungen; er verkaufte Mut.</p></div><div class="article-section"><h2>Die Explosion</h2><p>In den 80ern professionalisierten Caio Tattoo und Marco Leão die Branche. Heute ist Brasilien eine Weltmacht, die Talente wie Ralf Nonnweiler und Karlla Mendes exportiert.</p></div>'
            },
            'origins': {
                title: 'Ursprung des Tattoos: Alte Markierungen',
                description: 'Ötzi und die therapeutischen Markierungen von vor 5300 Jahren.',
                category: 'Tiefe Geschichte',
                author: 'Dr. Elena "Ink" Bianchi',
                date: '02. APR 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: '<div class="article-intro"><p>Vor der Schrift gab es das Zeichen. Ötzi, der Mann aus dem Eis, hatte vor 5300 Jahren therapeutische Tätowierungen.</p></div><div class="article-section"><h2>Primitive Medizin</h2><p>Ötzis Tattoos befanden sich an Akupunkturpunkten zur Behandlung von Arthritis. Das Tattoo wurde als Medizin und spirituelle Verbindung geboren, nicht nur als Ästhetik.</p></div>'
            },
            'modern': {
                title: 'Von der Haut in die Galerien: Die neue Ära',
                description: 'Das Tattoo als bildende Kunst im Louvre.',
                category: 'Visuelle Revolution',
                author: 'Kuratorin Anna "Canvas"',
                date: '22. MAI 2026',
                headerImage: 'assets/gallery-modern.png',
                content: '<div class="article-intro"><p>Was einst rebellisch war, ist heute im Louvre. Die Haut ist die ultimative Leinwand. Moderne Meister verdienen wie große Maler.</p></div><div class="article-section"><h2>Das Ende der Vorurteile</h2><p>Anwälte und Ärzte tragen heute Ganztages-Ärmel (Sleeves). Die technische Qualität von Realismus und Aquarell hat das Stigma überwunden. Das Tattoo ist die vergänglichste und kostbarste Kunst, denn sie stirbt mit ihrem Träger.</p></div>'
            },
            'sailor': {
                title: 'Sailor Jerry: Vater des Old School',
                description: 'Der Vater des amerikanischen Old School. Seine Flashs definierten eine Ära.',
                category: 'Lebende Legende',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: '<div class="article-intro"><p>"Ich habe keinen Zentimeter jungfräulicher Haut." - Norman \'Sailor Jerry\' Collins.</p></div><div class="article-section"><h2>Honolulu, Zweiter Weltkrieg</h2><p>Tausende von Matrosen wollten eine Erinnerung an ihr Zuhause. Jerry gab ihnen Anker, Schwalben und "MOM"-Herzen. Er erfand lila Tinte und modernisierte die Sterilisation. Sein Erbe lebt in jedem traditionellen Tattoo weiter.</p></div>'
            },
            'whangod': {
                title: 'Whang-od: Die letzte Mambabatok',
                description: 'Die letzte Mambabatok von Kalinga. Hüterin der Tradition.',
                category: 'Ahnenreihe',
                author: 'Apo Whang-od',
                date: 'LEBENDE LEGENDE',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: '<div class="article-intro"><p>Auf den Philippinen hält die 107-jährige Whang-od die Dorn- und Bambustechnik ("Tok, tok, tok") am Leben.</p></div><div class="article-section"><h2>Tabus brechen</h2><p>Traditionell nur für Krieger, tätowiert sie heute Touristen. Sie bildete ihre Großnichten aus, um die Kunst zu retten, und bewies damit, dass Kultur lebendiger Widerstand ist.</p></div>'
            },
            'horiyoshi': {
                title: 'Horiyoshi III: Seele Japans',
                description: 'Höchster Meister des japanischen Irezumi. Eine lebende Legende.',
                category: 'Irezumi Meister',
                author: 'Yoshihito Nakano',
                date: 'LEBENDE LEGENDE',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: '<div class="article-intro"><p>Lebender Schatz Japans. Meister des Tebori (Handstechen), der Ganzkörperanzüge erschafft, die Mythen und Legenden erzählen.</p></div><div class="article-section"><h2>Der Weg des Tebori</h2><p>Er glaubt, dass die Maschine Tinte injiziert, aber das Tebori Seele injiziert. Seine Drachen und Koi-Karpfen fließen mit der menschlichen Muskulatur in einer einzigartigen Erzählung.</p></div>'
            },
            'filip': {
                title: 'Filip Leu: Der psychedelische Drache',
                description: 'Pionier des biomechanischen Stils und großer Kompositionen.',
                category: 'Schweizer Innovation',
                author: 'The Leu Family',
                date: 'LEBENDE LEGENDE',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: '<div class="article-intro"><p>Geboren in der legendären Leu-Familie. Revolutionierte das Tätowieren durch die Verbindung von japanischer Tradition und westlicher Psychedelik.</p></div><div class="article-section"><h2>Der perfekte Fluss</h2><p>Sein größter Beitrag ist, wie er mit der Anatomie arbeitet. Seine Drachen sind nicht "auf" dem Arm, sie "sind" der Arm. Er lehrte die Welt, dass große Tattoos fließen müssen.</p></div>'
            },
            'lyle': {
                title: 'Lyle Tuttle: Tätowierer der Stars',
                description: 'Brachte die Straßenkunst auf das Cover des Rolling Stone.',
                category: 'Pop Ikone',
                author: 'Redaktion',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: '<div class="article-intro"><p>Lyle Tuttle holte das Tattoo aus den dunklen Gassen und stellte es ins Rampenlicht. Er tätowierte Janis Joplin und Cher.</p></div><div class="article-section"><h2>Revolution in San Francisco</h2><p>Im Summer of Love normalisierte er Tattoos für Frauen als Schmuck und Befreiung. Er war auch ein bedeutender Kunsthistoriker.</p></div>'
            },
            'edhardy': {
                title: 'Ed Hardy: Pate der Moderne',
                description: 'Vereinte Ost und West. Hob Tattoo zur Schönen Kunst.',
                category: 'Legende',
                author: 'Don Ed Hardy',
                date: 'LEBENDE LEGENDE',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: '<div class="article-intro"><p>Viel mehr als eine Modemarke. Ed Hardy war der erste Westler, der von japanischen Meistern akzeptiert wurde.</p></div><div class="article-section"><h2>Tattoo City</h2><p>Führte das Konzept des "Custom Tattoo" in San Francisco ein. Veränderte die Industrie von "Wähle ein Bild" zu "Erschaffe exklusive Kunst".</p></div>'
            },
            'anavelho': {
                title: 'Ana Velho: Brasilianische Pionierin',
                description: 'Die Kraft der Frauen, die in Brasilien Wege ebnete.',
                category: 'Geschichte',
                author: 'Archiv',
                date: '1980er',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: '<div class="article-intro"><p>Erste professionelle Tätowiererin in Brasilien. Kämpfte gegen doppelte Vorurteile und ebnete den Weg für alle.</p></div><div class="article-section"><h2>Vermächtnis</h2><p>Von den Schönen Künsten kommend, brachte sie Technik und Sensibilität mit. Sie kämpfte für Hygiene und Professionalität in einer marginalen Ära.</p></div>'
            },
            'ralf': {
                title: 'Ralf Nonnweiler: Meister des Realismus',
                description: 'Hob das Niveau des weltweiten Schwarz-Weiß-Realismus an.',
                category: 'Highlight',
                author: 'Redaktion',
                date: 'HEUTE',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: '<div class="article-intro"><p>Ralf tätowiert nicht; er bildhauert mit Licht und Schatten. Seine Porträts haben eine Seele, die die Kamera nicht einfängt.</p></div><div class="article-section"><h2>Tadellose Technik</h2><p>Er beherrscht Weichheit und Verläufe wie kein anderer. Er bewies, dass Schwarz und Grau so viel Tiefe haben kann wie Ölmalerei.</p></div>'
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: Der Hautsammler',
                description: 'Der Arzt, der die Kunst des Irezumi rettete.',
                category: 'Geschichte',
                author: 'Redaktion',
                date: '27. JAN 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: '<div class="article-intro"><p>Japanischer Pathologe, der tätowierte Häute bewahrte, als die Kunst verboten war.</p></div><div class="article-section"><h2>Wissenschaft und Kunst</h2><p>Seine Sammlung an der Universität Tokio hält die Werke alter Meister am Leben, die sonst verloren gegangen wären. Ein Erbe aus Respekt und Bewahrung.</p></div>'
            },
            'burchett': {
                title: 'George Burchett: Der König der Tätowierer',
                description: 'Von der Kriegsfront in die königlichen Paläste.',
                category: 'Britisches Königshaus',
                author: 'Archiv',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: '<div class="article-intro"><p>Tätowierte Könige und Arbeiter. Kämpfte für die Legitimierung des Berufs, kleidete sich wie ein Arzt und führte ein tadelloses Studio.</p></div><div class="article-section"><h2>Memoiren</h2><p>Seine Memoiren sind ein wichtiges Dokument der viktorianischen Ära und zeigen, wie Tattoos alle sozialen Klassen durchquerten.</p></div>'
            },
            'jessie': {
                title: 'Jessie Knight: Die Dame der Nadel',
                description: 'Die erste Tätowiererin des Vereinigten Königreichs.',
                category: 'Pionierin',
                author: 'Redaktion',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: '<div class="article-intro"><p>Tochter des Zirkus, furchtlos. Tätowierte freihändig (Freehand), ein flüssiger und kühner Stil.</p></div><div class="article-section"><h2>Feministische Ikone</h2><p>Gewann in den 50ern Preise gegen Männer. Heute ist sie die ultimative Ikone für Frauen in der Branche.</p></div>'
            },
            'steve': {
                title: 'Steve Butcher & Yomico: Titanen in Brasilien',
                description: 'Historisches Treffen der Meister des Realismus.',
                category: 'Event',
                author: 'Redaktion',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: '<div class="article-intro"><p>Die Tattoo Week 2025 empfing Steve Butcher und Yomico Moreno. Eine Meisterklasse in Farbrealismus und Surrealismus.</p></div><div class="article-section"><h2>Globaler Austausch</h2><p>Steves NBA-Technik und Yomicos Biomechanik inspirierten alle. Kunst kennt keine Grenzen.</p></div>'
            },
            'cris': {
                title: 'Cris Nieiro: Die Krönung',
                description: 'Gewann Tattoo Week und All Stars Miami am selben Wochenende.',
                category: 'Champion',
                author: 'Redaktion',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: '<div class="article-intro"><p>Das Unmögliche geschah. Cris Nieiro dominierte zwei Kontinente in 48 Stunden mit Gold in beiden.</p></div><div class="article-section"><h2>Technische Souveränität</h2><p>Sein Schwarz-Weiß-Realismus beeindruckte internationale Richter und bewies die Stärke des brasilianischen Tattoos.</p></div>'
            },
            'neto': {
                title: 'Neto Coutinho: Das Meisterwerk',
                description: 'Der Best of Show, der das Event zum Stillstand brachte.',
                category: 'Champion',
                author: 'Redaktion',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: '<div class="article-intro"><p>Neto präsentierte einen kompletten Rücken, der wie ein Renaissance-Gemälde aussah. 50 Stunden Nadelarbeit.</p></div><div class="article-section"><h2>Die Trophäe</h2><p>Den Best of Show zu gewinnen, ist der Gipfel. Neto inspirierte eine neue Generation, sich großen Projekten zu widmen.</p></div>'
            },
            'milano': {
                title: 'Brasilianische Invasion in Mailand',
                description: 'Brasilien dominierte die traditionellste Convention Italiens.',
                category: 'International',
                author: 'Europa News',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>In Mailand bewies Brasilien, dass sein Sport das Tätowieren ist. Preise in Realismus und Neotraditional.</p></div><div class="article-section"><h2>Globaler Respekt</h2><p>Brasilien ist der größte Exporteur von Talenten. Mailand war die Krönung dieses weltweiten Phänomens.</p></div>`
            },
            'flamingo': {
                title: 'Flamingo Artistic: König des Whip',
                description: 'Die Technik, die einen Neuwagen wert war.',
                category: 'Highlight',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: '<div class="article-intro"><p>Tadelloses Whipshading brachte ihm einen BMW ein. Heilige Geometrie und Dotwork.</p></div><div class="article-section"><h2>Der Preis</h2><p>Flamingo zeigte, dass Technik und Studium greifbare und luxuriöse Ergebnisse bringen.</p></div>'
            }
        },
    },
    fr: {
        nav: { manifesto: "Manifeste", history: "Histoire", era: "Âge d'Or", highlights: "Points Forts", ranking: "Top Artistes", interviews: "Entretiens", events: "Événements", quiz: "Quiz", shop: "Outils" },
        hero: { line1: "Le Corps est le Temple.", line2: "L'Encre est l'Âme.", line3: "L'Art est Éternel.", text: "Masters of Tattoo n'est pas une question de tendances. C'est un héritage. <br> Nous respectons l'histoire, la technique et consacrons la peau.", signature: "Bienvenue au temple." },
        headers: { history: "Histoire et Culture", era: "L'Âge d'Or", eraDesc: "Hommage aux pionniers qui ont bâti les fondations.", highlights: "Points Forts", ranking: "Top Artistes Mondiaux", interviews: "Entretiens & Documentaires", events: "Calendrier", eventsDesc: "Restez informé des principales conventions.", brazil: "BRÉSIL 🇧🇷", international: "INTERNATIONAL 🌍", quiz: "Découvrez Votre Style", quizDesc: "Répondez à 5 questions et trouvez l'artiste parfait.", tools: "Outils MAÎTRES", magazine: "Magazine", partners: "Partenaires Officiels" },
        buttons: { readMore: "Lire Article", viewMatter: "Voir L'Histoire", viewWork: "Voir Œuvre", viewList: "Voir Liste", viewProfile: "Voir Profil", startQuiz: "Commencer", close: "Fermer", knowMore: "Savoir Plus", readDigital: "Lire Numérique" },
        table: { month: "Mois", event: "Événement", location: "Lieu" },
        months: {
            JAN: "JAN", FEV: "FÉV", MAR: "MAR", ABR: "AVR", MAI: "MAI", JUN: "JUIN",
            JUL: "JUIL", AGO: "AOÛT", SET: "SEPT", OUT: "OCT", NOV: "NOV", DEZ: "DÉC"
        },
        footer: { manifesto: "Manifeste", ranking: "Classement", magazine: "Magazine", contact: "Contact", copy: "&copy; 2026 MESTRES DA TATTOO. Tous droits réservés." },
        quiz: {
            questions: [
                {
                    question: "Qu'est-ce qui vous attire visuellement?",
                    choices: [
                        { text: "Lignes épaisses et couleurs vives", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Ombres douces et réalisme", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Lignes fines et délicates", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Motifs géométriques et tribaux", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "Quelle est la taille de votre courage?",
                    choices: [
                        { text: "Bras entier / Dos complet", style: "Realismo" },
                        { text: "Moyen, peut-être l'avant-bras", style: "Old School" },
                        { text: "Petit et discret", style: "Fine Line" },
                        { text: "Adaptable au corps", style: "Tribal" }
                    ]
                },
                {
                    question: "Couleur ou Noir & Gris?",
                    choices: [
                        { text: "Coloré et Solide", style: "Old School" },
                        { text: "Noir & Gris (Shading)", style: "Realismo" },
                        { text: "Noir Seulement (Linework)", style: "Fine Line" },
                        { text: "Noir Solide (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "Que représente le tatouage pour vous?",
                    choices: [
                        { text: "Histoire et Tradition", style: "Old School" },
                        { text: "Portrait ou Hommage", style: "Realismo" },
                        { text: "Esthétique et Minimalisme", style: "Fine Line" },
                        { text: "Connexion Spirituelle", style: "Tribal" }
                    ]
                },
                {
                    question: "Pour vous recommander un maître, où êtes-vous?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "Sud (RS/SC/PR)", value: "SUL" },
                        { text: "Nord-Est (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Centre-Ouest (DF/GO...)", value: "CENTRO" },
                        { text: "Autre / International", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Votre Style Dominant est :",
            resultDesc: "Calcul de recommandation...",
            recommendationTitle: "Maîtres Recommandés dans votre Région :"
        },
        ranking: { artistLink: "Lien Artiste", viewProfile: "Voir Profil" },
        articles: {
            'polynesia': {
                title: 'La Signification Sacrée du Tatouage Polynésien',
                description: 'Un voyage profond aux racines tribales et la signification de chaque symbole.',
                category: 'Origines',
                author: 'Maître Ka’eo',
                date: '27 JAN 2026',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>"En Polynésie, il n'y a pas de tatouage sans Mana. Chaque ligne raconte l'histoire de qui vous étiez, qui vous êtes et qui vous souhaitez devenir."</p></div><div class="article-section"><h2>L'Origine Sacrée</h2><p>Il y a environ 2000 ans, le peuple Lapita a commencé sa grande migration. Ils emportaient un art sacré. "Tatau" signifie frapper ou marquer.</p></div>`
            },
            'brasil': {
                title: 'Histoire du Tatouage au Brésil',
                description: 'Tout a commencé au port de Santos. L\'histoire des pionniers.',
                category: 'Histoire Nationale',
                author: 'Luiz "Cais" Pereira',
                date: '15 FEV 2026',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>Le Brésil est une terre fertile pour l'art corporel. Tout a commencé au port de Santos.</p></div><div class="article-section"><h2>Lucky Tattoo : Le Pionnier</h2><p>Knud "Lucky" Gregersen fut le premier tatoueur pro du Brésil (1959). Il apporta les machines électriques et la mystique Old School sous les tropiques.</p></div>`
            },
            'origins': {
                title: 'Origine du Tatouage : Marques Anciennes',
                description: 'Ötzi et les marques thérapeutiques d\'il y a 5300 ans.',
                category: 'Histoire Profonde',
                author: 'Dr. Elena "Ink" Bianchi',
                date: '02 AVR 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>Avant l'écriture, il y avait la marque. Ötzi l'homme des glaces avait des tatouages thérapeutiques il y a 5300 ans. Le tatouage est né comme médecine et lien spirituel.</p></div>`
            },
            'modern': {
                title: 'De la Peau aux Galeries',
                description: 'Le tatouage comme Beaux-Arts au Louvre.',
                category: 'Révolution Visuelle',
                author: 'Curatrice Anna "Canvas"',
                date: '22 MAI 2026',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>Ce qui était rebelle est maintenant au Louvre. La peau est la toile ultime. Les maîtres modernes facturent comme de grands peintres.</p></div>`
            },
            'sailor': {
                title: 'Sailor Jerry : Père du Old School',
                description: 'Le père du Old School américain. Ses flashs ont défini une ère.',
                category: 'Légende Vivante',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>A défini le style américain à Hawaï durant la 2e Guerre. Lignes audacieuses, pin-ups, ancres. A créé l'encre violette et amélioré la stérilisation.</p></div>`
            },
            'whangod': {
                title: 'Whang-od : La Dernière Mambabatok',
                description: 'La dernière Mambabatok de Kalinga. Gardienne de la tradition.',
                category: 'Ancêtres',
                author: 'Apo Whang-od',
                date: 'LÉGENDE VIVANTE',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>Aux Philippines, Whang-od maintient la technique de l'épine et du bambou. Elle a brisé la tradition pour former des femmes et sauver l'héritage.</p></div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III : Âme du Japon',
                description: 'Maître suprême de l\'Irezumi japonais. Une légende vivante.',
                category: 'Maître Irezumi',
                author: 'Yoshihito Nakano',
                date: 'LÉGENDE VIVANTE',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>Trésor vivant du Japon. Maître du Tebori (main), créant des costumes complets racontant des mythes.</p></div>`
            },
            'filip': {
                title: 'Filip Leu : Le Dragon Psychédélique',
                description: 'Pionnier du style biomécanique et des grandes compositions.',
                category: 'Innovation Suisse',
                author: 'La Famille Leu',
                date: 'LÉGENDE VIVANTE',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>Unit la tradition japonaise au psychédélisme occidental. Maître du "flow", dessinant AVEC l'anatomie.</p></div>`
            },
            'lyle': {
                title: 'Lyle Tuttle : Tatoueur des Stars',
                description: 'A porté l\'art de la rue en couverture de Rolling Stone.',
                category: 'Icône Pop',
                author: 'Ami de Janis Joplin',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>A mis le tatouage en couverture de Rolling Stone. A tatoué Janis Joplin et normalisé le tatouage pour les femmes.</p></div>`
            },
            'edhardy': {
                title: 'Ed Hardy : Parrain du Moderne',
                description: 'A uni l\'Est et l\'Ouest. Le parrain du moderne.',
                category: 'Légende',
                author: 'Don Ed Hardy',
                date: 'LÉGENDE VIVANTE',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Protégé de Sailor Jerry. Premier occidental accepté par les maîtres japonais. A élevé le tatouage au rang de Beaux-Arts.</p></div>`
            },
            'anavelho': {
                title: 'Ana Velho : Pionnière Brésilienne',
                description: 'La pionnière qui a ouvert la voie au tatouage féminin au Brésil.',
                category: 'Histoire',
                author: 'Archives',
                date: 'Années 80',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro"><p>Première femme tatoueuse pro au Brésil. A bravé les préjugés et ouvert la voie aux femmes.</p></div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler : Réalisme',
                description: 'A élevé le niveau du réalisme noir et gris à un nouveau sommet artistique.',
                category: 'Point Fort',
                author: 'Rédaction',
                date: 'AUJOURD\'HUI',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro"><p>Sculpte sur la peau avec un réalisme noir et gris inégalé. Capture l'âme dans les portraits.</p></div>`
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: Le Gardien des Peaux',
                description: 'Le médecin qui a sauvé l\'art de l\'Irezumi de l\'extinction.',
                category: 'Histoire',
                author: 'Rédaction',
                date: '27 JANV 2026',
                date: '27 JANV 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>Au début du XXe siècle au Japon, le tatouage était interdit. C'est alors qu'apparut le Dr Fukushi Masaichi, le médecin qui vit dans les tatouages un patrimoine culturel digne d'être préservé.</p></div><div class="article-section"><h2>Une Collection Immortelle</h2><p>Alors que le gouvernement tentait d'effacer la tradition, Fukushi cataloguait et préservait les peaux tatouées de volontaires après leur mort. Il a prouvé que le corps meurt, mais que l'art n'a pas besoin de mourir avec lui.</p></div>`
            },
            'burchett': {
                title: 'George Burchett : Le Roi des Tatoueurs',
                description: 'A traversé les guerres, les rois et les cultures. Le Roi des Tatoueurs.',
                category: 'Royauté Britannique',
                author: 'Archives',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>Appelé "The King of Tattooists". Il a traversé les guerres, les rois et les cultures, laissant de l'encre là où beaucoup ne verraient que la peur. Il a tatoué de la royauté britannique au simple ouvrier.</p></div><div class="article-section"><h2>Une Lignée Ancienne</h2><p>Si le tatouage est respecté comme un art aujourd'hui, c'est parce que des géants comme Burchett ont existé. Le temps passe, les machines évoluent, mais l'âme du tatouage reste la même : le courage de marquer le monde.</p></div>`
            },
            'jessie': {
                title: 'Jessie Knight : La Dame de l\'Aiguille',
                description: 'La première femme à tatouer professionnellement au Royaume-Uni.',
                category: 'Pionnière',
                author: 'Rédaction',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>Fille d'artistes de cirque, Jessie a grandi entre les spectacles et le courage. À 18 ans, elle a pris sa première machine. À une époque où le tatouage était une "affaire d'hommes", elle a brisé le silence.</p></div><div class="article-section"><h2>Le Talent n'a pas de Genre</h2><p>En 1955, elle a remporté la deuxième place au Champion Tattoo Artist of All England. Jessie a ouvert la voie à toutes les femmes. Elle est tradition vivante et résistance.</p></div>`
            },
            'steve': {
                title: 'Steve Butcher & Yomico',
                description: 'La visite historique des géants du réalisme couleur au Brésil.',
                category: 'Événement',
                author: 'Rédaction',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro"><p>Géants du réalisme couleur au Brésil. Un échange historique élevant le niveau.</p></div>`
            },
            'cris': {
                title: 'Cris Nieiro : Double Victoire',
                description: 'Exploit inédit : A gagné la Tattoo Week et All Stars Miami le même week-end.',
                category: 'Champion',
                author: 'Rédaction',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro"><p>A gagné AllStars et TattooWeek le même week-end. Exploit historique.</p></div>`
            },
            'neto': {
                title: 'Neto Coutinho : Best of Show',
                description: 'Remporte l\'un des plus grands trophées de l\'histoire de la Tattoo Week.',
                category: 'Champion',
                author: 'Rédaction',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro"><p>A remporté le trophée suprême avec une œuvre impressionnante. Consécration.</p></div>`
            },
            'milano': {
                title: 'Brésil à Milan',
                description: 'Trois Brésiliens, trois prix et la consécration maximale en Europe.',
                category: 'International',
                author: 'Europe',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>Triple couronne et Best of Show pour les Brésiliens en Italie. Domination totale.</p></div>`
            },
            'flamingo': {
                title: 'Flamingo : Prix BMW',
                description: 'La technique Whipshading qui a valu une voiture neuve à Planet Tattoo.',
                category: 'Point Fort',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro"><p>A gagné une voiture neuve avec un Whipshading impeccable. Un rêve réalisé.</p></div>`
            }
        }
    },
    es: {
        nav: { manifesto: "Manifiesto", history: "Historia", era: "Edad de Oro", highlights: "Destacados", ranking: "Top Artistas", interviews: "Entrevistas", events: "Eventos", quiz: "Quiz", shop: "Herramientas" },
        hero: { line1: "El Cuerpo es el Templo.", line2: "La Tinta es el Alma.", line3: "El Arte es Eterno.", text: "Masters of Tattoo no es sobre tendencias. Es sobre legado. <br> Respetamos la historia, la técnica y consagramos la piel.", signature: "Bienvenido al templo." },
        headers: { history: "Historia y Cultura", era: "Edad de Oro", eraDesc: "Homenaje a los pioneros que construyeron los cimientos.", highlights: "Destacados", ranking: "Top Artistas del Mundo", interviews: "Entrevistas", events: "Calendario", eventsDesc: "Mantente al día con las convenciones.", brazil: "BRASIL 🇧🇷", international: "INTERNACIONAL 🌍", quiz: "Descubre Tu Estilo", quizDesc: "Responde 5 preguntas y encuentra tu artista.", tools: "Herramientas", magazine: "Revista", partners: "Socios Oficiales" },
        buttons: { readMore: "Leer Artículo", viewMatter: "Ver Historia", viewWork: "Ver Obra", viewList: "Ver Lista", viewProfile: "Ver Perfil", startQuiz: "Iniciar", close: "Cerrar", knowMore: "Saber Más", readDigital: "Leer Digital" },
        table: { month: "Mes", event: "Evento", location: "Ubicación" },
        months: {
            JAN: "ENE", FEV: "FEB", MAR: "MAR", ABR: "ABR", MAI: "MAY", JUN: "JUN",
            JUL: "JUL", AGO: "AGO", SET: "SEP", OUT: "OCT", NOV: "NOV", DEZ: "DIC"
        },
        footer: { manifesto: "Manifiesto", ranking: "Ranking", magazine: "Revista", contact: "Contacto", copy: "&copy; 2026 MESTRES DA TATTOO. Todos los derechos reservados." },
        quiz: {
            questions: [
                {
                    question: "¿Qué es lo que más te llama la atención en una obra?",
                    choices: [
                        { text: "Trazos fuertes y colores vibrantes", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Sombras suaves y fidelidad a la realidad", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Líneas finas, delicadeza y precisión", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Significado ancestral y formas geométricas", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "¿Cuál es el tamaño de tu valentía (y del tatuaje)?",
                    choices: [
                        { text: "Manga completa / Espalda", style: "Realismo" },
                        { text: "Mediana, tal vez en el antebrazo", style: "Old School" },
                        { text: "Pequeña y discreta", style: "Fine Line" },
                        { text: "Adaptable al cuerpo", style: "Tribal" }
                    ]
                },
                {
                    question: "¿Color o Blanco y Negro?",
                    choices: [
                        { text: "Colorido y Sólido", style: "Old School" },
                        { text: "Blanco y Negro (Sombras)", style: "Realismo" },
                        { text: "Solo Negro (Línea)", style: "Fine Line" },
                        { text: "Negro Sólido (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "¿Qué representa el tatuaje para ti?",
                    choices: [
                        { text: "Historia y Tradición (Marina/Vintage)", style: "Old School" },
                        { text: "Retrato u Homenaje Eterno", style: "Realismo" },
                        { text: "Estética y Minimalismo", style: "Fine Line" },
                        { text: "Conexión Espiritual/Guerrera", style: "Tribal" }
                    ]
                },
                {
                    question: "Para recomendarte un maestro, ¿dónde estás?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "Sur (RS/SC/PR)", value: "SUL" },
                        { text: "Nordeste (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Centro-Oeste (DF/GO...)", value: "CENTRO" },
                        { text: "Otro / Internacional", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Tu Estilo Predominante es:",
            resultDesc: "Calculando recomendación...",
            recommendationTitle: "Maestros Recomendados en tu Región:"
        },
        ranking: { artistLink: "Enlace Artista", viewProfile: "Ver Perfil" },
        articles: {
            'polynesia': {
                title: 'El Significado Sagrado del Tatuaje Polinesio',
                description: 'Un viaje profundo a las raíces tribales y el significado de cada símbolo.',
                category: 'Orígenes',
                author: 'Maestro Ka’eo',
                date: '27 ENE 2026',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>"En Polinesia, no hay tatuaje sin Mana. Cada línea cuenta la historia de quién fuiste, quién eres y quién deseas ser."</p></div>
                <div class="article-section">
                    <h2>El Origen Sagrado</h2>
                    <p>Hace unos 2000 años, el pueblo Lapita comenzó su gran migración. Llevaban un arte sagrado. "Tatau" significa golpear o marcar.</p>
                    <p>A diferencia del tatuaje moderno que se centra en la estética, el Tatau era un rito de paso. Un hombre sin tatuajes era considerado "desnudo" y sin estatus social.</p>
                </div>
                <div class="article-section">
                    <h2>Símbolos y Significados</h2>
                    <p><strong>Enata:</strong> Figuras humanas y dioses. Historias de matrimonio y familia.</p>
                    <p><strong>Dientes de Tiburón:</strong> Protección, guía y fuerza.</p>
                    <p><strong>Puntas de Lanza:</strong> Coraje y lucha. La promesa del guerrero.</p>
                </div>
                <div class="article-section">
                    <h2>El Renacimiento Moderno</h2>
                    <p>Casi extinguido por misioneros, el arte polinesio vive un renacimiento global. Tatuadores como Sulu'ape luchan por mantener la pureza de las herramientas.</p>
                </div>`
            },
            'brasil': {
                title: 'Historia del Tatuaje en Brasil',
                description: 'Todo comenzó en el Puerto de Santos con Lucky Tattoo.',
                category: 'Historia Nacional',
                author: 'Luiz "Cais" Pereira',
                date: '15 FEB 2026',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>Brasil es tierra fértil para el arte en la piel. Todo comenzó en el Puerto de Santos.</p></div>
                <div class="article-section">
                    <h2>Lucky Tattoo: El Pionero (1959)</h2>
                    <p>Knud "Lucky" Gregersen fue el primer tatuador profesional de Brasil. Trajo máquinas eléctricas y la mística Old School al trópico.</p>
                    <p>Sus clientes eran marineros y marginados. Lucky no vendía dibujos; vendía coraje.</p>
                </div>
                <div class="article-section">
                    <h2>La Explosión</h2>
                    <p>En los 80, Caio Tattoo y Marco Leão profesionalizaron el sector. Hoy, Brasil es una potencia mundial exportando talentos como Ralf Nonnweiler y Karlla Mendes.</p>
                </div>`
            },
            'origins': {
                title: 'Origen del Tatuaje: Marcas Antiguas',
                description: 'Ötzi y las marcas terapéuticas de hace 5300 años.',
                category: 'Historia Profunda',
                author: 'Dra. Elena "Ink" Bianchi',
                date: '02 ABR 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>Antes de la escritura, existía la marca. Ötzi, el hombre de hielo, tenía tatuajes terapéuticos hace 5300 años.</p></div>
                <div class="article-section">
                    <h2>Medicina Primitiva</h2>
                    <p>Los tatuajes de Ötzi estaban en puntos de acupuntura para tratar la artritis. El tatuaje nació como medicina y conexión espiritual, no solo como estética.</p>
                </div>`
            },
            'modern': {
                title: 'De la Piel a las Galerías: La Nueva Era',
                description: 'El tatuaje como Bellas Artes en el Louvre.',
                category: 'Revolución Visual',
                author: 'Curadora Anna "Canvas"',
                date: '22 MAY 2026',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>Lo que antes era rebelde ahora está en el Louvre. La piel es el lienzo definitivo. Los maestros modernos cobran como grandes pintores.</p></div>
                <div class="article-section">
                    <h2>El Fin del Prejuicio</h2>
                    <p>Abogados y médicos ahora lucen mangas completas. La calidad técnica del Realismo y la Acuarela superó el estigma. El tatuaje es el arte más efímero y precioso, pues muere con su portador.</p>
                </div>`
            },
            'sailor': {
                title: 'Sailor Jerry: Padre del Old School',
                description: 'El padre del Old School americano. Sus flashes definieron una era.',
                category: 'Leyenda Viva',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>"No tengo ni una pulgada de piel virgen." - Norman 'Sailor Jerry' Collins.</p></div>
                <div class="article-section">
                    <h2>Honolulu, Segunda Guerra</h2>
                    <p>Miles de marineros queriendo recordar su hogar. Jerry les dio anclas, golondrinas y corazones "MOM". Creó la tinta púrpura y modernizó la esterilización. Su legado vive en cada tatuaje tradicional.</p>
                </div>`
            },
            'whangod': {
                title: 'Whang-od: La Última Mambabatok',
                description: 'La última Mambabatok de Kalinga. Guardiana de la tradición.',
                category: 'Ancestros',
                author: 'Apo Whang-od',
                date: 'LEYENDA VIVA',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>En Filipinas, Whang-od de 107 años mantiene viva la técnica de la espina y el bambú ("Tok, tok, tok").</p></div>
                <div class="article-section">
                    <h2>Rompiendo Tabúes</h2>
                    <p>Tradicionalmente solo para guerreros, ahora tatúa turistas. Entrenó a sus sobrinas para salvar el arte, probando que la cultura es resistencia viva.</p>
                </div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III: Alma del Japón',
                description: 'Maestro supremo del Irezumi japonés. Una leyenda viva.',
                category: 'Maestro Irezumi',
                author: 'Yoshihito Nakano',
                date: 'LEYENDA VIVA',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>Tesoro vivo de Japón. Maestro del Tebori (manual), creando trajes completos que cuentan mitos y leyendas.</p></div>
                <div class="article-section">
                    <h2>El Camino del Tebori</h2>
                    <p>Cree que la máquina inserta tinta, pero el Tebori inserta alma. Sus dragones y carpas koi fluyen con la musculatura humana en una narrativa única.</p>
                </div>`
            },
            'filip': {
                title: 'Filip Leu: El Dragón Psicodélico',
                description: 'Pionero del estilo biomecánico y grandes composiciones.',
                category: 'Innovación Suiza',
                author: 'La Familia Leu',
                date: 'LEYENDA VIVA',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>Nacido en la legendaria Familia Leu. Revolucionó el tatuaje uniendo tradición japonesa y psicodelia.</p></div>
                <div class="article-section">
                    <h2>El Flujo Perfecto</h2>
                    <p>Su mayor contribución es cómo trabaja con la anatomía. Sus dragones no están "sobre" el brazo, "son" el brazo. Enseñó al mundo que el tatuaje grande debe ser fluido.</p>
                </div>`
            },
            'lyle': {
                title: 'Lyle Tuttle: Tatuador de las Estrellas',
                description: 'Llevó el arte de la calle a la portada de Rolling Stone.',
                category: 'Ícono Pop',
                author: 'Redacción',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>Lyle Tuttle sacó el tatuaje de los callejones oscuros y lo puso bajo los reflectores. Tatuó a Janis Joplin y Cher.</p></div>
                <div class="article-section">
                    <h2>Revolución de San Francisco</h2>
                    <p>En el Verano del Amor, normalizó el tatuaje para las mujeres como adorno y liberación. También fue un gran historiador del arte.</p>
                </div>`
            },
            'edhardy': {
                title: 'Ed Hardy: El Padrino del Moderno',
                description: 'Unió Oriente y Occidente. Elevó el tatuaje a Bellas Artes.',
                category: 'Leyenda',
                author: 'Don Ed Hardy',
                date: 'LEYENDA VIVA',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Mucho más que una marca de ropa. Ed Hardy fue el primer occidental aceptado por maestros japoneses.</p></div>
                <div class="article-section">
                    <h2>Tattoo City</h2>
                    <p>Introdujo el concepto de "Custom Tattoo" en San Francisco. Cambió la industria de "elige un dibujo" a "crea arte exclusivo".</p>
                </div>`
            },
            'anavelho': {
                title: 'Ana Velho: Pionera Brasileña',
                description: 'La fuerza femenina que abrió caminos en Brasil.',
                category: 'Historia',
                author: 'Archivo',
                date: 'Años 80',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro"><p>Primera mujer tatuadora profesional en Brasil. Enfrentó prejuicios dobles y abrió el camino para todas.</p></div>
                <div class="article-section">
                    <h2>Legado</h2>
                    <p>Viniendo de Bellas Artes, trajo técnica y sensibilidad. Luchó por la higiene y el profesionalismo en una época marginal.</p>
                </div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler: Maestro del Realismo',
                description: 'Elevó el nivel del realismo negro y gris mundial.',
                category: 'Destacado',
                author: 'Redacción',
                date: 'HOY',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro"><p>Ralf no tatúa; esculpe con luz y sombra. Sus retratos tienen un alma que la cámara no capta.</p></div>
                <div class="article-section">
                    <h2>Técnica Impecable</h2>
                    <p>Domina la suavidad y los degradados como nadie. Probó que el negro y gris puede tener tanta profundidad como la pintura al óleo.</p>
                </div>`
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: El Coleccionista de Pieles',
                description: 'El médico que salvó el arte del Irezumi de la extinción.',
                category: 'Historia',
                author: 'Redacción',
                date: '27 ENE 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>Patólogo japonés que preservó pieles tatuadas cuando el arte estaba prohibido.</p></div>
                <div class="article-section">
                    <h2>Ciencia y Arte</h2>
                    <p>Su colección en la Universidad de Tokio mantiene vivas las obras de maestros antiguos que se habrían perdido. Un legado de respeto y conservación.</p>
                </div>`
            },
            'burchett': {
                title: 'George Burchett: El Rey de los Tatuadores',
                description: 'Del frente de guerra a los palacios reales.',
                category: 'Realeza Británica',
                author: 'Archivo',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>Tatuó a reyes y trabajadores. Luchó por legitimar la profesión, vistiendo como médico y manteniendo un estudio impecable.</p></div>
                <div class="article-section">
                    <h2>Memorias</h2>
                    <p>Sus memorias son un documento vital de la era victoriana, mostrando cómo el tatuaje cruzaba todas las clases sociales.</p>
                </div>`
            },
            'jessie': {
                title: 'Jessie Knight: La Dama de la Aguja',
                description: 'La primera mujer tatuadora del Reino Unido.',
                category: 'Pionera',
                author: 'Redacción',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>Hija del circo, sin miedo a nada. Tatuaba a mano alzada (freehand), un estilo fluido y audaz.</p></div>
                <div class="article-section">
                    <h2>Icono Feminista</h2>
                    <p>Ganó premios en los años 50 compitiendo contra hombres. Hoy es el máximo icono para las mujeres en la industria.</p>
                </div>`
            },
            'steve': {
                title: 'Steve Butcher & Yomico: Titanes en Brasil',
                description: 'Encuentro histórico de maestros del realismo.',
                category: 'Evento',
                author: 'Redacción',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro"><p>Tattoo Week 2025 recibió a Steve Butcher y Yomico Moreno. Una clase magistral de realismo color y surrealismo.</p></div>
                <div class="article-section">
                    <h2>Intercambio Global</h2>
                    <p>La técnica NBA de Steve y el biomecánico de Yomico inspiraron a todos. El arte no tiene fronteras.</p>
                </div>`
            },
            'cris': {
                title: 'Cris Niero: La Consagración',
                description: 'Ganó Tattoo Week y All Stars Miami el mismo fin de semana.',
                category: 'Campeón',
                author: 'Redacción',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro"><p>Lo imposible sucedió. Cris Niero dominó dos continentes en 48 horas con Ouro en ambos.</p></div>
                <div class="article-section">
                    <h2>Soberanía Técnica</h2>
                    <p>Su Realismo Negro y Gris impresionó a jueces internacionales, probando la fuerza del tatuaje brasileño.</p>
                </div>`
            },
            'neto': {
                title: 'Neto Coutinho: La Obra Maestra',
                description: 'El Best of Show que detuvo el evento.',
                category: 'Campeón',
                author: 'Redacción',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro"><p>Neto presentó un cierre de espalda que parecía una pintura renacentista. 50 horas de aguja.</p></div>
                <div class="article-section">
                    <h2>El Trofeo</h2>
                    <p>Llevarse el Best of Show es la cima. Neto inspiró a una nueva generación a dedicarse a grandes proyectos.</p>
                </div>`
            },
            'milano': {
                title: 'Invasión Brasileña en Milán',
                description: 'Brasil dominó la convención más tradicional de Italia.',
                category: 'Internacional',
                author: 'Europa News',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>En Milán, Brasil probó que su deporte es el Tatuaje. Premios en Realismo y Neotradicional.</p></div>
                <div class="article-section">
                    <h2>Respeto Global</h2>
                    <p>Brasil es el mayor exportador de talentos. Milán fue la coronación de este fenómeno mundial.</p>
                </div>`
            },
            'flamingo': {
                title: 'Flamingo Artistic: Rey del Whip',
                description: 'La técnica que valió un auto cero km.',
                category: 'Destacado',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro"><p>Whipshading impecable le valió un BMW. Geometría sagrada y puntillismo de arrastre.</p></div>
                <div class="article-section">
                    <h2>El Premio</h2>
                    <p>Flamingo mostró que la técnica y el estudio traen resultados tangibles y lujosos.</p>
                </div>`
            }
        }
    },
    it: {
        nav: { manifesto: "Manifesto", history: "Storia", era: "Età dell'Oro", highlights: "In Evidenza", ranking: "Top Artisti", interviews: "Interviste", events: "Eventi", quiz: "Quiz", shop: "Strumenti" },
        hero: { line1: "Il Corpo è il Tempio.", line2: "L'Inchiostro è l'Anima.", line3: "L'Arte è Eterna.", text: "Masters of Tattoo non riguarda le tendenze. Riguarda l'eredità. <br> Rispettiamo la storia, la tecnica e consacriamo la pelle.", signature: "Benvenuto." },
        headers: { history: "Storia e Cultura", era: "Età dell'Oro", eraDesc: "Omaggio ai pionieri.", highlights: "In Evidenza", ranking: "Top Artisti del Mondo", interviews: "Interviste", events: "Calendario", eventsDesc: "Rimani aggiornato.", brazil: "BRASILE 🇧🇷", international: "INTERNAZIONALE 🌍", quiz: "Scopri Stile", quizDesc: "Rispondi a 5 domande e trova l'artista.", tools: "Strumenti", magazine: "Rivista", partners: "Partner Ufficiali" },
        buttons: { readMore: "Leggi Articolo", viewMatter: "Vedi Storia", viewWork: "Vedi Opera", viewList: "Vedi Lista", viewProfile: "Vedi Profilo", startQuiz: "Inizia", close: "Chiudi", knowMore: "Scopri", readDigital: "Leggi" },
        table: { month: "Mese", event: "Evento", location: "Luogo" },
        months: {
            JAN: "GEN", FEV: "FEB", MAR: "MAR", ABR: "APR", MAI: "MAG", JUN: "GIU",
            JUL: "LUG", AGO: "AGO", SET: "SET", OUT: "OTT", NOV: "NOV", DEZ: "DIC"
        },
        footer: { manifesto: "Manifesto", ranking: "Classifica", magazine: "Rivista", contact: "Contatti", copy: "&copy; 2026 MESTRES DA TATTOO. Tutti i diritti riservati." },
        quiz: {
            questions: [
                {
                    question: "Cosa ti attrae visivamente?",
                    choices: [
                        { text: "Linee spesse e colori solidi", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "Ombre morbide e realismo", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "Linee sottili e delicate", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "Motivi geometrici e tribali", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "Quanto è grande il tuo coraggio?",
                    choices: [
                        { text: "Braccio intero / Schiena", style: "Realismo" },
                        { text: "Medio, forse avambraccio", style: "Old School" },
                        { text: "Piccolo e discreto", style: "Fine Line" },
                        { text: "Adattabile al corpo", style: "Tribal" }
                    ]
                },
                {
                    question: "Colore o Bianco e Nero?",
                    choices: [
                        { text: "Colorato e Solido", style: "Old School" },
                        { text: "Bianco e Nero (Sfumature)", style: "Realismo" },
                        { text: "Solo Nero (Linee)", style: "Fine Line" },
                        { text: "Nero Solido (Blackwork)", style: "Tribal" }
                    ]
                },
                {
                    question: "Cosa rappresenta per te il tatuaggio?",
                    choices: [
                        { text: "Storia e Tradizione", style: "Old School" },
                        { text: "Ritratto o Tributo", style: "Realismo" },
                        { text: "Estetica e Minimalismo", style: "Fine Line" },
                        { text: "Connessione Spirituale", style: "Tribal" }
                    ]
                },
                {
                    question: "Per consigliarti un maestro, dove ti trovi?",
                    type: "location",
                    choices: [
                        { text: "São Paulo (SP)", value: "SP" },
                        { text: "Rio de Janeiro (RJ)", value: "RJ" },
                        { text: "Minas Gerais (MG)", value: "MG" },
                        { text: "Sud (RS/SC/PR)", value: "SUL" },
                        { text: "Nord-Est (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "Centro-Ovest (DF/GO...)", value: "CENTRO" },
                        { text: "Altro / Internazionale", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "Il Tuo Stile Dominante è:",
            resultDesc: "Calcolo raccomandazione...",
            recommendationTitle: "Maestri Consigliati nella tua Regione:"
        },
        ranking: { artistLink: "Link Artista", viewProfile: "Vedi Profilo" },
        articles: {
            'polynesia': {
                title: 'Il Significato Sacro del Tatuaggio Polinesiano',
                description: 'Un viaggio profondo alle radici tribali e il significato di ogni simbolo.',
                category: 'Origini',
                author: 'Maestro Ka’eo',
                date: '27 GEN 2026',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>"In Polinesia, non c'è tatuaggio senza Mana. Ogni linea racconta la storia di chi eri, chi sei e chi desideri diventare."</p></div><div class="article-section"><h2>L'Origine Sacra</h2><p>Circa 2000 anni fa, il popolo Lapita iniziò la sua grande migrazione. Portavano con sé un'arte sacra. "Tatau" significa battere o marcare.</p></div>`
            },
            'brasil': {
                title: 'Storia del Tatuaggio in Brasile',
                description: 'Tutto è iniziato al Porto di Santos. La storia dei pionieri.',
                category: 'Storia Nazionale',
                author: 'Luiz "Cais" Pereira',
                date: '15 FEB 2026',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>Il Brasile è terra fertile per l'arte sulla pelle. Tutto è iniziato al Porto di Santos.</p></div><div class="article-section"><h2>Lucky Tattoo: Il Pioniere</h2><p>Knud "Lucky" Gregersen fu il primo tatuatore professionista in Brasile (1959). Portò macchinette elettriche e mistica Old School ai tropici.</p></div>`
            },
            'origins': {
                title: 'Origine del Tatuaggio: Marchi Antichi',
                description: 'Ötzi e i marchi terapeutici di 5300 anni fa.',
                category: 'Storia Profonda',
                author: 'Dott.ssa Elena "Ink" Bianchi',
                date: '02 APR 2025',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>Prima della scrittura, c'era il marchio. Ötzi, l'uomo venuto dal ghiaccio, aveva tatuaggi terapeutici 5300 anni fa. Il tatuaggio è nato come medicina e connessione spirituale.</p></div>`
            },
            'modern': {
                title: 'Dalla Pelle alle Gallerie',
                description: 'Il tatuaggio come Belle Arti al Louvre.',
                category: 'Rivoluzione Visiva',
                author: 'Curatrice Anna "Canvas"',
                date: '22 MAG 2026',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>Ciò che un tempo era ribelle ora è al Louvre. La pelle è la tela definitiva. I maestri moderni guadagnano come grandi pittori.</p></div>`
            },
            'sailor': {
                title: 'Sailor Jerry: Padre dell\'Old School',
                description: 'Il padre dell\'Old School americano. I suoi flash hanno definito un\'era.',
                category: 'Leggenda Vivente',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>Ha definito lo stile americano alle Hawaii durante la Seconda Guerra Mondiale. Linee audaci, pin-up, ancore. Ha creato l'inchiostro viola e migliorato la sterilizzazione.</p></div>`
            },
            'whangod': {
                title: 'Whang-od: L\'Ultima Mambabatok',
                description: 'L\'ultima Mambabatok di Kalinga. Custode della tradizione.',
                category: 'Antenati',
                author: 'Apo Whang-od',
                date: 'LEGGENDA VIVENTE',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>Nelle Filippine, Whang-od mantiene viva la tecnica della spina e del bambù. Ha rotto la tradizione per addestrare donne e salvare l'eredità.</p></div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III: Anima del Giappone',
                description: 'Maestro supremo dell\'Irezumi giapponese. Una leggenda vivente.',
                category: 'Maestro Irezumi',
                author: 'Yoshihito Nakano',
                date: 'LEGGENDA VIVENTE',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>Tesoro vivente del Giappone. Maestro del Tebori (a mano), crea body suit completi che raccontano miti.</p></div>`
            },
            'filip': {
                title: 'Filip Leu: Il Drago Psichedelico',
                description: 'Pioniere dello stile biomeccanico e grandi composizioni.',
                category: 'Innovazione Svizzera',
                author: 'La Famiglia Leu',
                date: 'LEGGENDA VIVENTE',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>Unisce la tradizione giapponese alla psichedelia occidentale. Maestro del "flow", disegnando CON l'anatomia.</p></div>`
            },
            'lyle': {
                title: 'Lyle Tuttle: Tatuatore delle Star',
                description: 'Ha portato l\'arte di strada sulla copertina di Rolling Stone.',
                category: 'Icona Pop',
                author: 'Amico di Janis Joplin',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>Ha messo i tatuaggi sulla copertina di Rolling Stone. Ha tatuato Janis Joplin e normalizzato i tatuaggi per le donne.</p></div>`
            },
            'edhardy': {
                title: 'Ed Hardy: Padrino del Moderno',
                description: 'Ha unito Oriente e Occidente. Il padrino del moderno.',
                category: 'Leggenda',
                author: 'Don Ed Hardy',
                date: 'LEGGENDA VIVENTE',
                date: 'LEGGENDA VIVENTE',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Protetto di Sailor Jerry. Primo occidentale accettato dai maestri giapponesi. Ha elevato il tatuaggio a Belle Arti.</p></div>`
            },
            'anavelho': {
                title: 'Ana Velho: Pioniera Brasiliana',
                description: 'La pioniera che ha aperto la strada al tatuaggio femminile in Brasile.',
                category: 'Storia',
                author: 'Archivio',
                date: 'Anni \'80',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro"><p>Prima tatuatrice professionista in Brasile. Ha affrontato pregiudizi e aperto la strada alle donne.</p></div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler: Realismo',
                description: 'Ha elevato il livello del realismo in bianco e nero a una nuova vetta artistica.',
                category: 'In Evidenza',
                author: 'Redazione',
                date: 'OGGI',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro"><p>Scolpisce sulla pelle con un realismo in bianco e nero ineguagliabile. Cattura l'anima nei ritratti.</p></div>`
            },
            'fukushi': {
                title: 'Dr. Fukushi Masaichi: Il Custode delle Pelli',
                description: 'Il medico che salvò l\'arte dell\'Irezumi dall\'estinzione.',
                category: 'Storia',
                author: 'Redazione',
                date: '27 GEN 2026',
                date: '27 GEN 2026',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>Nel Giappone dell'inizio del XX secolo, il tatuaggio era proibito. Poi arrivò il Dr. Fukushi Masaichi, il medico che vide nei tatuaggi un patrimonio culturale degno di essere preservato.</p></div><div class="article-section"><h2>Una Collezione Immortale</h2><p>Mentre il governo cercava di cancellare la tradizione, Fukushi catalogava e preservava pelli tatuate di volontari dopo la morte. Ha dimostrato che il corpo muore, ma l'arte non deve morire con lui.</p></div>`
            },
            'burchett': {
                title: 'George Burchett: Il Re dei Tatuatori',
                description: 'Ha attraversato guerre, re e culture. Il Re dei Tatuatori.',
                category: 'Reale Britannico',
                author: 'Archivio',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>Chiamato "The King of Tattooists". Ha attraversato guerre, re e culture, lasciando inchiostro dove molti vedrebbero solo paura. Ha tatuato dalla famiglia reale britannica al comune lavoratore.</p></div><div class="article-section"><h2>Un Antico Lignaggio</h2><p>Se oggi il tatuaggio è rispettato come arte, è perché sono esistiti giganti come Burchett. Il tempo passa, le macchine si evolvono, ma l'anima del tatuaggio rimane la stessa: il coraggio di segnare il mondo.</p></div>`
            },
            'jessie': {
                title: 'Jessie Knight: La Signora dell\'Ago',
                description: 'La prima donna a tatuare professionalmente nel Regno Unito.',
                category: 'Pioniera',
                author: 'Redazione',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>Figlia di artisti circensi, Jessie è cresciuta tra gli spettacoli e il coraggio. A 18 anni ha preso la sua prima macchinetta. In un'epoca in cui il tatuaggio era "roba da uomini", ha strappato il silenzio.</p></div><div class="article-section"><h2>Il Talento non ha Genere</h2><p>Nel 1955, ha ottenuto il secondo posto al Champion Tattoo Artist of All England. Jessie ha aperto la strada a tutte le donne. È tradizione viva e resistenza.</p></div>`
            },
            'steve': {
                title: 'Steve Butcher & Yomico',
                description: 'La visita storica dei giganti del realismo a colori in Brasile.',
                category: 'Evento',
                author: 'Redazione',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro"><p>Giganti del realismo a colori in Brasile. Uno scambio storico che alza il livello.</p></div>`
            },
            'cris': {
                title: 'Cris Nieiro: Doppia Vittoria',
                description: 'Impresa inedita: Ha vinto Tattoo Week e All Stars Miami nello stesso fine settimana.',
                category: 'Campione',
                author: 'Redazione',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro"><p>Ha vinto AllStars e TattooWeek nello stesso fine settimana. Impresa storica.</p></div>`
            },
            'neto': {
                title: 'Neto Coutinho: Best of Show',
                description: 'Ha portato a casa uno dei più grandi trofei della storia della Tattoo Week.',
                category: 'Campione',
                author: 'Redazione',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro"><p>Ha portato a casa il trofeo più importante con un'opera impressionante. Consacrazione.</p></div>`
            },
            'milano': {
                title: 'Brasile a Milano',
                description: 'Tre brasiliani, tre premi e la massima consacrazione in Europa.',
                category: 'Internazionale',
                author: 'Europa',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>Tripla corona e Best of Show per i brasiliani in Italia. Dominio totale.</p></div>`
            },
            'flamingo': {
                title: 'Flamingo: Premio BMW',
                description: 'La tecnica Whipshading che è valsa un\'auto nuova a Planet Tattoo.',
                category: 'In Evidenza',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro"><p>Ha vinto un'auto nuova con un Whipshading impeccabile. Sogno realizzato.</p></div>`
            }
        }
    },
    zh: {
        nav: { manifesto: "宣言", history: "历史", era: "黄金时代", highlights: "精选", ranking: "顶尖艺术家", interviews: "访谈", events: "活动", quiz: "测验", shop: "工具" },
        hero: { line1: "身体是殿堂。", line2: "墨水是灵魂。", line3: "艺术是永恒。", text: "纹身大师无关潮流。关于传承。<br>我们尊重历史、技术并奉献皮肤。", signature: "欢迎。" },
        headers: { history: "历史与文化", era: "黄金时代", eraDesc: "致敬奠定基础的先驱。", highlights: "精选", ranking: "全球顶尖艺术家", interviews: "访谈", events: "日历", eventsDesc: "随时了解主要展会。", brazil: "巴西 🇧🇷", international: "国际 🌍", quiz: "发现风格", quizDesc: "回答5个问题找到完美的艺术家。", tools: "大师工具", magazine: "杂志", partners: "合作伙伴" },
        buttons: { readMore: "阅读文章", viewMatter: "查看故事", viewWork: "查看作品", viewList: "完整列表", viewProfile: "查看资料", startQuiz: "开始", close: "关闭", knowMore: "了解", readDigital: "阅读" },
        table: { month: "月份", event: "活动", location: "地点" },
        months: {
            JAN: "1月", FEV: "2月", MAR: "3月", ABR: "4月", MAI: "5月", JUN: "6月",
            JUL: "7月", AGO: "8月", SET: "9月", OUT: "10月", NOV: "11月", DEZ: "12月"
        },
        footer: { manifesto: "宣言", ranking: "排名", magazine: "杂志", contact: "联系", copy: "&copy; 2026 纹身大师。版权所有。" },
        quiz: {
            questions: [
                {
                    question: "视觉上什么吸引你？",
                    choices: [
                        { text: "粗线条和纯色", style: "Old School", image: "assets/quiz-oldschool.jpg" },
                        { text: "柔和阴影和现实主义", style: "Realismo", image: "assets/quiz-realism.jpg" },
                        { text: "细腻线条", style: "Fine Line", image: "assets/quiz-fineline.jpg" },
                        { text: "几何图案和部落", style: "Tribal", image: "assets/quiz-tribal.jpg" }
                    ]
                },
                {
                    question: "你的勇气有多大？",
                    choices: [
                        { text: "全臂 / 满背", style: "Realismo" },
                        { text: "中等，也许前臂", style: "Old School" },
                        { text: "小巧而低调", style: "Fine Line" },
                        { text: "适应身体", style: "Tribal" }
                    ]
                },
                {
                    question: "彩色还是黑灰？",
                    choices: [
                        { text: "多彩且坚实", style: "Old School" },
                        { text: "黑灰（阴影）", style: "Realismo" },
                        { text: "仅黑色（线条）", style: "Fine Line" },
                        { text: "纯黑（Blackwork）", style: "Tribal" }
                    ]
                },
                {
                    question: "纹身对你意味着什么？",
                    choices: [
                        { text: "历史与传统", style: "Old School" },
                        { text: "肖像或致敬", style: "Realismo" },
                        { text: "美学与极简主义", style: "Fine Line" },
                        { text: "精神联系", style: "Tribal" }
                    ]
                },
                {
                    question: "为了推荐大师，你在哪里？",
                    type: "location",
                    choices: [
                        { text: "圣保罗 (SP)", value: "SP" },
                        { text: "里约热内卢 (RJ)", value: "RJ" },
                        { text: "米纳斯吉拉斯 (MG)", value: "MG" },
                        { text: "南部 (RS/SC/PR)", value: "SUL" },
                        { text: "东北部 (BA/PE/CE...)", value: "NORDESTE" },
                        { text: "中西部 (DF/GO...)", value: "CENTRO" },
                        { text: "其他 / 国际", value: "OUTRO" }
                    ]
                }
            ],
            resultTitle: "你的主导风格是：",
            resultDesc: "计算推荐...",
            recommendationTitle: "你所在地区的推荐大师："
        },
        ranking: { artistLink: "艺术家链接", viewProfile: "查看资料" },
        articles: {
            'polynesia': {
                title: '波利尼西亚纹身的神圣意义',
                description: '深入了解部落根源及每个符号的意义。',
                category: '起源',
                author: '大师 Ka’eo',
                date: '2026年1月27日',
                headerImage: 'assets/history-tribal.png',
                content: `<div class="article-intro"><p>“在波利尼西亚，没有 Mana 就没有纹身。每一行都讲述了你曾经是谁，你是谁，以及你想成为谁的故事。”</p></div><div class="article-section"><h2>神圣的起源</h2><p>大约2000年前，拉皮塔人开始了他们的伟大迁徙。他们带着一种神圣的艺术。“Tatau”意味着敲击或标记。</p></div>`
            },
            'brasil': {
                title: '巴西纹身历史',
                description: '一切始于桑托斯港。先驱者的历史。',
                category: '国家历史',
                author: 'Luiz "Cais" Pereira',
                date: '2026年2月15日',
                headerImage: 'assets/brazil-history.png',
                content: `<div class="article-intro"><p>巴西是皮肤艺术的沃土。一切始于桑托斯港。</p></div><div class="article-section"><h2>Lucky Tattoo：先驱</h2><p>Knud "Lucky" Gregersen 是巴西第一位职业纹身师（1959年）。他将电动机器和老派神秘感带到了热带地区。</p></div>`
            },
            'origins': {
                title: '纹身的起源：古代印记',
                description: '奥茨和5300年前的治疗印记。',
                category: '深厚历史',
                author: 'Elena "Ink" Bianchi 博士',
                date: '2025年4月2日',
                headerImage: 'assets/origin-tattoo.png',
                content: `<div class="article-intro"><p>在文字之前，就有了印记。冰人奥茨在5300年前就有治疗性纹身。纹身诞生于医学和精神联系。</p></div>`
            },
            'modern': {
                title: '从皮肤到画廊',
                description: '卢浮宫中的纹身艺术。',
                category: '视觉革命',
                author: '策展人 Anna "Canvas"',
                date: '2026年5月22日',
                headerImage: 'assets/gallery-modern.png',
                content: `<div class="article-intro"><p>曾经叛逆的东西现在在卢浮宫。皮肤是终极画布。现代大师的收费像伟大的画家一样。</p></div>`
            },
            'sailor': {
                title: 'Sailor Jerry：Old School 之父',
                description: '美国老派之父。他的手稿定义了一个时代。',
                category: '活着的传奇',
                author: 'Norman Collins',
                date: '1911 - 1973',
                headerImage: 'assets/legend-sailor.png',
                name: 'Sailor Jerry',
                content: `<div class="article-intro"><p>二战期间在夏威夷定义了美国风格。大胆的线条，海报女郎，锚。创造了紫色墨水并改善了消毒。</p></div>`
            },
            'whangod': {
                title: 'Whang-od：最后的 Mambabatok',
                description: '卡林加最后的 Mambabatok。传统的守护者。',
                category: '祖先',
                author: 'Apo Whang-od',
                date: '活着的传奇',
                headerImage: 'assets/whang-od.png',
                name: 'Whang-od',
                content: `<div class="article-intro"><p>在菲律宾，Whang-od 保持着刺和竹子技术的活力。她打破传统训练女性，拯救遗产。</p></div>`
            },
            'horiyoshi': {
                title: 'Horiyoshi III：日本之魂',
                description: '日本 Irezumi 的最高大师。活着的传奇。',
                category: 'Irezumi 大师',
                author: 'Yoshihito Nakano',
                date: '活着的传奇',
                headerImage: 'assets/legend-irezumi.png',
                name: 'Horiyoshi III',
                content: `<div class="article-intro"><p>日本的人间国宝。Tebori（手雕）大师，创造讲述神话故事的全身套装。</p></div>`
            },
            'filip': {
                title: 'Filip Leu：迷幻龙',
                description: '生物机械风格和宏大构图的先驱。',
                category: '瑞士创新',
                author: 'Leu 家族',
                date: '活着的传奇',
                headerImage: 'assets/legend-leu.png',
                name: 'Filip Leu',
                content: `<div class="article-intro"><p>将日本传统与西方迷幻结合在一起。“流动”大师，顺应解剖结构作画。</p></div>`
            },
            'lyle': {
                title: 'Lyle Tuttle：明星纹身师',
                description: '将街头艺术带上了《滚石》封面。',
                category: '流行偶像',
                author: 'Janis Joplin 的朋友',
                date: '1931 - 2019',
                headerImage: 'assets/legend-lyle.png',
                name: 'Lyle Tuttle',
                content: `<div class="article-intro"><p>将纹身带上了《滚石》杂志封面。为 Janis Joplin 纹身，并使女性纹身正常化。</p></div>`
            },
            'edhardy': {
                title: 'Ed Hardy：现代教父',
                description: '联合了东方和西方。现代纹身教父。',
                category: '传奇',
                author: 'Don Ed Hardy',
                date: '活着的传奇',
                headerImage: 'assets/legend-edhardy-real.jpg',
                name: 'Ed Hardy',
                content: `<div class="article-intro"><p>Sailor Jerry 的门徒。第一位被日本大师接受的西方人。将纹身提升为美术。</p></div>`
            },
            'anavelho': {
                title: 'Ana Velho：巴西先驱',
                description: '为巴西女性纹身开辟道路的先驱。',
                category: '历史',
                author: '档案馆',
                date: '80年代',
                headerImage: 'assets/legend-ana-velho.jpg',
                name: 'Ana Velho',
                content: `<div class="article-intro"><p>巴西第一位职业女性纹身师。面对偏见，为所有女性开辟了道路。</p></div>`
            },
            'ralf': {
                title: 'Ralf Nonnweiler：现实主义',
                description: '将黑灰现实主义提升到了新的艺术高度。',
                category: '精选',
                author: '编辑部',
                date: '今天',
                headerImage: 'assets/highlight-ralf-portrait.jpg',
                content: `<div class="article-intro"><p>以无与伦比的黑灰现实主义在皮肤上雕刻。在肖像画中捕捉灵魂。</p></div>`
            },
            'fukushi': {
                title: '福士政一博士：皮肤的守护者',
                description: '拯救 Irezumi 艺术免于灭绝的医生。',
                category: '历史',
                author: '编辑部',
                date: '2026年1月27日',
                date: '2026年1月27日',
                headerImage: 'assets/history-fukushi-real.jpg',
                content: `<div class="article-intro"><p>20世纪初的日本，纹身是被禁止的。福士政一博士出现了，他视纹身为值得保存的文化遗产。</p></div><div class="article-section"><h2>不朽的收藏</h2><p>当政府试图抹去这一传统时，福士博士分类并保存了志愿者死后的纹身皮肤。他证明了肉体虽死，但艺术不必随之消亡。</p></div>`
            },
            'burchett': {
                title: 'George Burchett：纹身师之王',
                description: '跨越战争、国王和文化。纹身师之王。',
                category: '英国皇室',
                author: '档案',
                date: '1872 - 1953',
                headerImage: 'assets/legend-burchett.jpg',
                name: 'George Burchett',
                content: `<div class="article-intro"><p>被称为“纹身师之王”。他跨越战争、国王和文化，在许多人只看到恐惧的地方留下了墨水。他为英国皇室到普通工人纹身。</p></div><div class="article-section"><h2>古老的血统</h2><p>如果今天纹身被尊为艺术，那是因为有像 Burchett 这样的巨人存在。时光流逝，机器进化，但纹身的灵魂始终如一：标记世界的勇气。</p></div>`
            },
            'jessie': {
                title: 'Jessie Knight：针尖上的女士',
                description: '英国第一位职业女性纹身师。',
                category: '先驱',
                author: '编辑部',
                date: '1904 - 1992',
                headerImage: 'assets/legend-jessie.jpg',
                name: 'Jessie Knight',
                content: `<div class="article-intro"><p>马戏团艺人的女儿，Jessie 在表演和勇气中长大。18岁时，她拿起了第一台机器。在纹身是“男人专利”的时代，她打破了沉默。</p></div><div class="article-section"><h2>天赋无关性别</h2><p>1955年，她在全英纹身艺术家冠军赛中获得第二名。Jessie 为所有女性铺平了道路。她是活着的传统和反抗。</p></div>`
            },
            'steve': {
                title: 'Steve Butcher & Yomico',
                description: '色彩现实主义巨人对巴西的历史性访问。',
                category: '活动',
                author: '编辑部',
                date: '2025',
                headerImage: 'assets/highlight-steve-yuri.jpg',
                content: `<div class="article-intro"><p>巴西色彩现实主义的巨人。一场提高标准的历史性交流。</p></div>`
            },
            'cris': {
                title: 'Cris Nieiro：双重胜利',
                description: '史无前例的壮举：同一周末赢得纹身周和迈阿密全明星赛。',
                category: '冠军',
                author: '编辑部',
                date: '2025',
                headerImage: 'assets/highlight-cris.jpg',
                content: `<div class="article-intro"><p>在同一个周末赢得了全明星和纹身周。历史性的壮举。</p></div>`
            },
            'neto': {
                title: 'Neto Coutinho：全场最佳',
                description: '带回了纹身周历史上最大的奖杯之一。',
                category: '冠军',
                author: '编辑部',
                date: '2025',
                headerImage: 'assets/highlight-neto-trophy.jpg',
                content: `<div class="article-intro"><p>凭借令人印象深刻的作品获得了最高奖杯。巨人的加冕。</p></div>`
            },
            'milano': {
                title: '巴西在米兰',
                description: '三位巴西人，三个奖项，在欧洲获得最高荣誉。',
                category: '国际',
                author: '欧洲',
                date: '2025',
                headerImage: 'assets/highlight-milano.jpg',
                content: `<div class="article-intro"><p>巴西人在意大利获得三冠王和全场最佳。完全统治。</p></div>`
            },
            'flamingo': {
                title: 'Flamingo：宝马奖',
                description: '在 Planet Tattoo 赢得一辆新车的 Whipshading 技术。',
                category: '精选',
                author: 'Planet Tattoo',
                date: '2025',
                headerImage: 'assets/highlight-flamingo-bmw.jpg',
                content: `<div class="article-intro"><p>凭借无可挑剔的 Whipshading 赢得了一辆新车。梦想成真。</p></div>`
            }
        }
    }
};

window.siteTranslations = translations;
