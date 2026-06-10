/**
 * common.js — 高宮サンディ 共通スクリプト
 */

(function () {
  'use strict';

  const currentPage = document.body.dataset.page || 'home';

  function getRootPath() {
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      const src = s.getAttribute('src');
      if (src && src.includes('common.js')) {
        const ups = (src.match(/\.\.\//g) || []).length;
        return '../'.repeat(ups) || './';
      }
    }
    return './';
  }

  const ROOT = getRootPath();

  function loadHeader() {
    const mount = document.getElementById('shared-header');
    if (!mount) return;

    fetch(ROOT + 'partials/header.html')
      .then(r => r.text())
      .then(html => {
        html = html.replace(/href="\.\//g, `href="${ROOT}`);
        html = html.replace(/src="\.\//g, `src="${ROOT}`);
        mount.outerHTML = html;
        initNav();
        initDrawer();
        initStickyHeader();
      })
      .catch(() => {});
  }

  function initNav() {
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === currentPage) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function initDrawer() {
    const btn     = document.querySelector('.nav-toggle');
    const drawer  = document.getElementById('drawerMenu');
    const overlay = document.getElementById('drawerOverlay');
    if (!btn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', () =>
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer()
    );

    document.querySelectorAll('[data-close="drawer"]').forEach(el =>
      el.addEventListener('click', closeDrawer)
    );

    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeDrawer)
    );

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function loadBottom() {
    const mount = document.getElementById('shared-bottom');
    if (!mount) return;

    fetch(ROOT + 'partials/bottom.html')
      .then(r => r.text())
      .then(html => {
        mount.innerHTML = html;
        mount.querySelectorAll('.section').forEach(sec => sec.classList.add('is-inview'));

        if (currentPage === 'home') {
          mount.querySelectorAll('.js-hide-on-home').forEach(el => el.style.display = 'none');
        }

        const hash = location.hash;
        if (hash) {
          setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        }
      })
      .catch(() => {});
  }

  function initStickyHeader() {
    const header     = document.querySelector('.site-header');
    if (!header) return;
    const inner      = header.querySelector('.header-inner');
    const logoImg    = header.querySelector('.site-logo-img');
    const hRight     = header.querySelector('.header-right');
    if (!inner || !logoImg) return;

    const RANGE = 200;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function onScroll() {
      const isMobile = window.innerWidth <= 900;
      const t = Math.min(Math.max(window.scrollY / RANGE, 0), 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      if (isMobile) {
        inner.style.paddingTop    = '';
        inner.style.paddingBottom = '';
        inner.style.paddingLeft   = '';
        inner.style.paddingRight  = '';
        logoImg.style.height      = '40px';
      } else {
        inner.style.paddingTop    = lerp(16, 0,  e) + 'px';
        inner.style.paddingBottom = lerp(16, 0,  e) + 'px';
        inner.style.paddingLeft   = lerp(32, 24, e) + 'px';
        inner.style.paddingRight  = lerp(32, 24, e) + 'px';
        logoImg.style.height      = lerp(80, 56, e) + 'px';
      }

      if (hRight) hRight.style.gap = isMobile ? '' : lerp(16, 0, e) + 'px';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function initPageTop() {
    const pageTop = document.querySelector('.page-top');
    if (!pageTop) return;

    function toggle() {
      const y = window.scrollY || document.documentElement.scrollTop;
      pageTop.classList.toggle('is-show', y > 480);
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -8% 0px'
    });

    sections.forEach(sec => io.observe(sec));
  }

  function initGA4Tracking() {
    // 高宮サンディは電話・予約なしのためトラッキングイベントなし
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadBottom();
    initPageTop();
    initScrollReveal();
    initGA4Tracking();
  });

})();
