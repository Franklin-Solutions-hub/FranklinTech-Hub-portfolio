// ===== HERO SECTION CONTROL =====
const HeroPage = (function(){
  function render(){
    const h = Store.get('hero',{});
    const social = Store.get('social',{});
    let html = `<div class="page-header"><h1>Hero Section</h1><p>Control the hero banner of your portfolio.</p></div>`;
    html += `<div class="grid-2">`;

    // Text controls
    html += `<div class="card"><div class="card-header"><span class="card-title">Hero Text</span></div><div class="card-body">
      <div class="form-group"><label>Name Line 1</label><input class="form-input" id="hTitle" value="${h.title||'Franklin'}"></div>
      <div class="form-group"><label>Name Line 2</label><input class="form-input" id="hSub" value="${h.subtitle||'Agamah'}"></div>
      <div class="form-group"><label>Name Line 3</label><input class="form-input" id="hSub2" value="${h.subtitle2||'Tornyeli'}"></div>
      <div class="form-group"><label>Bio</label><textarea class="form-input" id="hBio">${h.bio||''}</textarea></div>
      <div class="form-group"><label>Typing Roles (one per line)</label><textarea class="form-input" id="hRoles" style="min-height:100px">${(h.roles||[]).join('\n')}</textarea></div>
      <div class="form-group"><label>Location Badge Text</label><input class="form-input" id="hLocationBadge" value="${h.locationBadge||'🇬🇭 &nbsp;Based in Accra, Ghana'}"></div>
      <button class="btn btn-primary btn-sm" onclick="HeroPage.saveHero()" style="margin-top:8px">Save Changes</button>
    </div></div>`;

    // Stats
    html += `<div class="card"><div class="card-header"><span class="card-title">Statistics</span></div><div class="card-body">`;
    (h.stats||[]).forEach((s,i)=>{
      html += `<div class="form-row" style="margin-bottom:12px">
        <div class="form-group"><label>Label</label><input class="form-input" id="hStatL${i}" value="${s.label}"></div>
        <div class="form-group"><label>Value</label><input class="form-input" type="number" id="hStatV${i}" value="${s.value}"></div>
      </div>`;
    });
    html += `<button class="btn btn-primary btn-sm" onclick="HeroPage.saveStats()">Save Stats</button>
    </div></div></div>`;

    // Social links
    html += `<div class="card" style="margin-top:20px"><div class="card-header"><span class="card-title">Social Links</span></div><div class="card-body">
      <div class="form-row">
        <div class="form-group"><label>GitHub</label><input class="form-input" id="sGithub" value="${social.github||''}"></div>
        <div class="form-group"><label>LinkedIn</label><input class="form-input" id="sLinkedin" value="${social.linkedin||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>WhatsApp</label><input class="form-input" id="sWhatsapp" value="${social.whatsapp||''}"></div>
        <div class="form-group"><label>Twitter/X</label><input class="form-input" id="sTwitter" value="${social.twitter||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Email</label><input class="form-input" id="sEmail" value="${social.email||''}"></div>
        <div class="form-group"><label>YouTube</label><input class="form-input" id="sYoutube" value="${social.youtube||''}"></div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="HeroPage.saveSocial()" style="margin-top:8px">Save Social Links</button>
    </div></div>`;

    // CV Upload
    html += `<div class="card" style="margin-top:20px"><div class="card-header"><span class="card-title">Upload CV (PDF)</span></div><div class="card-body">
      <div class="form-group">
        <label>Select PDF File</label>
        <input type="file" id="cvUpload" accept="application/pdf" class="form-input" onchange="HeroPage.handleCVUpload(event)">
      </div>
      <p style="font-size:0.8rem;color:var(--muted);margin-top:8px" id="cvStatus">${Store.get('cv_pdf') ? '✅ CV is currently uploaded and available for download.' : '❌ No CV uploaded yet.'}</p>
    </div></div>`;

    document.getElementById('page-hero').innerHTML = html;
  }

  function saveHero(){
    const h = Store.get('hero',{});
    h.title = document.getElementById('hTitle').value;
    h.subtitle = document.getElementById('hSub').value;
    h.subtitle2 = document.getElementById('hSub2').value;
    h.bio = document.getElementById('hBio').value;
    h.locationBadge = document.getElementById('hLocationBadge') ? document.getElementById('hLocationBadge').value : '';
    h.roles = document.getElementById('hRoles').value.split('\n').filter(Boolean);
    Store.set('hero',h);
    showToast('Hero section updated!');
    AdminAuth.addActivity('Updated hero section');
  }

  function saveStats(){
    const h = Store.get('hero',{});
    h.stats = (h.stats||[]).map((s,i)=>({
      label: document.getElementById('hStatL'+i).value,
      value: parseInt(document.getElementById('hStatV'+i).value)||0
    }));
    Store.set('hero',h);
    showToast('Stats updated!');
  }

  function saveSocial(){
    Store.set('social',{
      github:document.getElementById('sGithub').value,
      linkedin:document.getElementById('sLinkedin').value,
      whatsapp:document.getElementById('sWhatsapp').value,
      twitter:document.getElementById('sTwitter').value,
      email:document.getElementById('sEmail').value,
      youtube:document.getElementById('sYoutube').value
    });
    showToast('Social links updated!');
    AdminAuth.addActivity('Updated social links');
  }

  // About Section
  function renderAbout(){
    const about = Store.get('about',{bio:'I\'m a Computer Science graduate from Ghana with a deep passion for building elegant software solutions.',objective:'To leverage my skills in software development and IT support to drive digital innovation.',education:[{degree:'BSc Computer Science',school:'Kings University College',year:'2020–2024'}],certifications:['Google IT Support Professional Certificate'],hobbies:['Reading','Football','Music','Open Source','Tech Innovation']});

    let html = `<div class="page-header"><h1>About Section</h1><p>Edit your biography and personal information.</p></div>`;
    html += `<div class="grid-2">`;
    html += `<div class="card"><div class="card-header"><span class="card-title">Biography</span></div><div class="card-body">
      <div class="form-group"><label>Bio</label><textarea class="form-input" id="aBio" style="min-height:120px">${about.bio}</textarea></div>
      <div class="form-group"><label>Career Objective</label><textarea class="form-input" id="aObj">${about.objective||''}</textarea></div>
      <div class="form-group"><label>Hobbies (comma separated)</label><input class="form-input" id="aHobbies" value="${(about.hobbies||[]).join(', ')}"></div>
      <button class="btn btn-primary btn-sm" onclick="HeroPage.saveAbout()">Save About</button>
    </div></div>`;

    html += `<div class="card"><div class="card-header"><span class="card-title">Education</span></div><div class="card-body">`;
    (about.education||[]).forEach((e,i)=>{
      html += `<div class="form-group" style="padding:12px;background:var(--surface);border-radius:10px;margin-bottom:10px">
        <input class="form-input" id="eDeg${i}" value="${e.degree}" placeholder="Degree" style="margin-bottom:8px">
        <input class="form-input" id="eSch${i}" value="${e.school}" placeholder="School" style="margin-bottom:8px">
        <input class="form-input" id="eYr${i}" value="${e.year}" placeholder="Year">
      </div>`;
    });
    html += `<div class="form-group"><label>Certifications (one per line)</label><textarea class="form-input" id="aCerts">${(about.certifications||[]).join('\n')}</textarea></div>
      <button class="btn btn-primary btn-sm" onclick="HeroPage.saveAbout()">Save</button>
    </div></div></div>`;

    document.getElementById('page-about').innerHTML = html;
  }

  function saveAbout(){
    const about = Store.get('about',{});
    about.bio = document.getElementById('aBio').value;
    about.objective = document.getElementById('aObj').value;
    about.hobbies = document.getElementById('aHobbies').value.split(',').map(t=>t.trim()).filter(Boolean);
    about.certifications = document.getElementById('aCerts').value.split('\n').filter(Boolean);
    // Save education entries
    const edu = about.education||[];
    edu.forEach((e,i)=>{
      const deg=document.getElementById('eDeg'+i);
      if(deg){ e.degree=deg.value; e.school=document.getElementById('eSch'+i).value; e.year=document.getElementById('eYr'+i).value; }
    });
    about.education = edu;
    Store.set('about',about);
    showToast('About section updated!');
    AdminAuth.addActivity('Updated about section');
  }

  function handleCVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('Please upload a valid PDF file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      Store.set('cv_pdf', e.target.result);
      document.getElementById('cvStatus').innerHTML = '✅ CV successfully uploaded and available for download.';
      showToast('CV uploaded successfully!');
      AdminAuth.addActivity('Uploaded new CV document');
    };
    reader.readAsDataURL(file);
  }

  return { render, saveHero, saveStats, saveSocial, renderAbout, saveAbout, handleCVUpload };
})();
