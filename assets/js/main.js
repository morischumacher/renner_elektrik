/* renner-electric – Interaktionen (ohne Abhängigkeiten) */

// Optional: Endpoint eines Formular-Dienstes (z. B. Formspree, Web3Forms oder eigenes PHP-Skript).
// Leer lassen = Formular öffnet das E-Mail-Programm mit vorausgefüllter Nachricht.
const FORM_ENDPOINT = "";
const MAIL_TO = "zentrale@renner-electric.de";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Header: Schatten beim Scrollen ---------- */
const header = $("[data-header]");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile-Menü ---------- */
const toggle = $("[data-menu-toggle]");
const setMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
};
toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ---------- Aktiven Menüpunkt markieren ---------- */
const navLinks = $$("#nav a");
const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => spy.observe(s));

/* ---------- Tabs (barrierefrei, mit Pfeiltasten) ---------- */
function activateTab(tabs, btn, focus = false) {
  const buttons = $$('[role="tab"]', tabs).filter((b) => b.closest("[data-tabs]") === tabs);
  buttons.forEach((b) => {
    const selected = b === btn;
    b.setAttribute("aria-selected", String(selected));
    b.tabIndex = selected ? 0 : -1;
    document.getElementById(b.getAttribute("aria-controls")).hidden = !selected;
  });
  if (focus) btn.focus();
}
$$("[data-tabs]").forEach((tabs) => {
  const buttons = $$('[role="tab"]', tabs);
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => activateTab(tabs, btn));
    btn.addEventListener("keydown", (e) => {
      const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      activateTab(tabs, buttons[(i + dir + buttons.length) % buttons.length], true);
    });
  });
});
// Links wie „Zum Bestellformular“ öffnen direkt den passenden Formular-Tab
$$("[data-open-tab]").forEach((link) => {
  link.addEventListener("click", () => {
    const btn = $(`[data-tab-key="${link.dataset.openTab}"]`);
    if (btn) activateTab(btn.closest("[data-tabs]"), btn);
  });
});

/* ---------- Sortiment-Suche ---------- */
const search = $("[data-catalog-search]");
const products = $$("[data-catalog] .product");
const countEl = $("[data-catalog-count]");
const emptyEl = $("[data-catalog-empty]");
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const updateCatalog = () => {
  const q = normalize(search.value.trim());
  let visible = 0;
  products.forEach((p) => {
    const match = !q || normalize(p.textContent).includes(q);
    p.hidden = !match;
    if (match) visible++;
  });
  countEl.textContent = q ? `${visible} von ${products.length} Produktgruppen` : `${products.length} Produktgruppen`;
  emptyEl.classList.toggle("is-visible", visible === 0);
};
search.addEventListener("input", updateCatalog);
updateCatalog();

/* ---------- Lightbox für Referenzen ---------- */
const lightbox = $("[data-lightbox]");
const lbImg = $("[data-lightbox-img]");
const lbCount = $("[data-lightbox-count]");
const galleryItems = $$("[data-gallery] .gallery__item");
let current = 0;
const showImage = (i) => {
  current = (i + galleryItems.length) % galleryItems.length;
  const item = galleryItems[current];
  lbImg.src = item.dataset.src;
  lbImg.alt = $("img", item).alt;
  lbCount.textContent = `${current + 1} / ${galleryItems.length}`;
};
galleryItems.forEach((item, i) => item.addEventListener("click", () => { showImage(i); lightbox.showModal(); }));
$("[data-lightbox-prev]").addEventListener("click", () => showImage(current - 1));
$("[data-lightbox-next]").addEventListener("click", () => showImage(current + 1));
$("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => e.target === lightbox && lightbox.close());
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") showImage(current + 1);
  if (e.key === "ArrowLeft") showImage(current - 1);
});

