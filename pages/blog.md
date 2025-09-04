---
title: "News and Updates"
layout: default
background: /assets/images/backgrounds/news_page.jpg
permalink: /blog/
---

<div class="container mt-5">

  {% if site.posts.size > 0 %}
    <div class="row cards mt-4">
      {% for item in site.posts %}
        <div class="col-md-6 mb-4">
          {% include card.html %}
        </div>
      {% endfor %}
    </div>
  {% else %}
    <p>No news or updates yet. Please check back soon!</p>
  {% endif %}
</div>