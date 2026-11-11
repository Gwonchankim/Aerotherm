/* AeroTherm homepage behavior: propagation players, mobile menu, section highlight, landing on #links. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* Interface text set from this file, in the page's language (<html lang>). */
  var LANG = /^ko\b/i.test(root.lang || '') ? 'ko' : 'en';
  var TEXT = {
    en: {
      // [first frame after the stage, title, what happens]
      stages: [
        [13, 'Normal operation', 'All five cells are cool.'],
        [21, 'Fault', 'The middle cell heats up.'],
        [27, 'Venting', 'Heat and infrared rays leave the failing cell.'],
        [35, 'Impact', 'Heat reaches the gaps on both sides.'],
        [47, 'Spread or hold', 'Neighbors heat up, or stay cool behind the boards.'],
        [61, 'Outcome', 'Full-module runaway, or one cell cooling to an ember.'],
        [66, 'Reset', 'The sequence returns to the start.']
      ],
      stageMark: '.',
      heroPause: 'Pause animation', heroPlay: 'Play animation',
      pause: 'Pause', play: 'Play',
      menuOpen: 'Open menu', menuClose: 'Close menu'
    },
    ko: {
      stages: [
        [13, '정상 작동', '다섯 개 셀이 모두 정상 온도입니다.'],
        [21, '고장 발생', '가운데 셀이 가열됩니다.'],
        [27, '벤팅', '고장 난 셀에서 열과 적외선이 방출됩니다.'],
        [35, '도달', '열이 양쪽 셀 사이 틈에 도달합니다.'],
        [47, '확산 또는 차단', '이웃 셀이 가열되거나, 보드 뒤에서 온도를 유지합니다.'],
        [61, '결과', '모듈 전체가 열폭주에 이르거나, 셀 하나만 식어 갑니다.'],
        [66, '처음으로', '처음 장면으로 돌아갑니다.']
      ],
      stageMark: ':',
      heroPause: '애니메이션 일시정지', heroPlay: '애니메이션 재생',
      pause: '일시정지', play: '재생',
      menuOpen: '메뉴 열기', menuClose: '메뉴 닫기'
    }
  }[LANG];

  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(motionQuery && motionQuery.matches);
  root.classList.toggle('reduced-motion', reduced);

  /* ------------------------------------------------------------------
   * Propagation animation
   * A "group" is one clock and the canvases it drives: the hero has its own,
   * and the two comparison canvases share one, so they are always on the same frame.
   * ------------------------------------------------------------------ */
  var AP = window.AerothermPropagation;
  var VIEW = { x: 140, y: 0, w: 880, h: 675 };   // crop of the 1200 x 675 scene around the module
  var groups = [];
  var rafId = 0, lastTick = 0;

  var STAGES = TEXT.stages;
  function stageAt(frame) {
    for (var i = 0; i < STAGES.length; i++) if (frame < STAGES[i][0]) return STAGES[i];
    return STAGES[STAGES.length - 1];
  }

  function makeGroup(el, opts) {
    var group = {
      el: el,
      t: 0,                         // elapsed ms on this group's clock
      playing: !!opts.autoplay,
      visible: false,
      fixedFrame: opts.fixedFrame,  // always a still (the product figure)
      players: [],
      onFrame: opts.onFrame || null,
      onState: opts.onState || null
    };
    $$('.prop', el).forEach(function (wrap) {
      var canvas = $('canvas', wrap);
      if (!canvas || !canvas.getContext) return;
      group.players.push({
        wrap: wrap,
        canvas: canvas,
        variant: wrap.getAttribute('data-variant') === 'without' ? 'without' : 'with',
        still: parseFloat(wrap.getAttribute('data-still')) || 32,
        renderer: AP.createRenderer(canvas, { view: VIEW })
      });
    });
    group.frame = function () { return AP.frameAt(group.t); };
    group.render = function () {
      var f = group.frame();
      group.players.forEach(function (p) {
        if (!p.renderer.resize()) return;
        // Reduced motion and fixed stills: each canvas shows its own still frame.
        var frame = group.fixedFrame ? group.fixedFrame : reduced ? p.still : f;
        p.renderer.draw(p.variant, frame);
        p.wrap.classList.add('is-ready');
      });
      if (group.onFrame) group.onFrame(f);
    };
    group.setPlaying = function (on) {
      group.playing = on;
      if (group.onState) group.onState(on);
      kick();
    };
    groups.push(group);

    // Pause while off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        group.visible = entries[entries.length - 1].isIntersecting;
        if (group.visible) { group.render(); kick(); }
      }, { rootMargin: '80px 0px' }).observe(el);
    } else {
      group.visible = true;
    }
    // Keep the bitmap matched to the container.
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { group.render(); });
      group.players.forEach(function (p) { ro.observe(p.canvas); });
    } else {
      window.addEventListener('resize', group.render);
    }
    group.render();
    return group;
  }

  function isRunning(g) { return g.playing && g.visible && !reduced && !g.fixedFrame; }

  function tick(now) {
    var dt = Math.min(now - lastTick, 100);   // a background tab or a long task never skips ahead
    lastTick = now;
    var active = false;
    groups.forEach(function (g) {
      if (!isRunning(g)) return;
      g.t = (g.t + dt) % AP.CYCLE_MS;
      g.render();
      active = true;
    });
    rafId = active ? window.requestAnimationFrame(tick) : 0;
  }
  function kick() {
    if (rafId || doc.hidden || !groups.some(isRunning)) return;
    lastTick = window.performance.now();
    rafId = window.requestAnimationFrame(tick);
  }

  function initPropagation() {
    if (!AP || !window.requestAnimationFrame) return;

    // Hero: with Aerotherm, looping, with its own pause button.
    var heroEl = $('[data-prop-hero]');
    if (heroEl) {
      var heroBtn = $('[data-toggle]', heroEl), heroLabel = heroBtn && $('[data-toggle-label]', heroBtn);
      var hero = makeGroup(heroEl, {
        autoplay: true,
        onState: function (on) {
          heroEl.classList.toggle('is-paused', !on);
          if (heroLabel) heroLabel.textContent = on ? TEXT.heroPause : TEXT.heroPlay;
        }
      });
      if (heroBtn) heroBtn.addEventListener('click', function () { hero.setPlaying(!hero.playing); });
    }

    // Comparison: two canvases, one clock, play/pause and a scrubber.
    var cmpEl = $('[data-compare]');
    if (cmpEl) {
      var controls = $('.compare__controls', cmpEl);
      var btn = $('[data-toggle]', cmpEl), label = btn && $('[data-toggle-label]', btn);
      var scrub = $('[data-scrub]', cmpEl), stageOut = $('[data-stage]', cmpEl);
      var scrubbing = false, lastStage = null;
      var cmp = makeGroup(cmpEl, {
        autoplay: true,
        onFrame: function (f) {
          if (!scrub) return;
          var maxFrame = parseFloat(scrub.max) || AP.LAST_FRAME;   // the scrubber ends on the end state
          var shown = Math.min(f, maxFrame);
          if (!scrubbing) scrub.value = shown;
          scrub.style.setProperty('--fill', ((shown - 1) / (maxFrame - 1) * 100).toFixed(2) + '%');
          var stage = stageAt(f);
          if (stage !== lastStage) {
            lastStage = stage;
            scrub.setAttribute('aria-valuetext', stage[1] + ': ' + stage[2]);
            if (stageOut) stageOut.innerHTML = '<b>' + stage[1] + TEXT.stageMark + '</b> ' + stage[2];
          }
        },
        onState: function (on) {
          if (controls) controls.classList.toggle('is-paused', !on);
          if (label) label.textContent = on ? TEXT.pause : TEXT.play;
        }
      });
      if (btn) btn.addEventListener('click', function () { cmp.setPlaying(!cmp.playing); });
      if (scrub) {
        // Scrubbing pauses playback and moves both canvases to the chosen frame.
        scrub.addEventListener('input', function () {
          scrubbing = true;
          if (cmp.playing) cmp.setPlaying(false);
          cmp.t = AP.timeAt(parseFloat(scrub.value));
          cmp.render();
          scrubbing = false;
        });
      }
      // Small screens show one canvas at a time; the switch flips between them on the same frame.
      var views = $$('.compare__switch [data-show]', cmpEl);
      if (views.length) {
        cmpEl.setAttribute('data-view', 'with');
        views.forEach(function (b) {
          b.addEventListener('click', function () {
            cmpEl.setAttribute('data-view', b.getAttribute('data-show'));
            views.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
            cmp.render();
          });
        });
      }
      cmp.render();
    }

    // Product figure: a still of the cool module with its boards.
    $$('[data-prop-still]').forEach(function (el) {
      makeGroup(el, { fixedFrame: parseFloat(el.getAttribute('data-prop-still')) || 8 });
    });

    doc.addEventListener('visibilitychange', kick);
    if (motionQuery) {
      var onMotionChange = function (e) {
        reduced = e.matches;
        root.classList.toggle('reduced-motion', reduced);
        groups.forEach(function (g) { g.render(); });
        kick();
      };
      if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
      else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);
    }
    kick();
  }

  /* ------------------------------------------------------------------
   * Mobile menu
   * ------------------------------------------------------------------ */
  function initNav() {
    var toggle = $('.nav-toggle'), nav = $('#site-nav');
    if (!toggle || !nav) return;
    var label = $('.visually-hidden', toggle);
    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? TEXT.menuClose : TEXT.menuOpen;
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) setOpen(false);
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 1200px)');
      var onWide = function (e) { if (e.matches) setOpen(false); };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* Marks the nav link of the section currently in view. */
  function initSectionHighlight() {
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('#site-nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          if (id === entry.target.id) links[id].setAttribute('aria-current', 'true');
          else links[id].removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  }


  /* ------------------------------------------------------------------
   * Opening a link such as #technology: the browser scrolls before the web fonts
   * arrive, and the reflow can leave the heading under the sticky header.
   * Once fonts and the page have loaded, settle on the target again (instantly),
   * unless the visitor has already scrolled.
   * ------------------------------------------------------------------ */
  function settleHashTarget() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && doc.getElementById(id);
    if (!target) return;
    var moved = false;
    ['wheel', 'touchstart', 'keydown'].forEach(function (type) {
      window.addEventListener(type, function () { moved = true; }, { once: true, passive: true });
    });
    var go = function () {
      if (moved) return;
      var prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = prev;
    };
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { window.requestAnimationFrame(go); });
    window.addEventListener('load', function () { window.requestAnimationFrame(go); }, { once: true });
  }

  function init() {
    settleHashTarget();
    initNav();
    initSectionHighlight();
    initPropagation();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