/* ---------- Öffnungszeiten: „Jetzt geöffnet“ (Zeitzone Berlin) ---------- */
const HOURS = {
  1: [["07:00", "12:30"], ["13:00", "17:00"]],
  2: [["07:00", "12:30"], ["13:00", "17:00"]],
  3: [["07:00", "12:30"], ["13:00", "17:00"]],
  4: [["07:00", "12:30"], ["13:00", "17:00"]],
  5: [["07:00", "12:30"], ["13:00", "15:00"]],
};
const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
function berlinNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, time: `${get("hour")}:${get("minute")}` };
}
function updateOpenStatus() {
  const { day, time } = berlinNow();
  const slots = HOURS[day] || [];
  const open = slots.find(([from, to]) => time >= from && time < to);
  let text;
  if (open) {
    text = `Jetzt geöffnet · bis ${open[1]} Uhr`;
  } else {
    const later = slots.find(([from]) => time < from);
    if (later) text = `Geschlossen · öffnet um ${later[0]} Uhr`;
    else {
      let d = day;
      do { d = (d + 1) % 7; } while (!HOURS[d]);
      const label = d === (day + 1) % 7 ? "morgen" : DAY_NAMES[d];
      text = `Geschlossen · öffnet ${label} um ${HOURS[d][0][0]} Uhr`;
    }
  }
  $("[data-open-status]")?.classList.toggle("is-open", Boolean(open));
  const t = $("[data-open-text]"); if (t) t.textContent = text;
  $$("[data-hours] tr").forEach((tr) => tr.classList.toggle("is-today", tr.dataset.days.split(",").includes(String(day))));
}
updateOpenStatus();
setInterval(updateOpenStatus, 60_000);

/* ---------- Karte erst nach Klick laden (DSGVO) ---------- */
$("[data-map-load]")?.addEventListener("click", () => {
  const map = $("[data-map]");
  map.innerHTML = '<iframe title="Karte: renner-electric gmbh, Dornierstraße 8, Neu-Ulm" loading="lazy" ' +
    'src="https://www.openstreetmap.org/export/embed.html?bbox=10.0149%2C48.3796%2C10.0349%2C48.3896&amp;layer=mapnik&amp;marker=48.3846%2C10.0249"></iframe>';
});

/* ---------- Bestellformular: Positionen hinzufügen/entfernen ---------- */
const rows = $("[data-order-rows]");
const updateRemoveButtons = () => {
  const all = $$(".order-row", rows);
  all.forEach((r) => ($("[data-remove-row]", r).disabled = all.length === 1));
};
$("[data-add-row]").addEventListener("click", () => {
  const row = rows.firstElementChild.cloneNode(true);
  $$("input", row).forEach((input) => (input.value = input.type === "number" ? "1" : ""));
  rows.appendChild(row);
  $("input", row).focus();
  updateRemoveButtons();
});
rows.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-row]");
  if (!btn || $$(".order-row", rows).length === 1) return;
  btn.closest(".order-row").remove();
  updateRemoveButtons();
});
updateRemoveButtons();

/* ---------- Formulare absenden ---------- */
function collect(form) {
  const lines = [];
  if (form.dataset.form === "bestellung") {
    lines.push("Bestellte Artikel:");
    $$(".order-row", form).forEach((row, i) => {
      const nr = $('[name="artikel"]', row).value.trim();
      const qty = $('[name="anzahl"]', row).value || "1";
      if (nr) lines.push(`  ${i + 1}. ${qty} × ${nr}`);
    });
    lines.push("");
  }
  $$("input[name], textarea[name], select[name]", form)
    .filter((el) => !["artikel", "anzahl"].includes(el.name) && el.value.trim())
    .forEach((el) => lines.push(`${el.name}: ${el.value.trim()}`));
  return lines.join("\n");
}

$$("[data-form]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("[data-form-status]", form);
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const isOrder = form.dataset.form === "bestellung";
    const subject = isOrder ? "Bestellung über die Website" : `Anfrage über die Website: ${form.elements["Thema"]?.value ?? ""}`;
    const body = collect(form);

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ subject, message: body, email: form.elements["E-Mail"].value }),
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        status.textContent = isOrder ? "Vielen Dank! Ihre Bestellung ist bei uns eingegangen – wir melden uns umgehend." : "Vielen Dank für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.";
      } catch {
        status.textContent = `Das hat leider nicht geklappt. Bitte schreiben Sie uns direkt an ${MAIL_TO} oder rufen Sie an.`;
      }
    } else {
      window.location.href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Ihr E-Mail-Programm wurde mit der vorbereiteten Nachricht geöffnet – bitte dort nur noch auf „Senden“ klicken.";
    }
    status.classList.add("is-visible");
  });
});

/* ---------- Jahr im Footer ---------- */
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
