// ===== SERVICES PAGE (Supabase-backed) =====
const ServicesPage = (function(){
  function render(){
    const items = Store.get('services',[]);
    let html = `<div class="items-header"><h2>Services (${items.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="ServicesPage.openForm()">+ Add Service</button></div>`;
    if(items.length===0){
      html += `<div class="empty-state"><div class="empty-icon">🛠️</div><h3>No services yet</h3><p>Add the services you offer.</p></div>`;
    } else {
      html += `<div class="items-grid">`;
      items.forEach(s=>{
        const desc = s.desc || s.description || '';
        html += `<div class="item-card">
          <div class="item-card-img">${s.icon||'🛠️'}</div>
          <div class="item-card-body"><h3>${s.title}</h3><p>${desc}</p>
            ${s.price?`<span class="badge badge-green">${s.price}</span>`:''}</div>
          <div class="item-card-footer"><span></span>
            <div class="item-actions">
              <button class="btn-icon" onclick="ServicesPage.openForm('${s.id}')">✏️</button>
              <button class="btn-icon" onclick="ServicesPage.remove('${s.id}')">🗑️</button>
            </div>
          </div></div>`;
      });
      html += `</div>`;
    }
    document.getElementById('page-services').innerHTML = html;
  }

  function openForm(id){
    const items = Store.get('services',[]);
    const s = id ? items.find(x=>x.id===id) : {title:'',desc:'',icon:'🛠️',price:''};
    const desc = s.desc || s.description || '';
    showModal(`
      <div class="modal-header"><h3>${id?'Edit':'Add'} Service</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>Title</label><input class="form-input" id="svTitle" value="${s.title}"></div>
          <div class="form-group"><label>Icon (emoji)</label><input class="form-input" id="svIcon" value="${s.icon||''}"></div>
        </div>
        <div class="form-group"><label>Description</label><textarea class="form-input" id="svDesc">${desc}</textarea></div>
        <div class="form-group"><label>Pricing</label><input class="form-input" id="svPrice" value="${s.price||''}" placeholder="e.g. From $500"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="ServicesPage.save('${s.id||''}')">Save</button>
      </div>`);
  }

  async function save(id){
    const data = { title:document.getElementById('svTitle').value, desc:document.getElementById('svDesc').value,
      icon:document.getElementById('svIcon').value, price:document.getElementById('svPrice').value };
    if(!data.title){ showToast('Title required','error'); return; }

    if(id){
      await Store.update('services', id, data);
      showToast('Service updated!');
    } else {
      await Store.insert('services', data);
      showToast('Service added!');
    }
    closeModal();
    render();
  }

  async function remove(id){
    if(!confirm('Delete?')) return;
    await Store.deleteItem('services', id);
    render();
    showToast('Service deleted','info');
  }

  return { render, openForm, save, remove };
})();
