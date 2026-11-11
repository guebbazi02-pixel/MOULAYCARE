'use strict';
/* =========================================================
   MOULAYCARE — نظام مواعيد وملفات المرضى للعيادات الصغيرة
   يعمل دون إنترنت — البيانات محفوظة على الجهاز (IndexedDB)
   ========================================================= */

const Native = window.Android || null;   // جسر أندرويد (MainActivity)

/* ---------- أيقونات ---------- */
const I = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M16 4.1a4 4 0 0 1 0 7.8M22 21c0-3-1.8-5.6-4.5-6.6"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  userplus:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M19 8v6M16 11h6"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  calplus:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  back:'<path d="m9 18 6-6-6-6"/>',
  next:'<path d="m15 18-6-6 6-6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  msg:'<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  drop:'<path d="M12 2.7s-7 7.5-7 12.3a7 7 0 0 0 14 0c0-4.8-7-12.3-7-12.3z"/>',
  note:'<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  hosp:'<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/>',
  steth:'<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
  check2:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  sofa:'<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z"/><path d="M5 18v2M19 18v2"/>',
  db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};
const icon = (n, s = 22, w = 2) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${I[n] || ''}</svg>`;
const LOGO = `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#DDF5F2"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="28" fill="url(#lg)"/><path d="M40 22h20v18h18v20H60v18H40V60H22V40h18z" fill="#0B8F8A"/><path d="M24 51h14l5-10 7 18 6-12 4 4h16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- أدوات ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => dstr(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T00:00'); d.setDate(d.getDate() + n); return dstr(d); };
const LOC = 'ar-u-nu-latn';
const fmt = (s, o) => new Intl.DateTimeFormat(LOC, o).format(new Date(s.length <= 10 ? s + 'T00:00' : s));
const fmtLong = s => fmt(s, { weekday: 'long', day: 'numeric', month: 'long' });
const fmtFull = s => fmt(s, { day: 'numeric', month: 'long', year: 'numeric' });
const dayName = s => fmt(s, { weekday: 'short' });
const apptDT = a => new Date(`${a.date}T${a.time || '00:00'}`);
const tmin = t => { const [h, m] = (t || '0:0').split(':').map(Number); return h * 60 + m; };
const mtime = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const age = dob => { if (!dob) return null; const b = new Date(dob), n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--; return a >= 0 ? a : null; };
const initials = n => (n || '؟').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join(' ');
const AVC = ['#0B8F8A', '#2F6BDF', '#8B5CF6', '#E07A2F', '#D9467A', '#1F9D63', '#0E7490', '#B45309'];
const avColor = id => AVC[[...(id || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % AVC.length];
const avatar = p => `<div class="av" style="background:${avColor(p?.id)}">${esc(initials(p?.name))}</div>`;
const relTime = mins => {
  if (mins < 1) return 'الآن';
  if (mins < 60) return `بعد ${mins} د`;
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h < 24) return `بعد ${h} س${m ? ' و' + m + ' د' : ''}`;
  const d = Math.round(h / 24); return d === 1 ? 'غداً' : `بعد ${d} أيام`;
};
const sizeStr = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' م.ب' : Math.max(1, Math.round(b / 1024)) + ' ك.ب';
const opts = (list, sel, ph) => (ph ? `<option value="">${ph}</option>` : '') + list.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
const digits = s => (s || '').replace(/[^\d+]/g, '');

const STATUS = {
  scheduled: { l: 'مجدول', c: 'a', col: '#2F6BDF', ic: 'clock' },
  confirmed: { l: 'مؤكد', c: '', col: '#0B8F8A', ic: 'check' },
  waiting: { l: 'في الانتظار', c: 'w', col: '#E59A16', ic: 'sofa' },
  done: { l: 'مكتمل', c: 'ok', col: '#1F9D63', ic: 'check2' },
  noshow: { l: 'لم يحضر', c: 'd', col: '#E04B4F', ic: 'ban' },
  cancelled: { l: 'ملغي', c: 'g', col: '#93A4AA', ic: 'x' },
};
const ACTIVE = ['scheduled', 'confirmed', 'waiting'];
const TYPES = ['كشف', 'متابعة', 'استشارة', 'فحص دوري', 'تحاليل', 'إجراء طبي', 'تطعيم'];
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const FCATS = ['تحاليل', 'أشعة', 'وصفة طبية', 'تقرير', 'شهادة', 'أخرى'];

/* ---------- الحالة ---------- */
const S = {
  patients: [], appts: [], files: [],
  settings: { clinicName: 'عيادتي', doctorName: '', specialty: 'طب عام', phone: '', address: '',
    cc: '213', start: '09:00', end: '17:00', slot: 30, leadMin: 30, morning: true, seen: [], fileSeq: 0 },
  view: 'home', pid: null, ptab: 'info', selDate: todayStr(), apFilter: 'all', pq: '', pfilter: 'all',
  stack: [],
};

/* ---------- التخزين (IndexedDB) ---------- */
const DB = {
  db: null, mem: { patients: {}, appts: {}, files: {}, blobs: {}, meta: {} },
  open() {
    return new Promise(res => {
      try {
        const r = indexedDB.open('moulaycare', 1);
        r.onupgradeneeded = () => { const d = r.result; ['patients', 'appts', 'files', 'blobs'].forEach(s => d.createObjectStore(s, { keyPath: 'id' })); d.createObjectStore('meta', { keyPath: 'key' }); };
        r.onsuccess = () => { this.db = r.result; res(); };
        r.onerror = () => res();
      } catch (e) { res(); }
    });
  },
  tx(store, mode, fn) {
    if (!this.db) return Promise.resolve(fn(null));
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, mode), s = t.objectStore(store); let out;
      const r = fn(s); if (r && 'onsuccess' in r) r.onsuccess = () => out = r.result;
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  },
  all(store) { return this.db ? this.tx(store, 'readonly', s => s.getAll()) : Promise.resolve(Object.values(this.mem[store])); },
  get(store, id) { return this.db ? this.tx(store, 'readonly', s => s.get(id)) : Promise.resolve(this.mem[store][id]); },
  put(store, obj) { if (!this.db) { this.mem[store][obj.id || obj.key] = obj; return Promise.resolve(); } return this.tx(store, 'readwrite', s => s.put(obj)); },
  del(store, id) { if (!this.db) { delete this.mem[store][id]; return Promise.resolve(); } return this.tx(store, 'readwrite', s => s.delete(id)); },
  clear(store) { if (!this.db) { this.mem[store] = {}; return Promise.resolve(); } return this.tx(store, 'readwrite', s => s.clear()); },
};

async function loadAll() {
  await DB.open();
  const [p, a, f, m] = await Promise.all([DB.all('patients'), DB.all('appts'), DB.all('files'), DB.get('meta', 'settings')]);
  S.patients = p || []; S.appts = a || []; S.files = f || [];
  if (m && m.value) Object.assign(S.settings, m.value);
}
async function save(store, obj) {
  const arr = S[store], i = arr.findIndex(x => x.id === obj.id);
  if (i >= 0) arr[i] = obj; else arr.push(obj);
  try { await DB.put(store, obj); } catch (e) { toast('تعذّر الحفظ: ' + (e && e.message || ''), 'err'); }
}
async function remove(store, id) {
  S[store] = S[store].filter(x => x.id !== id);
  try { await DB.del(store, id); } catch (e) { }
}
async function saveSettings() { try { await DB.put('meta', { key: 'settings', value: S.settings }); } catch (e) { } }

const pById = id => S.patients.find(p => p.id === id);
const apptsOn = d => S.appts.filter(a => a.date === d).sort((a, b) => tmin(a.time) - tmin(b.time));
const nextApptOf = pid => S.appts.filter(a => a.patientId === pid && ACTIVE.includes(a.status) && apptDT(a) >= new Date()).sort((a, b) => apptDT(a) - apptDT(b))[0];

/* ---------- واجهات عامة: نافذة سفلية، حوار، تنبيه ---------- */
let sheetCleanup = null;
function openSheet(html, mount) {
  $('#sheetBody').innerHTML = html;
  $('#sheetWrap').hidden = false;
  $('#sheet').scrollTop = 0;
  hydrateIcons($('#sheetBody'));
  sheetCleanup = mount ? mount($('#sheetBody')) : null;
}
function closeSheet() { $('#sheetWrap').hidden = true; $('#sheetBody').innerHTML = ''; if (typeof sheetCleanup === 'function') sheetCleanup(); sheetCleanup = null; }
const sheetTitle = t => `<h3 class="st"><span>${t}</span><button class="iconbtn" data-act="closeSheet" style="width:36px;height:36px">${icon('x', 18)}</button></h3>`;

function confirmBox(title, msg, ok = 'تأكيد', danger = true) {
  return new Promise(res => {
    const d = $('#dialog');
    d.innerHTML = `<div class="box"><div class="di" style="background:${danger ? 'var(--dl)' : 'var(--pl)'};color:${danger ? 'var(--d)' : 'var(--p)'}">${icon(danger ? 'alert' : 'check', 26)}</div>
      <h3>${title}</h3><p>${msg}</p><div class="btns"><button class="btn ghost" data-r="0">إلغاء</button><button class="btn ${danger ? 'danger' : 'primary'}" data-r="1">${ok}</button></div></div>`;
    d.hidden = false;
    d.onclick = e => { const b = e.target.closest('[data-r]'); if (b || e.target === d) { d.hidden = true; d.onclick = null; res(b && b.dataset.r === '1'); } };
  });
}
function toast(msg, kind = '', ms = 2600) {
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.innerHTML = `${icon(kind === 'err' ? 'alert' : kind === 'rem' ? 'bell' : 'check', 20)}<div class="grow">${msg}</div>`;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.style.transition = '.3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, ms);
}
function hydrateIcons(root = document) { $$('[data-ic]', root).forEach(e => { e.innerHTML = icon(e.dataset.ic, 22); }); }
function openExternal(url) {
  if (Native && Native.openUrl) Native.openUrl(url);
  else { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.click(); }
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('تم النسخ'); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('تم النسخ'); } catch (_) { toast('تعذّر النسخ', 'err'); } ta.remove(); }
}

