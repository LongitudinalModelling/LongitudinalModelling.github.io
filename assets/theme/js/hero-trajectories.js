/*
 * Animated growth-trajectory banner for the homepage header.
 * Draws a chart frame (x/y axes with ticks), then a family of SITAR-style
 * growth curves (a shared mean curve, with per-individual shifts in size,
 * timing, and velocity). Animates once over ~4s, then stops.
 */
(function () {
  'use strict';

  var DURATION = 4000;
  var AXIS_DURATION = 500;
  var N_CURVES = 18;
  var SEED = 20250901;

  // Curve/axis geometry as fractions of canvas size
  var X_LEFT = 0.02;
  var X_RIGHT = 0.98;
  var Y_BASE = 0.90;  // x-axis position
  var Y_TOP = 0.08;   // top of y-axis

  // Pastel strokes that read on the purple gradient; white/lavender are
  // repeated to weight the palette toward cohesion over rainbow
  var PALETTE = [
    [255, 255, 255], [255, 255, 255], [255, 255, 255],
    [216, 180, 226], [216, 180, 226], [216, 180, 226],
    [244, 164, 222], [244, 164, 222],
    [255, 209, 102],
    [127, 216, 190],
    [155, 209, 255]
  ];

  // Deterministic RNG (mulberry32) so the banner looks identical on every visit
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Mean growth curve on t in [0,1]: rapid early growth that decelerates,
  // plus a logistic "pubertal" spurt. Returns a value in roughly [0,1].
  function meanCurve(t) {
    var infancy = 1 - Math.exp(-3.2 * t);
    var spurt = 0.25 / (1 + Math.exp(-12 * (t - 0.62)));
    return 0.62 * infancy + spurt;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function init() {
    var canvas = document.getElementById('hero-trajectories');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var header = canvas.parentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var curves = [];
    var width = 0;
    var height = 0;
    var startTime = null;
    var finished = false;
    var resizeTimer = null;

    function buildCurves() {
      var rand = mulberry32(SEED);
      curves = [];
      for (var i = 0; i < N_CURVES; i++) {
        // SITAR-style individual effects: size (vertical), tempo (horizontal), velocity (scale)
        var size = (rand() - 0.5) * 0.34;
        var tempo = (rand() - 0.5) * 0.16;
        var velocity = 0.82 + rand() * 0.42;
        var alpha = 0.35 + rand() * 0.30;
        var color = PALETTE[Math.floor(rand() * PALETTE.length)];
        var points = [];
        var steps = 90;
        for (var s = 0; s <= steps; s++) {
          var t = s / steps;
          var y = meanCurve(Math.min(1, Math.max(0, t * velocity + tempo))) + size;
          // Keep every point above the x-axis baseline
          y = Math.max(0.02, y);
          points.push({
            x: width * (X_LEFT + (X_RIGHT - X_LEFT) * t),
            y: height * (0.86 - 0.68 * y)
          });
        }
        curves.push({
          points: points,
          color: color,
          alpha: alpha,
          lineWidth: 1.75 + rand() * 1.25,
          delay: AXIS_DURATION - 100 + i * 90, // curves start as the axes finish
          hasDots: rand() < 0.4,
          dotEvery: 12 + Math.floor(rand() * 8)
        });
      }
    }

    function sizeCanvas() {
      var dpr = window.devicePixelRatio || 1;
      width = header.clientWidth;
      height = header.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawAxes(local) {
      var x0 = width * X_LEFT;
      var x1 = width * X_RIGHT;
      var yBase = height * Y_BASE;
      var yTop = height * Y_TOP;
      var n, i, pos;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // y-axis grows upward from the origin
      ctx.beginPath();
      ctx.moveTo(x0, yBase);
      ctx.lineTo(x0, yBase - (yBase - yTop) * local);
      ctx.stroke();

      // x-axis grows rightward from the origin
      ctx.beginPath();
      ctx.moveTo(x0, yBase);
      ctx.lineTo(x0 + (x1 - x0) * local, yBase);
      ctx.stroke();

      // Tick marks fade in with the axes
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + 0.55 * local + ')';
      n = 6;
      for (i = 1; i <= n; i++) {
        pos = x0 + ((x1 - x0) * i) / n;
        ctx.beginPath();
        ctx.moveTo(pos, yBase);
        ctx.lineTo(pos, yBase + 5);
        ctx.stroke();

        pos = yBase - ((yBase - yTop) * i) / n;
        ctx.beginPath();
        ctx.moveTo(x0, pos);
        ctx.lineTo(x0 - 5, pos);
        ctx.stroke();
      }
    }

    // Draw axes, then each curve up to `progress` (0..1), staggered per curve
    function draw(progress) {
      ctx.clearRect(0, 0, width, height);

      var axisLocal = progress >= 1 ? 1 : Math.min(1, (progress * DURATION) / AXIS_DURATION);
      drawAxes(easeInOut(axisLocal));

      curves.forEach(function (curve) {
        var local = progress;
        if (progress < 1) {
          local = Math.min(1, Math.max(0, (progress * DURATION - curve.delay) / (DURATION - curve.delay)));
          local = easeInOut(local);
        }
        var visible = Math.floor(local * (curve.points.length - 1));
        if (visible < 1) return;

        var rgb = curve.color[0] + ', ' + curve.color[1] + ', ' + curve.color[2];

        ctx.beginPath();
        ctx.moveTo(curve.points[0].x, curve.points[0].y);
        for (var p = 1; p <= visible; p++) {
          ctx.lineTo(curve.points[p].x, curve.points[p].y);
        }
        ctx.strokeStyle = 'rgba(' + rgb + ', ' + curve.alpha + ')';
        ctx.lineWidth = curve.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        if (curve.hasDots) {
          ctx.fillStyle = 'rgba(' + rgb + ', ' + Math.min(1, curve.alpha + 0.15) + ')';
          for (var d = 0; d <= visible; d += curve.dotEvery) {
            ctx.beginPath();
            ctx.arc(curve.points[d].x, curve.points[d].y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }

    function frame(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min(1, (now - startTime) / DURATION);
      draw(progress);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        finished = true;
      }
    }

    function start() {
      sizeCanvas();
      buildCurves();
      if (reduceMotion) {
        finished = true;
        draw(1);
      } else {
        startTime = null;
        requestAnimationFrame(frame);
      }
    }

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        sizeCanvas();
        buildCurves();
        if (finished) draw(1); // animation already played; just redraw static
      }, 200);
    });

    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
