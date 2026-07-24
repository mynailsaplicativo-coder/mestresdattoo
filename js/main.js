document.addEventListener('DOMContentLoaded', () => {
    // Global State
    window.currentLang = 'pt';

    // Navigation Toggle (Side Drawer)
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    if (menuToggle && sideMenu && menuBackdrop && closeMenuBtn) {
        const menuLinks = sideMenu.querySelectorAll('a');

        function toggleMenu() {
            sideMenu.classList.toggle('active');
            menuBackdrop.classList.toggle('active');
            menuToggle.classList.toggle('open');
        }

        function closeMenu() {
            sideMenu.classList.remove('active');
            menuBackdrop.classList.remove('active');
            menuToggle.classList.remove('open');
        }

        menuToggle.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        menuBackdrop.addEventListener('click', closeMenu);

        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Language Selector (Dropdown Logic)
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');
    const currentFlag = document.getElementById('currentFlag');
    const langOptions = langMenu.querySelectorAll('li');

    // Toggle Dropdown
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('open');
        }
    });

    // Language Selection
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Update Active Class
            langOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update Main Flag
            const selectedFlag = option.querySelector('.flag').innerText;
            currentFlag.innerText = selectedFlag;

            // Set Language
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);

            // Close Dropdown
            langDropdown.classList.remove('open');
        });
    });

    // Initialize with default language
    setLanguage('pt');

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.feature-card, .legend-card, .artist-card, .ranking-item');
    const observerOptions = { threshold: 0.1, rootMargin: "0px" };
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('hidden-reveal');
        revealOnScroll.observe(el);
    });

    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    }
});

function setLanguage(lang) {
    if (!window.siteTranslations[lang]) return;
    window.currentLang = lang;

    // 1. Update Static Text ([data-i18n])
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = getNestedTranslation(lang, key);
        if (text) {
            // fade effect could be added here
            el.innerHTML = text; // InnerHTML to support <br>
        }
    });

    // 2. Re-render Ranking (needs translated buttons)
    renderRanking();

    // 3. Re-initialize Article System (to update click listeners with new lang data if needed, 
    // actually just the modal content needs to pull from current lang when clicked)
    // We don't need to re-init listeners, just ensure the click handler reads window.currentLang
    // But we usually call init once. The init acts on "read-more" buttons.
    // If we re-render rankings, we might need to re-attach listeners if they were dynamic? 
    // Ranking has "Ver Perfil" buttons which are links.
    // The "read-more" buttons are in the HTML static parts.

    // 4. Update Event Months
    const monthElements = document.querySelectorAll('[data-month]');
    monthElements.forEach(el => {
        const monthKey = el.getAttribute('data-month');
        if (window.siteTranslations[lang].months && window.siteTranslations[lang].months[monthKey]) {
            el.innerText = window.siteTranslations[lang].months[monthKey];
        }
    });
}

function getNestedTranslation(lang, dotKey) {
    const keys = dotKey.split('.');
    let obj = window.siteTranslations[lang];
    for (const k of keys) {
        if (!obj) return null;
        obj = obj[k];
    }
    return obj;
}

/* --- Ranking System --- */
let rankingLimit = 5; // Start with top 5

