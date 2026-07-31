/* Subjects Page */

function renderSubjects(){
    const container = $('#subjects-container');
  if (!container) return;
  container.innerHTML = userData.subjects.map(s => `
    <div class="card">
      <h3 style="font-size:18px;font-weight:700">${s.name}</h3>
      <div style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
          <span>Progress</span><span>${s.progress}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%;background:var(--primary)"></div></div>
      </div>
      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
        <span class="small-text">${s.hours || 0} hours logged</span>
        <button class="btn btn-secondary btn-sm" onclick="deleteSubject('${s.id}')"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function addSubject() {
  const nameInput = $('#subject-name-input');
  if (!nameInput) return;
  const name = nameInput.value.trim();
  if (!name) return;
  userData.subjects.push({ id: genId(), name, progress: 0, hours: 0 });
  saveUserData();
  nameInput.value = '';
  closeModal('subject-modal');
  renderSubjects();
  showToast('Subject added successfully');
}

function deleteSubject(id) {
  userData.subjects = userData.subjects.filter(s => s.id !== id);
  saveUserData();
  renderSubjects();
  showToast('Subject deleted', 'info');
}