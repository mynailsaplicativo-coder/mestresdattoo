document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.magazine-container');
    const dynamicStart = document.getElementById('dynamic-pages-start');

    if (!container || typeof magazineData === 'undefined') return;

    // 1. Capture Existing Static Pages
    // We select all current .page elements (Cover, Index, etc.)
    const staticPages = Array.from(document.querySelectorAll('.page:not(.generated)'));

    // Remove them from DOM temporarily so we can re-insert in book structure
    staticPages.forEach(p => p.remove());

    // 2. Generate Dynamic Pages (as in-memory elements)
    const dynamicPages = [];

    // Helper to create page element (same as before but returns simple div for now)
    const createPageContent = (className, contentHTML) => {
        const div = document.createElement('div');
        div.className = `page generated ${className}`;
        div.innerHTML = `
            <div class="page-content">
                ${contentHTML}
            </div>
            <div class="page-number"></div>
        `;
        return div;
    };

    // Renderers (Keep existing renderers)
    const renderers = {
        'intro': (data) => `
            <div class="center-content text-center">
                <h1 class="gold-title big-title">${data.title}</h1>
                <h3 class="white-title">${data.subtitle}</h3>
                <p class="manifesto-body">${data.content}</p>
            </div>
        `,
        'text-image': (data) => `
             <div class="article-grid">
                <div class="article-col">
                    <img src="${data.image}" alt="${data.title}" onerror="this.src='assets/logo-icon.png'">
                </div>
                <div class="article-col center-vertical">
                    <h2 class="gold-title">${data.title}</h2>
                    <h3 class="subtitle">${data.subtitle}</h3>
                    <p>${data.content}</p>
                </div>
            </div>
        `,
        'legend': (data) => `
            <div class="a4-page-layout" style="height: 100%; padding: 2rem; box-sizing: border-box; overflow: hidden;">
                 
                 <!-- Header Section: Image Left, Title Right (Classic Editorial) -->
                 <div class="editorial-header" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; height: 25%;">
                     <div class="header-image" style="width: 35%; flex-shrink: 0;">
                        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; border: 1px solid #333;" onerror="this.src='assets/logo-icon.png'">
                     </div>
                     <div class="header-info" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-end;">
                         <h2 class="gold-title" style="font-size: 2.5rem; line-height: 1; margin: 0; color: var(--mag-gold); text-transform: uppercase;">${data.title}</h2>
                         <div style="width: 50px; height: 3px; background: var(--mag-gold); margin: 0.5rem 0;"></div>
                         <h3 class="subtitle" style="color: #444; font-family: var(--mag-font-serif); font-style: italic; font-size: 1.1rem; margin: 0;">${data.subtitle}</h3>
                     </div>
                 </div>

                 <!-- Body Section: Full height text columns -->
                 <div class="editorial-body" style="height: 70%; column-count: 2; column-gap: 2rem; column-rule: 1px solid #ddd; font-family: var(--mag-font-serif); font-size: 0.85rem; line-height: 1.5; text-align: justify;">
                    ${data.content}
                 </div>
            </div>
        `,
        'model-full': (data) => `
            <div class="full-image-page" style="background-image: url('${data.image}'); width: 100%; height: 100%; background-position: center; background-size: cover; position: absolute; top: 0; left: 0;">
                <div class="cover-overlays" style="justify-content: flex-end; padding-bottom: 2rem;">
                    <h2 class="gold-title" style="font-size: 2.5rem; text-shadow: 2px 2px 4px black; margin-right: 2rem; text-align: right;">${data.name}</h2>
                </div>
            </div>
        `,
        'artist-intro': (data) => `
            <div class="article-grid">
                 <div class="article-col">
                    <img src="${data.image}" style="height: 100%; width: 100%; object-fit: cover;">
                </div>
                <div class="article-col center-vertical">
                    <span class="category">Artista em Destaque</span>
                    <h1 class="gold-title">${data.title}</h1>
                    <p class="drop-cap">${data.text}</p>
                </div>
            </div>
        `,
        'artist-gallery': (data) => `
            <h2 class="page-title">${data.title}</h2>
            <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 75%;">
                ${data.images.map(img => `<div style="background-image: url('${img}'); background-size: cover; background-position: center;"></div>`).join('')}
            </div>
        `,
        'artist-interview': (data) => `
            <div class="center-content">
                <h2 class="page-title">${data.title}</h2>
                <div class="interview-text" style="font-size: 1rem; line-height: 1.6; text-align: justify; columns: 2; column-gap: 2rem;">
                    ${data.text}
                </div>
            </div>
        `,
        'event-report': (data) => `
             <div class="article-grid">
                <div class="article-col">
                     <h2 class="gold-title">${data.event}</h2>
                     <p class="subtitle">📍 ${data.location}</p>
                     <p>Relatório completo do evento, destaques e premiações.</p>
                </div>
                <div class="article-col">
                     <img src="${data.image}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/logo-icon.png'">
                </div>
             </div>
        `,
        'history-full': (data) => `
             <div class="page-content" style="padding: 2rem; display: flex; flex-direction: column; height: 100%;">
                 <!-- Header -->
                 <div class="history-header">
                     <h2>${data.title}</h2>
                 </div>

                 <!-- Body -->
                 <div class="history-body">
                    ${data.content}
                 </div>
            </div>
        `,
    };

    // --- Generation Logic same as before, pushing to dynamicPages array ---

    // 0. Interstitial: Marcados pelo Tempo (After Sumário)
    // This will become Page 3 (Front of Sheet 2)
    dynamicPages.push(createPageContent('full-image-page', `
        <div style="background-image: url('assets/marcados-pelo-tempo.jpg?v=${new Date().getTime()}'); width: 100%; height: 100%; background-position: center; background-size: cover; position: relative;">
            <div style="background-color: rgba(0, 0, 0, 0.4); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <div style="border: 4px solid var(--mag-gold); padding: 1.5rem; display: inline-block;">
                    <h1 class="gold-title big-title" style="margin: 0; font-size: 3.2rem; text-shadow: 2px 2px 4px #000; text-transform: uppercase; text-align: center; color: white; line-height: 1;">MARCADOS<br>PELO TEMPO</h1>
                </div>
            </div>
        </div>
    `));

    // 1. Mestres History
    magazineData.mestresHistory.forEach(page => {
        dynamicPages.push(createPageContent('dark-bg', renderers[page.type] ? renderers[page.type](page) : ''));
    });

    // 2. History & Culture (Legends)
    if (magazineData.legends && magazineData.legends.length > 0) {
        magazineData.legends.forEach(page => {
            const renderer = renderers[page.type];
            if (renderer) {
                // Use 'dark-bg' for consistency with history, or 'article-page'
                dynamicPages.push(createPageContent('dark-bg', renderer(page)));
            }
        });
    }

    // 3. Selected Artists
    magazineData.selectedArtists.forEach(artist => {
        artist.pages.forEach(page => {
            const renderer = renderers[page.type];
            if (renderer) dynamicPages.push(createPageContent('article-page', renderer(page)));
        });
    });

    // 4. Models
    dynamicPages.push(createPageContent('dark-bg', `
        <div class="center-content text-center">
            <h1 class="gold-title big-title">MESTRES<br>MODELS</h1>
            <p>A Beleza da Arte Viva</p>
        </div>
    `));
    magazineData.models.forEach(page => {
        // Manually create page to handle specific content style
        const div = document.createElement('div');
        div.className = 'page generated';
        div.innerHTML = renderers['model-full'](page) + `<div class="page-number"></div>`;
        dynamicPages.push(div);
    });

    // 5. Events 2025
    dynamicPages.push(createPageContent('dark-bg', `
        <div class="center-content text-center">
            <h1 class="gold-title big-title">EVENTS<br>2025</h1>
            <p>Retrospectiva</p>
        </div>
    `));
    magazineData.events2025.forEach(page => {
        dynamicPages.push(createPageContent('text-page', renderers['event-report'](page)));
    });


    // 3. Combine Lists
    const allPages = [...staticPages, ...dynamicPages];

    // 4. Update Page Numbers (Global)
    allPages.forEach((page, index) => {
        const numDisplay = page.querySelector('.page-number');
        if (numDisplay) {
            numDisplay.innerText = (index + 1).toString().padStart(2, '0');
        }
    });

    // 5. Build 3D Book Structure
    // Create the Book Wrapper
    const book = document.createElement('div');
    book.className = 'book';
    book.id = 'book';

    // Loop 2 by 2
    const totalSheets = Math.ceil(allPages.length / 2);

    for (let i = 0; i < allPages.length; i += 2) {
        const sheetIndex = i / 2;

        const paper = document.createElement('div');
        paper.className = 'paper';
        paper.style.zIndex = totalSheets - sheetIndex; // Stack order: First page on top

        // Front Page
        const front = document.createElement('div');
        front.className = 'front';
        const pageFront = allPages[i];
        if (pageFront) {
            // We need to move the page content inside. 
            // Note: The 'page' class might have styles we want or overrides.
            // In CSS we overrode .page to fit 100%. 
            front.appendChild(pageFront);
        }

        // Back Page
        const back = document.createElement('div');
        back.className = 'back';
        const pageBack = allPages[i + 1];
        if (pageBack) {
            back.appendChild(pageBack);
        } else {
            // Empty back page if odd number
            back.innerHTML = '<div class="page blank-page"></div>';
        }

        paper.appendChild(front);
        paper.appendChild(back);
        book.appendChild(paper);
    }

    // Clear Container and Add Book
    container.innerHTML = '';
    container.appendChild(dynamicStart); // Keep the marker hidden

    // Add Nav Buttons back to container (or they could be outside)
    // The renderer destroys innerHTML, so we need to re-add buttons if they were inside.
    // In magazine.html they are <body> level children, outside container. Good.

    container.appendChild(book);

    console.log(`Magazine generated with ${allPages.length} pages (${totalSheets} sheets).`);
});
