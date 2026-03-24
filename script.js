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
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    document.getElementById('month-display').innerText = monthNames[now.getMonth()];
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
    if(input.value.trim() === "") return;
    const list = document.getElementById('todo-list');
    const item = document.createElement('div');
    item.innerText = "- " + input.value;
    item.style.color = "white";
    item.style.padding = "5px 0";
    list.appendChild(item);
    input.value = "";
}

// FEEDBACK LOGIC
function sendFeedback() {
    const text = document.getElementById('feedback-text');
    if(text.value.trim() === "") {
        alert("Please write something before sending.");
        return;
    }
    alert("Feedback sent! Thank you.");
    text.value = "";
    closeAllModals();
}

// Run on start
generateCalendar();
