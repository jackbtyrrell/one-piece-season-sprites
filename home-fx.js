// Reactive background for the home page.
// A glowing wireframe landscape that rolls like waves, tilts toward your
// mouse or finger, bulges up wherever you point, and splashes when you click.
(function () {
  const canvas = document.getElementById('fx');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const COLS = 56, ROWS = 38;          // grid size
  const SPAN_X = 2.6, SPAN_Z = 2.2;    // how wide / deep the landscape is
  let W = 0, H = 0, dpr = 1;

  // Pointer, in -1..1 screen space. "ease" values chase the real ones for smooth motion.
  const ptr = { x: 0, y: 0.2, ex: 0, ey: 0.2, active: false };
  const ripples = [];                  // click splashes: { x, z, t0 }
  let start = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Where the pointer lands on the landscape (rough inverse of the projection).
  function pointerToGround(px, py) {
    const depth = Math.min(Math.max((py + 0.15) / 1.15, 0), 1); // lower on screen = closer
    return { x: px * SPAN_X * 0.55 * (1.2 - depth * 0.4), z: (1 - depth) * SPAN_Z - SPAN_Z / 2 };
  }

  function height(x, z, t) {
    // rolling waves
    let y = Math.sin(x * 2.1 + t * 0.9) * 0.08
          + Math.sin(z * 3.0 - t * 1.3) * 0.06
          + Math.sin((x + z) * 4.0 + t * 0.7) * 0.03;
    // bump under the pointer
    const g = pointerToGround(ptr.ex, ptr.ey);
    const dx = x - g.x, dz = z - g.z;
    const d2 = dx * dx + dz * dz;
    y += Math.exp(-d2 * 5) * (ptr.active ? 0.38 : 0.18);
    // splash rings
    for (const r of ripples) {
      const age = t - r.t0;
      const dist = Math.hypot(x - r.x, z - r.z);
      const ring = dist - age * 1.4;
      y += Math.exp(-ring * ring * 30) * 0.25 * Math.exp(-age * 1.2);
    }
    return y;
  }

  // Perspective camera that tilts with the pointer.
  function project(x, y, z) {
    const yaw = ptr.ex * 0.35, pitch = 0.55 + ptr.ey * 0.12;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    let X = x * cy - z * sy, Z = x * sy + z * cy;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    let Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    Z += 2.4;                                  // push away from camera
    const f = Math.max(Math.min(W, H * 1.4), H * 1.1) * 0.9 / Z;   // stays big on tall phone screens
    return { sx: W / 2 + X * f, sy: H * 0.5 - Y * f + H * 0.14, z: Z };
  }

  // Height -> color: blue in the dips, green in the middle, purple on the peaks.
  function color(y, alpha) {
    const k = Math.min(Math.max((y + 0.15) / 0.6, 0), 1);
    const stops = [[40, 90, 255], [30, 200, 255], [50, 255, 120], [150, 70, 255], [210, 90, 255]];
    const s = k * (stops.length - 1), i = Math.min(Math.floor(s), stops.length - 2), f = s - i;
    const c = stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * f));
    return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
  }

  const pts = new Array(COLS * ROWS);

  function frame(now) {
    const t = (now - start) / 1000;
    ptr.ex += (ptr.x - ptr.ex) * 0.06;
    ptr.ey += (ptr.y - ptr.ey) * 0.06;
    while (ripples.length && t - ripples[0].t0 > 3) ripples.shift();

    ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) {
      const z = (r / (ROWS - 1) - 0.5) * SPAN_Z;
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * SPAN_X;
        const y = height(x, z, t);
        const p = project(x, y, z);
        p.y = y;
        pts[r * COLS + c] = p;
      }
    }

    ctx.lineWidth = 1.1;
    ctx.globalCompositeOperation = 'lighter';
    // draw back rows first so near lines sit on top
    for (let r = 0; r < ROWS; r++) {
      const fade = 0.15 + 0.75 * (r / (ROWS - 1));      // far rows are fainter
      for (let c = 0; c < COLS; c++) {
        const p = pts[r * COLS + c];
        if (c < COLS - 1) line(p, pts[r * COLS + c + 1], fade);
        if (r < ROWS - 1) line(p, pts[(r + 1) * COLS + c], fade);
      }
    }
    // glowing dots on the peaks
    for (const p of pts) {
      if (p.y > 0.16) {
        ctx.fillStyle = color(p.y, 0.9);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.6 + (p.y - 0.16) * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    if (!reduced) requestAnimationFrame(frame);
  }

  function line(a, b, fade) {
    ctx.strokeStyle = color((a.y + b.y) / 2, 0.55 * fade);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  function setPointer(e) {
    const p = e.touches ? e.touches[0] : e;
    if (!p) return;
    ptr.x = (p.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (p.clientY / window.innerHeight) * 2 - 1;
    ptr.active = true;
  }

  window.addEventListener('pointermove', setPointer, { passive: true });
  window.addEventListener('touchmove', setPointer, { passive: true });
  window.addEventListener('pointerleave', () => { ptr.active = false; });
  window.addEventListener('pointerdown', e => {
    setPointer(e);
    const g = pointerToGround(ptr.x, ptr.y);
    ripples.push({ x: g.x, z: g.z, t0: (performance.now() - start) / 1000 });
    if (reduced) requestAnimationFrame(frame);
  });
  window.addEventListener('resize', () => { resize(); if (reduced) requestAnimationFrame(frame); });

  resize();
  requestAnimationFrame(frame);
})();
