import os

file_path = r'c:\Users\Positivo\.gemini\antigravity\scratch\mestres-da-tattoo\js\translations.js'

# Using raw triple quotes to avoid escaping issues and allow multi-line strings
new_de_articles = r"""        articles: {
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
    },"""

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Marker before "articles: {"
marker = 'ranking: { artistLink: "Künstler Link", viewProfile: "Profil Ansehen" },'
start_idx = content.find(marker)
if start_idx == -1:
    print("Could not find start marker")
    exit(1)

start_idx = start_idx + len(marker)

# Find "fr: {" which should be AFTER the articles block.
# We must scan forward from start_idx to find "fr: {"
end_idx = content.find('fr: {', start_idx)

if end_idx == -1:
    print("Could not find end marker (fr: {)")
    exit(1)

# Pre-content (up to marker)
pre_content = content[:start_idx]
# Post-content (from fr: { onwards)
post_content = content[end_idx:]

# Assemble
new_content = pre_content + '\n' + new_de_articles + '\n    ' + post_content

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Patched translations.js. Replaced {end_idx - start_idx} bytes.")
