(function () {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const app = $('#teacherApp');
  const modal = $('#teacherModal');
  const modalContent = $('#teacherModalContent');
  const demoMode = !window.MPLS_API.isConfigured();

  const state = {
    bootstrap:null,
    teacherKey:sessionStorage.getItem('mpls_teacher_key') || '',
    runs:[], run:null, participants:[], topN:[], finalReport:null,
    tab:'participants', messageText:'', selectedRunId:'', groups:[],
    demo:createDemoState()
  };

  function esc(value) { return String(value == null ? '' : value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch])); }
  function fmt(value) { const n=Number(value||0); return Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,''); }
  function toast(message, kind='info') { const el=$('#teacherToast');el.textContent=message;el.className='toast '+kind;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.add('hidden'),3300); }
  function openModal(html, bind) { modalContent.innerHTML=html;modal.classList.remove('hidden');if(bind)bind(modalContent); }
  function closeModal() { modal.classList.add('hidden');modalContent.innerHTML=''; }
  function today() { return new Date().toISOString().slice(0,10); }
  function statusLabel(status) { return status==='finalized'?'Difinalisasi':'Berlangsung'; }
  function modeLabel(mode) { return mode==='teacher_candidate'?'Kandidat tanpa HP':mode==='assisted'?'Dibantu guru':'Registrasi HP'; }
  function componentLabel(c) { return ({reasoning:'Bernalar',collaboration:'Kerja Sama',creativity:'Kreativitas',responsibility:'Tanggung Jawab'})[c] || c; }
  function openPresentation(sessionId) {
    const runId = state.run ? state.run.runId : '';
    const query = (sessionId ? '&session=' + encodeURIComponent(sessionId) : '') + (runId ? '&run=' + encodeURIComponent(runId) : '');
    const child = window.open('./index.html?mode=presentation' + query, '_blank');
    if (!child) return toast('Pop-up diblokir. Izinkan pop-up untuk membuka Mode Presentasi.', 'error');
    const sendContext = event => {
      if (event.origin !== location.origin || event.source !== child || !event.data || event.data.type !== 'MPLS_PRESENTATION_READY') return;
      child.postMessage({type:'MPLS_TEACHER_CONTEXT', teacherKey:state.teacherKey, runId:runId, sessionId:sessionId||'', roomName:(state.run&&state.run.roomName)||'', runCode:(state.run&&state.run.runCode)||''}, location.origin);
      window.removeEventListener('message', sendContext);
    };
    window.addEventListener('message', sendContext);
  }

  async function init() {
    state.bootstrap=await window.MPLS_API.bootstrap();
    const badge=$('#teacherConnection');badge.textContent=demoMode?'Mode Demo':'Tersambung';badge.className='connection '+(demoMode?'demo':'live');
    $('#teacherFullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
    $('#teacherModalClose').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal();};
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
    if (demoMode) renderLogin(); else if (state.teacherKey) await loadDashboard(); else renderLogin();
  }

  function renderLogin() {
    app.innerHTML=`<section class="teacher-login">
      <div class="login-copy"><span class="eyebrow">PANEL PENILAIAN PEMATERI</span><h1>Nilai jelas.<br>Top 10 siap.<br>Pesan WA rapi.</h1><p>Satu panel untuk membuat sesi per ruangan, mencatat siswa tanpa telepon genggam, mengelola nilai 0–100, memeriksa 10 besar, lalu menyiapkan laporan WhatsApp yang tetap dikirim setelah persetujuan guru.</p><div class="login-features"><article><span>📵</span><strong>Kandidat tanpa HP</strong><small>Guru menambahkan nama dan nilai secara cepat.</small></article><article><span>💯</span><strong>Skala 0–100</strong><small>Lima komponen transparan dan dapat dikoreksi.</small></article><article><span>🔒</span><strong>Snapshot final</strong><small>Top 10 dibekukan setelah diperiksa.</small></article><article><span>💬</span><strong>WA semi-otomatis</strong><small>Salin, bagikan, atau buka WhatsApp.</small></article></div></div>
      <div class="login-card"><span class="eyebrow">AKSES GURU</span><h2>${demoMode?'Lihat prototipe tampilan':'Masukkan kunci guru'}</h2><p>${demoMode?'GAS belum dipasang. Data contoh digunakan untuk memperlihatkan seluruh alur aplikasi.':'Kunci hanya disimpan selama tab ini terbuka dan tidak ditulis pada repositori GitHub.'}</p>
      ${demoMode?'<div class="demo-ribbon">🧪 Mode demo: tombol penyimpanan hanya mengubah data contoh di browser.</div>':''}
      <form id="loginForm" class="form-stack">${demoMode?'':'<label>Kunci guru<input type="password" name="teacherKey" required autocomplete="current-password"></label>'}<button class="primary-action" type="submit">${demoMode?'Buka Dashboard Demo':'Buka Panel Guru'}</button></form>
      <a href="./index.html" class="secondary-action">← Kembali ke tampilan siswa</a></div></section>`;
    $('#loginForm').onsubmit=async e=>{e.preventDefault();if(!demoMode){state.teacherKey=String(new FormData(e.currentTarget).get('teacherKey')||'');sessionStorage.setItem('mpls_teacher_key',state.teacherKey);}await loadDashboard();};
  }

  async function loadDashboard(runId) {
    app.innerHTML='<div class="loading-box">Memuat dashboard penilaian...</div>';
    try {
      let data;
      if (demoMode) data=demoDashboard(runId||state.selectedRunId);
      else data=await window.MPLS_API.teacherDashboard({teacherKey:state.teacherKey,runId:runId||state.selectedRunId});
      state.runs=data.runs||[];state.run=data.run||null;state.participants=data.participants||[];state.topN=data.topN||[];state.finalReport=data.finalReport||null;state.groups=data.groups||[];state.selectedRunId=state.run?state.run.runId:'';
      if(state.finalReport)state.messageText=state.finalReport.messageText||'';
      renderDashboard();
    } catch(err) {
      sessionStorage.removeItem('mpls_teacher_key');state.teacherKey='';
      app.innerHTML=`<div class="empty-panel"><div class="emoji">🔐</div><h2>Panel belum dapat dibuka</h2><p>${esc(err.message)}</p><button class="teacher-btn primary" id="retryLogin">Coba lagi</button></div>`;$('#retryLogin').onclick=renderLogin;
    }
  }

  function renderDashboard() {
    const cfg=state.bootstrap.config||{};
    app.innerHTML=`<header class="teacher-header"><div><span class="eyebrow">${esc(cfg.schoolName||'SEKOLAH')}</span><h1>Dashboard Penilaian MPLS</h1><p>Kelola sesi, kandidat tanpa HP, nilai 0–100, finalisasi, dan laporan WhatsApp.</p></div><div class="header-actions"><button class="teacher-btn presentation" id="presentationMode">📽️ Mode Presentasi</button><button class="teacher-btn secondary" id="switchRun">🗂️ Pilih Sesi</button><button class="teacher-btn primary" id="newRun">＋ Buat Sesi</button>${!demoMode?'<button class="teacher-btn secondary" id="logoutTeacher">Keluar</button>':''}</div></header>
      ${state.run?runBanner():emptyRunBanner()}
      <nav class="teacher-nav"><button data-tab="runs" class="${state.tab==='runs'?'active':''}">🗓️ Sesi</button><button data-tab="participants" class="${state.tab==='participants'?'active':''}" ${state.run?'':'disabled'}>👥 Peserta & Nilai</button><button data-tab="observe" class="${state.tab==='observe'?'active':''}" ${state.run?'':'disabled'}>📝 Observasi</button><button data-tab="groups" class="${state.tab==='groups'?'active':''}" ${state.run?'':'disabled'}>🎨 Kelompok & Poster</button><button data-tab="topten" class="${state.tab==='topten'?'active':''}" ${state.run?'':'disabled'}>🏆 Top 10 & WhatsApp</button></nav>
      <div id="teacherBody"></div>`;
    $('#newRun').onclick=openCreateRun;
    $('#presentationMode').onclick=()=>openPresentation(state.run&&state.run.sessionId);
    $('#switchRun').onclick=()=>{state.tab='runs';renderDashboard();};
    if($('#logoutTeacher'))$('#logoutTeacher').onclick=()=>{sessionStorage.removeItem('mpls_teacher_key');state.teacherKey='';renderLogin();};
    $$('.teacher-nav button').forEach(b=>b.onclick=()=>{if(b.disabled)return;state.tab=b.dataset.tab;renderBody();$$('.teacher-nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===state.tab));});
    renderBody();
  }

  function runBanner() {
    const r=state.run;
    return `<section class="run-banner"><div><div><span class="status-pill ${esc(r.status)}">${statusLabel(r.status)}</span></div><h2>${esc(r.title)} · ${esc(r.roomName)}</h2><p>${esc(r.presenter)} · ${esc(r.runDate)} · Mulai ${esc(r.startTime||'-')}</p></div><div class="run-code"><div><small>KODE MASUK SISWA</small><strong>${esc(r.runCode)}</strong></div><button class="teacher-btn light" id="openRunPresentation">📽️ Materi</button><button class="teacher-btn secondary" id="copyRunCode">Salin</button></div></section>`;
  }
  function emptyRunBanner() { return `<section class="run-banner"><div><h2>Belum ada sesi pelaksanaan</h2><p>Buat sesi untuk menghasilkan kode masuk per ruangan.</p></div><button class="teacher-btn secondary" id="emptyCreate">Buat Sesi Pertama</button></section>`; }

  function renderBody() {
    if($('#copyRunCode'))$('#copyRunCode').onclick=()=>copyText(state.run.runCode,'Kode sesi disalin.');
    if($('#openRunPresentation'))$('#openRunPresentation').onclick=()=>openPresentation(state.run.sessionId);
    if($('#emptyCreate'))$('#emptyCreate').onclick=openCreateRun;
    if(state.tab==='runs')renderRuns();else if(state.tab==='observe')renderObserve();else if(state.tab==='groups')renderGroups();else if(state.tab==='topten')renderTopTen();else renderParticipants();
  }

  function renderRuns() {
    const body=$('#teacherBody');
    body.innerHTML=`<section class="teacher-panel"><div class="panel-heading"><div><h2>Daftar sesi per ruangan</h2><p>Setiap ruangan mempunyai kode, peserta, dan Top 10 sendiri.</p></div><button class="teacher-btn primary" id="runAdd">＋ Buat Sesi</button></div><div class="run-grid">${state.runs.length?state.runs.map(r=>`<button class="run-card ${r.runId===state.selectedRunId?'selected':''}" data-run="${esc(r.runId)}"><div class="run-card-top"><span class="status-pill ${esc(r.status)}">${statusLabel(r.status)}</span><strong>${esc(r.runCode)}</strong></div><h3>${esc(r.title)}</h3><p>${esc(r.roomName)} · ${esc(r.presenter)}</p><div class="run-card-meta"><span>📅 ${esc(r.runDate)}</span><span>👥 ${esc(r.participantCount||0)} peserta</span></div></button>`).join(''):'<div class="empty-panel"><div class="emoji">🗓️</div><p>Belum ada sesi.</p></div>'}</div></section>`;
    $('#runAdd').onclick=openCreateRun;$$('.run-card').forEach(c=>c.onclick=async()=>{state.tab='participants';await loadDashboard(c.dataset.run);});
  }

  function renderParticipants() {
    const body=$('#teacherBody');if(!state.run)return renderRuns();
    const avg=state.participants.length?state.participants.reduce((n,x)=>n+Number(x.finalScore||0),0)/state.participants.length:0;
    const highest=state.participants.length?Math.max(...state.participants.map(x=>Number(x.finalScore||0))):0;
    body.innerHTML=`<section class="kpi-grid"><article class="kpi-card"><small>PESERTA TERDATA</small><strong>${state.participants.length}</strong><span>Registrasi HP + kandidat guru</span></article><article class="kpi-card"><small>RATA-RATA</small><strong>${fmt(avg)}</strong><span>dari 100</span></article><article class="kpi-card"><small>NILAI TERTINGGI</small><strong>${fmt(highest)}</strong><span>dari 100</span></article><article class="kpi-card"><small>TOP 10</small><strong>${Math.min(10,state.topN.length)}</strong><span>kandidat laporan panitia</span></article></section>
      <section class="teacher-panel"><div class="panel-heading"><div><h2>Seluruh peserta dan nilai</h2><p>Nilai otomatis dapat dikoreksi sebelum finalisasi.</p></div><div class="panel-actions"><button class="teacher-btn secondary" id="refreshData">↻ Segarkan</button><button class="teacher-btn primary" id="addCandidate">📵 Tambah Kandidat Tanpa HP</button></div></div>${participantTable(state.participants)}</section>`;
    $('#refreshData').onclick=()=>loadDashboard(state.selectedRunId);$('#addCandidate').onclick=openAddCandidate;$$('.table-edit').forEach(b=>b.onclick=()=>openEditScores(b.dataset.student));
  }

  function participantTable(rows) {
    if(!rows.length)return '<div class="empty-panel"><div class="emoji">👥</div><h3>Belum ada peserta</h3><p>Siswa dapat masuk menggunakan kode sesi atau guru dapat menambah kandidat tanpa HP.</p></div>';
    return `<div class="score-table-wrap"><table class="score-table"><thead><tr><th>#</th><th>Peserta</th><th>Masuk melalui</th><th>Kuis /40</th><th>Bernalar /20</th><th>Kerja Sama /15</th><th>Kreativitas /15</th><th>Refleksi /10</th><th>Total</th><th></th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td><span class="rank-badge ${i<10?'top':''}">${i+1}</span></td><td class="person-cell"><strong>${esc(r.fullName)}</strong><small>${esc(r.className)} · ${esc(r.alias)}</small></td><td><span class="mode-tag">${esc(modeLabel(r.entryMode))}</span></td><td><span class="score-chip">${fmt(r.quizScore)}</span></td><td><span class="score-chip">${fmt(r.reasoningScore)}</span></td><td><span class="score-chip">${fmt(r.collaborationScore)}</span></td><td><span class="score-chip">${fmt(r.creativityScore)}</span></td><td><span class="score-chip">${fmt(r.reflectionScore)}</span></td><td><strong class="total-score">${fmt(r.finalScore)}</strong></td><td>${state.run.status==='open'?`<button class="table-edit" data-student="${esc(r.studentId)}">Edit</button>`:'🔒'}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderObserve() {
    const body=$('#teacherBody');if(!state.participants.length){body.innerHTML='<div class="empty-panel"><div class="emoji">📝</div><p>Tambahkan peserta terlebih dahulu.</p></div>';return;}
    body.innerHTML=`<section class="teacher-panel"><div class="panel-heading"><div><h2>Catatan observasi cepat</h2><p>Satu bukti perilaku lebih bermakna daripada label umum.</p></div></div><div class="observation-layout"><div class="rubric-box"><h3>Empat komponen observasi</h3><p>Pilih tingkat tertinggi yang benar-benar terlihat selama sesi.</p><div class="rubric-list"><article><span class="rubric-icon">💡</span><div><strong>Bernalar</strong><small>Bertanya atau menjawab dengan alasan.</small></div><span class="rubric-points">/20</span></article><article><span class="rubric-icon">🤝</span><div><strong>Kerja Sama</strong><small>Mendengar, berbagi tugas, membantu.</small></div><span class="rubric-points">/15</span></article><article><span class="rubric-icon">🎨</span><div><strong>Kreativitas</strong><small>Gagasan, karya, solusi, presentasi.</small></div><span class="rubric-points">/15</span></article><article><span class="rubric-icon">🌱</span><div><strong>Tanggung Jawab</strong><small>Disiplin, refleksi, komitmen.</small></div><span class="rubric-points">bagian /10</span></article></div></div>
      <form id="observeForm" class="form-stack"><label>Peserta<select name="studentId" required><option value="">Pilih peserta</option>${state.participants.map(s=>`<option value="${esc(s.studentId)}">${esc(s.fullName)} · ${esc(s.className)}</option>`).join('')}</select></label><label>Komponen<select name="component"><option value="reasoning">Bernalar / Keaktifan</option><option value="collaboration">Kerja Sama</option><option value="creativity">Kreativitas</option><option value="responsibility">Tanggung Jawab</option></select></label><label>Jenis bukti<input name="observationType" placeholder="Contoh: Menjawab dengan alasan"></label><label>Tingkat<select name="level"><option value="mulai">Mulai terlihat</option><option value="baik">Baik dan konsisten</option><option value="menonjol">Sangat menonjol</option></select></label><label>Catatan bukti<textarea name="note" rows="4" placeholder="Contoh: Menjelaskan alasan Screen Zone diperlukan dan memberi contoh yang relevan."></textarea></label><button class="primary-action" type="submit" ${state.run.status!=='open'?'disabled':''}>Simpan Observasi</button></form></div></section>`;
    $('#observeForm').onsubmit=async e=>{e.preventDefault();const payload=Object.fromEntries(new FormData(e.currentTarget).entries());payload.runId=state.run.runId;payload.teacherKey=state.teacherKey;const btn=$('button[type=submit]',e.currentTarget);btn.disabled=true;try{if(demoMode){applyDemoObservation(payload);toast('Observasi demo tersimpan.','success');}else await window.MPLS_API.submitObservation(payload);await loadDashboard(state.run.runId);state.tab='observe';renderDashboard();}catch(err){toast(err.message,'error');}finally{btn.disabled=false;}};
  }

  function ratingButtons(member, component, current) {
    const options=[['cukup','Cukup'],['baik','Baik'],['baik_sekali','Baik Sekali']];
    return `<div class="private-rating" data-student="${esc(member.studentId)}" data-component="${esc(component)}">${options.map(([v,label])=>`<button class="rating-choice ${current===v?'selected':''}" data-level="${v}" type="button">${label}</button>`).join('')}</div>`;
  }

  function renderGroups() {
    const body=$('#teacherBody');
    if(!state.groups.length){body.innerHTML=`<section class="teacher-panel"><div class="empty-panel"><div class="emoji">🎨</div><h3>Kelompok belum tersimpan</h3><p>Buka Mode Presentasi, lakukan pembagian kelompok, isi nama ketua, lalu tekan <strong>Simpan Kelompok ke Panel Guru</strong>.</p><button class="teacher-btn presentation" id="openGroupPresentation">📽️ Buka Mode Presentasi</button></div></section>`;$('#openGroupPresentation').onclick=()=>openPresentation(state.run.sessionId);return;}
    body.innerHTML=`<section class="teacher-panel"><div class="panel-heading"><div><h2>Penilaian kelompok dan poster</h2><p>Bagian ini hanya terlihat di Panel Guru. Nilai anggota tidak ditampilkan pada layar presentasi.</p></div><button class="teacher-btn secondary" id="refreshGroups">↻ Segarkan</button></div>
      <div class="group-assessment-grid">${state.groups.map(g=>`<article class="group-assessment-card" style="--group-color:${esc(g.color||'#4f46e5')}"><header><i></i><div><small>KELOMPOK ${esc(g.groupOrder)}</small><h3>${esc(g.groupName)}</h3><p>Ketua: <strong>${esc(g.leaderName||'Belum ditentukan')}</strong> · ${g.members.length} anggota</p></div></header><section class="poster-rating"><div><strong>Nilai kualitas poster kelompok</strong><small>Diterapkan sebagai nilai kreativitas untuk seluruh anggota.</small></div>${ratingButtons({studentId:g.groupId},'poster',g.posterLevel||'')}</section><div class="member-rating-list"><div class="member-rating-head"><span>Nama anggota</span><span>Keaktifan/kerja sama</span></div>${g.members.map(m=>`<div class="member-rating-row"><div><strong>${m.isLeader?'⭐ ':''}${esc(m.fullName)}</strong><small>${m.isLeader?'Ketua kelompok':'Anggota'}</small></div>${ratingButtons(m,'collaboration',m.collaborationLevel||'')}</div>`).join('')}</div></article>`).join('')}</div></section>`;
    $('#refreshGroups').onclick=()=>loadDashboard(state.run.runId);
    $$('.private-rating').forEach(box=>$$('.rating-choice',box).forEach(btn=>btn.onclick=async()=>{
      if(state.run.status!=='open')return toast('Sesi sudah difinalisasi.','error');
      const component=box.dataset.component, level=btn.dataset.level;$$('.rating-choice',box).forEach(x=>x.disabled=true);
      try{
        if(component==='poster') await window.MPLS_API.rateGroupPoster({teacherKey:state.teacherKey,runId:state.run.runId,groupId:box.dataset.student,level});
        else await window.MPLS_API.rateGroupMember({teacherKey:state.teacherKey,runId:state.run.runId,studentId:box.dataset.student,level,note:'Penilaian kontribusi dan kerja sama dalam kegiatan poster 3S.'});
        await loadDashboard(state.run.runId);state.tab='groups';renderDashboard();toast('Penilaian kelompok tersimpan.','success');
      }catch(err){toast(err.message,'error');$$('.rating-choice',box).forEach(x=>x.disabled=false);}
    }));
  }

  function renderTopTen() {
    const body=$('#teacherBody');if(!state.run)return renderRuns();
    const report=state.finalReport;const rows=report?report.topN:state.topN;
    body.innerHTML=`<section class="teacher-panel"><div class="panel-heading"><div><h2>Top 10 dan laporan WhatsApp</h2><p>${report?'Hasil telah dibekukan. Pesan di bawah berasal dari snapshot final.':'Periksa nama, kelas, dan nilai sebelum finalisasi.'}</p></div><div class="panel-actions">${report?'<span class="status-pill finalized">Snapshot final</span>':'<button class="teacher-btn secondary" id="previewReport">👁️ Pratinjau Pesan</button><button class="teacher-btn warning" id="finalizeReport">🔒 Finalisasi Hasil</button>'}</div></div><div class="topten-layout"><article class="topten-card"><header><span class="eyebrow">PERINGKAT SESI</span><h3>${esc(state.run.title)} · ${esc(state.run.roomName)}</h3></header>${topTenList(rows)}</article><article class="message-card"><span class="eyebrow">PESAN FORMAL</span><textarea id="waMessage" readonly placeholder="Tekan Pratinjau Pesan untuk membuat laporan.">${esc(report?report.messageText:state.messageText)}</textarea><div class="message-actions"><button class="teacher-btn secondary" id="copyMessage" ${report||state.messageText?'':'disabled'}>📋 Salin Pesan</button><button class="teacher-btn success" id="shareMessage" ${report||state.messageText?'':'disabled'}>↗️ Bagikan</button><button class="teacher-btn success" id="openWhatsApp" ${report||state.messageText?'':'disabled'}>💬 Buka WhatsApp</button><button class="teacher-btn secondary" id="refreshTop">↻ Segarkan</button></div>${report?'<div class="final-box"><strong>✓ Hasil telah difinalisasi</strong><br>Data Top 10 tersimpan pada sheet <code>TOP10_RESULTS</code> dan pesan tersimpan pada <code>REPORTS</code>.</div>':'<p class="assist-note">Alur semi-otomatis: buat pratinjau → periksa → finalisasi → bagikan atau buka WhatsApp → pilih kontak → tekan kirim.</p>'}</article></div></section>`;
    if($('#previewReport'))$('#previewReport').onclick=previewReport;
    if($('#finalizeReport'))$('#finalizeReport').onclick=confirmFinalize;
    $('#copyMessage').onclick=()=>copyText(currentMessage(),'Pesan laporan disalin.');
    $('#shareMessage').onclick=shareMessage;
    $('#openWhatsApp').onclick=openWhatsApp;
    $('#refreshTop').onclick=()=>loadDashboard(state.run.runId);
  }

  function topTenList(rows) {
    if(!rows||!rows.length)return '<div class="empty-panel"><div class="emoji">🏆</div><p>Belum ada peserta bernilai.</p></div>';
    return `<ol class="topten-list">${rows.slice(0,10).map((r,i)=>`<li><span class="rank-badge top">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><div><strong>${esc(r.fullName)}</strong><small>${esc(r.className)}</small></div><strong>${fmt(r.finalScore)}</strong></li>`).join('')}</ol>`;
  }

  function openCreateRun() {
    const sessions=state.bootstrap.sessions||[];
    openModal(`<span class="eyebrow">SESI BARU</span><h2>Buat kode untuk satu ruangan</h2><form id="createRunForm" class="form-stack teacher-form-grid"><label>Materi<select name="sessionId">${sessions.map(s=>`<option value="${esc(s.session_id)}">${esc(s.title)} · ${esc(s.day_label)}</option>`).join('')}</select></label><label>Ruangan<input name="roomName" placeholder="Contoh: Ruang 3" required></label><label>Pemateri<input name="presenter" value="${esc((state.bootstrap.config||{}).teacherName||'Kak Iphoel')}" required></label><label>Tanggal<input type="date" name="runDate" value="${today()}" required></label><label>Jam mulai<input type="time" name="startTime" value="08:00"></label><label>Kode khusus (opsional)<input name="runCode" maxlength="10" placeholder="Kosongkan agar dibuat otomatis"></label><label class="full">Catatan<textarea name="notes" rows="2" placeholder="Opsional"></textarea></label><button class="primary-action full" type="submit">Buat dan Aktifkan Sesi</button></form>`,root=>{$('#createRunForm',root).onsubmit=async e=>{e.preventDefault();const payload=Object.fromEntries(new FormData(e.currentTarget).entries());payload.teacherKey=state.teacherKey;const btn=$('button[type=submit]',e.currentTarget);btn.disabled=true;try{let result;if(demoMode)result=createDemoRun(payload);else result=await window.MPLS_API.createRun(payload);closeModal();state.tab='participants';await loadDashboard(result.run.runId);toast('Sesi aktif. Bagikan kode '+result.run.runCode,'success');}catch(err){toast(err.message,'error');btn.disabled=false;}};});
  }

  function openAddCandidate() {
    openModal(`<span class="eyebrow">KANDIDAT TANPA HP</span><h2>Tambah peserta dan nilai awal</h2><p>Kolom nilai boleh dikosongkan. Guru dapat melengkapinya setelah observasi.</p><form id="candidateForm" class="form-stack"><div class="teacher-form-grid"><label>Nama lengkap<input name="fullName" required></label><label>Kelas/kelompok<input name="className" required></label></div><div class="score-input-grid"><label>Kuis /40<input type="number" name="quizScore" min="0" max="40" step="0.01"></label><label>Bernalar /20<input type="number" name="reasoningScore" min="0" max="20" step="0.01"></label><label>Kerja Sama /15<input type="number" name="collaborationScore" min="0" max="15" step="0.01"></label><label>Kreativitas /15<input type="number" name="creativityScore" min="0" max="15" step="0.01"></label><label>Refleksi /10<input type="number" name="reflectionScore" min="0" max="10" step="0.01"></label></div><label>Catatan bukti<textarea name="note" rows="3" placeholder="Contoh: Aktif berdiskusi dan memimpin pembagian tugas poster."></textarea></label><button class="primary-action" type="submit">Simpan Kandidat</button></form>`,root=>{$('#candidateForm',root).onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget).entries());const payload={teacherKey:state.teacherKey,runId:state.run.runId,fullName:f.fullName,className:f.className,entryMode:'teacher_candidate',note:f.note,scores:{quizScore:f.quizScore,reasoningScore:f.reasoningScore,collaborationScore:f.collaborationScore,creativityScore:f.creativityScore,reflectionScore:f.reflectionScore}};const btn=$('button[type=submit]',e.currentTarget);btn.disabled=true;try{if(demoMode)addDemoCandidate(payload);else await window.MPLS_API.addCandidate(payload);closeModal();await loadDashboard(state.run.runId);toast('Kandidat tanpa HP berhasil ditambahkan.','success');}catch(err){toast(err.message,'error');btn.disabled=false;}};});
  }

  function openEditScores(studentId) {
    const s=state.participants.find(x=>x.studentId===studentId);if(!s)return;
    openModal(`<span class="eyebrow">KOREKSI NILAI</span><h2>${esc(s.fullName)}</h2><p>${esc(s.className)} · Nilai saat ini ${fmt(s.finalScore)}/100</p><form id="scoreForm" class="form-stack"><div class="score-input-grid"><label>Kuis /40<input type="number" name="quizScore" value="${fmt(s.quizScore)}" min="0" max="40" step="0.01"></label><label>Bernalar /20<input type="number" name="reasoningScore" value="${fmt(s.reasoningScore)}" min="0" max="20" step="0.01"></label><label>Kerja Sama /15<input type="number" name="collaborationScore" value="${fmt(s.collaborationScore)}" min="0" max="15" step="0.01"></label><label>Kreativitas /15<input type="number" name="creativityScore" value="${fmt(s.creativityScore)}" min="0" max="15" step="0.01"></label><label>Refleksi /10<input type="number" name="reflectionScore" value="${fmt(s.reflectionScore)}" min="0" max="10" step="0.01"></label></div><label>Catatan guru<textarea name="note" rows="3">${esc(s.note||'')}</textarea></label><button class="primary-action" type="submit">Simpan Koreksi</button></form>`,root=>{$('#scoreForm',root).onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget).entries());const payload={teacherKey:state.teacherKey,runId:state.run.runId,studentId:s.studentId,note:f.note,scores:{quizScore:f.quizScore,reasoningScore:f.reasoningScore,collaborationScore:f.collaborationScore,creativityScore:f.creativityScore,reflectionScore:f.reflectionScore}};const btn=$('button[type=submit]',e.currentTarget);btn.disabled=true;try{if(demoMode)setDemoScores(payload);else await window.MPLS_API.setManualScores(payload);closeModal();await loadDashboard(state.run.runId);toast('Nilai diperbarui.','success');}catch(err){toast(err.message,'error');btn.disabled=false;}};});
  }

  async function previewReport() {
    try{let r;if(demoMode)r=demoPreview();else r=await window.MPLS_API.previewFinalReport({teacherKey:state.teacherKey,runId:state.run.runId});state.messageText=r.messageText;renderTopTen();toast('Pratinjau laporan dibuat. Periksa sebelum finalisasi.','success');}catch(err){toast(err.message,'error');}
  }
  function confirmFinalize() {
    openModal(`<div class="celebrate"><div class="big-emoji">🔒</div><h2>Finalisasi hasil sesi?</h2><p>Top 10 dan pesan laporan akan disimpan sebagai snapshot. Pastikan ejaan nama, kelas, dan nilai sudah diperiksa.</p><div class="result-actions"><button class="secondary-action" id="cancelFinal">Periksa lagi</button><button class="primary-action" id="doFinal">Ya, finalisasi</button></div></div>`,root=>{$('#cancelFinal',root).onclick=closeModal;$('#doFinal',root).onclick=finalizeReport;});
  }
  async function finalizeReport() {
    try{let r;if(demoMode)r=finalizeDemo();else r=await window.MPLS_API.finalizeRun({teacherKey:state.teacherKey,runId:state.run.runId});closeModal();state.finalReport=r.finalReport;state.messageText=state.finalReport.messageText;await loadDashboard(state.run.runId);state.tab='topten';renderDashboard();toast('Hasil final tersimpan. Pesan siap dikirim.','success');}catch(err){toast(err.message,'error');}
  }

  function currentMessage(){return (state.finalReport&&state.finalReport.messageText)||state.messageText||'';}
  async function copyText(text,success){if(!text)return;try{await navigator.clipboard.writeText(text);toast(success||'Disalin.','success');}catch(_){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast(success||'Disalin.','success');}}
  async function shareMessage(){const text=currentMessage();if(!text)return;if(navigator.share){try{await navigator.share({title:'Hasil Penilaian MPLS',text});return;}catch(err){if(err.name==='AbortError')return;}}await copyText(text,'Pesan disalin. Pilih WhatsApp lalu tempelkan pesan.');}
  function openWhatsApp(){const text=currentMessage();if(!text)return;window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');}

  function createDemoState(){
    const names=['Alya Putri Ramadhani','Muhammad Fajar Akbar','Nur Aisyah Rahma','Rizky Maulana','Siti Zahra','Andi Pratama','Nabila Azzahra','Dimas Saputra','Fathimah Nurul','Arif Hidayat','Salwa Nurfadilah','Bima Kurniawan'];
    const values=[[36,19,14,14,9],[35,18,14,13,9],[34,19,13,13,9],[36,17,13,12,9],[33,18,14,13,8],[34,16,14,12,9],[32,17,13,14,8],[31,18,13,12,8],[33,16,12,12,8],[30,17,13,11,8],[31,15,12,13,7],[29,16,12,11,8]];
    const participants=names.map((n,i)=>({studentId:'D-'+(i+1),fullName:n,className:i<6?'VII-A':'VII-B',alias:'Bintang-'+String(i+1).padStart(3,'0'),entryMode:i===8?'teacher_candidate':'self',quizScore:values[i][0],reasoningScore:values[i][1],collaborationScore:values[i][2],creativityScore:values[i][3],reflectionScore:values[i][4],finalScore:values[i].reduce((a,b)=>a+b,0),note:i===0?'Menjelaskan alasan dengan jelas dan membantu kelompok.':''})).sort((a,b)=>b.finalScore-a.finalScore);
    const run={runId:'RUN-DEMO-01',sessionId:'DIGI-WED',runCode:'LIT38A',roomName:'Ruang 3',presenter:'Kak Iphoel',runDate:today(),startTime:'08:00',status:'open',title:'Literasi Digital',subtitle:'Cerdas, Aman, dan Seimbang di Dunia Digital',participantCount:32};
    const run2={runId:'RUN-DEMO-02',sessionId:'CURR-THU',runCode:'KUR38B',roomName:'Ruang 2',presenter:'Kak Iphoel',runDate:today(),startTime:'10:00',status:'finalized',title:'Pengenalan Kurikulum',subtitle:'Peta Belajar dan Strategi Efektif',participantCount:28};
    return {runs:[run,run2],run,participants,finalReport:null};
  }
  function demoDashboard(runId){let run=state.demo.runs.find(r=>r.runId===(runId||state.demo.run.runId))||state.demo.runs[0];let participants=run.runId===state.demo.run.runId?state.demo.participants:state.demo.participants.slice().map((x,i)=>Object.assign({},x,{finalScore:Math.max(55,x.finalScore-4),quizScore:Math.max(20,x.quizScore-2)}));participants.sort((a,b)=>b.finalScore-a.finalScore);return{runs:state.demo.runs,run,participants,topN:participants.slice(0,10),finalReport:run.runId===state.demo.run.runId?state.demo.finalReport:null};}
  function createDemoRun(p){const s=(state.bootstrap.sessions||[]).find(x=>x.session_id===p.sessionId)||(state.bootstrap.sessions||[])[0],code=(p.runCode||Math.random().toString(36).slice(2,8)).toUpperCase();const r={runId:'RUN-DEMO-'+Date.now(),sessionId:s.session_id,runCode:code,roomName:p.roomName,presenter:p.presenter,runDate:p.runDate,startTime:p.startTime,status:'open',title:s.title,subtitle:s.subtitle,participantCount:0};state.demo.runs.unshift(r);state.demo.run=r;state.demo.participants=[];state.demo.finalReport=null;return{run:r};}
  function addDemoCandidate(p){const sc=p.scores||{},s={studentId:'D-'+Date.now(),fullName:p.fullName,className:p.className,alias:'Bintang-Demo',entryMode:'teacher_candidate',quizScore:Number(sc.quizScore||0),reasoningScore:Number(sc.reasoningScore||0),collaborationScore:Number(sc.collaborationScore||0),creativityScore:Number(sc.creativityScore||0),reflectionScore:Number(sc.reflectionScore||0),note:p.note||''};s.finalScore=s.quizScore+s.reasoningScore+s.collaborationScore+s.creativityScore+s.reflectionScore;state.demo.participants.push(s);state.demo.participants.sort((a,b)=>b.finalScore-a.finalScore);}
  function setDemoScores(p){const s=state.demo.participants.find(x=>x.studentId===p.studentId);if(!s)return;Object.entries(p.scores).forEach(([k,v])=>{if(v!=='')s[k]=Number(v);});s.note=p.note;s.finalScore=s.quizScore+s.reasoningScore+s.collaborationScore+s.creativityScore+s.reflectionScore;state.demo.participants.sort((a,b)=>b.finalScore-a.finalScore);}
  function applyDemoObservation(p){const s=state.demo.participants.find(x=>x.studentId===p.studentId);if(!s)return;const max={reasoning:20,collaboration:15,creativity:15,responsibility:6},level={mulai:1,baik:2,menonjol:3}[p.level]||1;if(p.component==='responsibility')s.reflectionScore=Math.min(10,4+(level/3)*6);else{s[p.component+'Score']=Math.round((level/3)*max[p.component]*100)/100;}s.finalScore=s.quizScore+s.reasoningScore+s.collaborationScore+s.creativityScore+s.reflectionScore;s.note=p.note||s.note;state.demo.participants.sort((a,b)=>b.finalScore-a.finalScore);}
  function demoPreview(){const top=state.demo.participants.slice(0,10),text=buildDemoMessage(state.demo.run,state.demo.participants.length,top);return{messageText:text,topN:top};}
  function finalizeDemo(){const p=demoPreview();state.demo.run.status='finalized';state.demo.finalReport={reportId:'REP-DEMO',status:'final',participantCount:state.demo.participants.length,topN:p.topN,messageText:p.messageText};return{finalReport:state.demo.finalReport};}
  function buildDemoMessage(run,count,top){const lines=['Assalamu’alaikum warahmatullahi wabarakatuh.','','Yth. Panitia Masa Pengenalan Lingkungan Sekolah','SMP Negeri 38 Maluku Tengah','','Dengan hormat,','','Berikut kami sampaikan hasil penilaian peserta kegiatan MPLS dengan rincian:','','Materi       : '+run.title,'Hari/Tanggal : '+run.runDate,'Ruangan      : '+run.roomName,'Pemateri     : '+run.presenter,'Peserta Terdata: '+count+' peserta','','DAFTAR '+top.length+' PESERTA TERBAIK',''];top.forEach((s,i)=>lines.push((i+1)+'. '+s.fullName+' — '+s.className+' — Nilai '+fmt(s.finalScore)));lines.push('','Penilaian menggunakan skala 0–100 dan mempertimbangkan pemahaman materi, keaktifan bernalar, kerja sama, kreativitas, serta refleksi/tanggung jawab peserta.','','Data lengkap dan snapshot hasil akhir telah tersimpan pada Google Sheet kegiatan MPLS.','','Demikian hasil ini kami sampaikan untuk menjadi bahan pertimbangan panitia. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.','','Wassalamu’alaikum warahmatullahi wabarakatuh.','','Pemateri,',run.presenter);return lines.join('\n');}

  init().catch(err=>{console.error(err);app.innerHTML=`<div class="empty-panel"><div class="emoji">⚠️</div><h2>Aplikasi tidak dapat dimuat</h2><p>${esc(err.message)}</p><button class="teacher-btn primary" onclick="location.reload()">Muat ulang</button></div>`;});
})();
