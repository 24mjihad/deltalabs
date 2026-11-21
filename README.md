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

- `index.html`: full-screen product film, brief customer benefits, wake light, travel, science, launch.
- `features.html`: interactive CAD mask with automatic rotation, pointer/touch dragging, keyboard controls, selectable parts, smooth separation and reassembly, and science links.
- `sleep.html`: visual circadian and sleep guide with expandable research explanations, grounded in GENED 1038 and original studies.
- `about.html`: the founders and development story.
- `science.html`: the longer course guide, study sources, and photo credits.

`styles.css`, `v4.css`, and `v5.css` hold shared layouts; `v6.css` supplies the current refinements. `features.js` uses self-hosted Three.js and `assets/mask.glb`. Feature changes return the selected component, reseat the cover, restore curvature, then flatten and clear a lane for the next component. Controls support drag, touch, arrow keys, and Home. Motion plays automatically when visible and honors system reduced-motion preferences. There are no pause buttons.

## Media

The opening film uses the supplied DeltaLabs Blender model: a dramatic moving light, slow flattening and deployment, a low PCB component shot, material close-ups, band closure, and seated magnet glints. Cuts join different views rather than reversing assembly immediately. A dimensioned magnet macro uses 2 mm discs and 2.25 mm bores. Porous corrugated foam and woven cloth are visualizations of intended materials. The charging scene shows the flattened mask with its bands folded across it on a large pad.

The wake film completes reassembly and bending before slowly raising the diffuser light. The interactive light feature likewise stays dark through reassembly, then ramps its light over 2.4 seconds. Timing and shot details are recorded in `assets/animation-checks.json`.

`signals.js` generates six explicitly simulated brainwave, eye-movement, breathing, and movement traces with irregular noise, brief awakenings, K-complexes, and spindles. Stage bands and event labels travel with the data; excerpts use compressed demonstration timing and are not recordings. The chart and headline occupy separate layout regions.

Original wordmark and shorthand retain their white/teal brand colors and internal over/under crossings. The WebGL model uses authored assembled-to-flat morphs, corrected morph normals, simplified rough materials, and separate frame and cover geometry.

Nature, wildlife, and NASA photographs have attribution, source links, usage terms, and modifications documented in `science.html` and `assets/media-credits.json`. Photos illustrate the species and environments, not the experiments. Founder portraits come from the supplied pitch deck. Manrope is loaded from Google Fonts with local Arial/Helvetica fallbacks.

The site has no analytics, tracking cookies, payments, signup database, or data collection. Launch and social channels stay unconfigured until confirmed. The copy distinguishes planned features from validated outcomes and keeps the retail price as a target.

See `DESIGN-NOTES.md` for the reviewed startup references, product hierarchy, and animation decisions.
