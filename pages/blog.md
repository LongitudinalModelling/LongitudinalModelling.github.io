---
title: "News and Updates"
layout: default
background: /assets/images/backgrounds/news_page.jpg
permalink: /blog/
---

<div class="container mt-5">

  <div id="tag-filter-notice" class="alert text-center" hidden></div>

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

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var tag = new URLSearchParams(window.location.search).get('tag');
    if (!tag) return;
    var wanted = tag.trim().toLowerCase();
    var matches = 0;
    document.querySelectorAll('.card[data-tags]').forEach(function (card) {
      var tags = card.getAttribute('data-tags').toLowerCase().split('|').map(function (t) { return t.trim(); });
      var column = card.closest('.col-md-6') || card;
      if (tags.indexOf(wanted) === -1) {
        column.hidden = true;
      } else {
        matches++;
      }
    });
    var notice = document.getElementById('tag-filter-notice');
    if (matches > 0) {
      notice.innerHTML = 'Showing posts tagged “<strong></strong>” &mdash; <a href="{{ page.permalink | relative_url }}">show all posts</a>';
    } else {
      notice.innerHTML = 'No posts tagged “<strong></strong>” &mdash; <a href="{{ page.permalink | relative_url }}">show all posts</a>';
    }
    notice.querySelector('strong').textContent = tag;
    notice.hidden = false;
  });
</script>