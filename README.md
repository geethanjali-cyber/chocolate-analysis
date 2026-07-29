# The Bitter Truth Behind Sweet Trade
### Mapping the Global Footprint of Chocolate

An interactive trade intelligence report built as a university assignment, styled as a government-grade trade portal (in the spirit of WTO / UNCTAD / World Bank publications). Covers the full life cycle of chocolate — from cocoa farm to disposal — through trade, sustainability, environmental and value-chain lenses.

Live demo: open `index.html` directly in any modern browser. No build step, no dependencies to install.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure — all 12 sections, semantic HTML, ARIA labels |
| `styles.css` | Full stylesheet — design tokens, layout, animations, responsive rules |
| `script.js` | All interactivity and data — passport, map, ingredient cards, charts, sliders |

Everything is vanilla HTML/CSS/JS. No React, no Bootstrap, no external libraries — only Google Fonts (Fraunces, Inter, IBM Plex Mono).

---

## How to view it

**Option A — just open it**
Double-click `index.html`. Everything works, including animations and interactivity.

**Option B — run a local server** (recommended if testing on a phone over Wi-Fi, or if your browser blocks local file scripts)
```bash
cd choc-portal
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

**Option C — publish a live link**
- Drag the folder into [Netlify Drop](https://app.netlify.com/drop) for an instant public URL, or
- Push the folder to a GitHub repo and enable GitHub Pages in the repo settings.

---

## Section guide

1. **Hero** — animated particle canvas, headline, scroll cue
2. **Product Snapshot** — count-up statistic cards
3. **Chocolate Passport** — 12 clickable checkpoints (Farm → Recycling), each opens a detail file
4. **Trade Map** — schematic interactive map with hover/tap country profiles and animated shipping routes
5. **Ingredient Explorer** — 7 flip cards (Cocoa, Sugar, Milk, Palm Oil, Cocoa Butter, Vanilla, Packaging)
6. **Global Value Chain** — CSS Sankey-style bar flow from farmer to retailer
7. **Environmental Footprint Dashboard** — circular progress indicators, expandable detail
8. **Carbon Journey** — vertical timeline of emissions/water/energy per stage
9. **Who Earns What?** — animated bar chart of value distribution with tooltips
10. **Hidden Costs** — dark section on child labour, deforestation, climate change, plastic waste, farmer poverty
11. **Sustainable Future** — draggable (mouse, touch, and keyboard-accessible) comparison slider
12. **Trade Analyst Conclusion** — government-briefing-style findings, recommendations, policy suggestions, future challenges

---

## Data disclaimer

**All statistics on this site are illustrative approximations**, created for academic demonstration where exact public figures were not sourced. They are labelled "(illustrative)" in the UI itself. Before using this for a graded submission or any real publication, replace these with cited figures from sources such as ICCO, UNCTAD, FAO, or WTO trade databases.

---

## Assets still needed

The Chocolate Passport section references placeholder images for each of the 12 checkpoints. Replace these when you have real or licensed photography:

```
farm.jpg
harvest.jpg
fermentation.jpg
drying.jpg
export.jpg
processing.jpg
manufacturing.jpg
packaging.jpg
shipping.jpg
retail.jpg
consumer.jpg
recycling.jpg
```

Optional upgrades:
- A geographically accurate world map SVG (current map is a stylized schematic, not to scale)
- Real photography for the hero background and Hidden Costs section

---

## Accessibility & performance notes

- Semantic HTML with ARIA labels on interactive controls (map markers, flip cards, compare slider, nav toggle)
- Visible keyboard focus states throughout; compare slider and ingredient cards are fully keyboard-operable
- Respects `prefers-reduced-motion` — animations are disabled for users who request it
- No external JS/CSS frameworks; only Google Fonts is loaded externally
- Fully responsive from mobile through desktop

---

## Credits

Prepared as a university assignment prototype for the (fictional) Government Trade Intelligence & Sustainability Division. Not an official publication of any government or intergovernmental body.
