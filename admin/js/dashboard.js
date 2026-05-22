// ===== DASHBOARD OVERVIEW =====
const DashboardPage = (function(){
  function render(){
    const projects = Store.get('projects',[]);
    const msgs = Store.get('messages',[]);
    const blog = Store.get('blog',[]);
    const skills = Store.get('skills',[]);
    const services = Store.get('services',[]);
    const testimonials = Store.get('testimonials',[]);
    const activity = AdminAuth.getActivity().slice(0,8);

    const stats = [
      {icon:'👁️',label:'Total Visitors',value:1247,change:'+12%',up:true,bg:'rgba(37,99,235,.15)'},
      {icon:'🚀',label:'Projects',value:projects.length,change:'+2',up:true,bg:'rgba(16,185,129,.15)'},
      {icon:'✉️',label:'Messages',value:msgs.length,change:msgs.filter(m=>!m.read).length+' new',up:true,bg:'rgba(139,92,246,.15)'},
      {icon:'📝',label:'Blog Posts',value:blog.length,change:'+1',up:true,bg:'rgba(245,158,11,.15)'},
      {icon:'🛠️',label:'Services',value:services.length,change:'',up:true,bg:'rgba(236,72,153,.15)'},
      {icon:'⭐',label:'Testimonials',value:testimonials.length,change:'',up:true,bg:'rgba(6,182,212,.15)'},
      {icon:'⚡',label:'Skills',value:skills.length,change:'',up:true,bg:'rgba(99,102,241,.15)'},
      {icon:'📈',label:'Engagement',value:89,change:'+5%',up:true,bg:'rgba(20,184,166,.15)'}
    ];

    const chartData = [35,55,40,70,60,85,75,90,65,80,95,70];
    const chartLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const maxChart = Math.max(...chartData);

    let html = `<div class="page-header"><h1>Welcome back, Franklin! 👋</h1><p>Here's what's happening with your portfolio today.</p></div>`;

    // Stats
    html += `<div class="stats-grid">`;
    stats.forEach((s,i)=>{
      html += `<div class="stat-card">
        <div class="stat-icon" style="background:${s.bg}">${s.icon}</div>
        <div class="stat-value counter" data-target="${s.value}">0</div>
        <div class="stat-label">${s.label}</div>
        ${s.change?`<span class="stat-change ${s.up?'up':'down'}">${s.up?'↑':'↓'} ${s.change}</span>`:''}
      </div>`;
    });
    html += `</div>`;

    // Charts & Activity row
    html += `<div class="grid-2" style="margin-bottom:28px">`;

    // Chart
    html += `<div class="card"><div class="card-header"><span class="card-title">Website Traffic</span>
      <span class="badge badge-blue">2024</span></div><div class="card-body">
      <div class="chart-container">`;
    chartData.forEach((v,i)=>{
      html += `<div class="chart-bar" style="height:${(v/maxChart)*100}%"><div class="chart-tooltip">${v} visits</div></div>`;
    });
    html += `</div><div class="chart-labels">`;
    chartLabels.forEach(l=>html+=`<span>${l}</span>`);
    html += `</div></div></div>`;

    // Activity
    html += `<div class="card"><div class="card-header"><span class="card-title">Recent Activity</span></div><div class="card-body">`;
    if(activity.length===0){
      html += `<p style="color:var(--muted);font-size:.9rem">No activity yet.</p>`;
    } else {
      activity.forEach(a=>{
        html += `<div class="activity-item">
          <div class="activity-dot" style="background:var(--accent)"></div>
          <div class="activity-content"><p>${a.action}</p><div class="time">${timeAgo(a.time)}</div></div>
        </div>`;
      });
    }
    html += `</div></div></div>`;

    // Recent Projects
    html += `<div class="card"><div class="card-header"><span class="card-title">Recent Projects</span>
      <button class="btn btn-sm btn-outline" onclick="App.navigateTo('projects')">View All</button></div>
      <div class="card-body"><table class="data-table"><thead><tr><th>Project</th><th>Category</th><th>Status</th><th>Date</th></tr></thead><tbody>`;
    projects.slice(0,5).forEach(p=>{
      const statusClass = p.status==='published'?'badge-green':p.status==='draft'?'badge-orange':'badge-blue';
      html += `<tr><td><strong>${p.title}</strong></td><td>${p.category||'-'}</td>
        <td><span class="badge ${statusClass}">${p.status}</span></td><td>${p.date||'-'}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;

    document.getElementById('page-dashboard').innerHTML = html;

    // Animate counters
    document.querySelectorAll('.counter').forEach(el=>{
      animateCounter(el, parseInt(el.dataset.target));
    });
  }

  return { render };
})();
