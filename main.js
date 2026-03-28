/* ===================================================
   ULTRAWEAK PHOTON EMISSIONS — Interactive Narrative
   =================================================== */

// ===== PHOTON PARTICLE CANVAS (Hero) =====
(function initPhotonCanvas() {
  const canvas = document.getElementById('photon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Photon {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      // Color: mix of green (healthy) and red (malignant)
      this.hue = Math.random() > 0.6 ? 0 : 160;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
    }
    draw() {
      const a = this.alpha * (0.5 + 0.5 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const color = this.hue === 0
        ? `rgba(248,113,113,${a})`
        : `rgba(110,231,183,${a})`;
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Photon());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// ===== NAV DOTS =====
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`.dot[data-section="${e.target.id}"]`);
      if (dot) dot.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));


// ===== BAR CHART: Cell Line Photon Emissions =====
(function buildCellChart() {
  const container = document.getElementById('cell-chart');
  if (!container) return;

  const data = [
    { name: 'Hs 578T', value: 79, type: 'healthy' },
    { name: 'HEK 293', value: 81, type: 'healthy' },
    { name: 'HBL 100', value: 80, type: 'healthy' },
    { name: 'MCF-7', value: 139, type: 'malignant' },
    { name: 'MDA MB 231', value: 76, type: 'malignant' },
    { name: 'B16 BL6', value: 229, type: 'malignant' },
    { name: 'HPAF-11', value: 62, type: 'malignant' },
    { name: 'AsPC-1', value: 111, type: 'malignant' },
    { name: 'Capan-1', value: 116, type: 'malignant' },
    { name: 'BxPC3', value: 128, type: 'malignant' },
    { name: 'CFPAC-1', value: 120, type: 'malignant' },
  ];

  const maxVal = Math.max(...data.map(d => d.value));

  data.forEach(d => {
    const group = document.createElement('div');
    group.className = 'bar-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';

    const bar = document.createElement('div');
    bar.className = `bar ${d.type}`;
    bar.style.height = '0px';
    bar.dataset.height = `${(d.value / maxVal) * 100}%`;

    const val = document.createElement('span');
    val.className = 'bar-val';
    val.textContent = d.value;
    bar.appendChild(val);

    wrapper.appendChild(bar);

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = d.name;

    group.appendChild(wrapper);
    group.appendChild(label);
    container.appendChild(group);
  });

  // Animate bars when visible
  const chartObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        container.querySelectorAll('.bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = bar.dataset.height;
          }, i * 60);
        });
        chartObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  chartObs.observe(container);
})();


// ===== ANIMATE COMPARISON BARS =====
(function animateCompBars() {
  document.querySelectorAll('.comp-bar').forEach(bar => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          bar.classList.add('animated');
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(bar);
  });
})();


// ===== ANIMATE PRESENCE BARS =====
(function animatePresenceBars() {
  document.querySelectorAll('.presence-bar').forEach(bar => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          bar.classList.add('animated');
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(bar);
  });
})();


// ===== SPD CHART (Canvas) =====
(function drawSPDChart() {
  const canvas = document.getElementById('spd-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Simulated SPD data based on paper's described patterns
  function generateSPD(type) {
    const points = [];
    for (let f = 0; f <= 25; f += 0.25) {
      let base = 1 / (1 + f * 0.15); // natural 1/f falloff
      let noise = (Math.random() - 0.5) * 0.05;
      if (type === 'malignant') {
        // Lower at 0.2, 12, 23.8; Higher at 7.6, 19.7
        if (f > 0 && f < 0.5) base *= 0.6;
        if (f > 7 && f < 8.5) base *= 2.0;
        if (f > 11 && f < 13) base *= 0.5;
        if (f > 18.5 && f < 21) base *= 2.5;
        if (f > 23 && f < 25) base *= 0.4;
      } else {
        // Normal: higher at 0.2, 12, 23.8; lower at 7.6, 19.7
        if (f > 0 && f < 0.5) base *= 1.5;
        if (f > 11 && f < 13) base *= 1.3;
        if (f > 23 && f < 25) base *= 1.2;
      }
      points.push({ f, v: Math.max(0, base + noise) });
    }
    return points;
  }

  const normalData = generateSPD('normal');
  const malignantData = generateSPD('malignant');
  const maxV = Math.max(...normalData.map(d => d.v), ...malignantData.map(d => d.v));

  let progress = 0;
  let drawn = false;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }
    for (let f = 0; f <= 25; f += 5) {
      const x = pad.left + (f / 25) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + chartH);
      ctx.stroke();
    }

    // Axes labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let f = 0; f <= 25; f += 5) {
      const x = pad.left + (f / 25) * chartW;
      ctx.fillText(f + ' Hz', x, pad.top + chartH + 20);
    }
    ctx.save();
    ctx.translate(15, pad.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Spectral Power', 0, 0);
    ctx.restore();

    const visibleCount = Math.floor(progress * normalData.length);

    // Draw lines
    function drawLine(data, color) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < visibleCount && i < data.length; i++) {
        const x = pad.left + (data[i].f / 25) * chartW;
        const y = pad.top + chartH - (data[i].v / maxV) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill under
      if (visibleCount > 0) {
        const lastI = Math.min(visibleCount - 1, data.length - 1);
        ctx.lineTo(pad.left + (data[lastI].f / 25) * chartW, pad.top + chartH);
        ctx.lineTo(pad.left + (data[0].f / 25) * chartW, pad.top + chartH);
        ctx.closePath();
        ctx.fillStyle = color.replace('1)', '0.08)');
        ctx.fill();
      }
    }

    drawLine(normalData, 'rgba(110,231,183,1)');
    drawLine(malignantData, 'rgba(248,113,113,1)');

    // Highlight 19.7 Hz region
    if (progress > 0.75) {
      const x1 = pad.left + (18.5 / 25) * chartW;
      const x2 = pad.left + (21 / 25) * chartW;
      ctx.fillStyle = 'rgba(248,113,113,0.1)';
      ctx.fillRect(x1, pad.top, x2 - x1, chartH);
      ctx.fillStyle = 'rgba(248,113,113,0.7)';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('~20 Hz peak', (x1 + x2) / 2, pad.top + 15);
    }

    if (progress < 1) {
      progress += 0.015;
      requestAnimationFrame(draw);
    }
  }

  const spdObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !drawn) {
        drawn = true;
        progress = 0;
        draw();
        spdObs.unobserve(canvas);
      }
    });
  }, { threshold: 0.3 });
  spdObs.observe(canvas);
})();


