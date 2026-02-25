// Switching between Dashboard and Subject pages
function showView(viewId) {
    // Hide all pages
    const pages = document.querySelectorAll('.sub-page');
    pages.forEach(p => p.classList.remove('active'));

    // Check if it's a specific subject
    if (['math', 'chem', 'physics', 'geo', 'hist', 'bio'].includes(viewId)) {
        document.getElementById('subject-detail').classList.add('active');
        document.getElementById('sub-title').innerText = viewId.toUpperCase() + ".sys";
    } else {
        document.getElementById(viewId).classList.add('active');
    }
}

// Opening and closing To-Do / Notes
function toggleModal(id, show) {
    const overlay = document.getElementById('global-overlay');
    overlay.style.display = show ? 'block' : 'none';
    
    if (id) {
        document.getElementById(id).style.display = show ? 'block' : 'none';
    } else {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
}

// Adding items to the To-Do list
function addTask() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === "") return;
    
    const container = document.getElementById('todo-items');
    const task = document.createElement('div');
    task.innerHTML = `> ${input.value}`;
    task.style.color = "#00f2ff";
    task.style.marginBottom = "5px";
    
    container.appendChild(task);
    input.value = "";
}

// Real-time Clock
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    document.getElementById('clock').innerText = time;
}, 1000);