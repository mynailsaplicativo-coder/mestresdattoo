

// --- LOAD MORE FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', () => {
    function setupLoadMore(containerSelector, itemSelector, limit, btnText) {
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            const items = container.querySelectorAll(itemSelector);

            if (items.length <= limit) return;

            // Hide items beyond limit
            items.forEach((item, index) => {
                if (index >= limit) {
                    item.classList.add('hidden-item');
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
            container.parentNode.insertBefore(btnContainer, container.nextSibling);
        });
    }

    // Apply Limits
    // History: Limit 8 (2 rows)
    setupLoadMore('#history .grid-editorial', '.feature-card', 8, 'Ver Mais Artigos');

    // Golden Era & Highlights: Limit 3
    // This targets all .golden-grid instances (Pioneers, Intl, BR, Highlights)
    setupLoadMore('.golden-grid', '.legend-card', 3, 'Ver Mais');
});