/* ---------- التنقل ---------- */
function go(view, extra = {}, push = true) {
  if (push) S.stack.push({ view: S.view, pid: S.pid, ptab: S.ptab });
  S.view = view; Object.assign(S, extra);
  render(); window.scrollTo(0, 0);
}
function goTab(view) { S.stack = []; S.view = view; S.pid = null; render(); window.scrollTo(0, 0); }
// زر الرجوع في أندرويد
window.mcBack = function () {
  if (!$('#dialog').hidden) { $('#dialog').hidden = true; return true; }
  if (!$('#sheetWrap').hidden) { closeSheet(); return true; }
  if (S.stack.length) { const p = S.stack.pop(); Object.assign(S, p); render(); return true; }
  if (S.view !== 'home') { goTab('home'); return true; }
  return false;
};

/* ---------- التنبيهات ---------- */
function buildNotifs() {
  const now = new Date(), out = [], lead = +S.settings.leadMin || 30;
  const t = todayStr(), tm = addDays(t, 1);
  for (const a of S.appts) {
    if (!ACTIVE.includes(a.status)) continue;
    const p = pById(a.patientId); const name = p ? p.name : 'مريض';
    const diff = Math.round((apptDT(a) - now) / 60000);
    if (diff >= 0 && diff <= lead) out.push({ id: 'soon-' + a.id, k: 'soon', pr: 0, a, title: `موعد ${relTime(diff)}`, body: `${name} • ${a.type || 'كشف'} • ${a.time}` });
    else if (diff < 0 && diff > -60 * 24 * 14) out.push({ id: 'miss-' + a.id, k: 'miss', pr: 1, a, title: 'موعد مضى دون تحديث حالته', body: `${name} • ${fmtLong(a.date)} • ${a.time}` });
  }
  const today = apptsOn(t).filter(a => ACTIVE.includes(a.status));
  if (today.length) out.push({ id: 'today-' + t, k: 'today', pr: 2, title: `لديك ${today.length} ${today.length === 1 ? 'موعد' : 'مواعيد'} اليوم`, body: 'أول موعد الساعة ' + today[0].time });
  const tmr = apptsOn(tm).filter(a => ACTIVE.includes(a.status));
  if (tmr.length) {
    const unc = tmr.filter(a => a.status === 'scheduled').length;
    out.push({ id: 'tmr-' + tm + '-' + tmr.length, k: 'tmr', pr: 3, title: `غداً: ${tmr.length} ${tmr.length === 1 ? 'موعد' : 'مواعيد'}`, body: unc ? `${unc} منها غير مؤكدة — أرسل تذكيراً للمرضى عبر واتساب` : 'جميع مواعيد الغد مؤكدة' });
  }
  return out.sort((x, y) => x.pr - y.pr);
}
const unseenCount = () => buildNotifs().filter(n => !S.settings.seen.includes(n.id)).length;

const toasted = new Set();
function tick() {
  const lead = +S.settings.leadMin || 30, now = new Date();
  for (const a of S.appts) {
    if (!ACTIVE.includes(a.status)) continue;
    const diff = Math.round((apptDT(a) - now) / 60000);
    if (diff >= 0 && diff <= lead && !toasted.has(a.id)) {
      toasted.add(a.id);
      const p = pById(a.patientId);
      toast(`<b>تذكير:</b> ${esc(p ? p.name : 'مريض')} ${relTime(diff)} (${a.time})`, 'rem', 6000);
      try { Native && Native.vibrate && Native.vibrate(); } catch (e) { }
    }
  }
  updateBadge();
  if (['home', 'notifs'].includes(S.view) && $('#sheetWrap').hidden && $('#dialog').hidden) render(false);
}
function updateBadge() { const n = unseenCount(), b = $('#badge'); b.hidden = !n; b.textContent = n > 9 ? '9+' : n; }

// جدولة إشعارات النظام (تعمل والتطبيق مغلق)
function syncReminders() {
  if (!Native || !Native.setReminders) return;
  const now = Date.now(), lead = (+S.settings.leadMin || 30) * 60000, list = [];
  for (const a of S.appts) {
    if (!ACTIVE.includes(a.status)) continue;
    const at = apptDT(a).getTime(); if (at < now) continue;
    const p = pById(a.patientId), name = p ? p.name : 'مريض';
    const r = at - lead;
    if (r > now) list.push({ id: 'r_' + a.id, at: r, title: `موعد بعد ${S.settings.leadMin} دقيقة`, body: `${name} — ${a.type || 'كشف'} الساعة ${a.time}` });
    list.push({ id: 'n_' + a.id, at, title: 'حان موعد المريض الآن', body: `${name} — ${a.type || 'كشف'}` });
  }
  if (S.settings.morning) {
    for (let i = 0; i < 7; i++) {
      const d = addDays(todayStr(), i), n = apptsOn(d).filter(a => ACTIVE.includes(a.status)).length;
      const at = new Date(d + 'T07:30').getTime();
      if (n && at > now) list.push({ id: 'm_' + d, at, title: `صباح الخير — ${n} ${n === 1 ? 'موعد' : 'مواعيد'} اليوم`, body: 'افتح MOULAYCARE لعرض جدول اليوم' });
    }
  }
  try { Native.setReminders(JSON.stringify(list.slice(0, 450))); } catch (e) { }
}

/* ---------- العرض ---------- */
function render(anim = true) {
  const v = $('#view');
  const views = { home: vHome, patients: vPatients, patient: vPatient, appts: vAppts, notifs: vNotifs, settings: vSettings };
  const out = (views[S.view] || vHome)();
  $('#topbar').className = out.hero ? 'hero' : '';
  $('#topbar').innerHTML = out.head;
  v.className = out.hero ? 'lift' : '';
  v.innerHTML = out.body;
  if (anim) { v.style.animation = 'none'; v.offsetHeight; v.style.animation = ''; }
  hydrateIcons(v); hydrateIcons($('#topbar'));
  const tab = S.view === 'patient' ? 'patients' : S.view;
  $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.nav === tab));
  const fab = $('#fab');
  fab.hidden = ['settings', 'notifs'].includes(S.view);
  fab.innerHTML = icon(S.view === 'patients' ? 'userplus' : 'calplus', 26);
  updateBadge();
  if (out.after) out.after();
}

function apptItem(a, showDate = false) {
  const p = pById(a.patientId), st = STATUS[a.status] || STATUS.scheduled;
  return `<button class="item appt ${a.status}" data-act="openAppt" data-id="${a.id}">
    <div class="timecol"><b>${esc(a.time)}</b><span>${showDate ? esc(fmt(a.date, { day: 'numeric', month: 'short' })) : (a.duration || 30) + ' د'}</span></div>
    <div class="grow"><h4 class="ellipsis">${esc(p ? p.name : 'مريض محذوف')}</h4>
      <div class="meta"><span>${esc(a.type || 'كشف')}</span>${p && p.fileNo ? `<span class="ltr">${esc(p.fileNo)}</span>` : ''}</div></div>
    <span class="chip ${st.c}">${st.l}</span></button>`;
}

/* الرئيسية */
function vHome() {
  const s = S.settings, t = todayStr(), now = new Date();
  const list = apptsOn(t);
  const active = list.filter(a => ACTIVE.includes(a.status));
  const done = list.filter(a => a.status === 'done').length;
  const waiting = list.filter(a => a.status === 'waiting').length;
  const next = S.appts.filter(a => ACTIVE.includes(a.status) && apptDT(a) >= new Date(now - 10 * 60000)).sort((a, b) => apptDT(a) - apptDT(b))[0];
  const h = now.getHours(), greet = h < 12 ? 'صباح الخير' : h < 18 ? 'مساء الخير' : 'مساء النور';
  const head = `<div class="grow"><div class="greet">${greet}${s.doctorName ? '، د. ' + esc(s.doctorName) : ''}</div><h1>${esc(s.clinicName)}</h1><div class="sub">${esc(fmtLong(t))}</div></div>
    <button class="iconbtn" data-nav="notifs">${icon('bell', 22)}</button>`;
  let nextHtml = '';
  if (next) {
    const p = pById(next.patientId), diff = Math.round((apptDT(next) - now) / 60000);
    nextHtml = `<div class="next" data-act="openAppt" data-id="${next.id}"><div class="row"><div class="grow"><div class="lbl">الموعد القادم</div>
      <h3 class="ellipsis">${esc(p ? p.name : 'مريض')}</h3><div class="small" style="opacity:.9">${esc(next.type || 'كشف')} • ${next.date === t ? 'اليوم' : esc(fmtLong(next.date))}</div></div>
      <div class="cd"><b class="ltr">${esc(next.time)}</b><span class="small">${diff <= 0 ? 'الآن' : relTime(diff)}</span></div></div></div>`;
  }
  const body = `
    <div class="stats">
      <div class="stat"><div class="si" style="background:var(--al);color:var(--a)">${icon('cal')}</div><div><b>${active.length}</b><span>متبقية اليوم</span></div></div>
      <div class="stat"><div class="si" style="background:var(--okl);color:var(--ok)">${icon('check2')}</div><div><b>${done}</b><span>مكتملة اليوم</span></div></div>
      <div class="stat"><div class="si" style="background:var(--wl);color:var(--w)">${icon('sofa')}</div><div><b>${waiting}</b><span>في قاعة الانتظار</span></div></div>
      <div class="stat"><div class="si" style="background:var(--pl);color:var(--p)">${icon('users')}</div><div><b>${S.patients.length}</b><span>إجمالي المرضى</span></div></div>
    </div>
    <div class="sec"><h3>إجراءات سريعة</h3></div>
    <div class="qa">
      <button data-act="newPatient"><div class="q" style="background:var(--pl);color:var(--p)">${icon('userplus')}</div>مريض جديد</button>
      <button data-act="newAppt"><div class="q" style="background:var(--al);color:var(--a)">${icon('calplus')}</div>حجز موعد</button>
      <button data-nav="patients"><div class="q" style="background:#F1EAFE;color:#7C4DDB">${icon('search')}</div>بحث مريض</button>
      <button data-act="remindTomorrow"><div class="q" style="background:#E7F8EE;color:#13884A">${icon('msg')}</div>تذكير الغد</button>
    </div>
    ${nextHtml ? `<div class="sec"><h3>التالي</h3></div>${nextHtml}` : ''}
    <div class="sec"><h3>جدول اليوم</h3><button data-act="gotoDay" data-d="${t}">عرض الكل</button></div>
    ${list.length ? `<div class="stack">${list.map(a => apptItem(a)).join('')}</div>`
      : `<div class="card empty"><div class="eic">${icon('sun', 30)}</div><h4>لا مواعيد اليوم</h4><div>احجز موعداً جديداً من زر +</div>
         ${!S.patients.length ? `<div style="margin-top:14px"><button class="btn sm" data-act="demo">${icon('spark', 18)} تجربة التطبيق ببيانات تجريبية</button></div>` : ''}</div>`}`;
  return { hero: true, head, body };
}

