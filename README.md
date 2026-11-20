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

`styles.css` holds shared layouts; `v4.css` handles the product, guide, team, and explorer. `features.js` uses self-hosted Three.js and `assets/mask.glb`; there is no runtime package CDN. `app.js` handles navigation, dialogs, scroll reveals, motion controls, and configurable links. Product footage pauses offscreen and resumes without resetting. The explorer respects reduced motion and supports arrow keys/Home as well as dragging. Swipe directly on the model to rotate; scroll beside it or through the text to move down the page.

## Media

The opening film is rendered from the existing DeltaLabs Blender model with a woven material. The camera and mask remain stationary within each shot while an area light physically orbits the curved surface. The film cuts between a close front view, textile macro, and curved-edge detail. Its wrap is an intentional cut between different framings. Shot and cycle measurements are in `assets/animation-checks.json`. The wake-light image is a new native render of the assembled mask on a dark bedside surface.

The woven texture is a visualization, not a finalized textile. The film is silent and has a static poster for reduced-motion visitors. Motion can be paused on the homepage. Original rounded wordmark and shorthand artwork retain their white and teal brand colors; interface text is white.

Nature, wildlife, and NASA photographs have attribution, source links, usage terms, and modifications documented in `science.html` and `assets/media-credits.json`. Photos illustrate the species and environments, not the experiments. Founder portraits come from the supplied pitch deck. Manrope is loaded from Google Fonts with local Arial/Helvetica fallbacks.

The site has no analytics, tracking cookies, payments, signup database, or data collection. Launch and social channels stay unconfigured until confirmed. The copy distinguishes planned features from validated outcomes and keeps the retail price as a target.

See `DESIGN-NOTES.md` for the reviewed startup references, product hierarchy, and animation decisions.
