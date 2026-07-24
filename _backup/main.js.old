// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Chart Global Defaults
Chart.defaults.color = '#a0a0a0';
Chart.defaults.font.family = "'Outfit', sans-serif";
Chart.defaults.scale.grid.color = 'rgba(50, 50, 50, 0.5)';

// 1. Reach Chart (Pie: Followers vs Non-Followers)
// Using data: 81.3% Non-Followers, 18.7% Followers
const reachCtx = document.getElementById('reachChart').getContext('2d');
new Chart(reachCtx, {
    type: 'doughnut',
    data: {
        labels: ['Não Seguidores', 'Seguidores'],
        datasets: [{
            data: [81.3, 18.7],
            backgroundColor: ['#D4AF37', '#333333'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true, color: '#e0e0e0' }
            }
        },
        cutout: '70%'
    }
});

// 2. Interaction Chart (Bar: Reels vs Posts)
// Data: Reels 90.8%, Posts 8.4% (Approx remainder for others)
const interactionCtx = document.getElementById('interactionChart').getContext('2d');
new Chart(interactionCtx, {
    type: 'bar',
    data: {
        labels: ['Reels', 'Posts'],
        datasets: [{
            label: 'Interações',
            data: [90.8, 8.4],
            backgroundColor: ['#D4AF37', '#555555'],
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});

// 3. Followers Chart (Line: Growth simulation or Net Growth)
// Data: +8523 New, -3074 Left -> Net +5449
// Since we don't have timeline data, we'll visualize the Composition: New vs Left
const followersCtx = document.getElementById('followersChart').getContext('2d');
new Chart(followersCtx, {
    type: 'bar',
    data: {
        labels: ['Novos', 'Saídas', 'Líquido'],
        datasets: [{
            label: 'Fluxo',
            data: [8523, -3074, 5449],
            backgroundColor: ['#28a745', '#dc3545', '#D4AF37'],
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                grid: { color: '#222' }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});

console.log("Charts Initialized");
