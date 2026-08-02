/* 
   SETTINGS & JSON BACKUP MODULE
    */

function saveProfileSettings() {
  const nameInput = $('#settings-name');
  if (!nameInput || !currentUser) return;
  const name = nameInput.value.trim();
  if (!name) return;

  currentUser.name = name;

  const db = getUsersDB();
  const idx = db.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    db[idx].name = name;
    saveUsersDB(db);
  }

  const session = getActiveSession();
  if (session) {
    session.name = name;
    setActiveSession(session);
  }

  showToast('Profile settings saved');
  setupDashboardHeader(currentUser);
}

function exportUserJSON() {
  if (!currentUser) return;
  const exportPayload = {
    user: { id: currentUser.id, name: currentUser.name, email: currentUser.email },
    userData
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `pragati_backup_${currentUser.name.replace(/\s+/g,'_')}.json`);
  dlAnchorElem.click();
  showToast('JSON Backup downloaded!');
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const sun = $('#theme-icon-sun');
  const moon = $('#theme-icon-moon');
  if (sun) sun.style.display = isDark ? 'block' : 'none';
  if (moon) moon.style.display = isDark ? 'none' : 'block';
}