/* المرضى */
function vPatients() {
  const q = S.pq.trim().toLowerCase(), t = todayStr();
  let list = S.patients.slice();
  if (q) list = list.filter(p => [p.name, p.phone, p.fileNo].some(x => (x || '').toLowerCase().includes(q)));
  if (S.pfilter === 'today') { const ids = new Set(apptsOn(t).map(a => a.patientId)); list = list.filter(p => ids.has(p.id)); }
  if (S.pfilter === 'allergy') list = list.filter(p => p.allergies);
  if (S.pfilter === 'chronic') list = list.filter(p => p.chronic);
  list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const head = `<h1>المرضى</h1><span class="chip">${S.patients.length} ملف</span>`;
  const f = (k, l) => `<button class="${S.pfilter === k ? 'on' : ''}" data-act="pfilter" data-k="${k}">${l}</button>`;
  const body = `<div class="search">${icon('search', 20)}<input id="pq" placeholder="ابحث بالاسم، الهاتف أو رقم الملف" value="${esc(S.pq)}"></div>
    <div class="chips">${f('all', 'الكل')}${f('today', 'لديهم موعد اليوم')}${f('allergy', 'لديهم حساسية')}${f('chronic', 'أمراض مزمنة')}</div>
    <div class="stack" style="margin-top:8px">${list.length ? list.map(p => {
      const a = age(p.dob), n = nextApptOf(p.id);
      return `<button class="item" data-act="openPatient" data-id="${p.id}">${avatar(p)}
        <div class="grow"><h4 class="ellipsis">${esc(p.name)}</h4>
        <div class="meta"><span class="ltr">${esc(p.fileNo || '')}</span>${a !== null ? `<span>${a} سنة</span>` : ''}${p.allergies ? `<span class="chip d" style="padding:1px 8px">حساسية</span>` : ''}</div>
        ${n ? `<div class="meta" style="color:var(--a)">${icon('clock', 14)} ${esc(fmt(n.date, { day: 'numeric', month: 'short' }))} • ${esc(n.time)}</div>` : ''}</div>
        <span class="muted">${icon('next', 18)}</span></button>`;
    }).join('') : `<div class="card empty"><div class="eic">${icon('users', 30)}</div><h4>${q || S.pfilter !== 'all' ? 'لا نتائج' : 'لا يوجد مرضى بعد'}</h4><div>${q ? 'جرّب كلمة بحث أخرى' : 'أضف أول مريض من زر +'}</div></div>`}</div>`;
  return { head, body, after() { const i = $('#pq'); if (i) { i.oninput = () => { S.pq = i.value; const pos = i.selectionStart; render(false); const j = $('#pq'); j.focus(); j.setSelectionRange(pos, pos); }; } } };
}

/* ملف المريض */
function vPatient() {
  const p = pById(S.pid);
  if (!p) { S.view = 'patients'; return vPatients(); }
  const a = age(p.dob);
  const head = `<button class="iconbtn" data-act="back">${icon('back')}</button><h1 style="font-size:17px">ملف المريض</h1>
    <button class="iconbtn" data-act="editPatient" data-id="${p.id}">${icon('edit', 20)}</button>`;
  const tb = (k, l) => `<button class="${S.ptab === k ? 'on' : ''}" data-act="ptab" data-k="${k}">${l}</button>`;
  const visits = (p.visits || []).slice().sort((x, y) => (y.date + (y.t || '')).localeCompare(x.date + (x.t || '')));
  const files = S.files.filter(f => f.patientId === p.id).sort((x, y) => y.createdAt - x.createdAt);
  const appts = S.appts.filter(x => x.patientId === p.id).sort((x, y) => apptDT(y) - apptDT(x));
  let tab = '';
  if (S.ptab === 'info') {
    const row = (k, v) => v ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : '';
    tab = `<div class="card"><dl class="kv" style="margin:0">
      ${row('رقم الملف', p.fileNo)}${row('الجنس', p.gender)}${row('تاريخ الميلاد', p.dob ? fmtFull(p.dob) : '')}${row('الهاتف', p.phone)}
      ${p.blood ? `<dt>فصيلة الدم</dt><dd><span class="ltr">${esc(p.blood)}</span></dd>` : ''}${row('الوزن', p.weight ? p.weight + ' كغ' : '')}${row('الطول', p.height ? p.height + ' سم' : '')}
      ${row('الأمراض المزمنة', p.chronic)}${row('الأدوية الحالية', p.meds)}${row('السوابق', p.history)}${row('العنوان', p.address)}${row('التأمين', p.insurance)}${row('ملاحظات', p.notes)}
      ${row('تاريخ التسجيل', fmtFull(dstr(new Date(p.createdAt || Date.now()))))}</dl></div>`;
  } else if (S.ptab === 'visits') {
    tab = `<button class="btn block" data-act="newVisit" data-id="${p.id}">${icon('plus', 20)} تسجيل زيارة / كشف</button>
      <div class="card" style="margin-top:12px">${visits.length ? visits.map(v => `<div class="visit">
        <div class="row"><div class="vd grow">${esc(fmtFull(v.date))}${v.t ? ' • ' + esc(v.t) : ''}</div>
        <button class="muted" data-act="editVisit" data-pid="${p.id}" data-id="${v.id}">${icon('edit', 16)}</button></div>
        ${v.complaint ? `<p><b>الشكوى:</b> ${esc(v.complaint)}</p>` : ''}${v.diagnosis ? `<p><b>التشخيص:</b> ${esc(v.diagnosis)}</p>` : ''}
        ${v.treatment ? `<p><b>العلاج:</b> ${esc(v.treatment)}</p>` : ''}${v.notes ? `<p class="muted">${esc(v.notes)}</p>` : ''}
        <div class="vitals">${v.bp ? `<span class="chip a">الضغط ${esc(v.bp)}</span>` : ''}${v.temp ? `<span class="chip w">الحرارة ${esc(v.temp)}°</span>` : ''}${v.pulse ? `<span class="chip d">النبض ${esc(v.pulse)}</span>` : ''}${v.sugar ? `<span class="chip">السكر ${esc(v.sugar)}</span>` : ''}${v.weight ? `<span class="chip g">${esc(v.weight)} كغ</span>` : ''}</div>
        ${v.followUp ? `<div class="small" style="color:var(--a);margin-top:6px">${icon('cal', 14)} متابعة مقترحة: ${esc(fmtFull(v.followUp))}</div>` : ''}
        </div>`).join('') : `<div class="empty" style="padding:18px">${icon('note', 30)}<div style="margin-top:8px">لا توجد زيارات مسجّلة</div></div>`}</div>`;
  } else if (S.ptab === 'files') {
    tab = `<div class="files">
      <button class="fthumb add" data-act="addFile" data-id="${p.id}">${icon('upload', 26)}<span style="position:static;background:none;color:var(--p2);padding:0">إضافة ملف</span></button>
      ${files.map(f => `<button class="fthumb" data-act="openFile" data-id="${f.id}">${f.thumb ? `<img src="${f.thumb}" alt="">` : icon('file', 34)}<span>${esc(f.category)} • ${esc(f.name)}</span></button>`).join('')}
      </div>${!files.length ? `<p class="muted small" style="text-align:center;margin-top:14px">أرفق صور التحاليل، الأشعة، الوصفات والتقارير (صور أو PDF)</p>` : ''}`;
  } else {
    tab = `<button class="btn block" data-act="newAppt" data-pid="${p.id}">${icon('calplus', 20)} حجز موعد لهذا المريض</button>
      <div class="stack" style="margin-top:12px">${appts.length ? appts.map(x => apptItem(x, true)).join('') : `<div class="card empty" style="padding:18px">لا توجد مواعيد</div>`}</div>`;
  }
  const ph = digits(p.phone);
  const body = `<div class="phead">${avatar(p)}<h2>${esc(p.name)}</h2>
    <div class="pills"><span class="chip ltr">${esc(p.fileNo || '')}</span>${a !== null ? `<span class="chip g">${a} سنة</span>` : ''}${p.gender ? `<span class="chip g">${esc(p.gender)}</span>` : ''}${p.blood ? `<span class="chip d">${icon('drop', 13)} <span class="ltr">${esc(p.blood)}</span></span>` : ''}</div></div>
    ${p.allergies ? `<div class="alert">${icon('alert', 20)}<div><b>تنبيه حساسية:</b> ${esc(p.allergies)}</div></div>` : ''}
    <div class="btns" style="margin-top:14px">
      ${ph ? `<button class="btn sm" data-act="call" data-ph="${esc(ph)}">${icon('phone', 18)} اتصال</button><button class="btn sm wa" data-act="wa" data-ph="${esc(ph)}">${icon('msg', 18)} واتساب</button>` : ''}
      <button class="btn sm" style="background:var(--al);color:var(--a)" data-act="newAppt" data-pid="${p.id}">${icon('calplus', 18)} موعد</button></div>
    <div class="tabs">${tb('info', 'المعلومات')}${tb('visits', `الزيارات (${visits.length})`)}${tb('files', `الملفات (${files.length})`)}${tb('appts', 'المواعيد')}</div>
    ${tab}
    <button class="btn danger block" style="margin-top:22px" data-act="delPatient" data-id="${p.id}">${icon('trash', 18)} حذف ملف المريض</button>`;
  return { head, body };
}

