// ===== TESTIMONIALS PAGE (Supabase-backed) =====
const TestimonialsPage = (function(){
  function render(){
    const items = Store.get('testimonials',[]);
    let html = `<div class="items-header"><h2>Testimonials (${items.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="TestimonialsPage.openForm()">+ Add Testimonial</button></div>`;
    if(items.length===0){
      html += `<div class="empty-state"><div class="empty-icon">⭐</div><h3>No testimonials</h3><p>Add client reviews.</p></div>`;
    } else {
      html += `<div class="items-grid">`;
      items.forEach(t=>{
        const stars = '★'.repeat(t.rating)+'☆'.repeat(5-t.rating);
        html += `<div class="card">
          <div class="card-body">
            <div style="color:var(--orange);margin-bottom:12px;font-size:1.1rem">${stars}</div>
            <p style="color:var(--muted);font-style:italic;margin-bottom:16px;font-size:.92rem">"${t.text}"</p>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div><strong style="font-size:.9rem">${t.name}</strong><br><span style="color:var(--muted);font-size:.8rem">${t.role||''}</span></div>
              <div class="item-actions">
                <span class="badge ${t.approved?'badge-green':'badge-orange'}">${t.approved?'Approved':'Pending'}</span>
                <button class="btn-icon" onclick="TestimonialsPage.openForm('${t.id}')">✏️</button>
                <button class="btn-icon" onclick="TestimonialsPage.remove('${t.id}')">🗑️</button>
              </div>
            </div>
          </div></div>`;
      });
      html += `</div>`;
    }
    document.getElementById('page-testimonials').innerHTML = html;
  }

  function openForm(id){
    const items = Store.get('testimonials',[]);
    const t = id ? items.find(x=>x.id===id) : {name:'',role:'',text:'',rating:5,approved:false};
    showModal(`
      <div class="modal-header"><h3>${id?'Edit':'Add'} Testimonial</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>Client Name</label><input class="form-input" id="tName" value="${t.name}"></div>
          <div class="form-group"><label>Role / Company</label><input class="form-input" id="tRole" value="${t.role||''}"></div>
        </div>
        <div class="form-group"><label>Testimonial</label><textarea class="form-input" id="tText">${t.text||''}</textarea></div>
        <div class="form-group"><label>Rating</label>
          <select class="form-input" id="tRating">
            ${[5,4,3,2,1].map(n=>`<option value="${n}" ${t.rating===n?'selected':''}>${n} Star${n>1?'s':''}</option>`).join('')}
          </select></div>
        <div class="form-group"><label class="form-switch"><input type="checkbox" id="tApproved" ${t.approved?'checked':''}><span class="slider"></span><span style="margin-left:8px">Approved</span></label></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="TestimonialsPage.save('${t.id||''}')">Save</button>
      </div>`);
  }

  async function save(id){
    const data = { name:document.getElementById('tName').value, role:document.getElementById('tRole').value,
      text:document.getElementById('tText').value, rating:parseInt(document.getElementById('tRating').value),
      approved:document.getElementById('tApproved').checked };
    if(!data.name||!data.text){ showToast('Name and text required','error'); return; }

    if(id){
      await Store.update('testimonials', id, data);
      showToast('Testimonial updated!');
    } else {
      await Store.insert('testimonials', data);
      showToast('Testimonial added!');
    }
    closeModal();
    render();
  }

  async function remove(id){
    if(!confirm('Delete?')) return;
    await Store.deleteItem('testimonials', id);
    render();
    showToast('Deleted','info');
  }

  return { render, openForm, save, remove };
})();
