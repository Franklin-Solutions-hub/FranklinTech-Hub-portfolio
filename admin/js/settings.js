// ===== SETTINGS PAGE (handles seo, appearance, social, settings) =====
const SettingsPage = (function(){
  function render(page){
    const el = document.getElementById('page-'+page);
    switch(page){
      case 'seo': el.innerHTML = renderSEO(); break;
      case 'appearance': el.innerHTML = renderAppearance(); break;
      case 'social': el.innerHTML = renderSocial(); break;
      case 'settings': el.innerHTML = renderGeneral(); break;
    }
  }

  function renderSEO(){
    const seo = Store.get('seo',{});
    return `<div class="page-header"><h1>SEO Settings</h1><p>Optimize your portfolio for search engines.</p></div>
      <div class="card"><div class="card-body">
        <div class="form-group"><label>Meta Title</label><input class="form-input" id="seoTitle" value="${seo.title||''}"><small style="color:var(--muted)">Recommended: 50-60 characters</small></div>
        <div class="form-group"><label>Meta Description</label><textarea class="form-input" id="seoDesc">${seo.description||''}</textarea><small style="color:var(--muted)">Recommended: 150-160 characters</small></div>
        <div class="form-group"><label>Keywords (comma separated)</label><input class="form-input" id="seoKeys" value="${seo.keywords||''}"></div>
        <div class="form-group"><label>Open Graph Title</label><input class="form-input" id="seoOG" value="${seo.ogTitle||seo.title||''}"></div>
        <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveSEO()">Save SEO Settings</button>
      </div></div>`;
  }

  function saveSEO(){
    Store.set('seo',{
      title:document.getElementById('seoTitle').value,
      description:document.getElementById('seoDesc').value,
      keywords:document.getElementById('seoKeys').value,
      ogTitle:document.getElementById('seoOG').value
    });
    showToast('SEO settings saved!');
    AdminAuth.addActivity('Updated SEO settings');
  }

  function renderAppearance(){
    const app = Store.get('appearance',{theme:'dark',accentColor:'#2563eb',font:'Inter'});
    const colors = ['#2563eb','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#06b6d4','#6366f1'];
    return `<div class="page-header"><h1>Appearance</h1><p>Customize how your portfolio looks.</p></div>
      <div class="grid-2">
        <div class="card"><div class="card-header"><span class="card-title">Theme</span></div><div class="card-body">
          <div class="form-group"><label>Color Mode</label>
            <select class="form-input" id="appTheme">
              <option value="dark" ${app.theme==='dark'?'selected':''}>Dark Mode</option>
              <option value="light" ${app.theme==='light'?'selected':''}>Light Mode</option>
            </select></div>
          <div class="form-group"><label>Accent Color</label>
            <div class="color-grid">${colors.map(c=>`<div class="color-option ${app.accentColor===c?'active':''}" style="background:${c}" onclick="this.parentElement.querySelectorAll('.color-option').forEach(e=>e.classList.remove('active'));this.classList.add('active');document.getElementById('appAccent').value='${c}'"></div>`).join('')}
            </div>
            <input type="hidden" id="appAccent" value="${app.accentColor}">
          </div>
          <div class="form-group"><label>Font Family</label>
            <select class="form-input" id="appFont">
              <option ${app.font==='Inter'?'selected':''}>Inter</option>
              <option ${app.font==='DM Sans'?'selected':''}>DM Sans</option>
              <option ${app.font==='Roboto'?'selected':''}>Roboto</option>
              <option ${app.font==='Outfit'?'selected':''}>Outfit</option>
            </select></div>
          <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveAppearance()">Save Appearance</button>
        </div></div>
        <div class="card"><div class="card-header"><span class="card-title">Section Visibility</span></div><div class="card-body">
          ${['Hero','About','Skills','Experience','Projects','Services','Testimonials','Contact'].map(s=>{
            const key = 'show_'+s.toLowerCase();
            const val = app[key] !== false;
            return `<div class="form-group"><label class="form-switch"><input type="checkbox" id="${key}" ${val?'checked':''}><span class="slider"></span><span style="margin-left:8px">${s} Section</span></label></div>`;
          }).join('')}
          <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveAppearance()">Save</button>
        </div></div>
      </div>`;
  }

  function saveAppearance(){
    const app = {
      theme: document.getElementById('appTheme').value,
      accentColor: document.getElementById('appAccent').value,
      font: document.getElementById('appFont').value
    };
    ['hero','about','skills','experience','projects','services','testimonials','contact'].forEach(s=>{
      const el = document.getElementById('show_'+s);
      if(el) app['show_'+s] = el.checked;
    });
    Store.set('appearance',app);
    showToast('Appearance saved!');
    AdminAuth.addActivity('Updated appearance settings');
  }

  function renderSocial(){
    const social = Store.get('social',{});
    return `<div class="page-header"><h1>Contact & Social</h1><p>Manage your contact details and social links.</p></div>
      <div class="card"><div class="card-body">
        <h4 style="margin-bottom:15px;font-size:.95rem">Contact Information</h4>
        <div class="form-row">
          <div class="form-group"><label>📞 Phone Number</label><input class="form-input" id="socPhone" value="${social.phone||''}" placeholder="+233 XX XXX XXXX"></div>
          <div class="form-group"><label>📍 Location</label><input class="form-input" id="socLocation" value="${social.location||''}" placeholder="Accra, Greater Accra, Ghana"></div>
        </div>
        <hr style="border:none;border-top:1px solid var(--border);margin:20px 0">
        <h4 style="margin-bottom:15px;font-size:.95rem">Social Links</h4>
        <div class="form-row">
          <div class="form-group"><label>💻 GitHub</label><input class="form-input" id="socGithub" value="${social.github||''}"></div>
          <div class="form-group"><label>💼 LinkedIn</label><input class="form-input" id="socLinkedin" value="${social.linkedin||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>📱 WhatsApp</label><input class="form-input" id="socWhatsapp" value="${social.whatsapp||''}"></div>
          <div class="form-group"><label>🐦 Twitter/X</label><input class="form-input" id="socTwitter" value="${social.twitter||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>📧 Email</label><input class="form-input" id="socEmail" value="${social.email||''}"></div>
          <div class="form-group"><label>🎥 YouTube</label><input class="form-input" id="socYoutube" value="${social.youtube||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>🎵 TikTok</label><input class="form-input" id="socTiktok" value="${social.tiktok||''}"></div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveSocial()">Save Details</button>
      </div></div>`;
  }

  function saveSocial(){
    Store.set('social',{
      phone:document.getElementById('socPhone').value,
      location:document.getElementById('socLocation').value,
      github:document.getElementById('socGithub').value, linkedin:document.getElementById('socLinkedin').value,
      whatsapp:document.getElementById('socWhatsapp').value, twitter:document.getElementById('socTwitter').value,
      email:document.getElementById('socEmail').value, youtube:document.getElementById('socYoutube').value,
      tiktok:document.getElementById('socTiktok').value
    });
    showToast('Contact and Social details saved!');
    AdminAuth.addActivity('Updated contact & social details');
  }

  function renderGeneral(){
    const history = AdminAuth.getLoginHistory().slice(0,10);
    const activity = AdminAuth.getActivity().slice(0,15);
    return `<div class="page-header"><h1>Settings</h1><p>General settings, security, and data management.</p></div>
      <div class="grid-2">
        <div class="card"><div class="card-header"><span class="card-title">🔒 Security</span></div><div class="card-body">
          <h4 style="margin-bottom:12px;font-size:.95rem">Login History</h4>
          ${history.length?history.map(h=>`<div class="activity-item"><div class="activity-dot" style="background:var(--green)"></div>
            <div class="activity-content"><p style="font-size:.85rem">${h.email}</p><div class="time">${timeAgo(h.time)}<br><small>${h.device}</small></div></div></div>`).join('')
            :'<p style="color:var(--muted)">No login history</p>'}
        </div></div>
        <div class="card"><div class="card-header"><span class="card-title">📋 Activity Log</span></div><div class="card-body">
          ${activity.length?activity.map(a=>`<div class="activity-item"><div class="activity-dot" style="background:var(--accent)"></div>
            <div class="activity-content"><p style="font-size:.85rem">${a.action}</p><div class="time">${timeAgo(a.time)}</div></div></div>`).join('')
            :'<p style="color:var(--muted)">No activity</p>'}
        </div></div>
      </div>
      <div class="card" style="margin-top:20px"><div class="card-header"><span class="card-title">💾 Data Management</span></div><div class="card-body">
        <p style="color:var(--muted);margin-bottom:16px;font-size:.9rem">Export all your dashboard data as JSON backup, or import a previous backup.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="SettingsPage.exportData()">📥 Export All Data</button>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('importInput').click()">📤 Import Data</button>
          <button class="btn btn-danger btn-sm" onclick="SettingsPage.resetData()">🗑️ Reset All Data</button>
          <input type="file" id="importInput" style="display:none" accept=".json" onchange="SettingsPage.importData(this.files[0])">
        </div>
      </div></div>`;
  }

  function exportData(){
    const data = {};
    ['projects','blog','skills','experience','services','testimonials','messages','hero','social','seo','appearance','about','media'].forEach(k=>{
      data[k] = Store.get(k);
    });
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'franklin_dashboard_backup_'+new Date().toISOString().split('T')[0]+'.json';
    a.click();
    showToast('Data exported!');
  }

  function importData(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      try{
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(k=>Store.set(k,data[k]));
        showToast('Data imported successfully!');
        AdminAuth.addActivity('Imported data backup');
        setTimeout(()=>location.reload(),1000);
      }catch(err){ showToast('Invalid JSON file','error'); }
    };
    reader.readAsText(file);
  }

  function resetData(){
    if(!confirm('WARNING: This will delete ALL dashboard data. Are you sure?')) return;
    if(!confirm('This action cannot be undone. Proceed?')) return;
    const keys = ['projects','blog','skills','experience','services','testimonials','messages','hero','social','seo','appearance','about','media','seeded'];
    keys.forEach(k=>Store.remove(k));
    showToast('All data reset!','info');
    setTimeout(()=>location.reload(),1000);
  }

  return { render, saveSEO, saveAppearance, saveSocial, exportData, importData, resetData };
})();