/* المواعيد */
function vAppts() {
  const sel = S.selDate, t = todayStr();
  const start = addDays(sel, -3);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const has = new Set(S.appts.filter(a => ACTIVE.includes(a.status)).map(a => a.date));
  let list = apptsOn(sel);
  if (S.apFilter === 'active') list = list.filter(a => ACTIVE.includes(a.status));
  if (S.apFilter === 'done') list = list.filter(a => a.status === 'done');
  if (S.apFilter === 'off') list = list.filter(a => ['cancelled', 'noshow'].includes(a.status));
  const head = `<h1>المواعيد</h1>
    ${sel !== t ? `<button class="btn sm ghost" data-act="gotoDay" data-d="${t}">اليوم</button>` : ''}
    <label class="iconbtn dateinput">${icon('cal', 20)}<input type="date" id="pickDate" value="${sel}"></label>`;
  const f = (k, l) => `<button class="${S.apFilter === k ? 'on' : ''}" data-act="apfilter" data-k="${k}">${l}</button>`;
  const all = apptsOn(sel);
  const mins = all.filter(a => ACTIVE.includes(a.status) || a.status === 'done').reduce((s, a) => s + (+a.duration || 30), 0);
  const body = `<div class="week"><button class="wk-nav" data-act="shiftWeek" data-n="-7">${icon('back', 18)}</button><div class="days">
    ${days.map(d => `<button class="day ${d === sel ? 'on' : ''} ${d === t ? 'today' : ''}" data-act="gotoDay" data-d="${d}"><small>${esc(dayName(d))}</small><b>${+d.slice(8)}</b>${has.has(d) ? '<i></i>' : ''}</button>`).join('')}
    </div><button class="wk-nav" data-act="shiftWeek" data-n="7">${icon('next', 18)}</button></div>
    <div class="dayhead"><div><h3>${sel === t ? 'اليوم — ' : ''}${esc(fmtLong(sel))}</h3><div class="small muted">${all.length} مواعيد • ${Math.floor(mins / 60)} س ${mins % 60} د من العمل</div></div>
      ${all.some(a => a.status === 'scheduled') ? `<button class="btn sm wa" data-act="remindDay" data-d="${sel}">${icon('msg', 16)} تذكير</button>` : ''}</div>
    <div class="chips" style="padding-top:0">${f('all', 'الكل')}${f('active', 'النشطة')}${f('done', 'المكتملة')}${f('off', 'ملغاة/غياب')}</div>
    <div class="stack" style="margin-top:8px">${list.length ? list.map(a => apptItem(a)).join('') :
      `<div class="card empty"><div class="eic">${icon('cal', 30)}</div><h4>لا مواعيد</h4><div>يوم فارغ — اضغط + لحجز موعد</div></div>`}</div>`;
  return { head, body, after() { const i = $('#pickDate'); if (i) i.onchange = () => { if (i.value) { S.selDate = i.value; render(); } }; } };
}

/* التنبيهات */
function vNotifs() {
  const list = buildNotifs(), seen = new Set(S.settings.seen);
  const head = `<h1>التنبيهات</h1>${list.length ? `<span class="chip">${list.length}</span>` : ''}`;
  const meta = { soon: ['clock', 'var(--al)', 'var(--a)'], miss: ['alert', 'var(--wl)', 'var(--w)'], today: ['cal', 'var(--pl)', 'var(--p)'], tmr: ['msg', '#E7F8EE', '#13884A'] };
  const body = `<div class="card row" style="margin-bottom:14px;background:var(--pll)"><div class="lic" style="width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--pl);color:var(--p)">${icon('bell')}</div>
     <div class="grow small">${Native ? `ستصلك إشعارات على الهاتف قبل كل موعد بـ <b>${S.settings.leadMin} دقيقة</b> وعند حلوله، حتى والتطبيق مغلق.` : `تظهر التذكيرات داخل التطبيق قبل كل موعد بـ <b>${S.settings.leadMin} دقيقة</b>.`}</div></div>
    <div class="stack">${list.length ? list.map(n => {
      const [ic, bg, c] = meta[n.k];
      let acts = '';
      if (n.k === 'soon') acts = `<div class="btns"><button class="btn sm" data-act="setStatus" data-id="${n.a.id}" data-s="waiting">وصل المريض</button><button class="btn sm ghost" data-act="openAppt" data-id="${n.a.id}">التفاصيل</button></div>`;
      if (n.k === 'miss') acts = `<div class="btns"><button class="btn sm" style="background:var(--okl);color:var(--ok)" data-act="setStatus" data-id="${n.a.id}" data-s="done">تم الكشف</button><button class="btn sm danger" data-act="setStatus" data-id="${n.a.id}" data-s="noshow">لم يحضر</button><button class="btn sm ghost" data-act="reschedule" data-id="${n.a.id}">تأجيل</button></div>`;
      if (n.k === 'today') acts = `<button class="btn sm ghost" data-act="gotoDay" data-d="${todayStr()}">عرض الجدول</button>`;
      if (n.k === 'tmr') acts = `<button class="btn sm wa" data-act="remindDay" data-d="${addDays(todayStr(), 1)}">${icon('msg', 16)} إرسال التذكيرات</button>`;
      return `<div class="notif ${seen.has(n.id) ? '' : 'new'}"><div class="ni" style="background:${bg};color:${c}">${icon(ic)}</div><div class="grow"><h4>${esc(n.title)}</h4><p>${esc(n.body)}</p>${acts}</div></div>`;
    }).join('') : `<div class="card empty"><div class="eic">${icon('bell', 30)}</div><h4>لا توجد تنبيهات</h4><div>كل شيء على ما يرام</div></div>`}</div>`;
  return { head, body, after() { const ids = list.map(n => n.id); const ns = [...new Set([...S.settings.seen.filter(id => ids.includes(id)), ...ids])]; if (ns.length !== S.settings.seen.length || ids.some(i => !S.settings.seen.includes(i))) { S.settings.seen = ns; saveSettings(); setTimeout(updateBadge, 50); } } };
}

/* الإعدادات */
function vSettings() {
  const s = S.settings;
  const li = (ic, title, sub, act, right = icon('next', 18)) => `<button class="li" data-act="${act}"><div class="lic">${icon(ic, 20)}</div><div class="grow"><div style="font-weight:700">${title}</div>${sub ? `<div class="small muted">${sub}</div>` : ''}</div><span class="muted">${right}</span></button>`;
  const head = `<h1>الإعدادات</h1>`;
  const body = `<div class="card row" style="margin-bottom:16px"><div style="width:58px;height:58px">${LOGO.replace('#fff"/><stop offset="1" stop-color="#DDF5F2"', '#0BA39C"/><stop offset="1" stop-color="#0A6F7A"').replace('fill="#0B8F8A"', 'fill="#fff"').replace('stroke="#fff"', 'stroke="#0B8F8A"')}</div>
      <div class="grow"><h3>${esc(s.clinicName)}</h3><div class="small muted">${s.doctorName ? 'د. ' + esc(s.doctorName) + ' • ' : ''}${esc(s.specialty || '')}</div></div></div>
    <div class="sec" style="margin-top:0"><h3>العيادة</h3></div>
    <div class="group">${li('hosp', 'بيانات العيادة والطبيب', 'الاسم، التخصص، الهاتف، العنوان', 'editClinic')}
      ${li('clock', 'أوقات العمل', `${s.start} – ${s.end} • مدة الموعد ${s.slot} د`, 'editHours')}</div>
    <div class="sec"><h3>التنبيهات</h3></div>
    <div class="group">${li('bell', 'التذكير قبل الموعد', `${s.leadMin} دقيقة`, 'editLead')}
      ${li('sun', 'ملخص الصباح', 'إشعار 7:30 صباحاً بعدد مواعيد اليوم', 'toggleMorning', `<span class="toggle ${s.morning ? 'on' : ''}"></span>`)}
      ${Native ? li('alert', 'صلاحية الإشعارات', 'تأكد من السماح بالإشعارات والمنبهات', 'notifPerm') : ''}</div>
    <div class="sec"><h3>البيانات</h3></div>
    <div class="group">${li('db', 'نسخة احتياطية', `${S.patients.length} مريض • ${S.appts.length} موعد • ${S.files.length} ملف`, 'backup')}
      ${li('upload', 'استعادة نسخة احتياطية', 'من نص نسخة سابقة', 'restore')}
      ${li('trash', '<span style="color:var(--d)">حذف كل البيانات</span>', 'لا يمكن التراجع', 'wipe')}</div>
    <p class="small muted" style="text-align:center;margin-top:22px">MOULAYCARE • الإصدار 1.0<br>جميع البيانات محفوظة على هذا الجهاز فقط</p>`;
  return { head, body };
}

