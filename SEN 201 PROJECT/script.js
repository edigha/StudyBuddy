// StudyBuddy - Smart Study Session Planner
// SDLC Implementation Project

// Session Class
class StudySession {
    constructor(id, subject, topic, duration, priority, dueDate, resources, notes) {
        this.id = id;
        this.subject = subject;
        this.topic = topic || '';
        this.duration = parseFloat(duration);
        this.priority = priority;
        this.dueDate = dueDate;
        this.resources = resources ? resources.split(',').map(r => r.trim()) : [];
        this.notes = notes || '';
        this.status = 'pending'; // pending, in-progress, completed
        this.createdAt = new Date().toISOString();
        this.completedAt = null;
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        if (newStatus === 'completed') {
            this.completedAt = new Date().toISOString();
        }
    }

    isOverdue() {
        if (this.status === 'completed') return false;
        return new Date(this.dueDate) < new Date();
    }
}

// StudyPlanner App
class StudyPlanner {
    constructor() {
        this.sessions = [];
        this.currentFilter = 'all';
        this.currentPriorityFilter = 'all';
        this.editingSessionId = null;
        
        this.initialize();
    }

    initialize() {
        this.loadSessions();
        this.setupEventListeners();
        this.setupDefaultDate();
        this.updateUI();
        
        // Add sample sessions if empty
        if (this.sessions.length === 0) {
            this.addSampleSessions();
        }
    }

    setupDefaultDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('due-date').value = tomorrow.toISOString().split('T')[0];
    }

    loadSessions() {
        const saved = localStorage.getItem('studybuddy_sessions');
        if (saved) {
            const sessionsData = JSON.parse(saved);
            this.sessions = sessionsData.map(data => {
                const session = new StudySession(
                    data.id,
                    data.subject,
                    data.topic,
                    data.duration,
                    data.priority,
                    data.dueDate,
                    data.resources.join(','),
                    data.notes
                );
                session.status = data.status;
                session.createdAt = data.createdAt;
                session.completedAt = data.completedAt;
                return session;
            });
        }
    }

    saveSessions() {
        localStorage.setItem('studybuddy_sessions', JSON.stringify(this.sessions));
    }

    addSampleSessions() {
        const sampleSessions = [
            ['Data Structures', 'Binary Trees', 2, 'high', this.getDateString(1), 'Textbook Ch.8, Lecture Notes', 'Understand tree traversals'],
            ['Calculus', 'Integration', 1.5, 'medium', this.getDateString(2), 'Practice Problems', 'Complete 10 integration problems'],
            ['Database Systems', 'SQL Queries', 2, 'urgent', this.getDateString(0), 'Online Tutorial, Lab Exercises', 'Prepare for lab test'],
            ['Web Development', 'JavaScript Arrays', 1, 'low', this.getDateString(3), 'MDN Docs, Coding Exercises', 'Practice array methods']
        ];

        sampleSessions.forEach(([subject, topic, duration, priority, dueDate, resources, notes]) => {
            const id = Date.now() + Math.random().toString(36).substr(2, 9);
            const session = new StudySession(id, subject, topic, duration, priority, dueDate, resources, notes);
            // Mark first one as in-progress
            if (subject === 'Database Systems') {
                session.updateStatus('in-progress');
            }
            // Mark last one as completed
            if (subject === 'Web Development') {
                session.updateStatus('completed');
            }
            this.sessions.push(session);
        });

        this.saveSessions();
    }

    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('session-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSession();
        });

        // Filter changes
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.updateUI();
        });

        document.getElementById('filter-priority').addEventListener('change', (e) => {
            this.currentPriorityFilter = e.target.value;
            this.updateUI();
        });

        // Clear buttons
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompletedSessions();
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAllSessions();
        });

        // Modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('session-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    addSession() {
        const subject = document.getElementById('subject').value.trim();
        const topic = document.getElementById('topic').value.trim();
        const duration = document.getElementById('duration').value;
        const priority = document.getElementById('priority').value;
        const dueDate = document.getElementById('due-date').value;
        const resources = document.getElementById('resources').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!subject) {
            alert('Please enter a subject/course');
            return;
        }

        const id = Date.now().toString();
        const session = new StudySession(id, subject, topic, duration, priority, dueDate, resources, notes);
        
        this.sessions.push(session);
        this.saveSessions();
        this.updateUI();
        
        // Reset form
        document.getElementById('session-form').reset();
        this.setupDefaultDate();
        document.getElementById('subject').focus();

        this.showNotification('Study session added successfully!');
    }

    updateSessionStatus(id, newStatus) {
        const session = this.sessions.find(s => s.id === id);
        if (session) {
            session.updateStatus(newStatus);
            this.saveSessions();
            this.updateUI();
            this.showNotification(`Session marked as ${newStatus}!`);
        }
    }

    deleteSession(id) {
        if (confirm('Are you sure you want to delete this study session?')) {
            this.sessions = this.sessions.filter(s => s.id !== id);
            this.saveSessions();
            this.updateUI();
            this.showNotification('Session deleted!');
        }
    }

    clearCompletedSessions() {
        if (confirm('Clear all completed study sessions?')) {
            this.sessions = this.sessions.filter(s => s.status !== 'completed');
            this.saveSessions();
            this.updateUI();
            this.showNotification('Completed sessions cleared!');
        }
    }

    clearAllSessions() {
        if (confirm('Are you sure you want to delete ALL study sessions? This cannot be undone.')) {
            this.sessions = [];
            this.saveSessions();
            this.updateUI();
            this.showNotification('All sessions cleared!');
        }
    }

    getFilteredSessions() {
        let filtered = [...this.sessions];

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(session => session.status === this.currentFilter);
        }

        // Apply priority filter
        if (this.currentPriorityFilter !== 'all') {
            filtered = filtered.filter(session => session.priority === this.currentPriorityFilter);
        }

        // Sort by: overdue first, then due date, then priority
        filtered.sort((a, b) => {
            // Overdue first
            const aOverdue = a.isOverdue();
            const bOverdue = b.isOverdue();
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;

            // Then by due date
            const aDate = new Date(a.dueDate);
            const bDate = new Date(b.dueDate);
            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;

            // Then by priority order
            const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        return filtered;
    }

    calculateStats() {
        const total = this.sessions.length;
        const completed = this.sessions.filter(s => s.status === 'completed').length;
        const inProgress = this.sessions.filter(s => s.status === 'in-progress').length;
        const pending = this.sessions.filter(s => s.status === 'pending').length;
        
        const totalHours = this.sessions.reduce((sum, session) => sum + session.duration, 0);
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            pending,
            totalHours,
            completionRate
        };
    }

    updateUI() {
        this.updateStats();
        this.renderSessionsList();
        this.updateProgress();
    }

    updateStats() {
        const stats = this.calculateStats();
        
        document.getElementById('total-sessions').textContent = stats.total;
        document.getElementById('total-hours').textContent = `${stats.totalHours}h`;
        document.getElementById('completion-rate').textContent = `${stats.completionRate}%`;
        
        document.getElementById('planned-count').textContent = stats.total;
        document.getElementById('completed-count').textContent = stats.completed;
        document.getElementById('inprogress-count').textContent = stats.inProgress;
    }

    updateProgress() {
        const stats = this.calculateStats();
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }

    renderSessionsList() {
        const sessionsList = document.getElementById('sessions-list');
        const filteredSessions = this.getFilteredSessions();

        if (filteredSessions.length === 0) {
            sessionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>No study sessions found</h3>
                    <p>Try changing your filters or add a new session!</p>
                </div>
            `;
            return;
        }

        sessionsList.innerHTML = '';
        filteredSessions.forEach(session => {
            const sessionElement = this.createSessionElement(session);
            sessionsList.appendChild(sessionElement);
        });
    }

    createSessionElement(session) {
        const div = document.createElement('div');
        div.className = `session-item ${session.status} ${session.priority === 'urgent' ? 'urgent' : ''}`;
        div.dataset.id = session.id;

        // Format date
        const dueDate = new Date(session.dueDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let dateText = dueDate.toLocaleDateString();
        if (dueDate.toDateString() === today.toDateString()) {
            dateText = 'Today';
        } else if (dueDate.toDateString() === tomorrow.toDateString()) {
            dateText = 'Tomorrow';
        } else if (session.isOverdue()) {
            dateText += ' (Overdue!)';
        }

        // Status text and class
        const statusText = session.status.charAt(0).toUpperCase() + session.status.slice(1);
        const statusClass = `status-${session.status.replace('-', '')}`;

        div.innerHTML = `
            <div class="session-header">
                <div class="session-title">${session.subject}</div>
                <span class="session-priority priority-${session.priority}">${session.priority}</span>
            </div>
            ${session.topic ? `<div class="session-details"><i class="fas fa-tag"></i> ${session.topic}</div>` : ''}
            <div class="session-details">
                <span><i class="fas fa-clock"></i> ${session.duration} hours</span>
                <span><i class="fas fa-calendar-alt"></i> ${dateText}</span>
                ${session.resources.length > 0 ? `<span><i class="fas fa-link"></i> ${session.resources.length} resources</span>` : ''}
            </div>
            <div class="session-footer">
                <span class="session-status ${statusClass}">${statusText}</span>
                <div class="session-actions">
                    <button class="action-btn" onclick="studyPlanner.viewSession('${session.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `;

        // Click on session to view details
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.viewSession(session.id);
            }
        });

        return div;
    }

    viewSession(id) {
        const session = this.sessions.find(s => s.id === id);
        if (!session) return;

        this.editingSessionId = id;
        const modal = document.getElementById('session-modal');
        const modalBody = document.getElementById('modal-body');
        const toggleBtn = document.getElementById('toggle-status');
        const editBtn = document.getElementById('edit-session');

        // Format resources as list
        const resourcesHtml = session.resources.length > 0 
            ? `<p><strong>Resources:</strong><br>${session.resources.map(r => `• ${r}`).join('<br>')}</p>`
            : '';

        modalBody.innerHTML = `
            <div class="session-detail">
                <h4>${session.subject}</h4>
                ${session.topic ? `<p><strong>Topic:</strong> ${session.topic}</p>` : ''}
                <p><strong>Duration:</strong> ${session.duration} hours</p>
                <p><strong>Priority:</strong> <span class="priority-${session.priority}">${session.priority}</span></p>
                <p><strong>Due Date:</strong> ${new Date(session.dueDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span class="status-${session.status.replace('-', '')}">${session.status}</span></p>
                ${resourcesHtml}
                ${session.notes ? `<p><strong>Notes/Goals:</strong><br>${session.notes}</p>` : ''}
                <p><small>Created: ${new Date(session.createdAt).toLocaleDateString()}</small></p>
                ${session.completedAt ? `<p><small>Completed: ${new Date(session.completedAt).toLocaleDateString()}</small></p>` : ''}
            </div>
        `;

        // Set toggle button text based on current status
        if (session.status === 'completed') {
            toggleBtn.innerHTML = '<i class="fas fa-undo"></i> Mark as Pending';
            toggleBtn.onclick = () => this.updateSessionStatus(id, 'pending');
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
            toggleBtn.onclick = () => this.updateSessionStatus(id, 'completed');
        }

        // Edit button functionality
        editBtn.onclick = () => {
            this.editSession(id);
            this.closeModal();
        };

        modal.classList.add('active');
    }

    editSession(id) {
        const session = this.sessions.find(s => s.id === id);
        if (!session) return;

        // Populate form with session data
        document.getElementById('subject').value = session.subject;
        document.getElementById('topic').value = session.topic || '';
        document.getElementById('duration').value = session.duration;
        document.getElementById('priority').value = session.priority;
        document.getElementById('due-date').value = session.dueDate;
        document.getElementById('resources').value = session.resources.join(', ');
        document.getElementById('notes').value = session.notes || '';

        // Delete the old session (will be replaced with updated one)
        this.deleteSession(id);
        
        // Scroll to form
        document.getElementById('subject').focus();
        this.showNotification('Edit the session details and save again');
    }

    closeModal() {
        document.getElementById('session-modal').classList.remove('active');
        this.editingSessionId = null;
    }

    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize app
let studyPlanner;
document.addEventListener('DOMContentLoaded', () => {
    studyPlanner = new StudyPlanner();
    window.studyPlanner = studyPlanner; // Make available globally for onclick handlers
});