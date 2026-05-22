// ===== APP CONTROLLER =====
const Store = {
  get(key, def=null){ try{return JSON.parse(localStorage.getItem('ft_'+key))||def}catch(e){return def} },
  set(key, val){ localStorage.setItem('ft_'+key, JSON.stringify(val)) },
  remove(key){ localStorage.removeItem('ft_'+key) }
};

const App = (function(){
  let currentPage = 'dashboard';

  function init(){
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

// ===== SEED DATA =====
(function seedData(){
  if(!Store.get('seeded')){
    Store.set('projects',[
      {id:genId(),title:'ADEOTABLS Dashboard',desc:'Admin dashboard for managing tables and data with modern UI.',category:'Web App',techs:['React','Node.js','MongoDB'],status:'published',featured:true,github:'#',demo:'#',date:'2024-01-15'},
      {id:genId(),title:'Portfolio Website',desc:'Personal portfolio with dark mode, animations, and responsive design.',category:'Website',techs:['HTML','CSS','JavaScript'],status:'published',featured:true,github:'#',demo:'#',date:'2024-03-20'},
      {id:genId(),title:'E-Commerce Platform',desc:'Full-featured online store with payment integration and admin panel.',category:'Web App',techs:['PHP','MySQL','Bootstrap'],status:'draft',featured:false,github:'#',demo:'#',date:'2024-06-10'}
    ]);
    Store.set('skills',[
      {id:genId(),name:'HTML & CSS',pct:90,category:'Frontend'},
      {id:genId(),name:'JavaScript',pct:78,category:'Frontend'},
      {id:genId(),name:'React',pct:70,category:'Frontend'},
      {id:genId(),name:'Node.js',pct:72,category:'Backend'},
      {id:genId(),name:'PHP',pct:65,category:'Backend'},
      {id:genId(),name:'MySQL',pct:80,category:'Backend'},
      {id:genId(),name:'Troubleshooting',pct:92,category:'IT Support'},
      {id:genId(),name:'Networking',pct:80,category:'IT Support'}
    ]);
    Store.set('experience',[
      {id:genId(),role:'IT Support Intern',company:'Kings University College',period:'2023 – 2024',desc:'Provided first-line technical support. Managed network infrastructure.',techs:['Windows Server','Networking','Hardware']},
      {id:genId(),role:'Freelance Web Developer',company:'Self-Employed',period:'2022 – Present',desc:'Built websites and web applications for local businesses.',techs:['React','Node.js','WordPress']}
    ]);
    Store.set('services',[
      {id:genId(),title:'Web Development',desc:'Custom websites and web applications built with modern technologies.',icon:'🌐',price:'From $500'},
      {id:genId(),title:'IT Support',desc:'Technical troubleshooting, system setup, and maintenance.',icon:'🔧',price:'From $50/hr'},
      {id:genId(),title:'Digital Marketing',desc:'SEO, social media management, and online advertising campaigns.',icon:'📣',price:'From $300/mo'}
    ]);
    Store.set('testimonials',[
      {id:genId(),name:'John Mensah',role:'CEO, TechGh',text:'Franklin built an amazing website for our company. Highly professional!',rating:5,approved:true},
      {id:genId(),name:'Ama Serwaa',role:'Marketing Director',text:'Great digital marketing skills. Our online presence improved significantly.',rating:4,approved:true}
    ]);
    Store.set('messages',[
      {id:genId(),sender:'James Owusu',email:'james@example.com',subject:'Project Inquiry',body:'Hi Franklin, I need a website for my business. Can we discuss?',time:new Date(Date.now()-3600000).toISOString(),read:false},
      {id:genId(),sender:'Sarah Addo',email:'sarah@example.com',subject:'Collaboration',body:'I saw your portfolio and would love to collaborate on a project.',time:new Date(Date.now()-86400000).toISOString(),read:true}
    ]);
    Store.set('hero',{
      title:'Franklin',subtitle:'Agamah',subtitle2:'Tornyeli',
      roles:['Software Developer','IT Specialist','Digital Marketer','Problem Solver'],
      bio:'Computer Science graduate passionate about building innovative digital solutions.',
      stats:[{label:'Years Exp',value:3},{label:'Projects',value:12},{label:'Clients',value:20}]
    });
    Store.set('social',{github:'#',linkedin:'#',whatsapp:'#',twitter:'#',email:'franklinagamah@gmail.com',youtube:''});
    Store.set('seo',{title:'Franklin Agamah Tornyeli | Software Developer',description:'Professional portfolio of Franklin Agamah Tornyeli.',keywords:'software developer, IT support, Ghana, portfolio'});
    Store.set('blog',[
      {id:genId(),title:'Getting Started with React',content:'React is a powerful JavaScript library for building user interfaces...',category:'Technology',status:'published',date:'2024-05-10',tags:['react','javascript','frontend']},
    ]);
    Store.set('seeded',true);
  }
})();