const rankingArtists = [
    { name: "Ralf Nonnweiler", image: "assets/highlight-ralf-portrait.jpg", location: "Alemanha", instagram: "https://www.instagram.com/ralfnonnweilerta2/", bio: "Artista alemão reconhecido pelo trabalho técnico e artístico consistente.", gallery: ["assets/ranking-ralf-gallery-1.jpg", "assets/ranking-ralf-gallery-2.png", "assets/ranking-ralf-gallery-3.jpg"] },
    { name: "Steve Butcher", image: "assets/ranking-stevebutcher.jpg", location: "Atua internacionalmente", instagram: "https://www.instagram.com/stevebutchertattoos/", bio: "Um dos maiores nomes do realismo contemporâneo.", gallery: ["assets/ranking-steve-gallery-1.png", "assets/ranking-steve-gallery-2.jpg", "assets/ranking-steve-gallery-3.jpg"] },
    { name: "Yomico Moreno", image: "assets/ranking-yomico.jpg", location: "Atua internacionalmente", instagram: "https://www.instagram.com/yomicoart/", bio: "Artista venezuelano de projeção global, referência em tatuagem artística.", gallery: ["assets/ranking-yomico-gallery-1.jpg", "assets/ranking-yomico-gallery-2.png", "assets/ranking-yomico-gallery-3.jpg"] },
    { name: "Julian Siebert", image: "assets/ranking-juliansiebert.jpg", location: "Alemanha", instagram: "https://www.instagram.com/julian.siebert/", bio: "Artista alemão que transita entre tatuagem e arte contemporânea.", gallery: ["assets/ranking-julian-gallery-1.jpg", "assets/ranking-julian-gallery-2.png", "assets/ranking-julian-gallery-3.jpg"] },
    { name: "Vitoria Lee", image: "assets/ranking-vitorialee.jpg", location: "Internacional", instagram: "https://www.instagram.com/victorialeetattoo/", bio: "Artista internacional, reconhecida pelo realismo e técnica refinada.", gallery: ["assets/ranking-vitoria-gallery-1.jpg", "assets/ranking-vitoria-gallery-2.png", "assets/ranking-vitoria-gallery-3.jpg"] },
    { name: "Carolina Caosvalle", image: "assets/ranking-carolinacaosvalle.jpg", location: "Internacional", instagram: "https://www.instagram.com/carolinacaosavalle/", bio: "Artista internacional, com linguagem autoral que mistura tatuagem e arte.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Luiza Bello", image: "assets/ranking-luizabello.jpg", location: "Brasil", instagram: "https://www.instagram.com/luizabelloart/", bio: "Tatuadora brasileira conhecida pelo traço delicado e abordagem contemporânea.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Chenai Tattoo", image: "assets/artist-realism.png", location: "Internacional", instagram: "https://www.instagram.com/chenai_tattoo_alatancang/", bio: "Artista internacional, com estilo gráfico forte e identidade visual definida.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Kasas Ink", image: "assets/ranking-kasasink.jpg", location: "Internacional", instagram: "https://www.instagram.com/kasasink/", bio: "Artista internacional, reconhecida pela composição sólida e estética autoral.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Zakarov", image: "assets/ranking-zakarov.jpg", location: "Internacional", instagram: "https://www.instagram.com/zakharovtattoo/", bio: "Artista internacional, conhecido pela estética intensa e linguagem visual.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Neto Coutinho", image: "assets/highlight-neto-full.jpg", location: "Brasil", instagram: "https://www.instagram.com/netocoutinhotattoo/", bio: "Tatuador brasileiro com trajetória sólida e respeito dentro da cena nacional.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Chico Morbene", image: "assets/ranking-chichomorbene.jpg", location: "Brasil", instagram: "https://www.instagram.com/chicomorbene/", bio: "Nome tradicional da tatuagem brasileira, reconhecido como referência.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Cris Niero", image: "assets/highlight-cris.jpg", location: "Brasil", instagram: "https://www.instagram.com/cris.nieiro/", bio: "Artista brasileiro com trabalho consistente e presença em convenções.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Tampa", image: "assets/ranking-tampa.jpg", location: "Brasil", instagram: "https://www.instagram.com/tampatattoo/", bio: "Tatuador brasileiro ligado à cena tradicional e underground.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Ganso Galvão", image: "assets/ranking-ganso.jpg", location: "Brasil", instagram: "https://www.instagram.com/gansogalvao/", bio: "Referência do blackwork no Brasil, conhecido pela força do traço.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Paulinho De Deus", image: "assets/ranking-paulinhodedeus.jpg", location: "Brasil", instagram: "https://www.instagram.com/paulinhodedeuss/", bio: "Nome histórico da tatuagem brasileira, com forte contribuição técnica.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Mauricio Teodoro", image: "assets/legend-mauricio.jpg", location: "Brasil", instagram: "https://www.instagram.com/teodoromauricio/", bio: "Artista brasileiro respeitado, com carreira consolidada e participação ativa.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Fabricio Galdino", image: "assets/ranking-fabriciogaldino.jpg", location: "Brasil", instagram: "https://www.instagram.com/fabriciogaldino89/", bio: "Tatuador brasileiro com estilo sólido e presença constante.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Klebyz Tattoo", image: "assets/ranking-klebyz.jpg", location: "Brasil", instagram: "https://www.instagram.com/klebyztattoo/", bio: "Artista brasileiro conhecido pela versatilidade e atuação contínua.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Hernan Yepes", image: "assets/ranking-hernanyepes.jpg", location: "América Latina", instagram: "https://www.instagram.com/hernanyepes_art/", bio: "Artista latino-americano com reconhecimento internacional.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Ibrahin Barboza", image: "assets/ranking-ibrahimbarboza.jpg", location: "Brasil", instagram: "https://www.instagram.com/ibrahimbarbozatattoo/", bio: "Tatuador brasileiro com trabalho consistente e respeito dentro da cena.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Joybacks Morales", image: "assets/ranking-joybacksmorales.jpg", location: "Internacional", instagram: "https://www.instagram.com/joybacks_morales/", bio: "Artista latino-americano com estilo próprio e presença em eventos.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Javi – Tattooed Theory", image: "assets/ranking-javi.jpg", location: "Internacional", instagram: "https://www.instagram.com/javi_tattooedtheory/", bio: "Artista e pensador da tatuagem, conhecido por unir teoria e prática.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Ítalo Santos", image: "assets/ranking-italosantos.jpg", location: "Brasil", instagram: "https://www.instagram.com/itallosantostattoo/", bio: "Tatuador brasileiro com atuação contínua no cenário nacional.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Machado Artes", image: "assets/ranking-machadoartes.jpg", location: "Brasil", instagram: "https://www.instagram.com/machado.artes/", bio: "Artista brasileiro com forte ligação ao desenho e à tatuagem tradicional.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Diego Nunes", image: "assets/ranking-diegonunes.jpg", location: "Brasil", instagram: "https://www.instagram.com/diegontattoo/", bio: "Nome ativo da tatuagem brasileira, com trabalhos divulgados em mídias.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Ubiratam", image: "assets/ranking-ubiratam.jpg", location: "Brasil", instagram: "https://www.instagram.com/ubiratanamorim/", bio: "Tatuador brasileiro ligado à tradição e aos fundamentos clássicos.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Dung Tran", image: "assets/ranking-dungtran.jpg", location: "Vietnã", instagram: "https://www.instagram.com/dungtran.129/", bio: "Artista vietnamita reconhecido mundialmente pelo realismo.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Coimbra", image: "assets/ranking-coimbra.jpg", location: "Brasil", instagram: "https://www.instagram.com/coimbratattoo_/", bio: "Tatuador brasileiro com identidade visual forte e atuação consistente.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] },
    { name: "Sylvio Freitas", image: "assets/ranking-sylviofreitas.jpg", location: "Brasil", instagram: "https://www.instagram.com/sylviofreitastattoo/", bio: "Nome tradicional da tatuagem brasileira, reconhecido pela trajetória e legado.", gallery: ["assets/artist-realism.png", "assets/artist-realism.png", "assets/artist-realism.png"] }
];

function renderRanking() {
    const rankingContainer = document.querySelector('.ranking-list');
    if (!rankingContainer) return;

    // Load More Button
    const loadMoreBtn = document.getElementById('load-more-ranking');
    if (loadMoreBtn) {
        if (rankingLimit >= rankingArtists.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.onclick = () => {
                rankingLimit = rankingArtists.length; // Show all
                renderRanking();
            };
        }
    }

    const displayData = rankingArtists.slice(0, rankingLimit);

    let html = '';
    displayData.forEach((artist, index) => {
        const isTop3 = index < 3 ? 'top-rank' : '';

        // Safe rendering of image
        const imgStyle = `background-image: url('${artist.image}');`;

        html += `
            <div class="ranking-item ${isTop3}" data-index="${index}">
                <!-- Number Removed <div class="rank-number"></div> -->
                <div class="rank-avatar" style="${imgStyle}"></div>
                <div class="rank-info">
                    <h3>${artist.name}</h3>
                    <span class="location">📍 ${artist.location}</span>
                </div>
                <button class="view-profile-btn" onclick="openProfileModal(${index})">Ver Perfil</button>
            </div>
        `;
    });

    rankingContainer.innerHTML = html;
}

function openProfileModal(index) {
    const artist = rankingArtists[index];
    if (!artist) return;

    const modal = document.getElementById('profile-modal');
    // Create modal if it doesn't exist
    if (!modal) {
        createProfileModal();
        // Wait small delay for DOM update then open
        setTimeout(() => openProfileModal(index), 50);
        return;
    }

    // Populate Data
    document.getElementById('profile-img').style.backgroundImage = `url('${artist.image}')`;
    document.getElementById('profile-name').innerText = artist.name;
    document.getElementById('profile-location').innerText = `📍 ${artist.location}`;
    document.getElementById('profile-bio').innerText = artist.bio;
    document.getElementById('profile-link').href = artist.instagram;

    // Open
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.add('active'); }, 10);
    document.body.style.overflow = 'hidden';
}

