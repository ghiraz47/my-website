// StudyOS Dashboard - Custom Design
class StudyOS {
    constructor() {
        this.currentMonth = new Date();
        this.tasks = [];
        this.notes = '';
        this.init();
    }

    init() {
        this.loadData();
        this.generateCalendar();
        this.setupEventListeners();
    }

    // Data Persistence
    loadData() {
        const savedTasks = localStorage.getItem('studyos-tasks');
        const savedNotes = localStorage.getItem('studyos-notes');

        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.renderTasks();
        }
        
        if (savedNotes) {
            this.notes = savedNotes;
            document.getElementById('notes-area').value = this.notes;
        }
    }

    saveData() {
        localStorage.setItem('studyos-tasks', JSON.stringify(this.tasks));
        localStorage.setItem('studyos-notes', this.notes);
    }

    // Calendar Functions
    generateCalendar() {
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
        const year = now.getFullYear();
        
        document.getElementById('month-display').innerText = month;
        document.getElementById('year-display').innerText = year;

        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
        
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Highlight today
            if (day === now.getDate()) {
                dayElement.classList.add('today');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }

    // Modal Functions
    openModal(id) {
        document.getElementById('modal-bg').style.display = 'block';
        document.getElementById(id).style.display = 'block';
    }

    closeAllModals() {
        document.getElementById('modal-bg').style.display = 'none';
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(m => m.style.display = 'none');
    }

    // Feedback Functions
    openFeedbackModal() {
        document.getElementById('modal-bg').style.display = 'block';
        document.getElementById('feedback-modal').style.display = 'block';
        document.getElementById('feedback-area').value = '';
        document.getElementById('feedback-area').focus();
    }

    closeFeedbackModal() {
        this.closeAllModals();
    }

    sendFeedback() {
        const feedbackText = document.getElementById('feedback-area').value.trim();
        
        if (feedbackText === '') {
            alert('Please write your feedback before sending.');
            return;
        }
        
        // Here you would normally send the feedback to a server
        // For now, we'll just show a success message
        alert('Thank you for your feedback! It has been sent successfully.');
        
        // Clear the feedback area and close modal
        document.getElementById('feedback-area').value = '';
        this.closeFeedbackModal();
    }

    // Subject Functions
    openSubject(name) {
        this.closeAllModals();
        document.getElementById('current-subject-name').innerText = name;
        document.getElementById('subject-page').style.display = 'block';
    }

    closeSubject() {
        document.getElementById('subject-page').style.display = 'none';
    }

    // Task Management
    addTask() {
        const input = document.getElementById('todo-in');
        if(input.value.trim() === "") return;
        
        const task = {
            id: Date.now(),
            text: input.value.trim(),
            completed: false
        };
        
        this.tasks.unshift(task);
        input.value = "";
        this.renderTasks();
        this.saveData();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.saveData();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.renderTasks();
        this.saveData();
    }

    renderTasks() {
        const list = document.getElementById('todo-list');
        
        if (this.tasks.length === 0) {
            list.innerHTML = '<p style="text-align: center; opacity: 0.7;">No tasks yet</p>';
            return;
        }
        
        list.innerHTML = this.tasks.map(task => `
            <div class="todo-item">
                <span style="${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${task.text}</span>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="studyOS.toggleTask(${task.id})">
                    <button onclick="studyOS.deleteTask(${task.id})" style="margin-left: 10px; background: #e8a5b8; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Notes Functions
    saveNotes() {
        this.notes = document.getElementById('notes-area').value;
        this.saveData();
        alert('Notes saved successfully!');
        this.closeAllModals();
    }

    // Event Listeners
    setupEventListeners() {
        // Enter key for task input
        document.getElementById('todo-in').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Auto-save notes
        let notesTimeout;
        document.getElementById('notes-area').addEventListener('input', (e) => {
            clearTimeout(notesTimeout);
            notesTimeout = setTimeout(() => {
                this.notes = e.target.value;
                this.saveData();
            }, 1000);
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
}

// Initialize the app
const studyOS = new StudyOS();

// Global functions for onclick handlers
function openModal(id) { studyOS.openModal(id); }
function closeAllModals() { studyOS.closeAllModals(); }
function openSubject(name) { studyOS.openSubject(name); }
function closeSubject() { studyOS.closeSubject(); }
function addTask() { studyOS.addTask(); }
function saveNotes() { studyOS.saveNotes(); }
function openFeedbackModal() { studyOS.openFeedbackModal(); }
function closeFeedbackModal() { studyOS.closeFeedbackModal(); }
function sendFeedback() { studyOS.sendFeedback(); }
