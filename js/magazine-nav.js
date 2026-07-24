document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for renderer to finish (since it runs on DOMContentLoaded too)
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentSheetIndex = 0;
    // currentSheetIndex tracks how many sheets are currently "flipped" to the left.
    // 0 = Book Closed (Front Cover Visible)
    // 1 = Page 1 flipped (Page 2 & 3 Visible)

    const updateZIndexes = () => {
        const papers = document.querySelectorAll('.paper');
        const totalSheets = papers.length;

        papers.forEach((paper, index) => {
            if (paper.classList.contains('flipped')) {
                // Flipped (Left Side)
                // Stack order logic: First flipped sheet is at the bottom. Last flipped sheet is on top.
                // So index 0 (Cover) is flipped first (z=1). Index 1 flipped on top (z=2).
                paper.style.zIndex = index + 1;
            } else {
                // Not Flipped (Right Side)
                // Stack order logic: First unflipped sheet is on top. Last unflipped sheet is at bottom.
                // So index 0 (Cover) is top (z=Max). Index 1 is below (z=Max-1).
                // However, we must ensure right stack is always 'above' the left stack's contents visually if they overlapped?
                // Minimal risk in 3D book, but typically accurate stack is:
                paper.style.zIndex = totalSheets - index + 1;
            }
        });

        // Button Visibility
        if (currentSheetIndex === 0) {
            if (prevBtn) { prevBtn.style.opacity = '0'; prevBtn.style.pointerEvents = 'none'; }
        } else {
            if (prevBtn) { prevBtn.style.opacity = '1'; prevBtn.style.pointerEvents = 'all'; }
        }

        const flippedCount = document.querySelectorAll('.paper.flipped').length;
        if (flippedCount === totalSheets) {
            if (nextBtn) { nextBtn.style.opacity = '0'; nextBtn.style.pointerEvents = 'none'; }
        } else {
            if (nextBtn) { nextBtn.style.opacity = '1'; nextBtn.style.pointerEvents = 'all'; }
        }
    };

    const goNext = () => {
        const papers = document.querySelectorAll('.paper');
        if (currentSheetIndex < papers.length) {
            const currentPaper = papers[currentSheetIndex];

            // ANIMATION FIX: Ensure the moving paper stays visible/on top during the flip
            // By default, CSS transitions might cause clipping if z-index swaps mid-flight.
            // We force high Z during flight.
            currentPaper.style.zIndex = 9999;

            currentPaper.classList.add('flipped');
            currentSheetIndex++;

            // Wait for transition to end before settling z-index
            setTimeout(() => {
                updateZIndexes();
            }, 800); // slightly before 1.2s to snap
        }
    };

    const goPrev = () => {
        const papers = document.querySelectorAll('.paper');
        if (currentSheetIndex > 0) {
            currentSheetIndex--;
            const currentPaper = papers[currentSheetIndex];

            currentPaper.style.zIndex = 9999;
            currentPaper.classList.remove('flipped');

            setTimeout(() => {
                updateZIndexes();
            }, 800);
        }
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goNext(); }); // Fix: button logic was swapped? Next should goNext.
        // Wait, standard logic: Next button (Right arrow) -> Flip page (move from Right to Left) -> goNext
        // Prev button (Left arrow) -> Unflip (move from Left to Right) -> goPrev
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // CLICK ON BOOK TO FLIP
    const book = document.getElementById('book') || document.querySelector('.book');
    if (book) {
        book.addEventListener('click', (e) => {
            // Ignore if clicking interactive elements
            if (e.target.closest('button') || e.target.closest('a')) return;

            const rect = book.getBoundingClientRect();
            const clickX = e.clientX - rect.left; // relative to book
            const bookWidth = rect.width;

            // If click is on Right half -> Next
            if (clickX > bookWidth / 2) {
                goNext();
            } else {
                goPrev();
            }
        });
    }

    // Init with delay to ensure renderer is active
    setTimeout(() => {
        updateZIndexes();
    }, 500);
});
