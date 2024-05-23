import { getTextColor, formatTime } from './constants.js';
import { timers } from './timer.js';

let chart;
let chartVisible = false;
let lastUpdateTime = 0;

export function toggleChart() {
    const chartContainer = document.getElementById('chart-container');
    const toggleChartBtn = document.getElementById('toggle-chart-btn');
    chartVisible = !chartVisible;
    if (chartVisible) {
        chartContainer.classList.add('show');
        toggleChartBtn.textContent = 'Hide Chart ▲';
    } else {
        chartContainer.classList.remove('show');
        toggleChartBtn.textContent = 'Show Chart ▼';
    }
    if (chartVisible) {
        updateChart();
    }
}

export function updateChart() {
    const now = Date.now();
    if (now - lastUpdateTime < 100) {
        return; // Skip the update if less than 100ms have passed
    }
    lastUpdateTime = now;

    if (!chartVisible) return;

    const filteredTimers = timers.filter(timer => timer.time > 0).reverse(); // Reverse the order of the timers

    const ctx = document.getElementById('timer-chart').getContext('2d');
    if (!chart) {
        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: filteredTimers.map(timer => timer.element.querySelector('input') ? timer.element.querySelector('input').value || 'Unnamed' : 'Unnamed'),
                datasets: [{
                    data: filteredTimers.map(timer => timer.time),
                    backgroundColor: filteredTimers.map(timer => timer.color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const timerTime = context.raw;
                                return formatTime(timerTime);
                            }
                        }
                    },
                    datalabels: {
                        color: function (context) {
                            return getTextColor(context.dataset.backgroundColor[context.dataIndex]);
                        },
                        formatter: (value, context) => {
                            return context.chart.data.labels[context.dataIndex];
                        },
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    } else {
        chart.data.labels = filteredTimers.map(timer => timer.element.querySelector('input') ? timer.element.querySelector('input').value || 'Unnamed' : 'Unnamed');
        chart.data.datasets[0].data = filteredTimers.map(timer => timer.time);
        chart.data.datasets[0].backgroundColor = filteredTimers.map(timer => timer.color);
        chart.update();
    }
}