/* ---------- النماذج ---------- */
function patientForm(p) {
  const e = p || {};
  openSheet(`${sheetTitle(p ? 'تعديل بيانات المريض' : 'ملف مريض جديد')}
  <form id="pf" class="form" autocomplete="off">
    <label>الاسم الكامل *<input name="name" required value="${esc(e.name)}" placeholder="مثال: محمد أمين"></label>
    <div class="row2"><label>الجنس<select name="gender">${opts(['ذكر', 'أنثى'], e.gender, '—')}</select></label>
      <label>تاريخ الميلاد<input type="date" name="dob" value="${esc(e.dob)}" max="${todayStr()}"></label></div>
    <div class="row2"><label>رقم الهاتف<input type="tel" name="phone" value="${esc(e.phone)}" class="ltr" placeholder="0555 00 00 00"></label>
      <label>فصيلة الدم<select name="blood">${opts(BLOOD, e.blood, '—')}</select></label></div>
    <div class="row2"><label>الوزن (كغ)<input type="number" inputmode="decimal" name="weight" value="${esc(e.weight)}"></label>
      <label>الطول (سم)<input type="number" inputmode="decimal" name="height" value="${esc(e.height)}"></label></div>
    <label>الحساسية<input name="allergies" value="${esc(e.allergies)}" placeholder="بنسلين، أسبرين..."></label>
    <label>الأمراض المزمنة<input name="chronic" value="${esc(e.chronic)}" placeholder="سكري، ضغط..."></label>
    <label>الأدوية الحالية<textarea name="meds">${esc(e.meds)}</textarea></label>
    <label>السوابق الطبية والجراحية<textarea name="history">${esc(e.history)}</textarea></label>
    <div class="row2"><label>العنوان<input name="address" value="${esc(e.address)}"></label><label>التأمين / الضمان<input name="insurance" value="${esc(e.insurance)}"></label></div>
    <label>ملاحظات<textarea name="notes">${esc(e.notes)}</textarea></label>
    <button class="btn primary block">${icon('check', 20)} حفظ الملف</button>
  </form>`, root => {
    $('#pf', root).onsubmit = async ev => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      d.name = d.name.trim(); if (!d.name) return;
      if (!p && d.phone && S.patients.some(x => digits(x.phone) === digits(d.phone))) {
        if (!await confirmBox('رقم مكرر', 'يوجد مريض مسجّل بنفس رقم الهاتف. هل تريد المتابعة؟', 'متابعة', false)) return;
      }
      let obj;
      if (p) obj = { ...p, ...d, updatedAt: Date.now() };
      else {
        S.settings.fileSeq = Math.max(S.settings.fileSeq || 0, S.patients.length) + 1; await saveSettings();
        obj = { id: newId(), ...d, fileNo: 'MC-' + String(S.settings.fileSeq).padStart(4, '0'), visits: [], createdAt: Date.now(), updatedAt: Date.now() };
      }
      await save('patients', obj); closeSheet();
      toast(p ? 'تم تحديث الملف' : 'تم إنشاء ملف المريض ' + obj.fileNo);
      if (!p) go('patient', { pid: obj.id, ptab: 'info' }); else render(false);
      syncReminders();
    };
  });
}

function visitForm(pid, v, fromAppt) {
  const p = pById(pid), e = v || { date: todayStr(), t: mtime(new Date().getHours() * 60 + new Date().getMinutes()) };
  openSheet(`${sheetTitle(v ? 'تعديل الزيارة' : 'تسجيل زيارة')}
  <div class="picked">${avatar(p)}<div class="grow"><b>${esc(p.name)}</b><div class="small muted">${esc(p.fileNo)}</div></div></div>
  <form id="vf" class="form">
    <div class="row2"><label>التاريخ<input type="date" name="date" value="${esc(e.date)}" required></label><label>الوقت<input type="time" name="t" value="${esc(e.t)}"></label></div>
    <label>الشكوى / سبب الزيارة<textarea name="complaint">${esc(e.complaint)}</textarea></label>
    <div class="row3"><label>الضغط<input name="bp" value="${esc(e.bp)}" class="ltr" placeholder="12/8"></label><label>الحرارة<input name="temp" inputmode="decimal" value="${esc(e.temp)}" placeholder="37"></label><label>النبض<input name="pulse" inputmode="numeric" value="${esc(e.pulse)}"></label></div>
    <div class="row2"><label>السكر<input name="sugar" inputmode="decimal" value="${esc(e.sugar)}" placeholder="g/L"></label><label>الوزن (كغ)<input name="weight" inputmode="decimal" value="${esc(e.weight)}"></label></div>
    <label>التشخيص<textarea name="diagnosis">${esc(e.diagnosis)}</textarea></label>
    <label>العلاج / الوصفة<textarea name="treatment" style="min-height:96px">${esc(e.treatment)}</textarea></label>
    <label>ملاحظات<textarea name="notes">${esc(e.notes)}</textarea></label>
    <label>موعد المتابعة المقترح<input type="date" name="followUp" value="${esc(e.followUp)}"></label>
    <button class="btn primary block">${icon('check', 20)} حفظ الزيارة</button>
    ${v ? `<button type="button" class="btn danger block" style="margin-top:8px" id="delV">${icon('trash', 18)} حذف الزيارة</button>` : ''}
  </form>`, root => {
    $('#vf', root).onsubmit = async ev => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      const visits = (p.visits || []).slice();
      if (v) { const i = visits.findIndex(x => x.id === v.id); visits[i] = { ...v, ...d }; }
      else visits.push({ id: newId(), ...d, apptId: fromAppt || null });
      const np = { ...p, visits, updatedAt: Date.now() }; if (d.weight) np.weight = d.weight;
      await save('patients', np); closeSheet(); toast('تم حفظ الزيارة');
      if (d.followUp && !v && await confirmBox('موعد متابعة', `هل تريد حجز موعد متابعة يوم ${fmtLong(d.followUp)}؟`, 'حجز الآن', false)) { apptForm(null, { patientId: p.id, date: d.followUp, type: 'متابعة' }); }
      if (S.view === 'patient') { S.ptab = 'visits'; render(false); } else render(false);
    };
    const dv = $('#delV', root);
    if (dv) dv.onclick = async () => { if (await confirmBox('حذف الزيارة', 'سيتم حذف هذه الزيارة نهائياً.', 'حذف')) { await save('patients', { ...p, visits: p.visits.filter(x => x.id !== v.id) }); closeSheet(); render(false); } };
  });
}

function freeSlots(date, exceptId) {
  const s = S.settings, step = +s.slot || 30, out = [];
  const busy = S.appts.filter(a => a.date === date && a.id !== exceptId && !['cancelled', 'noshow'].includes(a.status)).map(a => [tmin(a.time), tmin(a.time) + (+a.duration || 30)]);
  const now = new Date(), nowM = date === todayStr() ? now.getHours() * 60 + now.getMinutes() : -1;
  for (let m = tmin(s.start); m + step <= tmin(s.end); m += step) {
    const taken = busy.some(([a, b]) => m < b && m + step > a);
    out.push({ t: mtime(m), off: taken || m < nowM });
  }
  return out;
}

