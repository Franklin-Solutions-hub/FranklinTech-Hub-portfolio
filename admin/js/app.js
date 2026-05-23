// ===== APP CONTROLLER (Supabase-backed) =====

// localStorage cache for instant UI while Supabase syncs
const Cache = {
  get(key, def=null){ try{return JSON.parse(localStorage.getItem('ft_'+key))||def}catch(e){return def} },
  set(key, val){ localStorage.setItem('ft_'+key, JSON.stringify(val)) },
  remove(key){ localStorage.removeItem('ft_'+key) }
};

// ===== SUPABASE-BACKED STORE =====
const Store = {
  // Column mapping from old localStorage field names to Supabase column names
  _fieldMap: {
    projects: { desc:'description', github:'github_url', demo:'demo_url' },
    blog: { /* tags and content map 1:1 */ },
    skills: { pct:'proficiency' },
    experience: { desc:'description' },
    services: { desc:'description' },
    testimonials: { /* all 1:1 */ },
    messages: { read:'is_read' },
    media: { /* all 1:1 */ }
  },

  // Reverse mapping (Supabase column → app field)
  _reverseFieldMap: {
    projects: { description:'desc', github_url:'github', demo_url:'demo' },
    blog: {},
    skills: { proficiency:'pct' },
    experience: { description:'desc' },
    services: { description:'desc' },
    testimonials: {},
    messages: { is_read:'read' },
    media: {}
  },

  // Convert app object → Supabase row
  _toRow(key, obj) {
    const map = this._fieldMap[key] || {};
    const row = {};
    for (const [k, v] of Object.entries(obj)) {
      row[map[k] || k] = v;
    }
    return row;
  },

  // Convert Supabase row → app object
  _fromRow(key, row) {
    const map = this._reverseFieldMap[key] || {};
    const obj = {};
    for (const [k, v] of Object.entries(row)) {
      obj[map[k] || k] = v;
    }
    return obj;
  },

  // GET data — returns from cache instantly, fetches from Supabase in background
  get(key, def=null) {
    return Cache.get(key, def);
  },

  // SET data — writes to cache instantly, syncs to Supabase
  set(key, val) {
    Cache.set(key, val);
    // Fire-and-forget sync to Supabase
    this._syncToSupabase(key, val);
  },

  remove(key) {
    Cache.remove(key);
  },

  // Async get from Supabase (for fresh data)
  async fetchFromSupabase(key) {
    if (SETTINGS_KEYS.includes(key)) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();
      if (error || !data) return null;
      const val = data.value;
      Cache.set(key, val);
      return val;
    }

    const table = TABLE_MAP[key];
    if (!table) return null;

    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) { console.error('Supabase fetch error:', error); return null; }

    const mapped = data.map(row => this._fromRow(key, row));
    Cache.set(key, mapped);
    return mapped;
  },

  // Sync data to Supabase
  async _syncToSupabase(key, val) {
    try {
      if (SETTINGS_KEYS.includes(key)) {
        await supabase
          .from('site_settings')
          .upsert({ key: key, value: val, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        return;
      }

      // For array-based tables, we don't do full-table sync on every set
      // Individual CRUD operations handle their own Supabase calls
    } catch (e) {
      console.error('Supabase sync error:', e);
    }
  },

  // ===== CRUD helpers for array-based tables =====

  async insert(key, item) {
    const table = TABLE_MAP[key];
    if (!table) return null;
    const row = this._toRow(key, item);
    // Remove the client-generated id, let Supabase generate UUID
    delete row.id;
    delete row.created_at;
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (error) { console.error('Insert error:', error); return null; }
    const mapped = this._fromRow(key, data);
    // Update local cache
    const cached = Cache.get(key, []);
    cached.unshift(mapped);
    Cache.set(key, cached);
    return mapped;
  },

  async update(key, id, updates) {
    const table = TABLE_MAP[key];
    if (!table) return null;
    const row = this._toRow(key, updates);
    delete row.id;
    delete row.created_at;
    const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single();
    if (error) { console.error('Update error:', error); return null; }
    const mapped = this._fromRow(key, data);
    // Update local cache
    const cached = Cache.get(key, []);
    const idx = cached.findIndex(x => x.id === id);
    if (idx > -1) cached[idx] = mapped;
    Cache.set(key, cached);
    return mapped;
  },

  async deleteItem(key, id) {
    const table = TABLE_MAP[key];
    if (!table) return false;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { console.error('Delete error:', error); return false; }
    // Update local cache
    const cached = Cache.get(key, []).filter(x => x.id !== id);
    Cache.set(key, cached);
    return true;
  }
};

// ===== INITIAL DATA LOAD FROM SUPABASE =====
async function loadAllData() {
  const keys = [...Object.keys(TABLE_MAP), ...SETTINGS_KEYS];
  await Promise.all(keys.map(key => Store.fetchFromSupabase(key)));
}

const App = (function(){
  let currentPage = 'dashboard';

  async function init(){
    // Load data from Supabase in background, then re-render current page
    loadAllData().then(() => {
      loadPage(currentPage);
      updateMsgBadge();
    });

    setupSidebar();
    setupLogout();
    setupMobile();
    navigateTo('dashboard');
    updateMsgBadge();
  }

  function setupSidebar(){
    document.querySelectorAll('.nav-item[data-page]').forEach(item=>{
      item.addEventListener('click',()=>{
        navigateTo(item.dataset.page);
        if(window.innerWidth<=1024) closeMobile();
      });
    });
    document.getElementById('sidebarToggle').addEventListener('click',()=>{
      if(window.innerWidth<=1024){
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('mobileOverlay').classList.toggle('show');
      } else {
        document.getElementById('sidebar').classList.toggle('collapsed');
      }
    });
  }

  function setupMobile(){
    document.getElementById('mobileOverlay').addEventListener('click', closeMobile);
  }

  function closeMobile(){
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('show');
  }

  function setupLogout(){
    document.getElementById('logoutBtn').addEventListener('click',()=>AdminAuth.logout());
  }

  const pageTitles = {
    dashboard:'Dashboard', hero:'Hero Section', about:'About Section', projects:'Projects',
    blog:'Blog Posts', skills:'Skills', experience:'Experience', services:'Services',
    testimonials:'Testimonials', messages:'Messages', media:'Media Library',
    seo:'SEO Settings', appearance:'Appearance', social:'Social Media', settings:'Settings'
  };

  function navigateTo(page){
    currentPage = page;
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    const el = document.getElementById('page-'+page);
    if(el) el.classList.add('active');
    const nav = document.querySelector(`[data-page="${page}"]`);
    if(nav) nav.classList.add('active');
    document.getElementById('pageTitle').textContent = pageTitles[page]||page;
    loadPage(page);
  }

  function loadPage(page){
    switch(page){
      case 'dashboard': DashboardPage.render(); break;
      case 'projects': ProjectsPage.render(); break;
      case 'blog': BlogPage.render(); break;
      case 'hero': HeroPage.render(); break;
      case 'skills': SkillsPage.render(); break;
      case 'experience': ExperiencePage.render(); break;
      case 'services': ServicesPage.render(); break;
      case 'testimonials': TestimonialsPage.render(); break;
      case 'messages': MessagesPage.render(); break;
      case 'media': MediaPage.render(); break;
      case 'seo': case 'appearance': case 'social': case 'settings':
        SettingsPage.render(page); break;
      case 'about': HeroPage.renderAbout(); break;
    }
  }

  function updateMsgBadge(){
    const msgs = Store.get('messages',[]);
    const unread = msgs.filter(m=>!m.read).length;
    const badge = document.getElementById('msgBadge');
    if(unread>0){ badge.style.display='inline'; badge.textContent=unread; }
    else { badge.style.display='none'; }
  }

  return { init, navigateTo, updateMsgBadge };
})();

// ===== TOAST SYSTEM =====
function showToast(msg, type='success'){
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  const icons = {success:'✅', error:'❌', info:'ℹ️'};
  t.className = 'toast '+type;
  t.innerHTML = `<span>${icons[type]||''}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),300); },3000);
}

// ===== MODAL SYSTEM =====
function showModal(html){
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('show');
}
document.addEventListener('click',e=>{
  if(e.target.id==='modalOverlay') closeModal();
});

// ===== ANIMATED COUNTER =====
function animateCounter(el, target){
  let current=0;
  const step = Math.max(1, Math.ceil(target/40));
  const timer = setInterval(()=>{
    current+=step;
    if(current>=target){ current=target; clearInterval(timer); }
    el.textContent=current.toLocaleString();
  },30);
}

// ===== GENERATE ID =====
function genId(){ return Date.now().toString(36)+Math.random().toString(36).substr(2,5); }

// ===== TIME AGO =====
function timeAgo(dateStr){
  const diff = Date.now() - new Date(dateStr).getTime();
  const m=Math.floor(diff/60000), h=Math.floor(diff/3600000), d=Math.floor(diff/86400000);
  if(m<1) return 'Just now';
  if(m<60) return m+'m ago';
  if(h<24) return h+'h ago';
  return d+'d ago';
}
