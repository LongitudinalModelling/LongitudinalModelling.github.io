---
title: "Software"
background: /assets/images/backgrounds/software_page.jpg
permalink: /software/
---

<div class="software-grid">
  {% for software in site.data.software %}
  <div class="software-item">
    <div class="software-image">
      {% if software.image %}
      <img src="{{ site.url }}{{ site.baseurl }}/assets/images/software/{{ software.image }}" alt="{{ software.name }} Logo">
      {% endif %}
    </div>
    <hr class="purple-line-small">
    <h3 class="software-name">{{ software.name }}</h3>

    <div class="software-links">
      {% if software.manual_link %}
      <a href="{{ software.manual_link }}" target="_blank" rel="noopener noreferrer" class="btn btn-danger btn-sm">Manual</a>
      {% endif %}
      {% if software.method_link %}
      <a href="{{ software.method_link }}" target="_blank" rel="noopener noreferrer" class="btn btn-info btn-sm">Methodology</a>
      {% endif %}
      {% if software.tutorial_link %}
      <a href="{{ software.tutorial_link }}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm">Tutorial</a>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>