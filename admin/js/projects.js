// ===== PROJECTS PAGE =====
const ProjectsPage = (function(){
  function render(){
    const projects = Store.get('projects',[]);
    let html = `<div class="items-header"><h2>Projects (${projects.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="ProjectsPage.openForm()">+ New Project</button></div>`;
    if(projects.length===0){
      html += `<div class="empty-state"><div class="empty-icon">🚀</div><h3>No projects yet</h3><p>Create your first project to showcase your work.</p>
        <button class="btn btn-primary btn-sm" onclick="ProjectsPage.openForm()">+ Add Project</button></div>`;
    } else {
      html += `<div class="items-grid">`;
      projects.forEach(p=>{
        const statusClass = p.status==='published'?'badge-green':'badge-orange';
        html += `<div class="item-card">
          <div class="item-card-img">${p.featured?'⭐':'🚀'}</div>
          <div class="item-card-body">
            <h3>${p.title}</h3><p>${p.desc||''}</p>
            <div>${(p.techs||[]).map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
          <div class="item-card-footer">
            <span class="badge ${statusClass}">${p.status||'draft'}</span>
            <div class="item-actions">
              <button class="btn-icon" onclick="ProjectsPage.openForm('${p.id}')" title="Edit">✏️</button>
              <button class="btn-icon" onclick="ProjectsPage.remove('${p.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    }
    document.getElementById('page-projects').innerHTML = html;
  }

  function openForm(id){
    const projects = Store.get('projects',[]);
    const p = id ? projects.find(x=>x.id===id) : {id:'',title:'',desc:'',category:'',techs:[],status:'draft',featured:false,github:'',demo:''};
    const isEdit = !!id;
    showModal(`
      <div class="modal-header"><h3>${isEdit?'Edit':'New'} Project</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label>Title</label><input class="form-input" id="pTitle" value="${p.title}" placeholder="Project title"></div>
        <div class="form-group"><label>Description</label><textarea class="form-input" id="pDesc" placeholder="Describe your project...">${p.desc||''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><input class="form-input" id="pCat" value="${p.category||''}" placeholder="e.g. Web App"></div>
          <div class="form-group"><label>Status</label><select class="form-input" id="pStatus">
            <option value="draft" ${p.status==='draft'?'selected':''}>Draft</option>
            <option value="published" ${p.status==='published'?'selected':''}>Published</option>
          </select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>GitHub URL</label><input class="form-input" id="pGit" value="${p.github||''}" placeholder="https://github.com/..."></div>
          <div class="form-group"><label>Live Demo URL</label><input class="form-input" id="pDemo" value="${p.demo||''}" placeholder="https://..."></div>
        </div>
        <div class="form-group"><label>Technologies (comma separated)</label><input class="form-input" id="pTechs" value="${(p.techs||[]).join(', ')}" placeholder="React, Node.js, MongoDB"></div>
        <div class="form-group"><label class="form-switch"><input type="checkbox" id="pFeatured" ${p.featured?'checked':''}><span class="slider"></span><span style="margin-left:8px">Featured Project</span></label></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="ProjectsPage.save('${p.id||''}')">Save Project</button>
      </div>
    `);
  }

  function save(id){
    const projects = Store.get('projects',[]);
    const data = {
      title: document.getElementById('pTitle').value,
      desc: document.getElementById('pDesc').value,
      category: document.getElementById('pCat').value,
      status: document.getElementById('pStatus').value,
      github: document.getElementById('pGit').value,
      demo: document.getElementById('pDemo').value,
      techs: document.getElementById('pTechs').value.split(',').map(t=>t.trim()).filter(Boolean),
      featured: document.getElementById('pFeatured').checked,
      date: new Date().toISOString().split('T')[0]
    };
    if(!data.title){ showToast('Title is required','error'); return; }
    if(id){ const i=projects.findIndex(x=>x.id===id); if(i>-1){projects[i]={...projects[i],...data};} }
    else { data.id=genId(); projects.unshift(data); }
    Store.set('projects',projects);
    closeModal(); render();
    showToast(id?'Project updated!':'Project created!');
    AdminAuth.addActivity((id?'Updated':'Created')+' project: '+data.title);
  }

  function remove(id){
    if(!confirm('Delete this project?')) return;
    const projects = Store.get('projects',[]).filter(p=>p.id!==id);
    Store.set('projects',projects); render();
    showToast('Project deleted','info');
    AdminAuth.addActivity('Deleted a project');
  }

  return { render, openForm, save, remove };
})();
