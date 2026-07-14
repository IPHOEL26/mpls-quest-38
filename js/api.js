(function () {
  'use strict';
  const cfg = window.MPLS_APP_CONFIG || {};
  const isConfigured = () => /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(String(cfg.GAS_URL || ''));

  async function withTimeout(factory, ms) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(ms || 15000));
    try { return await factory(controller.signal); }
    finally { clearTimeout(timeout); }
  }

  async function get(action, params) {
    if (!isConfigured()) throw new Error('GAS URL belum dikonfigurasi.');
    const url = new URL(cfg.GAS_URL);
    url.searchParams.set('action', action);
    Object.entries(params || {}).forEach(([k,v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
    url.searchParams.set('_', Date.now());
    return withTimeout(async signal => {
      const res = await fetch(url.toString(), {method:'GET', redirect:'follow', signal, cache:'no-store'});
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Permintaan gagal.');
      return data;
    }, cfg.REQUEST_TIMEOUT_MS);
  }

  async function post(action, payload) {
    if (!isConfigured()) throw new Error('GAS URL belum dikonfigurasi.');
    const body = new URLSearchParams();
    body.set('action', action);
    body.set('payload', JSON.stringify(Object.assign({action}, payload || {})));
    return withTimeout(async signal => {
      const res = await fetch(cfg.GAS_URL, {method:'POST', body, redirect:'follow', signal, cache:'no-store'});
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Permintaan gagal.');
      return data;
    }, cfg.REQUEST_TIMEOUT_MS);
  }

  window.MPLS_API = {
    isConfigured,
    async bootstrap() {
      if (!isConfigured()) return structuredClone(window.MPLS_FALLBACK_DATA);
      try { return await get('bootstrap'); }
      catch (error) {
        console.warn('Menggunakan data demo karena API tidak dapat diakses:', error);
        const fallback = structuredClone(window.MPLS_FALLBACK_DATA);
        fallback.apiError = error.message;
        return fallback;
      }
    },
    registerStudent: p => post('registerStudent', p),
    submitResponse: p => post('submitResponse', p),
    submitReflection: p => post('submitReflection', p),
    leaderboard: runCode => get('leaderboard', {runCode}),
    createRun: p => post('createRun', p),
    listRuns: p => post('listRuns', p),
    teacherDashboard: p => post('teacherDashboard', p),
    addCandidate: p => post('addCandidate', p),
    submitObservation: p => post('submitObservation', p),
    setManualScores: p => post('setManualScores', p),
    previewFinalReport: p => post('previewFinalReport', p),
    finalizeRun: p => post('finalizeRun', p),
    recordPresentationRating: p => post('recordPresentationRating', p),
    saveGroupSetup: p => post('saveGroupSetup', p),
    rateGroupMember: p => post('rateGroupMember', p),
    rateGroupPoster: p => post('rateGroupPoster', p),
    deleteRunData: p => post('deleteRunData', p),
    runSync: (runId, studentId) => get('runSync', {runId, studentId}),
    setRunSync: p => post('setRunSync', p),
    studentHeartbeat: p => post('studentHeartbeat', p),
    markStudentProgress: p => post('markStudentProgress', p),
    classProgress: p => post('classProgress', p)
  };
})();
