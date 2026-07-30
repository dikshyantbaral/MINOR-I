/* 
   AUTHENTICATION & SESSION MODULE
   */

/* User Credentials Database (Stored in JSON format under 'sf_users_db') */
function getUsersDB() {
  return getJSONStore('sf_users_db', []);
}
function saveUsersDB(users) {
  setJSONStore('sf_users_db', users);
}

/* Active Session Handling (Stored in 'sf_session') */
function getActiveSession() {
  return getJSONStore('sf_session', null);
}
function setActiveSession(session) {
  setJSONStore('sf_session', session);
}

/* Auth Modal Logic */
function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  openModal('auth-modal');
}

function switchAuthTab(tab) {
  const loginTab = $('#tab-btn-login');
  const signupTab = $('#tab-btn-signup');
  const loginForm = $('#auth-login-form');
  const signupForm = $('#auth-signup-form');
  const title = $('#auth-modal-title');

  if (tab === 'login') {
    if (loginTab) loginTab.classList.add('active');
    if (signupTab) signupTab.classList.remove('active');
    if (loginForm) loginForm.style.display = 'flex';
    if (signupForm) signupForm.style.display = 'none';
    if (title) title.textContent = 'Sign In to Pragati';
  } else {
    if (signupTab) signupTab.classList.add('active');
    if (loginTab) loginTab.classList.remove('active');
    if (signupForm) signupForm.style.display = 'flex';
    if (loginForm) loginForm.style.display = 'none';
    if (title) title.textContent = 'Create Pragati Account';
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = $('#' + inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  btn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width:18px;height:18px"></i>`;
  lucide.createIcons({ nodes: [btn] });
}

/* Sign Up Handler */
function handleSignupSubmit(e) {
  e.preventDefault();
  const name = $('#signup-name').value.trim();
  const email = $('#signup-email').value.trim().toLowerCase();
  const password = $('#signup-password').value;
  const confirmPassword = $('#signup-confirm-password').value;

  if (!name || !email || !password) {
    showToast('Please fill in all required fields', 'warning');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  const db = getUsersDB();
  const existingUser = db.find(u => u.email === email);
  if (existingUser) {
    showToast('An account with this email already exists', 'error');
    return;
  }

  /* Create new user record in JSON database */
  const newUser = {
    id: genId(),
    name,
    email,
    password, // Stored in JSON
    createdAt: new Date().toISOString()
  };

  db.push(newUser);
  saveUsersDB(db);

  /* Set active session & redirect to dashboard.html */
  const session = { userId: newUser.id, email: newUser.email, name: newUser.name };
  setActiveSession(session);
  loadUserData(newUser.id);
  saveUserData();

  closeModal('auth-modal');
  showToast('Account created successfully! Redirecting...');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 500);
}

/* Log In Handler */
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = $('#login-email').value.trim().toLowerCase();
  const password = $('#login-password').value;

  const db = getUsersDB();
  const user = db.find(u => u.email === email);

  if (!user) {
    showToast('No account found with this email. Please Sign Up.', 'error');
    return;
  }
  if (user.password !== password) {
    showToast('Incorrect password. Please try again.', 'error');
    return;
  }

  /* Valid Login Credentials */
  const session = { userId: user.id, email: user.email, name: user.name };
  setActiveSession(session);

  closeModal('auth-modal');
  showToast(`Welcome back, ${user.name}!`);
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 500);
}

/* Logout Handler */
function handleLogout() {
  setActiveSession(null);
  currentUser = null;
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 400);
}

/* Session Validation for Landing / Dashboard */
function checkSessionOnPageLoad(isDashboardPage = false) {
  const session = getActiveSession();
  if (session && session.userId) {
    const db = getUsersDB();
    const user = db.find(u => u.id === session.userId);
    if (user) {
      currentUser = user;
      loadUserData(user.id);
      if (!isDashboardPage && window.location.pathname.endsWith('index.html')) {
        // Auto redirect to dashboard if logged in
        window.location.href = 'dashboard.html';
        return;
      }
      if (isDashboardPage) {
        setupDashboardHeader(user);
      }
      return;
    }
  }
  if (isDashboardPage) {
    // Redirect unauthenticated user back to index.html
    window.location.href = 'index.html';
  }
}

function setupDashboardHeader(user) {
  const avatarInitials = $('#topbar-avatar-initials');
  const userName = $('#topbar-user-name');
  const dropdownName = $('#dropdown-user-name');
  const dropdownEmail = $('#dropdown-user-email');
  const settingsName = $('#settings-name');
  const settingsEmail = $('#settings-email');

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  if (avatarInitials) avatarInitials.textContent = initials;
  if (userName) userName.textContent = user.name;
  if (dropdownName) dropdownName.textContent = user.name;
  if (dropdownEmail) dropdownEmail.textContent = user.email;
  if (settingsName) settingsName.value = user.name;
  if (settingsEmail) settingsEmail.value = user.email;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingText = $('#greeting-text');
  const greetingDate = $('#greeting-date');
  if (greetingText) greetingText.textContent = `${greeting}, ${user.name.split(' ')[0]}`;
  if (greetingDate) greetingDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
