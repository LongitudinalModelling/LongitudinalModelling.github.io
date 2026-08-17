(function () {
  'use strict';

  // Chart geometry as fractions of canvas size
  var X_LEFT = 0.08;
  var X_RIGHT = 0.97;
  var Y_BASE = 0.90; // x-axis (curve value 0)
  var Y_TOP = 0.06;  // top of plot (curve value V_MAX)
  var V_MAX = 1.2;   // headroom above the mean
  var STEPS = 160;

  var MEAN = '#584B3D';
  var SIZE = '#FF0000';      // alpha
  var TEMPO = '#0070C0';     // beta
  var INTENSITY = '#00B050'; // gamma
  var AXIS_GRAY = '#6c757d';

  var MEAN_DRAW_MS = 1050;
  var SLIDE_MS = 1050;
  var HOLD_MS = 850;
  var RETRACT_MS = 700;
  var EFFECT_MS = 2 * SLIDE_MS + HOLD_MS + RETRACT_MS;

  // Deviation magnitudes for the demo pairs
  var SIZE_DELTA = 0.16;
  var TEMPO_DELTA = 0.13;
  var INTENSITY_FAST = 0.65; // < 1 = faster spurt
  var INTENSITY_SLOW = 1.5;  // > 1 = slower spurt

  var SPURT_CENTRE = 0.55;
  var SPURT_WIDTH = 0.10;
  function rawCurve(t) {
    return 0.6 * (1 - Math.exp(-3 * t)) + 0.55 / (1 + Math.exp(-(t - SPURT_CENTRE) / SPURT_WIDTH));
  }
  var RAW0 = rawCurve(0);
  var RAW1 = rawCurve(1);
  function meanCurve(t) {
    return (rawCurve(t) - RAW0) / (RAW1 - RAW0);
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function init() {
    var root = document.getElementById('sitar-playground');
    if (!root) return;
    var canvas = root.querySelector('canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    var sliders = {
      size: root.querySelector('#sitar-size'),
      tempo: root.querySelector('#sitar-tempo'),
      intensity: root.querySelector('#sitar-intensity')
    };
    var readouts = {
      size: root.querySelector('#sitar-size-value'),
      tempo: root.querySelector('#sitar-tempo-value'),
      intensity: root.querySelector('#sitar-intensity-value')
    };
    var caption = root.querySelector('#sitar-caption');
    var resetButton = root.querySelector('#sitar-reset');
    var replayButton = root.querySelector('#sitar-replay');
    var defaults = {
      size: parseFloat(sliders.size.defaultValue),
      tempo: parseFloat(sliders.tempo.defaultValue),
      intensity: parseFloat(sliders.intensity.defaultValue)
    };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var width = 0;
    var height = 0;
    var resizeTimer = null;
    var mode = 'guided';      // 'guided' | 'interactive'
    var activeParam = 'size';
    var animId = null;

    function sizeCanvas() {
      var dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function toX(t) {
      return width * (X_LEFT + (X_RIGHT - X_LEFT) * t);
    }

    function toY(v) {
      return height * (Y_BASE - (Y_BASE - Y_TOP) * (v / V_MAX));
    }

    function withPlotClip(fn) {
      var top = height * Y_TOP;
      var bottom = height * Y_BASE;
      ctx.save();
      ctx.beginPath();
      ctx.rect(toX(0), top, toX(1) - toX(0), bottom - top);
      ctx.clip();
      fn();
      ctx.restore();
    }

    function drawAxes() {
      var x0 = toX(0);
      var x1 = toX(1);
      var yBase = height * Y_BASE;
      var yTop = height * Y_TOP;

      ctx.strokeStyle = AXIS_GRAY;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x0, yTop);
      ctx.lineTo(x0, yBase);
      ctx.lineTo(x1, yBase);
      ctx.stroke();

      ctx.fillStyle = AXIS_GRAY;
      ctx.font = '13px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Age', (x0 + x1) / 2, yBase + 24);
      ctx.save();
      ctx.translate(x0 - 26, (yBase + yTop) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Height', 0, 0);
      ctx.restore();
    }

    function drawCurve(point, color, lineWidth, alpha, portion) {
      var last = portion == null ? STEPS : Math.floor(STEPS * portion);
      if (last < 1) return;
      withPlotClip(function () {
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.beginPath();
        for (var s = 0; s <= last; s++) {
          var p = point(s / STEPS);
          var x = toX(p[0]);
          var y = toY(p[1]);
          if (s === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      });
    }

    // SITAR transforms: k interpolates from the mean (k=0) to full deviation (k=1)
    function meanPoint(u) {
      return [u, meanCurve(u)];
    }
    function sizeCurve(sign, k) {
      if (k == null) k = 1;
      var shift = sign * SIZE_DELTA * k;
      return function (u) { return [u, meanCurve(u) + shift]; };
    }
    function tempoCurve(sign, k) {
      if (k == null) k = 1;
      var shift = sign * TEMPO_DELTA * k;
      return function (u) { return [u + shift, meanCurve(u)]; };
    }
    function intensityCurve(sign, k) {
      if (k == null) k = 1;
      var full = sign > 0 ? INTENSITY_FAST : INTENSITY_SLOW;
      var scale = 1 + (full - 1) * k;
      return function (u) { return [u, meanCurve(SPURT_CENTRE + (u - SPURT_CENTRE) / scale)]; };
    }

    function drawMean(portion) {
      drawCurve(meanPoint, MEAN, 4.5, 1, portion);
    }
    function drawPair(makeCurve, color, alpha) {
      drawCurve(makeCurve(1), color, 3, alpha);
      drawCurve(makeCurve(-1), color, 3, alpha);
    }

    function currentParams() {
      return {
        size: parseFloat(sliders.size.value),
        tempo: parseFloat(sliders.tempo.value),
        intensity: parseFloat(sliders.intensity.value)
      };
    }

    function fmt(v) {
      return (v >= 0 ? '+' : '') + v.toFixed(2);
    }
    function updateReadouts(p) {
      readouts.size.textContent = fmt(p.size);
      readouts.tempo.textContent = fmt(p.tempo);
      readouts.intensity.textContent = fmt(p.intensity);
    }

    function individualCurve(p) {
      var scale = Math.exp(-p.intensity);
      return function (u) {
        var v = p.size + meanCurve(SPURT_CENTRE + (u - SPURT_CENTRE) / scale);
        return [u + p.tempo, v];
      };
    }

    var PARAM_COLORS = { size: SIZE, tempo: TEMPO, intensity: INTENSITY };

    function setCaption(text) {
      if (caption) caption.textContent = text;
    }

    function drawInteractive() {
      var p = currentParams();
      updateReadouts(p);
      ctx.clearRect(0, 0, width, height);
      drawAxes();
      drawMean();
      drawCurve(individualCurve(p), PARAM_COLORS[activeParam], 3.75, 1);
    }

    // Guided animation
    var demoSteps = [
      { make: sizeCurve, color: SIZE, caption: 'Size (α): taller or shorter than peers — the same curve shifted up or down.' },
      { make: tempoCurve, color: TEMPO, caption: 'Timing (β): earlier or later than peers — the same curve shifted along the age axis.' },
      { make: intensityCurve, color: INTENSITY, caption: 'Intensity (γ): a faster or slower spurt — the age scale stretched or compressed.' }
    ];

    function drawGuidedStatic() {
      ctx.clearRect(0, 0, width, height);
      drawAxes();
      drawMean();
      demoSteps.forEach(function (step) { drawPair(step.make, step.color, 0.9); });
    }

    function effectPhase(localT) {
      if (localT < SLIDE_MS) {
        return { k1: easeInOut(localT / SLIDE_MS), k2: 0, show2: false };
      }
      if (localT < 2 * SLIDE_MS) {
        return { k1: 1, k2: easeInOut((localT - SLIDE_MS) / SLIDE_MS), show2: true };
      }
      if (localT < 2 * SLIDE_MS + HOLD_MS) {
        return { k1: 1, k2: 1, show2: true };
      }
      var r = easeInOut((localT - 2 * SLIDE_MS - HOLD_MS) / RETRACT_MS);
      return { k1: 1 - r, k2: 1 - r, show2: true };
    }

    function runGuided() {
      if (animId) cancelAnimationFrame(animId);
      updateReadouts(currentParams());

      if (reduceMotion) {
        drawGuidedStatic();
        setCaption('Size (α, red), timing (β, blue) and intensity (γ, green) each transform the mean growth curve. Use the sliders to explore.');
        return;
      }

      var start = null;
      setCaption('The mean growth curve for the population.');

      function frame(now) {
        if (start === null) start = now;
        var elapsed = now - start;
        ctx.clearRect(0, 0, width, height);
        drawAxes();

        if (elapsed < MEAN_DRAW_MS) {
          drawMean(easeInOut(elapsed / MEAN_DRAW_MS));
          animId = requestAnimationFrame(frame);
          return;
        }
        drawMean();

        var te = elapsed - MEAN_DRAW_MS;
        var idx = Math.floor(te / EFFECT_MS);
        if (idx < demoSteps.length) {
          var step = demoSteps[idx];
          var ph = effectPhase(te - idx * EFFECT_MS);
          drawCurve(step.make(1, ph.k1), step.color, 3, 0.95);
          if (ph.show2) drawCurve(step.make(-1, ph.k2), step.color, 3, 0.95);
          setCaption(step.caption);
          animId = requestAnimationFrame(frame);
        } else {
          setCaption('Now try the sliders below to build your own individual’s growth curve.');
          animId = null;
        }
      }
      animId = requestAnimationFrame(frame);
    }

    function enterInteractive() {
      mode = 'interactive';
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      drawInteractive();
    }

    function replay() {
      mode = 'guided';
      runGuided();
    }

    // Wiring
    Object.keys(sliders).forEach(function (key) {
      sliders[key].addEventListener('input', function () {
        activeParam = key;
        if (mode !== 'interactive') enterInteractive();
        else drawInteractive();
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        Object.keys(sliders).forEach(function (key) { sliders[key].value = defaults[key]; });
        if (mode === 'interactive') drawInteractive();
      });
    }
    if (replayButton) {
      replayButton.addEventListener('click', replay);
    }

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        sizeCanvas();
        if (mode === 'interactive') { drawInteractive(); }
        else if (reduceMotion) { drawGuidedStatic(); }
        else { ctx.clearRect(0, 0, width, height); drawAxes(); drawMean(); }
      }, 200);
    });

    sizeCanvas();

    if ('IntersectionObserver' in window && !reduceMotion) {
      drawAxes();
      drawMean();
      var started = false;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started && mode === 'guided') {
            started = true;
            runGuided();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      observer.observe(canvas);
    } else {
      runGuided();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
