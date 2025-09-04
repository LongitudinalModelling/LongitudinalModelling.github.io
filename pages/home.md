---
layout: home
title: Welcome to the Longitudinal Modelling Group Website
background: /assets/images/backgrounds/home_page.jpg
permalink: /
---

<h2 class="text-center mt-2 mb-5">We develop, apply, and teach cutting-edge statistical methods for repeated measures analysis to advance science and improve life course health</h2>

<div class="card-deck">
  <div class="card text-white card-bg-1">
    <a href="{{ site.baseurl }}/research/" class="card-link">
      <div class="card-body text-center d-flex flex-column justify-content-center">
        <i class="fas fa-microscope fa-3x mb-3" aria-hidden="true"></i>
        <h5 class="card-title fw-bold">RESEARCH</h5>
        <p class="card-text fw-bold">Learn more about our research</p>
      </div>
    </a>
  </div>
  <div class="card text-white card-bg-2">
    <a href="{{ site.baseurl }}/publications/" class="card-link">
      <div class="card-body text-center d-flex flex-column justify-content-center">
        <i class="fas fa-file-alt fa-3x mb-3" aria-hidden="true"></i>
        <h5 class="card-title fw-bold">PUBLICATIONS</h5>
        <p class="card-text fw-bold">Browse our featured methodological and applied research papers</p>
      </div>
    </a>
  </div>
  <div class="card text-white card-bg-3">
    <a href="{{ site.baseurl }}/software/" class="card-link">
      <div class="card-body text-center d-flex flex-column justify-content-center">
        <i class="fas fa-tools fa-3x mb-3" aria-hidden="true"></i>
        <h5 class="card-title fw-bold">SOFTWARE</h5>
        <p class="card-text fw-bold">Explore our analysis tools</p>
      </div>
    </a>
  </div>
  <div class="card text-white card-bg-4">
    <a href="{{ site.baseurl }}/seminars/" class="card-link">
      <div class="card-body text-center d-flex flex-column justify-content-center">
        <i class="fas fa-chalkboard-teacher fa-3x mb-3" aria-hidden="true"></i>
        <h5 class="card-title fw-bold">SEMINARS</h5>
        <p class="card-text fw-bold">View our schedule of upcoming talks and past recordings</p>
      </div>
    </a>
  </div>
  <div class="card text-white card-bg-5">
    <a href="{{ site.baseurl }}/training/" class="card-link">
      <div class="card-body text-center d-flex flex-column justify-content-center">
        <i class="fas fa-graduation-cap fa-3x mb-3" aria-hidden="true"></i>
        <h5 class="card-title fw-bold">TRAINING</h5>
        <p class="card-text fw-bold">Find out about our courses and access training resources</p>
      </div>
    </a>
  </div>
</div>

<hr class="purple-line">

<h3 class="text-center mt-3 mb-4">Our group at the University of Bristol includes epidemiologists, statisticians, and clinicians; we collaborate with a global network of researchers</h3>

<div class="row">
  <div class="col-md-6 mb-1">
    <div class="card text-white bg-dark team-card">
      <a href="{{ site.baseurl }}/people/" class="card-link">
        <div class="card-body text-center d-flex flex-column justify-content-center">
          <h5 class="card-title fw-bold">GROUP MEMBERS</h5>
        </div>
      </a>
    </div>
  </div>
  <div class="col-md-6 mb-1">
    <div class="card text-white bg-dark partners-card">
      <a href="{{ site.baseurl }}/contact/" class="card-link">
        <div class="card-body text-center d-flex flex-column justify-content-center">
          <h5 class="card-title fw-bold">JOIN / COLLABORATE</h5>
        </div>
      </a>
    </div>
  </div>
</div>

<hr class="purple-line">

<h2 class="home-section-heading mt-4 mb-3">LATEST NEWS</h2>

{% if site.posts_on_home > 0 %}
  <div class="row cards">
    {% for item in site.posts limit:site.posts_on_home %}
      <div class="col-md-6">
        {% include card.html %}
      </div>
    {% endfor %}
  </div>
{% endif %}

<div style="height: 50px;"></div> <img src="{{ site.url }}{{ site.baseurl }}/assets/images/lmg_logo.jpg" alt="LML Group Logo" style="width: 400px; display: block; margin: 0 auto;">
