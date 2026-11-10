/* Aerotherm homepage behavior: propagation players, mobile menu, section highlight, contact form. */
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
        [66, 'Reset', 'The sequence fades out and starts again.']
      ],
      stageMark: '.',
      heroPause: 'Pause animation', heroPlay: 'Play animation',
      pause: 'Pause', play: 'Play',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      nameEmpty: 'Enter your name.',
      emailEmpty: 'Enter your email address.',
      emailInvalid: 'Enter a valid email address, such as name@company.com.',
      inquiryEmpty: 'Select an inquiry type.',
      messageEmpty: 'Tell us about your application.',
      messageShort: 'Add a little more detail (at least 10 characters).',
      fixFields: function (n) { return n === 1 ? 'Please correct the highlighted field.' : 'Please correct the ' + n + ' highlighted fields.'; },
      checking: 'Checking your entries…',
      valid: 'Your entries are valid. This form is not connected to a server yet, so nothing was sent.'
    },
    ko: {
      stages: [
        [13, '정상 작동', '다섯 개 셀이 모두 정상 온도입니다.'],
        [21, '고장 발생', '가운데 셀이 가열됩니다.'],
        [27, '벤팅', '고장 난 셀에서 열과 적외선이 방출됩니다.'],
        [35, '도달', '열이 양쪽 셀 사이 틈에 도달합니다.'],
        [47, '확산 또는 차단', '이웃 셀이 가열되거나, 보드 뒤에서 온도를 유지합니다.'],
        [61, '결과', '모듈 전체가 열폭주에 이르거나, 셀 하나만 식어 갑니다.'],
        [66, '처음으로', '장면이 사라진 뒤 처음부터 다시 시작합니다.']
      ],
      stageMark: ':',
      heroPause: '애니메이션 일시정지', heroPlay: '애니메이션 재생',
      pause: '일시정지', play: '재생',
      menuOpen: '메뉴 열기', menuClose: '메뉴 닫기',
      nameEmpty: '이름을 입력해 주세요.',
      emailEmpty: '이메일 주소를 입력해 주세요.',
      emailInvalid: '올바른 이메일 주소를 입력해 주세요. 예: name@company.com',
      inquiryEmpty: '문의 유형을 선택해 주세요.',
      messageEmpty: '적용 분야에 대해 알려 주세요.',
      messageShort: '조금 더 자세히 적어 주세요(10자 이상).',
      fixFields: function (n) { return '표시된 항목 ' + n + '개를 수정해 주세요.'; },
      checking: '입력 내용을 확인하는 중…',
      valid: '입력 내용에 문제가 없습니다. 이 양식은 아직 서버에 연결되어 있지 않아 아무것도 전송되지 않았습니다.'
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
          var shown = Math.min(f, AP.LAST_FRAME);
          if (!scrubbing) scrub.value = shown;
          scrub.style.setProperty('--fill', ((shown - 1) / (AP.LAST_FRAME - 1) * 100).toFixed(2) + '%');
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
   * Contact form: client-side validation only. Nothing is sent anywhere.
   * ------------------------------------------------------------------ */
  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var status = $('#form-status'), submit = $('[type="submit"]', form);
    form.setAttribute('novalidate', '');   // use the messages below instead of the browser's bubbles
    if (submit) submit.disabled = false;   // disabled in the markup so it cannot post without JavaScript

    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var rules = {
      name: function (v) { return v ? '' : TEXT.nameEmpty; },
      email: function (v) { return !v ? TEXT.emailEmpty : EMAIL.test(v) ? '' : TEXT.emailInvalid; },
      inquiry: function (v) { return v ? '' : TEXT.inquiryEmpty; },
      message: function (v) { return !v ? TEXT.messageEmpty : v.length < 10 ? TEXT.messageShort : ''; }
    };

    function check(name) {
      var field = form.elements[name], err = doc.getElementById('error-' + name);
      var message = rules[name](field.value.trim());
      if (message) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
      if (err) err.textContent = message;
      return !message;
    }

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      field.addEventListener('blur', function () { if (field.value.trim() || field.hasAttribute('aria-invalid')) check(name); });
      field.addEventListener('input', function () { if (field.hasAttribute('aria-invalid')) check(name); });
      field.addEventListener('change', function () { if (field.hasAttribute('aria-invalid')) check(name); });
    });

    var pending = 0;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.clearTimeout(pending);
      var invalid = Object.keys(rules).filter(function (name) { return !check(name); });
      if (invalid.length) {
        status.className = 'form__status is-error';
        status.textContent = TEXT.fixFields(invalid.length);
        form.elements[invalid[0]].focus();
        return;
      }
      var done = function () {
        status.className = 'form__status is-done';
        status.textContent = TEXT.valid;
      };
      if (reduced) { done(); return; }
      // The design's loading state, shown briefly while the entries are checked.
      status.className = 'form__status';
      status.innerHTML = '<span class="loader" aria-hidden="true"><span class="loader__track"></span><span class="loader__fill"></span><span class="loader__barrier"></span></span>' + TEXT.checking;
      pending = window.setTimeout(done, 1000);
    });
  }

  function init() {
    initNav();
    initSectionHighlight();
    initForm();
    initPropagation();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
