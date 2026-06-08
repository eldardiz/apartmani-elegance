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

  // ---- init -------------------------------------------------------------

  function init() {
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
