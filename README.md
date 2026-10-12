# renner-electric – Website-Relaunch

Moderner Neuaufbau von [renner-electric.de](https://www.renner-electric.de/) (Elektrogroßhandel, Steuerungsbau & Automatisierung, Neu-Ulm).

Reines HTML/CSS/JavaScript ohne Build-Schritt und ohne Abhängigkeiten – läuft auf jedem Webspace (Strato, IONOS, All-Inkl …) oder kostenlos auf GitHub Pages / Netlify / Cloudflare Pages.

## Lokal ansehen

```bash
npx serve .
```

oder einfach `index.html` im Browser öffnen.

## Struktur

```
index.html          One-Pager mit allen Inhalten
impressum.html      Impressum
datenschutz.html    Datenschutzerklärung (Originaltext – muss angepasst werden, s. u.)
agb.html            AGB (ZVEI „Grüne Lieferbedingungen“, Originaltext)
assets/css/style.css
assets/js/main.js
assets/fonts/       IBM Plex Sans/Mono (selbst gehostet, SIL Open Font License)
assets/img/         Logo, Fotos, Referenzbilder (von der bestehenden Seite übernommen)
```

## Was neu ist

- **Sachliches, responsives Design** im bestehenden CI (Navy aus dem Logo, Blau vom Firmenschild), selbst gehostete Schrift IBM Plex, Kontaktdaten direkt im Kopf, Schnellzugriff „Anrufen / Anfrage“ auf dem Handy
- **One-Pager** statt 20 verschachtelter Unterseiten, Inhalte der Unterseiten als Tabs
- **Live-Öffnungsstatus** („Jetzt geöffnet · bis 17:00 Uhr“, Berliner Zeit)
- **Durchsuchbares Sortiment** (22 Produktgruppen) und alle Inhalte der alten Unterseiten (inkl. Fußschalter-Ausführungen, Kataloge, Lieferanten)
- **Referenz-Galerie** mit Lightbox (Tastatur-bedienbar)
- **Kontakt- & Bestellformular** in einem, mit beliebig vielen Artikelpositionen
- **DSGVO-freundlicher**: kein Google Analytics, keine Google Fonts, Karte (OpenStreetMap) lädt erst nach Klick → kein Cookie-Banner nötig
- **SEO**: strukturierte Daten (LocalBusiness inkl. Öffnungszeiten), Open-Graph-Tags, saubere Überschriften
- **Barrierefreiheit**: Skip-Link, ARIA-Tabs, Fokus-Styles, `prefers-reduced-motion`

## TODO vor dem Go-live

- [ ] **Formular-Versand**: Aktuell öffnet das Formular das E-Mail-Programm (mailto). Für echten Versand in `assets/js/main.js` die Konstante `FORM_ENDPOINT` setzen (z. B. [Web3Forms](https://web3forms.com), [Formspree](https://formspree.io) oder ein PHP-Skript beim Hoster).
- [ ] **Datenschutzerklärung anpassen**: Abschnitte zu Google Analytics, Google Maps und Usercentrics entfernen, OpenStreetMap (Karte per Klick) und ggf. Formular-Dienst ergänzen.
- [ ] **Stellenanzeige**: PDF liegt noch beim alten CMS (onlineoff.ch) – lokal unter `assets/` ablegen und Link anpassen.
- [ ] **BERNSTEIN-Kataloge**: Die 17 Katalog-PDFs sind von 2016 und liegen ebenfalls bei onlineoff.ch. Entweder auf den aktuellen Download-Bereich von bernstein.eu verlinken oder aktuelle PDFs ins Repo legen – sonst sind die Links nach Kündigung der alten Betreuung tot.
- [ ] Inhalte mit der Firma abstimmen (Kennzahlen wie „100.000+ Artikel“, Texte).
- [ ] Bilder in höherer Auflösung (die alten sind nur 850 × 500 px) und als WebP.
- [ ] Domain umziehen bzw. DNS auf neues Hosting zeigen lassen, alte URLs per Redirect auf die neuen Anker umleiten.
