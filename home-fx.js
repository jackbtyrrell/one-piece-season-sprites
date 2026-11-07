// Reactive background for the home page.
// A living meadow: grass that sways in the wind and bends away from your mouse
// or finger, blue water in the low spots, purple flowers on the hills, and
// fireflies that drift toward you. Clicking splashes a ripple and a burst of petals.
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

  const pts = new Array(COLS * ROWS);

  // Each grid point gets its own random grass look so the meadow isn't too neat.
  const seed = Array.from({ length: COLS * ROWS }, () => ({
    lean: Math.random() * 0.6 - 0.3,
    len: 0.7 + Math.random() * 0.6,
    shade: Math.random(),
    flower: Math.random() < 0.35,
  }));

  // Fireflies drift around the screen and are drawn toward the pointer.
  const flies = Array.from({ length: 46 }, () => ({
    x: Math.random(), y: 0.15 + Math.random() * 0.8,
    vx: 0, vy: 0, ph: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.6 ? 'g' : (Math.random() < 0.5 ? 'b' : 'p'),
  }));
  const FLY = { g: [170, 255, 120], b: [90, 200, 255], p: [210, 130, 255] };

  // Petals that burst out when you click.
  const petals = [];

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
        p.y = y; p.x = x; p.zz = z;
        pts[r * COLS + c] = p;
      }
    }

    const wind = Math.sin(t * 0.6) * 0.25;          // slow gusts across the meadow
    const pX = (ptr.ex + 1) / 2 * W;                 // pointer in pixels
    const pY = (ptr.ey + 1) / 2 * H;

    for (let r = 0; r < ROWS; r++) {
      const depth = r / (ROWS - 1);                  // 0 = far, 1 = near
      const fade = 0.25 + 0.75 * depth;
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c, p = pts[i], sd = seed[i];

        // soft mossy ground: faint lines to the next point
        ctx.lineWidth = 1;
        if (c < COLS - 1) ground(p, pts[i + 1], fade);
        if (r < ROWS - 1) ground(p, pts[i + COLS], fade);

        if (p.y < -0.06) {
          // low spots are water: little blue shimmer
          const sh = 0.5 + 0.5 * Math.sin(t * 3 + p.x * 9 + p.zz * 7);
          ctx.strokeStyle = `rgba(80, 180, 255, ${0.35 * fade * sh})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.sx - 5 * fade, p.sy);
          ctx.lineTo(p.sx + 5 * fade, p.sy);
          ctx.stroke();
          continue;
        }

        // grass blade that sways in the wind and bends away from the pointer
        const scale = (6 + 16 * depth) * sd.len;
        let bend = sd.lean + wind + Math.sin(t * 2.2 + p.x * 3 + p.zz * 2) * 0.22;
        const dx = p.sx - pX, dy = p.sy - pY, d = Math.hypot(dx, dy);
        if (d < 140) bend += (dx / (d + 1)) * (1 - d / 140) * 1.2;
        const tipX = p.sx + Math.sin(bend) * scale;
        const tipY = p.sy - Math.cos(bend) * scale;
        const g = 150 + Math.round(sd.shade * 90);
        ctx.strokeStyle = `rgba(${40 + Math.round(sd.shade * 50)}, ${g}, ${90 + Math.round(sd.shade * 40)}, ${0.75 * fade})`;
        ctx.lineWidth = 1 + depth * 1.4;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.quadraticCurveTo(p.sx + Math.sin(bend) * scale * 0.2, p.sy - scale * 0.6, tipX, tipY);
        ctx.stroke();

        // purple flowers on the hills
        if (sd.flower && p.y > 0.1) {
          const rr = 1.5 + depth * 2.6;
          ctx.fillStyle = `rgba(190, 110, 255, ${0.9 * fade})`;
          for (let k = 0; k < 5; k++) {
            const a = k * 1.2566 + t * 0.3;
            ctx.beginPath();
            ctx.arc(tipX + Math.cos(a) * rr, tipY + Math.sin(a) * rr, rr * 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(255, 235, 140, ${fade})`;
          ctx.beginPath();
          ctx.arc(tipX, tipY, rr * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // fireflies
    ctx.globalCompositeOperation = 'lighter';
    for (const f of flies) {
      f.ph += 0.03;
      f.vx += (Math.random() - 0.5) * 0.0006;
      f.vy += (Math.random() - 0.5) * 0.0006;
      if (ptr.active) {                              // drift toward the pointer
        f.vx += ((ptr.ex + 1) / 2 - f.x) * 0.00012;
        f.vy += ((ptr.ey + 1) / 2 - f.y) * 0.00012;
      }
      f.vx *= 0.97; f.vy *= 0.97;
      f.x += f.vx; f.y += f.vy;
      if (f.x < -0.05) f.x = 1.05; if (f.x > 1.05) f.x = -0.05;
      if (f.y < 0.05) f.y = 0.95;  if (f.y > 1.0) f.y = 0.1;
      const glow = 0.5 + 0.5 * Math.sin(f.ph * 2);
      const [cr, cg, cb] = FLY[f.hue];
      const fx = f.x * W, fy = f.y * H;
      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 14);
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.9 * glow})`);
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // petals from clicks
    for (let i = petals.length - 1; i >= 0; i--) {
      const q = petals[i];
      q.vy += 0.04; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.rot += q.spin; q.life -= 0.012;
      if (q.life <= 0) { petals.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(q.rot);
      ctx.fillStyle = `rgba(${q.c[0]},${q.c[1]},${q.c[2]},${q.life})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (!reduced || petals.length) requestAnimationFrame(frame);
  }

  function ground(a, b, fade) {
    const y = (a.y + b.y) / 2;
    ctx.strokeStyle = y < -0.06
      ? `rgba(60, 140, 255, ${0.28 * fade})`
      : `rgba(70, 170, 110, ${0.22 * fade})`;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  function burst(x, y) {
    const cols = [[190, 110, 255], [120, 255, 140], [90, 200, 255], [255, 235, 140]];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4;
      petals.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.5, rot: a, spin: (Math.random() - 0.5) * 0.3,
                    life: 1, c: cols[Math.floor(Math.random() * cols.length)] });
    }
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
    burst(e.clientX, e.clientY);
    if (reduced) requestAnimationFrame(frame);
  });
  window.addEventListener('resize', () => { resize(); if (reduced) requestAnimationFrame(frame); });

  resize();
  requestAnimationFrame(frame);
})();
