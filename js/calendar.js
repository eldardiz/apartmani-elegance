/* Apartmani Elegance — homepage availability calendar
 * Depends on Flatpickr (loaded via CDN in index.html).
 * Calls /api/availability, lets the guest pick an apartment + date range,
 * shows the price estimate, and builds a prefilled WhatsApp / email CTA.
 */
(function () {
  "use strict";

  var WHATSAPP = "38761944061";
  var EMAIL = "apartmanielegance@gmail.com";

  // Single source of truth for the four apartments. price = € per night.
  var APARTMENTS = [
    { id: "deluxe", name: "Deluxe Apartman", meta: "80m² · do 6 osoba", price: 60, page: "deluxe-apartman.html" },
    { id: "trosoban", name: "Trosoban Apartman", meta: "41m² · do 4 osobe", price: 45, page: "trosoban-apartman.html" },
    { id: "dvosoban", name: "Dvosoban Apartman", meta: "41m² · do 3 osobe", price: 40, page: "dvosoban-apartman.html" },
    { id: "dvosoban-dnevni", name: "Dvosoban sa dnevnim boravkom", meta: "41m² · do 3 osobe", price: 40, page: "dvosoban-apartman-sa-dnevnim-boravkom.html" }
  ];

  var state = {
    apartmentId: "deluxe",
    availability: {}, // id -> { booked_dates: [...] }
    range: []         // [checkin Date, checkout Date]
  };

  var picker = null;
  var el = {};

  function $(id) { return document.getElementById(id); }

  function apt() {
    return APARTMENTS.filter(function (a) { return a.id === state.apartmentId; })[0];
  }

  function fmt(d) {
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    return dd + "." + mm + "." + d.getFullYear() + ".";
  }

  function nightsBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  // YYYY-MM-DD from a Date using LOCAL parts (matches the iCal date strings;
  // avoids the UTC day-shift that toISOString() introduces).
  function localISO(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  // ---- rendering --------------------------------------------------------

  function renderTabs() {
    el.tabs.innerHTML = "";
    APARTMENTS.forEach(function (a) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ael-cal__tab" + (a.id === state.apartmentId ? " is-active" : "");
      btn.setAttribute("data-id", a.id);
      btn.innerHTML = '<span class="ael-cal__tab-name">' + a.name + '</span>' +
        '<span class="ael-cal__tab-meta">' + a.meta + ' · od ' + a.price + '€/noć</span>';
      btn.addEventListener("click", function () {
        state.apartmentId = a.id;
        state.range = [];
        renderTabs();
        rebuildPicker();
        renderSummary();
      });
      el.tabs.appendChild(btn);
    });
  }

  function bookedSet() {
    var rec = state.availability[state.apartmentId];
    return (rec && rec.booked_dates) ? rec.booked_dates : [];
  }

  function rebuildPicker() {
    if (picker) picker.destroy();
    var today = new Date();
    var max = new Date(today.getFullYear(), today.getMonth() + 3, 0); // end of +2 months

    picker = window.flatpickr(el.input, {
      inline: true,
      mode: "range",
      minDate: "today",
      maxDate: max,
      showMonths: window.matchMedia("(min-width: 768px)").matches ? 2 : 1,
      disable: bookedSet(),
      locale: flatpickrBs(),
      onChange: function (selected) {
        state.range = selected;
        renderSummary();
      },
      onDayCreate: function (dObj, dStr, fp, dayElem) {
        // Flag booked days so CSS can paint them red. Use LOCAL date parts —
        // toISOString() would shift to UTC and mislabel the cell by a day.
        if (bookedSet().indexOf(localISO(dayElem.dateObj)) !== -1) {
          dayElem.classList.add("ael-booked");
        }
      }
    });
  }

  function renderSummary() {
    var a = apt();
    var r = state.range;

    if (!r || r.length < 2) {
      el.summary.classList.remove("is-ready");
      el.summaryText.innerHTML = r && r.length === 1
        ? "Odaberi i datum odjave."
        : "Odaberi datum prijave i odjave da vidiš cijenu.";
      el.total.textContent = "";
      setCta(null);
      return;
    }

    var nights = nightsBetween(r[0], r[1]);
    var total = nights * a.price;
    el.summary.classList.add("is-ready");
    el.summaryText.innerHTML = "<strong>" + a.name + "</strong><br>" +
      fmt(r[0]) + " &ndash; " + fmt(r[1]) + " · " + nights + " " + nociWord(nights);
    el.total.innerHTML = "Procjena: <strong>" + total + "€</strong> " +
      '<span class="ael-cal__total-note">(' + nights + " × " + a.price + "€, do potvrde)</span>";
    setCta({ apt: a, checkin: r[0], checkout: r[1], nights: nights });
  }

  function nociWord(n) {
    if (n === 1) return "noć";
    if (n >= 2 && n <= 4) return "noći";
    return "noći";
  }

  function setCta(sel) {
    if (!sel) {
      el.whatsapp.classList.add("is-disabled");
      el.whatsapp.removeAttribute("href");
      el.email.removeAttribute("href");
      return;
    }
    var msg = "Zdravo, zanima me rezervacija apartmana " + sel.apt.name +
      " za " + fmt(sel.checkin) + " do " + fmt(sel.checkout) +
      " (" + sel.nights + " " + nociWord(sel.nights) + ").";
    el.whatsapp.classList.remove("is-disabled");
    el.whatsapp.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);

    var subject = "Upit za rezervaciju — " + sel.apt.name;
    el.email.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(msg);
  }

  // ---- data -------------------------------------------------------------

  function loadAvailability() {
    el.root.classList.add("is-loading");
    fetch("/api/availability")
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (data) {
        state.availability = data.apartments || {};
        el.root.classList.remove("is-loading");
        rebuildPicker();
      })
      .catch(function () {
        // API down or not configured yet: calendar still works for picking
        // dates, just without booked-date blocking.
        el.root.classList.remove("is-loading");
        el.root.classList.add("ael-cal--nofeed");
        rebuildPicker();
      });
  }

  // Minimal Bosnian locale for Flatpickr (avoids loading the l10n bundle).
  function flatpickrBs() {
    return {
      weekdays: {
        shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        longhand: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"]
      },
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
        longhand: ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
      },
      firstDayOfWeek: 1,
      rangeSeparator: " do "
    };
  }

  // ---- component HTML template ------------------------------------------
  // Self-injects when a <div id="ael-cal-mount"> placeholder is found.
  // This keeps the markup in one place for all pages.

  function buildHTML() {
    return '<section id="ael-cal-section" class="all-section">' +
      '<div id="ael-cal">' +
        '<div class="ael-cal__head">' +
          '<h2 class="ael-cal__title">Provjeri dostupnost i rezerviši direktno</h2>' +
          '<p class="ael-cal__sub">Termini se ažuriraju uživo sa Booking.com i Airbnb. Odaberi apartman i datume, pa nam piši na WhatsApp ili e-mail. Bez provizije, plaćanje direktno.</p>' +
        '</div>' +
        '<div id="ael-cal-tabs" class="ael-cal__tabs"></div>' +
        '<div class="ael-cal__body">' +
          '<div class="ael-cal__cal">' +
            '<input id="ael-cal-input" type="text" aria-label="Odaberi datume boravka">' +
            '<div class="ael-cal__legend">' +
              '<span><i class="ael-cal__dot ael-cal__dot--free"></i> Slobodno</span>' +
              '<span><i class="ael-cal__dot ael-cal__dot--booked"></i> Zauzeto</span>' +
            '</div>' +
            '<p class="ael-cal__nofeed-note">Dostupnost se trenutno ne može učitati. Pošalji upit, javit ćemo ti tačne termine.</p>' +
          '</div>' +
          '<div id="ael-cal-summary" class="ael-cal__summary">' +
            '<div id="ael-cal-summary-text" class="ael-cal__summary-text">Odaberi datum prijave i odjave da vidiš cijenu.</div>' +
            '<div id="ael-cal-total" class="ael-cal__total"></div>' +
            '<div class="ael-cal__ctas">' +
              '<a id="ael-cal-whatsapp" class="ael-cal__btn ael-cal__btn--wa is-disabled" target="_blank" rel="noopener">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.124 1.523 5.862L0 24l6.335-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.668-.516-5.192-1.415l-.371-.221-3.762.879.916-3.666-.242-.385A9.942 9.942 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>' +
                'Rezerviši na WhatsApp' +
              '</a>' +
              '<a id="ael-cal-email" class="ael-cal__btn ael-cal__btn--mail">Pošalji upit e-mailom</a>' +
            '</div>' +
            '<p class="ael-cal__phone">Ili pozovi: <a href="tel:+38761944061">+387 61 944 061</a></p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  // ---- init -------------------------------------------------------------

  function init() {
    var mount = document.getElementById("ael-cal-mount");
    if (mount) {
      var dark = mount.getAttribute("data-dark") === "1";
      var html = buildHTML();
      if (dark) html = html.replace('id="ael-cal-section" class="all-section"',
        'id="ael-cal-section" class="all-section ael-cal--dark"');
      mount.outerHTML = html;
    }

    el.root = $("ael-cal");
    if (!el.root || !window.flatpickr) return;
    el.tabs = $("ael-cal-tabs");
    el.input = $("ael-cal-input");
    el.summary = $("ael-cal-summary");
    el.summaryText = $("ael-cal-summary-text");
    el.total = $("ael-cal-total");
    el.whatsapp = $("ael-cal-whatsapp");
    el.email = $("ael-cal-email");

    renderTabs();
    rebuildPicker();
    renderSummary();
    loadAvailability();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
