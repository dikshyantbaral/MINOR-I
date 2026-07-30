/* 
   DASHBOARD OVERVIEW MODULE
   */

function renderDashboard() {
  const subCount = $('#dash-subjects');
  const compCount = $('#dash-completed');
  const timeCount = $('#dash-study-time');

  if (subCount) subCount.textContent = userData.subjects.length;
  if (compCount) compCount.textContent = userData.tasks.filter(t => t.status === 'completed').length;
  
  const totalHours = userData.subjects.reduce((acc, s) => acc + (s.hours || 0), 0);
  if (timeCount) timeCount.textContent = totalHours + 'h';

  const taskList = $('#dash-task-list');
  if (taskList) {
    taskList.innerHTML = userData.tasks.slice(0, 4).map(t => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-primary);border-radius:10px">
        <span style="font-size:14px;font-weight:500">${t.title}</span>
        <span class="pill pill-primary" style="text-transform:capitalize">${t.status}</span>
      </div>
    `).join('') || '<p class="small-text">No active tasks</p>';
  }

  drawSubjectChart();
}

function drawSubjectChart() {
  const canvas = document.getElementById('chart-subjects');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr; canvas.height = 220 * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, 220);

  if (!userData.subjects.length) return;

  const barWidth = Math.min(40, (rect.width - 60) / userData.subjects.length);
  userData.subjects.forEach((s, i) => {
    const x = 40 + i * (barWidth + 20);
    const h = (s.progress / 100) * 140;
    const y = 180 - h;

    ctx.fillStyle = '#6D4CFF';
    ctx.fillRect(x, y, barWidth, h);

    ctx.fillStyle = '#888';
    ctx.font = '12px Inter';
    ctx.fillText(s.name.substring(0, 8), x, 200);
  });
}
