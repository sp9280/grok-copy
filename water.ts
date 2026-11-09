// ════════════════════════════════════════════════════════════════
//  Powder Flow Water Background
//  Thousands of soft particles drift through a smooth noise-based flow
//  field. Mouse movement scatters them like powder thrown into the air.
//  Trails are created by fading the canvas instead of clearing it.
// ════════════════════════════════════════════════════════════════

interface Particle {
    x: number;
    y: number;
    px: number; // previous x for line trail
    py: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    hue: number;
    sat: number;
    lum: number;
    size: number;
}

export function initWaterBackground(): void {
    const canvas = document.getElementById('waterCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize(): void {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Fill with deep background once
        ctx.fillStyle = '#04060c';
        ctx.fillRect(0, 0, W, H);
    }

    // ---- Simplex-ish noise (value noise with smoothstep) ----
    const noiseGrid: number[] = [];
    const GRID_W = 256;
    const GRID_H = 256;
    for (let i = 0; i < GRID_W * GRID_H; i++) {
        noiseGrid[i] = Math.random() * Math.PI * 2;
    }

    function lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    function smoothstep(t: number): number {
        return t * t * (3 - 2 * t);
    }

    function noiseAngle(x: number, y: number, t: number): number {
        const sx = (x * 0.0015 + t * 0.03) % GRID_W;
        const sy = (y * 0.0015 + t * 0.02) % GRID_H;
        const ix = Math.floor(sx);
        const iy = Math.floor(sy);
        const fx = sx - ix;
        const fy = sy - iy;
        const ix2 = (ix + 1) % GRID_W;
        const iy2 = (iy + 1) % GRID_H;

        const v00 = noiseGrid[iy * GRID_W + ix];
        const v10 = noiseGrid[iy * GRID_W + ix2];
        const v01 = noiseGrid[iy2 * GRID_W + ix];
        const v11 = noiseGrid[iy2 * GRID_W + ix2];

        const sxr = smoothstep(fx);
        const syr = smoothstep(fy);

        const a = lerp(v00, v10, sxr);
        const b = lerp(v01, v11, sxr);
        return lerp(a, b, syr) * Math.PI * 2;
    }

    // ---- Particles ----
    const particles: Particle[] = [];
    const TARGET_COUNT = 1200;

    // Color palette — cool deep blues, teals, violet, with occasional warm spark
    function pickColor(): { hue: number; sat: number; lum: number } {
        const r = Math.random();
        if (r < 0.35) return { hue: 200 + Math.random() * 30, sat: 60 + Math.random() * 30, lum: 55 + Math.random() * 20 };
        if (r < 0.65) return { hue: 220 + Math.random() * 25, sat: 50 + Math.random() * 30, lum: 50 + Math.random() * 25 };
        if (r < 0.82) return { hue: 170 + Math.random() * 30, sat: 45 + Math.random() * 30, lum: 50 + Math.random() * 20 };
        if (r < 0.93) return { hue: 260 + Math.random() * 30, sat: 40 + Math.random() * 30, lum: 50 + Math.random() * 20 };
        return { hue: 20 + Math.random() * 25, sat: 40 + Math.random() * 20, lum: 60 + Math.random() * 15 };
    }

    function spawnParticle(reset?: boolean): void {
        const c = pickColor();
        const x = Math.random() * W;
        const y = Math.random() * H;
        particles.push({
            x,
            y,
            px: x,
            py: y,
            vx: 0,
            vy: 0,
            life: 0,
            maxLife: 300 + Math.random() * 600,
            hue: c.hue,
            sat: c.sat,
            lum: c.lum,
            size: 0.5 + Math.random() * 1.8,
        });
    }

    for (let i = 0; i < TARGET_COUNT; i++) spawnParticle();

    // ---- Mouse interaction ----
    let mx = -9999;
    let my = -9999;
    let pmx = -9999;
    let pmy = -9999;
    let mouseVX = 0;
    let mouseVY = 0;
    let mouseActive = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    document.addEventListener('mousemove', (e) => {
        pmx = mx;
        pmy = my;
        mx = e.clientX;
        my = e.clientY;
        mouseVX = mx - pmx;
        mouseVY = my - pmy;
        mouseActive = true;

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { mouseActive = false; }, 1500);
    });

    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (!t) return;
        pmx = mx;
        pmy = my;
        mx = t.clientX;
        my = t.clientY;
        mouseVX = mx - pmx;
        mouseVY = my - pmy;
        mouseActive = true;

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { mouseActive = false; }, 1500);
    }, { passive: true });

    document.addEventListener('click', (e) => {
        // Burst: scatter particles near click
        const bx = e.clientX;
        const by = e.clientY;
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;
            const c = pickColor();
            const px = bx + (Math.random() - 0.5) * 30;
            const py = by + (Math.random() - 0.5) * 30;
            particles.push({
                x: px,
                y: py,
                px,
                py,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 80 + Math.random() * 120,
                hue: c.hue,
                sat: c.sat,
                lum: c.lum,
                size: 0.8 + Math.random() * 2.2,
            });
        }
    });

    // ---- Animation loop ----
    let time = 0;
    const MOUSE_RADIUS = 180;
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

    function draw(): void {
        time += 0.005;

        // ── Fade previous frame (creates smooth motion trails) ──
        // Very low alpha = long lingering trails (powder in air)
        ctx.fillStyle = 'rgba(4, 6, 12, 0.055)';
        ctx.fillRect(0, 0, W, H);

        // Additive blending so particles glow softly
        ctx.globalCompositeOperation = 'lighter';

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life++;

            // Remove dead or out-of-bounds particles
            if (p.life > p.maxLife) {
                particles.splice(i, 1);
                if (particles.length < TARGET_COUNT) spawnParticle();
                continue;
            }

            // ── Flow field: noise-based direction ──
            const angle = noiseAngle(p.x, p.y, time);
            const flowStrength = 0.15;
            p.vx += Math.cos(angle) * flowStrength;
            p.vy += Math.sin(angle) * flowStrength;

            // ── Mouse disturbance (powder scatter) ──
            if (mouseActive) {
                const dx = p.x - mx;
                const dy = p.y - my;
                const distSq = dx * dx + dy * dy;
                if (distSq < MOUSE_RADIUS_SQ) {
                    const dist = Math.sqrt(distSq) || 1;
                    const falloff = 1 - dist / MOUSE_RADIUS;
                    // Push away from cursor + inherit mouse velocity
                    const push = falloff * 1.8;
                    p.vx += (dx / dist) * push + mouseVX * falloff * 0.12;
                    p.vy += (dy / dist) * push + mouseVY * falloff * 0.12;

                    // Occasionally brighten particle near mouse
                    if (Math.random() < 0.02) {
                        p.lum = Math.min(85, p.lum + 15);
                    }
                }
            }

            // ── Damping (air resistance) ──
            p.vx *= 0.96;
            p.vy *= 0.96;

            // ── Limit speed ──
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const maxSpeed = 4;
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            }

            // ── Save previous position ──
            p.px = p.x;
            p.py = p.y;

            // ── Move ──
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around screen edges
            if (p.x < -10) p.x = W + 10, p.px = p.x;
            else if (p.x > W + 10) p.x = -10, p.px = p.x;
            if (p.y < -10) p.y = H + 10, p.py = p.y;
            else if (p.y > H + 10) p.y = -10, p.py = p.y;

            // ── Draw: soft particle as a short line from prev to current ──
            const lifeRatio = p.life / p.maxLife;
            // Fade in at birth, fade out at death
            const fade = Math.sin(lifeRatio * Math.PI);
            const alpha = fade * 0.45;

            const colorStr = `hsla(${p.hue}, ${p.sat}%, ${p.lum}%, ${alpha})`;

            // Draw a soft line trail
            ctx.strokeStyle = colorStr;
            ctx.lineWidth = p.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            // Soft glow dot at particle position
            if (Math.random() < 0.3) {
                ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lum + 10}%, ${alpha * 0.4})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ── Mouse glow halo (soft, smooth) ──
        if (mouseActive) {
            const haloGrad = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
            haloGrad.addColorStop(0, 'rgba(80, 140, 220, 0.06)');
            haloGrad.addColorStop(0.5, 'rgba(60, 100, 180, 0.025)');
            haloGrad.addColorStop(1, 'rgba(60, 100, 180, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(mx, my, MOUSE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';

        // Decay mouse velocity so it doesn't keep pushing after mouse stops
        mouseVX *= 0.9;
        mouseVY *= 0.9;

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
}