function apptForm(a, preset = {}) {
  const e = a ? { ...a } : { date: S.view === 'appts' ? S.selDate : todayStr(), time: '', duration: S.settings.slot || 30, type: 'كشف', status: 'scheduled', ...preset };
  let pid = e.patientId || null;
  openSheet(`${sheetTitle(a ? 'تعديل الموعد' : 'حجز موعد جديد')}
  <form id="af" class="form" autocomplete="off">
    <label>المريض *</label><div id="ppick"></div>
    <div class="row2"><label>التاريخ<input type="date" name="date" value="${esc(e.date)}" required></label><label>الوقت<input type="time" name="time" value="${esc(e.time)}" required></label></div>
    <div class="small muted" style="margin:-6px 0 8px">الأوقات المتاحة:</div><div class="slots" id="slots"></div>
    <div class="row2"><label>نوع الموعد<select name="type">${opts(TYPES, e.type)}</select></label>
      <label>المدة<select name="duration">${opts([['15', '15 دقيقة'], ['20', '20 دقيقة'], ['30', '30 دقيقة'], ['45', '45 دقيقة'], ['60', 'ساعة'], ['90', 'ساعة ونصف']], String(e.duration))}</select></label></div>
    <label>ملاحظات<textarea name="notes" placeholder="سبب الزيارة، تعليمات...">${esc(e.notes)}</textarea></label>
    <div id="conf"></div>
    <button class="btn primary block">${icon('check', 20)} ${a ? 'حفظ التعديلات' : 'تأكيد الحجز'}</button>
  </form>`, root => {
    const f = $('#af', root);
    const drawPick = (q = '') => {
      const box = $('#ppick', root);
      if (pid) {
        const p = pById(pid);
        box.innerHTML = `<div class="picked">${avatar(p)}<div class="grow"><b>${esc(p.name)}</b><div class="small muted ltr" style="text-align:right">${esc(p.fileNo)} ${p.phone ? '• ' + esc(p.phone) : ''}</div></div><button type="button" class="btn sm ghost" id="chg">تغيير</button></div>`;
        $('#chg', box).onclick = () => { pid = null; drawPick(); };
        return;
      }
      const ql = q.toLowerCase();
      const list = S.patients.filter(p => !ql || [p.name, p.phone, p.fileNo].some(x => (x || '').toLowerCase().includes(ql))).slice(0, 30);
      box.innerHTML = `<label style="margin-bottom:8px"><input id="psq" placeholder="ابحث عن مريض..." value="${esc(q)}"></label>
        <div class="searchlist">${list.map(p => `<button type="button" data-pid="${p.id}">${avatar(p)}<div class="grow"><b>${esc(p.name)}</b><div class="small muted">${esc(p.fileNo)}</div></div></button>`).join('')}
        <button type="button" data-new="1" style="color:var(--p);font-weight:700">${icon('userplus', 20)} مريض جديد${q ? ': ' + esc(q) : ''}</button></div>`;
      const inp = $('#psq', box);
      inp.oninput = () => { const pos = inp.selectionStart; drawPick(inp.value); const j = $('#psq', root); j.focus(); j.setSelectionRange(pos, pos); };
      $$('[data-pid]', box).forEach(b => b.onclick = () => { pid = b.dataset.pid; drawPick(); });
      $('[data-new]', box).onclick = () => quickPatient(q, np => { pid = np.id; drawPick(); });
    };
    const drawSlots = () => {
      const sl = freeSlots(f.date.value, a && a.id);
      $('#slots', root).innerHTML = sl.length ? sl.map(x => `<button type="button" ${x.off ? 'disabled' : ''} class="${x.t === f.time.value ? 'on' : ''}" data-t="${x.t}">${x.t}</button>`).join('') : '<span class="small muted">خارج أوقات العمل</span>';
      $$('#slots button', root).forEach(b => b.onclick = () => { f.time.value = b.dataset.t; drawSlots(); checkConf(); });
    };
    const checkConf = () => {
      const st = tmin(f.time.value), en = st + (+f.duration.value);
      const c = S.appts.find(x => x.date === f.date.value && (!a || x.id !== a.id) && !['cancelled', 'noshow'].includes(x.status) && st < tmin(x.time) + (+x.duration || 30) && en > tmin(x.time));
      $('#conf', root).innerHTML = f.time.value && c ? `<div class="warnbox">${icon('alert', 18)}<div>يتعارض مع موعد ${esc(pById(c.patientId)?.name || '')} الساعة ${c.time}</div></div>` : '';
      return c;
    };
    drawPick(); drawSlots(); checkConf();
    f.date.onchange = () => { drawSlots(); checkConf(); };
    f.time.oninput = () => { drawSlots(); checkConf(); };
    f.duration.onchange = checkConf;
    f.onsubmit = async ev => {
      ev.preventDefault();
      if (!pid) { toast('اختر المريض أولاً', 'err'); return; }
      if (checkConf() && !await confirmBox('تعارض في الموعد', 'هذا الوقت محجوز لمريض آخر. هل تريد الحجز رغم ذلك؟', 'حجز رغم التعارض', false)) return;
      const d = Object.fromEntries(new FormData(f));
      const obj = a ? { ...a, ...d, patientId: pid, updatedAt: Date.now() } : { id: newId(), ...d, patientId: pid, status: 'scheduled', createdAt: Date.now() };
      await save('appts', obj);
      const p = pById(pid); if (p) await save('patients', { ...p, updatedAt: Date.now() });
      closeSheet(); toast(a ? 'تم تعديل الموعد' : `تم حجز الموعد: ${fmtLong(obj.date)} • ${obj.time}`);
      if (S.view === 'appts') S.selDate = obj.date;
      render(false); syncReminders();
    };
  });
}

function quickPatient(name, done) {
  const d = $('#dialog');
  d.innerHTML = `<div class="box" style="text-align:right"><h3 style="margin-bottom:12px">مريض جديد سريع</h3><form class="form" id="qp">
    <label>الاسم الكامل<input name="name" required value="${esc(name)}"></label><label>الهاتف<input type="tel" name="phone" class="ltr"></label>
    <div class="btns"><button type="button" class="btn ghost" id="qpc">إلغاء</button><button class="btn primary">إضافة</button></div></form></div>`;
  d.hidden = false; d.onclick = null;
  $('#qpc', d).onclick = () => { d.hidden = true; };
  $('#qp', d).onsubmit = async ev => {
    ev.preventDefault();
    const x = Object.fromEntries(new FormData(ev.target));
    S.settings.fileSeq = Math.max(S.settings.fileSeq || 0, S.patients.length) + 1; await saveSettings();
    const np = { id: newId(), name: x.name.trim(), phone: x.phone, fileNo: 'MC-' + String(S.settings.fileSeq).padStart(4, '0'), visits: [], createdAt: Date.now(), updatedAt: Date.now() };
    await save('patients', np); d.hidden = true; toast('تمت إضافة ' + np.name); done(np);
  };
  setTimeout(() => $('#qp input', d).focus(), 50);
}

function waMessage(a) {
  const p = pById(a.patientId), s = S.settings;
  return `السلام عليكم ${p ? p.name : ''}،\nنذكّركم بموعدكم في ${s.clinicName}${s.doctorName ? ' مع د. ' + s.doctorName : ''}\n📅 ${fmtLong(a.date)}\n🕐 الساعة ${a.time}\n${s.address ? '📍 ' + s.address + '\n' : ''}يرجى تأكيد الحضور بالرد على هذه الرسالة.\nشكراً لكم 🌿`;
}
function waLink(phone, text) {
  let n = digits(phone).replace(/^\+/, '');
  if (n.startsWith('00')) n = n.slice(2);
  else if (n.startsWith('0')) n = (digits(S.settings.cc).replace('+', '') || '213') + n.slice(1);   // رمز الدولة من الإعدادات
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

function apptSheet(id) {
  const a = S.appts.find(x => x.id === id); if (!a) return;
  const p = pById(a.patientId), st = STATUS[a.status];
  const ph = p && digits(p.phone);
  const sb = k => `<button data-act="setStatus" data-id="${a.id}" data-s="${k}" class="${a.status === k ? 'on' : ''}" style="color:${STATUS[k].col}">${icon(STATUS[k].ic, 20)}<span style="color:var(--t)">${STATUS[k].l}</span></button>`;
  openSheet(`${sheetTitle('تفاصيل الموعد')}
    <div class="card"><div class="row">${avatar(p)}<div class="grow"><h4>${esc(p ? p.name : 'مريض محذوف')}</h4><div class="meta"><span class="ltr">${esc(p?.fileNo || '')}</span>${p?.phone ? `<span class="ltr">${esc(p.phone)}</span>` : ''}</div></div>
      ${p ? `<button class="btn sm ghost" data-act="openPatient" data-id="${p.id}">الملف</button>` : ''}</div>
      ${p?.allergies ? `<div class="alert" style="margin-top:12px">${icon('alert', 18)}<div>حساسية: ${esc(p.allergies)}</div></div>` : ''}
      <dl class="kv" style="margin:14px 0 0"><dt>التاريخ</dt><dd>${esc(fmtLong(a.date))}</dd><dt>الوقت</dt><dd class="ltr" style="text-align:right">${esc(a.time)} (${a.duration || 30} د)</dd><dt>النوع</dt><dd>${esc(a.type)}</dd>${a.notes ? `<dt>ملاحظات</dt><dd>${esc(a.notes)}</dd>` : ''}<dt>الحالة</dt><dd><span class="chip ${st.c}">${st.l}</span></dd></dl></div>
    <div class="sec" style="margin-top:16px"><h3>تحديث الحالة</h3></div>
    <div class="statusgrid">${['scheduled', 'confirmed', 'waiting', 'done', 'noshow', 'cancelled'].map(sb).join('')}</div>
    ${ph ? `<div class="btns" style="margin-top:14px"><button class="btn wa" data-act="waRemind" data-id="${a.id}">${icon('msg', 18)} تذكير واتساب</button><button class="btn" data-act="call" data-ph="${esc(ph)}">${icon('phone', 18)} اتصال</button></div>` : ''}
    <div class="btns" style="margin-top:8px"><button class="btn ghost" data-act="editAppt" data-id="${a.id}">${icon('edit', 18)} تعديل / تأجيل</button><button class="btn danger" data-act="delAppt" data-id="${a.id}">${icon('trash', 18)} حذف</button></div>`);
}

/* ---------- الملفات ---------- */
let filePid = null;
function readAsDataURL(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); }); }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function resize(img, max, q) {
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}
async function onFilePicked(file) {
  if (!file || !filePid) return;
  try {
    let data, thumb = null, mime = file.type || 'application/octet-stream';
    if (mime.startsWith('image/')) {
      const img = await loadImg(await readAsDataURL(file));
      data = resize(img, 2000, .85); thumb = resize(img, 320, .7); mime = 'image/jpeg';
    } else {
      if (file.size > 25 * 1048576) { toast('الملف كبير جداً (الحد 25 م.ب)', 'err'); return; }
      data = await readAsDataURL(file);
    }
    const base = file.name.replace(/\.[^.]+$/, '');
    openSheet(`${sheetTitle('إرفاق ملف')}
      <div class="card" style="text-align:center;margin-bottom:14px">${thumb ? `<img src="${thumb}" style="max-width:100%;max-height:200px;border-radius:12px">` : `<div style="color:var(--p);display:flex;justify-content:center">${icon('file', 56, 1.5)}</div><div class="small muted">${esc(file.name)} • ${sizeStr(file.size)}</div>`}</div>
      <form class="form" id="ff"><label>اسم الملف<input name="name" value="${esc(base)}" required></label>
      <label>التصنيف<select name="category">${opts(FCATS, mime.startsWith('image/') ? 'تحاليل' : 'تقرير')}</select></label>
      <label>التاريخ<input type="date" name="date" value="${todayStr()}"></label>
      <label>ملاحظة<input name="note"></label>
      <button class="btn primary block">${icon('upload', 20)} حفظ في ملف المريض</button></form>`, root => {
      $('#ff', root).onsubmit = async ev => {
        ev.preventDefault();
        const d = Object.fromEntries(new FormData(ev.target)), id = newId();
        try { await DB.put('blobs', { id, data }); } catch (e) { toast('مساحة التخزين ممتلئة', 'err'); return; }
        await save('files', { id, patientId: filePid, ...d, mime, size: Math.round(data.length * .75), thumb, createdAt: Date.now() });
        closeSheet(); toast('تم إرفاق الملف'); S.ptab = 'files'; render(false);
      };
    });
  } catch (e) { toast('تعذّرت قراءة الملف', 'err'); }
}
function dataURLtoBlob(u) { const [h, b] = u.split(','); const m = h.match(/:(.*?);/)[1]; const s = atob(b); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return new Blob([a], { type: m }); }
async function fileSheet(id) {
  const f = S.files.find(x => x.id === id); if (!f) return;
  const b = await DB.get('blobs', id); const data = b && b.data;
  let url = null, view;
  if (!data) view = `<div class="empty">تعذّر العثور على محتوى الملف</div>`;
  else if (f.mime.startsWith('image/')) view = `<img src="${data}" alt="">`;
  else if (f.mime === 'application/pdf') { url = URL.createObjectURL(dataURLtoBlob(data)); view = `<iframe src="${url}"></iframe>`; }
  else view = `<div class="card empty">${icon('file', 40)}<div>${esc(f.name)}</div></div>`;
  openSheet(`${sheetTitle(esc(f.name))}
    <div class="row" style="margin:-6px 0 12px"><span class="chip">${esc(f.category)}</span><span class="small muted">${esc(fmtFull(f.date || todayStr()))} • ${sizeStr(f.size)}</span></div>
    ${f.note ? `<p class="small">${esc(f.note)}</p>` : ''}
    <div class="viewer">${view}</div>
    <div class="btns" style="margin-top:14px">${data && Native && Native.shareFile ? `<button class="btn" id="shf">${icon('share', 18)} مشاركة / فتح</button>` : ''}<button class="btn danger" id="delf">${icon('trash', 18)} حذف الملف</button></div>`, root => {
    const sh = $('#shf', root);
    if (sh) sh.onclick = () => { try { Native.shareFile(data, f.name + (f.mime === 'application/pdf' ? '.pdf' : f.mime.startsWith('image/') ? '.jpg' : '')); } catch (e) { toast('تعذّرت المشاركة', 'err'); } };
    $('#delf', root).onclick = async () => { if (await confirmBox('حذف الملف', 'سيتم حذف الملف نهائياً من ملف المريض.', 'حذف')) { await remove('files', id); await DB.del('blobs', id); closeSheet(); toast('تم حذف الملف'); render(false); } };
    return () => { if (url) URL.revokeObjectURL(url); };
  });
}

