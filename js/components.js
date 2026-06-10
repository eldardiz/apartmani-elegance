/* Apartmani Elegance — shared navbar + footer component injector.
 * Placed as a synchronous (no defer/async) script before webflow.js.
 * Uses root-relative paths so the same HTML works from / and /blog/.
 *
 * Navbar = Osmo side-navigation with wipe effect (GSAP + CustomEase),
 * adapted to the Apartmani Elegance brand (gold/dark/cream, Playfair +
 * Josefin). Top bar keeps logo + Rezervacija CTA + Menu toggle; all nav
 * links live inside the full-screen overlay. */
(function () {

  /* ----------------------------------------------------------------
     NAVBAR — Osmo side nav (data-sidenav-* attributes preserved)
     ---------------------------------------------------------------- */
  var NAVBAR = [
    '<div class="sidenav">',
    '  <header class="sidenav__header">',
    '    <a href="/index.html" class="sidenav__brand">',
    '      <img src="/images/elegance-logo-navbar.svg" loading="lazy" alt="Apartmani Elegance Tuzla logo">',
    '    </a>',
    '    <div class="sidenav__header-right">',
    '      <a href="/rezervacija.html" class="sidenav__cta">Rezervacija</a>',
    '      <button type="button" data-sidenav-toggle data-sidenav-button class="sidenav__button" aria-label="Otvori meni">',
    '        <div class="sidenav__button-text">',
    '          <p data-sidenav-label class="sidenav__button-label">Meni</p>',
    '          <p data-sidenav-label class="sidenav__button-label">Zatvori</p>',
    '        </div>',
    '        <div data-sidenav-icon class="sidenav__button-icon">',
    '          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" class="sidenav__button-icon-svg">',
    '            <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>',
    '            <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>',
    '            <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>',
    '            <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>',
    '            <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>',
    '            <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>',
    '          </svg>',
    '        </div>',
    '      </button>',
    '    </div>',
    '  </header>',
    '  <div data-sidenav-wrap data-nav-state="closed" class="sidenav__nav">',
    '    <div data-sidenav-overlay data-sidenav-toggle class="sidenav__overlay"></div>',
    '    <nav data-sidenav-menu class="sidenav__menu">',
    '      <div class="sidenav__menu-bg">',
    '        <div data-sidenav-panel class="sidenav__menu-bg-panel is--first"></div>',
    '        <div data-sidenav-panel class="sidenav__menu-bg-panel is--second"></div>',
    '        <div data-sidenav-panel class="sidenav__menu-bg-panel"></div>',
    '      </div>',
    '      <div class="sidenav__menu-inner">',
    '        <ul class="sidenav__menu-list">',
    '          <li class="sidenav__menu-list-item">',
    '            <a data-sidenav-link href="/index.html" class="sidenav__menu-link">',
    '              <p class="sidenav__menu-link-heading">Naslovna</p>',
    '              <p class="sidenav__menu-link-eyebrow">01</p>',
    '            </a>',
    '          </li>',
    '          <li class="sidenav__menu-list-item">',
    '            <a data-sidenav-link href="/index.html#ponuda-apartmana" class="sidenav__menu-link">',
    '              <p class="sidenav__menu-link-heading">Ponuda</p>',
    '              <p class="sidenav__menu-link-eyebrow">02</p>',
    '            </a>',
    '          </li>',
    '          <li class="sidenav__menu-list-item">',
    '            <a data-sidenav-link href="/index.html#recenzije" class="sidenav__menu-link">',
    '              <p class="sidenav__menu-link-heading">Recenzije</p>',
    '              <p class="sidenav__menu-link-eyebrow">03</p>',
    '            </a>',
    '          </li>',
    '          <li class="sidenav__menu-list-item">',
    '            <a data-sidenav-link href="/index.html#lokacija" class="sidenav__menu-link">',
    '              <p class="sidenav__menu-link-heading">Lokacija</p>',
    '              <p class="sidenav__menu-link-eyebrow">04</p>',
    '            </a>',
    '          </li>',
    '          <li class="sidenav__menu-list-item">',
    '            <a data-sidenav-link href="/blog/" class="sidenav__menu-link">',
    '              <p class="sidenav__menu-link-heading">Blog</p>',
    '              <p class="sidenav__menu-link-eyebrow">05</p>',
    '            </a>',
    '          </li>',
    '        </ul>',
    '        <div class="sidenav__menu-details">',
    '          <p data-sidenav-fade class="sidenav__menu-label">Pratite nas</p>',
    '          <div class="sidenav__menu-socials">',
    '            <a data-sidenav-fade href="https://www.booking.com/hotel/ba/apartmani-tuzla-tuzla.hr.html" target="_blank" rel="noopener" class="sidenav__menu-social">Booking.com</a>',
    '            <a data-sidenav-fade href="https://airbnb.com/h/elegance-apartments-in-tuzla" target="_blank" rel="noopener" class="sidenav__menu-social">Airbnb</a>',
    '            <a data-sidenav-fade href="https://www.instagram.com/apartmani.elegance" target="_blank" rel="noopener" class="sidenav__menu-social">Instagram</a>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </nav>',
    '  </div>',
    '  <a href="/rezervacija.html" class="ael-fab">Rezerviši sada</a>',
    '</div>'
  ].join('\n');

  var FOOTER = [
    '<section class="footer">',
    '  <div class="container-2">',
    '    <div class="footer-wrapper-two">',
    '      <div class="col1-footer-brand-wrapper">',
    '        <a href="/index.html" class="footer-brand w-inline-block">',
    '          <img src="/images/footer-logo.svg" loading="lazy" alt="Apartmani Elegance Tuzla">',
    '        </a>',
    '        <div class="footer-brand-text">Dobrodošli u Elegance apartmane. Počevši sa radom od 2018. godine, naša ponuda sastoji se od 4 savremeno opremljena apartmana.</div>',
    '      </div>',
    '      <div class="footer-block-two">',
    '        <div class="footer-title">Sekcije</div>',
    '        <a href="/index.html" class="footer-link-two">Naslovna</a>',
    '        <a href="/index.html#ponuda-apartmana" class="footer-link-two">Ponuda</a>',
    '        <a href="/index.html#recenzije" class="footer-link-two">Recenzije</a>',
    '        <a href="/index.html#lokacija" class="footer-link-two">Lokacija</a>',
    '        <a href="/index.html#pravilnik" class="footer-link-two">Pravilnik</a>',
    '      </div>',
    '      <div class="footer-block-two">',
    '        <div class="footer-title">Apartmani</div>',
    '        <a href="/deluxe-apartman.html" class="footer-link-two">Deluxe Apartman</a>',
    '        <a href="/trosoban-apartman.html" class="footer-link-two">Trosoban Apartman</a>',
    '        <a href="/dvosoban-apartman.html" class="footer-link-two">Dvosoban Apartman</a>',
    '        <a href="/dvosoban-apartman-sa-dnevnim-boravkom.html" class="footer-link-two">Dvosoban sa dnevnim boravkom</a>',
    '      </div>',
    '      <div class="footer-block-two">',
    '        <div class="footer-title">Vodiči i lokacije</div>',
    '        <a href="/apartmani-blizu-panonskih-jezera.html" class="footer-link-two">Apartmani blizu Panonskih jezera</a>',
    '        <a href="/blog/" class="footer-link-two">Blog</a>',
    '      </div>',
    '      <div class="footer-block-two">',
    '        <div class="footer-title">Kontakt informacije</div>',
    '        <a href="tel:+38761944061" class="footer-link-two">+387 61 944 061</a>',
    '        <a href="https://g.co/kgs/ap9i2xV" class="footer-link-two">Donji Mosnik 7, Tuzla 75000, Bosna i Hercegovina.</a>',
    '        <a href="mailto:apartmanielegance@gmail.com" class="footer-link-two">apartmanielegance@gmail.com</a>',
    '      </div>',
    '      <div class="footer-block-two">',
    '        <div class="footer-title">Posjetite nas na platformama</div>',
    '        <div class="link-blocks-footer-socials">',
    '          <a href="https://www.booking.com/hotel/ba/apartmani-tuzla-tuzla.hr.html" target="_blank" class="social-media-link w-inline-block">',
    '            <img src="/images/booking-circle-logo.svg" loading="lazy" alt="Apartmani Elegance na Booking.com">',
    '          </a>',
    '          <a href="https://airbnb.com/h/elegance-apartments-in-tuzla" target="_blank" class="social-media-link w-inline-block">',
    '            <img src="/images/airbnb-circle-logo.svg" loading="lazy" alt="Apartmani Elegance na Airbnb">',
    '          </a>',
    '          <a href="https://www.instagram.com/apartmani.elegance" target="_blank" class="social-media-link last-sml w-inline-block">',
    '            <img src="/images/ig-circle-logo.svg" loading="lazy" alt="Apartmani Elegance na Instagramu">',
    '          </a>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="footer-divider-two"></div>',
    '    <div class="footer-bottom">',
    '      <a href="https://www.linkedin.com/in/eldardizdarevic/" target="_blank" class="eldars-social w-inline-block">',
    '        <div class="footer-copyright">© 2026 Apartmani Elegance x Eldar Dizdarević</div>',
    '      </a>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ----------------------------------------------------------------
     STYLES — Osmo side nav, adapted to Apartmani Elegance brand.
     Injected into <head> so no per-page CSS link is needed.
     ---------------------------------------------------------------- */
  var STYLES = [
    '.sidenav__header{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;height:72px;padding:0 5vw;background:#070707;}',
    '.sidenav__brand{display:flex;align-items:center;text-decoration:none;}',
    '.sidenav__brand img{height:34px;width:auto;display:block;}',
    '.sidenav__header-right{display:flex;align-items:center;gap:1.75em;}',
    '.sidenav__cta{font-family:"Josefin Sans",sans-serif;font-size:14px;font-weight:600;letter-spacing:.04em;color:#070707;background:#b98b2c;padding:11px 22px;border-radius:999px;text-decoration:none;transition:background .25s;}',
    '.sidenav__cta:hover{background:#856013;}',
    '.sidenav__button{z-index:110;display:flex;align-items:center;gap:.625em;background:none;border:none;margin:-1em;padding:1em;cursor:pointer;color:#fff5ea;}',
    '.sidenav__button-text{display:flex;flex-flow:column;align-items:flex-end;height:1.4em;overflow:hidden;}',
    '.sidenav__button-label{font-family:"Josefin Sans",sans-serif;font-size:15px;font-weight:300;letter-spacing:.04em;line-height:1.4;margin:0;color:#fff5ea;}',
    '.sidenav__button-icon{display:flex;align-items:center;justify-content:center;width:1em;height:1em;color:#fff5ea;transition:transform .4s cubic-bezier(.65,.05,0,1);}',
    '.sidenav__button-icon-svg{width:100%;}',
    '.sidenav__nav{position:fixed;inset:0;z-index:90;width:100%;height:100vh;display:none;}',
    '.sidenav__overlay{position:absolute;inset:0;z-index:0;width:100%;height:100%;background:rgba(7,7,7,.45);cursor:pointer;}',
    '.sidenav__menu{position:relative;display:flex;flex-flow:column;justify-content:space-between;align-items:flex-start;width:35em;max-width:90vw;height:100%;margin-left:auto;padding:120px 0 3em;overflow:auto;}',
    '.sidenav__menu-bg{position:absolute;inset:0;z-index:0;}',
    '.sidenav__menu-bg-panel{position:absolute;inset:0;z-index:0;background:#fff5ea;border-top-left-radius:1.25em;border-bottom-left-radius:1.25em;}',
    '.sidenav__menu-bg-panel.is--first{background:#b98b2c;}',
    '.sidenav__menu-bg-panel.is--second{background:#070707;}',
    '.sidenav__menu-inner{position:relative;z-index:1;display:flex;flex-flow:column;justify-content:space-between;align-items:flex-start;gap:4em;height:100%;width:100%;overflow:auto;}',
    '.sidenav__menu-list{display:flex;flex-flow:column;width:100%;margin:0;padding:0;list-style:none;}',
    '.sidenav__menu-list-item{position:relative;height:5em;margin:0;overflow:hidden;}',
    '.sidenav__menu-link{display:flex;align-items:baseline;gap:.75em;width:100%;padding:.6em 0 .6em 1.6em;text-decoration:none;color:#1a1a1a;}',
    '.sidenav__menu-link-heading{position:relative;z-index:1;margin:0;font-family:"Playfair Display",serif;font-size:clamp(3em,9vw,4.75em);font-weight:400;line-height:.85;letter-spacing:-.01em;transition:transform .55s cubic-bezier(.65,.05,0,1);}',
    '.sidenav__menu-link:hover .sidenav__menu-link-heading{transform:translateX(.15em);}',
    '.sidenav__menu-link-eyebrow{position:relative;z-index:1;margin:0;font-family:"Josefin Sans",sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#b98b2c;}',
    '.sidenav__menu-details{display:flex;flex-flow:column;align-items:flex-start;gap:1.1em;padding-left:1.6em;}',
    '.sidenav__menu-label{margin:0;font-family:"Josefin Sans",sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#856013;}',
    '.sidenav__menu-socials{display:flex;flex-flow:row;flex-wrap:wrap;gap:1.5em;}',
    '.sidenav__menu-social{font-family:"Josefin Sans",sans-serif;font-size:16px;font-weight:300;color:#1a1a1a;text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s;}',
    '.sidenav__menu-social:hover{border-color:#b98b2c;}',
    '.ael-fab{display:flex;align-items:center;justify-content:center;position:fixed;right:24px;bottom:24px;z-index:80;font-family:"Josefin Sans",sans-serif;font-size:15px;font-weight:600;letter-spacing:.03em;color:#070707;background:#b98b2c;padding:14px 26px;border-radius:999px;text-decoration:none;box-shadow:0 6px 22px rgba(7,7,7,.3);transition:background .25s,transform .25s;}',
    '.ael-fab:hover{background:#856013;transform:translateY(-2px);}',
    '@media screen and (max-width:767px){',
    '  .sidenav__menu{width:100%;max-width:100%;}',
    '  .sidenav__menu-bg-panel{border-radius:0;}',
    '  .sidenav__menu-list-item{height:4em;}',
    '  .sidenav__cta{display:none;}',
    '  .ael-fab{right:16px;bottom:16px;padding:14px 24px;}',
    '}'
  ].join('');

  /* ----------------------------------------------------------------
     INJECT
     ---------------------------------------------------------------- */
  function inject(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  function injectStyles(css) {
    var style = document.createElement('style');
    style.setAttribute('data-ael-components', '');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = onload;
    document.head.appendChild(s);
  }

  /* ----------------------------------------------------------------
     SIDE NAV WIPE EFFECT (Osmo — unchanged logic, runs after GSAP)
     ---------------------------------------------------------------- */
  function initSideNavWipeEffect() {
    if (typeof gsap === 'undefined' || typeof CustomEase === 'undefined') return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create('main', '0.65, 0.01, 0.05, 0.99');
    gsap.defaults({ ease: 'main', duration: 0.7 });

    var navWrap = document.querySelector('[data-sidenav-wrap]');
    if (!navWrap) return;
    var overlay = navWrap.querySelector('[data-sidenav-overlay]');
    var menu = navWrap.querySelector('[data-sidenav-menu]');
    var bgPanels = navWrap.querySelectorAll('[data-sidenav-panel]');
    var menuToggles = document.querySelectorAll('[data-sidenav-toggle]');
    var menuLinks = navWrap.querySelectorAll('[data-sidenav-link]');
    var fadeTargets = navWrap.querySelectorAll('[data-sidenav-fade]');
    var menuButton = document.querySelector('[data-sidenav-button]');
    var menuButtonTexts = menuButton.querySelectorAll('[data-sidenav-label]');
    var menuButtonIcon = menuButton.querySelector('[data-sidenav-icon]');

    var tl = gsap.timeline();

    var openNav = function () {
      navWrap.setAttribute('data-nav-state', 'open');
      tl.clear()
        .set(navWrap, { display: 'block' })
        .set(menu, { xPercent: 0 }, '<')
        .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
        .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, '<')
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
        .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, '<')
        .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, '<+=0.35')
        .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, '<+=0.2');
    };

    var closeNav = function () {
      navWrap.setAttribute('data-nav-state', 'closed');
      tl.clear()
        .to(overlay, { autoAlpha: 0 })
        .to(menu, { xPercent: 120 }, '<')
        .to(menuButtonTexts, { yPercent: 0 }, '<')
        .to(menuButtonIcon, { rotate: 0 }, '<')
        .set(navWrap, { display: 'none' });
    };

    menuToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var state = navWrap.getAttribute('data-nav-state');
        if (state === 'open') { closeNav(); } else { openNav(); }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navWrap.getAttribute('data-nav-state') === 'open') {
        closeNav();
      }
    });

    // Close the menu after clicking a nav link (esp. in-page anchors)
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navWrap.getAttribute('data-nav-state') === 'open') { closeNav(); }
      });
    });
  }

  /* ---------------------------------------------------------------- */
  injectStyles(STYLES);
  inject('ael-navbar', NAVBAR);
  inject('ael-footer', FOOTER);

  loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', function () {
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js', function () {
      initSideNavWipeEffect();
    });
  });
})();
