// ================= DATA =================
const SKILLS = ['Python','TensorFlow','Keras','OpenCV','Machine Learning','Deep Learning','CNN','Reinforcement Learning','Flask','React.js','HTML5','CSS3','JavaScript','MongoDB','MySQL','SQL','Power BI','Tableau','Excel','R','C','C++','Java','Raspberry Pi','Arduino','IoT Sensors','Google Cloud','AWS MLOps','Salesforce','Data Analytics'];
const LEVELS = [
  ['Python',70],['Keras',70],['Flask',70],['OpenCV',70],['Power BI',72],['Tableau',68],['MySQL',70],['C',68],
  ['TensorFlow',45],['C++',40],['Java',40],['Excel',95],['Design Thinking',92],['Time Management',92],['Adaptability',94]
];
const CERTS = [
  ['google-cloud','Google Cloud Career Launchpad — Cloud Engineer Track','Google Cloud · Apr 2025'],
  ['nptel-rl','Reinforcement Learning (12-week)','NPTEL · IIT · Jan–Apr 2025'],
  ['deloitte-forage','Data Analytics Job Simulation','Deloitte × Forage · Jun 2025'],
  ['mlops','MLOps with AWS — Bootcamp Zero to Hero','Udemy · Apr 2025 · 38 hrs'],
  ['hands-on-rl','Hands-On Reinforcement Learning with Python','Infosys Springboard · Dec 2024'],
  ['vtu-data-analytics','Certified Data Analyst (3 Credits)','VTU Centre for Online Education · 2026'],
  ['ux-design','UX Design Certificate (3 Credits)','VTU Centre for Online Education · May 2026'],
  ['dbms','DBMS Uncovered: The Heart of Data Management','Udemy · Jan 2024 · 7.5 hrs'],
  ['android','Master Android Application — Build 3 Apps','Udemy · Jan 2024 · 2.5 hrs'],
  ['r-training','R Programming Training','Spoken Tutorial, IIT Bombay · Feb 2024'],
];

// ================= LOADER =================
const loader = document.getElementById('loader');
const num = document.getElementById('ld-num'), fill = document.getElementById('ld-fill'), status = document.getElementById('ld-status');
const clock = document.getElementById('ld-clock');
const t0 = performance.now();
let pct = 0;
const tick = () => {
  const el = performance.now() - t0;
  clock.textContent = new Date().toTimeString().slice(0, 8);
  pct = Math.min(100, Math.round((1 - Math.pow(1 - Math.min(el / 2200, 1), 3)) * 100));
  num.textContent = pct; fill.style.width = pct + '%';
  if (pct > 40) status.textContent = 'COMPILING ASSETS...';
  if (pct > 80) status.textContent = 'CALIBRATING NEURAL NET...';
  if (pct < 100) requestAnimationFrame(tick);
  else {
    status.textContent = 'SYSTEM READY';
    setTimeout(() => { loader.classList.add('done'); document.body.classList.remove('loading'); }, 450);
    setTimeout(() => loader.remove(), 1600);
  }
};
requestAnimationFrame(tick);

// ================= NAV =================
const nav = document.getElementById('nav');
const navLinks = nav.querySelector('nav');
nav.querySelector('.burger').onclick = () => navLinks.classList.toggle('open');
navLinks.querySelectorAll('a').forEach(a => a.onclick = () => navLinks.classList.remove('open'));

// ================= HERO SCRUB =================
const wrap = document.querySelector('.hero-wrap');
const hp1 = document.querySelector('.hp1'), hp2 = document.querySelector('.hp2');
const titles = [...document.querySelectorAll('.t')], descs = [...document.querySelectorAll('.desc')];
const prog = document.getElementById('hero-prog');
let curIdx = 0;
// ---- 360° turn: scroll-scrubbed frame sequence ----
// Drop frames in assets/hero-frames/ (frame_0001.jpg ...) plus frames.json {"count":N}.
// If they are missing, the hero falls back to the two-photo cross-fade.
const heroEl = document.querySelector('.hero');
const seqCanvas = document.getElementById('hero-seq');
const seqCtx = seqCanvas.getContext('2d');
const seq = { frames: [], ready: false, last: -1 };
function sizeSeqCanvas() {
  const r = seqCanvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  seqCanvas.width = Math.round(r.width * d); seqCanvas.height = Math.round(r.height * d);
  seq.last = -1;
}
function drawSeq(i) {
  const img = seq.frames[i];
  if (!img || !img.complete || !img.naturalWidth || i === seq.last) return;
  seq.last = i;
  const cw = seqCanvas.width, ch = seqCanvas.height;
  const sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight); // object-fit: cover
  const w = img.naturalWidth * sc, h = img.naturalHeight * sc;
  seqCtx.clearRect(0, 0, cw, ch);
  seqCtx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}
