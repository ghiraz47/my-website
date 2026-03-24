// StudyOS Dashboard - Enhanced JavaScript
class StudyOS {
    constructor() {
        this.currentMonth = new Date();
        this.tasks = [];
        this.notes = '';
        this.settings = {
            username: '',
            studyGoal: 60,
            notifications: true
        };
        this.currentFilter = 'all';
        this.studyStreak = 1;
        this.init();
    }

    init() {
        this.loadData();
        this.generateCalendar();
        this.updateStats();
        this.setupEventListeners();
        this.checkStudyStreak();
    }

    // Data Persistence
    loadData() {
        const savedTasks = localStorage.getItem('studyos-tasks');
        const savedNotes = localStorage.getItem('studyos-notes');
        const savedSettings = localStorage.getItem('studyos-settings');
        const savedStreak = localStorage.getItem('studyos-streak');

        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.renderTasks();
        }
        
        if (savedNotes) {
            this.notes = savedNotes;
            document.getElementById('notes-area').value = this.notes;
        }
        
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.applySettings();
        }
        
        if (savedStreak) {
            this.studyStreak = parseInt(savedStreak);
        }
    }

    saveData() {
        localStorage.setItem('studyos-tasks', JSON.stringify(this.tasks));
        localStorage.setItem('studyos-notes', this.notes);
        localStorage.setItem('studyos-settings', JSON.stringify(this.settings));
        localStorage.setItem('studyos-streak', this.studyStreak.toString());
    }

    // Calendar Functions
    generateCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                          'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        document.getElementById('month-display').textContent = monthNames[month];
        document.getElementById('year-display').textContent = year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = this.createDayElement(day, 'other-month');
            calendarDays.appendChild(dayElement);
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = year === today.getFullYear() && 
                          month === today.getMonth() && 
                          day === today.getDate();
            const dayElement = this.createDayElement(day, isToday ? 'today' : 'current-month');
            
            // Add task indicators
            const dayTasks = this.getTasksForDay(year, month, day);
            if (dayTasks.length > 0) {
                const indicator = document.createElement('span');
                indicator.className = 'task-indicator';
                indicator.textContent = `•${dayTasks.length}`;
                indicator.style.cssText = 'position: absolute; top: 2px; right: 2px; font-size: 10px; color: #40e0d0;';
                dayElement.appendChild(indicator);
            }
            
            calendarDays.appendChild(dayElement);
        }

        // Next month days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'other-month');
            calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(day, className) {
        const div = document.createElement('div');
        div.textContent = day;
        div.className = className;
        div.style.cssText = 'position: relative; cursor: pointer;';
        return div;
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.generateCalendar();
    }

    getTasksForDay(year, month, day) {
        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.getFullYear() === year && 
                   taskDate.getMonth() === month && 
                   taskDate.getDate() === day;
        });
    }

    // Modal Functions
    openModal(modalId) {
        const modalBg = document.getElementById('modal-bg');
        const modal = document.getElementById(modalId);
        
        modalBg.classList.add('active');
        modal.classList.add('active');
        
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
    }

    closeAllModals() {
        const modalBg = document.getElementById('modal-bg');
        const modals = document.querySelectorAll('.modal-content');
        
        modalBg.classList.remove('active');
        modals.forEach(modal => modal.classList.remove('active'));
        
        // Restore background scroll
        document.body.style.overflow = '';
    }

    // Feedback Functions
    sendFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackText = feedbackArea.value.trim();
        
        if (feedbackText === '') {
            this.showMessage('Please write your feedback before sending', 'error');
            return;
        }
        
        // Here you would normally send to a server
        // For now, we'll simulate success
        this.showMessage('Thank you for your feedback! It has been sent successfully.', 'success');
        
        // Clear and close
        feedbackArea.value = '';
        this.closeAllModals();
    }

    // Subject Functions
    openSubject(subjectName) {
        this.closeAllModals();
        document.getElementById('current-subject-name').textContent = subjectName;
        document.getElementById('subject-page').style.display = 'block';
        
        // Load subject-specific content
        this.loadSubjectContent(subjectName);
    }

    closeSubject() {
        document.getElementById('subject-page').style.display = 'none';
    }

    loadSubjectContent(subject) {
        const content = {
            'Math': {
                lessons: ['Algebra Basics', 'Geometry Fundamentals', 'Calculus Introduction'],
                files: ['Math Textbook PDF', 'Practice Problems', 'Formula Sheet'],
                discussion: ['Study Group Meeting - Tomorrow 3PM', 'Homework Questions', 'Exam Prep Tips']
            },
            'Chemistry': {
                lessons: ['Atomic Structure', 'Chemical Bonding', 'Periodic Table'],
                files: ['Lab Manual', 'Chemistry Notes', 'Safety Guidelines'],
                discussion: ['Lab Report Due Friday', 'Study Session Monday', 'Question about Stoichiometry']
            },
            'Physics': {
                lessons: ['Newton\'s Laws', 'Energy and Work', 'Wave Mechanics'],
                files: ['Physics Textbook', 'Problem Sets', 'Lab Data'],
                discussion: ['Physics Club Meeting', 'Homework Help', 'Exam Study Group']
            },
            'Biology': {
                lessons: ['Cell Structure', 'Genetics Basics', 'Evolution'],
                files: ['Biology Textbook', 'Lab Reports', 'Diagrams'],
                discussion: ['Biology Tutoring Available', 'Study Group Forming', 'Lab Partner Needed']
            },
            'Geography': {
                lessons: ['Physical Geography', 'Human Geography', 'Map Reading'],
                files: ['World Maps', 'Climate Data', 'Population Statistics'],
                discussion: ['Geography Bee Prep', 'Current Events Discussion', 'Project Ideas']
            },
            'History': {
                lessons: ['Ancient Civilizations', 'World Wars', 'Modern History'],
                files: ['History Textbook', 'Timeline Charts', 'Primary Sources'],
                discussion: ['History Documentary Night', 'Essay Workshop', 'Study Session']
            }
        };

        const subjectData = content[subject] || {
            lessons: ['No lessons available'],
            files: ['No files available'],
            discussion: ['No discussions available']
        };

        document.getElementById('lessons-list').innerHTML = subjectData.lessons
            .map(lesson => `<p>📖 ${lesson}</p>`).join('');
        
        document.getElementById('files-list').innerHTML = subjectData.files
            .map(file => `<p>📄 ${file}</p>`).join('');
        
        document.getElementById('discussion-list').innerHTML = subjectData.discussion
            .map(discussion => `<p>💬 ${discussion}</p>`).join('');
    }

    // Task Management
    addTask() {
        const input = document.getElementById('todo-in');
        const taskText = input.value.trim();
        
        if (taskText === '') {
            this.showMessage('Please enter a task', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: null
        };

        this.tasks.unshift(task);
        input.value = '';
        this.renderTasks();
        this.saveData();
        this.updateStats();
        this.showMessage('Task added successfully', 'success');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.saveData();
            this.updateStats();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.renderTasks();
        this.saveData();
        this.updateStats();
        this.showMessage('Task deleted', 'success');
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderTasks();
    }

    renderTasks() {
        const todoList = document.getElementById('todo-list');
        let filteredTasks = this.tasks;

        if (this.currentFilter === 'active') {
            filteredTasks = this.tasks.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            todoList.innerHTML = '<p style="text-align: center; color: #666;">No tasks found</p>';
            return;
        }

        todoList.innerHTML = filteredTasks.map(task => `
            <div class="todo-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="studyOS.toggleTask(${task.id})">
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <button class="todo-delete" onclick="studyOS.deleteTask(${task.id})">Delete</button>
            </div>
        `).join('');
    }

    // Notes Functions
    saveNotes() {
        const notesArea = document.getElementById('notes-area');
        this.notes = notesArea.value;
        this.saveData();
        this.showMessage('Notes saved successfully', 'success');
        this.closeAllModals();
    }

    // Settings Functions
    saveSettings() {
        const username = document.getElementById('username').value;
        const studyGoal = document.getElementById('study-goal').value;
        const notifications = document.getElementById('notifications').checked;

        this.settings = { username, studyGoal, notifications };
        this.saveData();
        this.applySettings();
        this.showMessage('Settings saved successfully', 'success');
        this.closeAllModals();
    }

    applySettings() {
        document.getElementById('username').value = this.settings.username || '';
        document.getElementById('study-goal').value = this.settings.studyGoal;
        document.getElementById('notifications').checked = this.settings.notifications;
    }

    // Theme Toggle
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    }

    // Statistics
    updateStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTasks = this.tasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        });

        const completedTasks = this.tasks.filter(task => task.completed);

        document.getElementById('today-tasks-count').textContent = todayTasks.length;
        document.getElementById('completed-tasks-count').textContent = completedTasks.length;
        document.getElementById('study-streak').textContent = this.studyStreak;
    }

    // Study Streak
    checkStudyStreak() {
        const lastVisit = localStorage.getItem('studyos-last-visit');
        const today = new Date().toDateString();
        
        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                this.studyStreak++;
            } else if (lastVisit !== today) {
                this.studyStreak = 1;
            }
            
            localStorage.setItem('studyos-last-visit', today);
            this.saveData();
            this.updateStats();
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Enter key for task input
        document.getElementById('todo-in').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
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

        // Notification click
        document.querySelector('.notif-bell').addEventListener('click', () => {
            this.showNotification('You have 1 new reminder: Complete your Math homework!');
        });
    }

    // Utility Functions
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    showNotification(text) {
        if (this.settings.notifications && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('StudyOS', { body: text });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('StudyOS', { body: text });
                    }
                });
            }
        }
        this.showMessage(text, 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
function filterTasks(filter) { studyOS.filterTasks(filter); }
function saveNotes() { studyOS.saveNotes(); }
function saveSettings() { studyOS.saveSettings(); }
function toggleTheme() { studyOS.toggleTheme(); }
function changeMonth(direction) { studyOS.changeMonth(direction); }
function sendFeedback() { studyOS.sendFeedback(); }

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
