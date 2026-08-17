(function () {
  'use strict';

  var SELECTORS = '.card-deck .card, .cards .card, .training-card, .software-item, .content .card.shadow-sm';
  var STAGGER_MS = 90;
  var MAX_DELAY_MS = 270;

  function init() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var viewportBottom = window.innerHeight;
    var batchStart = null;
    var batchIndex = 0;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(SELECTORS).forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < viewportBottom) return;

      if (batchStart === null || Math.abs(top - batchStart) > 40) {
        batchStart = top;
        batchIndex = 0;
      } else {
        batchIndex++;
      }
      el.style.transitionDelay = Math.min(batchIndex * STAGGER_MS, MAX_DELAY_MS) + 'ms';

      el.classList.add('sr-hidden');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
