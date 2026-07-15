/* ============================================================
   app.js — Humaira Birthday Website Engine
   Scroll-reveal animations, particle canvas, floating balloons,
   memory wall builder, collage grid, and ambient music.
   ============================================================ */
(function () {
  'use strict';

  // ─── PHOTO MANIFEST ───
  const PHOTOS = {
    slots: ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg'],
    favourite: '6.jpeg',
    extras: [
      '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg',
      '11.jpeg', '12.jpeg'
    ]
  };
  const ALL_PHOTOS = [PHOTOS.favourite, ...PHOTOS.slots, ...PHOTOS.extras];

  // ─── DOM SHORTCUTS ───
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // ─── CANVAS PARTICLE SYSTEM ───
  const canvas = $('#particle-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let particles = [];

  class Particle {
    constructor(o) {
      this.x = o.x ?? Math.random() * canvas.width;
      this.y = o.y ?? canvas.height + 10;
      this.vx = o.vx ?? (Math.random() - 0.5) * 0.4;
      this.vy = o.vy ?? -(Math.random() * 1 + 0.2);
      this.size = o.size ?? Math.random() * 2.5 + 1;
      this.life = 1;
      this.decay = o.decay ?? 0.001 + Math.random() * 0.002;
      this.color = o.color ?? '#e74c5e';
      this.type = o.type ?? 'circle';
      this.rot = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.04;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rotV;
      this.life -= this.decay;
      return this.life > 0;
    }

    draw(c) {
      c.save();
      c.globalAlpha = Math.max(0, this.life);
      c.translate(this.x, this.y);
      c.rotate(this.rot);
      c.fillStyle = this.color;

      if (this.type === 'circle') {
        c.beginPath();
        c.arc(0, 0, this.size, 0, Math.PI * 2);
        c.fill();
      } else if (this.type === 'heart') {
        const s = this.size;
        c.beginPath();
        c.moveTo(0, s * 0.3);
        c.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.4);
        c.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, 0, s * 0.3);
        c.fill();
      } else if (this.type === 'star') {
        c.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          c[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * this.size, Math.sin(a) * this.size);
        }
        c.closePath();
        c.fill();
      } else if (this.type === 'petal') {
        c.beginPath();
        c.ellipse(0, 0, this.size, this.size * 0.4, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }
  }

  const COLORS_WARM = ['#e74c5e', '#f8a5c2', '#c0392b', '#fdd0e0', '#fff', '#f5c542', '#ffe7a0'];

  function spawnAmbient() {
    if (Math.random() < 0.12) {
      particles.push(new Particle({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0, vy: 0,
        size: Math.random() * 1.5 + 0.5,
        color: COLORS_WARM[Math.floor(Math.random() * COLORS_WARM.length)],
        type: 'star',
        decay: 0.0005 + Math.random() * 0.001,
      }));
    }
    if (Math.random() < 0.04) {
      particles.push(new Particle({
        size: Math.random() * 5 + 2,
        color: COLORS_WARM[Math.floor(Math.random() * 4)],
        type: 'heart',
        decay: 0.0008,
      }));
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnAmbient();
    particles = particles.filter(p => {
      const alive = p.update();
      if (alive) p.draw(ctx);
      return alive;
    });
  }
  animateParticles();

  // ─── HERO BALLOONS ───
  function createHeroBalloon() {
    const field = $('#balloon-field');
    if (!field) return;

    const balloon = document.createElement('div');
    balloon.className = 'hero-balloon';
    const colors = ['red', 'pink', 'white', 'gold'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 90 + 5;
    const dur = Math.random() * 10 + 10;
    const size = 0.7 + Math.random() * 0.6;

    balloon.style.left = left + '%';
    balloon.style.animationDuration = dur + 's';
    balloon.style.transform = `scale(${size})`;
    balloon.innerHTML = `
      <div class="hb-body ${color}"><div class="hb-shine"></div></div>
      <div class="hb-ribbon"></div>
    `;
    field.appendChild(balloon);
    setTimeout(() => balloon.remove(), dur * 1000);
  }

  // Spawn balloons continuously
  setInterval(createHeroBalloon, 1200);
  for (let i = 0; i < 8; i++) setTimeout(createHeroBalloon, i * 300);

  // ─── SCROLL REVEAL ───
  const revealElements = $$('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    const winH = window.innerHeight;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < winH * 0.85) {
        el.classList.add('visible');
      }
    });

    // Heart SVG drawing
    const heartSvg = $('.svg-heart-outline');
    if (heartSvg) {
      const hRect = heartSvg.getBoundingClientRect();
      if (hRect.top < winH * 0.75) {
        heartSvg.classList.add('drawn');
      }
    }

    // Outro balloon
    const outroSection = $('#outro');
    if (outroSection) {
      const oRect = outroSection.getBoundingClientRect();
      if (oRect.top < winH * 0.5) {
        $('#outro-balloon')?.classList.add('fly');
      }
    }
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // initial check

  // ─── MEMORY CARD TILT INTERACTION ───
  $$('.mem-card[data-tilt]').forEach(card => {
    const inner = card.querySelector('.mem-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });

  // ─── BUILD MEMORY WALL BALLOONS ───
  function buildMemoryWall() {
    const strip = $('#memory-strip');
    if (!strip) return;

    const balloonColors = ['t-red', 't-pink', 't-white', 't-gold', 't-red', 't-pink'];
    const photos = ALL_PHOTOS.slice(0, 6);

    photos.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'mem-balloon reveal';
      div.innerHTML = `
        <div class="mb-top ${balloonColors[i]}"></div>
        <div class="mb-ribbon"></div>
        <div class="mb-photo"><img src="${src}" alt="Memory ${i + 1}"></div>
      `;
      strip.appendChild(div);
    });
  }
  buildMemoryWall();

  // ─── BUILD COLLAGE GRID ───
  function buildCollage() {
    const grid = $('#collage-grid');
    if (!grid) return;

    const photos = ALL_PHOTOS.slice(0, 10);
    // Define unique rotation angles and slight offsets to make it look scattered
    const rotations = [-6, 4, -3, 5, -5, 3, -4, 6, -2, 4];
    const offsetsY = [-5, 8, -6, 4, -8, 5, -4, 6, -3, 5];

    photos.forEach((src, i) => {
      const card = document.createElement('div');
      card.className = `collage-polaroid cp-${i}`;
      card.style.setProperty('--r', `${rotations[i % rotations.length]}deg`);
      card.style.setProperty('--y', `${offsetsY[i % offsetsY.length]}px`);
      card.innerHTML = `
        <div class="cp-tape"></div>
        <div class="cp-frame">
          <img src="${src}" alt="Collage Photo ${i + 1}">
          <div class="cp-shine"></div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  buildCollage();

  // ─── AMBIENT MUSIC (Web Audio Synth) ───
  let audioCtx = null;
  let musicPlaying = false;
  let chordIdx = 0;
  let musicInterval = null;

  const CHORDS = [
    [261.63, 329.63, 392.00],
    [293.66, 369.99, 440.00],
    [246.94, 311.13, 369.99],
    [220.00, 277.18, 329.63],
    [196.00, 246.94, 293.66],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66],
    [261.63, 329.63, 392.00],
  ];

  function playChord() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
    gain.connect(audioCtx.destination);

    CHORDS[chordIdx % CHORDS.length].forEach(freq => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 4);
    });
    chordIdx++;
  }

  const musicBtn = $('#music-toggle');
  musicBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (musicPlaying) {
      clearInterval(musicInterval);
      musicInterval = null;
      musicPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.classList.add('muted');
    } else {
      playChord();
      musicInterval = setInterval(playChord, 3500);
      musicPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.classList.remove('muted');
    }
  });

  // ─── BIRTHDAY COUNTDOWN TIMER ───
  function startCountdown() {
    const daysEl = document.getElementById('ct-days');
    const hoursEl = document.getElementById('ct-hours');
    const minsEl = document.getElementById('ct-mins');
    const secsEl = document.getElementById('ct-secs');
    const msgEl = document.getElementById('ct-message');
    if (!daysEl) return;

    function getNextBirthday() {
      const now = new Date();
      let year = now.getFullYear();
      let bday = new Date(year, 6, 17, 0, 0, 0); // July 17 (month is 0-indexed)
      // If birthday already passed this year, use next year
      if (now > new Date(year, 6, 17, 23, 59, 59)) {
        bday = new Date(year + 1, 6, 17, 0, 0, 0);
      }
      return bday;
    }

    function tick() {
      const now = new Date();
      const target = getNextBirthday();
      const diff = target - now;

      // Check if today IS the birthday
      const isToday = now.getMonth() === 6 && now.getDate() === 17;

      if (isToday) {
        daysEl.textContent = '🎂';
        hoursEl.textContent = '🎉';
        minsEl.textContent = '🥳';
        secsEl.textContent = '❤️';
        msgEl.textContent = '🎈 IT\'S HUMAIRA\'S BIRTHDAY TODAY! 🎈';
        return;
      }

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        msgEl.textContent = 'Happy Birthday, Bangaram! 🎂❤️';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');

      if (days <= 3) {
        msgEl.textContent = `Only ${days} day${days !== 1 ? 's' : ''} left! Almost here! 🥹❤️`;
      } else if (days <= 7) {
        msgEl.textContent = `${days} days to Bangaram's special day! 🎈`;
      } else {
        msgEl.textContent = `Counting down to 17 July... ❤️`;
      }
    }

    tick();
    setInterval(tick, 1000);
  }
  startCountdown();

  // ─── CONFETTI BURST ON BIRTHDAY SECTION ───
  let bdayBursted = false;
  function checkBdayBurst() {
    if (bdayBursted) return;
    const bday = $('#birthday');
    if (!bday) return;
    const rect = bday.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5) {
      bdayBursted = true;
      triggerBdayConfetti();
    }
  }
  function triggerBdayConfetti(count) {
    count = count || 80;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height * 0.3,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 6 + 2,
        color: COLORS_WARM[Math.floor(Math.random() * COLORS_WARM.length)],
        type: Math.random() > 0.5 ? 'heart' : 'petal',
        decay: 0.004,
      }));
    }
  }
  window.addEventListener('scroll', checkBdayBurst, { passive: true });

  // ─── BLOW THE CANDLES MINI-GAME ───
  (function initCandleGame() {
    const TOTAL_CANDLES = 3;
    let extinguished = 0;
    let micStream = null;
    let audioCtxGame = null;
    let analyser = null;
    let micActive = false;
    let blowLoopId = null;
    let candleHistory = [0, 0, 0]; // track blow intensity per candle

    const flames = [
      document.getElementById('flame-1'),
      document.getElementById('flame-2'),
      document.getElementById('flame-3'),
    ];
    const smokes = [
      document.getElementById('smoke-1'),
      document.getElementById('smoke-2'),
      document.getElementById('smoke-3'),
    ];
    const instruction = document.getElementById('blow-instruction');
    const meter = document.getElementById('blow-meter');
    const meterFill = document.getElementById('blow-meter-fill');
    const celebration = document.getElementById('bday-celebration');

    if (!flames[0]) return; // game elements not found

    const candleData = flames.map((flame, i) => ({
      element: flame,
      smoke: smokes[i],
      lit: true,
      intensity: 0,
    }));

    // Flavor Selector
    const flavorBtns = $$('.flavor-btn');
    const cakeStructure = $('.cake-structure');
    flavorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const flavor = btn.getAttribute('data-flavor');
        flavorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Remove old flavor classes and apply selected one
        cakeStructure.className = 'cake-structure ' + flavor;
        
        // Trigger small flavor change particle pop
        const rect = cakeStructure.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colorPalette = flavor === 'strawberry' ? ['#ff7b96', '#ffccdd', '#fff'] :
                             flavor === 'caramel' ? ['#ffe7a0', '#ffe17d', '#d8a010'] :
                                                    ['#795548', '#8d6e63', '#fff'];
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.5;
          particles.push(new Particle({
            x: cx, y: cy - 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            type: Math.random() > 0.5 ? 'petal' : 'circle',
            decay: 0.008
          }));
        }
      });
    });

    // Wish box lock
    const lockWishBtn = document.getElementById('lock-wish-btn');
    const wishInput = document.getElementById('wish-input');
    const wishBox = document.getElementById('cake-wish-box');
    let lockedWishText = "";
    
    if (lockWishBtn && wishInput && wishBox) {
      lockWishBtn.addEventListener('click', () => {
        const val = wishInput.value.trim();
        if (val) {
          lockedWishText = val;
          wishBox.classList.add('locked');
          lockWishBtn.textContent = 'Wish Locked! ✨';
          
          // Little glitter burst
          const rect = lockWishBtn.getBoundingClientRect();
          for (let i = 0; i < 8; i++) {
            particles.push(new Particle({
              x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
              y: rect.top + rect.height / 2,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -(Math.random() * 1 + 0.5),
              size: Math.random() * 3 + 1,
              color: '#f5c542',
              type: 'star',
              decay: 0.006
            }));
          }
        } else {
          wishInput.placeholder = "Please write a wish first! 🥺";
          setTimeout(() => {
            wishInput.placeholder = "Type a wish for your birthday...";
          }, 2000);
        }
      });
    }

    // Float wish text
    function floatWishMessage(wish) {
      const parent = $('#cake-game');
      if (!parent) return;
      const el = document.createElement('div');
      el.className = 'floating-wish-text';
      el.textContent = `✨ ${wish} ✨`;
      el.style.position = 'absolute';
      el.style.bottom = '120px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.color = '#ffe7a0';
      el.style.fontFamily = 'var(--font-script)';
      el.style.fontSize = '1.3rem';
      el.style.textShadow = '0 0 10px rgba(245,197,66,0.6)';
      el.style.pointerEvents = 'none';
      el.style.opacity = '1';
      el.style.transition = 'all 3.5s cubic-bezier(0.1, 0.8, 0.3, 1)';
      el.style.zIndex = '100';
      parent.appendChild(el);
      
      // Force layout reflow
      void el.offsetHeight;
      
      // Animate up and fade out
      el.style.transform = 'translateX(-50%) translateY(-120px) scale(1.1)';
      el.style.opacity = '0';
      
      // Clean up after animation
      setTimeout(() => el.remove(), 3600);
    }

    // ─── Extinguish a single candle ───
    function extinguishCandle(index) {
      if (!candleData[index] || !candleData[index].lit) return;
      const c = candleData[index];
      c.lit = false;
      c.element.classList.remove('blowing');
      c.element.classList.add('extinguished');

      // Trigger smoke puff
      if (c.smoke) {
        c.smoke.classList.remove('active');
        void c.smoke.offsetWidth; // reflow
        c.smoke.classList.add('active');
      }

      // After extinguish animation completes, set to 'out'
      setTimeout(() => {
        c.element.classList.remove('extinguished');
        c.element.classList.add('out');
      }, 450);

      extinguished++;

      // Spawn a little sparkle puff
      const rect = c.element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.2;
        particles.push(new Particle({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 4 + 1.5,
          color: ['#f8a5c2', '#ffe7a0', '#fff', '#f5c542'][Math.floor(Math.random() * 4)],
          type: Math.random() > 0.5 ? 'star' : 'circle',
          decay: 0.006,
        }));
      }

      // Check if all candles are out
      if (extinguished >= TOTAL_CANDLES) {
        setTimeout(allCandlesOut, 600);
      }
    }

    // ─── All candles blown out! ───
    function allCandlesOut() {
      // Stop mic
      stopMic();

      // Show celebration
      if (celebration) {
        const celebText = celebration.querySelector('.celeb-text');
        const celebSub = celebration.querySelector('.celeb-sub');
        if (lockedWishText) {
          celebText.textContent = `Happy Birthday, Humaira! 🥹❤️`;
          celebSub.innerHTML = `Your wish: <strong>"${lockedWishText}"</strong> has been locked & released into the stars... ✨`;
          floatWishMessage(lockedWishText);
        } else {
          celebText.textContent = `Happy Birthday, Humaira! 🥹❤️`;
          celebSub.textContent = `Make a wish... and may it all come true 🕯️🫶🏻`;
        }

        celebration.classList.add('show');
        // Click to dismiss
        celebration.addEventListener('click', () => {
          celebration.classList.remove('show');
        }, { once: true });
        // Auto-hide after 8 seconds
        setTimeout(() => {
          celebration.classList.remove('show');
        }, 8000);
      }

      // Update instruction
      if (instruction) {
        instruction.classList.add('all-blown');
        instruction.querySelector('.blow-text').textContent = 'All candles blown! 🎉';
        instruction.querySelector('.blow-hint').textContent = 'Your wish has been made, Bangaram! 🕯️🫶🏻';
        instruction.querySelector('.blow-icon').textContent = '✨';
      }

      // Big confetti burst
      triggerBdayConfetti(120);

      // Spawn floating hearts
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          particles.push(new Particle({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 2 + 1),
            size: Math.random() * 5 + 3,
            color: ['#e74c5e', '#f8a5c2', '#f5c542', '#ff6b9d'][Math.floor(Math.random() * 4)],
            type: 'heart',
            decay: 0.0015,
          }));
        }, i * 100);
      }
    }

    // ─── Click/tap to blow a candle ───
    function onCandleClick(index) {
      if (!candleData[index] || !candleData[index].lit) return;
      extinguishCandle(index);
    }

    // Attach click handlers
    document.querySelectorAll('.candle').forEach((el, i) => {
      el.addEventListener('click', () => onCandleClick(i));
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onCandleClick(i);
      }, { passive: false });
    });

    // ─── Click instruction to activate mic ───
    if (instruction) {
      instruction.addEventListener('click', toggleMic);
      instruction.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleMic();
      }, { passive: false });
    }

    // ─── Microphone Setup ───
    function toggleMic() {
      if (micActive) {
        stopMic();
      } else {
        startMic();
      }
    }

    async function startMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream = stream;

        audioCtxGame = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtxGame.createMediaStreamSource(stream);
        analyser = audioCtxGame.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        micActive = true;
        if (instruction) {
          instruction.classList.add('listening');
          instruction.querySelector('.blow-icon').textContent = '🎤';
          instruction.querySelector('.blow-hint').textContent = 'Blow into your mic! 💨';
        }
        if (meter) meter.classList.add('active');

        // Start blow detection loop
        blowLoopId = requestAnimationFrame(blowLoop);

        // Auto-stop mic after 15 seconds
        setTimeout(() => {
          if (micActive && extinguished < TOTAL_CANDLES) {
            stopMic();
            if (instruction) {
              instruction.querySelector('.blow-hint').textContent = 'Tap candles to blow them out or click to use mic again 🎤';
            }
          }
        }, 15000);

      } catch (err) {
        console.log('Mic access denied or unavailable. Use tap instead!');
        if (instruction) {
          instruction.querySelector('.blow-hint').textContent = 'Tap the candles to blow them out! 🕯️';
        }
      }
    }

    function stopMic() {
      if (blowLoopId) {
        cancelAnimationFrame(blowLoopId);
        blowLoopId = null;
      }
      if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
      }
      if (audioCtxGame) {
        audioCtxGame.close();
        audioCtxGame = null;
      }
      analyser = null;
      micActive = false;
      if (meter) meter.classList.remove('active');
      if (meterFill) meterFill.style.width = '0%';
      if (instruction) {
        instruction.classList.remove('listening');
        instruction.querySelector('.blow-icon').textContent = '🕯️';
      }
    }

    // ─── Blow Detection Loop ───
    function blowLoop() {
      if (!micActive || !analyser) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(dataArray);

      // Calculate volume level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = dataArray[i] - 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const blowLevel = Math.min(1, Math.max(0, (rms - 15) / 50));

      if (meterFill) {
        meterFill.style.width = (blowLevel * 100) + '%';
      }

      if (blowLevel > 0.25) {
        const litCandles = candleData.filter(c => c.lit);
        if (litCandles.length > 0) {
          const target = litCandles.reduce((a, b) => a.intensity > b.intensity ? a : b);
          const idx = candleData.indexOf(target);
          target.intensity += blowLevel * 2;
          target.element.classList.add('blowing');

          if (target.intensity >= 8) {
            target.element.classList.remove('blowing');
            extinguishCandle(idx);
          }
        }
      } else {
        candleData.forEach(c => {
          if (c.lit) c.element.classList.remove('blowing');
        });
      }

      blowLoopId = requestAnimationFrame(blowLoop);
    }
  })();

  // ─── INTERACTIVE LOVE LETTER & WAX SEAL ───
  function initLoveLetter() {
    const scene = document.getElementById('envelope-scene');
    const wrapper = $('.envelope-wrapper');
    const seal = document.getElementById('env-wax-seal');
    const overlayDim = document.getElementById('letter-overlay-dim');
    const letterCard = document.getElementById('letter-card');
    
    if (!scene || !seal || !letterCard) return;

    let isEnvelopeOpen = false;

    // Parallax Tilt Effect on Closed Envelope
    function handleTilt(e) {
      if (isEnvelopeOpen) return;
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      wrapper.style.transform = `rotateX(${y * -15}deg) rotateY(${x * 15}deg)`;
      wrapper.style.transition = 'transform 0.1s ease';
    }
    
    function resetTilt() {
      if (isEnvelopeOpen) return;
      wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
      wrapper.style.transition = 'transform 0.5s ease';
    }
    
    wrapper.addEventListener('mousemove', handleTilt);
    wrapper.addEventListener('mouseleave', resetTilt);

    // Wax Seal Click -> Crack open
    seal.addEventListener('click', () => {
      if (isEnvelopeOpen) return;
      isEnvelopeOpen = true;
      
      // Break seal
      seal.classList.add('broken');
      wrapper.style.transform = 'rotateX(0) rotateY(0)';
      wrapper.style.transition = 'transform 0.6s ease';
      
      // Spawn wax seal breaking particles
      const rect = seal.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push(new Particle({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 4 + 1.5,
          color: ['#e91e63', '#c2185b', '#ff80ab'][Math.floor(Math.random() * 3)],
          type: Math.random() > 0.4 ? 'heart' : 'circle',
          decay: 0.005
        }));
      }

      // Step 2: Open Flap (wait 600ms)
      setTimeout(() => {
        scene.classList.add('state-open');
        
        // Step 3: Slide Out Letter Card
        setTimeout(() => {
          scene.classList.add('state-slide-out');
          overlayDim.classList.add('active');
          
          // Little sparklies rise
          const cardRect = letterCard.getBoundingClientRect();
          const cardX = cardRect.left + cardRect.width / 2;
          const cardY = cardRect.top + cardRect.height * 0.25;
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            particles.push(new Particle({
              x: cardX + (Math.random() - 0.5) * 80,
              y: cardY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 0.5,
              size: Math.random() * 3 + 1,
              color: ['#f8a5c2', '#ffe7a0', '#fff'][Math.floor(Math.random() * 3)],
              type: 'star',
              decay: 0.004
            }));
          }
        }, 1000);
      }, 600);
    });

    // Page turn navigation
    const pages = letterCard.querySelectorAll('.card-page-content');
    
    function setPage(pageNum) {
      letterCard.setAttribute('data-page', pageNum);
      pages.forEach(p => {
        p.classList.remove('active');
        if (p.classList.contains(`page-${pageNum}`)) {
          p.classList.add('active');
        }
      });
      
      // Stagger write-in text on page transition (if it has .card-ltr)
      const activePageEl = letterCard.querySelector(`.card-page-content.page-${pageNum}`);
      const ltrs = activePageEl.querySelectorAll('.card-ltr');
      ltrs.forEach((l, i) => {
        l.style.opacity = '0';
        l.style.transform = 'translateY(10px)';
        l.style.transition = 'none';
        void l.offsetHeight; // force layout
        setTimeout(() => {
          l.style.opacity = '1';
          l.style.transform = 'translateY(0)';
          l.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, i * 150); // fast staggered write-in
      });
    }

    // Bind next buttons
    letterCard.querySelectorAll('.card-btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = parseInt(letterCard.getAttribute('data-page') || '1');
        if (cur < 3) {
          setPage(cur + 1);
        }
      });
    });

    // Bind back buttons
    letterCard.querySelectorAll('.card-btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = parseInt(letterCard.getAttribute('data-page') || '1');
        if (cur > 1) {
          setPage(cur - 1);
        }
      });
    });

    // Bind close/reseal button
    const closeBtn = letterCard.querySelector('.card-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLetter);
    }
    
    // Clicking the dim overlay also closes the letter
    overlayDim.addEventListener('click', closeLetter);

    function closeLetter() {
      if (!isEnvelopeOpen) return;
      
      // Step 1: Slide card back in
      scene.classList.remove('state-slide-out');
      overlayDim.classList.remove('active');
      
      // Reset booklet back to cover page after slide-in starts
      setTimeout(() => {
        setPage(1);
      }, 500);

      // Step 2: Close flap
      setTimeout(() => {
        scene.classList.remove('state-open');
        
        // Step 3: Reseal envelope
        setTimeout(() => {
          seal.classList.remove('broken');
          isEnvelopeOpen = false;
        }, 800);
      }, 800);
    }

    // Touch support for flip polaroid (mobile devices without hover)
    const polaroidFrame = document.getElementById('polaroid-frame');
    if (polaroidFrame) {
      polaroidFrame.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent closing letter
        polaroidFrame.classList.toggle('manual-flipped');
        const inner = polaroidFrame.querySelector('.polaroid-inner');
        if (polaroidFrame.classList.contains('manual-flipped')) {
          inner.style.transform = 'rotateY(180deg)';
        } else {
          inner.style.transform = 'rotateY(0deg)';
        }
      });
    }
  }
  
  initLoveLetter();

  function checkLetterSection() {
    const letterSection = $('#letter');
    if (!letterSection) return;
    
    const rect = letterSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
    
    if (inView) {
      letterSection.classList.add('letter-ready');
    } else {
      letterSection.classList.remove('letter-ready');
    }
  }
  window.addEventListener('scroll', checkLetterSection, { passive: true });
  setTimeout(checkLetterSection, 200);

  // ─── INTERACTIVE JAR OF SWEET NOTES ───
  function initMessageJar() {
    const jar = document.getElementById('glass-jar');
    const popup = document.getElementById('jar-note-popup');
    const popupText = document.getElementById('popup-text');
    const closeBtn = document.getElementById('popup-close-btn');
    if (!jar || !popup || !popupText || !closeBtn) return;

    // Load the WhatsApp voice note record
    const voiceAudio = new Audio("WhatsApp Audio 2026-07-15 at 9.34.21 PM.mp4");

    const messages = [
      "You are the most precious person in my life, my true Bangaram. 💎❤️",
      "Thank you for always listening to my silly rants and never judging me. 🥹🫂",
      "Your smile has the power to make my worst days instantly bright! ☀️🫶🏻",
      "I'm so incredibly lucky to call you my best friend. Forever & always! ♾️❤️",
      "No matter how much we irritate each other, you will always be my safe place. 🫂🩹",
      "To the world, you may be one person, but to me, you are my entire world. 🥹🌎",
      "Thank you for being the Bujji to my life, always making me happy. 🥰",
      "I cherish every single fight and laugh we've shared. They brought us here. ❤️🩹",
      "My favorite place in the world is next to you, my forever favorite human. ♾️🫶🏻",
      "May this birthday bring you infinite happiness, because you deserve it all. 🎂💖",
      "I promise to always irritate you, but never leave you, my Bujji. ♾️❤️🩹"
    ];

    let lastIdx = -1;

    jar.addEventListener('click', () => {
      // 1. Trigger shake animation on jar
      jar.classList.remove('shake');
      void jar.offsetWidth; // force reflow
      jar.classList.add('shake');

      // 2. Play the uploaded voice note!
      voiceAudio.currentTime = 0; // Restart from the beginning on each click
      voiceAudio.play().catch(err => {
        console.log("Audio autoplay was blocked by browser or file failed to play: ", err);
      });

      // 3. Select next non-repeating message
      let idx;
      do {
        idx = Math.floor(Math.random() * messages.length);
      } while (idx === lastIdx && messages.length > 1);
      lastIdx = idx;

      // 4. Spawn glitter burst on canvas at jar location
      const rect = jar.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push(new Particle({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 4 + 1.5,
          color: ['#f8a5c2', '#ffe7a0', '#fff', '#f5c542'][Math.floor(Math.random() * 4)],
          type: Math.random() > 0.6 ? 'star' : 'heart',
          decay: 0.005
        }));
      }

      // 5. Populate and activate popup
      setTimeout(() => {
        popupText.textContent = messages[idx];
        popup.classList.add('active');
      }, 300);
    });

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
      // Pause the voice note when they put the card back
      voiceAudio.pause();
    });
  }
  initMessageJar();

  // ─── INTERACTIVE ALBUM SLIDER ───
  function initAlbumSlider() {
    const cards = $$('.film-card');
    const storyTitle = document.getElementById('story-title');
    const storyDesc = document.getElementById('story-desc');
    const storyBox = document.getElementById('playlist-story');
    if (!cards.length || !storyTitle || !storyDesc || !storyBox) return;

    const trackStories = [
      {
        title: "The Unexpected Hello",
        desc: "We started as strangers, not knowing how close we would get. That first text message was the start of the most beautiful friendship in my life. 🥹❤️"
      },
      {
        title: "Midnight Banter & Fights",
        desc: "Our late-night calls, silly arguments, and drama. No matter how much we irritated each other or fought, we always found our way back to each other. ❤️🩹"
      },
      {
        title: "My Safe Harbor",
        desc: "Whenever the world gets too chaotic and heavy, just one word from you makes all the noise in my mind quiet down. You became my ultimate safe space, the only human I can share my deepest fears and secrets with, knowing you will always hold my hand. Thank you for being my peace, Bujji. 🩹🫂❤️"
      },
      {
        title: "The Forever Promise",
        desc: "To the one who knows all my secrets and still stays: you are my forever best friend. No distance or time can ever change our bond. ♾️❤️"
      }
    ];

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-track'), 10);
        if (isNaN(index)) return;

        // Toggle active states
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Smooth text transition in notebook page
        storyBox.style.opacity = 0;
        storyBox.style.transform = 'translateY(8px)';

        setTimeout(() => {
          storyTitle.textContent = trackStories[index].title;
          storyDesc.textContent = trackStories[index].desc;
          storyBox.style.opacity = 1;
          storyBox.style.transform = 'translateY(0)';
        }, 250);

        // Spawn pink and gold heart/star sparkles around the clicked card
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 8; i++) {
          particles.push(new Particle({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 1.5,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '#f8a5c2' : '#f5c542',
            type: Math.random() > 0.5 ? 'heart' : 'star',
            decay: 0.01
          }));
        }
      });
    });
  }
  initAlbumSlider();

})();
