import { getRandomColor, shadeColor, getTextColor, formatTime } from './constants.js';
import { updateChart } from './chart.js';

export let timers = [];
let isInputFocused = false;

export function addTimer() {
    const timerId = Date.now();
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    timerElement.setAttribute('data-id', timerId);

    const color = getRandomColor();
    const darkerColor = shadeColor(color, -20);
    const textColor = getTextColor(color);

    timerElement.innerHTML = `
        <button class="bind-btn" style="background-color: ${color}; color: ${textColor};">...</button>
        <input type="text" placeholder="Speaker Name">
        <span class="time-display">00:00:00</span>
        <span class="reset-icon">↺</span>
        <span class="delete-icon">&times;</span>
    `;
    document.getElementById('timers').appendChild(timerElement);

    const bindBtn = timerElement.querySelector('.bind-btn');
    const inputField = timerElement.querySelector('input');
    const timeDisplay = timerElement.querySelector('.time-display');
    const resetIcon = timerElement.querySelector('.reset-icon');
    const deleteIcon = timerElement.querySelector('.delete-icon');

    bindBtn.addEventListener('mouseover', () => bindBtn.style.backgroundColor = darkerColor);
    bindBtn.addEventListener('mouseout', () => bindBtn.style.backgroundColor = color);

    let timer = {
        id: timerId,
        key: null,
        time: 0,
        interval: null,
        element: timerElement,
        color: color
    };

    bindBtn.addEventListener('click', () => bindKey(timer, bindBtn));
    inputField.addEventListener('focus', () => handleInputFocus(true));
    inputField.addEventListener('blur', () => handleInputFocus(false));
    inputField.addEventListener('input', updateChart);  // Update chart on input change
    resetIcon.addEventListener('click', () => resetTimer(timer));
    deleteIcon.addEventListener('click', () => deleteTimer(timerId));

    timers.push(timer);
    updateTimers();
}

function bindKey(timer, button) {
    button.textContent = '...';
    button.classList.add('selecting');
    document.addEventListener('keydown', function keyListener(e) {
        timer.key = e.key.toUpperCase();
        button.textContent = timer.key;
        button.classList.remove('selecting');
        document.removeEventListener('keydown', keyListener);
        setupKeyListeners(timer, button);
    });
}

function setupKeyListeners(timer, button) {
    document.addEventListener('keydown', function (e) {
        if (!isInputFocused && e.key.toUpperCase() === timer.key && !timer.interval) {
            button.classList.add('active');
            timer.interval = setInterval(() => {
                timer.time += 10;
                updateTimerDisplay(timer);
                updateChart();
            }, 10);
            const timeDisplay = timer.element.querySelector('.time-display');
            if (timeDisplay) {
                timeDisplay.classList.add('running');
            }
        }
    });
    document.addEventListener('keyup', function (e) {
        if (e.key.toUpperCase() === timer.key && timer.interval) {
            clearInterval(timer.interval);
            timer.interval = null;
            button.classList.remove('active');
            const timeDisplay = timer.element.querySelector('.time-display');
            if (timeDisplay) {
                timeDisplay.classList.remove('running');
            }
            updateChart();
        }
    });
}

function updateTimerDisplay(timer) {
    const timerElement = timer.element;
    if (timerElement) {
        const timeDisplay = timerElement.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = formatTime(timer.time);
        }
    }
}

export function resetTimer(timer) {
    timer.time = 0;
    updateTimerDisplay(timer);
    updateChart();
}

export function deleteTimer(timerId) {
    timers = timers.filter(timer => timer.id !== timerId);
    const timerElement = document.querySelector(`.timer[data-id="${timerId}"]`);
    if (timerElement) {
        document.getElementById('timers').removeChild(timerElement);
    }
    updateChart();
}

export function resetAllTimers() {
    timers.forEach(timer => resetTimer(timer));
}

export function deleteAllTimers() {
    timers = [];
    document.getElementById('timers').innerHTML = '';
    updateChart();
}

export function updateTimers() {
    timers.forEach(timer => updateTimerDisplay(timer));
}

export function handleInputFocus(isFocused) {
    isInputFocused = isFocused;
    if (isFocused) {
        timers.forEach(timer => {
            if (timer.interval) {
                clearInterval(timer.interval);
                timer.interval = null;
                const bindBtn = timer.element.querySelector('.bind-btn');
                const timeDisplay = timer.element.querySelector('.time-display');
                if (bindBtn) bindBtn.classList.remove('active');
                if (timeDisplay) timeDisplay.classList.remove('running');
            }
        });
    }
}
