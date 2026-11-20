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

`styles.css` and `v4.css` hold shared layouts; `v5.css` supplies the current design. `features.js` uses self-hosted Three.js and `assets/mask.glb`; there is no runtime package CDN. Product footage pauses offscreen and resumes without resetting. The explorer supports drag, touch, arrow keys/Home, and an icon pause control. Feature buttons sit below the model; explanations have their own layout column. The camera framing remains fixed while rotating, and paired components separate outward from their own side. Reduced-motion visitors start paused.

## Media

The opening film uses the existing DeltaLabs Blender model. A dim close front view with an orbiting light leads into two slow camera arcs around the mask as its layers separate and reassemble. The camera keeps the mask horizontal instead of rolling with the viewing direction. Cuts occur between different angles, including at the repeat boundary. The same disassembly shots form the shorter product-detail film. Shot details are in `assets/animation-checks.json`.

The woven texture is a visualization, not a finalized textile. Films are silent, with static posters and icon-only motion controls. Original wordmark and shorthand retain white/teal brand colors. Background removal preserves the shorthand’s internal clip paths so its over/under crossings remain correct. The WebGL model avoids the fine checker texture that caused shimmer, separates frame and cover geometry, and omits duplicate hidden face padding. Six explicitly simulated traces illustrate brainwaves, eye movements, breathing, and movement; they are not recorded measurements.

Nature, wildlife, and NASA photographs have attribution, source links, usage terms, and modifications documented in `science.html` and `assets/media-credits.json`. Photos illustrate the species and environments, not the experiments. Founder portraits come from the supplied pitch deck. Manrope is loaded from Google Fonts with local Arial/Helvetica fallbacks.

The site has no analytics, tracking cookies, payments, signup database, or data collection. Launch and social channels stay unconfigured until confirmed. The copy distinguishes planned features from validated outcomes and keeps the retail price as a target.

See `DESIGN-NOTES.md` for the reviewed startup references, product hierarchy, and animation decisions.