fetch('assets/hero-frames/frames.json', { cache: 'no-cache' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(({ count, ext = 'jpg' }) => {
    seq.frames = Array.from({ length: count }, (_, i) => {
      const img = new Image();
      img.src = `assets/hero-frames/frame_${String(i + 1).padStart(4, '0')}.${ext}`;
      return img;
    });
    seq.frames[0].onload = () => { seq.ready = true; heroEl.classList.add('seq'); sizeSeqCanvas(); heroScrub(); };
    seq.frames.forEach(img => img.addEventListener('load', () => seq.ready && heroScrub()));
  })
  .catch(() => {});
addEventListener('resize', () => seq.ready && sizeSeqCanvas());

function heroScrub() {
  const max = wrap.offsetHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / max));
  prog.style.height = (p * 100) + '%';
  if (seq.ready) {
    // nearest already-loaded frame so scrubbing never shows a blank
    let i = Math.round(p * (seq.frames.length - 1));
    for (let k = 0; k < seq.frames.length && !seq.frames[i].complete; k++) i = Math.max(0, i - 1);
    drawSeq(i);
    seqCanvas.style.transform = `scale(${1 + p * .04})`;
  }
  // photo 1: slowly pushes in and turns away; photo 2 turns in from the other side
  const swap = Math.min(1, Math.max(0, (p - .38) / .24)); // 0 -> 1 between 38% and 62%
  hp1.style.opacity = 1 - swap;
  hp1.style.transform = `perspective(1200px) translateX(${-swap * 6}%) rotateY(${-swap * 14}deg) scale(${1 + p * .06})`;
  hp1.style.filter = `blur(${swap * 6}px) drop-shadow(0 30px 40px rgba(0,0,0,.25))`;
  hp2.style.opacity = swap;
  hp2.style.transform = `perspective(1200px) translateX(${(1 - swap) * 6}%) rotateY(${(1 - swap) * 14}deg) scale(${1.04 + p * .04})`;
  hp2.style.filter = `blur(${(1 - swap) * 6}px) drop-shadow(0 30px 40px rgba(0,0,0,.25))`;
  const idx = Math.min(2, Math.floor(p * 3));
  if (idx !== curIdx) {
    curIdx = idx;
    titles.forEach((t, i) => t.classList.toggle('active', i === idx));
    descs.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
}

// ================= ACTIVE NAV + SCROLL =================
const secIds = ['home','about','skills','expertise','experience','projects','certifications','contact'];
function onScroll() {
  nav.classList.toggle('scrolled', scrollY > innerHeight * .9);
  heroScrub();
  let on = 'home';
  for (const id of secIds) { const s = document.getElementById(id); if (s.getBoundingClientRect().top < innerHeight * .4) on = id; }
  navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + on));
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// ================= SKILLS =================
const pills = arr => arr.map(s => `<span class="pillk">${s}</span>`).join('');
const half = Math.ceil(SKILLS.length / 2);
const r1 = SKILLS.slice(0, half), r2 = SKILLS.slice(half);
document.getElementById('m1').innerHTML = pills(r1) + pills(r1);
document.getElementById('m2').innerHTML = pills(r2) + pills(r2);
const lvl = v => v >= 90 ? 'Expert' : v >= 60 ? 'Intermediate' : 'Beginner';
document.getElementById('levels').innerHTML = LEVELS.map(([n, v]) =>
  `<div class="lv"><div>${n}<span>${lvl(v)}</span></div><i><b data-w="${v}"></b></i></div>`).join('');

// ================= CERTS =================
const certWrap = document.getElementById('certs');
certWrap.innerHTML = CERTS.map(([f, t, m]) =>
  `<article class="cert reveal" data-f="${f}"><div class="thumb"><img loading="lazy" src="assets/certs/${f}.jpg" alt="${t}"></div><div class="meta"><h4>${t}</h4><p>${m}</p></div></article>`).join('');
const lb = document.getElementById('lightbox');
certWrap.addEventListener('click', e => {
  const c = e.target.closest('.cert'); if (!c) return;
  const f = c.dataset.f;
  lb.querySelector('img').src = `assets/certs/${f}.jpg`;
  lb.querySelector('b').textContent = c.querySelector('h4').textContent;
  lb.querySelector('a').href = `assets/certs/${f}.pdf`;
  lb.classList.add('open');
});
lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('open'); });
addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

// ================= REVEAL =================
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  en.target.querySelectorAll?.('[data-w]').forEach(b => b.style.width = b.dataset.w + '%');
  io.unobserve(en.target);
}), { threshold: .15 });
document.querySelectorAll('.reveal, #giant').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