function createProfileModal() {
    const div = document.createElement('div');
    div.id = 'profile-modal';
    div.className = 'article-modal hidden'; // Reuse modal styles
    div.innerHTML = `
        <button id="close-profile" class="close-modal-btn">&times;</button>
        <div class="article-content-wrapper" style="max-width: 600px; margin: 5vh auto;">
             <div class="profile-header" style="text-align: center; padding: 2rem;">
                <div id="profile-img" style="width: 120px; height: 120px; border-radius: 50%; background-size: cover; background-position: center; margin: 0 auto 1rem; border: 2px solid var(--color-gold);"></div>
                <h2 id="profile-name" class="gold-title" style="margin-bottom: 0.5rem;"></h2>
                <p id="profile-location" style="color: #888; margin-bottom: 1rem;"></p>
                <p id="profile-bio" style="font-size: 1.1em; line-height: 1.6; margin-bottom: 2rem; color: #ccc;"></p>
                
                <a id="profile-link" href="#" target="_blank" class="gold-button">Seguir no Instagram 🔗</a>
             </div>
        </div>
    `;
    document.body.appendChild(div);

    // Close logic
    const closeBtn = div.querySelector('#close-profile');
    closeBtn.onclick = () => {
        div.classList.remove('active');
        setTimeout(() => div.classList.add('hidden'), 400);
        document.body.style.overflow = '';
    };
}

