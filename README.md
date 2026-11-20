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

- `index.html`: product, why sleep, wildlife, FAQ, launch, contact.
- `about.html`: founders, origin, principles, development status.
- `science.html`: original summary of GENED 1038 themes, study context, public citations.
- `styles.css`: desktop/mobile design and reduced-motion behavior.
- `app.js`: mobile navigation, scroll-driven render changes, reveal effects, film dialog, links.
- `assets/`: compressed media derived from the team's 4K product animation and an SVG mark redrawn from its end slate.

## Media and copy

Product footage comes from `DeltaLabs_Winter_15_4K` in the team's Drive. The opening and product film are cropped to remove baked-in captions. The product film ends before unsupported performance statements in the source. Still renders power the scroll-driven feature tour. The opening video plays once; visitors requesting reduced motion see the still. The SVG mark is a web reconstruction of the video mark and should be replaced with a master logo if one is available.

The site references two externally hosted Google Fonts and includes local font fallbacks. It has no analytics or tracking scripts. Public research links open external sites. The product film is silent and includes a textual description; all feature information is available as text.

The current copy uses the company source of truth to resolve conflicting pitch drafts. Price is a target, capabilities are in development, and no clinical outcome, superiority, or disease-treatment claims are made. Public contact, social, campaign, and launch dates remain unset until confirmed. Detailed private source notes are intentionally excluded from this repository.
