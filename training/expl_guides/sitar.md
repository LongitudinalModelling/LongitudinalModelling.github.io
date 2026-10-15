---
layout: default
title: "SITAR"
permalink: /training/expl_guides/sitar/
background: /assets/images/backgrounds/training_page.jpg
---

**SITAR** (SuperImposition by Translation And Rotation) is a growth curve model that summarises a whole population of growth trajectories with a single **mean curve**, and describes each individual with just three parameters that transform that curve: **size** shifts it up or down, **timing** shifts it earlier or later, and **intensity** stretches or compresses its timescale. Fitted as a nonlinear mixed effects model, SITAR can explain up to 99% of the variance in pubertal growth. An extension, [**SITAR-d**](https://doi.org/10.1080/03014460.2026.2627918), adds a fourth random effect, **post-growth**, that adds a straight-line slope in age to the curve, allowing post-pubertal velocity to vary between individuals.

## See how it works

Watch how each of the four SITAR random effects transforms the population mean growth curve (dark). Then use the sliders to build your own individual's curve.

<div id="sitar-playground" class="sitar-playground">
  <canvas height="280" aria-hidden="true"></canvas>
  <p class="visually-hidden">Interactive chart: a mean growth curve with a pubertal spurt. The size, timing, intensity and post-growth sliders below transform it into an individual's growth curve.</p>

  <p id="sitar-caption" class="sitar-caption">The mean growth curve for the population.</p>

  <div class="sitar-legend" aria-hidden="true">
    <span class="sitar-legend-item"><span class="sitar-swatch sitar-swatch-size"></span> Size (α)</span>
    <span class="sitar-legend-item"><span class="sitar-swatch sitar-swatch-tempo"></span> Timing (β)</span>
    <span class="sitar-legend-item"><span class="sitar-swatch sitar-swatch-intensity"></span> Intensity (γ)</span>
    <span class="sitar-legend-item"><span class="sitar-swatch sitar-swatch-postgrowth"></span> Post-growth (δ)</span>
  </div>

  <div class="sitar-controls">
    <div class="sitar-control sitar-control-size">
      <label for="sitar-size">Size <span class="sitar-hint">(α — up / down)</span></label>
      <input type="range" id="sitar-size" min="-0.25" max="0.25" step="0.01" value="0">
      <output id="sitar-size-value" for="sitar-size">+0.00</output>
    </div>
    <div class="sitar-control sitar-control-tempo">
      <label for="sitar-tempo">Timing <span class="sitar-hint">(β — earlier / later)</span></label>
      <input type="range" id="sitar-tempo" min="-0.15" max="0.15" step="0.01" value="0">
      <output id="sitar-tempo-value" for="sitar-tempo">+0.00</output>
    </div>
    <div class="sitar-control sitar-control-intensity">
      <label for="sitar-intensity">Intensity <span class="sitar-hint">(γ — faster / slower)</span></label>
      <input type="range" id="sitar-intensity" min="-0.5" max="0.5" step="0.01" value="0">
      <output id="sitar-intensity-value" for="sitar-intensity">+0.00</output>
    </div>
    <div class="sitar-control sitar-control-postgrowth">
      <label for="sitar-postgrowth">Post-growth <span class="sitar-hint">(δ — more / less)</span></label>
      <input type="range" id="sitar-postgrowth" min="-0.3" max="0.3" step="0.01" value="0">
      <output id="sitar-postgrowth-value" for="sitar-postgrowth">+0.00</output>
    </div>
    <div class="sitar-buttons">
      <button type="button" id="sitar-replay" class="btn btn-sm sitar-replay-button">↻ Replay</button>
      <button type="button" id="sitar-reset" class="btn btn-sm sitar-reset-button">Reset</button>
      <button type="button" id="sitar-pause" class="btn btn-sm sitar-pause-button" disabled>❚❚ Pause</button>
    </div>
  </div>

</div>

<script defer src="{{ '/assets/theme/js/sitar-playground.js' | relative_url }}"></script>

## Learn more

The full explanatory guide is in preparation. In the meantime, see the [sitar R package](https://cran.r-project.org/web/packages/sitar/vignettes/Fitting_models_with_SITAR.html) and our [software page](/software/) for tools to fit SITAR models to your own data.
