/* ===================================================
   ULTRAWEAK PHOTON EMISSIONS — Interactive Narrative
   Enhanced with Chart.js + GSAP
   =================================================== */

// ===== CHART.JS GLOBAL CONFIG =====
Chart.defaults.color = '#8888a0';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.animation.duration = 1500;
Chart.defaults.animation.easing = 'easeOutQuart';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(19,19,26,0.95)';
Chart.defaults.plugins.tooltip.titleColor = '#e8e8ed';
Chart.defaults.plugins.tooltip.bodyColor = '#8888a0';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 12;

// ===== READING PROGRESS BAR =====
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
});

// ===== PHOTON PARTICLE CANVAS (Hero) — Enhanced =====
(function initPhotonCanvas() {
  const canvas = document.getElementById('photon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouseX = -1, mouseY = -1;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -1; mouseY = -1; });

  class Photon {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = initial ? Math.random() * w : Math.random() * w;
      this.y = initial ? Math.random() * h : Math.random() * h;
      this.baseR = Math.random() * 2 + 0.5;
      this.r = this.baseR;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.isMalignant = Math.random() > 0.55;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      // Mouse interaction — particles repel slightly
      if (mouseX > 0) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.3;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      if (this.x < -20 || this.x > w + 20 || this.y < -20 || this.y > h + 20) this.reset(false);
    }
    draw() {
      const a = this.alpha * (0.5 + 0.5 * Math.sin(this.pulse));
      const color = this.isMalignant
        ? `rgba(248,113,113,${a})`
        : `rgba(110,231,183,${a})`;

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.isMalignant
        ? `rgba(248,113,113,${a * 0.15})`
        : `rgba(110,231,183,${a * 0.15})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 150; i++) particles.push(new Photon());

  // Connection lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(110,231,183,${0.06 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Animate all major elements
gsap.utils.toArray('.card, .method-step, .chart-card, .finding, .impl-card, .key-frequencies, .experiment-diagram, .pull-quote, .citation-card, .author, .signature-viz, .col').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    delay: (i % 4) * 0.1
  });
});

// Section labels and headings
gsap.utils.toArray('.section-label, h2, .lead').forEach(el => {
  gsap.from(el, {
    opacity: 0,
    y: 25,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });
});

// Hero entrance
gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
gsap.from('.hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.5 });
gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
gsap.from('.hero-stats', { opacity: 0, y: 20, duration: 0.8, delay: 1.1 });
gsap.from('.scroll-cue', { opacity: 0, duration: 1, delay: 1.5 });


// ===== HERO COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.hero-stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
setTimeout(animateCounters, 1200);


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


// ===== ANIMATE FINDING BARS =====
document.querySelectorAll('.finding-bar').forEach(bar => {
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


// ===== CHART.JS: Cell Line Bar Chart =====
(function createCellLineChart() {
  const canvas = document.getElementById('cellLineChart');
  if (!canvas) return;

  const data = {
    labels: ['Hs 578T', 'HEK 293', 'HBL 100', 'MCF-7', 'MDA\nMB 231', 'B16\nBL6', 'HPAF-11', 'AsPC-1', 'Capan-1', 'BxPC3', 'CFPAC-1'],
    datasets: [{
      label: 'Photons/s',
      data: [79, 81, 80, 139, 76, 229, 62, 111, 116, 128, 120],
      backgroundColor: [
        '#6ee7b7', '#6ee7b7', '#6ee7b7',
        '#f87171', '#f87171', '#f87171', '#f87171', '#f87171', '#f87171', '#f87171', '#f87171'
      ],
      borderColor: [
        'rgba(110,231,183,0.8)', 'rgba(110,231,183,0.8)', 'rgba(110,231,183,0.8)',
        'rgba(248,113,113,0.8)', 'rgba(248,113,113,0.8)', 'rgba(248,113,113,0.8)',
        'rgba(248,113,113,0.8)', 'rgba(248,113,113,0.8)', 'rgba(248,113,113,0.8)',
        'rgba(248,113,113,0.8)', 'rgba(248,113,113,0.8)'
      ],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items) => items[0].label.replace('\n', ' '),
                label: (item) => {
                  const type = item.dataIndex < 3 ? 'Non-malignant' : 'Malignant';
                  return `${type}: ${item.raw} photons/s`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Photons per second', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0' }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: '#8888a0',
                font: { size: 10 },
                maxRotation: 45
              }
            }
          }
        }
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  obs.observe(canvas);
})();


// ===== CHART.JS: Comparison Donut =====
(function createComparisonDonut() {
  const canvas = document.getElementById('comparisonDonut');
  if (!canvas) return;

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Non-Malignant (~80/s)', 'Malignant (~125/s)'],
          datasets: [{
            data: [80, 125],
            backgroundColor: ['#6ee7b7', '#f87171'],
            borderColor: ['rgba(110,231,183,0.3)', 'rgba(248,113,113,0.3)'],
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, color: '#8888a0' }
            },
            tooltip: {
              callbacks: {
                label: (item) => `${item.label}: ${item.raw} photons/s avg`
              }
            }
          }
        },
        plugins: [{
          id: 'centerText',
          afterDraw(chart) {
            const { ctx, chartArea: { width, height, top, left } } = chart;
            ctx.save();
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = '#e8e8ed';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+56%', left + width / 2, top + height / 2 - 8);
            ctx.font = '11px Inter, sans-serif';
            ctx.fillStyle = '#8888a0';
            ctx.fillText('more photons', left + width / 2, top + height / 2 + 14);
            ctx.restore();
          }
        }]
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  obs.observe(canvas);
})();


// ===== CHART.JS: Accuracy Radar =====
(function createAccuracyChart() {
  const canvas = document.getElementById('accuracyChart');
  if (!canvas) return;

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'radar',
        data: {
          labels: ['Tissue-matched\npairs', 'Pancreatic\ncells', 'All cell lines\npooled', 'Mouse model\n(Day 19)', 'SPD at\n22 Hz'],
          datasets: [{
            label: 'Discriminant Accuracy',
            data: [90, 83, 70, 85, 92],
            backgroundColor: 'rgba(110,231,183,0.15)',
            borderColor: '#6ee7b7',
            borderWidth: 2,
            pointBackgroundColor: '#6ee7b7',
            pointBorderColor: '#0a0a0f',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 25,
                color: 'rgba(255,255,255,0.3)',
                backdropColor: 'transparent',
                font: { size: 9 }
              },
              pointLabels: {
                color: '#8888a0',
                font: { size: 10 }
              },
              grid: { color: 'rgba(255,255,255,0.06)' },
              angleLines: { color: 'rgba(255,255,255,0.06)' }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (item) => `${item.raw}% accuracy`
              }
            }
          }
        }
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  obs.observe(canvas);
})();


// ===== CHART.JS: SPD Line Chart =====
(function createSPDChart() {
  const canvas = document.getElementById('spdChart');
  if (!canvas) return;

  // Generate SPD data based on paper's patterns
  function generateSPD(type) {
    const points = [];
    for (let f = 0; f <= 25; f += 0.5) {
      let base = 1 / (1 + f * 0.15);
      if (type === 'malignant') {
        if (f >= 0 && f <= 0.5) base *= 0.6;
        if (f >= 7 && f <= 8.5) base *= 2.0;
        if (f >= 11 && f <= 13) base *= 0.5;
        if (f >= 18.5 && f <= 21) base *= 2.5;
        if (f >= 23 && f <= 25) base *= 0.4;
      } else {
        if (f >= 0 && f <= 0.5) base *= 1.5;
        if (f >= 11 && f <= 13) base *= 1.3;
        if (f >= 23 && f <= 25) base *= 1.2;
      }
      points.push(base + (Math.random() - 0.5) * 0.02);
    }
    return points;
  }

  const labels = [];
  for (let f = 0; f <= 25; f += 0.5) labels.push(f.toFixed(1));

  const normalData = generateSPD('normal');
  const malignantData = generateSPD('malignant');

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Non-malignant (HBL 100)',
              data: normalData,
              borderColor: '#6ee7b7',
              backgroundColor: 'rgba(110,231,183,0.08)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#6ee7b7'
            },
            {
              label: 'Malignant (Pancreatic)',
              data: malignantData,
              borderColor: '#f87171',
              backgroundColor: 'rgba(248,113,113,0.08)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#f87171'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyleWidth: 10, padding: 20, color: '#8888a0' }
            },
            tooltip: {
              callbacks: {
                title: (items) => items[0].label + ' Hz',
                label: (item) => `${item.dataset.label}: ${item.raw.toFixed(3)}`
              }
            },
            // Highlight annotation for ~20 Hz
            annotation: undefined
          },
          scales: {
            x: {
              title: { display: true, text: 'Frequency (Hz)', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: {
                color: '#8888a0',
                maxTicksLimit: 10,
                callback: function(val, idx) {
                  const f = parseFloat(this.getLabelForValue(val));
                  return f % 5 === 0 ? f + ' Hz' : '';
                }
              }
            },
            y: {
              title: { display: true, text: 'Spectral Power', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0', display: false }
            }
          }
        },
        plugins: [{
          id: 'highlightRegion',
          beforeDraw(chart) {
            const { ctx, scales: { x, y } } = chart;
            const x1 = x.getPixelForValue(37); // index for 18.5
            const x2 = x.getPixelForValue(42); // index for 21
            ctx.save();
            ctx.fillStyle = 'rgba(248,113,113,0.08)';
            ctx.fillRect(x1, y.top, x2 - x1, y.bottom - y.top);
            ctx.fillStyle = 'rgba(248,113,113,0.5)';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('~20 Hz peak', (x1 + x2) / 2, y.top + 15);
            ctx.restore();
          }
        }]
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.2 });
  obs.observe(canvas);
})();


// ===== CHART.JS: Mouse Timeline =====
(function createMouseTimeline() {
  const canvas = document.getElementById('mouseTimelineChart');
  if (!canvas) return;

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Day 1', 'Day 7', 'Day 13'],
          datasets: [
            {
              label: 'Control (no injection)',
              data: [25, 26, 25],
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(96,165,250,0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
              pointRadius: 6,
              pointHoverRadius: 9,
              pointBackgroundColor: '#60a5fa',
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2
            },
            {
              label: 'Tumor (B16-BL6)',
              data: [42, 10, 18],
              borderColor: '#f87171',
              backgroundColor: 'rgba(248,113,113,0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
              pointRadius: 6,
              pointHoverRadius: 9,
              pointBackgroundColor: '#f87171',
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2
            },
            {
              label: 'UV-killed cells',
              data: [38, 12, 30],
              borderColor: '#fbbf24',
              backgroundColor: 'rgba(251,191,36,0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
              pointRadius: 6,
              pointHoverRadius: 9,
              pointBackgroundColor: '#fbbf24',
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyleWidth: 10, padding: 20, color: '#8888a0' }
            },
            tooltip: {
              callbacks: {
                label: (item) => `${item.dataset.label}: ${item.raw} photons/s`
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'Photons per second', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0' },
              beginAtZero: true
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0', font: { weight: '600' } }
            }
          }
        }
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.2 });
  obs.observe(canvas);
})();


// ===== CHART.JS: Presence Chart =====
(function createPresenceChart() {
  const canvas = document.getElementById('presenceChart');
  if (!canvas) return;

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Empty Box', 'Mouse Present'],
          datasets: [{
            label: 'Photons/s',
            data: [15, 500],
            backgroundColor: [
              'rgba(255,255,255,0.12)',
              'rgba(129,140,248,0.7)'
            ],
            borderColor: [
              'rgba(255,255,255,0.2)',
              'rgba(129,140,248,1)'
            ],
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (item) => `~${item.raw} photons/s`
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Photons per second', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0' }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#e8e8ed', font: { weight: '500', size: 13 } }
            }
          }
        }
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  obs.observe(canvas);
})();


// ===== CHART.JS: SPD Comparison at 22 Hz =====
(function createSPDCompare() {
  const canvas = document.getElementById('spdCompareChart');
  if (!canvas) return;

  let chartCreated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartCreated) {
      chartCreated = true;
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Control Mice', 'Tumor Mice (Day 19)'],
          datasets: [{
            label: 'SPD at ~22 Hz',
            data: [17.4, 28],
            backgroundColor: ['rgba(96,165,250,0.7)', 'rgba(248,113,113,0.7)'],
            borderColor: ['#60a5fa', '#f87171'],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (item) => `SPD Score: ${item.raw} (SD: 4.4)`
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'SPD Score at 22.6 Hz', color: '#8888a0' },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8888a0' },
              beginAtZero: true,
              max: 35
            },
            x: {
              grid: { display: false },
              ticks: { color: '#e8e8ed', font: { weight: '500' } }
            }
          }
        },
        plugins: [{
          id: 'pValue',
          afterDraw(chart) {
            const { ctx, scales: { x } } = chart;
            const meta = chart.getDatasetMeta(0);
            if (meta.data.length < 2) return;
            const bar1 = meta.data[0];
            const bar2 = meta.data[1];
            const y = Math.min(bar1.y, bar2.y) - 20;
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bar1.x, y + 10);
            ctx.lineTo(bar1.x, y);
            ctx.lineTo(bar2.x, y);
            ctx.lineTo(bar2.x, y + 10);
            ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('p = 0.042 *', (bar1.x + bar2.x) / 2, y - 5);
            ctx.restore();
          }
        }]
      });
      obs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  obs.observe(canvas);
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

    // Malignant wave — 20 Hz dominant (red)
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

    // Glow for malignant
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(248,113,113,0.15)';
    ctx.lineWidth = 8;
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

    // Labels
    ctx.fillStyle = 'rgba(248,113,113,0.6)';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Malignant (~20 Hz dominant)', w - 10, 20);
    ctx.fillStyle = 'rgba(110,231,183,0.6)';
    ctx.fillText('Normal (mixed spectrum)', w - 10, 38);

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
