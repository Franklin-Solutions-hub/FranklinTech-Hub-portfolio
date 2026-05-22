// ===== EXPERIENCE PAGE =====
const ExperiencePage = (function(){
  function render(){
    const items = Store.get('experience',[]);
    let html = `<div class="items-header"><h2>Experience (${items.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="ExperiencePage.openForm()">+ Add Experience</button></div>`;
    if(items.length===0){
      html += `<div class="empty-state"><div class="empty-icon">💼</div><h3>No experience added</h3><p>Add your work history.</p></div>`;
    } else {
      items.forEach(e=>{
        html += `<div class="card" style="margin-bottom:16px">
          <div class="card-header">
            <div><strong style="font-size:1.05rem">${e.role}</strong><br><span style="color:var(--accent2);font-size:.88rem">${e.company}</span></div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="badge badge-blue">${e.period}</span>
              <button class="btn-icon" onclick="ExperiencePage.openForm('${e.id}')">✏️</button>
              <button class="btn-icon" onclick="ExperiencePage.remove('${e.id}')">🗑️</button>
            </div>
          </div>
          <div class="card-body">
            <p style="color:var(--muted);font-size:.9rem;margin-bottom:12px">${e.desc||''}</p>
            <div>${(e.techs||[]).map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
        </div>`;
      });
    }
    document.getElementById('page-experience').innerHTML = html;
  }

  function openForm(id){
    const items = Store.get('experience',[]);
    const e = id ? items.find(x=>x.id===id) : {role:'',company:'',period:'',desc:'',techs:[]};
    showModal(`
      <div class="modal-header"><h3>${id?'Edit':'Add'} Experience</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>Role / Title</label><input class="form-input" id="exRole" value="${e.role}"></div>
          <div class="form-group"><label>Company</label><input class="form-input" id="exComp" value="${e.company}"></div>
        </div>
        <div class="form-group"><label>Period</label><input class="form-input" id="exPeriod" value="${e.period}" placeholder="e.g. 2023 – Present"></div>
        <div class="form-group"><label>Description</label><textarea class="form-input" id="exDesc">${e.desc||''}</textarea></div>
        <div class="form-group"><label>Technologies (comma separated)</label><input class="form-input" id="exTechs" value="${(e.techs||[]).join(', ')}"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="ExperiencePage.save('${e.id||''}')">Save</button>
      </div>`);
  }

  function save(id){
    const items = Store.get('experience',[]);
    const data = {
      role:document.getElementById('exRole').value, company:document.getElementById('exComp').value,
      period:document.getElementById('exPeriod').value, desc:document.getElementById('exDesc').value,
      techs:document.getElementById('exTechs').value.split(',').map(t=>t.trim()).filter(Boolean)
    };
    if(!data.role){ showToast('Role is required','error'); return; }
    if(id){ const i=items.findIndex(x=>x.id===id); if(i>-1) items[i]={...items[i],...data}; }
    else { data.id=genId(); items.unshift(data); }
    Store.set('experience',items); closeModal(); render();
    showToast(id?'Experience updated!':'Experience added!');
    AdminAuth.addActivity((id?'Updated':'Added')+' experience: '+data.role);
  }

  function remove(id){
    if(!confirm('Delete this entry?')) return;
    Store.set('experience', Store.get('experience',[]).filter(e=>e.id!==id)); render();
    showToast('Entry deleted','info');
  }

  return { render, openForm, save, remove };
})();
