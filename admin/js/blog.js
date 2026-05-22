// ===== BLOG PAGE =====
const BlogPage = (function(){
  function render(){
    const posts = Store.get('blog',[]);
    let html = `<div class="items-header"><h2>Blog Posts (${posts.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="BlogPage.openForm()">+ New Post</button></div>`;
    if(posts.length===0){
      html += `<div class="empty-state"><div class="empty-icon">📝</div><h3>No blog posts yet</h3><p>Start writing to share your knowledge.</p>
        <button class="btn btn-primary btn-sm" onclick="BlogPage.openForm()">+ Write Post</button></div>`;
    } else {
      html += `<div class="card"><div class="card-body"><table class="data-table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>`;
      posts.forEach(p=>{
        const sc = p.status==='published'?'badge-green':'badge-orange';
        html += `<tr><td><strong>${p.title}</strong></td><td>${p.category||'-'}</td>
          <td><span class="badge ${sc}">${p.status}</span></td><td>${p.date||'-'}</td>
          <td><div class="item-actions">
            <button class="btn-icon" onclick="BlogPage.openForm('${p.id}')">✏️</button>
            <button class="btn-icon" onclick="BlogPage.remove('${p.id}')">🗑️</button>
          </div></td></tr>`;
      });
      html += `</tbody></table></div></div>`;
    }
    document.getElementById('page-blog').innerHTML = html;
  }

  function openForm(id){
    const posts = Store.get('blog',[]);
    const p = id ? posts.find(x=>x.id===id) : {id:'',title:'',content:'',category:'',status:'draft',tags:[]};
    showModal(`
      <div class="modal-header"><h3>${id?'Edit':'New'} Blog Post</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label>Title</label><input class="form-input" id="bTitle" value="${p.title}"></div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><input class="form-input" id="bCat" value="${p.category||''}" placeholder="e.g. Technology"></div>
          <div class="form-group"><label>Status</label><select class="form-input" id="bStatus">
            <option value="draft" ${p.status==='draft'?'selected':''}>Draft</option>
            <option value="published" ${p.status==='published'?'selected':''}>Published</option>
          </select></div>
        </div>
        <div class="form-group"><label>Content</label><textarea class="form-input" id="bContent" style="min-height:200px" placeholder="Write your post content here...">${p.content||''}</textarea></div>
        <div class="form-group"><label>Tags (comma separated)</label><input class="form-input" id="bTags" value="${(p.tags||[]).join(', ')}"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="BlogPage.save('${p.id||''}')">Save Post</button>
      </div>`);
  }

  function save(id){
    const posts = Store.get('blog',[]);
    const data = {
      title: document.getElementById('bTitle').value,
      content: document.getElementById('bContent').value,
      category: document.getElementById('bCat').value,
      status: document.getElementById('bStatus').value,
      tags: document.getElementById('bTags').value.split(',').map(t=>t.trim()).filter(Boolean),
      date: new Date().toISOString().split('T')[0]
    };
    if(!data.title){ showToast('Title is required','error'); return; }
    if(id){ const i=posts.findIndex(x=>x.id===id); if(i>-1) posts[i]={...posts[i],...data}; }
    else { data.id=genId(); posts.unshift(data); }
    Store.set('blog',posts); closeModal(); render();
    showToast(id?'Post updated!':'Post created!');
    AdminAuth.addActivity((id?'Updated':'Created')+' blog post: '+data.title);
  }

  function remove(id){
    if(!confirm('Delete this post?')) return;
    Store.set('blog', Store.get('blog',[]).filter(p=>p.id!==id)); render();
    showToast('Post deleted','info');
  }

  return { render, openForm, save, remove };
})();
