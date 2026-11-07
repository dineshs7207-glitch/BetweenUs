/**
 * A coded espresso pour, drawn on a canvas for scroll progress p (0..1).
 * Stand-in for the Higgsfield hero video until frames exist in /public/hero/frames.
 */
export function drawPour(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const ease = (t: number) => t * t * (3 - 2 * t);
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // Background: warm wall with soft window light from the left
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#6B2E1E");
  bg.addColorStop(0.55, "#3D1A10");
  bg.addColorStop(1, "#22100A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const light = ctx.createRadialGradient(w * 0.18, h * 0.12, 0, w * 0.18, h * 0.12, Math.max(w, h) * 0.75);
  light.addColorStop(0, "rgba(255,226,190,0.38)");
  light.addColorStop(1, "rgba(255,226,190,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  // Camera pulls back and up as you scroll
  const zoom = 1.75 - 0.75 * ease(clamp(p / 0.9));
  const unit = Math.min(w, h * 1.1);
  const cx = w / 2;
  const cy = h * (0.6 + 0.06 * (1 - ease(p)));

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(zoom, zoom);

  const r = unit * 0.2; // cup radius
  const tilt = 0.42; // ellipse squash: looking down at an angle
  const cupH = r * 0.95;

  // Table surface glow
  const table = ctx.createRadialGradient(0, cupH * 0.9, r * 0.2, 0, cupH * 0.9, r * 2.6);
  table.addColorStop(0, "rgba(255,240,220,0.20)");
  table.addColorStop(1, "rgba(255,240,220,0)");
  ctx.fillStyle = table;
  ctx.fillRect(-r * 4, -r * 0.2, r * 8, r * 4);

  // Shadow
  ctx.fillStyle = "rgba(15,6,3,0.45)";
  ctx.beginPath();
  ctx.ellipse(r * 0.12, cupH + r * 0.1, r * 1.15, r * tilt * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Saucer
  const saucer = ctx.createLinearGradient(-r * 1.6, 0, r * 1.6, 0);
  saucer.addColorStop(0, "#BFA483");
  saucer.addColorStop(0.45, "#E9D8C0");
  saucer.addColorStop(1, "#A88B6A");
  ctx.fillStyle = saucer;
  ctx.beginPath();
  ctx.ellipse(0, cupH, r * 1.6, r * 1.6 * tilt, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(90,60,40,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, cupH, r * 1.05, r * 1.05 * tilt, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cup body (sand-coloured stoneware)
  const body = ctx.createLinearGradient(-r, 0, r, 0);
  body.addColorStop(0, "#B79A78");
  body.addColorStop(0.35, "#EAD9C1");
  body.addColorStop(0.6, "#DCC6A6");
  body.addColorStop(1, "#9E8061");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.bezierCurveTo(-r, cupH * 0.7, -r * 0.78, cupH, -r * 0.62, cupH);
  ctx.ellipse(0, cupH, r * 0.62, r * 0.62 * tilt, 0, Math.PI, 0, true);
  ctx.bezierCurveTo(r * 0.78, cupH, r, cupH * 0.7, r, 0);
  ctx.closePath();
  ctx.fill();

  // Speckles on the stoneware
  ctx.fillStyle = "rgba(90,60,40,0.25)";
  for (let i = 0; i < 40; i++) {
    const a = (i * 137.5 * Math.PI) / 180;
    const x = Math.cos(a) * r * 0.85 * ((i % 7) / 7);
    const y = cupH * (0.2 + 0.7 * ((i * 53) % 100) / 100);
    ctx.fillRect(x, y, 1.2, 1.2);
  }

  // Handle
  ctx.strokeStyle = "#CDB394";
  ctx.lineWidth = r * 0.14;
  ctx.beginPath();
  ctx.ellipse(r * 1.08, cupH * 0.38, r * 0.26, r * 0.3, 0, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Rim
  ctx.fillStyle = "#F3E7D6";
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * tilt, 0, 0, Math.PI * 2);
  ctx.fill();
  // Inside of the cup
  const inner = ctx.createLinearGradient(0, -r * tilt, 0, r * tilt);
  inner.addColorStop(0, "#A88866");
  inner.addColorStop(1, "#E3D1B8");
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.9 * tilt, 0, 0, Math.PI * 2);
  ctx.fill();

  // Coffee level rises
  const fill = ease(clamp((p - 0.06) / 0.7));
  if (fill > 0.001) {
    const lr = r * (0.55 + 0.33 * fill);
    const ly = r * tilt * 0.6 * (1 - fill);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.9, r * 0.9 * tilt, 0, 0, Math.PI * 2);
    ctx.clip();
    const coffee = ctx.createRadialGradient(0, ly, 0, 0, ly, lr);
    coffee.addColorStop(0, "#2A1209");
    coffee.addColorStop(0.55, "#4A2414");
    coffee.addColorStop(0.85, "#9A5E33");
    coffee.addColorStop(1, "#C88E5A");
    ctx.fillStyle = coffee;
    ctx.beginPath();
    ctx.ellipse(0, ly, lr, lr * tilt, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crema swirl
    const crema = clamp((p - 0.25) / 0.5);
    if (crema > 0) {
      ctx.strokeStyle = `rgba(214,160,104,${0.55 * crema})`;
      ctx.lineCap = "round";
      for (let k = 0; k < 3; k++) {
        ctx.lineWidth = r * (0.05 - k * 0.012);
        ctx.beginPath();
        const turns = 1.6;
        for (let t = 0; t <= 1; t += 0.02) {
          const ang = t * Math.PI * 2 * turns + p * 9 + k * 2.1;
          const rad = lr * (0.15 + 0.7 * t) * (0.6 + 0.4 * crema);
          const x = Math.cos(ang) * rad;
          const y = ly + Math.sin(ang) * rad * tilt;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    // Highlight
    ctx.fillStyle = "rgba(255,235,210,0.22)";
    ctx.beginPath();
    ctx.ellipse(-lr * 0.35, ly - lr * tilt * 0.35, lr * 0.28, lr * tilt * 0.12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();

  // The stream of espresso falls from above, thins out and stops
  const streamOn = p < 0.82;
  if (streamOn) {
    const thin = 1 - ease(clamp((p - 0.55) / 0.27));
    const sw = Math.max(1.5, unit * 0.014 * zoom * (0.4 + 0.6 * thin));
    const surfaceY = cy - r * tilt * 0.6 * zoom * (1 - fill) * 0.2;
    const topY = p < 0.6 ? 0 : (cy - 0) * ease(clamp((p - 0.6) / 0.22));
    const g = ctx.createLinearGradient(cx - sw, 0, cx + sw, 0);
    g.addColorStop(0, "#2B120A");
    g.addColorStop(0.45, "#7A4325");
    g.addColorStop(1, "#24100A");
    ctx.fillStyle = g;
    ctx.beginPath();
    const wob = Math.sin(p * 60) * sw * 0.12;
    ctx.moveTo(cx - sw / 2, topY);
    ctx.quadraticCurveTo(cx - sw / 2 + wob, (topY + surfaceY) / 2, cx - sw * 0.4, surfaceY);
    ctx.lineTo(cx + sw * 0.4, surfaceY);
    ctx.quadraticCurveTo(cx + sw / 2 + wob, (topY + surfaceY) / 2, cx + sw / 2, topY);
    ctx.closePath();
    ctx.fill();
  }

  // Soft vignette
  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.8);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(10,4,2,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}
