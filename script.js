// MODAL CONTROLS
function openModal(id) {
    document.getElementById('modal-bg').style.display = 'block';
    document.getElementById(id).style.display = 'block';
}

function closeAllModals() {
    document.getElementById('modal-bg').style.display = 'none';
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(m => m.style.display = 'none');
}

// SUBJECT CONTROLS
function openSubject(name) {
    closeAllModals();
    document.getElementById('current-subject-name').innerText = name;
    document.getElementById('subject-page').style.display = 'block';
}

function closeSubject() {
    document.getElementById('subject-page').style.display = 'none';
}

// CALENDAR GENERATOR
function generateCalendar() {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
    document.getElementById('month-display').innerText = month;
    document.getElementById('year-display').innerText = now.getFullYear();

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const calendarDays = document.getElementById('calendar-days');
    
    let html = "";
    for (let i = 1; i <= daysInMonth; i++) {
        const todayClass = (i === now.getDate()) ? 'style="color:red; font-weight:bold"' : '';
        html += `<div ${todayClass}>${i}</div>`;
    }
    calendarDays.innerHTML = html;
}

// TO-DO LOGIC
function addTask() {
    const input = document.getElementById('todo-in');
    if(input.value === "") return;
    const list = document.getElementById('todo-list');
    const item = document.createElement('div');
    item.innerText = "- " + input.value;
    list.appendChild(item);
    input.value = "";
}

// Run on start
generateCalendar();