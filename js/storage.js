/* 
   JSON STORAGE UTILITIES
    */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const genId = () => '_' + Math.random().toString(36).substr(2, 9);

function getJSONStore(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch { return defaultValue; }
}

function setJSONStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) { console.error('Error saving to JSON storage', err); }
}

/* User Specific Application Data Storage */
let currentUser = null;
let userData = {
  subjects: [],
  tasks: [],
  notes: [],
  timerSessions: []
};

function loadUserData(userId) {
  const defaultUserTemplate = {
    subjects: [
      { id: genId(), name: 'Mathematics', progress: 60, hours: 12 },
      { id: genId(), name: 'Physics', progress: 40, hours: 8 }
    ],
    tasks: [
      { id: genId(), title: 'Review Chapter 1 Notes', status: 'todo' },
      { id: genId(), title: 'Solve 10 practice problems', status: 'doing' }
    ],
    notes: [
      { id: genId(), title: 'Welcome to Pragati', content: 'Organize your study goals here.' }
    ],
    timerSessions: []
  };
  userData = getJSONStore('sf_user_data_' + userId, defaultUserTemplate);
}

function saveUserData() {
  if (currentUser) {
    setJSONStore('sf_user_data_' + currentUser.id, userData);
  }
}

/* Toast Notifications */
function showToast(message, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;
  const icons = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle', info: 'info' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i data-lucide="${icons[type]}" style="width:18px;height:18px;flex-shrink:0" class="toast-icon"></i><span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function openModal(id) { const el = $('#' + id); if (el) el.classList.add('active'); }
function closeModal(id) { const el = $('#' + id); if (el) el.classList.remove('active'); }
