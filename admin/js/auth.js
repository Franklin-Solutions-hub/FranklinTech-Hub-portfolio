// ===== AUTH MODULE =====
const AdminAuth = (function(){
  const CREDENTIALS = { email:'Franklintechhub', password:'Fragamah@12' };
  const SESSION_KEY = 'ft_admin_session';
  const HISTORY_KEY = 'ft_login_history';
  const ACTIVITY_KEY = 'ft_activity_log';

  function login(email, password){
    if(email === CREDENTIALS.email && password === CREDENTIALS.password){
      const session = {
        loggedIn: true,
        email: email,
        loginTime: new Date().toISOString(),
        expires: Date.now() + 24*60*60*1000
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      addLoginHistory(email);
      addActivity('Logged in successfully');
      return true;
    }
    addActivity('Failed login attempt for: ' + email);
    return false;
  }

  function logout(){
    addActivity('Logged out');
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  function isLoggedIn(){
    const s = localStorage.getItem(SESSION_KEY);
    if(!s) return false;
    const session = JSON.parse(s);
    if(Date.now() > session.expires){
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return session.loggedIn;
  }

  function getSession(){
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
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
