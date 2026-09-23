/* ═══════════════════════════════
   HELPERS
═══════════════════════════════ */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/* ═══════════════════════════════
   STARFIELD
═══════════════════════════════ */
const starfield = $('#starfield');
for (let i = 0; i < 160; i++) {
  const s = document.createElement('span');
  s.className = 'star';
  s.style.left = `${Math.random() * 100}%`;
  s.style.top  = `${Math.random() * 100}%`;
  s.style.opacity = `${0.25 + Math.random() * 0.75}`;
  s.style.setProperty('--duration', `${2 + Math.random() * 5}s`);
  s.style.setProperty('--delay',    `${Math.random() * 5}s`);
  const size = Math.random() < 0.08 ? 3 : Math.random() < 0.25 ? 2 : 1;
  s.style.width  = `${size}px`;
  s.style.height = `${size}px`;
  starfield.appendChild(s);
}

/* ═══════════════════════════════
   3D EARTH (Three.js)
═══════════════════════════════ */
function initEarth() {
  const canvas = $('#earthCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.offsetWidth  || 360;
  const H = canvas.offsetHeight || 360;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.z = 2.5;

  // Sphere
  const geo  = new THREE.SphereGeometry(1, 64, 64);

  // Create Earth texture procedurally with canvas (fallback when no image)
  function buildEarthTexture() {
    const size = 1024;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    // Ocean base
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0,    '#0a1628');
    grad.addColorStop(0.5,  '#0f3460');
    grad.addColorStop(1,    '#0a1628');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Continents (simplified blobs)
    ctx.fillStyle = '#2d6a4f';
    const continents = [
      // Europe/Africa blob
      { x: 500, y: 300, rx: 60, ry: 120 },
      // Asia
      { x: 700, y: 250, rx: 130, ry: 100 },
      // Americas
      { x: 200, y: 280, rx: 70, ry: 160 },
      // Antarctica
      { x: 512, y: 940, rx: 200, ry: 60 },
      // Australia
      { x: 820, y: 550, rx: 55, ry: 45 },
    ];
    continents.forEach(({ x, y, rx, ry }) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ice caps
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.beginPath();
    ctx.ellipse(512, 30,  180, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(512, 994, 200, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cloud wisps
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let i = 0; i < 18; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60 + Math.random() * 80, 12 + Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(c);
  }

  function buildCloudsTexture() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < 20; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 40 + Math.random() * 60, 10 + Math.random() * 16, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  const earthTex  = buildEarthTexture();
  const cloudsTex = buildCloudsTexture();

  const mat = new THREE.MeshPhongMaterial({
    map:        earthTex,
    specular:   new THREE.Color(0x3399ff),
    shininess:  18,
  });
  const earth = new THREE.Mesh(geo, mat);
  scene.add(earth);

  // Cloud shell
  const cloudMat = new THREE.MeshPhongMaterial({ map: cloudsTex, transparent: true, opacity: 0.45, depthWrite: false });
  const clouds    = new THREE.Mesh(new THREE.SphereGeometry(1.015, 48, 48), cloudMat);
  scene.add(clouds);

  // Atmosphere glow
  const atmMat = new THREE.MeshPhongMaterial({
    color:      0x4488ff,
    transparent: true, opacity: 0.08, side: THREE.BackSide,
  });
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.12, 32, 32), atmMat);
  scene.add(atm);

  // Lights
  const sun = new THREE.DirectionalLight(0xffeedd, 1.2);
  sun.position.set(4, 2, 3);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x223366, 0.55));

  // Resize handling
  const resizeEarth = () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resizeEarth).observe(canvas);

  // Animate
  let earthAngle = 0;
  function animateEarth() {
    requestAnimationFrame(animateEarth);
    earthAngle += 0.0015;
    earth.rotation.y  = earthAngle;
    clouds.rotation.y = earthAngle * 0.88;
    renderer.render(scene, camera);
  }
  animateEarth();
}

// Three.js loads deferred, wait for it
if (typeof THREE !== 'undefined') {
  initEarth();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    // Poll briefly until Three.js is ready
    let tries = 0;
    const poll = setInterval(() => {
      if (typeof THREE !== 'undefined') { clearInterval(poll); initEarth(); }
      if (++tries > 40) clearInterval(poll);
    }, 150);
  });
}

/* ═══════════════════════════════
   OPENING → UNIVERSE TRANSITION
═══════════════════════════════ */
const enterButton = $('#enterUniverse');
const universe    = $('#universe');

enterButton.addEventListener('click', () => {
  universe.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ═══════════════════════════════
   SCROLL-REVEAL (Intersection Observer)
═══════════════════════════════ */
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Universe heading: staggered text fade-in
      if (el.classList.contains('universe-heading')) {
        el.classList.add('revealed');
        // Trigger memory shooting-star appear
        $$('.memory').forEach(m => m.classList.add('animate-in'));
        // Reveal earth copy text
        const earthCopy = $('.earth-copy');
        if (earthCopy) earthCopy.classList.add('revealed');
        // Show floating music bar after a pause
        setTimeout(() => {
          const bar = $('#floatingMusicBar');
          if (bar) bar.classList.add('visible');
        }, 1800);
        revealIO.unobserve(el);
      }

      // Cards fade-in
      if (el.classList.contains('revealed-target')) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        revealIO.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);

// Observe universe heading and earth stage
const uHead = $('.universe-heading');
if (uHead) revealIO.observe(uHead);
const eStage = $('.earth-stage');
if (eStage) {
  const stageIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.memory').forEach(m => m.classList.add('animate-in'));
        stageIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  stageIO.observe(eStage);
}

// Cards: translate-up reveal
$$('.letter-card, .song-card, .video-card, .friend-message').forEach((el) => {
  el.classList.add('revealed-target');
  el.style.transition = 'opacity 700ms ease, transform 700ms ease';
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  revealIO.observe(el);
});

/* ═══════════════════════════════
   SHOOTING STAR CLICK BURST
   (fires a mini trail when a memory is clicked)
═══════════════════════════════ */
function shootBurst(originEl) {
  const rect   = originEl.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const count  = 6;

  for (let i = 0; i < count; i++) {
    const dot    = document.createElement('span');
    const angle  = (i / count) * Math.PI * 2;
    const dist   = 40 + Math.random() * 40;
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist;
    const dur    = 0.5 + Math.random() * 0.4;

    dot.style.cssText = `
      position: fixed;
      left: ${cx}px; top: ${cy}px;
      width: 4px; height: 4px; border-radius: 50%;
      background: #ffc4e3;
      box-shadow: 0 0 6px 2px rgba(255,196,227,0.7);
      pointer-events: none; z-index: 999;
      transform: translate(-50%,-50%);
      transition: transform ${dur}s ease-out, opacity ${dur}s ease-out;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.2)`;
        dot.style.opacity   = '0';
      });
    });
    setTimeout(() => dot.remove(), dur * 1000 + 50);
  }
}

