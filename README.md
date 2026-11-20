# DeltaLabs website

A static, responsive product site built for GitHub Pages. No build tools, framework, paid services, or backend required.

## Preview locally

Run `python -m http.server 4173` from this folder and open `http://localhost:4173`.

## Update launch and contact links

Edit `config.js`:

```js
window.DELTALABS = {
  kickstarterUrl: '',
  contactEmail: '',
  updatesUrl: '',
  socials: { instagram: '', youtube: '', linkedin: '', x: '' }
};
```

Use full HTTPS URLs. Adding a Kickstarter URL updates the campaign buttons on all pages. An updates URL can connect an external mailing-list form before the campaign is live. Contact and social links appear only when configured. No email addresses are collected by this site, and there is no simulated signup form.

## Publish on GitHub Pages

Publish this folder as the repository root, push to `main`, and enable **Settings → Pages → Deploy from a branch → main / (root)**. `.nojekyll` makes this a plain static deployment. Paths are relative so it works under a project URL or a custom domain.

## Pages

- `index.html`: full-screen rotating mask, customer benefits, fabric close-up, wake light, launch.
- `sleep.html`: documentary-style wildlife page, grounded in GENED 1038 themes and original studies.
- `about.html`: the founders and development story.
- `science.html`: the longer course guide, study sources, and photo credits.

`styles.css` holds shared layouts; `experience.css` handles the new product and wildlife pages. `app.js` handles accessible feature tabs, navigation, dialogs, motion controls, and configurable links. Product footage loads as needed and pauses offscreen, resuming without resetting.

## Media

The three new product animations are rendered from the existing DeltaLabs Blender model with a woven material. The studio lights remain fixed; the mask rotates through them. The assembly animation makes a complete rotation while opening and reassembling. Each clip is a closed cycle; phase-0/phase-1 image comparisons and seam measurements are in `assets/animation-checks.json`.

The woven texture is a visualization, not a claim about a finalized textile. Videos are silent, loop continuously, and have static posters for reduced-motion visitors. Motion can be paused on the homepage and wildlife page. The original source wordmark and shorthand geometry are retained in white.

Wildlife and ocean photographs are licensed, with photographer attribution, source links, licenses, and changes documented at `science.html#media-credits` and in `assets/media-credits.json`. The WebP versions retain the source photograph's license. The photos illustrate the species and environments, not the cited experiments. Archivo is loaded from Google Fonts with local Arial/Helvetica fallbacks.

The site has no analytics, tracking cookies, payments, signup database, or data collection. Launch and social channels stay unconfigured until confirmed. The copy distinguishes planned features from validated outcomes and keeps the retail price as a target.

See `DESIGN-NOTES.md` for the reviewed startup references, product hierarchy, and animation decisions.
