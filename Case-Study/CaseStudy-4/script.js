/**
 * State-Driven Task Manager Module
 */
const TaskManager = (() => {
    // Reactive Application State
    const state = {
        tasks: [],
        filter: 'all',
        theme: 'light'
    };

    // DOM Elements Cache
    const DOM = {
        themeSelect: document.getElementById('themeSelect'),
        taskForm: document.getElementById('taskForm'),
        taskInput: document.getElementById('taskInput'),
        prioritySelect: document.getElementById('prioritySelect'),
        taskError: document.getElementById('taskError'),
        taskList: document.getElementById('taskList'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        taskCount: document.getElementById('taskCount'),
        purgeCompletedBtn: document.getElementById('purgeCompletedBtn')
    };

    // Filter Logic
    const getFilteredTasks = () => {
        if (state.filter === 'active') {
            return state.tasks.filter(t => !t.completed);
        }
        if (state.filter === 'completed') {
            return state.tasks.filter(t => t.completed);
        }
        return state.tasks;
    };

    // State Render Engine
    const render = () => {
        const filteredTasks = getFilteredTasks();
        DOM.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            DOM.taskList.innerHTML = `<li class="empty-state">No tasks found.</li>`;
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;

                li.innerHTML = `
                    <div class="task-content">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="TaskManager.toggleTask(${task.id})">
                        <span class="task-text">${escapeHtml(task.text)}</span>
                    </div>
                    <div class="task-actions">
                        <button class="delete-btn" onclick="TaskManager.deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                DOM.taskList.appendChild(li);
            });
        }

        // Update Remaining Active Count
        const activeCount = state.tasks.filter(t => !t.completed).length;
        DOM.taskCount.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
    };

    // Helper: Prevent XSS Script Injections
    const escapeHtml = (str) => {
        return str.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[m]);
    };

    // Public Module Operations
    return {
        init: () => {
            // Theme Switch Listener
            DOM.themeSelect.addEventListener('change', (e) => {
                state.theme = e.target.value;
                document.documentElement.setAttribute('data-theme', state.theme);
            });

            // Form Submit Listener
            DOM.taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = DOM.taskInput.value.trim();

                if (!text) {
                    DOM.taskError.style.display = 'block';
                    return;
                }

                DOM.taskError.style.display = 'none';

                state.tasks.push({
                    id: Date.now(),
                    text: text,
                    priority: DOM.prioritySelect.value,
                    completed: false
                });

                DOM.taskInput.value = '';
                render();
            });

            // Filter Control Listeners
            DOM.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    DOM.filterBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    state.filter = e.target.dataset.filter;
                    render();
                });
            });

            // Purge Completed Listener
            DOM.purgeCompletedBtn.addEventListener('click', () => {
                state.tasks = state.tasks.filter(t => !t.completed);
                render();
            });

            render();
        },

        toggleTask: (id) => {
            const task = state.tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                render();
            }
        },

        deleteTask: (id) => {
            state.tasks = state.tasks.filter(t => t.id !== id);
            render();
        }
    };
})();

// Initialize Module on DOM Loaded
document.addEventListener('DOMContentLoaded', TaskManager.init);