// ================= TILT =================
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = 'perspective(900px) rotateY(-8deg) rotateX(4deg)');
  card.style.transform = 'perspective(900px) rotateY(-8deg) rotateX(4deg)';
});

// ================= PROJECT CAROUSEL =================
const cards = document.getElementById('cards');
const pcs = [...cards.children];
const dots = document.getElementById('dots');
dots.innerHTML = pcs.map((_, i) => `<button aria-label="Project ${i + 1}"></button>`).join('');
const go = i => { const c = pcs[(i + pcs.length) % pcs.length]; cards.scrollTo({ left: c.offsetLeft - (cards.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); };
let focus = 0;
function markFocus() {
  const mid = cards.scrollLeft + cards.clientWidth / 2;
  let best = 0, bd = Infinity;
  pcs.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
  focus = best;
  pcs.forEach((c, i) => c.classList.toggle('focus', i === best));
  [...dots.children].forEach((d, i) => d.classList.toggle('on', i === best));
}
cards.addEventListener('scroll', markFocus, { passive: true });
document.querySelector('.nav-btn.prev').onclick = () => go(focus - 1);
document.querySelector('.nav-btn.next').onclick = () => go(focus + 1);
[...dots.children].forEach((d, i) => d.onclick = () => go(i));
pcs.forEach((c, i) => c.addEventListener('click', e => { if (i !== focus && !e.target.closest('a')) go(i); }));
markFocus();

// ================= CONTACT =================
const q = id => document.getElementById(id);
const live = () => {
  const name = `${q('f-first').value} ${q('f-last').value}`.trim();
  q('pv-name').textContent = `"${name || '[Awaiting Name]'}"`;
  q('pv-email').textContent = `"${q('f-email').value || '[Awaiting Email]'}"`;
  q('pv-msg').textContent = `"${q('f-msg').value || '[Awaiting Message]'}"`;
};
['f-first','f-last','f-email','f-msg'].forEach(id => q(id).addEventListener('input', live));
// Messages are delivered to the inbox below through FormSubmit (free, no backend needed).
// The very first submission triggers a one-time "Activate form" email to this address.
const INBOX = 'udayarajdhori@gmail.com';
q('cform').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  const st = q('f-status');
  const name = `${q('f-first').value} ${q('f-last').value}`.trim();
  const email = q('f-email').value, message = q('f-msg').value;
  btn.disabled = true; btn.textContent = 'Transmitting...';
  st.className = 'f-status'; st.textContent = '';
  // Give up after 15 s instead of spinning forever if the mail service stalls.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    // Plain FormData (no custom Content-Type) keeps this a "simple" request with no CORS preflight.
    const fd = new FormData();
    Object.entries({ name, email, message, _subject: `Portfolio message from ${name}`, _replyto: email, _template: 'table', _captcha: 'false' })
      .forEach(([k, v]) => fd.append(k, v));
    const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
      method: 'POST', headers: { Accept: 'application/json' }, body: fd, signal: ctrl.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) === 'false') throw new Error(data.message || `Server replied ${res.status}`);
    st.classList.add('ok');
    st.textContent = '✓ Message sent! I\'ll get back to you soon.';
    e.target.reset(); live();
  } catch (err) {
    console.warn('Contact form error:', err);
    const gmail = `https://mail.google.com/mail/?view=cm&to=${INBOX}&su=${encodeURIComponent('Portfolio message from ' + name)}&body=${encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')')}`;
    const msg = String(err.message || '');
    let reason = 'Couldn\'t send right now.';
    if (err.name === 'AbortError') reason = 'The mail service is taking too long to respond.';
    else if (location.protocol === 'file:' || /web server|html file/i.test(msg))
      reason = 'Sending only works when the site is opened from a web address (http/https), not as a local file.';
    else if (/activat/i.test(msg)) {
      // FormSubmit's first-ever submission: an activation email has gone to the inbox owner.
      st.classList.add('ok');
      st.textContent = 'Almost there — the site owner must activate this form once (check the inbox for "Activate FormSubmit").';
      return;
    } else if (msg && !/fetch|network|load failed/i.test(msg)) reason = `Couldn't send: ${msg}`;
    st.classList.add('err');
    st.innerHTML = '';
    st.append(reason + ' ');
    const a = Object.assign(document.createElement('a'), { href: gmail, target: '_blank', rel: 'noopener', textContent: 'Send via Gmail instead →' });
    st.append(a);
  } finally {
    clearTimeout(timer);
    btn.disabled = false; btn.textContent = 'Send Message →';
  }
});
