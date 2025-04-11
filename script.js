// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const weatherEl = document.getElementById('weather');
const locationEl = document.getElementById('location');

// Load tasks & weather on startup
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    loadTasks();
    getWeather();
    setupEventListeners();
}

function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
}

// Task Management
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = createTaskElement(text);
    taskList.appendChild(task);
    taskInput.value = '';
    saveTasks();
}

function createTaskElement(text) {
    const li = document.createElement('li');
    li.className = 'task';
    li.innerHTML = `
        <span>${text}</span>
        <button>×</button>
    `;

    const span = li.querySelector('span');
    const deleteBtn = li.querySelector('button');

    span.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    return li;
}

function saveTasks() {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('span').textContent,
        completed: task.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        const li = createTaskElement(task.text);
        if (task.completed) li.classList.add('completed');
        taskList.appendChild(li);
    });
}

// Weather API (using free OpenWeatherMap)
async function getWeather() {
    try {
        if (!navigator.geolocation) {
            throw new Error('Geolocation not supported');
        }

        const { coords } = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const API_KEY = 'YOUR_API_KEY'; // Replace with your key
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        weatherEl.textContent = `${Math.round(data.main.temp)}°C`;
        locationEl.textContent = data.name;
    } catch (err) {
        console.error('Weather fetch failed:', err);
        weatherEl.textContent = '--°C';
        locationEl.textContent = 'Unknown';
    }
}