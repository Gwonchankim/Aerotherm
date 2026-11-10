/*
 * Aerotherm thermal propagation renderer.
 *
 * The drawing code is taken from design-claude/source/render.html (geometry, heat colors,
 * timing and emphasis effects are unchanged). Adapted for the live page:
 *   - draws into any canvas, sized to its container and the device pixel ratio;
 *   - an optional view rectangle crops the 1200 x 675 scene to the module;
 *   - blur and glow radii, which canvas measures in bitmap pixels, scale with the canvas;
 *   - the static base is cached, and its soft shadow has a fallback where canvas filters are missing;
 *   - the fade-in / fade-out table is interpolated so fractional frames work;
 *   - frameAt() / timeAt() map elapsed time to a frame (50 ms per frame, 1.5 s hold on frame 60).
 */
(function (global) {
  'use strict';

  var CW = 1200, CH = 675;

  // Geometry in construction units (from design/style-notes.md), board exaggerated to 1/5 of a cell.
  var T = 70, D = 250, H = 320, TB = 14, N = 5;
  var STEP = T + TB, STACK = N * T + (N - 1) * TB, XC = STACK / 2;

  // Oblique projection: narrow ends face the viewer, depth recedes up and to the right.
  var K = 0.5, ANG = Math.PI / 6, DX = K * Math.cos(ANG), DY = K * Math.sin(ANG);
  var S = 1.40;
  var OX = (CW - S * (STACK + D * DX)) / 2, OY = 626;
  var P = function (x, y, z) { return [OX + S * (x + z * DX), OY - S * (y + z * DY)]; };

  var BG = '#F6F9FB', BLUE_RGB = [67, 140, 203], AERO_EDGE = '#83B9CD';
  var cells = [], boards = [], i;
  for (i = 0; i < N; i++) cells.push({ x0: i * STEP, x1: i * STEP + T });
  for (i = 0; i < N - 1; i++) boards.push({ x0: i * STEP + T, x1: (i + 1) * STEP });
  var ROWS = [0.2, 0.32, 0.44, 0.56, 0.68, 0.80].map(function (u) { return u * H; });

  // ---------- color: heat ramp interpolated in OKLab ----------
  var hexRgb = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); };
  var s2l = function (c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  var l2s = function (c) { c = Math.min(1, Math.max(0, c)); return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)); };
  function toLch(hex) {
    var rgb = hexRgb(hex).map(s2l), r = rgb[0], g = rgb[1], b = rgb[2];
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return [L, Math.hypot(a, bb), (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360];
  }
  function lchRgb(lch) {
    var L = lch[0], C = lch[1], h = lch[2];
    var a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    var l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    var m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    var s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    return [l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            l2s(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)];
  }
  // Heat ramp in OKLab: blue -> a bright, near-white glow -> amber -> orange -> red, then red -> ember.
  // Passing through a light point keeps the blue-to-amber change from going muddy gray or rainbow.
  var toLab = function (hex) { var c = toLch(hex); return [c[0], c[1] * Math.cos(c[2] * Math.PI / 180), c[1] * Math.sin(c[2] * Math.PI / 180)]; };
  var labRgb = function (c) { return lchRgb([c[0], Math.hypot(c[1], c[2]), Math.atan2(c[2], c[1]) * 180 / Math.PI]); };
  var LAB = { blue: toLab('#438CCB'), glow: [0.93, 0.004, 0.02], amber: toLab('#F3B044'), orange: toLab('#EE742C'), red: toLab('#B82C25'), ember: toLab('#71352E') };
  var HEAT_STOPS = [[0, LAB.blue], [0.16, LAB.glow], [0.36, LAB.amber], [0.68, LAB.orange], [1, LAB.red]];
  var lerp3 = function (a, b, t) { return a.map(function (v, i) { return v + (b[i] - v) * t; }); };
  function heatRgb(h, e) {
    h = Math.min(1, Math.max(0, h));
    var c = HEAT_STOPS[HEAT_STOPS.length - 1][1];
    for (var i = 1; i < HEAT_STOPS.length; i++) {
      var t0 = HEAT_STOPS[i - 1][0], c0 = HEAT_STOPS[i - 1][1], t1 = HEAT_STOPS[i][0], c1 = HEAT_STOPS[i][1];
      if (h <= t1) { c = lerp3(c0, c1, (h - t0) / (t1 - t0)); break; }
    }
    if (e > 0) c = lerp3(c, LAB.ember, e);
    return labRgb(c);
  }
  var rgba = function (c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a === undefined ? 1 : a) + ')'; };
  var mixRgb = function (a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); };
  var shade = function (c, k) { return c.map(function (v) { return Math.round(v * k); }); };

  // ---------- timing ----------
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var sstep = function (t) { t = clamp(t); return t * t * (3 - 2 * t); };
  var ramp = function (f, a, b) { return sstep((f - a) / (b - a)); };

  // The GIF's fade table, keyed by whole frames: {1: .9, 2: .66, 3: .38, 4: .12, 61: .14, 62: .4, 63: .66, 64: .88}.
  // Interpolated linearly so fractional frames fade smoothly; whole frames keep the table's values,
  // and the veil closes fully at 65, where the loop wraps to frame 1.
  var FADE = [[1, 0.9], [2, 0.66], [3, 0.38], [4, 0.12], [5, 0], [60, 0], [61, 0.14], [62, 0.4], [63, 0.66], [64, 0.88], [65, 1]];
  function fadeAt(f) {
    if (f <= FADE[0][0]) return FADE[0][1];
    for (var i = 1; i < FADE.length; i++) {
      if (f <= FADE[i][0]) {
        var a = FADE[i - 1], b = FADE[i];
        return a[1] + (b[1] - a[1]) * (f - a[0]) / (b[0] - a[0]);
      }
    }
    return 1;
  }

  function state(v, f) {
    var w = v === 'with';
    return {
      v: v, f: f,
      h3: ramp(f, 12, 20),                                  // cell 3 heats, frames 13–20
      ember: w ? ramp(f, 46, 59) : 0,                       // cell 3 dims to ember, 47–60
      vent: ramp(f, 20, 24) * (w ? 1 - ramp(f, 47, 56) : 1),
      impact: w ? ramp(f, 27, 31) : 0,                      // impact band spreads along the board
      board: w ? ramp(f, 27, 31) * (1 - 0.8 * ramp(f, 46, 58)) : 0,   // hot face glow
      pulse: w ? (f < 27 || f > 38 ? 0 : f <= 32 ? sstep((f - 27) / 5) : 1 - sstep((f - 32) / 6)) : 0,
      dim: w ? ramp(f, 27, 31) * (1 - ramp(f, 38, 46)) : 0,
      fade: fadeAt(f)
    };
  }

  // Heat front without Aerotherm: the frame at which it passes distance d from cell 3's center.
  function frontFrame(d) {
    if (d <= 35) return -Infinity;
    if (d <= 119) return 24 + (d - 35) / 84 * 8;         // through cells 2 and 4
    if (d <= 133) return 32 + (d - 119) / 14 * 3;        // across the gaps
    return 35 + (d - 133) / 70 * 11;                     // through cells 1 and 5
  }
  // Distance of the heat front from cell 3's center. With Aerotherm it stops at the boards (35).
  function frontPos(f, v) {
    if (f < 21) return 0;
    if (v === 'with') return Math.min(35, (f - 21) / 6 * 35);
    if (f <= 24) return (f - 21) / 3 * 35;
    if (f <= 32) return 35 + (f - 24) / 8 * 84;
    if (f <= 35) return 119 + (f - 32) / 3 * 14;
    if (f <= 46) return 133 + (f - 35) / 11 * 70;
    return 203;
  }
  function heatAt(x, st) {
    var d = Math.abs(x - XC);
    if (d <= 35) return st.h3 * (1 - 0.07 * Math.pow(d / 35, 2));
    if (st.v === 'with') return 0;
    return sstep((st.f - frontFrame(d)) / 12);
  }
  var emberAt = function (x, st) { return Math.abs(x - XC) <= 35 ? st.ember : 0; };
  var cellRgb = function (x, st) { return heatRgb(heatAt(x, st), emberAt(x, st)); };

  // ---------- drawing helpers ----------
  function poly(ctx, pts) { ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  var silhouette = function (x0, x1, top) {
    if (top === undefined) top = H;
    return [P(x0, 0, 0), P(x1, 0, 0), P(x1, H, 0), P(x1, top, D), P(x0, top, D), P(x0, H, 0)];
  };

  // The renderer drew at 2x, where canvas blur radii (bitmap pixels) were tuned. `px` is the
  // number of bitmap pixels per scene unit, so glow(v) keeps the same look at any canvas size.
  var glow = function (v, px) { return v * px / 2; };

  function drawBase(ctx, px) {
    var x0 = -14, x1 = STACK + 14, z0 = -12, z1 = D + 12, y0 = -16;
    var a = P(x0, y0, z0), b = P(x1, y0, z0);
    var cx = (a[0] + b[0]) / 2 + 40, cy = a[1] + 6, rx = (b[0] - a[0]) / 2 + 60, ry = 20, sigma = glow(16, px);
    ctx.save();
    if (typeof ctx.filter === 'string') {
      ctx.filter = 'blur(' + sigma + 'px)'; ctx.fillStyle = 'rgba(16,42,67,0.14)';
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      // No canvas filters (older Safari): draw the ellipse off-canvas and keep only its blurred shadow.
      var off = 4000;
      ctx.shadowColor = 'rgba(16,42,67,0.14)'; ctx.shadowBlur = sigma * 2; ctx.shadowOffsetX = off * px; ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.ellipse(cx - off, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = '#B9CAD6'; ctx.lineWidth = 1;
    poly(ctx, [P(x1, y0, z0), P(x1, y0, z1), P(x1, 0, z1), P(x1, 0, z0)]); ctx.fillStyle = '#CAD7E0'; ctx.fill(); ctx.stroke();
    poly(ctx, [P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)]); ctx.fillStyle = '#E8EFF4'; ctx.fill(); ctx.stroke();
    poly(ctx, [P(x0, y0, z0), P(x1, y0, z0), P(x1, 0, z0), P(x0, 0, z0)]); ctx.fillStyle = '#D8E2E9'; ctx.fill(); ctx.stroke();
  }

  function terminal(ctx, xm, zm, copper) {
    var wx = 30, wz = 34, h = 9, x0 = xm - wx / 2, x1 = xm + wx / 2, z0 = zm - wz / 2, z1 = zm + wz / 2, y0 = H, y1 = H + h;
    var c = copper ? ['#D4B49E', '#B89580', '#A58472'] : ['#C9D2DA', '#A7B4BE', '#95A3AE'];
    ctx.strokeStyle = 'rgba(16,42,67,0.4)'; ctx.lineWidth = 0.8;
    poly(ctx, [P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)]); ctx.fillStyle = c[2]; ctx.fill(); ctx.stroke();
    poly(ctx, [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]); ctx.fillStyle = c[0]; ctx.fill(); ctx.stroke();
    poly(ctx, [P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)]); ctx.fillStyle = c[1]; ctx.fill(); ctx.stroke();
  }

  function drawCell(ctx, c, st) {
    // broad face on the right (only the outer one and slivers in empty gaps stay visible)
    poly(ctx, [P(c.x1, 0, 0), P(c.x1, 0, D), P(c.x1, H, D), P(c.x1, H, 0)]);
    ctx.fillStyle = rgba(shade(cellRgb(c.x1 - 0.01, st), 0.8)); ctx.fill();
    var fx = P(c.x1, 0, 0)[0], bx = P(c.x1, 0, D)[0];
    var g = ctx.createLinearGradient(fx, 0, bx, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(16,42,67,0.4)'; ctx.lineWidth = 1; ctx.stroke();

    // lid and terminals
    var mid = (c.x0 + c.x1) / 2, hm = heatAt(mid, st);
    var lid = mixRgb([221, 231, 239], heatRgb(hm, emberAt(mid, st)).map(function (v) { return Math.min(255, v + 45); }), 0.5 * hm);
    poly(ctx, [P(c.x0, H, 0), P(c.x1, H, 0), P(c.x1, H, D), P(c.x0, H, D)]);
    ctx.fillStyle = rgba(lid); ctx.fill(); ctx.strokeStyle = 'rgba(16,42,67,0.35)'; ctx.stroke();
    terminal(ctx, mid, D * 0.73, false);
    terminal(ctx, mid, D * 0.27, true);

    // narrow end facing the viewer, colored column by column from the heat field
    var A = P(c.x0, H, 0), B = P(c.x1, 0, 0), ax = A[0], ay = A[1], bx2 = B[0], by = B[1];
    g = ctx.createLinearGradient(ax, 0, bx2, 0);
    for (var k = 0; k <= 28; k++) g.addColorStop(k / 28, rgba(cellRgb(c.x0 + k / 28 * T, st)));
    rrect(ctx, ax, ay, bx2 - ax, by - ay, 3); ctx.fillStyle = g; ctx.fill();
    g = ctx.createLinearGradient(ax, 0, bx2, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(0.3, 'rgba(255,255,255,0.26)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.04)'); g.addColorStop(1, 'rgba(16,42,67,0.10)');
    ctx.fillStyle = g; ctx.fill();
    g = ctx.createLinearGradient(0, ay, 0, by); g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(1, 'rgba(16,42,67,0.08)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(16,42,67,0.45)'; ctx.lineWidth = 1; ctx.stroke();
    rrect(ctx, ax + 3.5, ay + 3.5, bx2 - ax - 7, by - ay - 7, 2); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.stroke();
  }

  function drawBoard(ctx, b, j, st) {
    var hotSide = j === 1 ? 1 : j === 2 ? -1 : 0;   // side facing cell 3
    var g = hotSide ? st.board : 0;
    // (the board's right face is always hidden behind the next cell, so it is not drawn)
    poly(ctx, [P(b.x0, H, 0), P(b.x1, H, 0), P(b.x1, H, D), P(b.x0, H, D)]);
    ctx.fillStyle = '#E1F2F8'; ctx.fill(); ctx.strokeStyle = AERO_EDGE; ctx.lineWidth = 1.4; ctx.stroke();
    var A = P(b.x0, H, 0), B = P(b.x1, 0, 0), ax = A[0], ay = A[1], bx = B[0], by = B[1];
    var gr = ctx.createLinearGradient(ax, 0, bx, 0);
    var cool = [204, 234, 244], hot = [240, 132, 54];
    [[0, 1], [0.3, 0.95], [0.44, 0.2], [0.52, 0], [1, 0]].forEach(function (uw) {
      gr.addColorStop(hotSide === 1 ? 1 - uw[0] : uw[0], rgba(mixRgb(cool, hot, uw[1] * g)));
    });
    ctx.beginPath(); ctx.rect(ax, ay, bx - ax, by - ay); ctx.fillStyle = gr; ctx.fill();
    // frosted sheen down the cool side
    var sx = hotSide === 1 ? ax + (bx - ax) * 0.28 : ax + (bx - ax) * 0.72;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(sx, ay + 6); ctx.lineTo(sx, by - 6); ctx.stroke();
    ctx.beginPath(); ctx.rect(ax, ay, bx - ax, by - ay); ctx.strokeStyle = AERO_EDGE; ctx.lineWidth = 1.6; ctx.stroke();
  }

  // A bright band marks the heat front: through the neighbors without Aerotherm, up to the boards with it.
  function frontBand(ctx, st) {
    var F = frontPos(st.f, st.v);
    if (F <= 4 || F >= 203 || (st.v === 'with' && F >= 35)) return;
    // 'screen' only lightens: a warm band over blue turns light, not gray as plain alpha blending would
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    [-1, 1].forEach(function (s) {
      var p = P(XC + s * F, H, 0), px = p[0], py0 = p[1], py1 = P(XC + s * F, 0, 0)[1], w = 20 * S, x0 = px - s * w;
      var g = ctx.createLinearGradient(x0, 0, px, 0);
      g.addColorStop(0, 'rgba(255,200,120,0)'); g.addColorStop(0.75, 'rgba(255,196,110,0.32)'); g.addColorStop(1, 'rgba(255,236,190,0.6)');
      ctx.fillStyle = g; ctx.fillRect(Math.min(x0, px), py0, w, py1 - py0);
    });
    ctx.restore();
  }

  // With Aerotherm: everything except cell 3, its two boards and the heat fades back.
  function dimVeil(ctx, st) {
    if (st.dim <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, CW, CH);
    [silhouette(cells[2].x0, cells[2].x1, H + 12), silhouette(boards[1].x0, boards[1].x1), silhouette(boards[2].x0, boards[2].x1)].forEach(function (pts) {
      pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
    });
    ctx.clip('evenodd');
    ctx.fillStyle = 'rgba(246,249,251,' + (0.45 * st.dim) + ')'; ctx.fillRect(0, 0, CW, CH); ctx.restore();
  }

  // With Aerotherm: the heat front flattens against each board and spreads along its hot face.
  function impact(ctx, st) {
    if (st.v !== 'with' || st.impact <= 0) return;
    var I = st.board, half = 5 + st.impact * 16, full = ramp(st.f, 30, 34);
    [-1, 1].forEach(function (s) {
      var x = XC + s * 35;
      var segs = ROWS.map(function (y) { return [y - half, y + half]; });
      var lo = ROWS[0] - half + (10 - (ROWS[0] - half)) * full, hi = ROWS[5] + half + (H - 10 - ROWS[5] - half) * full;
      if (full > 0) segs = [[lo, hi]];
      var hx = P(x, 0, 0)[0], inward = -s;
      segs.forEach(function (seg) {
        var sy0 = P(x, seg[1], 0)[1], sy1 = P(x, seg[0], 0)[1], w = 9 * S;
        var g = ctx.createLinearGradient(hx, 0, hx + inward * w, 0);
        g.addColorStop(0, 'rgba(255,170,90,' + (0.55 * I) + ')'); g.addColorStop(1, 'rgba(255,170,90,0)');
        ctx.fillStyle = g; ctx.fillRect(Math.min(hx, hx + inward * w), sy0, w, sy1 - sy0);
        ctx.save(); ctx.shadowColor = 'rgba(238,116,44,0.95)'; ctx.shadowBlur = glow(12 * I, st.px);
        ctx.strokeStyle = 'rgba(255,222,160,' + I + ')'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(hx, sy0); ctx.lineTo(hx, sy1); ctx.stroke(); ctx.restore();
      });
      // the same hot line runs back along the top edge of the board: it covers the whole broad face
      var a = P(x, H, 0), b = P(x, H, D);
      ctx.save(); ctx.shadowColor = 'rgba(238,116,44,0.9)'; ctx.shadowBlur = glow(8 * I, st.px);
      ctx.strokeStyle = 'rgba(240,132,54,' + (0.9 * I * full) + ')'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
    });
  }

  function wave(ctx, s, y, d0, d1, head, alpha) {
    var pts = [];
    for (var d = d0; d <= d1 + 1e-6; d += 0.8) pts.push(P(XC + s * d, y + 4.2 * Math.sin(2 * Math.PI * (head - d) / 14), 0));
    if (pts.length < 2) return;
    var x0 = pts[0][0], x1 = pts[pts.length - 1][0];
    var mk = function (rgb, a) { var g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba(rgb, 0)); g.addColorStop(0.4, rgba(rgb, 0.45 * a)); g.addColorStop(1, rgba(rgb, a)); return g; };
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.strokeStyle = mk([238, 116, 44], 0.65 * alpha); ctx.lineWidth = 5.6; ctx.stroke();
    ctx.strokeStyle = mk([255, 232, 182], alpha); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.restore();
  }

  function sparks(ctx, s, y, age, alpha) {
    var a = (1 - age / 5) * alpha; if (a <= 0) return;
    var x = XC + s * 35;
    ctx.save(); ctx.strokeStyle = 'rgba(255,190,120,' + a + ')'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    [-1, 1].forEach(function (dy) {
      var r0 = 3 + age * 3.2, r1 = r0 + 5, ang = 0.75;
      var p0 = P(x - s * r0 * Math.cos(ang), y + dy * r0 * Math.sin(ang), 0), p1 = P(x - s * r1 * Math.cos(ang), y + dy * r1 * Math.sin(ang), 0);
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    });
    ctx.restore();
  }

  // Infrared rays leave cell 3 sideways. With Aerotherm they stop dead at the boards and scatter back.
  function rays(ctx, st) {
    var w = st.v === 'with', v = w ? 5 : 11, L = 36, f = st.f;
    var limit = w ? 35 : Math.max(35, Math.min(203, frontPos(f, 'without'))), emitEnd = w ? 46 : 60;
    if (f < 21) return;
    ROWS.forEach(function (y, r) {
      [-1, 1].forEach(function (s) {
        var stagger = ((r * 3) % 7) * 0.9 + (s > 0 ? 0 : 3.5);
        for (var f0 = 20 + stagger; f0 <= emitEnd; f0 += 7) {
          var age = f - f0; if (age < 0) continue;
          var ea = ramp(f0, 19, 26);
          if (w) { var sa = f - (f0 + limit / v); if (sa >= 0 && sa < 5) sparks(ctx, s, y, sa, ea); }
          var head = v * age, d0 = Math.max(0, head - L), d1 = Math.min(head, limit);
          if (d1 <= d0 + 0.5) continue;
          var a = ea;
          if (!w) a *= clamp((limit - d1) / 12 + 0.35);
          wave(ctx, s, y, d0, d1, head, a);
        }
      });
    });
  }

  function vent(ctx, st) {
    if (st.vent <= 0) return;
    var b = P(XC, H + 10, D * 0.5), bx = b[0], by = b[1];
    ctx.save(); ctx.lineCap = 'round';
    var g = ctx.createLinearGradient(0, by, 0, by - 46);
    g.addColorStop(0, 'rgba(120,140,158,' + (0.55 * st.vent) + ')'); g.addColorStop(1, 'rgba(120,140,158,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 1.6;
    for (var k = 0; k < 3; k++) {
      ctx.beginPath();
      for (var t = 0; t <= 1.0001; t += 0.04) {
        var x = bx + (k - 1) * 9 + 3.5 * Math.sin(t * 9 - st.f * 0.55 + k * 2) * t, yy = by - t * 46;
        if (t === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function outline(ctx, st) {
    var p = st.pulse; if (p <= 0) return;
    [1, 2].forEach(function (j) {
      var b = boards[j];
      ctx.save(); poly(ctx, silhouette(b.x0, b.x1)); ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(67,140,203,' + (0.3 * p) + ')'; ctx.lineWidth = 2 + 9 * clamp((st.f - 27) / 11); ctx.stroke();
      ctx.shadowColor = 'rgba(67,140,203,0.8)'; ctx.shadowBlur = glow(10 * p, st.px);
      ctx.strokeStyle = 'rgba(67,140,203,' + p + ')'; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.restore();
    });
  }

  // Number-free gauges above each cell.
  function gauges(ctx, st) {
    cells.forEach(function (c, i) {
      var cx = P((c.x0 + c.x1) / 2, H, D * 0.5)[0], x = cx - 6, y = 18, w = 12, h = 42;
      var sum = 0; for (var k = 0; k <= 10; k++) sum += heatAt(c.x0 + k / 10 * T, st);
      var e = i === 2 ? st.ember : 0, heat = sum / 11, level = Math.max(0.14, heat * (1 - 0.12 * e));
      rrect(ctx, x, y, w, h, 6); ctx.fillStyle = '#E7EEF3'; ctx.fill(); ctx.strokeStyle = '#C9D7E1'; ctx.lineWidth = 1; ctx.stroke();
      var fh = (h - 4) * level;
      // below the glow point the fill stays blue, so a cool gauge never reads as warm
      rrect(ctx, x + 2, y + h - 2 - fh, w - 4, fh, 4); ctx.fillStyle = rgba(heat < 0.16 ? BLUE_RGB : heatRgb(heat, e)); ctx.fill();
    });
  }

  // ---------- playback clock: 50 ms per frame, frame 60 held for an extra 1.5 s ----------
  var FRAME_MS = 50, HOLD_FRAME = 60, HOLD_MS = 1500, LAST_FRAME = 64;
  var T_HOLD = (HOLD_FRAME - 1) * FRAME_MS;                            // 2950 ms: frame 60 is reached
  var T_RESUME = T_HOLD + HOLD_MS;                                     // 4450 ms: the fade-out begins
  var CYCLE_MS = T_RESUME + (LAST_FRAME + 1 - HOLD_FRAME) * FRAME_MS;  // 4700 ms, as in the GIFs

  // Elapsed milliseconds -> fractional frame in [1, 65).
  function frameAt(ms) {
    var t = ((ms % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
    if (t < T_HOLD) return 1 + t / FRAME_MS;
    if (t < T_RESUME) return HOLD_FRAME;
    return HOLD_FRAME + (t - T_RESUME) / FRAME_MS;
  }
  // Frame -> elapsed milliseconds (frame 60 maps to the start of its hold).
  function timeAt(frame) {
    var f = clamp(frame, 1, LAST_FRAME + 1);
    return f <= HOLD_FRAME ? (f - 1) * FRAME_MS : T_RESUME + (f - HOLD_FRAME) * FRAME_MS;
  }

  /**
   * Creates a renderer bound to a canvas.
   * options.view: {x, y, w, h} in scene units (default: the whole 1200 x 675 scene).
   * Returns { resize(), draw(variant, frame) }.
   */
  function createRenderer(canvas, options) {
    var view = (options && options.view) || { x: 0, y: 0, w: CW, h: CH };
    var ctx = canvas.getContext('2d');
    var px = 1, base = null;

    // Match the bitmap to the canvas's CSS size and the device pixel ratio.
    function resize() {
      var cssW = canvas.clientWidth;
      if (!cssW) return false;
      var dpr = Math.min(global.devicePixelRatio || 1, 3);
      var w = Math.max(1, Math.round(cssW * dpr)), h = Math.max(1, Math.round(w * view.h / view.w));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; base = null; }
      px = canvas.width / view.w;
      return true;
    }

    function setView(c) { c.setTransform(px, 0, 0, px, -view.x * px, -view.y * px); }

    // The background, ground shadow and base plate never change: draw them once per size.
    function baseLayer() {
      if (base) return base;
      base = document.createElement('canvas');
      base.width = canvas.width; base.height = canvas.height;
      var b = base.getContext('2d');
      b.fillStyle = BG; b.fillRect(0, 0, base.width, base.height);
      setView(b);
      drawBase(b, px);
      return base;
    }

    function draw(v, f) {
      var layer = baseLayer();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(layer, 0, 0);
      setView(ctx);
      var st = state(v, f); st.px = px;
      cells.forEach(function (c, i) { drawCell(ctx, c, st); if (i < N - 1 && v === 'with') drawBoard(ctx, boards[i], i, st); });
      frontBand(ctx, st);
      dimVeil(ctx, st);
      impact(ctx, st);
      rays(ctx, st);
      vent(ctx, st);
      outline(ctx, st);
      gauges(ctx, st);
      if (st.fade > 0) { ctx.fillStyle = 'rgba(246,249,251,' + st.fade + ')'; ctx.fillRect(0, 0, CW, CH); }
    }

    return { resize: resize, draw: draw };
  }

  global.AerothermPropagation = {
    createRenderer: createRenderer,
    frameAt: frameAt,
    timeAt: timeAt,
    CYCLE_MS: CYCLE_MS,
    FIRST_FRAME: 1,
    LAST_FRAME: LAST_FRAME,
    SCENE: { w: CW, h: CH }
  };
})(window);
