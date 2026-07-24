let currentQuestion = 0;
let scores = {};
let selectedRegion = '';

// Database of Brazilian Artists (Representative List)
const artistDatabase = [
    // REALISMO
    { name: "Chico Morbene", style: "Realismo", region: "SUL", instagram: "@chicomorbene" },
    { name: "Samir Bughdadi", style: "Realismo", region: "SP", instagram: "@samirbughdadi" },
    { name: "Fernando Souza", style: "Realismo", region: "SP", instagram: "@fernandosouza_tattoo" },
    { name: "Douglas Prudente", style: "Realismo", region: "SUL", instagram: "@douglasprudentetattoo" },
    { name: "Gans Galvão", style: "Realismo", region: "RJ", instagram: "@gansgalvao" },
    { name: "Neto Coutinho", style: "Realismo", region: "BA", instagram: "@netocoutinho" }, // Nordeste representative/fictional based on context

    // OLD SCHOOL
    { name: "Tuzinho", style: "Old School", region: "SP", instagram: "@tuzinho" },
    { name: "Polaco Tattoo", style: "Old School", region: "SP", instagram: "@polacotattoo" },
    { name: "Dani S", style: "Old School", region: "RJ", instagram: "@danis_tattoo" },
    { name: "Breno R", style: "Old School", region: "MG", instagram: "@brenor" },

    // FINE LINE
    { name: "Bruna K", style: "Fine Line", region: "SP", instagram: "@brunak_tattoo" },
    { name: "Luiza Oliveira", style: "Fine Line", region: "RJ", instagram: "@luiza_art" },
    { name: "Felipe Rodrigues", style: "Fine Line", region: "MG", instagram: "@feliperodrigues" },
    { name: "Julia M", style: "Fine Line", region: "SUL", instagram: "@juliam_ink" },

    // TRIBAL / BLACKWORK
    { name: "Fredão Oliveira", style: "Tribal", region: "MG", instagram: "@fredao_oliveira" }, // Blackwork master
    { name: "Beto S", style: "Tribal", region: "SP", instagram: "@betos_tribal" },
    { name: "Wagner Basei", style: "Tribal", region: "SUL", instagram: "@wagnerbasei" },
    { name: "Nazareno", style: "Tribal", region: "NORDESTE", instagram: "@nazareno_arts" }
];

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-quiz');
    const modal = document.getElementById('quiz-modal');
    const closeBtn = document.getElementById('close-quiz');
    const questionContainer = document.getElementById('quiz-question');
    const resultContainer = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-style');
    const resultDesc = document.getElementById('result-desc');
    const recommendationList = document.getElementById('recommendation-list');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            currentQuestion = 0;
            scores = {};
            selectedRegion = '';
            showQuestion();
            questionContainer.classList.remove('hidden');
            resultContainer.classList.add('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    function showQuestion() {
        const langData = window.siteTranslations[window.currentLang || 'pt'].quiz;
        const questions = langData.questions;

        if (currentQuestion >= questions.length) {
            showResult(langData);
            return;
        }

        const data = questions[currentQuestion];

        // Image support logic could be added here if we had the assets, 
        // for now we render text buttons but with a class for potential styling

        let choicesHtml = '';

        if (data.type === 'location') {
            choicesHtml = data.choices.map((choice) => `
                <button class="choice-btn location-btn" onclick="selectLocation('${choice.value}')">${choice.text}</button>
            `).join('');
        } else {
            choicesHtml = data.choices.map((choice) => `
                <button class="choice-btn" onclick="selectChoice('${choice.style}')">
                    ${choice.image ? `<img src="${choice.image}" alt="${choice.text}" class="choice-img" onerror="this.style.display='none'">` : ''}
                    <span>${choice.text}</span>
                </button>
            `).join('');
        }

        questionContainer.innerHTML = `
            <h3 style="margin-bottom: 2rem; color: #fff; text-align: center;">${data.question}</h3>
            <div class="${data.type === 'location' ? 'location-grid' : 'question-choices'}">
                ${choicesHtml}
            </div>
            <div class="progress-indicator" style="text-align: center; margin-top: 1rem; color: #666;">
                Pergunta ${currentQuestion + 1} de ${questions.length}
            </div>
        `;
    }

    window.selectChoice = (style) => {
        scores[style] = (scores[style] || 0) + 1;
        currentQuestion++;
        showQuestion();
    };

    window.selectLocation = (region) => {
        selectedRegion = region;
        currentQuestion++;
        showQuestion();
    };

    function showResult(langData) {
        questionContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        // Find highest score
        let bestStyle = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

        // Map simplified style names for display if needed, but current names are good

        resultText.textContent = bestStyle;
        resultDesc.textContent = langData.resultDesc;

        // Recommendation Logic
        const recommendations = artistDatabase.filter(artist => {
            // Match style (fuzzy match for flexibility)
            const styleMatch = artist.style.includes(bestStyle) || bestStyle.includes(artist.style);
            // Match region (exact match)
            const regionMatch = artist.region === selectedRegion;

            return styleMatch && regionMatch;
        });

        // Fallback if no local matches: Show top artists of that style from ANY region
        let displayList = recommendations;
        let isFallback = false;

        if (recommendations.length === 0) {
            displayList = artistDatabase.filter(artist =>
                artist.style.includes(bestStyle) || bestStyle.includes(artist.style)
            ).slice(0, 3); // Top 3 nationwide
            isFallback = true;
        }

        // Render Recommendations
        let recHtml = `<h4 style="margin-top: 2rem; color: var(--color-gold);">${langData.recommendationTitle}</h4>`;

        if (isFallback && selectedRegion !== 'OUTRO') {
            recHtml += `<p style="font-size: 0.9rem; color: #aaa; margin-bottom: 1rem;">(Não encontramos mestres exatos na sua região, mas confira estes destaques nacionais)</p>`;
        }

        if (displayList.length > 0) {
            recHtml += `<ul class="artist-rec-list" style="list-style: none; padding: 0; margin-top: 1rem;">`;
            displayList.forEach(artist => {
                recHtml += `
                    <li style="background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 8px; border-radius: 4px; border-left: 3px solid var(--color-gold);">
                        <strong style="color: #fff;">${artist.name}</strong> 
                        <span style="color: #888; font-size: 0.9em;">(${artist.region})</span>
                        <br>
                        <a href="https://instagram.com/${artist.instagram.replace('@', '')}" target="_blank" style="color: var(--color-gold); text-decoration: none; font-size: 0.8em;">${artist.instagram}</a>
                    </li>
                `;
            });
            recHtml += `</ul>`;
        } else {
            recHtml += `<p>Sem recomendações específicas no momento.</p>`;
        }

        recommendationList.innerHTML = recHtml;
    }
});
