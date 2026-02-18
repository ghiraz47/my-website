// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeMobileMenu();
    initializeSubjectData();
    initializeResourceData();
    initializeFeedbackForm();
    initializeBackToTop();
    initializeActiveNav();
    initializeSearchAndFilter();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
}

// Sample subject data (in real app, this would come from a database)
const subjectsData = [
    {
        id: 1,
        name: 'Math',
        date: '12 March',
        topic: 'Algebra equations',
        icon: 'fa-calculator',
        resources: ['Worksheet', 'Practice problems', 'Video tutorial']
    },
    {
        id: 2,
        name: 'English',
        date: '12 March',
        topic: 'Descriptive writing',
        icon: 'fa-pen',
        resources: ['Notes', 'Examples', 'Writing prompts']
    },
    {
        id: 3,
        name: 'Science',
        date: '13 March',
        topic: 'Cell structure',
        icon: 'fa-flask',
        resources: ['Diagram', 'Lab notes', 'Quiz prep']
    }
];

// Sample resource data
const resourcesData = [
    { id: 1, name: 'Math Worksheet', type: 'worksheets', subject: 'Math', size: '2.3 MB', icon: 'fa-file-pdf' },
    { id: 2, name: 'English Notes', type: 'notes', subject: 'English', size: '1.1 MB', icon: 'fa-file-alt' },
    { id: 3, name: 'Science Video', type: 'videos', subject: 'Science', size: '15 MB', icon: 'fa-video' },
    { id: 4, name: 'Practice Problems', type: 'worksheets', subject: 'Math', size: '0.8 MB', icon: 'fa-file-pdf' },
    { id: 5, name: 'Writing Guide', type: 'notes', subject: 'English', size: '1.5 MB', icon: 'fa-file-alt' }
];

// Load subjects dynamically
function initializeSubjectData() {
    const subjectsGrid = document.getElementById('subjectsGrid');
    if (!subjectsGrid) return;

    function renderSubjects(filteredSubjects = subjectsData) {
        subjectsGrid.innerHTML = filteredSubjects.map(subject => `
            <div class="card subject-card" data-subject="${subject.name.toLowerCase()}">
                <h3><i class="fas ${subject.icon}"></i> ${subject.name}</h3>
                <p class="date"><i class="far fa-calendar"></i> ${subject.date}</p>
                <p class="topic">📚 ${subject.topic}</p>
                <div class="resources-list">
                    <strong>Resources:</strong>
                    <ul>
                        ${subject.resources.map(resource => `
                            <li><a href="#"><i class="fas fa-download"></i> ${resource}</a></li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    renderSubjects();
    window.renderSubjects = renderSubjects; // Make available for filter
}

// Load resources dynamically
function initializeResourceData() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    if (!resourcesGrid) return;

    function renderResources(filteredResources = resourcesData) {
        resourcesGrid.innerHTML = filteredResources.map(resource => `
            <div class="resource-item" data-type="${resource.type}">
                <div class="resource-icon">
                    <i class="fas ${resource.icon}"></i>
                </div>
                <h4>${resource.name}</h4>
                <p>Subject: ${resource.subject}</p>
                <div class="resource-meta">
                    <span><i class="far fa-file"></i> ${resource.size}</span>
                    <span><i class="far fa-clock"></i> Updated today</span>
                </div>
            </div>
        `).join('');
    }

    renderResources();
    window.renderResources = renderResources; // Make available for filter

    // Category filter functionality
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            if (category === 'all') {
                renderResources(resourcesData);
            } else {
                const filtered = resourcesData.filter(r => r.type === category);
                renderResources(filtered);
            }
        });
    });
}

// Enhanced feedback form
function initializeFeedbackForm() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    const messageBox = document.getElementById('message');
    
    if (feedbackBtn && messageBox) {
        feedbackBtn.addEventListener('click', function() {
            const name = document.getElementById('studentName')?.value || 'Anonymous';
            const type = document.getElementById('feedbackType')?.value || 'general';
            const text = document.getElementById('feedbackText')?.value;
            const urgent = document.getElementById('urgentCheck')?.checked;
            
            if (!text) {
                showMessage('Please enter your feedback message.', 'error');
                return;
            }
            
            // Simulate sending feedback
            messageBox.textContent = `Thank you ${name}! Your ${urgent ? 'urgent ' : ''}${type} feedback has been received. We'll respond within 24 hours.`;
            messageBox.className = 'message-box show success';
            
            // Clear form
            if (document.getElementById('studentName')) document.getElementById('studentName').value = '';
            if (document.getElementById('feedbackText')) document.getElementById('feedbackText').value = '';
            if (document.getElementById('urgentCheck')) document.getElementById('urgentCheck').checked = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 5000);
        });
    }
}

function showMessage(text, type) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = text;
    messageBox.className = `message-box show ${type}`;
}

// Back to top button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active navigation highlighting
function initializeActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Search and filter functionality
function initializeSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const subjectFilter = document.getElementById('subjectFilter');
    
    function filterSubjects() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const filterValue = subjectFilter?.value || 'all';
        
        const filtered = subjectsData.filter(subject => {
            const matchesSearch = subject.name.toLowerCase().includes(searchTerm) ||
                                subject.topic.toLowerCase().includes(searchTerm);
            const matchesFilter = filterValue === 'all' || 
                                subject.name.toLowerCase() === filterValue;
            return matchesSearch && matchesFilter;
        });
        
        if (window.renderSubjects) {
            window.renderSubjects(filtered);
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSubjects);
    }
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', filterSubjects);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update stats with animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        const updateStat = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        updateStat();
    });
}

// Add animation when stats come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    observer.observe(statsContainer);
}