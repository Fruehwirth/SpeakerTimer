import { addTimer, resetAllTimers, deleteAllTimers, handleInputFocus } from './timer.js';
import { toggleChart } from './chart.js';

export function setupEventListeners() {
    document.getElementById('add-timer-btn').addEventListener('click', addTimer);
    document.getElementById('reset-all-btn').addEventListener('click', resetAllTimers);
    document.getElementById('delete-all-btn').addEventListener('click', deleteAllTimers);
    document.getElementById('toggle-chart-btn').addEventListener('click', toggleChart);

    document.addEventListener('focusin', () => handleInputFocus(true));
    document.addEventListener('focusout', () => handleInputFocus(false));
}
