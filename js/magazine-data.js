const magazineData = {
    // Section 1: Mestres History (10 Pages = 5 Sheets)
    mestresHistory: [
        {
            title: "ANTES DO NOME",
            subtitle: "PÁGINA 1",
            content: `<p>Toda história verdadeira começa antes de ter nome.</p><p>Em 2016, o Instagram ainda era simples. Não havia Reels, não havia algoritmos famintos por atenção. Havia fotos. Silêncio. Tempo. E havia a tatuagem — essa arte antiga que sempre sobreviveu mais pelo respeito do que pelo aplauso.</p><p>Foi nesse cenário que nasceu a ideia do Mestres da Tattoo. Não como uma página, mas como um gesto: contar histórias. Histórias que não estavam nos livros, nem nos holofotes. Histórias guardadas na memória dos próprios tatuadores.</p><p>A semente veio do Beicinho, com um olhar raro: perceber que os verdadeiros fundadores da arte estavam envelhecendo, e que suas histórias corriam o risco de desaparecer junto com eles.</p>`,
            image: "assets/history-cover.jpg",
            type: "history-full"
        },
        {
            title: "QUANDO A FONTE ERA O PRÓPRIO MESTRE",
            subtitle: "PÁGINA 2",
            content: `<p>No início, o Mestres da Tattoo era quase um trabalho arqueológico.</p><p>As histórias não vinham prontas. Algumas eram contadas diretamente pelos pioneiros. Outras precisavam ser buscadas, reconstruídas, confirmadas. Era preciso ouvir, comparar versões, respeitar o tempo de cada mestre.</p><p>Não era conteúdo para todos. Nunca foi.</p><p>Enquanto muitos buscavam apenas imagens bonitas, o Mestres buscava contexto. Enquanto outros corriam atrás de likes, aqui se corria atrás da verdade.</p><p>E talvez por isso tenha funcionado.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "O CRESCIMENTO LENTO (E NECESSÁRIO)",
            subtitle: "PÁGINA 3",
            content: `<p>O crescimento não foi rápido. Foi sólido.</p><p>Foram anos falando com quem realmente se importava. Pessoas que queriam saber quem veio antes. Quem abriu caminho. Quem tatuava quando tatuar ainda era marginal.</p><p>A página começou a ganhar espaço justamente por não tentar agradar todo mundo. Ela falava com quem entendia que tatuagem não começa na agulha — começa na história.</p><p>Cada novo seguidor era alguém que reconhecia valor na memória.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "2018: A CONTINUIDADE DO FOGO",
            subtitle: "PÁGINA 4",
            content: `<p>Em 2018, a administração do perfil mudou de mãos.</p><p>Você assume o Mestres da Tattoo não como quem toma posse, mas como quem assume um compromisso. Um compromisso com o passado, com o presente e com o futuro da tatuagem.</p><p>A missão permaneceu a mesma: contar histórias.</p><p>Mas o campo se ampliou.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "ANTIGOS E NOVOS MESTRES",
            subtitle: "PÁGINA 5",
            content: `<p>O Mestres da Tattoo nunca foi um memorial fechado.</p><p>Ao mesmo tempo em que honra os pioneiros, também reconhece os novos mestres. Aqueles que hoje constroem linguagem, técnica e identidade.</p><p>A história não parou.</p><p>Ela continua sendo escrita — em estúdios, em convenções, em eventos, em viagens.</p><p>E o Mestres passou a estar presente. Observando. Registrando. Mostrando o que muitos não viam.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "MAIS DO QUE FOTOS",
            subtitle: "PÁGINA 6",
            content: `<p>O Mestres da Tattoo nunca foi uma página de tatuagens bonitas.</p><p>Aqui não se posta apenas o resultado final. Posta-se o porquê. O quem. O de onde veio.</p><p>Cada postagem carrega contexto. Cada história carrega legado.</p><p>A tatuagem é tratada como o que ela sempre foi: uma linguagem cultural.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "300 MIL VOZES, UM SÓ PROPÓSITO",
            subtitle: "PÁGINA 7",
            content: `<p>Foram necessários quase 10 anos para chegar aos 300 mil seguidores.</p><p>Sem atalhos. Sem modismos. Sem abandonar a essência.</p><p>Mais de 100 histórias contadas ao longo desse período.</p><p>Histórias que hoje formam um arquivo vivo da tatuagem brasileira.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "O MAIOR CANAL DE MÍDIA DE TATUAGEM DO BRASIL",
            subtitle: "PÁGINA 8",
            content: `<p>Com o tempo, tornou-se inevitável.</p><p>O Mestres da Tattoo passou a ser reconhecido como o maior canal de mídia de tatuagem do Brasil.</p><p>Não por volume. Mas por profundidade.</p><p>Enquanto muitos mostram o agora, o Mestres conecta o ontem, o hoje e o amanhã.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "ESSÊNCIA",
            subtitle: "PÁGINA 9",
            content: `<p>O Mestres da Tattoo é mais do que um nome.</p><p>É um posicionamento. É um respeito. É um arquivo.</p><p>É a certeza de que tatuagem não é tendência — é tradição.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        },
        {
            title: "O QUE VEM DEPOIS",
            subtitle: "PÁGINA 10",
            content: `<p>Enquanto houver alguém tatuando com propósito, haverá histórias para contar.</p><p>Enquanto houver memória, haverá Mestres.</p><p>O Mestres da Tattoo segue.</p><p>Não como uma página. Mas como um guardião da essência da tatuagem.</p><p>Porque quem conhece o passado, tatua o futuro com mais verdade.</p>`,
            image: "assets/history-placeholder.jpg",
            type: "history-full"
        }
    ],

    // Section 2: History & Culture (50 Pages = 25 Sheets)
    // Structure: Each Artist gets EXACTLY 2 pages (Front/Back of a sheet, or Spread)
    // Section 2: History & Culture (Legends)
    // Structure: 50 Artists * 3 Pages Each = 150 Pages
    legends: [
        // DIVIDER
        { type: 'model-full', image: 'assets/highlight-julio-portrait.jpg', name: 'OS NOMES QUE FIZERAM HISTÓRIA' },

        // 1. GEORGE BURCHETT (1872)
        { type: 'model-full', image: 'assets/legend-burchett.jpg', name: 'GEORGE BURCHETT' },
        { type: 'history-full', title: 'O Rei dos Tatuadores (1872-1953)', content: `<p class="drop-cap">George Burchett foi o primeiro "Celebrity Tattoo Artist" do mundo. Ele tatuou reis, marajás e lordes ingleses, mas nunca deixou de atender os marinheiros em Waterloo Road.</p><p>Burchett lutou para legitimar a tatuagem como profissão respeitável. Mantinha seu estúdio limpo como um consultório médico e vestia-se como um doutor.</p>` },
        { type: 'history-full', title: 'Legado Real', content: `<p>Suas memórias, "Memoirs of a Tattooist", são um documento vital da era vitoriana. Ele mostrou que a tatuagem cruzava classes sociais em um império onde o sol nunca se punha.</p>` },
        { type: 'artist-gallery', title: 'Galeria Burchett', images: ['assets/legend-burchett.jpg', 'assets/history-tribal.png'] },

        // 2. CAP COLEMAN (1884)
        { type: 'model-full', image: 'assets/legend-coleman.jpg', name: 'CAP COLEMAN' },
        { type: 'history-full', title: 'O Padrinho (1884-1973)', content: `<p class="drop-cap">Cap Coleman transformou a tatuagem de prática marginal em ofício reconhecível. Em Norfolk, criou a "Coleman School": linhas sólidas, sombreamento pesado e cores vibrantes.</p>` },
        { type: 'history-full', title: 'Flash Master', content: `<p>Seus flashes (águias, navios, panteras) definiram o vocabulário visual americano. "A tatuagem deve ser vista do outro lado da rua" era seu lema.</p>` },
        { type: 'artist-gallery', title: 'Galeria Coleman', images: ['assets/legend-coleman.jpg', 'assets/brazil-history.png'] },

        // 3. AMUND DIETZEL (1891)
        { type: 'model-full', image: 'assets/legend-dietzel.jpg', name: 'AMUND DIETZEL' },
        { type: 'history-full', title: 'Mestre Silencioso (1891-1974)', content: `<p class="drop-cap">De 1913 a 1967, Dietzel tatuou milhares em Milwaukee. Conhecido por sua ética impecável, ele definiu os padrões técnicos de durabilidade da tatuagem americana.</p>` },
        { type: 'history-full', title: 'Engenharia da Pele', content: `<p>Ele fabricava suas próprias máquinas e pigmentos. Sem espetáculo, mas com permanência, ele provou que a tatuagem é um serviço profissional digno.</p>` },
        { type: 'artist-gallery', title: 'Galeria Dietzel', images: ['assets/legend-dietzel.jpg', 'assets/brazil-history.png'] },

        // 4. JESSIE KNIGHT (1904)
        { type: 'model-full', image: 'assets/legend-jessie.jpg', name: 'JESSIE KNIGHT' },
        { type: 'history-full', title: 'Dama da Agulha (1904-1992)', content: `<p class="drop-cap">Jessie Knight, nascida no circo, não tinha medo de nada. Ela dominou a arte com a mesma precisão de uma atiradora. Primeira tatuadora profissional do Reino Unido.</p>` },
        { type: 'history-full', title: 'Freehand', content: `<p>Desenhava à mão livre direto na pele, sem estêncil. Seus desenhos eram fluidos e femininos. Em 1955, chocou ao ganhar o 2º lugar no campeonato de toda a Inglaterra.</p>` },
        { type: 'artist-gallery', title: 'Galeria Jessie', images: ['assets/legend-jessie.jpg', 'assets/history-tribal.png'] },

        // 5. BETTY BROADBENT (1909)
        { type: 'model-full', image: 'fotos artistas/Betty Broadbent.jpg', name: 'BETTY BROADBENT' },
        { type: 'history-full', title: 'Tattooed Venus (1909-1983)', content: `<p class="drop-cap">Betty cobriu seu corpo com mais de 565 tatuagens em 1927 e viajou com o circo. Ela não era apenas atração, mas uma voz ativa em defesa da arte.</p>` },
        { type: 'history-full', title: 'Pioneira', content: `<p>Foi também tatuadora e a primeira mulher no Hall of Fame. Ela tirou a tatuagem das sombras e a apresentou ao grande público como beleza e coragem.</p>` },
        { type: 'artist-gallery', title: 'Galeria Betty', images: ['fotos artistas/Betty Broadbent.jpg', 'assets/history-tribal.png'] },

        // 6. SAILOR JERRY (1911)
        { type: 'model-full', image: 'assets/legend-sailor.png', name: 'SAILOR JERRY' },
        { type: 'history-full', title: 'Norman Collins (1911-1973)', content: `<p class="drop-cap">"Não tenho um centímetro de pele virgem." Em Honolulu, Jerry tatuou soldados que iam para a guerra. Ele uniu a bravura americana com a técnica japonesa.</p>` },
        { type: 'history-full', title: 'Inovação', content: `<p>Criou o pigmento roxo, esterilização hospitalar e agulhas modernas. Seus desenhos (andorinhas, naus) são a bíblia do Old School moderno. Mestre de Ed Hardy.</p>` },
        { type: 'artist-gallery', title: 'Galeria Sailor', images: ['assets/legend-sailor.png', 'assets/highlight-mondial-cover-v3.jpg'] },

        // 7. WHANG-OD (1917)
        { type: 'model-full', image: 'assets/whang-od.png', name: 'WHANG-OD' },
        { type: 'history-full', title: 'A Última Mambabatok', content: `<p class="drop-cap">Nas montanhas de Kalinga, Whang-od, com mais de 100 anos, mantém viva a tradição batendo espinhos de pomelo na pele. "Tok, tok, tok" é o som da história.</p>` },
        { type: 'history-full', title: 'Resistência', content: `<p>Antes para guerreiros, hoje para peregrinos do mundo todo. Ela quebrou tabus ao ensinar sobrinhas, garantindo que a arte não morra com ela.</p>` },
        { type: 'artist-gallery', title: 'Galeria Whang-od', images: ['assets/whang-od.png', 'assets/history-tribal.png'] },

        // 8. HORST STRECKENBACH (1925)
        { type: 'model-full', image: 'assets/legend-streckenbach.jpg', name: 'TATTOO SAMY' },
        { type: 'history-full', title: 'O Engenheiro (1925-2001)', content: `<p class="drop-cap">Na Alemanha do pós-guerra, Horst "Samy" Streckenbach inovou. Desenvolveu máquinas rotativas, pigmentos e equipamentos que modernizaram a indústria.</p>` },
        { type: 'history-full', title: 'Memória', content: `<p>Foi um dos primeiros historiadores da tatuagem europeia. Sua contribuição técnica permitiu avanços em precisão e cicatrização que usamos até hoje.</p>` },
        { type: 'artist-gallery', title: 'Galeria Samy', images: ['assets/legend-streckenbach.jpg', 'assets/brazil-history.png'] },

        // 9. LYLE TUTTLE (1931)
        { type: 'model-full', image: 'assets/legend-lyle.png', name: 'LYLE TUTTLE' },
        { type: 'history-full', title: 'Embaixador da Tattoo (1931-2019)', content: `<p class="drop-cap">Lyle levou a tatuagem dos becos para Hollywood. Tatuou Janis Joplin, que posou para a Rolling Stone, quebrando estigmas femininos sobre a arte.</p>` },
        { type: 'history-full', title: 'Historiador', content: `<p>Viajou todos os continentes coletando histórias e ferramentas. Seu museu pessoal é a base do conhecimento moderno sobre a universalidade da tatuagem.</p>` },
        { type: 'artist-gallery', title: 'Galeria Lyle', images: ['assets/legend-lyle.png', 'assets/history-tribal.png'] },

        // 10. CLIFF RAVEN (1932)
        { type: 'model-full', image: 'assets/legend-raven.jpg', name: 'CLIFF RAVEN' },
        { type: 'history-full', title: 'Ponte Oriente-Ocidente (1932-2001)', content: `<p class="drop-cap">Raven foi pioneiro em incorporar a estética japonesa no Ocidente com respeito profundo. Com formação em Belas Artes, trouxe composição fluida para o corpo.</p>` },
        { type: 'history-full', title: 'Alma', content: `<p>Atuando na Califórnia, preparou o terreno para o estilo japonês nos EUA. Provou que a tradição pode viajar sem perder sua essência espiritual.</p>` },
        { type: 'artist-gallery', title: 'Galeria Raven', images: ['assets/legend-raven.jpg', 'assets/brazil-history.png'] },

        // 11. ED HARDY (1945)
        { type: 'model-full', image: 'assets/legend-edhardy-real.jpg', name: 'ED HARDY' },
        { type: 'history-full', title: 'Padrinho Moderno', content: `<p class="drop-cap">Mais que uma marca, Ed Hardy foi o visionário que uniu Sailor Jerry ao Japão. Primeiro ocidental a estudar com um mestre japonês tradicional.</p>` },
        { type: 'history-full', title: 'Tattoo City', content: `<p>Aposentou os desenhos de parede e introduziu o "Custom Tattoo" — arte exclusiva. Elevou a tatuagem ao status de Belas Artes, exibindo em museus.</p>` },
        { type: 'artist-gallery', title: 'Galeria Don Ed', images: ['assets/legend-edhardy-real.jpg', 'assets/highlight-mondial-cover-v3.jpg'] },

        // 12. HORIYOSHI III (1946)
        { type: 'model-full', image: 'assets/legend-irezumi.png', name: 'HORIYOSHI III' },
        { type: 'history-full', title: 'Alma do Japão', content: `<p class="drop-cap">Yoshihito Nakano é o guardião dos demônios e dragões japoneses. Embora use máquinas para traço, insiste no Tebori (manual) para cor e alma.</p>` },
        { type: 'history-full', title: 'Bodysuit', content: `<p>Seus trabalhos cobrem o corpo inteiro como um traje único. Tatuar com ele é entrar para a história viva da mitologia japonesa.</p>` },
        { type: 'artist-gallery', title: 'Galeria Horiyoshi', images: ['assets/legend-irezumi.png', 'assets/history-tribal.png'] },

        // 13. JACCI GRESHAM (1951)
        { type: 'model-full', image: 'assets/legend-gresham.jpg', name: 'JACCI GRESHAM' },
        { type: 'history-full', title: 'Resistência', content: `<p class="drop-cap">Primeira tatuadora negra dos EUA a abrir estúdio (1976, New Orleans). Enfrentou racismo e machismo para criar um espaço seguro e criativo.</p>` },
        { type: 'history-full', title: 'Portas Abertas', content: `<p>Sua trajetória não é apenas sobre arte, mas sobre ocupação de espaço. Ela abriu portas para mulheres negras na indústria que pareciam trancadas.</p>` },
        { type: 'artist-gallery', title: 'Galeria Jacci', images: ['assets/legend-gresham.jpg', 'assets/brazil-history.png'] },

        // 14. MARY JANE HAAKE (1951)
        { type: 'model-full', image: 'assets/legend-haake.jpg', name: 'MARY JANE HAAKE' },
        { type: 'history-full', title: 'Profissionalismo', content: `<p class="drop-cap">Pioneira na integração entre tatuagem artística, médica e cosmética. Desde os anos 80, lutou para elevar a ética e a higiene da profissão.</p>` },
        { type: 'history-full', title: 'Multidisciplinar', content: `<p>Haake mostrou que a tatuagem podia restaurar dignidade (reconstrução de mamilos, cicatrizes) além de decorar. Um olhar humano e técnico.</p>` },
        { type: 'artist-gallery', title: 'Galeria Haake', images: ['assets/legend-haake.jpg', 'assets/history-tribal.png'] },

        // 15. MARK MAHONEY (1957)
        { type: 'model-full', image: 'assets/legend-mahoney.jpg', name: 'MARK MAHONEY' },
        { type: 'history-full', title: 'Caligrafia de Hollywood', content: `<p class="drop-cap">Fundador do Shamrock Social Club. Uniu o estilo chicano das ruas de LA com o glamour de Hollywood. Mestre do "Single Needle Black & Grey".</p>` },
        { type: 'history-full', title: 'Elegância', content: `<p>Seus retratos e letras têm uma elegância atemporal. Tatuou de gângsteres a estrelas de cinema, tratando todos com o mesmo respeito sagrado.</p>` },
        { type: 'artist-gallery', title: 'Galeria Mahoney', images: ['assets/legend-mahoney.jpg', 'assets/highlight-mondial-cover-v3.jpg'] },

        // 16. KARI BARBA (1966)
        { type: 'model-full', image: 'assets/legend-barba.jpg', name: 'KARI BARBA' },
        { type: 'history-full', title: 'Força Tradicional', content: `<p class="drop-cap">Fundadora do Outer Limits. Defensora rigorosa do American Traditional, mas com um olhar contemporâneo. Manteve a chama clássica acesa nos anos 90.</p>` },
        { type: 'history-full', title: 'Mentora', content: `<p>Seu estúdio é um celeiro de talentos. Kari provou que é possível inovar sem desrespeitar as regras fundamentais que fazem uma tatuagem durar.</p>` },
        { type: 'artist-gallery', title: 'Galeria Barba', images: ['assets/legend-barba.jpg', 'assets/brazil-history.png'] },

        // 17. JUNKO SHIMADA (1967)
        { type: 'model-full', image: 'assets/legend-shimada.jpg', name: 'JUNKO SHIMADA' },
        { type: 'history-full', title: 'Delicadeza e Força', content: `<p class="drop-cap">Junko iniciou em um cenário masculino no Japão. Uniu a precisão técnica japonesa com uma sensibilidade gráfica moderna e delicada.</p>` },
        { type: 'history-full', title: 'Identidade', content: `<p>Conquistou respeito global mantendo sua identidade. Seu trabalho mostra que a força da tatuagem não precisa ser agressiva; pode ser sutil.</p>` },
        { type: 'artist-gallery', title: 'Galeria Junko', images: ['assets/legend-shimada.jpg', 'assets/history-tribal.png'] },

        // 18. FILIP LEU (1967)
        { type: 'model-full', image: 'assets/legend-leu.png', name: 'FILIP LEU' },
        { type: 'history-full', title: 'Dragão Psicodélico', content: `<p class="drop-cap">Da lendária Família Leu. Filip revolucionou o estilo japonês ocidental, criando dragões biomecânicos e composições que fluem com a anatomia.</p>` },
        { type: 'history-full', title: 'Flow', content: `<p>Ele ensinou ao mundo o "Flow" — o desenho não está no corpo, ele É o corpo. Influenciou todos os tatuadores de grande escala modernos.</p>` },
        { type: 'artist-gallery', title: 'Galeria Leu', images: ['assets/legend-leu.png', 'assets/highlight-mondial-cover-v3.jpg'] },

        // 19. LUKE ATKINSON (1978)
        { type: 'model-full', image: 'assets/legend-atkinson.jpg', name: 'LUKE ATKINSON' },
        { type: 'history-full', title: 'Nova Escola', content: `<p class="drop-cap">Representa a ponte para o século XXI. Concilia técnica avançada, pesquisa histórica e a linguagem contemporânea da tatuagem europeia.</p>` },
        { type: 'history-full', title: 'Evolução', content: `<p>Luke simboliza a tradição que não estagna. Ele carrega o bastão dos mestres antigos para uma nova era de higiene, arte e profissionalismo.</p>` },
        { type: 'artist-gallery', title: 'Galeria Atkinson', images: ['assets/legend-atkinson.jpg', 'assets/brazil-history.png'] },
    ],

    // Section 3: Selected Artists (3 Artists x 2 Pages = 6 Pages)
    selectedArtists: [
        {
            name: "Ralf Nonnweiler",
            pages: [
                { type: "artist-intro", title: "Ralf Nonnweiler", image: "assets/highlight-ralf-portrait.jpg", text: "Mestre do realismo preto e cinza." },
                { type: "artist-gallery", title: "Galeria Ralf", images: ["assets/ranking-ralf-gallery-1.jpg", "assets/ranking-ralf-gallery-2.png"] }
            ]
        },
        {
            name: "Steve Butcher",
            pages: [
                { type: "artist-intro", title: "Steve Butcher", image: "assets/ranking-stevebutcher.jpg", text: "O rei do realismo colorido e NBA." },
                { type: "artist-gallery", title: "Galeria Steve", images: ["assets/ranking-steve-gallery-1.png", "assets/ranking-steve-gallery-2.jpg"] }
            ]
        },
        {
            name: "Yomico Moreno",
            pages: [
                { type: "artist-intro", title: "Yomico Moreno", image: "assets/ranking-yomico.jpg", text: "Surrealismo e profundidade." },
                { type: "artist-gallery", title: "Galeria Yomico", images: ["assets/ranking-yomico-gallery-1.jpg", "assets/ranking-yomico-gallery-2.png"] }
            ]
        }
    ],

    // Section 4: Models (10 Pages)
    models: Array.from({ length: 10 }, (_, i) => ({
        name: `Modelo #${i + 1}`,
        image: "assets/model-placeholder.jpg",
        type: "model-full"
    })),

    // Section 5: Events (5 Pages)
    events2025: Array.from({ length: 5 }, (_, i) => ({
        event: `Evento #${i + 1}`,
        location: "Local",
        image: "assets/event-placeholder.jpg",
        type: "event-report"
    })),

    // Section 6: Calendar (2 Pages)
    calendar: [
        { title: "Calendário 2026", type: "calendar-list" },
        { title: "Calendário Int.", type: "calendar-list" }
    ],

    // Section 7: Partners (2 Pages)
    partners: [
        { title: "Stencilflow", image: "assets/product-stencil-flow.jpg", type: "ad-full" },
        { title: "Parceiros", type: "partners-grid" }
    ]
};
