// ===== SKILLS PAGE =====
const SkillsPage = (function(){
  function render(){
    const skills = Store.get('skills',[]);
    const cats = [...new Set(skills.map(s=>s.category))];
    let html = `<div class="items-header"><h2>Skills (${skills.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="SkillsPage.openForm()">+ Add Skill</button></div>`;

    if(skills.length===0){
      html += `<div class="empty-state"><div class="empty-icon">⚡</div><h3>No skills added</h3><p>Add your technical skills.</p></div>`;
    } else {
      html += `<div class="items-grid">`;
      cats.forEach(cat=>{
        const catSkills = skills.filter(s=>s.category===cat);
        html += `<div class="card"><div class="card-header"><span class="card-title">${cat}</span>
          <span class="badge badge-blue">${catSkills.length}</span></div><div class="card-body">`;
        catSkills.forEach(s=>{
          html += `<div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:.85rem">
              <span>${s.name}</span>
              <span style="display:flex;gap:8px;align-items:center">${s.pct}%
                <button class="btn-icon" style="width:28px;height:28px;font-size:.8rem" onclick="SkillsPage.openForm('${s.id}')">✏️</button>
                <button class="btn-icon" style="width:28px;height:28px;font-size:.8rem" onclick="SkillsPage.remove('${s.id}')">🗑️</button>
              </span>
            </div>
            <div style="height:6px;background:var(--border);border-radius:50px;overflow:hidden">
              <div style="height:100%;width:${s.pct}%;background:linear-gradient(to right,var(--accent),var(--accent2));border-radius:50px;transition:width .8s"></div>
            </div>
          </div>`;
        });
        html += `</div></div>`;
      });
      html += `</div>`;
    }
    document.getElementById('page-skills').innerHTML = html;
  }

  function openForm(id){
    const skills = Store.get('skills',[]);
    const s = id ? skills.find(x=>x.id===id) : {name:'',pct:50,category:''};
    showModal(`
      <div class="modal-header"><h3>${id?'Edit':'Add'} Skill</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label>Skill Name</label><input class="form-input" id="skName" value="${s.name}"></div>
        <div class="form-group"><label>Category</label><input class="form-input" id="skCat" value="${s.category||''}" placeholder="e.g. Frontend, Backend"></div>
        <div class="form-group"><label>Proficiency: <span id="skPctVal">${s.pct}</span>%</label>
          <input type="range" class="skill-range" id="skPct" min="0" max="100" value="${s.pct}" oninput="document.getElementById('skPctVal').textContent=this.value">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="SkillsPage.save('${s.id||''}')">Save</button>
      </div>`);
  }

  function save(id){
    const skills = Store.get('skills',[]);
    const data = { name:document.getElementById('skName').value, pct:parseInt(document.getElementById('skPct').value), category:document.getElementById('skCat').value };
    if(!data.name){ showToast('Name is required','error'); return; }
    if(id){ const i=skills.findIndex(x=>x.id===id); if(i>-1) skills[i]={...skills[i],...data}; }
    else { data.id=genId(); skills.push(data); }
    Store.set('skills',skills); closeModal(); render();
    showToast(id?'Skill updated!':'Skill added!');
  }

  function remove(id){
    if(!confirm('Delete this skill?')) return;
    Store.set('skills', Store.get('skills',[]).filter(s=>s.id!==id)); render();
    showToast('Skill deleted','info');
  }

  return { render, openForm, save, remove };
})();
