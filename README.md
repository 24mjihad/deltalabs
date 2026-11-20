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

## Files

- `index.html`: full-screen mask reveal, large product scenes, short science introduction, launch, contact.
- `about.html`: founders, origin, principles, development status.
- `science.html`: original summary of GENED 1038 themes, study context, public citations.
- `styles.css`: desktop/mobile design and reduced-motion behavior.
- `app.js`: mobile navigation, in-view video playback, content reveals, dialogs, configurable links.
- `assets/`: compressed product imagery and video, a newly rendered Blender light sweep, and original source logo vectors in monochrome.

## Media and copy

The full-screen opening was rendered from the team's existing Blender scene with a moving white spotlight and a soft final reveal. It plays once, has a replay control, and uses a still for reduced-motion visitors. Product scenes and the silent film use the revision 14 product cut. Embedded captions and unvalidated performance slogans were removed. Footage is monochrome and black edges blend into the page.

The full wordmark uses the source vector from revision 14; the shorthand uses its original resolved vector, including over-under geometry. Both use a white palette. No logo was approximated or recreated. Archivo is the only externally hosted font, with Arial and Helvetica fallbacks. The website has no analytics, tracking scripts, or data collection.

The long science summary remains on its own page. Product details open in a design dialog. Launch buttons open the configured campaign or updates page; until a URL is supplied, they open an informational dialog. Contact channels remain hidden until configured.

The current copy uses the company source of truth to resolve conflicting pitch drafts. Price is a target, capabilities are in development, and no clinical outcome, superiority, or disease-treatment claims are made. Public contact, social, campaign, and launch dates remain unset until confirmed. Detailed private source notes are intentionally excluded from this repository.