/* ---------- الإعدادات (نوافذ) ---------- */
function clinicForm() {
  const s = S.settings;
  openSheet(`${sheetTitle('بيانات العيادة')}<form class="form" id="cf">
    <label>اسم العيادة<input name="clinicName" value="${esc(s.clinicName)}" required></label>
    <label>اسم الطبيب<input name="doctorName" value="${esc(s.doctorName)}" placeholder="بدون د."></label>
    <label>التخصص<input name="specialty" value="${esc(s.specialty)}"></label>
    <label>هاتف العيادة<input type="tel" name="phone" value="${esc(s.phone)}" class="ltr"></label>
    <label>رمز الدولة للواتساب<select name="cc">${opts([['213', 'الجزائر +213'], ['212', 'المغرب +212'], ['216', 'تونس +216'], ['218', 'ليبيا +218'], ['222', 'موريتانيا +222'], ['20', 'مصر +20'], ['966', 'السعودية +966'], ['971', 'الإمارات +971'], ['234', 'نيجيريا +234'], ['33', 'فرنسا +33']], s.cc || '213')}</select></label>
    <label>العنوان (يظهر في رسائل التذكير)<input name="address" value="${esc(s.address)}"></label>
    <button class="btn primary block">حفظ</button></form>`, root => {
    $('#cf', root).onsubmit = async ev => { ev.preventDefault(); Object.assign(S.settings, Object.fromEntries(new FormData(ev.target))); await saveSettings(); closeSheet(); toast('تم الحفظ'); render(false); };
  });
}
function hoursForm() {
  const s = S.settings;
  openSheet(`${sheetTitle('أوقات العمل')}<form class="form" id="hf">
    <div class="row2"><label>بداية الدوام<input type="time" name="start" value="${esc(s.start)}"></label><label>نهاية الدوام<input type="time" name="end" value="${esc(s.end)}"></label></div>
    <label>المدة الافتراضية للموعد<select name="slot">${opts([['15', '15 دقيقة'], ['20', '20 دقيقة'], ['30', '30 دقيقة'], ['45', '45 دقيقة'], ['60', 'ساعة']], String(s.slot))}</select></label>
    <button class="btn primary block">حفظ</button></form>`, root => {
    $('#hf', root).onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(ev.target)); d.slot = +d.slot; Object.assign(S.settings, d); await saveSettings(); closeSheet(); toast('تم الحفظ'); render(false); };
  });
}
function leadForm() {
  const s = S.settings;
  openSheet(`${sheetTitle('التذكير قبل الموعد')}<div class="statusgrid" id="lg">${[10, 15, 30, 60, 120, 1440].map(m => `<button data-m="${m}" class="${+s.leadMin === m ? 'on' : ''}" style="color:var(--p)">${icon('bell', 20)}<span style="color:var(--t)">${m === 1440 ? 'قبل يوم' : m >= 60 ? m / 60 + ' ساعة' : m + ' دقيقة'}</span></button>`).join('')}</div>`, root => {
    $$('#lg button', root).forEach(b => b.onclick = async () => { S.settings.leadMin = +b.dataset.m; await saveSettings(); closeSheet(); toast('تم الحفظ'); render(false); syncReminders(); });
  });
}
async function backup() {
  const blobs = await DB.all('blobs');
  const json = JSON.stringify({ app: 'MOULAYCARE', v: 1, at: new Date().toISOString(), settings: S.settings, patients: S.patients, appts: S.appts, files: S.files, blobs });
  if (Native && Native.saveBackup) { try { Native.saveBackup(json, 'MOULAYCARE-backup-' + todayStr() + '.json'); return; } catch (e) { } }
  openSheet(`${sheetTitle('نسخة احتياطية')}<p class="small muted">انسخ النص واحفظه في مكان آمن. يحتوي على كل بيانات المرضى.</p>
    <textarea class="form" style="width:100%;height:160px;border-radius:13px;border:1.5px solid var(--line);padding:10px;direction:ltr;font-size:11px" readonly>${esc(json.slice(0, 200000))}</textarea>
    <button class="btn primary block" style="margin-top:10px" id="cpb">${icon('copy', 18)} نسخ</button>`, root => { $('#cpb', root).onclick = () => copyText(json); });
}
function restoreForm() {
  openSheet(`${sheetTitle('استعادة نسخة احتياطية')}
    <p class="small muted">${Native ? 'اختر ملف النسخة الاحتياطية (.json) أو الصق محتواه.' : 'الصق محتوى النسخة الاحتياطية.'} سيتم <b>استبدال</b> البيانات الحالية.</p>
    <input type="file" id="rfile" accept="application/json,.json,text/plain" class="btn ghost block" style="padding-top:10px;margin-bottom:10px">
    <form class="form" id="rf"><textarea name="t" style="direction:ltr;height:140px" placeholder="{ ... }"></textarea><button class="btn primary block">استعادة</button></form>`, root => {
    $('#rfile', root).onchange = async e => { const f = e.target.files[0]; if (f) $('#rf textarea', root).value = await f.text(); };
    $('#rf', root).onsubmit = async ev => {
      ev.preventDefault();
      let d; try { d = JSON.parse(ev.target.t.value); } catch (e) { toast('النص غير صالح', 'err'); return; }
      if (d.app !== 'MOULAYCARE') { toast('هذه ليست نسخة MOULAYCARE', 'err'); return; }
      if (!await confirmBox('استبدال البيانات', 'سيتم حذف البيانات الحالية واستبدالها بالنسخة الاحتياطية.', 'استعادة')) return;
      for (const s of ['patients', 'appts', 'files', 'blobs']) { await DB.clear(s); for (const o of (d[s] || [])) await DB.put(s, o); }
      Object.assign(S.settings, d.settings || {}); await saveSettings();
      await loadAll(); closeSheet(); toast('تمت الاستعادة بنجاح'); render(); syncReminders();
    };
  });
}

