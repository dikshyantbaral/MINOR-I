/* 
   NOTES EDITOR MODULE
    */

let currentNoteId = null;

function renderNotes() {
  const list = $('#notes-list');
  if (!list) return;
  list.innerHTML = userData.notes.map(n => `
    <div class="card" style="padding:16px;cursor:pointer" onclick="openNote('${n.id}')">
      <div style="font-weight:600;font-size:15px">${n.title || 'Untitled Note'}</div>
      <div class="small-text" style="margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${n.content}</div>
    </div>
  `).join('');
}

function createNewNote() {
  const note = { id: genId(), title: 'New Note', content: '' };
  userData.notes.unshift(note);
  saveUserData();
  openNote(note.id);
  renderNotes();
}

function openNote(id) {
  currentNoteId = id;
  const note = userData.notes.find(n => n.id === id);
  if (!note) return;
  const editor = $('#note-editor');
  const title = $('#note-editor-title');
  const content = $('#note-editor-content');
  if (editor) editor.classList.add('active');
  if (title) title.value = note.title;
  if (content) content.value = note.content;
}

function autoSaveNote() {
  if (!currentNoteId) return;
  const note = userData.notes.find(n => n.id === currentNoteId);
  if (note) {
    const title = $('#note-editor-title');
    const content = $('#note-editor-content');
    if (title) note.title = title.value;
    if (content) note.content = content.value;
    saveUserData();
    renderNotes();
  }
}
