// ===== MESSAGES PAGE (Supabase-backed) =====
const MessagesPage = (function(){
  function render(){
    const msgs = Store.get('messages',[]);
    const unread = msgs.filter(m=>!m.read && !m.is_read).length;
    let html = `<div class="items-header"><h2>Messages (${msgs.length})</h2>
      <div style="display:flex;gap:8px">
        ${unread>0?`<span class="badge badge-red">${unread} unread</span>`:''}
        <button class="btn btn-sm btn-outline" onclick="MessagesPage.exportCSV()">📥 Export CSV</button>
      </div></div>`;

    if(msgs.length===0){
      html += `<div class="empty-state"><div class="empty-icon">✉️</div><h3>No messages</h3><p>Messages from your contact form will appear here.</p></div>`;
    } else {
      html += `<div class="card"><div class="card-body" style="padding:0">`;
      msgs.forEach(m=>{
        const isRead = m.read || m.is_read;
        html += `<div class="msg-card ${isRead?'':'unread'}" onclick="MessagesPage.view('${m.id}')">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div class="msg-sender">${m.sender}</div>
              <div class="msg-subject">${m.subject}</div>
              <div class="msg-time">${timeAgo(m.time)} · ${m.email}</div>
            </div>
            <div class="item-actions">
              <button class="btn-icon" onclick="event.stopPropagation();MessagesPage.remove('${m.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        </div>`;
      });
      html += `</div></div>`;
    }
    document.getElementById('page-messages').innerHTML = html;
    App.updateMsgBadge();
  }

  async function view(id){
    const msgs = Store.get('messages',[]);
    const m = msgs.find(x=>x.id===id);
    if(!m) return;
    // Mark as read locally and in Supabase
    m.read = true;
    m.is_read = true;
    Cache.set('messages', msgs);
    await Store.update('messages', id, { read: true });
    App.updateMsgBadge();
    showModal(`
      <div class="modal-header"><h3>Message from ${m.sender}</h3><button class="modal-close" onclick="closeModal();MessagesPage.render()">✕</button></div>
      <div class="modal-body">
        <p style="margin-bottom:8px"><strong>From:</strong> ${m.sender} (${m.email})</p>
        <p style="margin-bottom:8px"><strong>Subject:</strong> ${m.subject}</p>
        <p style="margin-bottom:8px"><strong>Received:</strong> ${new Date(m.time).toLocaleString()}</p>
        <hr style="border-color:var(--border);margin:16px 0">
        <p style="line-height:1.7;color:var(--muted)">${m.body}</p>
      </div>
      <div class="modal-footer">
        <a href="mailto:${m.email}?subject=Re: ${m.subject}" class="btn btn-primary btn-sm">✉️ Reply</a>
      </div>`);
  }

  async function remove(id){
    if(!confirm('Delete this message?')) return;
    await Store.deleteItem('messages', id);
    render();
    showToast('Message deleted','info');
  }

  function exportCSV(){
    const msgs = Store.get('messages',[]);
    let csv = 'Sender,Email,Subject,Body,Time,Read\n';
    msgs.forEach(m=>{ csv += `"${m.sender}","${m.email}","${m.subject}","${m.body}","${m.time}","${m.read||m.is_read}"\n`; });
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'messages_export.csv';
    a.click();
    showToast('Messages exported!');
  }

  return { render, view, remove, exportCSV };
})();
