/* WeBuild Landing — motion & interactions */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero entrance ---------- */
  var hero = document.querySelector('.hero');
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { hero.classList.add('loaded'); });
  });
  /* fallback if load already fired */
  if (document.readyState === 'complete') hero.classList.add('loaded');
  setTimeout(function () { hero.classList.add('loaded'); }, 900);

  /* ---------- nav scrolled state ---------- */
  var nav = document.getElementById('nav');
  function onScrollNav() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- scroll reveal with stagger ---------- */
  var io = !('IntersectionObserver' in window) ? null : new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var siblings = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (c) {
        return c.classList && c.classList.contains('rv') && !c.classList.contains('in');
      }) : [el];
      var idx = Math.max(0, siblings.indexOf(el));
      setTimeout(function () { el.classList.add('in'); }, reduced ? 0 : Math.min(idx * 90, 360));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  /* sem IntersectionObserver tudo entra revelado; o resto da IIFE tem que continuar rodando */
  document.querySelectorAll('.rv').forEach(function (el) {
    if (io) { io.observe(el); } else { el.classList.add('in'); }
  });

  /* ---------- parallax glows ---------- */
  if (!reduced) {
    var pEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
    var ticking = false;
    function onScrollPar() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        pEls.forEach(function (el) {
          var f = parseFloat(el.getAttribute('data-parallax')) || 0;
          el.style.transform = 'translateY(' + (y * f) + 'px)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScrollPar, { passive: true });
  }

  /* ---------- before/after toggle ---------- */
  var toggle = document.getElementById('baToggle');
  if (toggle) {
    var thumb = document.getElementById('baThumb');
    var tag = document.getElementById('caseTag');
    var imgB = document.getElementById('imgBefore');
    var imgA = document.getElementById('imgAfter');
    var btns = [].slice.call(toggle.querySelectorAll('button'));

    function placeThumb(btn) {
      thumb.style.left = btn.offsetLeft + 'px';
      thumb.style.width = btn.offsetWidth + 'px';
    }
    function setState(state) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-state') === state;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      var onBtn = toggle.querySelector('button.on');
      placeThumb(onBtn);
      var isAfter = state === 'after';
      imgA.classList.toggle('off', !isAfter);
      imgB.classList.toggle('off', isAfter);
      tag.textContent = isAfter ? 'Depois' : 'Antes';
      tag.classList.toggle('before', !isAfter);
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { setState(b.getAttribute('data-state')); });
    });
    window.addEventListener('load', function () { placeThumb(toggle.querySelector('button.on')); });
    window.addEventListener('resize', function () { placeThumb(toggle.querySelector('button.on')); });
    setTimeout(function () { placeThumb(toggle.querySelector('button.on')); }, 300);
  }

  /* ---------- smooth anchor offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length > 1) {
        var el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          var top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
        }
      }
    });
  });
})();
