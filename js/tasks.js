/*
   TASKS KANBAN MODULE
    */

let activeKanbanTab = 'todo';

function renderTasks() {
  ['todo', 'doing', 'completed'].forEach(status => {
    const list = userData.tasks.filter(t => t.status === status);
    const countEl = $(`#count-${status}`);
    const tabCountEl = $(`#count-${status}-tab`);
    const colEl = $(`#kanban-${status}`);
    if (countEl) countEl.textContent = list.length;
    if (tabCountEl) tabCountEl.textContent = list.length;
    if (colEl) {
      colEl.innerHTML = list.map(t => `
        <div class="task-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span style="font-size:14px;font-weight:600">${t.title}</span>
            <button onclick="deleteTask('${t.id}')" style="color:var(--text-tertiary)"><i data-lucide="x" style="width:14px;height:14px"></i></button>
          </div>
          <div style="margin-top:12px;display:flex;gap:6px">
            ${status !== 'todo' ? `<button class="btn btn-secondary btn-sm" onclick="moveTask('${t.id}','todo')" style="padding:4px 8px;font-size:11px">To Do</button>` : ''}
            ${status !== 'doing' ? `<button class="btn btn-secondary btn-sm" onclick="moveTask('${t.id}','doing')" style="padding:4px 8px;font-size:11px">Doing</button>` : ''}
            ${status !== 'completed' ? `<button class="btn btn-primary btn-sm" onclick="moveTask('${t.id}','completed')" style="padding:4px 8px;font-size:11px">Done</button>` : ''}
          </div>
        </div>
      `).join('');
    }
  });
  switchKanbanTab(activeKanbanTab);
  lucide.createIcons();
}

function switchKanbanTab(status) {
  activeKanbanTab = status;
  $$('.kanban-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === status);
  });
  $$('.kanban-column').forEach(col => {
    col.classList.toggle('active-mobile', col.id === 'col-' + status);
  });
}

function addTask() {
  const input = $('#task-title-input');
  if (!input) return;
  const title = input.value.trim();
  if (!title) return;
  userData.tasks.push({ id: genId(), title, status: 'todo' });
  saveUserData();
  input.value = '';
  closeModal('task-modal');
  renderTasks();
  showToast('Task added successfully');
}

function moveTask(id, status) {
  const task = userData.tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    saveUserData();
    renderTasks();
  }
}

function deleteTask(id) {
  userData.tasks = userData.tasks.filter(t => t.id !== id);
  saveUserData();
  renderTasks();
  showToast('Task deleted', 'info');
}
