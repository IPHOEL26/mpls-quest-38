(function () {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const app = $('#app');
  const urlParams = new URLSearchParams(window.location.search);
  const presentationMode = urlParams.get('mode') === 'presentation';
  const preferredPresentationSession = urlParams.get('session') || '';
  const preferredRunId = urlParams.get('run') || '';
  const preferredJoinCode = (urlParams.get('join') || urlParams.get('code') || '').trim().toUpperCase();

  const state = {
    data:null, currentSession:null, stepIndex:0,
    student:loadJSON('mpls_student'), progress:loadJSON('mpls_progress') || {},
    quiz:null, timer:{seconds:0, initial:0, running:false, handle:null}, teacherKey:'', presentationMode, presentationGroups:null, teacherContext:null, joinPromptShown:false
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  }
  function loadJSON(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } }
  function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function cleanLines(body) { return String(body || '').split(/\n/).map(x => x.trim()).filter(Boolean); }
  function bodyHTML(body) {
    const lines = cleanLines(body);
    if (!lines.length) return '';
    const bullets = lines.filter(l => /^[•\-]/.test(l));
    if (bullets.length === lines.length) return '<ul>' + bullets.map(l => '<li>'+esc(l.replace(/^[•\-]\s*/,''))+'</li>').join('') + '</ul>';
    return lines.map(l => /^[A-Z][A-Z ]+\s*[—-]/.test(l) ? '<p class="definition"><strong>'+esc(l.split(/[—-]/)[0].trim())+'</strong> — '+esc(l.split(/[—-]/).slice(1).join('—').trim())+'</p>' : '<p>'+esc(l)+'</p>').join('');
  }
  function accentClass(value) { return 'accent-' + String(value || 'violet').replace(/[^a-z]/gi,''); }
  function toast(message, kind='info') {
    const el = $('#toast'); el.textContent = message; el.className = 'toast ' + kind;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add('hidden'), 3200);
  }
  function showModal(html, bind) {
    $('#modalContent').innerHTML = html; $('#modal').classList.remove('hidden');
    if (bind) bind($('#modalContent'));
  }
  function closeModal() { $('#modal').classList.add('hidden'); $('#modalContent').innerHTML=''; }
  function setProgress(sessionId, step) { if (state.presentationMode) return; state.progress[sessionId] = Math.max(Number(state.progress[sessionId] || 0), step); saveJSON('mpls_progress', state.progress); }



  function setupPresentationBridge() {
    if (!state.presentationMode) return;
    try { state.teacherContext = JSON.parse(sessionStorage.getItem('mpls_presentation_context') || 'null'); } catch (_) {}
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || !event.data || event.data.type !== 'MPLS_TEACHER_CONTEXT') return;
      state.teacherContext = event.data;
      state.teacherKey = String(event.data.teacherKey || '');
      sessionStorage.setItem('mpls_presentation_context', JSON.stringify(event.data));
      toast('Mode Presentasi terhubung ke sesi ' + (event.data.runCode || ''), 'success');
    });
    if (window.opener) window.opener.postMessage({type:'MPLS_PRESENTATION_READY'}, location.origin);
  }

  function levelMeta(level) {
    return ({cukup:{api:'mulai',label:'Cukup',numeric:3},baik:{api:'baik',label:'Baik',numeric:5},baik_sekali:{api:'menonjol',label:'Baik Sekali',numeric:7}})[level];
  }

  function requirePresentationContext() {
    if (state.teacherContext && state.teacherContext.teacherKey && (state.teacherContext.runId || preferredRunId)) return Promise.resolve(state.teacherContext);
    return new Promise((resolve,reject)=>{
      showModal(`<span class="eyebrow">SAMBUNGKAN PENILAIAN</span><h2>Masukkan kunci guru</h2><p>Ini hanya diperlukan bila Mode Presentasi dibuka langsung, bukan melalui Panel Guru.</p><form id="presentationAuth" class="form-stack"><label>Kunci guru<input type="password" name="teacherKey" required></label><label>ID sesi pelaksanaan<input name="runId" value="${esc(preferredRunId)}" required></label><label>Nama kelas/ruangan<input name="roomName" placeholder="Contoh: Ruang 3"></label><button class="primary-action" type="submit">Hubungkan</button></form>`,root=>{$('#presentationAuth',root).onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget).entries());state.teacherContext={teacherKey:f.teacherKey,runId:f.runId,roomName:f.roomName,sessionId:preferredPresentationSession};state.teacherKey=f.teacherKey;sessionStorage.setItem('mpls_presentation_context',JSON.stringify(state.teacherContext));closeModal();resolve(state.teacherContext);};});
    });
  }

  function applyPresentationData() {
    const pack = window.MPLS_PRESENTATION_DATA;
    if (!pack) return;
    const sessions = Array.isArray(state.data.sessions) ? state.data.sessions.slice() : [];
    Object.values(pack.sessions || {}).forEach(local => {
      const idx = sessions.findIndex(s => s.session_id === local.session_id);
      if (idx >= 0) sessions[idx] = Object.assign({}, sessions[idx], local);
      else sessions.push(local);
    });
    let content = Array.isArray(state.data.content) ? state.data.content.slice() : [];
    Object.entries(pack.content || {}).forEach(([sessionId, rows]) => {
      content = content.filter(item => item.session_id !== sessionId).concat(rows);
    });
    state.data.sessions = sessions;
    state.data.content = content;
    state.data.presentationVersion = pack.version;
  }

  async function init() {
    state.data = await window.MPLS_API.bootstrap();
    setupPresentationBridge();
    if (state.presentationMode) applyPresentationData();
    const cfg = state.data.config || {};
    $('#brandTitle').textContent = cfg.appTitle || 'MPLS Quest 38';
    $('#brandSchool').textContent = cfg.schoolName || 'Sekolah';
    const badge = $('#connectionBadge');
    document.body.classList.toggle('presentation-mode', state.presentationMode);
    badge.textContent = state.presentationMode ? 'Mode Presentasi' : (state.data.mode === 'live' ? 'Tersambung' : 'Mode Demo');
    badge.className = 'connection ' + (state.presentationMode || state.data.mode === 'live' ? 'live' : 'demo');
    if (state.data.apiError) toast('API belum tersambung. Aplikasi memakai data demo.', 'warning');
    renderHome();
    bindGlobal();
    if (!state.presentationMode && preferredJoinCode && !state.student && !state.joinPromptShown) {
      state.joinPromptShown = true;
      setTimeout(() => openRegistration(() => {
        const sid = state.student && state.student.run && state.student.run.sessionId;
        if (sid) beginSession(sid); else renderHome();
      }), 120);
    }
    if (state.presentationMode && preferredPresentationSession) setTimeout(() => beginSession(preferredPresentationSession), 0);
    if ('serviceWorker' in navigator && window.MPLS_APP_CONFIG.ENABLE_SERVICE_WORKER && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(console.warn);
  }

  function bindGlobal() {
    $('#homeButton').addEventListener('click', renderHome);
    $('#fullscreenButton').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
    $('#teacherButton').addEventListener('click', () => { window.location.href = './teacher.html'; });
    $('#modalClose').addEventListener('click', closeModal);
    $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
    $('#timerToggle').addEventListener('click', toggleTimer);
    $('#timerReset').addEventListener('click', () => resetTimer(state.timer.initial));
    $('#timerClose').addEventListener('click', closeTimer);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
      if (!state.currentSession) return;
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    });
  }

  function renderHome() {
    state.currentSession = null; state.quiz = null; closeTimer();
    const cfg = state.data.config || {};
    const sessions = (state.data.sessions || []).sort((a,b) => Number(a.display_order)-Number(b.display_order));
    const identityBlock = state.presentationMode ? `
          <div class="student-chip presentation-chip">
            <span>📽️</span>
            <div><small>MODE PRESENTASI GURU</small><strong>Materi dibuka tanpa mendaftarkan guru; nilai siswa hanya tersimpan saat guru memilih tingkat jawaban atau observasi.</strong></div>
            <button id="studentEdit">Panel Guru</button>
          </div>` : `
          <div class="student-chip ${state.student ? '' : 'empty'}">
            <span>${state.student ? '👋' : '👤'}</span>
            <div><small>${state.student ? 'Peserta aktif · '+esc((state.student.run&&state.student.run.runCode)||'DEMO') : 'Belum terdaftar'}</small><strong>${state.student ? esc(state.student.fullName)+' · '+esc(state.student.className)+(state.student.run?' · '+esc(state.student.run.roomName):'') : 'Masukkan kode sesi sebelum memulai'}</strong></div>
            <button id="studentEdit">${state.student ? 'Ganti sesi' : 'Masuk sesi'}</button>
          </div>`;
    app.innerHTML = `
      <section class="hero ${state.presentationMode?'presentation-hero':''}">
        <div class="hero-copy">
          <span class="eyebrow">${state.presentationMode?'MODE PRESENTASI PEMATERI':'MASA PENGENALAN LINGKUNGAN SEKOLAH'}</span>
          <h1>${esc(state.presentationMode?'Pilih materi dan tampilkan ke kelas':(cfg.tagline || 'Kenali Sekolahmu, Temukan Potensimu!'))}</h1>
          <p>${esc(state.presentationMode?'Gunakan layar penuh, navigasi materi, timer, video, dan diskusi. Guru tidak masuk daftar peserta; penilaian siswa yang dipilih tetap dapat disimpan.':(cfg.welcome || 'Belajar dan bertumbuh bersama.'))}</p>
          ${identityBlock}
        </div>
        <div class="hero-orbit" aria-hidden="true"><span>📚</span><span>🛡️</span><span>🎮</span><span>🌟</span><div class="orbit-core">${state.presentationMode?'▶':'38'}</div></div>
      </section>
      <section class="section-block">
        <div class="section-heading"><div><span class="eyebrow">${state.presentationMode?'PILIH MATERI':'PILIH MISI'}</span><h2>${state.presentationMode?'Materi yang akan ditampilkan':'Dua hari, dua petualangan'}</h2></div>${state.presentationMode?'<button class="text-btn" id="leaderboardButton">← Kembali ke Panel Guru</button>':'<button class="text-btn" id="leaderboardButton">🏆 Lihat Peringkat</button>'}</div>
        <div class="session-grid">${sessions.map(sessionCard).join('')}</div>
      </section>
      <section class="feature-strip">
        <article><span>📽️</span><strong>${state.presentationMode?'Tanpa Registrasi':'Materi Ringkas'}</strong><small>${state.presentationMode?'Guru tidak masuk daftar peserta':'Satu layar, satu tujuan'}</small></article>
        <article><span>🎮</span><strong>Game Edukatif</strong><small>${state.presentationMode?'Untuk diskusi kelas':'Umpan balik langsung'}</small></article>
        <article><span>⏱️</span><strong>Timer Kegiatan</strong><small>Cocok untuk proyektor</small></article>
        <article><span>${state.presentationMode?'🔒':'📝'}</span><strong>${state.presentationMode?'Guru Tidak Terdaftar':'Nilai 0–100'}</strong><small>${state.presentationMode?'Penilaian siswa tetap dapat disimpan':'Tersimpan per ruangan'}</small></article>
      </section>`;
    $('#studentEdit').onclick = state.presentationMode ? (()=>window.location.href='./teacher.html') : openRegistration;
    $('#leaderboardButton').onclick = state.presentationMode ? (()=>window.location.href='./teacher.html') : openLeaderboard;
    $$('.session-card').forEach(card => card.addEventListener('click', () => beginSession(card.dataset.id)));
  }

  function sessionCard(s) {
    const total = (state.data.content || []).filter(c => c.session_id === s.session_id).length || 1;
    const done = state.presentationMode ? 0 : Math.min(total, Number(state.progress[s.session_id] || 0));
    const pct = Math.round(done/total*100);
    return `<button class="session-card ${accentClass(s.accent)}" data-id="${esc(s.session_id)}">
      <div class="session-top"><span class="session-icon">${esc(s.icon)}</span><span class="day-pill">${esc(s.day_label)}</span></div>
      <h3>${esc(s.title)}</h3><p>${esc(s.subtitle)}</p>
      <div class="session-meta"><span>⏱ ${esc(s.duration_minutes)} menit</span><span>${done}/${total} pos</span></div>
      <div class="progress"><i style="width:${pct}%"></i></div><span class="card-cta">${state.presentationMode?'Tampilkan materi →':'Mulai misi →'}</span>
    </button>`;
  }

  function beginSession(id) {
    const go = () => {
      if (!state.presentationMode && window.MPLS_API.isConfigured() && state.student && state.student.run && state.student.run.sessionId !== id) {
        return showModal(`<div class="empty-state"><div class="big-emoji">🔑</div><h2>Kode sesi berbeda</h2><p>Kode <strong>${esc(state.student.run.runCode)}</strong> digunakan untuk <strong>${esc(state.student.run.title)}</strong> di ${esc(state.student.run.roomName)}.</p><button class="primary-action" id="joinOther">Masuk dengan kode lain</button></div>`, root => $('#joinOther',root).onclick = () => openRegistration(go, id));
      }
      state.currentSession = (state.data.sessions || []).find(s => s.session_id === id);
      state.stepIndex = state.presentationMode ? 0 : Math.min(Number(state.progress[id] || 0), Math.max(0, sessionContent().length-1));
      renderSession();
    };
    if (state.presentationMode) go(); else if (!state.student) openRegistration(go, id); else go();
  }

  function sessionContent() {
    if (!state.currentSession) return [];
    return (state.data.content || []).filter(c => c.session_id === state.currentSession.session_id).sort((a,b) => Number(a.display_order)-Number(b.display_order));
  }


  function renderItemContent(item) {
    if (!state.presentationMode || !item.template) return bodyHTML(item.body);
    const cue = item.teacher_cue ? `<aside class="teacher-cue"><span>👩‍🏫</span><div><strong>Panduan Pemateri</strong><p>${esc(item.teacher_cue)}</p></div></aside>` : '';
    if (item.template === 'opening_visual') {
      return `${bodyHTML(item.body)}<div class="visual-story-grid">${(item.visuals||[]).map(v=>`<article><span>${esc(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></article>`).join('')}</div>${cue}`;
    }
    if (item.template === 'trigger_questions') {
      return `${bodyHTML(item.body)}<div class="prompt-preview">${(item.prompts||[]).slice(0,3).map((q,i)=>`<article><span>${i+1}</span><p>${esc(typeof q==='string'?q:(q.question||q.prompt||''))}</p></article>`).join('')}</div>${cue}`;
    }
    if (item.template === 'film') {
      return `<div class="film-feature"><div class="film-poster"><span>🎬</span><small>FILM PENDEK</small><strong>KEMENANGAN<br>SEJATI</strong></div><div>${bodyHTML(item.body)}<div class="watch-focus"><span>1</span> Cara tokoh mulai terlibat <span>2</span> Dampak yang muncul <span>3</span> Keputusan aman</div></div></div>${cue}`;
    }
    if (item.template === 'discussion_flow') {
      return `${bodyHTML(item.body)}<div class="discussion-map"><article><span>🔎</span><strong>Faktor Pemicu</strong><small>Uang instan, tekanan teman, rasa ingin mencoba, kurangnya pengetahuan.</small></article><article><span>⚠️</span><strong>Dampak</strong><small>Keuangan, psikologis, hubungan keluarga, belajar, dan masa depan.</small></article><article><span>🤝</span><strong>Tindakan Aman</strong><small>Berhenti, blokir, simpan bukti seperlunya, dan cari bantuan.</small></article></div>${item.key_message?`<div class="key-message"><strong>Pesan kunci:</strong> ${esc(item.key_message)}</div>`:''}`;
    }
    if (item.template === 'habit_check') {
      return `${bodyHTML(item.body)}<div class="statement-board">${(item.statements||[]).map((x,i)=>`<article><span>${String.fromCharCode(97+i)})</span><strong>${esc(x)}</strong></article>`).join('')}</div>`;
    }
    if (item.template === 'three_s_material') {
      return `${bodyHTML(item.body)}<figure class="three-s-poster"><img src="${esc(item.image_url)}" alt="Infografik Screen Time, Screen Zone, dan Screen Break"><figcaption>Klik tombol di bawah untuk memperbesar infografik dan membuka materi referensi.</figcaption></figure>${cue}`;
    }
    if (item.template === 'group_builder') {
      return `${bodyHTML(item.body)}<div class="group-flow"><article><span>1</span><strong>Atur kelompok</strong><small>Jumlah, nama, dan warna bola.</small></article><article><span>2</span><strong>Masukkan jumlah murid</strong><small>Aplikasi membagi secara merata.</small></article><article><span>3</span><strong>Ambil bola</strong><small>Tampilkan kelompok murid satu per satu.</small></article></div>`;
    }
    if (item.template === 'poster_workshop') {
      return `${bodyHTML(item.body)}<div class="workshop-columns"><section><h3>Alat dan bahan</h3><ul>${(item.materials||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><h3>Langkah kerja</h3><ol>${(item.poster_steps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section></div>`;
    }
    if (item.template === 'group_presentations') {
      return `${bodyHTML(item.body)}<div class="presentation-prompts">${(item.presentation_prompts||[]).map((x,i)=>`<article><span>${i+1}</span><p>${esc(x)}</p></article>`).join('')}</div><div class="feedback-formula"><strong>Umpan balik kelas:</strong> “Satu kekuatan” + “Satu langkah lebih baik”.</div>`;
    }
    if (item.template === 'moral_closing') {
      return `${bodyHTML(item.body)}<div class="moral-grid">${(item.morals||[]).map((x,i)=>`<article><span>${['🛡️','💡','⏱️','🤝','🌟'][i]||'✓'}</span><p>${esc(x)}</p></article>`).join('')}</div>`;
    }
    return bodyHTML(item.body);
  }

  function renderSession() {
    const items = sessionContent(), item = items[state.stepIndex];
    if (!item) return renderHome();
    setProgress(state.currentSession.session_id, state.stepIndex);
    const pct = Math.round((state.stepIndex+1)/items.length*100);
    app.innerHTML = `
      <section class="session-header ${accentClass(state.currentSession.accent)}">
        <button class="back-btn" id="backHome">← ${state.presentationMode?'Pilih Materi':'Beranda'}</button>
        <div>${state.presentationMode?'<span class="presentation-tag">📽️ MODE PRESENTASI · GURU TIDAK MASUK DAFTAR PESERTA</span>':''}<span class="eyebrow">${esc(state.currentSession.day_label)} · ${esc(state.currentSession.duration_minutes)} MENIT</span><h1>${esc(state.currentSession.title)}</h1><p>${esc(state.currentSession.subtitle)}</p></div>
        <div class="session-score"><small>PROGRES</small><strong>${pct}%</strong></div>
      </section>
      <div class="journey-layout ${state.presentationMode?'presentation-wide':''}">
        ${state.presentationMode?'':`<aside class="step-rail" aria-label="Daftar pos">${items.map((x,i) => `<button class="rail-step ${i===state.stepIndex?'active':''} ${i<state.stepIndex?'done':''}" data-step="${i}"><span>${i<state.stepIndex?'✓':i+1}</span><small>${esc(x.title)}</small></button>`).join('')}</aside>`}
        <section class="content-stage">
          <article class="content-card ${accentClass(item.accent)}">
            <div class="content-kicker"><span class="content-icon">${esc(item.icon)}</span><span>${esc(item.activity || ('POS '+(state.stepIndex+1)+' DARI '+items.length))}</span>${state.presentationMode?'<button class="outline-btn" id="openOutline">☰ Daftar Materi</button>':''}<button class="duration-btn" id="durationButton">⏱ ${esc(item.duration_minutes)} menit</button></div>
            ${item.activity_title ? `<div class="activity-banner"><strong>${esc(item.activity_title)}</strong><small>Pos ${state.stepIndex+1} dari ${items.length}</small></div>` : ''}
            <h2>${esc(item.title)}</h2>
            <div class="content-body">${renderItemContent(item)}</div>
            ${actionButton(item)}
          </article>
          <nav class="step-nav"><button id="prevStep" ${state.stepIndex===0?'disabled':''}>← Sebelumnya</button><span>${pct}% selesai</span><button id="nextStep">${state.stepIndex===items.length-1?'Selesaikan':'Berikutnya →'}</button></nav>
        </section>
      </div>`;
    $('#backHome').onclick = renderHome;
    $('#prevStep').onclick = prevStep;
    $('#nextStep').onclick = nextStep;
    $('#durationButton').onclick = () => openTimer(Number(item.duration_minutes)*60);
    $$('.rail-step').forEach(btn => btn.onclick = () => { state.stepIndex = Number(btn.dataset.step); renderSession(); });
    if ($('#openOutline')) $('#openOutline').onclick = () => openPresentationOutline(items);
    const action = $('#contentAction'); if (action) action.onclick = () => runAction(item);
  }

  function openPresentationOutline(items) {
    showModal(`<span class="eyebrow">DAFTAR MATERI</span><h2>Pilih bagian yang akan ditampilkan</h2><div class="outline-list">${items.map((x,i)=>`<button class="outline-item ${i===state.stepIndex?'active':''}" data-step="${i}"><span>${i+1}</span><div><strong>${esc(x.title)}</strong><small>${esc(x.activity||'')}</small></div></button>`).join('')}</div>`, root => {
      $$('.outline-item',root).forEach(btn => btn.onclick = () => { state.stepIndex = Number(btn.dataset.step); closeModal(); renderSession(); });
    });
  }

  function actionButton(item) {
    if (!item.action || item.action === 'none') return '';
    return `<button class="primary-action" id="contentAction">${esc(item.action_label || 'Mulai')} <span>→</span></button>`;
  }

  function prevStep() { if (!state.currentSession) return; if (state.stepIndex > 0) { state.stepIndex--; renderSession(); } }
  function nextStep() {
    if (!state.currentSession) return;
    const items = sessionContent();
    if (state.stepIndex < items.length-1) { state.stepIndex++; setProgress(state.currentSession.session_id, state.stepIndex); renderSession(); }
    else { setProgress(state.currentSession.session_id, items.length); celebrate(); }
  }
  function celebrate() {
    showModal(`<div class="celebrate"><div class="big-emoji">🎉</div><span class="eyebrow">${state.presentationMode?'PRESENTASI SELESAI':'MISI SELESAI'}</span><h2>${esc(state.currentSession.title)} selesai!</h2><p>${state.presentationMode?'Seluruh pos materi telah ditampilkan. Hasil peserta tetap dikumpulkan melalui perangkat siswa dan Panel Guru.':'Kamu sudah melewati seluruh pos. Ingat, nilai terbesar dari kegiatan ini adalah keputusan baik yang kamu praktikkan setelahnya.'}</p><button class="primary-action" id="finishHome">${state.presentationMode?'Pilih Materi Lain':'Kembali ke Beranda'}</button></div>`, root => $('#finishHome',root).onclick = () => { closeModal(); renderHome(); });
  }

  function runAction(item) {
    const action = String(item.action || '');
    if (action === 'open_media') window.open(item.media_url, '_blank', 'noopener');
    else if (action === 'open_film') openFilm(item);
    else if (action === 'guided_prompts') openGuidedPrompts(item);
    else if (action === 'guided_discussion') openGuidedDiscussion(item);
    else if (action === 'prompt_picker') openPromptPicker(item.body);
    else if (action === 'habit_poll') openHabitPoll(item);
    else if (action === 'open_3s_material') openThreeSMaterial(item);
    else if (action === 'group_builder') openGroupBuilder(item);
    else if (action === 'poster_workshop') openPosterWorkshop(item);
    else if (action === 'group_presentations') openGroupPresentations(item);
    else if (action === 'moral_closing') openMoralClosing(item);
    else if (action === 'three_s_cards') openThreeSCards(item.media_url);
    else if (action === 'three_s_mission') openThreeSMission();
    else if (action === 'rubric') openRubric();
    else if (action === 'goal_builder') openGoalBuilder();
    else if (action === 'preference_quiz') startPreferenceQuiz();
    else if (action === 'reflection') openReflection();
    else if (action.startsWith('quiz:')) startQuiz(action.split(':')[1]);
  }


  function openFilm(item) {
    const id = item.youtube_id || 'xJD37cmYPws';
    const direct = item.media_url || `https://youtu.be/${id}`;
    showModal(`<span class="eyebrow">KEGIATAN 1 · MENONTON FILM</span><h2>FILM PENDEK “KEMENANGAN SEJATI”</h2>
      <div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}?rel=0" title="Film Pendek Kemenangan Sejati" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <div class="video-actions"><a class="primary-action" href="${esc(direct)}" target="_blank" rel="noopener">Buka di YouTube ↗</a><button class="secondary-action" id="filmTimer">⏱ Timer ${esc(item.duration_minutes)} Menit</button></div>
      <p class="note"><strong>Fokus pengamatan:</strong> bagaimana tokoh mulai terlibat, dampak yang terjadi, dan keputusan aman yang seharusnya dapat diambil.</p>`, root => {
        $('#filmTimer',root).onclick=()=>{closeModal();openTimer(Number(item.duration_minutes||17)*60);};
      });
  }

  function normalizePrompt(raw,index,prefix) {
    if (typeof raw === 'string') return {id:(prefix||'Q')+'-'+(index+1),question:raw,answer:'Guru menegaskan jawaban yang aman, relevan, dan disertai alasan.'};
    return {id:raw.id||(prefix||'Q')+'-'+(index+1),question:raw.question||raw.prompt||'',answer:raw.answer||raw.modelAnswer||''};
  }

  async function savePromptRating(prompt, studentName, level, source) {
    const context=await requirePresentationContext();
    const meta=levelMeta(level);if(!meta)throw new Error('Pilihan nilai tidak valid.');
    const result=await window.MPLS_API.recordPresentationRating({teacherKey:context.teacherKey,runId:context.runId||preferredRunId,fullName:studentName,className:context.roomName||'Peserta Kelas',promptId:prompt.id,promptText:prompt.question,modelAnswer:prompt.answer,level,source:source||'Pertanyaan Pemantik'});
    return result;
  }

  function openAssessedPromptFlow(item, sourceLabel, closingHtml) {
    const prompts=(item.prompts||[]).map((x,i)=>normalizePrompt(x,i,sourceLabel==='Diskusi Film'?'REF':'PEM'));
    let index=0, revealed=false, studentName='';
    const render=root=>{
      const prompt=prompts[index];
      root.innerHTML=`<span class="eyebrow">${esc(sourceLabel.toUpperCase())} ${index+1} DARI ${prompts.length}</span><div class="prompt-display">${esc(prompt.question)}</div>
        <div class="teacher-instruction"><span>⏳</span><p>Masukkan nama murid yang akan menjawab. Beri waktu berpikir, dengarkan jawabannya, lalu tampilkan jawaban acuan.</p></div>
        <label class="answering-student">Nama murid yang menjawab<input id="answerStudentName" value="${esc(studentName)}" placeholder="Ketik nama sebelum murid menjawab"></label>
        ${revealed?`<section class="model-answer"><span>JAWABAN ACUAN / PENGUATAN</span><p>${esc(prompt.answer)}</p></section><section class="rating-panel"><strong>Nilai kualitas jawaban</strong><small>Tiga jawaban terbaik dihitung: Cukup 3 poin, Baik 5 poin, Baik Sekali 7 poin; maksimum 20.</small><div class="rating-range"><button data-level="cukup" class="rate-answer enough">Cukup</button><button data-level="baik" class="rate-answer good">Baik</button><button data-level="baik_sekali" class="rate-answer excellent">Baik Sekali</button></div></section>`:''}
        <div class="modal-nav"><button class="secondary-action" id="promptPrev" ${index===0?'disabled':''}>← Sebelumnya</button><button class="secondary-action" id="thinkTimer">Timer 30 Detik</button>${revealed?'<button class="secondary-action" id="hideAnswer">Sembunyikan Jawaban</button>':'<button class="primary-action" id="revealAnswer">Tampilkan Jawaban Acuan</button>'}<button class="primary-action" id="promptNext">${index===prompts.length-1?'Selesai':'Pertanyaan Berikutnya →'}</button></div>`;
      const nameInput=$('#answerStudentName',root);nameInput.oninput=()=>studentName=nameInput.value;
      $('#promptPrev',root).onclick=()=>{if(index>0){index--;revealed=false;studentName='';render(root);}};
      $('#thinkTimer',root).onclick=()=>openTimer(30);
      if($('#revealAnswer',root))$('#revealAnswer',root).onclick=()=>{studentName=String(nameInput.value||'').trim();if(!studentName)return toast('Masukkan nama murid yang menjawab terlebih dahulu.','warning');revealed=true;render(root);};
      if($('#hideAnswer',root))$('#hideAnswer',root).onclick=()=>{revealed=false;render(root);};
      $$('.rate-answer',root).forEach(btn=>btn.onclick=async()=>{const chosen=String(nameInput.value||studentName).trim();if(!chosen)return toast('Nama murid belum diisi.','warning');$$('.rate-answer',root).forEach(x=>x.disabled=true);try{const r=await savePromptRating(prompt,chosen,btn.dataset.level,sourceLabel);toast(`Nilai ${r.ratingLabel} tersimpan untuk ${chosen}. Bernalar sementara ${r.reasoningScore}/20 dari ${r.evidenceCount} jawaban dinilai.`,'success');btn.classList.add('saved-rating');}catch(err){toast(err.message,'error');$$('.rate-answer',root).forEach(x=>x.disabled=false);}});
      $('#promptNext',root).onclick=()=>{if(index<prompts.length-1){index++;revealed=false;studentName='';render(root);}else{$('#modalContent').innerHTML=closingHtml||'<div class="celebrate"><div class="big-emoji">🙌</div><h2>Terima kasih atas jawaban kalian</h2><p>Guru memberi penguatan tanpa menghakimi pengalaman siapa pun.</p></div>';}};
    };
    showModal('<div></div>',render);
  }

  function openGuidedPrompts(item) {
    openAssessedPromptFlow(item,'Pertanyaan Pemantik','<div class="celebrate"><div class="big-emoji">🙌</div><h2>Terima kasih atas jawaban kalian</h2><p>Tekankan bahwa kita sedang belajar mengenali risiko dan menjaga diri, bukan menghakimi pengalaman siapa pun.</p></div>');
  }

  function openGuidedDiscussion(item) {
    openAssessedPromptFlow(item,'Diskusi Film',`<div class="celebrate"><div class="big-emoji">🤝</div><span class="eyebrow">PESAN KUNCI</span><h2>Berani mencari bantuan</h2><p>${esc(item.key_message||'')}</p></div>`);
  }

  function openThreeSMaterial(item) {
    showModal(`<span class="eyebrow">MATERI PRINSIP 3S</span><h2>Screen Time, Screen Zone, dan Screen Break</h2>
      <figure class="material-lightbox"><img src="${esc(item.image_url||'./assets/materi-prinsip-3s.jpg')}" alt="Materi prinsip 3S"></figure>
      <div class="video-actions"><a class="primary-action" href="${esc(item.media_url||'#')}" target="_blank" rel="noopener">Buka Materi Google Drive ↗</a><button class="secondary-action" id="threeSTimer">Timer 4 Menit</button></div>
      <div class="three-grid compact-three"><article><span>⏱️</span><h3>Screen Time</h3><small>Batasi durasi menatap layar agar mata, tidur, gerak, dan emosi tetap terjaga.</small></article><article><span>📍</span><h3>Screen Zone</h3><small>Sepakati tempat dan situasi yang boleh atau tidak boleh memakai gawai.</small></article><article><span>🌿</span><h3>Screen Break</h3><small>Ambil jeda untuk melihat jauh, bergerak, minum, meregangkan tubuh, dan berinteraksi.</small></article></div>`, root=>{
        $('#threeSTimer',root).onclick=()=>{closeModal();openTimer(4*60);};
      });
  }

  function shuffleArray(values) {
    const a=values.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }

  function openGroupBuilder(item) {
    const palette = [
      {name:'Biru',hex:'#2563eb'},{name:'Hijau',hex:'#16a34a'},{name:'Kuning',hex:'#eab308'},
      {name:'Merah',hex:'#dc2626'},{name:'Ungu',hex:'#7c3aed'},{name:'Oranye',hex:'#ea580c'},
      {name:'Merah Muda',hex:'#db2777'},{name:'Toska',hex:'#0891b2'}
    ];
    const suggested = item.suggested_groups || ['Screen Time','Screen Zone','Screen Break'];
    showModal(`<span class="eyebrow">PEMBAGI KELOMPOK BERWARNA</span><h2>Bagi anggota secara merata</h2><p>Masukkan jumlah murid, atur nama kelompok dan warna bola, kemudian panggil murid satu per satu untuk mengambil undian.</p>
      <form id="groupSetup" class="form-stack">
        <div class="form-row"><label>Jumlah murid<input type="number" name="studentCount" min="1" max="100" value="30" required></label><label>Jumlah kelompok<select name="groupCount">${[2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===3?'selected':''}>${n} kelompok</option>`).join('')}</select></label></div>
        <div id="groupFields" class="group-field-list"></div>
        <button class="primary-action" type="submit">Siapkan Undian Bola</button>
      </form>`, root=>{
        const form=$('#groupSetup',root), fields=$('#groupFields',root), countSelect=form.elements.groupCount;
        const drawFields=()=>{
          const count=Number(countSelect.value);
          fields.innerHTML=Array.from({length:count},(_,i)=>`<div class="group-field"><span class="group-number">${i+1}</span><label>Nama kelompok<input name="groupName${i}" value="${esc(suggested[i]||('Kelompok '+(i+1)))}" required></label><label>Nama ketua<input name="groupLeader${i}" placeholder="Diisi setelah anggota terbentuk"></label><label>Warna bola<select name="groupColor${i}">${palette.map((c,j)=>`<option value="${c.hex}|${c.name}" ${j===i?'selected':''}>${c.name}</option>`).join('')}</select></label></div>`).join('');
        };
        countSelect.onchange=drawFields;drawFields();
        form.onsubmit=e=>{
          e.preventDefault();const fd=new FormData(form), total=Number(fd.get('studentCount')), count=Number(fd.get('groupCount'));
          const groups=Array.from({length:count},(_,i)=>{const [color,colorName]=String(fd.get('groupColor'+i)).split('|');return {id:'GRP-'+(i+1),name:String(fd.get('groupName'+i)||('Kelompok '+(i+1))),leaderName:String(fd.get('groupLeader'+i)||'').trim(),color,colorName};});
          const assignments=shuffleArray(Array.from({length:total},(_,i)=>i%count));
          state.presentationGroups={groups,assignments,cursor:0,results:[]};
          renderGroupDraw(root);
        };
      });
  }

  function renderGroupDraw(root) {
    const data=state.presentationGroups;
    if(!data) return;
    const last=data.results[data.results.length-1], remaining=data.assignments.length-data.cursor;
    const counts=data.groups.map(g=>data.results.filter(r=>String(r.groupId)===String(g.id)).length);
    root.innerHTML=`<span class="eyebrow">UNDIAN KELOMPOK · ${data.cursor}/${data.assignments.length} MURID</span><h2>Ambil Bola Kelompok</h2>
      <div class="draw-stage">${last?`<div class="color-ball" style="--ball:${esc(last.color)}"><span>${esc(last.number)}</span></div><h3>${esc(last.studentName)}</h3><p>Masuk ke <strong style="color:${esc(last.color)}">${esc(last.groupName)}</strong> · Bola ${esc(last.colorName)}</p>`:`<div class="color-ball waiting"><span>?</span></div><h3>Siap untuk murid pertama</h3><p>Masukkan nama bila diperlukan, kemudian klik Ambil Bola.</p>`}</div>
      <label class="inline-name">Nama murid (opsional)<input id="drawStudentName" placeholder="Kosongkan untuk Murid ${data.cursor+1}" ${remaining===0?'disabled':''}></label>
      <div class="draw-actions"><button class="primary-action" id="drawNext" ${remaining===0?'disabled':''}>🎱 Ambil Bola ${remaining?`(${remaining} tersisa)`:''}</button><button class="secondary-action" id="drawReset">Atur Ulang</button></div>
      <div class="group-summary">${data.groups.map((g,i)=>`<article><i style="background:${esc(g.color)}"></i><strong>${esc(g.name)}</strong><small>${counts[i]} anggota</small>${remaining===0?`<label class="leader-final">Ketua kelompok<input data-leader-group="${esc(g.id)}" value="${esc(g.leaderName||'')}" placeholder="Ketik nama ketua"></label>`:(g.leaderName?`<small>Ketua: ${esc(g.leaderName)}</small>`:'')}</article>`).join('')}</div>
      ${remaining===0?'<div class="key-message"><strong>Pembagian selesai.</strong> Semua murid telah terbagi secara merata. <button class="primary-action compact-save" id="saveGroupsToTeacher">Simpan Kelompok ke Panel Guru</button></div>':''}`;
    $('#drawNext',root).onclick=()=>{
      if(data.cursor>=data.assignments.length)return;
      const group=data.groups[data.assignments[data.cursor]], name=String($('#drawStudentName',root).value||'').trim()||`Murid ${data.cursor+1}`;
      data.results.push({number:data.cursor+1,studentName:name,groupId:group.id,groupName:group.name,color:group.color,colorName:group.colorName});data.cursor++;renderGroupDraw(root);
    };
    if($('#saveGroupsToTeacher',root))$('#saveGroupsToTeacher',root).onclick=async()=>{
      try{const context=await requirePresentationContext();$$('[data-leader-group]',root).forEach(input=>{const g=data.groups.find(x=>String(x.id)===String(input.dataset.leaderGroup));if(g)g.leaderName=String(input.value||'').trim();});const payloadGroups=data.groups.map(g=>({groupId:g.id,groupName:g.name,color:g.color,colorName:g.colorName,leaderName:g.leaderName,members:data.results.filter(r=>String(r.groupId)===String(g.id)).map(r=>r.studentName)}));await window.MPLS_API.saveGroupSetup({teacherKey:context.teacherKey,runId:context.runId||preferredRunId,groups:payloadGroups});toast('Kelompok dan nama anggota tersimpan di Panel Guru.','success');$('#saveGroupsToTeacher',root).disabled=true;$('#saveGroupsToTeacher',root).textContent='✓ Tersimpan';}catch(err){toast(err.message,'error');}
    };
    $('#drawReset',root).onclick=()=>{state.presentationGroups=null;closeModal();openGroupBuilder({suggested_groups:['Screen Time','Screen Zone','Screen Break']});};
  }

  function activeGroupList() {
    return state.presentationGroups && state.presentationGroups.groups ? state.presentationGroups.groups : [
      {name:'Screen Time',color:'#2563eb',colorName:'Biru'},
      {name:'Screen Zone',color:'#16a34a',colorName:'Hijau'},
      {name:'Screen Break',color:'#eab308',colorName:'Kuning'}
    ];
  }

  function openPosterWorkshop(item) {
    const groups=activeGroupList();
    const missionText=name=>/time/i.test(name)?'Buat poster tentang waktu menatap layar, menonton TV, atau bermain gim.':/zone/i.test(name)?'Buat poster aturan tempat di sekolah atau rumah yang boleh dan tidak boleh menggunakan gawai.':/break/i.test(name)?'Buat poster kegiatan bermakna yang dapat dilakukan selain menatap layar.':'Buat poster kampanye digital sehat sesuai prinsip 3S.';
    const showTasks=root=>{root.innerHTML=`<span class="eyebrow">LOKAKARYA POSTER</span><h2>Setiap kelompok mulai berkarya</h2><div class="mission-group-grid">${groups.map(g=>`<article style="--group-color:${esc(g.color)}"><i></i><h3>${esc(g.name)}</h3><p>${esc(missionText(g.name))}</p></article>`).join('')}</div><div class="workshop-columns modal-workshop"><section><h3>Alat dan bahan</h3><ul>${(item.materials||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><h3>Langkah kerja</h3><ol>${(item.poster_steps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section></div><div class="privacy-note">🔒 Penilaian setiap anggota dan kualitas poster dilakukan di tab <strong>Kelompok & Poster</strong> pada Panel Guru, sehingga tidak terlihat oleh kelas.</div><div class="video-actions"><button class="primary-action" id="posterTimer">⏱ Mulai Timer ${esc(item.duration_minutes||10)} Menit</button><button class="secondary-action" id="posterRubric">Lihat Fokus Penilaian</button></div>`;$('#posterTimer',root).onclick=()=>{closeModal();openTimer(Number(item.duration_minutes||10)*60);};$('#posterRubric',root).onclick=openRubric;};
    showModal(`<span class="eyebrow">CONTOH SEBELUM BERKARYA</span><h2>Struktur poster yang baik</h2><p>Poster harus dapat dipahami dalam beberapa detik: judul kuat, gambar relevan, pesan singkat, tindakan nyata, dan ajakan yang mudah diingat.</p><div class="sample-poster"><div class="sample-poster-badge">KAMPANYE 3S</div><h3>ISTIRAHATKAN LAYAR,<br>SEGARKAN TUBUH!</h3><div class="sample-poster-visual"><span>📱</span><b>30 MENIT</b><span>→</span><span>🌿</span></div><ul><li>Lihat jauh selama 20 detik</li><li>Berdiri dan regangkan tubuh</li><li>Minum air dan ngobrol dengan teman</li></ul><strong class="sample-call">Ayo ambil SCREEN BREAK sekarang!</strong></div><div class="poster-anatomy"><article><span>1</span><b>Judul</b><small>Besar, singkat, mudah dibaca.</small></article><article><span>2</span><b>Gambar</b><small>Mendukung pesan, bukan sekadar hiasan.</small></article><article><span>3</span><b>Isi</b><small>3–5 tindakan nyata.</small></article><article><span>4</span><b>Ajakan</b><small>Kalimat penutup yang kuat.</small></article></div><button class="primary-action" id="continuePosterTask">Saya Paham, Lanjut ke Tugas Kelompok →</button>`,root=>{$('#continuePosterTask',root).onclick=()=>showTasks(root);});
  }

  function openGroupPresentations(item) {
    const groups=activeGroupList();let index=0;
    const render=root=>{
      const g=groups[index];
      root.innerHTML=`<span class="eyebrow">PRESENTASI ${index+1} DARI ${groups.length}</span><div class="presenting-group" style="--group-color:${esc(g.color)}"><i></i><small>KELOMPOK YANG TAMPIL</small><h2>${esc(g.name)}</h2></div><div class="presentation-prompts modal-prompts">${(item.presentation_prompts||[]).map((x,i)=>`<article><span>${i+1}</span><p>${esc(x)}</p></article>`).join('')}</div><div class="feedback-formula"><strong>Teman memberikan:</strong> satu kekuatan + satu langkah lebih baik.</div><div class="modal-nav"><button class="secondary-action" id="groupTimer">⏱ Timer 2 Menit</button><button class="primary-action" id="nextGroup">${index===groups.length-1?'Selesaikan Presentasi':'Kelompok Berikutnya →'}</button></div>`;
      $('#groupTimer',root).onclick=()=>openTimer(2*60);
      $('#nextGroup',root).onclick=()=>{if(index<groups.length-1){index++;render(root);}else{$('#modalContent').innerHTML='<div class="celebrate"><div class="big-emoji">👏</div><h2>Apresiasi untuk semua kelompok</h2><p>Setiap karya membawa pesan penting untuk menggunakan teknologi secara sehat, aman, dan seimbang.</p></div>';}};
    };
    showModal('<div></div>',render);
  }

  function openMoralClosing(item) {
    const morals=item.morals||[];let index=0;
    const render=root=>{
      root.innerHTML=`<div class="moral-stage"><span class="eyebrow">PESAN PENGUATAN ${index+1} DARI ${morals.length}</span><div class="moral-icon">${['🛡️','💡','⏱️','🤝','🌟'][index]||'🌟'}</div><h2>${esc(morals[index]||item.body)}</h2><p>Kemenangan sejati adalah mampu menjaga diri, membuat pilihan yang bertanggung jawab, dan berani meminta bantuan.</p><div class="modal-nav"><button class="secondary-action" id="moralPrev" ${index===0?'disabled':''}>← Sebelumnya</button><button class="primary-action" id="moralNext">${index===morals.length-1?'Tutup dengan Komitmen':'Pesan Berikutnya →'}</button></div></div>`;
      $('#moralPrev',root).onclick=()=>{if(index>0){index--;render(root);}};
      $('#moralNext',root).onclick=()=>{if(index<morals.length-1){index++;render(root);}else{$('#modalContent').innerHTML='<div class="celebrate"><div class="big-emoji">✋</div><span class="eyebrow">KOMITMEN KELAS</span><h2>“Saya memilih aman, seimbang, dan bertanggung jawab di dunia digital.”</h2><p>Ajak seluruh murid membaca kalimat komitmen bersama-sama.</p></div>';}};
    };
    showModal('<div></div>',render);
  }

  function openRegistration(after, preferredSessionId) {
    if (state.presentationMode) return toast('Mode presentasi tidak memerlukan pendaftaran peserta.', 'info');
    const s = state.student || {}, run = s.run || {};
    const preferred = (state.data.sessions || []).find(x => x.session_id === preferredSessionId);
    showModal(`<span class="eyebrow">MASUK SESI MPLS</span><h2>Daftar cepat sebelum memulai</h2><p>Masukkan kode yang ditampilkan guru. Nama lengkap hanya berada pada data privat; papan apresiasi memakai alias.</p>
      <form id="registrationForm" class="form-stack">
        <label>Kode sesi<input name="runCode" maxlength="10" value="${esc(run.runCode||preferredJoinCode||'')}" placeholder="Contoh: LIT38A" required autocapitalize="characters"></label>
        <label>Nama lengkap<input name="fullName" maxlength="100" value="${esc(s.fullName||'')}" required autocomplete="name"></label>
        <label>Kelas/kelompok<input name="className" maxlength="40" value="${esc(s.className||'')}" placeholder="Contoh: VII-A" required></label>
        ${preferred ? `<div class="note">Materi yang dipilih: <strong>${esc(preferred.title)}</strong></div>` : ''}
        <button class="primary-action" type="submit">Simpan dan Mulai</button>
      </form>
      <p class="assist-note">Tidak membawa HP? Guru dapat menambahkan nama melalui menu <strong>Tambah Kandidat Tanpa HP</strong> pada Panel Guru.</p>`, root => {
        $('#registrationForm',root).onsubmit = async e => {
          e.preventDefault(); const form = new FormData(e.currentTarget);
          const payload = {runCode:String(form.get('runCode')||'').trim().toUpperCase(), fullName:String(form.get('fullName')||'').trim(), className:String(form.get('className')||'').trim()};
          if (!payload.runCode || !payload.fullName || !payload.className) return toast('Kode sesi, nama, dan kelas wajib diisi.', 'error');
          const btn = $('button[type=submit]',root); btn.disabled=true; btn.textContent='Memeriksa kode...';
          try {
            let result;
            if (window.MPLS_API.isConfigured()) result = await window.MPLS_API.registerStudent(payload);
            else {
              const session=(state.data.sessions||[]).find(x=>x.session_id===preferredSessionId)||(state.data.sessions||[])[0];
              result={student:{studentId:'DEMO-'+Date.now(),fullName:payload.fullName,className:payload.className,alias:'Bintang-Demo'},run:{runId:'RUN-DEMO',runCode:payload.runCode,sessionId:session.session_id,title:session.title,roomName:'Ruang Demo',status:'open'}};
            }
            state.student = Object.assign({}, result.student, {run:result.run}); saveJSON('mpls_student', state.student); closeModal(); toast('Selamat datang, '+state.student.fullName+'!', 'success');
            if (after) after(); else renderHome();
          } catch(err) { toast(err.message, 'error'); btn.disabled=false; btn.textContent='Simpan dan Mulai'; }
        };
      });
  }

  function openPromptPicker(body) {
    const prompts = cleanLines(body).filter(l => /^[•\-]/.test(l)).map(l => l.replace(/^[•\-]\s*/,''));
    let current = prompts[Math.floor(Math.random()*prompts.length)];
    showModal(`<div class="prompt-picker"><span class="eyebrow">PERTANYAAN DISKUSI</span><div class="prompt-display" id="promptDisplay">${esc(current)}</div><button class="primary-action" id="shufflePrompt">🎲 Acak Lagi</button></div>`, root => {
      $('#shufflePrompt',root).onclick = () => { current = prompts[Math.floor(Math.random()*prompts.length)]; $('#promptDisplay',root).textContent=current; };
    });
  }

  function openHabitPoll(item) {
    const items = (item && item.statements) || ['Main gim sampai lupa waktu','Tidur terlalu malam karena gawai','Makan sambil menonton','Belajar sambil membuka terlalu banyak aktivitas'];
    showModal(`<span class="eyebrow">CEK KEBIASAAN</span><h2>Pilih yang pernah terjadi</h2><p>Jawaban hanya ditampilkan di perangkat ini dan tidak digunakan untuk mempermalukan peserta.</p><div class="check-list">${items.map((x,i)=>`<label><input type="checkbox" value="${i}"><span>${esc(x)}</span></label>`).join('')}</div><button class="primary-action" id="pollResult">Lihat Pesan</button>`, root => {
      $('#pollResult',root).onclick = () => {
        const n = $$('input:checked',root).length;
        $('#modalContent').innerHTML = `<div class="celebrate"><div class="big-emoji">${n===0?'🌟':n<3?'🧭':'🛡️'}</div><h2>${n===0?'Pertahankan kebiasaan baikmu!':n<3?'Pilih satu kebiasaan untuk diperbaiki':'Mulai dari satu perubahan kecil'}</h2><p>${n===0?'Tetap gunakan 3S agar seimbang.':n<3?'Tidak perlu mengubah semuanya sekaligus. Gunakan satu aturan 3S yang realistis.':'Minta dukungan keluarga atau guru dan mulai dari perubahan yang paling mudah dilakukan.'}</p></div>`;
      };
    });
  }

  function openThreeSCards(url) {
    const cards = [
      ['⏱️','Screen Time','Kapan dan berapa lama layar digunakan.','Contoh: gim maksimal 30 menit setelah tugas selesai.'],
      ['📍','Screen Zone','Tempat atau situasi penggunaan gawai.','Contoh: tidak memakai gawai saat makan dan diskusi.'],
      ['🌿','Screen Break','Jeda nyata dari layar untuk kegiatan bermakna.','Contoh: bergerak, membaca, berkreasi, atau berbicara.']
    ];
    showModal(`<span class="eyebrow">PRINSIP 3S</span><h2>Tiga kendali untuk hidup digital seimbang</h2><div class="three-grid">${cards.map(c=>`<article><span>${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><small>${c[3]}</small></article>`).join('')}</div>${url?`<a class="secondary-action" href="${esc(url)}" target="_blank" rel="noopener">Buka materi referensi ↗</a>`:''}`);
  }

  function openThreeSMission() {
    const missions = [
      ['SCREEN TIME','Buat aturan waktu layar yang jelas, realistis, dan dapat dipantau.','⏱️'],
      ['SCREEN ZONE','Tentukan tempat/situasi yang boleh dan tidak boleh untuk memakai gawai.','📍'],
      ['SCREEN BREAK','Susun kegiatan bermakna yang dapat dilakukan selama jeda layar.','🌿']
    ];
    const pick = () => missions[Math.floor(Math.random()*missions.length)];
    let m=pick();
    showModal(`<div class="mission-random"><span class="eyebrow">MISI KELOMPOK</span><div class="big-emoji" id="missionIcon">${m[2]}</div><h2 id="missionTitle">${m[0]}</h2><p id="missionText">${m[1]}</p><button class="primary-action" id="missionShuffle">🎲 Acak Misi</button><button class="secondary-action" id="missionTimer">Mulai Timer 20 Menit</button></div>`, root => {
      $('#missionShuffle',root).onclick=()=>{m=pick();$('#missionIcon',root).textContent=m[2];$('#missionTitle',root).textContent=m[0];$('#missionText',root).textContent=m[1];};
      $('#missionTimer',root).onclick=()=>{closeModal();openTimer(20*60);};
    });
  }

  function openRubric() {
    showModal(`<span class="eyebrow">RUBRIK KAMPANYE 3S</span><h2>Apresiasi karya kelompok</h2><div class="rubric-grid"><article><strong>30%</strong><span>Pesan jelas</span></article><article><strong>25%</strong><span>Solusi realistis</span></article><article><strong>20%</strong><span>Kreativitas</span></article><article><strong>25%</strong><span>Kerja sama</span></article></div><p class="note">Gunakan umpan balik: “Satu Kekuatan” dan “Satu Langkah Lebih Baik”.</p>`);
  }

  function openGoalBuilder() {
    showModal(`<span class="eyebrow">TUJUAN BELAJAR</span><h2>Satu langkah kecil untuk satu bulan pertama</h2><form id="goalForm" class="form-stack"><label>Saya ingin lebih baik dalam ...<input name="goal" required></label><label>Karena ...<textarea name="reason" rows="2" required></textarea></label><label>Langkah kecil saya ...<textarea name="step" rows="2" required></textarea></label><button class="primary-action" type="submit">Buat Kartu Tujuan</button></form>`, root => {
      $('#goalForm',root).onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);$('#modalContent').innerHTML=`<div class="goal-card"><span>🎯 TUJUAN SAYA</span><h2>${esc(f.get('goal'))}</h2><p><strong>Alasan:</strong> ${esc(f.get('reason'))}</p><p><strong>Langkah kecil:</strong> ${esc(f.get('step'))}</p><small>Simpan dengan tangkapan layar atau tulis pada kartu komitmen.</small></div>`;};
    });
  }

  function getQuestions(category) { return (state.data.questions || []).filter(q => q.category === category).sort((a,b)=>Number(a.display_order)-Number(b.display_order)); }

  function startQuiz(category) {
    const questions = getQuestions(category);
    if (!questions.length) return toast('Pertanyaan belum tersedia.', 'warning');
    state.quiz = {category, questions, index:0, score:0, startedAt:Date.now(), answered:false};
    renderQuiz();
  }

  function renderQuiz() {
    const qz=state.quiz, q=qz.questions[qz.index];
    app.innerHTML=`<section class="quiz-shell ${accentClass(state.currentSession ? state.currentSession.accent : 'violet')}">
      <div class="quiz-top"><button id="quitQuiz" class="back-btn">← Keluar</button><div class="quiz-progress"><i style="width:${Math.round((qz.index)/qz.questions.length*100)}%"></i></div><strong>${qz.index+1}/${qz.questions.length}</strong></div>
      <article class="quiz-card"><span class="eyebrow">TANTANGAN ${esc(qz.category.replaceAll('_',' ').toUpperCase())}</span><h2>${esc(q.prompt)}</h2><div class="option-grid">${['A','B','C','D'].filter(k=>q['option_'+k.toLowerCase()]).map(k=>`<button class="option-btn" data-answer="${k}"><span>${k}</span>${esc(q['option_'+k.toLowerCase()])}</button>`).join('')}</div><div id="feedback"></div></article>
      <div class="quiz-score">⭐ Poin sesi: <strong>${qz.score}</strong></div></section>`;
    $('#quitQuiz').onclick=renderSession;
    $$('.option-btn').forEach(btn=>btn.onclick=()=>answerQuiz(btn.dataset.answer));
  }

  async function answerQuiz(answer) {
    const qz=state.quiz, q=qz.questions[qz.index]; if(qz.answered)return; qz.answered=true;
    $$('.option-btn').forEach(b=>b.disabled=true);
    let result;
    try {
      if (!state.presentationMode && window.MPLS_API.isConfigured()) result = await window.MPLS_API.submitResponse({runId:state.student.run&&state.student.run.runId,studentId:state.student.studentId,questionId:q.question_id,answer,responseTimeSec:Math.round((Date.now()-qz.startedAt)/1000)});
      else {
        const local=(window.MPLS_FALLBACK_DATA.questions||[]).find(x=>x.question_id===q.question_id);
        const ok=String(local.correct_answer).toUpperCase()===answer;
        result={isCorrect:ok,points:ok?Number(local.points||0):0,correctAnswer:local.correct_answer,explanation:local.explanation};
      }
    } catch(err) { toast('Jawaban tersimpan lokal: '+err.message,'warning'); const local=(window.MPLS_FALLBACK_DATA.questions||[]).find(x=>x.question_id===q.question_id); const ok=String(local.correct_answer).toUpperCase()===answer; result={isCorrect:ok,points:ok?Number(local.points||0):0,correctAnswer:local.correct_answer,explanation:local.explanation}; }
    qz.score += Number(result.points||0);
    $$('.option-btn').forEach(b=>{if(b.dataset.answer===result.correctAnswer)b.classList.add('correct');else if(b.dataset.answer===answer&&!result.isCorrect)b.classList.add('wrong');});
    $('#feedback').innerHTML=`<div class="feedback ${result.isCorrect?'good':'try'}"><strong>${result.isCorrect?'✅ Tepat!':'🔎 Belum tepat'}</strong><p>${esc(result.explanation||'Coba periksa kembali alasanmu.')}</p><button class="primary-action" id="quizNext">${qz.index===qz.questions.length-1?'Lihat Hasil':'Soal Berikutnya'}</button></div>`;
    $('#quizNext').onclick=()=>{if(qz.index<qz.questions.length-1){qz.index++;qz.startedAt=Date.now();qz.answered=false;renderQuiz();}else renderQuizResult();};
  }

  function renderQuizResult() {
    const qz=state.quiz, max=qz.questions.reduce((s,q)=>s+Number(q.points||0),0), pct=max?Math.round(qz.score/max*100):0;
    app.innerHTML=`<section class="result-screen"><div class="result-ring" style="--score:${pct}"><strong>${pct}%</strong></div><span class="eyebrow">TANTANGAN SELESAI</span><h1>${pct>=80?'Hebat, alasanmu kuat!':pct>=60?'Bagus, terus perkuat!':'Belajar dari umpan balik'}</h1><p>${state.presentationMode?'Skor simulasi kelas':'Kamu memperoleh'} <strong>${qz.score}</strong> dari ${max} poin. ${state.presentationMode?'Nilai ini tidak disimpan dan dapat digunakan sebagai bahan diskusi.':'Yang terpenting adalah memahami alasan di balik setiap keputusan.'}</p><div class="result-actions"><button class="primary-action" id="backMaterial">Kembali ke Materi</button><button class="secondary-action" id="retryQuiz">Ulangi Tantangan</button></div></section>`;
    $('#backMaterial').onclick=renderSession; $('#retryQuiz').onclick=()=>startQuiz(qz.category);
  }

  function startPreferenceQuiz() {
    const questions=getQuestions('preference'); if(!questions.length)return toast('Pertanyaan belum tersedia.','warning');
    state.quiz={category:'preference',questions,index:0,tally:{A:0,B:0,C:0}}; renderPreferenceQuestion();
  }
  function renderPreferenceQuestion() {
    const qz=state.quiz,q=qz.questions[qz.index];
    showModal(`<span class="eyebrow">PREFERENSI BELAJAR · ${qz.index+1}/${qz.questions.length}</span><h2>${esc(q.prompt)}</h2><div class="option-grid compact">${['A','B','C'].map(k=>`<button class="option-btn preference" data-answer="${k}"><span>${k}</span>${esc(q['option_'+k.toLowerCase()])}</button>`).join('')}</div>`,root=>$$('.option-btn',root).forEach(btn=>btn.onclick=()=>{qz.tally[btn.dataset.answer]++; if(qz.index<qz.questions.length-1){qz.index++;renderPreferenceQuestion();}else showPreferenceResult();}));
  }
  function showPreferenceResult() {
    const t=state.quiz.tally,max=Math.max(t.A,t.B,t.C),winners=Object.keys(t).filter(k=>t[k]===max);
    const map={A:['Mendengar & Berdiskusi','Coba menjelaskan dengan suara, bertanya, berdiskusi, dan membuat rekaman ringkas.','👂'],B:['Melihat & Menata Visual','Coba diagram, peta konsep, contoh visual, teks terstruktur, dan penandaan poin penting.','👀'],C:['Mencoba & Membuat','Coba praktik, manipulasi objek, simulasi, membuat contoh, dan menulis dengan tangan.','🖐️']};
    const title=winners.length>1?'Preferensimu cukup beragam':map[winners[0]][0];
    const tips=winners.map(k=>map[k][1]).join(' '),icons=winners.map(k=>map[k][2]).join(' ');
    $('#modalContent').innerHTML=`<div class="celebrate"><div class="big-emoji">${icons}</div><span class="eyebrow">HASIL SEMENTARA</span><h2>${esc(title)}</h2><p>${esc(tips)}</p><div class="note"><strong>Penting:</strong> Ini bukan label kecerdasan atau batas kemampuan. Gabungkan beberapa strategi dan pilih berdasarkan materi serta hasil belajarmu.</div><button class="primary-action" id="preferenceDone">Selesai</button></div>`;
    $('#preferenceDone').onclick=closeModal;
  }

  function openReflection() {
    const sessionId=state.currentSession.session_id;
    let prompts=(state.data.reflectionPrompts||{})[sessionId];
    if (!prompts || prompts.length<2) prompts = sessionId==='DIGI-WED' ? window.MPLS_FALLBACK_DATA.reflectionPrompts['DIGI-WED'] : window.MPLS_FALLBACK_DATA.reflectionPrompts['CURR-THU'];
    if (state.presentationMode) {
      return showModal(`<span class="eyebrow">REFLEKSI KELAS</span><h2>Pilih pertanyaan untuk ditanggapi peserta</h2><div class="reflection-prompt-list">${prompts.slice(0,4).map((p,i)=>`<article><span>${i+1}</span><p>${esc(p)}</p></article>`).join('')}</div><div class="note"><strong>Mode presentasi:</strong> jawaban tidak disimpan dari layar guru. Peserta dapat mengirim refleksi melalui perangkatnya, sedangkan siswa tanpa HP dapat dicatat dari Panel Guru.</div>`);
    }
    showModal(`<span class="eyebrow">REFLEKSI PRIBADI</span><h2>Apa yang akan kamu bawa pulang?</h2><form id="reflectionForm" class="form-stack">${prompts.slice(0,4).map((p,i)=>`<label>${esc(p)}<textarea name="a${i}" rows="2" required></textarea></label>`).join('')}<button class="primary-action" type="submit">Simpan Refleksi</button></form>`,root=>{
      $('#reflectionForm',root).onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),answers=prompts.slice(0,4).map((_,i)=>String(f.get('a'+i)||'').trim());const btn=$('button[type=submit]',root);btn.disabled=true;btn.textContent='Menyimpan...';try{if(window.MPLS_API.isConfigured())await window.MPLS_API.submitReflection({runId:state.student.run&&state.student.run.runId,studentId:state.student.studentId,sessionId,answers});$('#modalContent').innerHTML=`<div class="celebrate"><div class="big-emoji">🌱</div><h2>Refleksimu tersimpan</h2><p>Satu langkah kecil yang dilakukan berulang dapat menjadi perubahan besar.</p></div>`;}catch(err){toast(err.message,'error');btn.disabled=false;btn.textContent='Simpan Refleksi';}};
    });
  }

  async function openLeaderboard() {
    showModal(`<span class="eyebrow">PAPAN APRESIASI</span><h2>10 peserta teratas</h2><div id="leaderboardBody" class="loading-box">Memuat peringkat...</div>`);
    try {
      let rows = state.data.leaderboard || [];
      if (window.MPLS_API.isConfigured()) rows=(await window.MPLS_API.leaderboard(state.student&&state.student.run&&state.student.run.runCode)).leaderboard;
      $('#leaderboardBody').innerHTML = rows.length ? `<ol class="leaderboard">${rows.map((r,i)=>`<li><span class="rank">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><div><strong>${esc(r.alias)}</strong><small>${esc(r.className)}</small></div><b>${esc(r.finalScore != null ? r.finalScore : r.total)}/100</b></li>`).join('')}</ol><p class="note">Leaderboard memakai alias. Guru tetap meninjau kualitas partisipasi dan catatan observasi, bukan skor saja.</p>` : '<div class="empty-state">🏆<p>Belum ada skor. Selesaikan tantangan untuk mengisi papan apresiasi.</p></div>';
    } catch(err) { $('#leaderboardBody').innerHTML='<div class="empty-state">⚠️<p>'+esc(err.message)+'</p></div>'; }
  }

  function openTeacherPanel() {
    if (!window.MPLS_API.isConfigured()) return showModal(`<div class="empty-state"><div class="big-emoji">🔌</div><h2>Panel guru tersedia pada halaman khusus</h2><p>Buka <code>teacher.html</code> melalui tombol guru pada pojok kanan atas.</p></div>`);
    showModal(`<span class="eyebrow">PANEL GURU</span><h2>Masukkan kunci guru</h2><p>Kunci disimpan hanya selama tab ini terbuka dan tidak ditulis ke kode GitHub.</p><form id="teacherLogin" class="form-stack"><label>Kunci guru<input type="password" name="teacherKey" required autocomplete="current-password"></label><button class="primary-action" type="submit">Buka Panel</button></form>`,root=>{
      $('#teacherLogin',root).onsubmit=async e=>{e.preventDefault();state.teacherKey=new FormData(e.currentTarget).get('teacherKey');await loadTeacherReport();};
    });
  }

  async function loadTeacherReport() {
    $('#modalContent').innerHTML='<div class="loading-box">Memuat data privat...</div>';
    try {
      const data=await window.MPLS_API.teacherReport({teacherKey:state.teacherKey});
      renderTeacherReport(data);
    } catch(err) { $('#modalContent').innerHTML=`<div class="empty-state">🔐<h2>Panel tidak dapat dibuka</h2><p>${esc(err.message)}</p><button class="secondary-action" id="teacherRetry">Coba Lagi</button></div>`;$('#teacherRetry').onclick=openTeacherPanel; }
  }

  function renderTeacherReport(data) {
    const sessions=state.data.sessions||[];
    $('#modalContent').innerHTML=`<span class="eyebrow">PANEL GURU</span><h2>Rekap & Observasi</h2><div class="teacher-tabs"><button class="active" data-tab="report">Peringkat</button><button data-tab="observe">Catat Aktivitas</button></div><div id="teacherTab">
      <div class="teacher-table"><div class="tr head"><span>#</span><span>Peserta</span><span>Kelas</span><span>Poin</span></div>${data.topN.map((r,i)=>`<div class="tr"><span>${i+1}</span><span><strong>${esc(r.fullName)}</strong><small>${esc(r.alias)}</small></span><span>${esc(r.className)}</span><b>${esc(r.total)}</b></div>`).join('')}</div>
      <p class="note">Gunakan peringkat sebagai salah satu bukti. Pertimbangkan pertanyaan berkualitas, kerja sama, kreativitas, tanggung jawab, dan perkembangan.</p></div>`;
    $$('.teacher-tabs button').forEach(btn=>btn.onclick=()=>{ $$('.teacher-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active'); if(btn.dataset.tab==='observe') renderObservationForm(data.report,sessions); else renderTeacherReport(data); });
  }

  function renderObservationForm(students,sessions) {
    $('#teacherTab').innerHTML=`<form id="observationForm" class="form-stack"><label>Peserta<select name="studentId" required><option value="">Pilih peserta</option>${students.map(s=>`<option value="${esc(s.studentId)}">${esc(s.fullName)} · ${esc(s.className)}</option>`).join('')}</select></label><label>Sesi<select name="sessionId">${sessions.map(s=>`<option value="${esc(s.session_id)}">${esc(s.title)}</option>`).join('')}</select></label><label>Jenis aktivitas<select name="observationType"><option>Pertanyaan Berkualitas</option><option>Menjawab dengan Alasan</option><option>Kerja Sama</option><option>Kreativitas</option><option>Disiplin/Tanggung Jawab</option><option>Refleksi Mendalam</option></select></label><label>Tingkat<select name="level"><option value="rendah">Mulai terlihat · 2 poin</option><option value="sedang">Konsisten · 4 poin</option><option value="tinggi">Sangat menonjol · 6 poin</option></select></label><label>Catatan singkat<textarea name="note" rows="3" placeholder="Tuliskan bukti perilaku, bukan label pribadi."></textarea></label><button class="primary-action" type="submit">Simpan Observasi</button></form>`;
    $('#observationForm').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget).entries());const btn=$('button[type=submit]',e.currentTarget);btn.disabled=true;try{const r=await window.MPLS_API.submitObservation(Object.assign(f,{teacherKey:state.teacherKey}));toast('Observasi tersimpan: +'+r.points+' poin','success');e.currentTarget.reset();}catch(err){toast(err.message,'error');}finally{btn.disabled=false;}};
  }

  function openTimer(seconds) { state.timer.initial=Math.max(1,Number(seconds||60)); state.timer.seconds=state.timer.initial; state.timer.running=false; clearInterval(state.timer.handle); $('#timerDock').classList.remove('hidden'); updateTimer(); }
  function closeTimer() { clearInterval(state.timer.handle); state.timer.running=false; $('#timerDock').classList.add('hidden'); }
  function resetTimer(seconds) { clearInterval(state.timer.handle); state.timer.running=false; state.timer.seconds=Number(seconds||state.timer.initial); updateTimer(); }
  function toggleTimer() {
    if(state.timer.running){clearInterval(state.timer.handle);state.timer.running=false;updateTimer();return;}
    state.timer.running=true; state.timer.handle=setInterval(()=>{state.timer.seconds--;updateTimer();if(state.timer.seconds<=0){clearInterval(state.timer.handle);state.timer.running=false;timerDone();}},1000);updateTimer();
  }
  function updateTimer() { const m=Math.floor(state.timer.seconds/60),s=state.timer.seconds%60;$('#timerDisplay').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');$('#timerToggle').textContent=state.timer.running?'Jeda':'Mulai';$('#timerDock').classList.toggle('urgent',state.timer.seconds<=30); }
  function timerDone() { updateTimer(); toast('Waktu selesai!','warning'); try{const audio=new AudioContext(),osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);osc.frequency.value=660;gain.gain.value=.08;osc.start();setTimeout(()=>{osc.stop();audio.close();},600);}catch(_){}}

  init().catch(err => { console.error(err); app.innerHTML=`<div class="fatal"><span>⚠️</span><h1>Aplikasi belum dapat dimuat</h1><p>${esc(err.message)}</p><button onclick="location.reload()">Muat Ulang</button></div>`; });
})();
