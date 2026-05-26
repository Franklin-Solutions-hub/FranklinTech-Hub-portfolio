// ===== AUTH MODULE =====
const AdminAuth = (function(){
  const HISTORY_KEY = 'ft_login_history';
  const ACTIVITY_KEY = 'ft_activity_log';

  async function login(email, password){
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error("Login error:", error);
      addActivity('Failed login attempt for: ' + email);
      return false;
    }
    
    addLoginHistory(email);
    addActivity('Logged in successfully');
    return true;
  }

  async function logout(){
    addActivity('Logged out');
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  }

  async function isLoggedIn(){
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  async function getSession(){
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  function addLoginHistory(email){
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift({ email, time: new Date().toISOString(), device: navigator.userAgent.substring(0,60) });
    if(history.length > 50) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  function getLoginHistory(){
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  }

  function addActivity(action){
    const log = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    log.unshift({ action, time: new Date().toISOString() });
    if(log.length > 100) log.pop();
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
  }

  function getActivity(){
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
  }

  return { login, logout, isLoggedIn, getSession, getLoginHistory, addActivity, getActivity };
})();
