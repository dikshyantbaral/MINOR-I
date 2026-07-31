/* 
   POMODORO FOCUS TIMER MODULE
    */

let timerInterval = null;
let timerSeconds = 25 * 60;
let isTimerRunning = false;
let currentTimerMode = 'focus';

function getTimerSettings() {
  if (!userData.timerSettings) {
    userData.timerSettings = { focus: 25, short: 5 };
  }
  return userData.timerSettings;
}

function setTimerMode(mode) {
  if (isTimerRunning) {
    showToast('Please pause the timer before switching modes', 'warning');
    return;
  }
  currentTimerMode = mode;
  const settings = getTimerSettings();
  const mins = mode === 'focus' ? settings.focus : settings.short;
  timerSeconds = mins * 60;
  
  $$('.timer-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  const label = $('#timer-mode-label');
  if (label) label.textContent = mode === 'focus' ? 'Focus Session' : 'Short Break';
  
  const customInput = $('#timer-custom-minutes');
  if (customInput) customInput.value = mins;
  
  updateTimerDisplay();
}

function setCustomTimerMinutes(val) {
  if (isTimerRunning) {
    showToast('Please pause the timer before changing duration', 'warning');
    return;
  }
  let mins = parseInt(val) || 1;
  mins = Math.max(1, Math.min(180, mins));
  
  const settings = getTimerSettings();
  if (currentTimerMode === 'focus') {
    settings.focus = mins;
  } else {
    settings.short = mins;
  }
  saveUserData();
  
  const customInput = $('#timer-custom-minutes');
  if (customInput) customInput.value = mins;
  
  timerSeconds = mins * 60;
  updateTimerDisplay();
  showToast(`Timer duration set to ${mins} minutes`);
}

function adjustTimerMinutes(delta) {
  const customInput = $('#timer-custom-minutes');
  const currentVal = parseInt(customInput ? customInput.value : 25) || 25;
  setCustomTimerMinutes(currentVal + delta);
}

function toggleTimer() {
  const playText = $('#timer-play-text');
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (playText) playText.textContent = 'Start';
  } else {
    isTimerRunning = true;
    if (playText) playText.textContent = 'Pause';
    timerInterval = setInterval(() => {
      timerSeconds--;
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        showToast('Timer session finished!', 'success');
        if (playText) playText.textContent = 'Start';
      }
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  const settings = getTimerSettings();
  const mins = currentTimerMode === 'focus' ? settings.focus : settings.short;
  timerSeconds = mins * 60;
  const playText = $('#timer-play-text');
  if (playText) playText.textContent = 'Start';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const timerTime = $('#timer-time');
  if (timerTime) timerTime.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  
  /* Update SVG progress ring */
  const settings = getTimerSettings();
  const totalMins = currentTimerMode === 'focus' ? settings.focus : settings.short;
  const totalSecs = totalMins * 60;
  const progressRing = $('#timer-progress');
  if (progressRing && totalSecs > 0) {
    const circumference = 2 * Math.PI * 124; // 779.2
    const offset = circumference * (1 - (timerSeconds / totalSecs));
    progressRing.setAttribute('stroke-dashoffset', offset);
  }
}

function initTimerOnPageLoad() {
  const settings = getTimerSettings();
  const mins = settings.focus;
  timerSeconds = mins * 60;
  const customInput = $('#timer-custom-minutes');
  if (customInput) customInput.value = mins;
  updateTimerDisplay();
}