/* --- Article System Logic --- */
// We call this once to attach listeners. content loading happens on click.
function initArticleSystem() {
    const modal = document.getElementById('article-modal');
    const closeBtn = document.getElementById('close-article');
    const contentContainer = document.getElementById('article-dynamic-content');

    const dom = {
        title: document.getElementById('article-title'),
        category: document.getElementById('article-category'),
        author: document.getElementById('article-author'),
        date: document.getElementById('article-date'),
        header: document.getElementById('article-header-bg')
    };

    // Use Event Delegation for "Read Article" buttons
    // This ensures it works for elements loaded dynamically or via "Load More"
    document.addEventListener('click', (e) => {
        // Check if clicked element or its parent is a .read-more link
        const link = e.target.closest('.read-more');
        if (!link) return;

        e.preventDefault();
        const id = link.getAttribute('data-id');

        // Fetch article data based on CURRENT language
        if (window.siteTranslations && window.siteTranslations[window.currentLang]) {
            const articles = window.siteTranslations[window.currentLang].articles;
            // alert('Debug: Articles available? ' + (!!articles));

            if (id && articles[id]) {
                openArticle(articles[id]);
            } else {
                console.warn('Artigo não encontrado para ID:', id);
                // alert('Debug: Article not found for ID: ' + id);
            }
        } else {
            // alert('Debug: Translations not loaded or currentLang invalid');
        }
    });

    function openArticle(data) {
        dom.title.innerText = data.title;
        dom.category.innerText = data.category;
        dom.author.innerText = data.author;
        dom.date.innerText = data.date;
        dom.header.style.backgroundImage = `url('${data.headerImage}')`;
        contentContainer.innerHTML = data.content;

        modal.classList.remove('hidden');
        setTimeout(() => { modal.classList.add('active'); }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeArticle() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            contentContainer.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeArticle);

    if (modal) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeArticle();
        });
    }
}
// Initialize listeners immediately
// initArticleSystem();

// --- LOAD MORE FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', () => {
    initArticleSystem();
    function setupLoadMore(containerSelector, itemSelector, limit, btnText) {
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            const items = container.querySelectorAll(itemSelector);

            if (items.length <= limit) return;

            // Hide items beyond limit
            items.forEach((item, index) => {
                if (index >= limit) {
                    item.classList.add('hidden-item');
                } else {
                    // Force visibility for initial items (fix for observer lag/conflict)
                    item.classList.remove('hidden-reveal');
                    item.classList.add('visible');
                }
            });

            // Create Button
            const btnContainer = document.createElement('div');
            btnContainer.className = 'load-more-container';

            const btn = document.createElement('button');
            btn.className = 'load-more-btn';
            btn.innerText = btnText;

            btn.onclick = () => {
                items.forEach(item => item.classList.remove('hidden-item'));
                btnContainer.style.display = 'none'; // Hide button after expanding
            };

            btnContainer.appendChild(btn);
            // Insert after container
            if (container.nextSibling) {
                container.parentNode.insertBefore(btnContainer, container.nextSibling);
            } else {
                container.parentNode.appendChild(btnContainer);
            }
        });
    }

    // Apply Limits
    // History: Limit 4
    setupLoadMore('#history .grid-editorial', '.feature-card', 4, 'Ver Mais Artigos');

    // Golden Era: Limit 3
    setupLoadMore('#classic-era .golden-grid', '.legend-card', 3, 'Ver Mais Lendas');

    // Highlights: Limit 3
    setupLoadMore('#highlights .golden-grid', '.legend-card', 3, 'Ver Mais');
});