/* ═══════════════════════════════
   MEMORY IMAGE FALLBACK + LIGHTBOX
═══════════════════════════════ */
$$('.memory').forEach((memory) => {
  const img = $('img', memory);

  const markMissing = () => memory.classList.add('is-missing');
  img.addEventListener('error', markMissing);
  if (img.complete && img.naturalWidth === 0) markMissing();

  memory.addEventListener('click', () => {
    shootBurst(memory); // ✦ shoot burst

    const modal        = $('#memoryModal');
    const modalContent = $('.modal-content');
    const modalImage   = $('#modalImage');
    const modalCaption = $('#modalCaption');

    modalImage.src        = memory.dataset.image || '';
    modalImage.alt        = img.alt || 'Our memory';
    modalCaption.textContent = memory.dataset.caption || '';
    modalContent.classList.remove('missing');

    modalImage.onload  = () => modalContent.classList.remove('missing');
    modalImage.onerror = () => modalContent.classList.add('missing');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});

/* ═══════════════════════════════
   MODAL CLOSE
═══════════════════════════════ */
const modal = $('#memoryModal');
const closeModal = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};
$('#closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ═══════════════════════════════
   LOCAL MUSIC + FLOATING BAR
═══════════════════════════════ */
const localSong        = $('#localSong');
const localMusicButton = $('#localMusicButton');
const floatingPlayBtn  = $('#floatingPlayBtn');
const vinylDisc        = $('#vinylDisc');
const eqBars           = $('#eqBars');
const ambientGlow      = $('#musicAmbientGlow');

function setPlayingState(playing) {
  if (playing) {
    if (localMusicButton) localMusicButton.textContent = 'Pause ❚❚';
    if (floatingPlayBtn) {
      floatingPlayBtn.textContent = '❚❚';
      floatingPlayBtn.setAttribute('aria-label', 'Pause music');
    }
    if (vinylDisc)   vinylDisc.classList.add('playing');
    if (eqBars)      eqBars.classList.add('playing');
    if (ambientGlow) ambientGlow.classList.add('active');
  } else {
    if (localMusicButton) localMusicButton.textContent = 'Play ♫';
    if (floatingPlayBtn) {
      floatingPlayBtn.textContent = '▶';
      floatingPlayBtn.setAttribute('aria-label', 'Play music');
    }
    if (vinylDisc)   vinylDisc.classList.remove('playing');
    if (eqBars)      eqBars.classList.remove('playing');
    if (ambientGlow) ambientGlow.classList.remove('active');
  }
}

async function toggleMusic() {
  if (!localSong) return;
  try {
    if (localSong.paused) {
      await localSong.play();
      setPlayingState(true);
    } else {
      localSong.pause();
      setPlayingState(false);
    }
  } catch (err) {
    console.log('Audio playback error:', err);
  }
}

if (localMusicButton) localMusicButton.addEventListener('click', toggleMusic);
if (floatingPlayBtn)  floatingPlayBtn.addEventListener('click', toggleMusic);

if (localSong) {
  localSong.addEventListener('ended', () => setPlayingState(false));
  localSong.addEventListener('play', () => setPlayingState(true));
  localSong.addEventListener('pause', () => setPlayingState(false));
}

// Autoplay handler: starts audio on page launch or first user touch/click
function tryPlayAudio() {
  if (localSong && localSong.paused) {
    localSong.play().then(() => {
      setPlayingState(true);
    }).catch(() => {
      // If browser blocked unmuted autoplay, play on first user interaction
      const enableOnInteraction = () => {
        if (localSong.paused) {
          localSong.play().then(() => setPlayingState(true)).catch(() => {});
        }
        document.removeEventListener('click', enableOnInteraction);
        document.removeEventListener('touchstart', enableOnInteraction);
        document.removeEventListener('keydown', enableOnInteraction);
      };
      document.addEventListener('click', enableOnInteraction, { once: true });
      document.addEventListener('touchstart', enableOnInteraction, { once: true });
      document.addEventListener('keydown', enableOnInteraction, { once: true });
    });
  }
}

if (enterButton) {
  enterButton.addEventListener('click', tryPlayAudio);
}

// Video element placeholder state handling
$$('.video-frame').forEach((frame) => {
  const video = $('video', frame);
  if (!video) return;

  const showVideo = () => frame.classList.add('has-video');
  const hideVideo = () => frame.classList.remove('has-video');

  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('play', showVideo);
  video.addEventListener('error', hideVideo);

  if (video.readyState >= 2) showVideo();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryPlayAudio);
} else {
  tryPlayAudio();
}