// ===== MOUSE TIMELINE CHART (Canvas) =====
(function drawMouseChart() {
  const canvas = document.getElementById('mouse-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const pad = { top: 40, right: 30, bottom: 60, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const days = [1, 7, 13];
  const control = [25, 26, 25];
  const tumor = [42, 10, 18];
  const uv = [38, 12, 30];
  const maxY = 50;

  let progress = 0;
  let drawn = false;

  function xPos(i) { return pad.left + (i / (days.length - 1)) * chartW; }
  function yPos(v) { return pad.top + chartH - (v / maxY) * chartH; }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let v = 0; v <= maxY; v += 10) {
      const y = yPos(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(v, pad.left - 10, y + 4);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    days.forEach((d, i) => {
      ctx.fillText('Day ' + d, xPos(i), pad.top + chartH + 25);
    });

    // Y axis label
    ctx.save();
    ctx.translate(16, pad.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Photons per second', 0, 0);
    ctx.restore();

    const visiblePts = Math.floor(progress * days.length) + 1;

    function drawSeries(data, color, label) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (let i = 0; i < Math.min(visiblePts, data.length); i++) {
        const x = xPos(i);
        const y = yPos(data[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Points
      for (let i = 0; i < Math.min(visiblePts, data.length); i++) {
        const x = xPos(i);
        const y = yPos(data[i]);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(10,10,15,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Value label
        ctx.fillStyle = color;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data[i], x, y - 12);
      }
    }

    drawSeries(control, '#60a5fa', 'Control');
    drawSeries(tumor, '#f87171', 'Tumor');
    drawSeries(uv, '#fbbf24', 'UV-killed');

    // Significance markers
    if (progress >= 0.8) {
      ctx.fillStyle = 'rgba(248,113,113,0.6)';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('p < 0.05', xPos(0), pad.top + chartH + 45);
      ctx.fillText('p < 0.05', xPos(1), pad.top + chartH + 45);
    }

    if (progress < 1) {
      progress += 0.02;
      requestAnimationFrame(draw);
    }
  }

  const mouseObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !drawn) {
        drawn = true;
        progress = 0;
        draw();
        mouseObs.unobserve(canvas);
      }
    });
  }, { threshold: 0.3 });
  mouseObs.observe(canvas);
})();


// ===== SIGNATURE WAVE ANIMATION =====
(function drawSignatureWave() {
  const canvas = document.getElementById('signature-wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  let active = false;

  function draw() {
    if (!active) return;
    ctx.clearRect(0, 0, w, h);
    const mid = h / 2;

    // 20 Hz wave (malignant — red)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(248,113,113,0.8)';
    ctx.lineWidth = 2.5;
    for (let x = 0; x < w; x++) {
      const y = mid + Math.sin((x / w) * Math.PI * 20 + t * 2) * 30
                    + Math.sin((x / w) * Math.PI * 7.6 + t) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Normal wave (green, lower amplitude at 20 Hz)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(110,231,183,0.6)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x++) {
      const y = mid + Math.sin((x / w) * Math.PI * 20 + t * 2) * 8
                    + Math.sin((x / w) * Math.PI * 0.5 + t * 0.3) * 20
                    + Math.sin((x / w) * Math.PI * 12 + t * 1.5) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('~20 Hz dominant (malignant)', w - 10, 20);
    ctx.fillText('Mixed spectrum (normal)', w - 10, 40);

    t += 0.03;
    requestAnimationFrame(draw);
  }

  const waveObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      active = e.isIntersecting;
      if (active) draw();
    });
  }, { threshold: 0.2 });
  waveObs.observe(canvas);
})();


// ===== HiDPI CANVAS SCALING =====
(function scaleCanvases() {
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1) return;

  ['spd-chart', 'mouse-chart'].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.getContext('2d').scale(dpr, dpr);
  });
})();