/* ---------- بيانات تجريبية ---------- */
async function loadDemo() {
  const names = [['أمينة بن علي', 'أنثى', '1988-04-12', 'O+', 'البنسلين', ''], ['يوسف مولاي', 'ذكر', '1975-09-03', 'A+', '', 'ارتفاع ضغط الدم'], ['خديجة حمدي', 'أنثى', '1962-01-20', 'B+', '', 'سكري النوع 2'],
    ['سليم براهيمي', 'ذكر', '2015-06-08', 'A-', 'الفول السوداني', ''], ['نور الهدى قاسم', 'أنثى', '1996-11-30', 'AB+', '', ''], ['عبد القادر زروقي', 'ذكر', '1950-03-15', 'O-', 'الأسبرين', 'قصور القلب، سكري']];
  const t = todayStr(), ps = [];
  for (const [i, n] of names.entries()) {
    S.settings.fileSeq = (S.settings.fileSeq || 0) + 1;
    const p = { id: newId(), name: n[0], gender: n[1], dob: n[2], blood: n[3], allergies: n[4], chronic: n[5], phone: '055' + (1000000 + i * 137531).toString().slice(0, 7), fileNo: 'MC-' + String(S.settings.fileSeq).padStart(4, '0'), visits: [], createdAt: Date.now() - i * 864e5, updatedAt: Date.now() - i * 1e6, demo: true };
    if (i < 3) p.visits.push({ id: newId(), date: addDays(t, -14 - i * 5), t: '10:30', complaint: 'صداع وتعب عام', bp: i === 1 ? '15/9' : '12/8', temp: '37.2', diagnosis: i === 2 ? 'متابعة السكري — السكر مرتفع قليلاً' : 'إرهاق', treatment: 'باراسيتامول 1غ عند الحاجة\nراحة وشرب الماء', followUp: '' });
    ps.push(p); await save('patients', p);
  }
  const now = new Date(), nm = Math.ceil((now.getHours() * 60 + now.getMinutes()) / 30) * 30;
  const slots = [[0, nm + 20, 'كشف', 'confirmed'], [1, nm + 60, 'متابعة', 'scheduled'], [2, nm + 120, 'فحص دوري', 'scheduled'], [3, nm - 90, 'كشف', 'done'], [4, nm - 30, 'استشارة', 'scheduled']];
  for (const [pi, m, type, st] of slots) {
    let d = t, mm = m; if (mm >= 24 * 60) { d = addDays(t, 1); mm -= 24 * 60; } if (mm < 0) mm = 0;
    await save('appts', { id: newId(), patientId: ps[pi].id, date: d, time: mtime(mm), duration: 30, type, status: st, createdAt: Date.now(), demo: true });
  }
  await save('appts', { id: newId(), patientId: ps[5].id, date: addDays(t, 1), time: '10:00', duration: 30, type: 'متابعة', status: 'scheduled', demo: true, createdAt: Date.now() });
  await save('appts', { id: newId(), patientId: ps[1].id, date: addDays(t, 1), time: '11:30', duration: 30, type: 'تحاليل', status: 'scheduled', demo: true, createdAt: Date.now() });
  await saveSettings(); toast('تمت إضافة بيانات تجريبية'); render(); syncReminders();
}

/* ---------- الأحداث ---------- */
const A = {
  closeSheet, back: () => window.mcBack(),
  newPatient: () => patientForm(),
  editPatient: d => patientForm(pById(d.id)),
  openPatient: d => { closeSheet(); go('patient', { pid: d.id, ptab: 'info' }); },
  ptab: d => { S.ptab = d.k; render(false); },
  pfilter: d => { S.pfilter = d.k; render(false); },
  apfilter: d => { S.apFilter = d.k; render(false); },
  newAppt: d => apptForm(null, d.pid ? { patientId: d.pid } : {}),
  openAppt: d => apptSheet(d.id),
  editAppt: d => apptForm(S.appts.find(x => x.id === d.id)),
  reschedule: d => apptForm(S.appts.find(x => x.id === d.id)),
  gotoDay: d => { S.selDate = d.d; if (S.view !== 'appts') goTab('appts'); else render(); },
  shiftWeek: d => { S.selDate = addDays(S.selDate, +d.n); render(); },
  newVisit: d => visitForm(d.id),
  editVisit: d => { const p = pById(d.pid); visitForm(d.pid, p.visits.find(v => v.id === d.id)); },
  addFile: d => { filePid = d.id; const i = $('#fileIn'); i.value = ''; i.click(); },
  openFile: d => fileSheet(d.id),
  call: d => openExternal('tel:' + d.ph),
  wa: d => openExternal(waLink(d.ph, `السلام عليكم، معكم ${S.settings.clinicName}.`)),
  waRemind: async d => {
    const a = S.appts.find(x => x.id === d.id), p = pById(a.patientId);
    openExternal(waLink(p.phone, waMessage(a)));
    if (!a.reminded) await save('appts', { ...a, reminded: Date.now() });
  },
  setStatus: async d => {
    const a = S.appts.find(x => x.id === d.id); if (!a) return;
    await save('appts', { ...a, status: d.s, updatedAt: Date.now() });
    try { Native && Native.vibrate && Native.vibrate(); } catch (e) { }
    toast('الحالة: ' + STATUS[d.s].l); syncReminders();
    if (d.s === 'done' && pById(a.patientId)) {
      closeSheet(); render(false);
      if (await confirmBox('تم الكشف', 'هل تريد تسجيل تفاصيل الزيارة (التشخيص والعلاج) في ملف المريض؟', 'تسجيل الزيارة', false)) visitForm(a.patientId, null, a.id);
      return;
    }
    if (!$('#sheetWrap').hidden) apptSheet(a.id);
    render(false);
  },
  delAppt: async d => { if (await confirmBox('حذف الموعد', 'هل تريد حذف هذا الموعد نهائياً؟ (يمكنك بدلاً من ذلك تغيير حالته إلى ملغي)', 'حذف')) { await remove('appts', d.id); closeSheet(); toast('تم حذف الموعد'); render(false); syncReminders(); } },
  delPatient: async d => {
    const p = pById(d.id);
    if (!await confirmBox('حذف ملف المريض', `سيتم حذف ملف ${esc(p.name)} مع جميع مواعيده وملفاته المرفقة نهائياً.`, 'حذف نهائي')) return;
    for (const a of S.appts.filter(x => x.patientId === d.id)) await remove('appts', a.id);
    for (const f of S.files.filter(x => x.patientId === d.id)) { await remove('files', f.id); await DB.del('blobs', f.id); }
    await remove('patients', d.id); S.stack = []; toast('تم حذف الملف'); goTab('patients'); syncReminders();
  },
  remindTomorrow: () => remindDay(addDays(todayStr(), 1)),
  remindDay: d => remindDay(d.d),
  editClinic: clinicForm, editHours: hoursForm, editLead: leadForm,
  toggleMorning: async () => { S.settings.morning = !S.settings.morning; await saveSettings(); render(false); syncReminders(); },
  notifPerm: () => { try { Native.requestPermissions(); } catch (e) { } },
  backup, restore: restoreForm,
  wipe: async () => {
    if (!await confirmBox('حذف كل البيانات', 'سيتم حذف جميع المرضى والمواعيد والملفات نهائياً من هذا الجهاز. ننصح بأخذ نسخة احتياطية أولاً.', 'حذف الكل')) return;
    for (const s of ['patients', 'appts', 'files', 'blobs']) await DB.clear(s);
    S.patients = []; S.appts = []; S.files = []; S.settings.fileSeq = 0; S.settings.seen = []; await saveSettings();
    toast('تم حذف جميع البيانات'); goTab('home'); syncReminders();
  },
  demo: loadDemo,
};
function remindDay(date) {
  const list = apptsOn(date).filter(a => ACTIVE.includes(a.status));
  if (!list.length) { toast('لا توجد مواعيد ' + (date === addDays(todayStr(), 1) ? 'غداً' : 'في هذا اليوم')); return; }
  openSheet(`${sheetTitle('تذكير المرضى — ' + esc(fmtLong(date)))}
    <p class="small muted" style="margin-top:-6px">اضغط على كل مريض لإرسال رسالة تذكير جاهزة عبر واتساب.</p>
    <div class="stack">${list.map(a => { const p = pById(a.patientId); return `<div class="item">${avatar(p)}<div class="grow"><h4 class="ellipsis">${esc(p?.name)}</h4><div class="meta"><span class="ltr">${esc(a.time)}</span>${a.reminded ? `<span class="chip ok" style="padding:1px 8px">${icon('check', 12)} أُرسل</span>` : ''}</div></div>
      ${p?.phone ? `<button class="btn sm wa" data-act="waRemind" data-id="${a.id}">${icon('msg', 16)} إرسال</button>` : '<span class="small muted">لا هاتف</span>'}</div>`; }).join('')}</div>`);
}

document.addEventListener('click', e => {
  const n = e.target.closest('[data-nav]');
  if (n) { if (n.dataset.nav === S.view && !S.stack.length) return; closeSheet(); goTab(n.dataset.nav); return; }
  const b = e.target.closest('[data-act]');
  if (b && A[b.dataset.act]) { e.preventDefault(); const fn = A[b.dataset.act]; Promise.resolve(fn({ ...b.dataset })).then(() => { if (b.dataset.act === 'waRemind' && !$('#sheetWrap').hidden && $('#sheetBody .item')) { /* تحديث قائمة التذكير */ } }); }
});
$('#sheetBg').onclick = closeSheet;
$('#fab').onclick = () => S.view === 'patients' ? patientForm() : apptForm(null, S.view === 'patient' ? { patientId: S.pid } : {});
$('#fileIn').onchange = e => onFilePicked(e.target.files[0]);

/* ---------- التشغيل ---------- */
(async function boot() {
  $('.splash-logo').innerHTML = LOGO;
  hydrateIcons($('#nav'));
  await loadAll();
  render();
  setTimeout(() => { $('#splash').classList.add('out'); $('#app').hidden = false; setTimeout(() => $('#splash').remove(), 400); }, 700);
  syncReminders();
  setInterval(tick, 30000); setTimeout(tick, 1500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { render(false); tick(); } });
  // فتح موعد من إشعار
  window.mcOpenAppt = id => { const a = S.appts.find(x => x.id === id); if (a) { S.selDate = a.date; goTab('appts'); apptSheet(id); } };
})();
