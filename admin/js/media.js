// ===== MEDIA LIBRARY =====
const MediaPage = (function(){
  function render(){
    const media = Store.get('media',[]);
    let html = `<div class="items-header"><h2>Media Library (${media.length})</h2></div>`;

    // Upload zone
    html += `<div class="dropzone" id="mediaDropzone" onclick="document.getElementById('mediaInput').click()"
      ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')"
      ondrop="event.preventDefault();this.classList.remove('dragover');MediaPage.handleDrop(event)">
      <div class="dropzone-icon">📁</div>
      <div class="dropzone-text">Drag & drop files here or click to upload<br><small style="color:var(--muted)">PNG, JPG, SVG, WEBP supported</small></div>
      <input type="file" id="mediaInput" style="display:none" accept="image/*" multiple onchange="MediaPage.handleFiles(this.files)">
    </div>`;

    if(media.length>0){
      html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px;margin-top:24px">`;
      media.forEach(m=>{
        html += `<div class="card" style="cursor:pointer;position:relative" onclick="MediaPage.preview('${m.id}')">
          <div style="height:120px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--bg)">
            <img src="${m.data}" style="max-width:100%;max-height:120px;object-fit:cover" alt="${m.name}">
          </div>
          <div style="padding:8px 12px">
            <div style="font-size:.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
            <div style="font-size:.7rem;color:var(--muted)">${(m.size/1024).toFixed(1)} KB</div>
          </div>
        </div>`;
      });
      html += `</div>`;
    }
    document.getElementById('page-media').innerHTML = html;
  }

  function handleDrop(e){
    const files = e.dataTransfer.files;
    handleFiles(files);
  }

  function handleFiles(files){
    const media = Store.get('media',[]);
    Array.from(files).forEach(file=>{
      if(!file.type.startsWith('image/')){ showToast('Only images allowed','error'); return; }
      if(file.size > 500*1024){ showToast('File too large (max 500KB for localStorage)','error'); return; }
      const reader = new FileReader();
      reader.onload = function(e){
        media.unshift({ id:genId(), name:file.name, size:file.size, type:file.type, data:e.target.result, date:new Date().toISOString() });
        Store.set('media',media);
        render();
        showToast('File uploaded!');
      };
      reader.readAsDataURL(file);
    });
  }

  function preview(id){
    const m = Store.get('media',[]).find(x=>x.id===id);
    if(!m) return;
    showModal(`
      <div class="modal-header"><h3>${m.name}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body" style="text-align:center">
        <img src="${m.data}" style="max-width:100%;max-height:400px;border-radius:12px" alt="${m.name}">
        <p style="margin-top:12px;color:var(--muted);font-size:.85rem">${(m.size/1024).toFixed(1)} KB · ${m.type} · ${new Date(m.date).toLocaleDateString()}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger btn-sm" onclick="MediaPage.remove('${m.id}')">🗑️ Delete</button>
      </div>`);
  }

  function remove(id){
    if(!confirm('Delete this file?')) return;
    Store.set('media', Store.get('media',[]).filter(m=>m.id!==id));
    closeModal(); render();
    showToast('File deleted','info');
  }

  return { render, handleDrop, handleFiles, preview, remove };
})();
