---
title: "Search"
permalink: /search/
exclude_from_search: true
sitemap: false
---

<div class="container mt-4">
  <label for="site-search-input" class="visually-hidden">Search the site</label>
  <input type="search" id="site-search-input" class="form-control form-control-lg search-page-input"
         placeholder="Search pages, news, publications, and software&hellip;" autocomplete="off" autofocus>
  <p id="search-status" class="text-muted mt-3 mb-2"></p>
  <ul id="search-results" class="list-unstyled mt-2"></ul>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('site-search-input');
    var statusEl = document.getElementById('search-status');
    var resultsEl = document.getElementById('search-results');
    var index = null;
    var loading = null;
    var timer = null;

    function loadIndex() {
      if (!loading) {
        loading = fetch('{{ "/search.json" | relative_url }}')
          .then(function (r) { return r.json(); })
          .then(function (data) { index = data; return data; });
      }
      return loading;
    }

    function score(record, terms) {
      var title = record.title.toLowerCase();
      var text = (record.text || '').toLowerCase();
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        if (title.indexOf(t) !== -1) {
          total += 3;
        } else if (text.indexOf(t) !== -1) {
          total += 1;
        } else {
          return 0; // every term must match somewhere
        }
      }
      return total;
    }

    function snippet(record, terms) {
      var text = record.text || '';
      var lower = text.toLowerCase();
      var pos = -1;
      for (var i = 0; i < terms.length; i++) {
        pos = lower.indexOf(terms[i]);
        if (pos !== -1) break;
      }
      if (pos === -1) return text.slice(0, 140);
      var start = Math.max(0, pos - 60);
      var out = text.slice(start, start + 160);
      if (start > 0) out = '…' + out;
      if (start + 160 < text.length) out += '…';
      return out;
    }

    function render(query) {
      var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      resultsEl.textContent = '';
      if (terms.length === 0) {
        statusEl.textContent = '';
        return;
      }
      var hits = [];
      for (var i = 0; i < index.length; i++) {
        var s = score(index[i], terms);
        if (s > 0) hits.push({ record: index[i], score: s });
      }
      hits.sort(function (a, b) {
        return b.score - a.score || a.record.title.localeCompare(b.record.title);
      });
      hits = hits.slice(0, 30);

      if (hits.length === 0) {
        statusEl.textContent = 'No results for “' + query + '”.';
        return;
      }
      statusEl.textContent = hits.length + (hits.length === 1 ? ' result' : ' results') +
        ' for “' + query + '”';

      hits.forEach(function (hit) {
        var r = hit.record;
        var li = document.createElement('li');
        li.className = 'search-result mb-3';

        var badge = document.createElement('span');
        badge.className = 'badge search-result-badge me-2';
        badge.textContent = r.type;

        var link = document.createElement('a');
        link.href = r.url;
        link.className = 'search-result-title';
        link.textContent = r.title;
        if (r.url.indexOf('http') === 0) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }

        var p = document.createElement('p');
        p.className = 'mb-0 text-muted small';
        p.textContent = snippet(r, query.toLowerCase().split(/\s+/).filter(Boolean));

        li.appendChild(badge);
        li.appendChild(link);
        li.appendChild(p);
        resultsEl.appendChild(li);
      });
    }

    function run(query) {
      if (index) {
        render(query);
      } else {
        statusEl.textContent = 'Searching…';
        loadIndex().then(function () { render(query); })
          .catch(function () { statusEl.textContent = 'Sorry, search is unavailable right now.'; });
      }
    }

    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { run(input.value.trim()); }, 150);
    });

    var initial = new URLSearchParams(window.location.search).get('q');
    if (initial) {
      input.value = initial;
      run(initial.trim());
    }
  });
</script>
