document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;
    const isDashboard = path.includes('dashboard.html');
    const isLogin = path.includes('index.html') || path.endsWith('/admin/');

    // AUTH CREDENTIALS (FRONTEND SIMULATION)
    const ADMIN_USER = "mestresdatattoo";
    const ADMIN_PASS = "24434998Cv@";

    // --- LOGIN LOGIC ---
    if (isLogin) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const u = document.getElementById('user').value;
                const p = document.getElementById('pass').value;
                const errorMsg = document.getElementById('errorMsg');

                if (u === ADMIN_USER && p === ADMIN_PASS) {
                    localStorage.setItem('mestres_admin_session', 'true');
                    window.location.href = 'dashboard.html';
                } else {
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = "Credenciais Inválidas";
                }
            });
        }
    }

    // --- DASHBOARD LOGIC ---
    if (isDashboard) {
        // Check Auth
        if (!localStorage.getItem('mestres_admin_session')) {
            window.location.href = 'index.html';
            return;
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('mestres_admin_session');
            window.location.href = 'index.html';
        });

        // Initialize Charts (Simulated Data)
        initCharts();
    }

});

function initCharts() {
    // Colors
    const gold = '#D4AF37';
    const darkGold = '#b89325';
    const grey = '#444';

    // 1. Visits Over Time (Line Chart)
    const ctxVisits = document.getElementById('visitsChart').getContext('2d');
    new Chart(ctxVisits, {
        type: 'line',
        data: {
            labels: ['01/02', '02/02', '03/02', '04/02', '05/02', '06/02', '07/02'],
            datasets: [{
                label: 'Visitas Diárias',
                data: [120, 150, 180, 450, 480, 600, 850],
                borderColor: gold,
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#ccc' } }
            },
            scales: {
                y: { grid: { color: '#333' }, ticks: { color: '#888' } },
                x: { grid: { color: '#333' }, ticks: { color: '#888' } }
            }
        }
    });

    // 2. Traffic Sources (Doughnut)
    const ctxSource = document.getElementById('sourceChart').getContext('2d');
    new Chart(ctxSource, {
        type: 'doughnut',
        data: {
            labels: ['Google (Orgânico)', 'Direto', 'Instagram', 'Outros'],
            datasets: [{
                data: [65, 15, 15, 5],
                backgroundColor: [gold, darkGold, '#222', '#666'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#ccc' } }
            }
        }
    });
}
